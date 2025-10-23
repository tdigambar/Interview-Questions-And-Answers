# AWS DynamoDB Interview Questions and Answers

## Basic Level

### 1. What is DynamoDB?

Amazon DynamoDB is a fully managed NoSQL database service provided by AWS that offers fast and predictable performance with seamless scalability. It's designed to handle high-traffic applications and provides single-digit millisecond latency at any scale.

**Key characteristics:**
- Fully managed service
- NoSQL key-value and document database
- Automatic scaling
- Built-in security and backup
- Global tables for multi-region replication

### 2. What are the main data types in DynamoDB?

**Scalar Types:**
- **String**: Text data
- **Number**: Numeric values (integers, floats)
- **Binary**: Binary data
- **Boolean**: true or false
- **Null**: Represents unknown or undefined state

**Document Types:**
- **List**: Ordered collection of values
- **Map**: Unordered collection of key-value pairs

**Set Types:**
- **String Set**: Set of strings
- **Number Set**: Set of numbers
- **Binary Set**: Set of binary values

### 3. What is a Primary Key in DynamoDB?

A primary key uniquely identifies each item in a table. DynamoDB supports two types:

**1. Partition Key (Simple Primary Key):**
- Single attribute
- Must be unique for each item
- DynamoDB uses it to partition data
- Example: `userId` in a Users table

**2. Composite Primary Key (Partition Key + Sort Key):**
- Two attributes: Partition Key and Sort Key
- Combination must be unique
- Items with same partition key are stored together
- Example: `userId` (partition) + `timestamp` (sort) in a Sessions table

### 4. What is the difference between a Partition Key and a Sort Key?

| Feature | Partition Key | Sort Key |
|---------|--------------|----------|
| **Purpose** | Determines data distribution | Orders items with same partition key |
| **Requirement** | Mandatory | Optional |
| **Uniqueness** | Must be unique (simple key) | Combination with partition key must be unique |
| **Queries** | Required in all queries | Optional, enables range queries |
| **Storage** | Distributes data across partitions | Groups related data together |

### 5. What are DynamoDB capacity modes?

**1. On-Demand Mode:**
- Pay per request
- No capacity planning needed
- Automatically scales
- Best for unpredictable workloads
- More expensive per request

**2. Provisioned Mode:**
- Specify read/write capacity units
- Predictable pricing
- Can use Auto Scaling
- Best for predictable workloads
- More cost-effective at scale

### 6. What are RCU and WCU?

**Read Capacity Unit (RCU):**
- One strongly consistent read per second
- Two eventually consistent reads per second
- For items up to 4 KB in size

**Write Capacity Unit (WCU):**
- One write per second
- For items up to 1 KB in size

**Example calculations:**
```
Reading 10 items of 8 KB with strong consistency:
RCU = (10 items × 8 KB) / 4 KB = 20 RCU

Writing 5 items of 2 KB:
WCU = (5 items × 2 KB) / 1 KB = 10 WCU
```

### 7. What is the difference between Scan and Query operations?

| Feature | Query | Scan |
|---------|-------|------|
| **Efficiency** | Efficient, uses indexes | Inefficient, examines all items |
| **Partition Key** | Required | Not required |
| **Cost** | Lower cost | Higher cost |
| **Speed** | Fast | Slow on large tables |
| **Use Case** | Retrieve specific items | Full table examination |
| **Filtering** | Filter expression available | Filter expression available |

### 8. What are Local Secondary Indexes (LSI)?

LSI is an index that has the same partition key as the base table but a different sort key.

**Characteristics:**
- Must be created at table creation time
- Cannot be added/removed later
- Uses table's provisioned throughput
- Supports strongly consistent reads
- Maximum 5 LSIs per table
- Share storage quota with base table

**Example:**
```
Base Table: userId (PK) + timestamp (SK)
LSI: userId (PK) + userName (SK)
```

### 9. What are Global Secondary Indexes (GSI)?

GSI is an index with a partition key and optional sort key that can be different from the base table.

**Characteristics:**
- Can be created/deleted anytime
- Has its own provisioned throughput
- Eventually consistent reads only
- Maximum 20 GSIs per table
- Own storage and capacity

**Example:**
```
Base Table: userId (PK) + timestamp (SK)
GSI: email (PK) + timestamp (SK)
```

### 10. What is the difference between LSI and GSI?

