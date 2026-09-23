import { LRUCache } from "../src/lru-cache.ts";
import { logEviction, traceGet, tracePut } from "./trace.ts";

console.log("LRU Cache demo — example from the task brief (capacity 2)\n");

const cache = new LRUCache<string, number>(2, { onEvict: logEviction });

tracePut(cache, "A", 10);
tracePut(cache, "B", 20);
traceGet(cache, "A"); // A becomes most recently used, so B is now the LRU entry
tracePut(cache, "C", 30); // over capacity -> evicts B
traceGet(cache, "B");
traceGet(cache, "C");
traceGet(cache, "A");

console.log("\nUpdating an existing key moves it to the front without evicting:\n");

tracePut(cache, "C", 300);
tracePut(cache, "D", 40); // evicts A, the least recently used
traceGet(cache, "A");
traceGet(cache, "C");
