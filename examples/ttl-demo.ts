import { setTimeout as sleep } from "node:timers/promises";
import { LRUCache } from "../src/lru-cache.ts";
import { logEviction, traceGet, tracePut } from "./trace.ts";

console.log("LRU Cache TTL demo — capacity 3, default TTL 1000ms (real clock)\n");

const cache = new LRUCache<string, number>(3, { ttlMs: 1000, onEvict: logEviction });

tracePut(cache, "A", 10); // default TTL: 1000ms
tracePut(cache, "B", 20, 3000); // per-entry override: 3000ms
tracePut(cache, "C", 30); // default TTL: 1000ms

console.log("\n... waiting 1200ms ...\n");
await sleep(1200);

traceGet(cache, "A"); // expired -> removed lazily on read
traceGet(cache, "B"); // still alive

console.log("\nFilling the cache: the LRU entry C is already stale, so it is evicted as 'expired':\n");

tracePut(cache, "D", 40);
tracePut(cache, "E", 50);
traceGet(cache, "B");
