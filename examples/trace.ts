import type { EvictionReason, LRUCache } from "../src/lru-cache.ts";

/** Console helpers shared by the demos, so every operation prints in the same format. */

type DemoCache = LRUCache<string, number>;

// Evictions fire during put/get; they are queued and printed under the operation that caused them.
const pendingEvictions: string[] = [];

export function logEviction(key: string, value: number, reason: EvictionReason): void {
  pendingEvictions.push(`evicted ${key}=${value} (${reason})`);
}

export function tracePut(cache: DemoCache, key: string, value: number, ttlMs?: number): void {
  cache.put(key, value, ttlMs);
  const ttl = ttlMs === undefined ? "" : `, ttl ${ttlMs}ms`;
  print(`put("${key}", ${value}${ttl})`, cache);
}

export function traceGet(cache: DemoCache, key: string): void {
  const result = cache.get(key);
  print(`get("${key}") -> ${result}`, cache);
}

function print(operation: string, cache: DemoCache): void {
  console.log(`${operation.padEnd(26)} cache [MRU → LRU]: [${cache.keys().join(", ")}]`);
  for (const message of pendingEvictions.splice(0)) console.log(`   ↳ ${message}`);
}