| Feature | LSI | GSI |
|---------|-----|-----|
| **Creation** | Only at table creation | Anytime |
| **Partition Key** | Same as base table | Can be different |
| **Sort Key** | Must be different | Can be different |
| **Consistency** | Strong or eventual | Eventually consistent only |
| **Throughput** | Shared with table | Separate throughput |
| **Limit** | 5 per table | 20 per table |

### 11. What is a DynamoDB Stream?

DynamoDB Streams captures time-ordered sequence of item-level modifications in a table and stores this information for up to 24 hours.

**Use cases:**
- Replication across regions
- Trigger Lambda functions
- Real-time analytics
- Audit trails
- Materialized views

**Stream view types:**
- `KEYS_ONLY`: Only the key attributes
- `NEW_IMAGE`: Entire item after modification
- `OLD_IMAGE`: Entire item before modification
- `NEW_AND_OLD_IMAGES`: Both new and old images

### 12. What are the DynamoDB item size limits?

- **Maximum item size**: 400 KB (including attribute names and values)
- **Attribute name**: Maximum 64 KB
- **String/Binary**: Maximum 400 KB
- **Number**: 38 digits precision
- **No limit** on number of attributes per item

### 13. What is Eventual Consistency vs Strong Consistency?

**Eventual Consistency:**
- Default read consistency
- Reads may not reflect recent writes
- Better performance and availability
- Lower cost (uses fewer RCUs)
- Data consistency within seconds

**Strong Consistency:**
- Returns most up-to-date data
- Higher latency
- Uses more RCUs (2x)
- Not available for GSIs
- Specify `ConsistentRead=true` in API call

## Intermediate Level

### 14. What are DynamoDB Transactions?

DynamoDB transactions provide ACID (Atomicity, Consistency, Isolation, Durability) properties across one or more tables within a single AWS account and region.

**Features:**
- All-or-nothing operations
- Up to 100 items or 4 MB
- Support Put, Update, Delete, ConditionCheck
- Two APIs: `TransactWriteItems` and `TransactReadItems`

**Cost:**
- Consumes 2x capacity units
- Write transaction: 2 WCUs per KB
- Read transaction: 2 RCUs per 4 KB

**Example use case:**
```
Transfer funds:
1. Deduct from Account A
2. Add to Account B
Both succeed or both fail
```

### 15. What is Time To Live (TTL)?

TTL automatically deletes expired items from your table at no extra cost.

**Features:**
- Define expiration timestamp attribute
- Items deleted within 48 hours of expiration
- No impact on read/write capacity
- Deleted items appear in DynamoDB Streams
- Free feature

**Use cases:**
- Session management
- Event logs
- Temporary data
- Regulatory compliance

**Example:**
```json
{
  "userId": "123",
  "sessionToken": "abc",
  "expirationTime": 1699999999
}
```

### 16. What are Conditional Writes?

Conditional writes allow you to specify conditions that must be met for a write operation to succeed.

**Condition expressions:**
- `attribute_exists`: Check if attribute exists
- `attribute_not_exists`: Check if attribute doesn't exist
- `attribute_type`: Check attribute type
- `begins_with`: String prefix match
- `contains`: Check if value contains element
- `size`: Check attribute size

**Example:**
```python
# Only update if price is less than 100
table.update_item(
    Key={'productId': '123'},
    UpdateExpression='SET price = :newprice',
    ConditionExpression='price < :threshold',
    ExpressionAttributeValues={
        ':newprice': 150,
        ':threshold': 100
    }
)
```

### 17. What is Optimistic Locking?

Optimistic locking ensures that an item hasn't changed since you read it before updating.

**Implementation:**
- Add version number attribute
- Increment version on each update
- Use conditional expression to check version

**Example:**
```python
# Read item with version
item = table.get_item(Key={'id': '123'})
version = item['version']

# Update only if version matches
table.update_item(
    Key={'id': '123'},
    UpdateExpression='SET data = :val, version = :newver',
    ConditionExpression='version = :currver',
    ExpressionAttributeValues={
        ':val': 'new_data',
        ':newver': version + 1,
        ':currver': version
    }
)
```

### 18. What is BatchGetItem and BatchWriteItem?

**BatchGetItem:**
- Retrieve multiple items from one or more tables
- Up to 100 items or 16 MB
- Reduces number of API calls
- Individual item failures don't fail entire batch

**BatchWriteItem:**
- Put or delete multiple items
- Up to 25 put/delete requests
- Up to 16 MB total
- Cannot update items
- No conditional writes

**Benefits:**
- Reduced latency
- Better throughput
- Cost-effective

### 19. What are DynamoDB Global Tables?

