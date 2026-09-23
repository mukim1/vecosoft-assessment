import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { LRUCache, type EvictionReason } from "../src/lru-cache.ts";

function createClock(start = 0) {
  let time = start;
  return {
    now: () => time,
    advance: (ms: number) => {
      time += ms;
    },
  };
}

describe("LRUCache", () => {
  it("matches the example from the task brief", () => {
    const cache = new LRUCache<string, number>(2);
    cache.put("A", 10);
    cache.put("B", 20);
    assert.equal(cache.get("A"), 10);
    cache.put("C", 30);
    assert.equal(cache.get("B"), -1);
    assert.equal(cache.get("C"), 30);
    assert.equal(cache.get("A"), 10);
  });

  it("returns -1 for a missing key", () => {
    const cache = new LRUCache<string, number>(1);
    assert.equal(cache.get("missing"), -1);
  });

  it("updates an existing key without growing and marks it most recently used", () => {
    const cache = new LRUCache<string, number>(2);
    cache.put("A", 1);
    cache.put("B", 2);
    cache.put("A", 100);
    assert.equal(cache.size, 2);
    assert.deepEqual(cache.keys(), ["A", "B"]);

    cache.put("C", 3);
    assert.equal(cache.get("B"), -1, "B was least recently used, so it is evicted");
    assert.equal(cache.get("A"), 100);
  });

  it("keeps recency order from most to least recently used", () => {
    const cache = new LRUCache<string, number>(3);
    cache.put("A", 1);
    cache.put("B", 2);
    cache.put("C", 3);
    cache.get("A");
    assert.deepEqual(cache.keys(), ["A", "C", "B"]);
  });

  it("works with capacity 1", () => {
    const cache = new LRUCache<string, number>(1);
    cache.put("A", 1);
    cache.put("B", 2);
    assert.equal(cache.get("A"), -1);
    assert.equal(cache.get("B"), 2);
    assert.equal(cache.size, 1);
  });

  it("reports capacity evictions through onEvict", () => {
    const evicted: Array<[string, number, EvictionReason]> = [];
    const cache = new LRUCache<string, number>(2, {
      onEvict: (key, value, reason) => evicted.push([key, value, reason]),
    });
    cache.put("A", 1);
    cache.put("B", 2);
    cache.put("C", 3);
    assert.deepEqual(evicted, [["A", 1, "capacity"]]);
  });

  it("rejects a capacity that is not a positive integer", () => {
    for (const capacity of [0, -1, 1.5, Number.NaN, Infinity]) {
      assert.throws(() => new LRUCache(capacity), RangeError);
    }
  });
});

describe("LRUCache TTL", () => {
  it("expires entries after the default TTL", () => {
    const clock = createClock();
    const cache = new LRUCache<string, number>(2, { ttlMs: 1000, now: clock.now });
    cache.put("A", 1);

    clock.advance(999);
    assert.equal(cache.get("A"), 1);

    clock.advance(1);
    assert.equal(cache.get("A"), -1);
    assert.equal(cache.size, 0, "expired entries are removed when read");
  });

  it("lets a single put override the default TTL", () => {
    const clock = createClock();
    const cache = new LRUCache<string, number>(2, { ttlMs: 1000, now: clock.now });
    cache.put("short", 1);
    cache.put("long", 2, 5000);

    clock.advance(2000);
    assert.equal(cache.get("short"), -1);
    assert.equal(cache.get("long"), 2);
  });

  it("refreshes the TTL when a key is updated, but not when it is read", () => {
    const clock = createClock();
    const cache = new LRUCache<string, number>(2, { ttlMs: 1000, now: clock.now });
    cache.put("A", 1);

    clock.advance(800);
    cache.get("A");
    clock.advance(300);
    assert.equal(cache.get("A"), -1, "get does not extend the TTL");

    cache.put("B", 1);
    clock.advance(800);
    cache.put("B", 2);
    clock.advance(800);
    assert.equal(cache.get("B"), 2, "put restarts the TTL");
  });

  it("reports an expired LRU entry as 'expired' when it is evicted by put", () => {
    const clock = createClock();
    const evicted: EvictionReason[] = [];
    const cache = new LRUCache<string, number>(1, {
      ttlMs: 100,
      now: clock.now,
      onEvict: (_key, _value, reason) => evicted.push(reason),
    });
    cache.put("A", 1);
    clock.advance(100);
    cache.put("B", 2);
    assert.deepEqual(evicted, ["expired"]);
  });

  it("excludes expired entries from keys()", () => {
    const clock = createClock();
    const cache = new LRUCache<string, number>(2, { now: clock.now });
    cache.put("A", 1, 100);
    cache.put("B", 2);
    clock.advance(100);
    assert.deepEqual(cache.keys(), ["B"]);
  });

  it("rejects an invalid TTL", () => {
    assert.throws(() => new LRUCache(1, { ttlMs: 0 }), RangeError);
    const cache = new LRUCache<string, number>(1);
    assert.throws(() => cache.put("A", 1, -5), RangeError);
  });
});
