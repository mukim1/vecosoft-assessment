# Task 3 — Algorithm Explanation & Critical Thinking

1. **Data structures and why:** I combined a hash map (a JavaScript `Map`) with a doubly linked list. The map gives O(1) lookup from a key to its list node. The list keeps recency order, with the most recently used node at the head and the least recently used at the tail. Because every node knows its neighbours, moving a node to the front or evicting the tail takes a constant number of pointer updates.
2. **Time and space complexity:** `get` and `put` are O(1) on average. Space is O(capacity).
3. **Where it performs poorly:** a sequential scan larger than the capacity. With capacity 100, repeatedly reading keys 1 to 101 in order evicts each key just before it is needed again. The hit rate is 0%, and the scan also pushes out genuinely hot keys. Policies such as LRU-K or 2Q resist this.
4. **An AI suggestion I changed:** the AI's first version used nullable head and tail pointers, so every insert and unlink needed null checks. I had it switch to sentinel head and tail nodes. Every real node then always has neighbours, and the list code became shorter and easier to verify.