Global Tables provide fully managed, multi-region, multi-active database replication.

**Features:**
- Multi-region replication
- Active-active configuration
- Read and write to any region
- Automatic conflict resolution (last writer wins)
- Sub-second replication latency
- Built-in disaster recovery

**Requirements:**
- DynamoDB Streams enabled
- Same table name in all regions
- Same primary key structure

**Use cases:**
- Global applications
- Disaster recovery
- Low-latency access worldwide
- Business continuity

### 20. What is PartiQL for DynamoDB?

PartiQL is a SQL-compatible query language for DynamoDB.

**Features:**
- SQL-like syntax
- SELECT, INSERT, UPDATE, DELETE operations
- Works with DynamoDB items
- Supports batch operations
- Available in AWS SDK and console

**Example:**
```sql
-- Query items
SELECT * FROM Music WHERE Artist = 'The Beatles'

-- Insert item
INSERT INTO Music VALUE {
    'Artist': 'Led Zeppelin',
    'SongTitle': 'Stairway to Heaven'
}

-- Update item
UPDATE Music SET Price = 10.50 
WHERE Artist = 'Pink Floyd' AND SongTitle = 'Comfortably Numb'
```

### 21. What are DynamoDB Point-in-Time Recovery (PITR)?

PITR provides continuous backups of your DynamoDB table data.

**Features:**
- Automatic incremental backups
- Restore to any point in last 35 days
- No performance impact
- Per-table enablement
- Restore to new table

**Use cases:**
- Accidental deletes
- Application errors
- Data corruption
- Compliance requirements

**Cost:**
- Based on table size
- Separate from on-demand backups

### 22. What is DynamoDB Accelerator (DAX)?

DAX is a fully managed, in-memory cache for DynamoDB.

**Features:**
- Microsecond latency
- Up to 10x performance improvement
- No application changes needed
- Cache invalidation handled automatically
- Write-through cache
- Compatible with DynamoDB API

**Use cases:**
- Read-heavy workloads
- Gaming leaderboards
- Real-time bidding
- Social media feeds

**Architecture:**
- Cluster-based (primary + replica nodes)
- Multi-AZ deployment
- Encryption at rest and in transit

### 23. What are DynamoDB Best Practices for designing partition keys?

**Best Practices:**

1. **High Cardinality**: Choose attributes with many distinct values
   - Good: `userId`, `orderId`
   - Bad: `status` (only few values)

2. **Even Distribution**: Ensure uniform access patterns
   - Good: Random/UUID
   - Bad: Sequential numbers, timestamps

3. **Avoid Hot Partitions**: Distribute writes evenly
   - Add random suffix to keys
   - Use sharding strategies

4. **Composite Keys**: Use write sharding
   ```
   Instead of: userId
   Use: userId#randomSuffix (0-9)
   ```

5. **Access Patterns**: Design around query patterns
   - Know your access patterns upfront
   - Denormalize data when needed

### 24. What is DynamoDB Auto Scaling?

Auto Scaling automatically adjusts provisioned throughput capacity in response to traffic patterns.

**Features:**
- Target utilization (e.g., 70%)
- Min/max capacity limits
- Separate for read/write
- CloudWatch metrics driven
- 4 scale-up per day limit
- Unlimited scale-down

**Configuration:**
```
Target Utilization: 70%
Minimum Capacity: 5 RCU/WCU
Maximum Capacity: 1000 RCU/WCU
```

**Limitations:**
- Takes 1-2 minutes to scale
- Not instant for spikes
- Consider on-demand for unpredictable loads

### 25. What are DynamoDB Reserved Capacity?

Reserved Capacity allows you to reserve read/write capacity for a one-time upfront fee.

**Benefits:**
- Up to 53% cost savings
- One or three-year terms
- Applies to provisioned capacity
- Region-specific
- Automatically applied

**When to use:**
- Predictable workloads
- Long-term applications
- Cost optimization

### 26. Explain DynamoDB's pagination

DynamoDB returns results in pages due to 1 MB limit per response.

**Pagination mechanism:**
```python
response = table.scan()
items = response['Items']

# Check if more data exists
while 'LastEvaluatedKey' in response:
    response = table.scan(
        ExclusiveStartKey=response['LastEvaluatedKey']
    )
    items.extend(response['Items'])
```

**Key concepts:**
- `LastEvaluatedKey`: Marker for next page
- `ExclusiveStartKey`: Continue from this key
- `Limit`: Maximum items to evaluate (not return)
- Response size: Maximum 1 MB

