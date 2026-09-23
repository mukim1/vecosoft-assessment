export type EvictionReason = "capacity" | "expired";

export interface LRUCacheOptions<K, V> {
  /** Default time-to-live (ms) applied to every entry. Omit for entries that never expire. */
  ttlMs?: number;
  /** Called whenever the cache removes an entry on its own (LRU eviction or expiry). */
  onEvict?: (key: K, value: V, reason: EvictionReason) => void;
  /** Clock source in ms. Injectable so TTL behaviour can be tested deterministically. */
  now?: () => number;
}

/** A node of the doubly linked list that tracks recency. */
interface Entry<K, V> {
  key: K;
  value: V;
  /** Absolute timestamp (ms) after which the entry is stale; Infinity = never. */
  expiresAt: number;
  prev: Entry<K, V>;
  next: Entry<K, V>;
}

/**
 * Least Recently Used cache with O(1) `get` and `put`.
 *
 * - `Map<K, Entry>` gives O(1) lookup from key to list node.
 * - A doubly linked list keeps recency order: head.next = most recently used,
 *   tail.prev = least recently used. Moving or removing a known node is O(1).
 * - `head` and `tail` are sentinel (dummy) nodes, so real nodes always have
 *   neighbours and the list code needs no null checks.
 */
export class LRUCache<K, V> {
  private readonly capacity: number;
  private readonly defaultTtlMs: number | undefined;
  private readonly onEvict: LRUCacheOptions<K, V>["onEvict"];
  private readonly now: () => number;
  private readonly entries = new Map<K, Entry<K, V>>();
  private readonly head = {} as Entry<K, V>;
  private readonly tail = {} as Entry<K, V>;

  constructor(capacity: number, options: LRUCacheOptions<K, V> = {}) {
    if (!Number.isInteger(capacity) || capacity <= 0) {
      throw new RangeError(`capacity must be a positive integer, got ${capacity}`);
    }
    assertValidTtl(options.ttlMs);

    this.capacity = capacity;
    this.defaultTtlMs = options.ttlMs;
    this.onEvict = options.onEvict;
    this.now = options.now ?? Date.now;
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get size(): number {
    return this.entries.size;
  }

  /** Returns the stored value and marks the key as most recently used, or -1 if absent/expired. */
  get(key: K): V | -1 {
    const entry = this.entries.get(key);
    if (!entry) return -1;

    if (this.isExpired(entry)) {
      this.evict(entry, "expired");
      return -1;
    }

    this.moveToFront(entry);
    return entry.value;
  }

  /** Inserts or updates a key, making it most recently used. Evicts the LRU entry when full. */
  put(key: K, value: V, ttlMs: number | undefined = this.defaultTtlMs): void {
    assertValidTtl(ttlMs);
    const expiresAt = ttlMs === undefined ? Infinity : this.now() + ttlMs;

    const existing = this.entries.get(key);
    if (existing) {
      existing.value = value;
      existing.expiresAt = expiresAt;
      this.moveToFront(existing);
      return;
    }

    if (this.entries.size >= this.capacity) {
      const lru = this.tail.prev;
      this.evict(lru, this.isExpired(lru) ? "expired" : "capacity");
    }

    const entry = { key, value, expiresAt } as Entry<K, V>;
    this.entries.set(key, entry);
    this.addToFront(entry);
  }

  /** Live keys from most to least recently used. O(n); does not affect recency. */
  keys(): K[] {
    const keys: K[] = [];
    for (let node = this.head.next; node !== this.tail; node = node.next) {
      if (!this.isExpired(node)) keys.push(node.key);
    }
    return keys;
  }

  private isExpired(entry: Entry<K, V>): boolean {
    return this.now() >= entry.expiresAt;
  }

  private evict(entry: Entry<K, V>, reason: EvictionReason): void {
    this.unlink(entry);
    this.entries.delete(entry.key);
    this.onEvict?.(entry.key, entry.value, reason);
  }

  private moveToFront(entry: Entry<K, V>): void {
    this.unlink(entry);
    this.addToFront(entry);
  }

  /** Inserts the node right after the head sentinel. */
  private addToFront(entry: Entry<K, V>): void {
    entry.prev = this.head;
    entry.next = this.head.next;
    this.head.next.prev = entry;
    this.head.next = entry;
  }

  /** Detaches the node by joining its neighbours to each other. */
  private unlink(entry: Entry<K, V>): void {
    entry.prev.next = entry.next;
    entry.next.prev = entry.prev;
  }
}

function assertValidTtl(ttlMs: number | undefined): void {
  if (ttlMs !== undefined && (!Number.isFinite(ttlMs) || ttlMs <= 0)) {
    throw new RangeError(`ttlMs must be a positive finite number, got ${ttlMs}`);
  }
}
