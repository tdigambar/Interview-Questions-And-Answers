# MongoDB Interview Questions and Answers

A comprehensive collection of MongoDB interview questions covering basic to advanced concepts for database development and administration.

## Table of Contents

- [Basic Level](#basic-level)
- [Intermediate Level](#intermediate-level)
- [Advanced Level](#advanced-level)

---

## Basic Level

### 1. What is MongoDB?

MongoDB is a NoSQL document-oriented database that stores data in flexible, JSON-like documents called BSON (Binary JSON). It's designed for scalability, flexibility, and performance.

**Key Features:**
- **Document-based**: Stores data as documents instead of tables
- **Schema-less**: No fixed schema, documents can have different structures
- **Scalable**: Horizontal scaling with sharding
- **High Performance**: Indexing and aggregation framework
- **Flexible**: Supports complex queries and data types

### 2. What is the difference between SQL and NoSQL databases?

| SQL Databases | NoSQL Databases |
|---------------|-----------------|
| Relational | Non-relational |
| Fixed schema | Flexible schema |
| ACID properties | BASE properties |
| Vertical scaling | Horizontal scaling |
| Table-based | Document/Key-value/Graph/Column-based |
| Complex queries | Simple queries |
| Strong consistency | Eventual consistency |

### 3. What are the main components of MongoDB?

**Database**: A container for collections
**Collection**: A group of documents (similar to a table in SQL)
**Document**: A record in a collection (similar to a row in SQL)
**Field**: A key-value pair in a document (similar to a column in SQL)

```javascript
// Database: myapp
// Collection: users
// Document:
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  name: "John Doe",
  email: "john@example.com",
  age: 30,
  address: {
    street: "123 Main St",
    city: "New York",
    country: "USA"
  },
  hobbies: ["reading", "swimming", "coding"]
}
```

### 4. How does MongoDB store data?

MongoDB stores data in **BSON (Binary JSON)** format on disk using collections and documents.

**Storage Architecture:**

```
Database
  └── Collection (like a table)
       └── Document (like a row, stored as BSON)
            └── Fields (key-value pairs)
```

**Physical Storage:**

1. **BSON Format** - Documents stored in binary format
2. **WiredTiger Storage Engine** (default) - Manages data on disk
3. **Collections** - Organized into data files
4. **Memory-Mapped Files** - Data cached in RAM for fast access

**Storage Hierarchy:**
```javascript
// Logical structure
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30
}

// Physical storage:
// Database → data/db/myapp/
//   ├── collection-0-123.wt (WiredTiger file)
//   ├── collection-2-123.wt
//   └── index-1-123.wt (index files)
```

**Key Storage Features:**

**1. Documents** - Stored in BSON format
```javascript
// Each document is a BSON object
{
  _id: ObjectId("..."),     // 12 bytes
  name: "John",             // String + length
  age: 30,                  // 4 bytes (int32)
  active: true,             // 1 byte (boolean)
  hobbies: ["coding"]       // Array in BSON
}
```

**2. WiredTiger Storage Engine** - Compresses and manages data
- **Document-level locking** - Multiple threads access different docs
- **Compression** - Reduces disk space (snappy, zlib, zstd)
- **Journaling** - Write-ahead log for durability
- **Checkpoints** - Periodic snapshots for recovery

**3. Memory Management**
```javascript
// WiredTiger cache configuration
storage:
  wiredTiger:
    engineConfig:
      cacheSizeGB: 1  // RAM allocated for caching
```

**Data File Organization:**
```
/data/db/
  └── myapp/
      ├── collection-0-xxx.wt   (users collection)
      ├── collection-2-xxx.wt   (orders collection)
      ├── index-1-xxx.wt        (users indexes)
      ├── index-3-xxx.wt        (orders indexes)
      └── WiredTiger.wt         (metadata)
```

**Document Size Limits:**
- Maximum document size: **16 MB**
- Use GridFS for files larger than 16MB
- Each document stored contiguously in memory

**Example - How a Document is Stored:**
```javascript
// Application code
db.users.insertOne({
  name: "Alice",
  age: 25,
  email: "alice@example.com"
})

// What happens:
// 1. Document converted to BSON binary format
// 2. Assigned unique ObjectId (_id)
// 3. Written to WiredTiger cache (RAM)
// 4. Journaled for durability
// 5. Periodically flushed to disk (.wt files)
// 6. Compressed using snappy/zlib
```

**Storage Efficiency:**
```javascript
// Check storage size
db.users.stats()
// Output:
{
  size: 1024,              // Logical size
  storageSize: 512,        // Physical size (compressed)
  totalIndexSize: 256,     // Index size
  indexSizes: {
    "_id_": 128,
    "email_1": 128
  }
}
```

**Key Takeaways:**
- Data stored as **BSON** (binary JSON) documents
- **WiredTiger** storage engine manages physical storage
- Documents organized in **collections** (data files)
- **Compression** reduces disk usage
- Data cached in **RAM** for fast access
- **16MB limit** per document

### 5. What is BSON?

BSON (Binary JSON) is a binary-encoded serialization of JSON-like documents. It extends JSON with additional data types and is more efficient for storage and traversal.

**BSON Data Types:**
- String, Integer, Double, Boolean
- Date, ObjectId, Binary
- Array, Object, Null
- Regular Expression, JavaScript Code
- Min/Max Key, Timestamp

### 6. What is ObjectId in MongoDB?

ObjectId is a 12-byte identifier typically used as the primary key for documents. It consists of:

- **4 bytes**: Timestamp (seconds since Unix epoch)
- **5 bytes**: Random value unique to machine and process
- **3 bytes**: Incrementing counter

```javascript
// Example ObjectId
ObjectId("507f1f77bcf86cd799439011")
// 507f1f77 - timestamp
// bcf86cd799 - machine/process identifier
// 439011 - counter
```

### 7. How do you create a database and collection in MongoDB?

```javascript
// Create/switch to database
use myapp

// Create collection (implicit)
db.users.insertOne({name: "John", age: 30})

// Create collection explicitly
db.createCollection("users")

// Create collection with options
db.createCollection("users", {
  capped: true,
  size: 100000,
  max: 1000
})
```

### 8. What are the basic CRUD operations in MongoDB?

**Create (Insert):**
```javascript
// Insert single document
db.users.insertOne({
  name: "John Doe",
  email: "john@example.com",
  age: 30
})

// Insert multiple documents
db.users.insertMany([
  {name: "Jane", age: 25},
  {name: "Bob", age: 35}
])
```

**Read (Find):**
```javascript
// Find all documents
db.users.find()

// Find with filter
db.users.find({age: {$gt: 25}})

// Find one document
db.users.findOne({name: "John"})

// Project specific fields
db.users.find({}, {name: 1, email: 1})
```

**Update:**
```javascript
// Update single document
db.users.updateOne(
  {name: "John"},
  {$set: {age: 31}}
)

// Update multiple documents
db.users.updateMany(
  {age: {$lt: 30}},
  {$set: {status: "young"}}
)

// Replace document
db.users.replaceOne(
  {name: "John"},
  {name: "John Smith", age: 31, email: "johnsmith@example.com"}
)
```

**Delete:**
```javascript
// Delete single document
db.users.deleteOne({name: "John"})

// Delete multiple documents
db.users.deleteMany({age: {$lt: 18}})

// Delete all documents
db.users.deleteMany({})
```

### 9. What are MongoDB operators?

MongoDB provides various operators for querying and updating documents:

**Comparison Operators:**
```javascript
// $eq, $ne, $gt, $gte, $lt, $lte, $in, $nin
db.users.find({age: {$gt: 25}})
db.users.find({status: {$in: ["active", "pending"]}})
```

**Logical Operators:**
```javascript
// $and, $or, $not, $nor
db.users.find({
  $and: [
    {age: {$gt: 18}},
    {status: "active"}
  ]
})

db.users.find({
  $or: [
    {age: {$lt: 25}},
    {age: {$gt: 65}}
  ]
})
```

**Update Operators:**
```javascript
// $set, $unset, $inc, $push, $pull, $addToSet
db.users.updateOne(
  {name: "John"},
  {
    $set: {age: 31},
    $inc: {score: 10},
    $push: {hobbies: "gaming"}
  }
)
```

### 10. What is indexing in MongoDB?

Indexes are data structures that improve query performance by providing quick access to documents. MongoDB automatically creates an index on the `_id` field.

```javascript
// Create single field index
db.users.createIndex({email: 1})

// Create compound index
db.users.createIndex({name: 1, age: -1})

// Create text index
db.articles.createIndex({title: "text", content: "text"})

// Create unique index
db.users.createIndex({email: 1}, {unique: true})

// Create sparse index
db.users.createIndex({phone: 1}, {sparse: true})

// List indexes
db.users.getIndexes()

// Drop index
db.users.dropIndex({email: 1})
```

### 11. What are the different types of indexes in MongoDB?

**Single Field Index:**
```javascript
db.users.createIndex({name: 1})
```

**Compound Index:**
```javascript
db.users.createIndex({name: 1, age: -1})
```

**Multikey Index (Array):**
```javascript
db.users.createIndex({hobbies: 1})
```

**Text Index:**
```javascript
db.articles.createIndex({title: "text", content: "text"})
```

**Geospatial Index:**
```javascript
db.places.createIndex({location: "2dsphere"})
```

**Hashed Index:**
```javascript
db.users.createIndex({email: "hashed"})
```

**Partial Index:**
```javascript
db.users.createIndex(
  {email: 1},
  {partialFilterExpression: {age: {$gte: 18}}}
)
```

---

## Intermediate Level

### 12. What is the Aggregation Framework?

The Aggregation Framework is a powerful tool for data processing and analysis. It uses a pipeline of stages to transform documents.

```javascript
// Basic aggregation pipeline
db.orders.aggregate([
  // Stage 1: Match documents
  {$match: {status: "completed"}},
  
  // Stage 2: Group by customer
  {$group: {
    _id: "$customerId",
    totalAmount: {$sum: "$amount"},
    orderCount: {$sum: 1}
  }},
  
  // Stage 3: Sort by total amount
  {$sort: {totalAmount: -1}},
  
  // Stage 4: Limit results
  {$limit: 10}
])
```

### 13. What are the main aggregation stages?

**$match**: Filter documents (like WHERE in SQL)
```javascript
{$match: {age: {$gte: 18}, status: "active"}}
```

**$group**: Group documents and perform calculations
```javascript
{$group: {
  _id: "$department",
  avgSalary: {$avg: "$salary"},
  count: {$sum: 1}
}}
```

**$project**: Reshape documents (like SELECT in SQL)
```javascript
{$project: {
  name: 1,
  email: 1,
  fullName: {$concat: ["$firstName", " ", "$lastName"]}
}}
```

**$sort**: Sort documents
```javascript
{$sort: {age: -1, name: 1}}
```

**$limit**: Limit number of documents
```javascript
{$limit: 10}
```

**$skip**: Skip number of documents
```javascript
{$skip: 20}
```

**$lookup**: Join collections (like JOIN in SQL)
```javascript
{$lookup: {
  from: "orders",
  localField: "_id",
  foreignField: "customerId",
  as: "orders"
}}
```

### 14. What is the difference between find() and aggregate()?

| find() | aggregate() |
|--------|-------------|
| Simple queries | Complex data processing |
| Limited operations | Rich set of operations |
| Single stage | Multiple stages |
| Basic filtering | Advanced transformations |
| No grouping | Grouping and calculations |
| No joins | Join operations |

**Example:**
```javascript
// Using find() - simple query
db.users.find({age: {$gt: 25}})

// Using aggregate() - complex processing
db.users.aggregate([
  {$match: {age: {$gt: 25}}},
  {$group: {
    _id: "$department",
    avgAge: {$avg: "$age"},
    count: {$sum: 1}
  }},
  {$sort: {avgAge: -1}}
])
```

### 14. What is sharding in MongoDB?

Sharding is a method for distributing data across multiple machines. It's used for horizontal scaling when a single machine can't handle the data or load.

**Sharding Components:**
- **Shard**: A MongoDB instance that holds a subset of data
- **Config Server**: Stores metadata about the cluster
- **Mongos**: Router that directs operations to appropriate shards

```javascript
// Enable sharding on database
sh.enableSharding("myapp")

// Shard a collection
sh.shardCollection("myapp.users", {userId: "hashed"})

// Shard with range-based sharding
sh.shardCollection("myapp.orders", {orderDate: 1})
```

### 15. What is replication in MongoDB?

Replication is the process of synchronizing data across multiple servers to provide redundancy and high availability.

**Replica Set Components:**
- **Primary**: Accepts all write operations
- **Secondary**: Replicates data from primary
- **Arbiter**: Votes in elections but doesn't hold data

```javascript
// Initialize replica set
rs.initiate({
  _id: "rs0",
  members: [
    {_id: 0, host: "mongodb1:27017"},
    {_id: 1, host: "mongodb2:27017"},
    {_id: 2, host: "mongodb3:27017"}
  ]
})

// Check replica set status
rs.status()

// Add member to replica set
rs.add("mongodb4:27017")

// Remove member from replica set
rs.remove("mongodb4:27017")
```

### 16. What are MongoDB transactions?

Transactions allow you to perform multiple operations atomically. They ensure ACID properties across multiple documents.

```javascript
// Start a session
const session = db.getMongo().startSession()

// Start transaction
session.startTransaction()

try {
  // Perform operations
  db.users.insertOne({name: "John"}, {session})
  db.orders.insertOne({userId: "John", amount: 100}, {session})
  
  // Commit transaction
  session.commitTransaction()
} catch (error) {
  // Abort transaction
  session.abortTransaction()
  throw error
} finally {
  session.endSession()
}
```

### 17. What is the difference between embedded documents and references?

**Embedded Documents:**
```javascript
// User document with embedded address
{
  _id: ObjectId("..."),
  name: "John Doe",
  address: {
    street: "123 Main St",
    city: "New York",
    country: "USA"
  }
}
```

**References:**
```javascript
// User document with reference
{
  _id: ObjectId("..."),
  name: "John Doe",
  addressId: ObjectId("...")
}

// Separate address document
{
  _id: ObjectId("..."),
  street: "123 Main St",
  city: "New York",
  country: "USA"
}
```

**When to use each:**
- **Embedded**: One-to-one or one-to-few relationships, data accessed together
- **References**: One-to-many or many-to-many relationships, large documents, data accessed separately

### 18. What is GridFS?

GridFS is a specification for storing and retrieving files that exceed the BSON document size limit of 16MB.

```javascript
// Store file using GridFS
const fs = require('fs')
const {GridFSBucket} = require('mongodb')

const bucket = new GridFSBucket(db, {bucketName: 'files'})

// Upload file
fs.createReadStream('large-file.pdf')
  .pipe(bucket.openUploadStream('large-file.pdf'))

// Download file
bucket.openDownloadStreamByName('large-file.pdf')
  .pipe(fs.createWriteStream('downloaded-file.pdf'))
```

### 19. What are MongoDB views?

Views are read-only collections that are defined by an aggregation pipeline on other collections or views.

```javascript
// Create a view
db.createView("activeUsers", "users", [
  {$match: {status: "active"}},
  {$project: {name: 1, email: 1, lastLogin: 1}}
])

// Query the view
db.activeUsers.find()

// List views
db.runCommand({listCollections: 1, filter: {type: "view"}})
```

### 20. What is the difference between MongoDB and other NoSQL databases?

| MongoDB | Cassandra | Redis | Neo4j |
|---------|-----------|-------|-------|
| Document-based | Column-family | Key-value | Graph |
| Flexible schema | Flexible schema | No schema | Graph schema |
| ACID transactions | Eventual consistency | In-memory | ACID transactions |
| Horizontal scaling | Horizontal scaling | Vertical scaling | Horizontal scaling |
| Complex queries | Simple queries | Simple queries | Graph queries |
| JSON-like documents | Wide columns | Key-value pairs | Nodes and relationships |

---

## Advanced Level

### 21. What is the MongoDB Change Streams?

Change Streams allow you to watch for changes in real-time on collections, databases, or entire clusters.

```javascript
// Watch for changes on a collection
const changeStream = db.users.watch()

changeStream.on('change', (change) => {
  console.log('Change detected:', change)
  
  switch (change.operationType) {
    case 'insert':
      console.log('New document inserted:', change.fullDocument)
      break
    case 'update':
      console.log('Document updated:', change.documentKey)
      break
    case 'delete':
      console.log('Document deleted:', change.documentKey)
      break
  }
})

// Watch with filter
const filteredStream = db.users.watch([
  {$match: {operationType: 'insert'}}
])
```

### 22. What is MongoDB Atlas?

MongoDB Atlas is a fully managed cloud database service that provides:

- **Automated backups**: Point-in-time recovery
- **Monitoring**: Real-time performance metrics
- **Security**: Encryption, network isolation, access controls
- **Scaling**: Automatic scaling and sharding
- **Global clusters**: Multi-region deployments

```javascript
// Connection string for Atlas
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

### 23. What are MongoDB performance optimization techniques?

**1. Proper Indexing:**
```javascript
// Create compound index for common queries
db.users.createIndex({status: 1, createdAt: -1})

// Use partial indexes for filtered queries
db.users.createIndex(
  {email: 1},
  {partialFilterExpression: {status: "active"}}
)
```

**2. Query Optimization:**
```javascript
// Use projection to limit fields
db.users.find({status: "active"}, {name: 1, email: 1})

// Use limit to reduce result set
db.users.find({status: "active"}).limit(100)

// Use explain() to analyze queries
db.users.find({status: "active"}).explain("executionStats")
```

**3. Aggregation Optimization:**
```javascript
// Use $match early in pipeline
db.orders.aggregate([
  {$match: {status: "completed"}}, // Early filtering
  {$group: {_id: "$customerId", total: {$sum: "$amount"}}},
  {$sort: {total: -1}},
  {$limit: 10}
])
```

### 24. What is MongoDB Compass?

MongoDB Compass is a GUI tool for MongoDB that provides:

- **Visual query builder**: Create queries without writing code
- **Schema analysis**: Understand your data structure
- **Performance monitoring**: Analyze query performance
- **Index management**: Create and manage indexes
- **Data exploration**: Browse and edit documents

### 25. What are MongoDB security best practices?

**1. Authentication and Authorization:**
```javascript
// Create user with specific roles
db.createUser({
  user: "appuser",
  pwd: "securepassword",
  roles: [
    {role: "readWrite", db: "myapp"},
    {role: "dbAdmin", db: "myapp"}
  ]
})
```

**2. Network Security:**
```javascript
// Bind to specific IP addresses
net:
  bindIp: 127.0.0.1,10.0.0.0/8

// Enable SSL/TLS
net:
  ssl:
    mode: requireSSL
    PEMKeyFile: /path/to/server.pem
```

**3. Data Encryption:**
```javascript
// Enable encryption at rest
security:
  enableEncryption: true
  encryptionKeyFile: /path/to/keyfile
```

### 26. What is the MongoDB WiredTiger storage engine?

WiredTiger is the default storage engine in MongoDB 3.2+. It provides:

- **Document-level concurrency**: Multiple threads can access different documents
- **Compression**: Reduces storage space
- **Checkpoints**: Periodic snapshots for recovery
- **Journaling**: Write-ahead logging for durability

```javascript
// Check storage engine
db.serverStatus().storageEngine

// Configure WiredTiger
storage:
  wiredTiger:
    engineConfig:
      cacheSizeGB: 1
      journalCompressor: snappy
      directoryForIndexes: true
    collectionConfig:
      blockCompressor: snappy
    indexConfig:
      prefixCompression: true
```

### 27. What is the difference between MongoDB and MongoDB Atlas?

| MongoDB | MongoDB Atlas |
|---------|---------------|
| Self-hosted | Fully managed |
| Manual setup | Automated setup |
| Manual backups | Automated backups |
| Manual scaling | Automatic scaling |
| Manual monitoring | Built-in monitoring |
| Manual security | Built-in security |
| On-premise or cloud | Cloud only |
| More control | Less control |
| More maintenance | Less maintenance |

### 28. What are MongoDB best practices?

**1. Schema Design:**
```javascript
// Good: Embedded documents for one-to-few relationships
{
  _id: ObjectId("..."),
  name: "John Doe",
  address: {
    street: "123 Main St",
    city: "New York"
  }
}

// Good: References for one-to-many relationships
{
  _id: ObjectId("..."),
  name: "John Doe",
  orderIds: [ObjectId("..."), ObjectId("...")]
}
```

**2. Indexing:**
```javascript
// Create indexes for common query patterns
db.users.createIndex({email: 1})
db.users.createIndex({status: 1, createdAt: -1})

// Use compound indexes for multi-field queries
db.orders.createIndex({customerId: 1, orderDate: -1})
```

**3. Query Optimization:**
```javascript
// Use projection to limit fields
db.users.find({status: "active"}, {name: 1, email: 1})

// Use limit for large result sets
db.users.find({status: "active"}).limit(100)

// Use explain() to analyze queries
db.users.find({status: "active"}).explain("executionStats")
```

### 29. What is the MongoDB aggregation pipeline optimization?

**1. Early Filtering:**
```javascript
// Good: Filter early in pipeline
db.orders.aggregate([
  {$match: {status: "completed"}}, // Early filtering
  {$group: {_id: "$customerId", total: {$sum: "$amount"}}},
  {$sort: {total: -1}},
  {$limit: 10}
])
```

**2. Index Usage:**
```javascript
// Create index for $match stage
db.orders.createIndex({status: 1, customerId: 1})

// Use $sort with index
db.orders.createIndex({customerId: 1, orderDate: -1})
```

**3. Memory Management:**
```javascript
// Use $limit early to reduce memory usage
db.orders.aggregate([
  {$match: {status: "completed"}},
  {$limit: 1000}, // Early limit
  {$group: {_id: "$customerId", total: {$sum: "$amount"}}}
])
```

### 30. What are MongoDB monitoring and profiling?

**1. Database Profiler:**
```javascript
// Enable profiling
db.setProfilingLevel(2, {slowms: 100})

// Check profiling status
db.getProfilingStatus()

// View profiler data
db.system.profile.find().sort({ts: -1}).limit(5)
```

**2. Server Status:**
```javascript
// Get server status
db.serverStatus()

// Get database stats
db.stats()

// Get collection stats
db.users.stats()
```

**3. Current Operations:**
```javascript
// View current operations
db.currentOp()

// Kill long-running operations
db.killOp(operationId)
```

---

## Conclusion

These questions cover MongoDB fundamentals through advanced concepts and should thoroughly prepare you for a MongoDB interview! The topics range from basic CRUD operations to advanced features like sharding, replication, and performance optimization that are essential for building scalable applications with MongoDB.

Key areas covered include:
- **Core Concepts**: Documents, collections, BSON, ObjectId
- **Operations**: CRUD operations, indexing, aggregation
- **Advanced Features**: Sharding, replication, transactions
- **Performance**: Optimization techniques, monitoring, profiling
- **Security**: Authentication, authorization, encryption
- **Tools**: Compass, Atlas, DevTools
- **Best Practices**: Schema design, indexing, query optimization