## Advanced Level

### 27. How does DynamoDB handle partition management?

DynamoDB automatically manages partitions based on:

**Partition calculation:**
```
Partitions by Capacity = (RCU/3000) + (WCU/1000)
Partitions by Size = Total Size / 10 GB
Partitions = max(Partitions by Capacity, Partitions by Size)
```

**Partition characteristics:**
- 10 GB storage per partition
- 3000 RCU per partition
- 1000 WCU per partition
- Automatic split when limits reached
- Never merged back

**Implications:**
- Throughput distributed across partitions
- Hot partitions reduce effective throughput
- Deleted items don't reduce partition count

### 28. What is Adaptive Capacity in DynamoDB?

Adaptive Capacity automatically boosts throughput for partitions that receive more traffic.

**Features:**
- Prevents throttling from hot partitions
- No configuration needed
- Borrows capacity from less active partitions
- Works for up to 300 seconds
- Enabled by default

**Limitations:**
- Temporary solution
- Not a replacement for good key design
- May not handle sustained hot partition

**Best practice:**
Still design for even distribution

### 29. How do you implement one-to-many relationships in DynamoDB?

**Pattern 1: Denormalization**
```json
{
  "authorId": "author-1",
  "authorName": "John Doe",
  "books": [
    {"bookId": "book-1", "title": "Book One"},
    {"bookId": "book-2", "title": "Book Two"}
  ]
}
```

**Pattern 2: Composite Key**
```
PK: authorId
SK: BOOK#bookId

Item 1: authorId#METADATA | SK: AUTHOR
Item 2: authorId | SK: BOOK#book-1
Item 3: authorId | SK: BOOK#book-2
```

**Pattern 3: GSI**
```
Base table: bookId (PK)
GSI: authorId (PK) + title (SK)
```

### 30. Explain the Single Table Design pattern

Single Table Design stores multiple entity types in one table.

**Benefits:**
- Fewer tables to manage
- Reduced costs
- Better performance
- Atomic transactions across entities

**Implementation:**
```
PK: ENTITY#ID
SK: TYPE#METADATA

User: USER#123 | USER#PROFILE
Order: USER#123 | ORDER#2024-01-01
Address: USER#123 | ADDRESS#HOME
```

**Best practices:**
- Use prefixes for entity types
- Overload indexes
- Use generic attribute names
- Design for access patterns
- GSI for alternate queries

**Example Query:**
```python
# Get user and all orders
response = table.query(
    KeyConditionExpression='PK = :pk AND begins_with(SK, :sk)',
    ExpressionAttributeValues={
        ':pk': 'USER#123',
        ':sk': 'ORDER#'
    }
)
```

### 31. What are DynamoDB atomic counters?

Atomic counters allow increment/decrement operations without read-modify-write.

**Syntax:**
```python
table.update_item(
    Key={'productId': '123'},
    UpdateExpression='ADD viewCount :inc',
    ExpressionAttributeValues={':inc': 1}
)
```

**Characteristics:**
- Eventually consistent
- No conditional check
- Cannot cause validation errors
- Idempotency not guaranteed
- Can be negative

**Use cases:**
- View counts
- Like counters
- Inventory tracking
- Analytics

### 32. How do you handle large items in DynamoDB?

**Strategies for > 400 KB items:**

**1. Store in S3:**
```json
{
  "itemId": "123",
  "metadata": "...",
  "dataLocation": "s3://bucket/key"
}
```

**2. Compression:**
- Compress before storing
- Decompress on read
- Use gzip, zlib

**3. Attribute Projection:**
- Don't index large attributes
- Use sparse indexes

**4. Splitting Items:**
```
Item 1: ID | CHUNK#1
Item 2: ID | CHUNK#2
Item 3: ID | CHUNK#3
```

### 33. What is DynamoDB Backups and Restore?

**Two types of backups:**

**1. On-Demand Backup:**
- Manual backups
- Retained until deleted
- No performance impact
- Full table backup
- Cross-region copy supported

**2. Point-in-Time Recovery (PITR):**
- Continuous backups
- 35-day retention
- Second-level granularity
- Automatic incremental

**Restore options:**
- Same region or cross-region
- New table name
- Same or different encryption
- Exclude indexes

### 34. How does DynamoDB encryption work?

**Encryption at Rest:**
- All tables encrypted by default
- Three encryption options:
  1. **AWS owned key**: Default, free
  2. **AWS managed key**: Free, CloudTrail logs
  3. **Customer managed key**: Full control, cost applies

