# System Design Interview Questions & Answers

Comprehensive collection of system design concepts and interview questions for backend and distributed systems roles.

---

## Table of Contents

1. [Consistent Hashing](#consistent-hashing)

---

## Consistent Hashing

### What is Consistent Hashing?

**Consistent hashing** is a distributed hashing technique that minimizes the amount of data that needs to be rearranged when nodes (servers, caches, partitions) are added to or removed from a system. Unlike traditional modulo-based hashing, which remaps most keys when the number of servers changes, consistent hashing only affects a small fraction of the keys.

### Why is Consistent Hashing Important?

1. **Minimal Redistribution:** When a server is added/removed, only ~1/n of keys need to be remapped (n = number of servers).
2. **Scalability:** Supports dynamic scaling without massive data migration.
3. **Load Balancing:** Helps distribute data and traffic more evenly across nodes.
4. **Real-world Use:** Used in CDNs, caching layers (Memcached, Redis clusters), distributed databases, and load balancers.

### How Does Consistent Hashing Work?

#### 1. Hash Ring Concept

- Arrange servers and keys on a circular "hash ring" (typically 0 to 2^32 - 1).
- Both servers and keys are mapped using the same hash function.

#### 2. Key Assignment

A key is assigned to the **first server** it encounters when moving **clockwise** around the ring.

```
    Server A
       |
   ----+----
  /         \
 /           \
|     Ring    |   Key K1 → Server B
|             |   Key K2 → Server A
|             |   Key K3 → Server C
\           /
 \         /
   ----+----
       |
   Server B
       |
   Server C
```

#### 3. Adding/Removing a Server

- **Adding Server D:** Only keys between Server D and the previous server clockwise need to move.
- **Removing Server B:** Only keys that were on Server B move to the next server clockwise.

### Simple Implementation Example

```javascript
class ConsistentHash {
  constructor(replicas = 3) {
    this.replicas = replicas;        // virtual nodes per server
    this.ring = new Map();           // hash -> server
    this.sortedKeys = [];            // sorted hash keys
  }

  _hash(key) {
    // Use crypto or simple hash
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = ((hash << 5) - hash) + key.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit
    }
    return Math.abs(hash) % (2 ** 32);
  }

  addServer(server) {
    for (let i = 0; i < this.replicas; i++) {
      const virtualKey = `${server}:${i}`;
      const hash = this._hash(virtualKey);
      this.ring.set(hash, server);
    }
    this.sortedKeys = Array.from(this.ring.keys()).sort((a, b) => a - b);
  }

  removeServer(server) {
    for (let i = 0; i < this.replicas; i++) {
      const virtualKey = `${server}:${i}`;
      const hash = this._hash(virtualKey);
      this.ring.delete(hash);
    }
    this.sortedKeys = Array.from(this.ring.keys()).sort((a, b) => a - b);
  }

  getServer(key) {
    if (this.ring.size === 0) return null;

    const hash = this._hash(key);

    // Find first hash >= current hash
    for (let ringHash of this.sortedKeys) {
      if (ringHash >= hash) {
        return this.ring.get(ringHash);
      }
    }

    // Wrap around to first server
    return this.ring.get(this.sortedKeys[0]);
  }
}

// Usage
const ch = new ConsistentHash(3);
ch.addServer('Server A');
ch.addServer('Server B');
ch.addServer('Server C');

console.log(ch.getServer('user:123'));  // Server A (or B, C)
console.log(ch.getServer('user:456'));  // Server B

ch.addServer('Server D');
console.log(ch.getServer('user:123'));  // Still Server A (most keys unchanged)
```

### Key Concepts

#### **Virtual Nodes (Replicas)**

To ensure more uniform distribution across servers, use multiple hash values per server (virtual nodes):
- Without replicas: uneven load distribution.
- With 3 replicas per server: much more balanced distribution.

```javascript
// With 3 replicas, Server A is mapped 3 times on the ring:
// Server A:0 → hash 12345
// Server A:1 → hash 45678
// Server A:2 → hash 89012
```

#### **Hash Function Consistency**

Use a consistent hash function (e.g., MD5, SHA-1, or MurmurHash) so that the same key always hashes to the same position.

### Use Cases

1. **Distributed Caching:** Memcached, Redis cluster — route cache requests to the right server.
2. **Load Balancing:** Distribute incoming requests across servers with minimal redistribution.
3. **Partitioning:** Shard data across databases based on consistent hash.
4. **CDN:** Distribute content across edge servers.
5. **Kafka-like Message Queues:** Assign topics/partitions to brokers.

### Interview Tips

1. **Explain the Problem First:** Start with traditional modulo hashing limitations ("When we add 1 server, 99% of keys rehash").
2. **Visual Explanation:** Draw the ring, show servers and keys, demonstrate clockwise assignment.
3. **Virtual Nodes:** Mention that you'd use replicas/virtual nodes for better distribution.
4. **Complexity:**
   - **Add Server:** O(replicas) updates; affects ~1/n keys.
   - **Remove Server:** O(replicas) updates; affects ~1/n keys.
   - **Get Server:** O(log m) lookup (m = total nodes including replicas).
5. **Real-world Context:** Mention a concrete use case (cache, database sharding, load balancer).
6. **Tradeoffs:** Virtual nodes improve balance but add memory/lookup overhead.

### Common Interview Questions

**Q: Why not just use modulo hashing like `hash(key) % num_servers`?**  
A: When servers change, almost all keys rehash. With 100 servers, adding one forces 99% of keys to move. Consistent hashing only affects ~1% of keys.

**Q: How do you handle non-uniform distribution?**  
A: Use virtual nodes (replicas). Map each server to multiple positions on the ring so no single server dominates.

**Q: What if a server goes down during rebalancing?**  
A: Keys move to the next server clockwise. Replicas/redundancy ensure availability (e.g., replication factor of 3).

**Q: How does this scale to millions of keys?**  
A: Hash lookups are O(log m) with binary search on sorted keys. Virtual nodes and batch operations keep overhead low.

---

## Conclusion

Consistent hashing is a foundational concept in distributed systems. Master the ring concept, virtual nodes, and the real-world applications to ace system design interviews.