**Encryption in Transit:**
- TLS/SSL for API calls
- VPC endpoints supported

**Features:**
- Transparent encryption
- No performance impact
- Applies to table and indexes
- Streams and backups also encrypted

### 35. What are DynamoDB VPC Endpoints?

VPC Endpoints allow private connectivity to DynamoDB without internet gateway.

**Benefits:**
- Enhanced security
- Lower latency
- No data transfer charges
- Private traffic within AWS network

**Types:**
- Gateway endpoints (for DynamoDB)
- Free of charge
- Route table entries

**Configuration:**
```json
{
  "RouteTable": "rtb-xxx",
  "Service": "com.amazonaws.region.dynamodb"
}
```

### 36. How do you monitor DynamoDB performance?

**CloudWatch Metrics:**
- `ConsumedReadCapacityUnits`
- `ConsumedWriteCapacityUnits`
- `UserErrors` (400-level errors)
- `SystemErrors` (500-level errors)
- `ThrottledRequests`
- `ReadThrottleEvents`/`WriteThrottleEvents`

**CloudWatch Contributor Insights:**
- Most accessed items
- Most throttled keys
- Traffic patterns

**X-Ray:**
- End-to-end tracing
- Latency analysis
- Error tracking

**Best Practices:**
- Set CloudWatch alarms
- Monitor throttling
- Track consumed capacity
- Use dashboards

### 37. What are common causes of throttling in DynamoDB?

**Causes:**

1. **Insufficient Capacity:**
   - Exceeded provisioned RCU/WCU
   - Solution: Increase capacity or use on-demand

2. **Hot Partitions:**
   - Uneven key distribution
   - Solution: Better partition key design

3. **Large Items:**
   - Items consume multiple units
   - Solution: Optimize item size

4. **Burst Capacity Exhausted:**
   - Temporary spike handling limit
   - Solution: Use adaptive capacity

5. **GSI Throttling:**
   - GSI capacity too low
   - Solution: Increase GSI throughput

6. **Table/Account Limits:**
   - Concurrent operations limit
   - Solution: Request limit increase

### 38. Explain DynamoDB Conflict Resolution in Global Tables

**Last Writer Wins (LWW):**
- Default conflict resolution
- Based on timestamp
- Most recent write wins
- Microsecond precision

**How it works:**
```
Region A writes at T1: value = "A"
Region B writes at T2: value = "B"
T2 > T1: value = "B" wins across all regions
```

**Considerations:**
- Clock skew minimized by AWS
- Cannot customize resolution logic
- Design to avoid conflicts
- Use unique identifiers per region

**Avoiding conflicts:**
- Region-specific partition keys
- Separate workloads by region
- Use version vectors

### 39. What are DynamoDB Limits and Quotas?

**Hard Limits:**
- Item size: 400 KB
- Partition key: 2048 bytes
- Sort key: 1024 bytes
- LSI per table: 5
- GSI per table: 20
- Attribute depth: 32 levels

**Soft Limits (can be increased):**
- Table count per region: 2,500
- Provisioned throughput: 40,000 RCU/WCU per table
- On-demand throughput: Higher, automatic

**API Limits:**
- BatchGetItem: 100 items, 16 MB
- BatchWriteItem: 25 items, 16 MB
- Query/Scan: 1 MB per request
- TransactWriteItems: 100 items, 4 MB
- TransactReadItems: 100 items, 4 MB

### 40. How do you optimize costs in DynamoDB?

**Strategies:**

**1. Choose Right Capacity Mode:**
- On-demand for unpredictable
- Provisioned for predictable
- Reserved capacity for long-term

**2. Use TTL:**
- Auto-delete expired data
- No capacity consumed
- Reduces storage costs

**3. Optimize Indexes:**
- Only necessary indexes
- Project only required attributes
- Remove unused indexes

**4. Reduce Item Size:**
- Shorter attribute names
- Compress large attributes
- Remove null attributes

**5. Use Batch Operations:**
- Reduce API calls
- Better throughput utilization

**6. Right-size Throughput:**
- Monitor actual usage
- Use Auto Scaling
- Avoid over-provisioning

**7. Use Standard-IA Table Class:**
- For infrequently accessed data
- Lower storage cost
- Slightly higher read/write cost

**8. Data Compression:**
- Compress before storing
- Reduces storage and transfer

---

These comprehensive DynamoDB interview questions cover fundamental concepts through advanced patterns and best practices, preparing you for interviews at any level!

