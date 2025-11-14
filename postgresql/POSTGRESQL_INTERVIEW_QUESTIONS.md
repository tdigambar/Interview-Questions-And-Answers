# PostgreSQL Interview Questions and Answers

This comprehensive guide covers essential PostgreSQL interview questions from basic concepts to advanced topics. Each question includes detailed answers with practical code examples.

## Table of Contents

1. [PostgreSQL Fundamentals](#postgresql-fundamentals)
2. [Data Types](#data-types)
3. [Indexes](#indexes)
4. [Transactions and Concurrency](#transactions-and-concurrency)
5. [Performance Optimization](#performance-optimization)
6. [Advanced Features](#advanced-features)
7. [Administration](#administration)
8. [Security](#security)
9. [Backup and Recovery](#backup-and-recovery)
10. [Replication and High Availability](#replication-and-high-availability)

---

## PostgreSQL Fundamentals

### 1. What is PostgreSQL and what are its key features?

**Answer:**
PostgreSQL is a powerful, open-source object-relational database management system (ORDBMS) that uses and extends the SQL language.

**Key Features:**

1. **ACID Compliance**: Full ACID (Atomicity, Consistency, Isolation, Durability) support
2. **Extensibility**: Custom data types, functions, operators, and procedural languages
3. **Advanced Data Types**: JSON, JSONB, Arrays, Hstore, Range types, UUID, etc.
4. **Full-Text Search**: Built-in full-text search capabilities
5. **MVCC**: Multi-Version Concurrency Control for high concurrency
6. **Foreign Data Wrappers**: Access external data sources
7. **Partitioning**: Table partitioning for large datasets
8. **Replication**: Built-in streaming replication
9. **Window Functions**: Advanced analytical functions
10. **Common Table Expressions (CTEs)**: Recursive queries support

**Example:**
```sql
-- PostgreSQL supports advanced data types
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100),
    tags TEXT[],
    metadata JSONB,
    price_range NUMRANGE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert with array and JSONB
INSERT INTO products (name, tags, metadata) VALUES (
    'Laptop',
    ARRAY['electronics', 'computers'],
    '{"brand": "Dell", "specs": {"ram": "16GB", "storage": "512GB"}}'::jsonb
);
```

### 2. What is the difference between PostgreSQL and MySQL?

**Answer:**

| Feature | PostgreSQL | MySQL |
|----------|------------|-------|
| **Type** | Object-relational DBMS | Relational DBMS |
| **ACID** | Full ACID compliance | ACID with InnoDB |
| **Data Types** | Rich set (JSONB, Arrays, Range, etc.) | Standard types |
| **Complex Queries** | Excellent support | Limited |
| **Window Functions** | Full support | Limited (MySQL 8.0+) |
| **CTEs** | Full support including recursive | Limited (MySQL 8.0+) |
| **Full-Text Search** | Advanced built-in | Basic |
| **Extensibility** | Highly extensible | Limited |
| **JSON Support** | JSONB (binary, indexed) | JSON (text-based) |
| **Replication** | Streaming replication | Master-slave, group replication |
| **License** | PostgreSQL License (BSD-like) | GPL or Commercial |

**Example:**
```sql
-- PostgreSQL: JSONB with indexing
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    profile JSONB
);

CREATE INDEX idx_profile_gin ON users USING GIN (profile);

-- Query JSONB efficiently
SELECT * FROM users WHERE profile @> '{"city": "New York"}'::jsonb;
```

### 3. What are PostgreSQL data types?

**Answer:**
PostgreSQL provides a rich set of data types beyond standard SQL types.

**Standard Types:**
```sql
-- Numeric types
INTEGER, BIGINT, SMALLINT
DECIMAL(p, s), NUMERIC(p, s)
REAL, DOUBLE PRECISION
MONEY

-- Character types
VARCHAR(n), CHAR(n), TEXT

-- Date/Time types
DATE, TIME, TIMESTAMP
TIMESTAMP WITH TIME ZONE
INTERVAL

-- Boolean
BOOLEAN

-- Binary
BYTEA
```

**PostgreSQL-Specific Types:**
```sql
-- JSON types
JSON        -- Text-based JSON
JSONB       -- Binary JSON (indexed, faster)

-- Array types
INTEGER[], TEXT[], JSONB[]

-- Range types
INT4RANGE, INT8RANGE
NUMRANGE, TSRANGE, TSTZRANGE
DATERANGE

-- Network types
INET, CIDR, MACADDR

-- Geometric types
POINT, LINE, LSEG, BOX, PATH, POLYGON, CIRCLE

-- UUID
UUID

-- Hstore (key-value)
HSTORE

-- Text search
TSVECTOR, TSQUERY
```

**Example:**
```sql
CREATE TABLE example (
    id SERIAL PRIMARY KEY,
    name TEXT,
    tags TEXT[],
    metadata JSONB,
    ip_address INET,
    price_range NUMRANGE,
    location POINT,
    created_at TIMESTAMP WITH TIME ZONE
);

INSERT INTO example (name, tags, metadata, ip_address, price_range, location) VALUES (
    'Product',
    ARRAY['tag1', 'tag2'],
    '{"key": "value"}'::jsonb,
    '192.168.1.1',
    '[10.00, 100.00]'::numrange,
    POINT(40.7128, -74.0060)
);
```

### 4. What is the difference between JSON and JSONB in PostgreSQL?

**Answer:**

**JSON:**
- Stored as text (exact copy of input)
- Preserves whitespace and key order
- Slower to query (must parse each time)
- Cannot be indexed directly
- Faster to insert (no processing)

**JSONB:**
- Stored in binary format (decomposed)
- Removes whitespace, key order not preserved
- Faster to query (pre-parsed)
- Can be indexed (GIN indexes)
- Slower to insert (processing overhead)

**Example:**
```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    data_json JSON,
    data_jsonb JSONB
);

INSERT INTO products (data_json, data_jsonb) VALUES (
    '{"name": "Laptop", "price": 999}',
    '{"name": "Laptop", "price": 999}'::jsonb
);

-- JSON: Text-based query (slower)
SELECT * FROM products WHERE data_json->>'name' = 'Laptop';

-- JSONB: Binary query (faster)
SELECT * FROM products WHERE data_jsonb->>'name' = 'Laptop';

-- JSONB with GIN index (very fast)
CREATE INDEX idx_jsonb_gin ON products USING GIN (data_jsonb);
SELECT * FROM products WHERE data_jsonb @> '{"name": "Laptop"}'::jsonb;
```

**When to use:**
- **JSON**: When you need to preserve exact formatting or rarely query the data
- **JSONB**: When you need to query, index, or frequently access JSON data

### 5. What is SERIAL and how does it work?

**Answer:**
SERIAL is a PostgreSQL convenience type that creates an auto-incrementing integer column.

**Types:**
- `SERIAL` → `INTEGER` (1 to 2,147,483,647)
- `BIGSERIAL` → `BIGINT` (1 to 9,223,372,036,854,775,807)
- `SMALLSERIAL` → `SMALLINT` (1 to 32,767)

**How it works:**
SERIAL is actually a shorthand that creates:
1. A sequence
2. A column of the appropriate integer type
3. A default value that uses `nextval()` on the sequence

**Example:**
```sql
-- This:
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100)
);

-- Is equivalent to:
CREATE SEQUENCE users_id_seq;
CREATE TABLE users (
    id INTEGER NOT NULL DEFAULT nextval('users_id_seq'),
    name VARCHAR(100),
    PRIMARY KEY (id)
);
ALTER SEQUENCE users_id_seq OWNED BY users.id;

-- Using SERIAL
INSERT INTO users (name) VALUES ('John');  -- id auto-generated

-- Manual sequence control
SELECT nextval('users_id_seq');
SELECT currval('users_id_seq');
SELECT setval('users_id_seq', 100);

-- Reset sequence
ALTER SEQUENCE users_id_seq RESTART WITH 1;
```

### 6. What are sequences in PostgreSQL?

**Answer:**
Sequences are database objects that generate a sequence of unique integers, typically used for primary keys.

**Creating Sequences:**
```sql
-- Create sequence
CREATE SEQUENCE user_id_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

-- Use in table
CREATE TABLE users (
    id INTEGER DEFAULT nextval('user_id_seq'),
    name VARCHAR(100)
);

-- Or use SERIAL (creates sequence automatically)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100)
);
```

**Sequence Functions:**
```sql
-- Get next value
SELECT nextval('user_id_seq');

-- Get current value (in current session)
SELECT currval('user_id_seq');

-- Set value
SELECT setval('user_id_seq', 100);

-- Get last value (across sessions)
SELECT last_value FROM user_id_seq;
```

**Example:**
```sql
-- Create sequence with specific options
CREATE SEQUENCE order_number_seq
    START WITH 1000
    INCREMENT BY 1
    MINVALUE 1000
    NO MAXVALUE
    CACHE 20;

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number INTEGER DEFAULT nextval('order_number_seq'),
    customer_id INTEGER,
    order_date DATE DEFAULT CURRENT_DATE
);

-- Insert (order_number auto-generated)
INSERT INTO orders (customer_id) VALUES (123);
-- order_number will be 1000, 1001, 1002, etc.
```

---

## Data Types

### 7. What are arrays in PostgreSQL and how do you use them?

**Answer:**
PostgreSQL supports arrays of any built-in or user-defined type.

**Creating Arrays:**
```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    tags TEXT[],
    prices NUMERIC[],
    dimensions INTEGER[3]  -- Fixed size array
);

-- Insert arrays
INSERT INTO products (name, tags, prices) VALUES (
    'Laptop',
    ARRAY['electronics', 'computers', 'gadgets'],
    ARRAY[999.99, 899.99, 799.99]
);

-- Or using literal syntax
INSERT INTO products (name, tags) VALUES (
    'Phone',
    '{"mobile", "electronics", "smartphone"}'
);
```

**Array Operations:**
```sql
-- Access array elements (1-indexed)
SELECT tags[1] FROM products;  -- First tag
SELECT tags[1:2] FROM products;  -- First two tags

-- Array length
SELECT array_length(tags, 1) FROM products;

-- Check if array contains value
SELECT * FROM products WHERE 'electronics' = ANY(tags);
SELECT * FROM products WHERE 'electronics' IN (SELECT unnest(tags));

-- Check if array contains all values
SELECT * FROM products WHERE tags @> ARRAY['electronics', 'computers'];

-- Append to array
UPDATE products SET tags = array_append(tags, 'new-tag') WHERE id = 1;
UPDATE products SET tags = tags || 'new-tag' WHERE id = 1;

-- Remove from array
UPDATE products SET tags = array_remove(tags, 'old-tag') WHERE id = 1;

-- Unnest (expand array to rows)
SELECT id, unnest(tags) AS tag FROM products;
```

**Array Functions:**
```sql
-- Concatenate arrays
SELECT ARRAY[1, 2] || ARRAY[3, 4];  -- {1,2,3,4}

-- Array intersection
SELECT ARRAY[1, 2, 3] && ARRAY[2, 3, 4];  -- true (overlap)

-- Array contains
SELECT ARRAY[1, 2, 3] @> ARRAY[1, 2];  -- true

-- Array contained by
SELECT ARRAY[1, 2] <@ ARRAY[1, 2, 3];  -- true
```

### 8. What are range types in PostgreSQL?

**Answer:**
Range types represent a range of values between two bounds. They're useful for representing intervals, time periods, numeric ranges, etc.

**Range Types:**
```sql
-- Integer ranges
INT4RANGE    -- Range of INTEGER
INT8RANGE    -- Range of BIGINT

-- Numeric ranges
NUMRANGE     -- Range of NUMERIC

-- Date/Time ranges
DATERANGE           -- Range of DATE
TSRANGE             -- Range of TIMESTAMP
TSTZRANGE           -- Range of TIMESTAMP WITH TIME ZONE

-- Custom ranges
CREATE TYPE floatrange AS RANGE (
    subtype = float8,
    subtype_diff = float8mi
);
```

**Creating and Using Ranges:**
```sql
CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    room_number INTEGER,
    stay_period DATERANGE,
    price_range NUMRANGE
);

-- Insert ranges
INSERT INTO reservations (room_number, stay_period, price_range) VALUES (
    101,
    '[2024-01-01, 2024-01-05)',
    '[100.00, 200.00]'::numrange
);

-- Range bounds
-- [ or ] = inclusive bound
-- ( or ) = exclusive bound
-- '[2024-01-01, 2024-01-05)' = includes start, excludes end
```

**Range Operators:**
```sql
-- Contains element
SELECT * FROM reservations WHERE stay_period @> '2024-01-02'::date;

-- Contains range
SELECT * FROM reservations WHERE stay_period @> '[2024-01-02, 2024-01-03]'::daterange;

-- Overlaps
SELECT * FROM reservations WHERE stay_period && '[2024-01-04, 2024-01-10]'::daterange;

-- Left of / Right of
SELECT * FROM reservations WHERE stay_period << '[2024-01-10, 2024-01-15]'::daterange;
SELECT * FROM reservations WHERE stay_period >> '[2024-01-10, 2024-01-15]'::daterange;

-- Adjacent
SELECT * FROM reservations WHERE stay_period -|- '[2024-01-05, 2024-01-10]'::daterange;
```

**Range Functions:**
```sql
-- Lower and upper bounds
SELECT lower(stay_period), upper(stay_period) FROM reservations;

-- Check if empty
SELECT * FROM reservations WHERE isempty(stay_period);

-- Range length
SELECT upper(stay_period) - lower(stay_period) AS duration FROM reservations;
```

### 9. What is HSTORE in PostgreSQL?

**Answer:**
HSTORE is a key-value data type for storing sets of key-value pairs within a single PostgreSQL value.

**Enabling HSTORE:**
```sql
-- Enable extension
CREATE EXTENSION IF NOT EXISTS hstore;
```

**Using HSTORE:**
```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    attributes HSTORE
);

-- Insert HSTORE data
INSERT INTO products (name, attributes) VALUES (
    'Laptop',
    'brand => Dell, color => Black, ram => 16GB, storage => 512GB'
);

-- Or using hstore() function
INSERT INTO products (name, attributes) VALUES (
    'Phone',
    hstore(ARRAY['brand', 'Samsung', 'color', 'Blue', 'storage', '128GB'])
);
```

**HSTORE Operations:**
```sql
-- Get value by key
SELECT attributes->'brand' FROM products;

-- Check if key exists
SELECT * FROM products WHERE attributes ? 'brand';

-- Check if key exists with value
SELECT * FROM products WHERE attributes @> 'brand => Dell';

-- Get all keys
SELECT akeys(attributes) FROM products;

-- Get all values
SELECT avals(attributes) FROM products;

-- Convert to JSON
SELECT hstore_to_json(attributes) FROM products;

-- Update HSTORE
UPDATE products 
SET attributes = attributes || 'warranty => 2 years'::hstore 
WHERE id = 1;

-- Delete key
UPDATE products 
SET attributes = delete(attributes, 'warranty') 
WHERE id = 1;
```

**HSTORE Indexing:**
```sql
-- GIN index for HSTORE
CREATE INDEX idx_attributes_gin ON products USING GIN (attributes);

-- Query using index
SELECT * FROM products WHERE attributes @> 'brand => Dell'::hstore;
```

---

## Indexes

### 10. What types of indexes does PostgreSQL support?

**Answer:**
PostgreSQL supports several index types, each optimized for different use cases.

**1. B-tree Index (Default):**
```sql
-- Default index type
CREATE INDEX idx_name ON users(name);
CREATE INDEX idx_email ON users(email);

-- Supports: <, <=, =, >=, >, BETWEEN, IN, IS NULL, IS NOT NULL
SELECT * FROM users WHERE name = 'John';
SELECT * FROM users WHERE email BETWEEN 'a' AND 'z';
```

**2. Hash Index:**
```sql
-- Only supports equality (=)
CREATE INDEX idx_email_hash ON users USING HASH (email);

SELECT * FROM users WHERE email = 'john@example.com';
```

**3. GIN (Generalized Inverted Index):**
```sql
-- For arrays, JSONB, full-text search
CREATE INDEX idx_tags_gin ON products USING GIN (tags);
CREATE INDEX idx_metadata_gin ON products USING GIN (metadata);

-- Array contains
SELECT * FROM products WHERE tags @> ARRAY['electronics'];

-- JSONB contains
SELECT * FROM products WHERE metadata @> '{"brand": "Dell"}'::jsonb;
```

**4. GiST (Generalized Search Tree):**
```sql
-- For geometric data, full-text search, range types
CREATE INDEX idx_location_gist ON places USING GIST (location);
CREATE INDEX idx_price_range_gist ON products USING GIST (price_range);

-- Range queries
SELECT * FROM products WHERE price_range && '[50, 100]'::numrange;
```

**5. SP-GiST (Space-Partitioned GiST):**
```sql
-- For non-balanced data structures
CREATE INDEX idx_ip_spgist ON logs USING SPGIST (ip_address);
```

**6. BRIN (Block Range Index):**
```sql
-- For very large tables with natural ordering
CREATE INDEX idx_created_at_brin ON orders USING BRIN (created_at);

-- Efficient for time-series data
SELECT * FROM orders WHERE created_at BETWEEN '2024-01-01' AND '2024-01-31';
```

**7. Partial Index:**
```sql
-- Index only subset of rows
CREATE INDEX idx_active_users ON users(email) WHERE is_active = true;

-- Only active users are indexed
SELECT * FROM users WHERE is_active = true AND email = 'john@example.com';
```

**8. Expression Index:**
```sql
-- Index on expression
CREATE INDEX idx_lower_name ON users(LOWER(name));

-- Query uses index
SELECT * FROM users WHERE LOWER(name) = 'john';
```

**9. Unique Index:**
```sql
-- Enforces uniqueness
CREATE UNIQUE INDEX idx_unique_email ON users(email);

-- Or using constraint
ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email);
```

**10. Composite Index:**
```sql
-- Multiple columns
CREATE INDEX idx_name_age ON users(name, age);

-- Order matters! Leftmost prefix
SELECT * FROM users WHERE name = 'John';  -- Uses index
SELECT * FROM users WHERE age = 25;  -- May not use index efficiently
SELECT * FROM users WHERE name = 'John' AND age = 25;  -- Uses index
```

### 11. What is the difference between B-tree and GIN indexes?

**Answer:**

**B-tree Index:**
- **Use case**: Standard columns (text, numbers, dates)
- **Operations**: Equality, range queries, sorting
- **Size**: Smaller
- **Update speed**: Fast
- **Query speed**: Very fast for standard queries

```sql
CREATE INDEX idx_name ON users(name);

-- Supports:
SELECT * FROM users WHERE name = 'John';
SELECT * FROM users WHERE name > 'A' AND name < 'Z';
SELECT * FROM users ORDER BY name;
```

**GIN Index:**
- **Use case**: Arrays, JSONB, full-text search
- **Operations**: Contains, overlap, array operations
- **Size**: Larger
- **Update speed**: Slower (more expensive to maintain)
- **Query speed**: Very fast for containment queries

```sql
CREATE INDEX idx_tags_gin ON products USING GIN (tags);
CREATE INDEX idx_metadata_gin ON products USING GIN (metadata);

-- Supports:
SELECT * FROM products WHERE tags @> ARRAY['electronics'];
SELECT * FROM products WHERE metadata @> '{"brand": "Dell"}'::jsonb;
```

**Comparison:**

| Feature | B-tree | GIN |
|---------|--------|-----|
| **Best for** | Standard columns | Arrays, JSONB, full-text |
| **Equality** | ✅ Excellent | ✅ Good |
| **Range queries** | ✅ Excellent | ❌ Not supported |
| **Contains** | ❌ Not efficient | ✅ Excellent |
| **Index size** | Small | Large |
| **Update cost** | Low | High |
| **Query speed** | Very fast | Very fast (for supported ops) |

**Example:**
```sql
-- B-tree for standard column
CREATE INDEX idx_email_btree ON users(email);
SELECT * FROM users WHERE email = 'john@example.com';  -- Fast

-- GIN for array
CREATE INDEX idx_tags_gin ON products USING GIN (tags);
SELECT * FROM products WHERE tags @> ARRAY['electronics'];  -- Fast

-- Wrong choice:
CREATE INDEX idx_tags_btree ON products(tags);  -- Won't help with @> operator
```

---

## Transactions and Concurrency

### 12. What is MVCC (Multi-Version Concurrency Control) in PostgreSQL?

**Answer:**
MVCC is a concurrency control method that allows multiple transactions to access the same data simultaneously without blocking each other.

**How MVCC Works:**
1. Each row has system columns: `xmin` (transaction that created it) and `xmax` (transaction that deleted it)
2. When a row is updated, PostgreSQL creates a new version instead of modifying the old one
3. Each transaction sees a snapshot of the database at the time it started
4. Old versions are cleaned up by VACUUM when no longer needed

**Benefits:**
- **No read locks**: Readers don't block writers, writers don't block readers
- **High concurrency**: Multiple transactions can work simultaneously
- **Consistent snapshots**: Each transaction sees a consistent view

**Example:**
```sql
-- Transaction 1 starts
BEGIN;
SELECT * FROM users WHERE id = 1;  -- Sees version A

-- Transaction 2 updates (doesn't block Transaction 1)
BEGIN;
UPDATE users SET name = 'John Updated' WHERE id = 1;
COMMIT;  -- Creates version B

-- Transaction 1 still sees version A
SELECT * FROM users WHERE id = 1;  -- Still sees old data

-- Transaction 1 commits
COMMIT;

-- New transaction sees version B
BEGIN;
SELECT * FROM users WHERE id = 1;  -- Sees 'John Updated'
COMMIT;
```

**System Columns:**
```sql
-- View transaction IDs
SELECT xmin, xmax, * FROM users;

-- xmin: Transaction ID that created the row
-- xmax: Transaction ID that deleted/updated the row (or 0 if not deleted)
```

**VACUUM:**
```sql
-- Clean up old row versions
VACUUM;

-- Analyze and update statistics
VACUUM ANALYZE;

-- Full vacuum (locks table)
VACUUM FULL;
```

### 13. What are transaction isolation levels in PostgreSQL?

**Answer:**
PostgreSQL supports four transaction isolation levels that control how transactions interact with each other.

**Isolation Levels:**

**1. READ UNCOMMITTED:**
- Not supported in PostgreSQL (treated as READ COMMITTED)
- Lowest isolation, allows dirty reads

**2. READ COMMITTED (Default):**
- Each statement sees only committed data
- Prevents dirty reads
- Allows non-repeatable reads and phantom reads

```sql
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
BEGIN;
SELECT * FROM accounts WHERE id = 1;  -- Sees committed data
-- Another transaction commits changes
SELECT * FROM accounts WHERE id = 1;  -- May see different data
COMMIT;
```

**3. REPEATABLE READ:**
- All statements in transaction see same snapshot
- Prevents dirty reads and non-repeatable reads
- May still have phantom reads (but not in PostgreSQL due to serializable snapshot isolation)

```sql
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
BEGIN;
SELECT * FROM accounts WHERE id = 1;  -- Snapshot taken
-- Another transaction commits changes
SELECT * FROM accounts WHERE id = 1;  -- Still sees same data
COMMIT;
```

**4. SERIALIZABLE:**
- Highest isolation level
- Transactions execute as if serially
- Prevents all concurrency issues
- May cause serialization failures (need to retry)

```sql
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
BEGIN;
-- Operations that would conflict with other serializable transactions
-- May get: ERROR: could not serialize access due to concurrent update
COMMIT;
```

**Comparison:**

| Isolation Level | Dirty Read | Non-Repeatable Read | Phantom Read |
|----------------|------------|---------------------|--------------|
| READ UNCOMMITTED | ✅ Possible | ✅ Possible | ✅ Possible |
| READ COMMITTED | ❌ No | ✅ Possible | ✅ Possible |
| REPEATABLE READ | ❌ No | ❌ No | ❌ No (in PostgreSQL) |
| SERIALIZABLE | ❌ No | ❌ No | ❌ No |

**Example:**
```sql
-- Session 1
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;
SELECT balance FROM accounts WHERE id = 1;  -- Returns 1000

-- Session 2
BEGIN;
UPDATE accounts SET balance = 2000 WHERE id = 1;
COMMIT;

-- Session 1
SELECT balance FROM accounts WHERE id = 1;  -- Still returns 1000 (same snapshot)
COMMIT;  -- Now sees 2000 in new transaction
```

### 14. What are table locks in PostgreSQL?

**Answer:**
PostgreSQL uses various lock types to manage concurrent access to database objects.

**Lock Modes (from least to most restrictive):**

**1. ACCESS SHARE:**
- Acquired by SELECT
- Compatible with all other locks except ACCESS EXCLUSIVE

**2. ROW SHARE:**
- Acquired by SELECT FOR UPDATE, SELECT FOR SHARE
- Compatible with most locks

**3. ROW EXCLUSIVE:**
- Acquired by INSERT, UPDATE, DELETE
- Compatible with ACCESS SHARE, ROW SHARE

**4. SHARE UPDATE EXCLUSIVE:**
- Acquired by VACUUM, CREATE INDEX CONCURRENTLY
- Prevents schema changes and VACUUM

**5. SHARE:**
- Acquired by CREATE INDEX (without CONCURRENTLY)
- Prevents data changes

**6. SHARE ROW EXCLUSIVE:**
- Acquired by CREATE TRIGGER
- Prevents most changes

**7. EXCLUSIVE:**
- Prevents concurrent data changes
- Allows concurrent reads

**8. ACCESS EXCLUSIVE:**
- Acquired by DROP TABLE, TRUNCATE, ALTER TABLE
- Most restrictive, blocks all operations

**Viewing Locks:**
```sql
-- View current locks
SELECT 
    locktype,
    relation::regclass,
    mode,
    granted,
    pid
FROM pg_locks
WHERE relation IS NOT NULL;

-- View blocking queries
SELECT 
    blocked_locks.pid AS blocked_pid,
    blocking_locks.pid AS blocking_pid,
    blocked_activity.query AS blocked_query,
    blocking_activity.query AS blocking_query
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid
JOIN pg_catalog.pg_locks blocking_locks 
    ON blocking_locks.locktype = blocked_locks.locktype
    AND blocking_locks.database IS NOT DISTINCT FROM blocked_locks.database
    AND blocking_locks.relation IS NOT DISTINCT FROM blocked_locks.relation
    AND blocking_locks.pid != blocked_locks.pid
JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted;
```

**Example:**
```sql
-- Session 1: Long-running transaction
BEGIN;
SELECT * FROM users FOR UPDATE;  -- Acquires ROW SHARE lock
-- Keep transaction open

-- Session 2: Tries to truncate (needs ACCESS EXCLUSIVE)
TRUNCATE TABLE users;  -- Blocks, waiting for Session 1

-- Session 1 commits
COMMIT;  -- Session 2 can now proceed
```

---

## Performance Optimization

### 15. How do you optimize PostgreSQL queries?

**Answer:**
PostgreSQL query optimization involves multiple strategies:

**1. Use EXPLAIN and EXPLAIN ANALYZE:**
```sql
-- Show query plan
EXPLAIN SELECT * FROM users WHERE email = 'john@example.com';

-- Show actual execution time
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'john@example.com';

-- Verbose output
EXPLAIN (ANALYZE, BUFFERS, VERBOSE) 
SELECT * FROM users WHERE email = 'john@example.com';
```

**2. Create Appropriate Indexes:**
```sql
-- Index frequently queried columns
CREATE INDEX idx_email ON users(email);

-- Composite indexes for multi-column queries
CREATE INDEX idx_name_age ON users(name, age);

-- Partial indexes for filtered queries
CREATE INDEX idx_active_users ON users(email) WHERE is_active = true;

-- Expression indexes
CREATE INDEX idx_lower_email ON users(LOWER(email));
```

**3. Use LIMIT:**
```sql
-- Limit result set
SELECT * FROM users ORDER BY created_at DESC LIMIT 10;
```

**4. Avoid SELECT *:**
```sql
-- ❌ Bad
SELECT * FROM users WHERE id = 1;

-- ✅ Good
SELECT id, name, email FROM users WHERE id = 1;
```

**5. Use WHERE to Filter Early:**
```sql
-- Filter before JOIN
SELECT u.name, o.amount
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE u.city = 'New York';
```

**6. Avoid Functions in WHERE:**
```sql
-- ❌ Bad (can't use index)
SELECT * FROM users WHERE EXTRACT(YEAR FROM created_at) = 2024;

-- ✅ Good
SELECT * FROM users 
WHERE created_at >= '2024-01-01' 
AND created_at < '2025-01-01';
```

**7. Use JOIN Instead of Subqueries:**
```sql
-- ❌ Slower
SELECT * FROM users 
WHERE id IN (SELECT user_id FROM orders);

-- ✅ Faster
SELECT DISTINCT u.* 
FROM users u
JOIN orders o ON u.id = o.user_id;
```

**8. Use EXISTS Instead of COUNT:**
```sql
-- ❌ Slower
SELECT * FROM users 
WHERE (SELECT COUNT(*) FROM orders WHERE user_id = users.id) > 0;

-- ✅ Faster
SELECT * FROM users u
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);
```

**9. Update Statistics:**
```sql
-- Update table statistics
ANALYZE users;

-- Update all tables
ANALYZE;
```

**10. Use Connection Pooling:**
- Use PgBouncer or similar
- Reduces connection overhead

### 16. What is VACUUM and why is it important?

**Answer:**
VACUUM reclaims storage occupied by dead tuples (deleted or updated rows) and updates statistics for the query planner.

**Why VACUUM is Needed:**
- MVCC creates new row versions on UPDATE
- Old versions become "dead tuples"
- Dead tuples consume space and slow queries
- VACUUM removes dead tuples and frees space

**Types of VACUUM:**

**1. VACUUM:**
```sql
-- Standard vacuum (non-blocking)
VACUUM;

-- Vacuum specific table
VACUUM users;

-- Vacuum and analyze
VACUUM ANALYZE users;
```

**2. VACUUM FULL:**
```sql
-- Full vacuum (locks table, reclaims all space)
VACUUM FULL users;

-- Use sparingly, locks table
```

**3. Autovacuum:**
- PostgreSQL automatically runs VACUUM
- Configured in postgresql.conf
- Monitors table statistics and runs when needed

**VACUUM Configuration:**
```sql
-- Check autovacuum settings
SHOW autovacuum;

-- View vacuum statistics
SELECT 
    schemaname,
    tablename,
    n_dead_tup,
    n_live_tup,
    last_vacuum,
    last_autovacuum
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC;
```

**When to Run VACUUM:**
- After large DELETE operations
- After many UPDATE operations
- Periodically (autovacuum handles this)
- When table bloat is detected

**Example:**
```sql
-- Check table bloat
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
    n_dead_tup,
    n_live_tup,
    ROUND(100.0 * n_dead_tup / NULLIF(n_live_tup + n_dead_tup, 0), 2) AS dead_pct
FROM pg_stat_user_tables
WHERE n_dead_tup > 0
ORDER BY dead_pct DESC;

-- Run vacuum if needed
VACUUM ANALYZE users;
```

### 17. What is query planning and how does it work?

**Answer:**
The query planner (optimizer) determines the most efficient way to execute a SQL query.

**Query Planning Process:**
1. **Parse**: SQL is parsed into a parse tree
2. **Rewrite**: Rules and views are applied
3. **Plan**: Planner generates execution plans
4. **Optimize**: Planner estimates costs and chooses best plan
5. **Execute**: Executor runs the chosen plan

**Viewing Query Plans:**
```sql
-- Basic plan
EXPLAIN SELECT * FROM users WHERE email = 'john@example.com';

-- With actual execution
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'john@example.com';

-- Detailed plan
EXPLAIN (ANALYZE, BUFFERS, VERBOSE, FORMAT JSON)
SELECT * FROM users WHERE email = 'john@example.com';
```

**Plan Types:**

**1. Seq Scan (Sequential Scan):**
```sql
EXPLAIN SELECT * FROM users;
-- Seq Scan on users  (cost=0.00..100.00 rows=1000 width=64)
```
- Scans entire table
- Used when no index or index not beneficial

**2. Index Scan:**
```sql
EXPLAIN SELECT * FROM users WHERE id = 1;
-- Index Scan using users_pkey on users  (cost=0.29..8.30 rows=1 width=64)
```
- Uses index to find rows
- Faster than sequential scan

**3. Index Only Scan:**
```sql
EXPLAIN SELECT id FROM users WHERE id < 100;
-- Index Only Scan using users_pkey on users  (cost=0.29..4.30 rows=99 width=4)
```
- Only reads index, not table
- Fastest when all needed columns are in index

**4. Bitmap Heap Scan:**
```sql
EXPLAIN SELECT * FROM users WHERE age BETWEEN 25 AND 35;
-- Bitmap Heap Scan on users  (cost=4.30..20.50 rows=100 width=64)
--   -> Bitmap Index Scan on idx_age  (cost=0.00..4.28 rows=100 width=0)
```
- Uses index to build bitmap of row locations
- Good for range queries

**5. Nested Loop:**
```sql
EXPLAIN SELECT u.name, o.amount 
FROM users u 
JOIN orders o ON u.id = o.user_id;
-- Nested Loop  (cost=0.29..50.00 rows=1000 width=64)
--   -> Seq Scan on users u  (cost=0.00..10.00 rows=100 width=32)
--   -> Index Scan using orders_user_id_idx on orders o  (cost=0.29..0.40 rows=10 width=32)
```
- Good for small tables or when one side has index
- Can be slow for large datasets

**6. Hash Join:**
```sql
EXPLAIN SELECT u.name, o.amount 
FROM users u 
JOIN orders o ON u.id = o.user_id;
-- Hash Join  (cost=20.00..50.00 rows=1000 width=64)
--   Hash Cond: (o.user_id = u.id)
--   -> Seq Scan on orders o  (cost=0.00..25.00 rows=1000 width=32)
--   -> Hash  (cost=10.00..10.00 rows=100 width=32)
--       -> Seq Scan on users u  (cost=0.00..10.00 rows=100 width=32)
```
- Builds hash table from smaller table
- Good for larger datasets

**7. Merge Join:**
```sql
EXPLAIN SELECT u.name, o.amount 
FROM users u 
JOIN orders o ON u.id = o.user_id
ORDER BY u.id;
-- Merge Join  (cost=30.00..60.00 rows=1000 width=64)
--   Merge Cond: (u.id = o.user_id)
--   -> Index Scan using users_pkey on users u  (cost=0.29..10.00 rows=100 width=32)
--   -> Index Scan using orders_user_id_idx on orders o  (cost=0.29..40.00 rows=1000 width=32)
```
- Requires sorted inputs
- Good when both sides are sorted

**Optimizing Query Plans:**
```sql
-- Update statistics
ANALYZE users;

-- Force index usage (not recommended, usually)
SET enable_seqscan = off;
SELECT * FROM users WHERE email = 'john@example.com';
SET enable_seqscan = on;

-- Check if index is used
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'john@example.com';
```

---

## Advanced Features

### 18. What are Common Table Expressions (CTEs) and recursive queries?

**Answer:**
CTEs (WITH clauses) allow you to define temporary result sets that exist only for the duration of a query.

**Basic CTE:**
```sql
-- Simple CTE
WITH recent_orders AS (
    SELECT * FROM orders 
    WHERE order_date >= CURRENT_DATE - INTERVAL '30 days'
)
SELECT * FROM recent_orders 
WHERE amount > 100;

-- Multiple CTEs
WITH 
    active_users AS (
        SELECT * FROM users WHERE is_active = true
    ),
    user_orders AS (
        SELECT u.id, COUNT(o.id) as order_count
        FROM active_users u
        LEFT JOIN orders o ON u.id = o.user_id
        GROUP BY u.id
    )
SELECT * FROM user_orders WHERE order_count > 5;
```

**Recursive CTE:**
```sql
-- Find all managers in hierarchy
WITH RECURSIVE manager_hierarchy AS (
    -- Base case: top-level managers
    SELECT id, name, manager_id, 1 as level
    FROM employees
    WHERE manager_id IS NULL
    
    UNION ALL
    
    -- Recursive case: employees reporting to managers
    SELECT e.id, e.name, e.manager_id, mh.level + 1
    FROM employees e
    JOIN manager_hierarchy mh ON e.manager_id = mh.id
)
SELECT * FROM manager_hierarchy ORDER BY level, name;

-- Generate series
WITH RECURSIVE numbers AS (
    SELECT 1 AS n
    UNION ALL
    SELECT n + 1 FROM numbers WHERE n < 10
)
SELECT * FROM numbers;
```

**Example: Hierarchical Data:**
```sql
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    parent_id INTEGER REFERENCES categories(id)
);

-- Find all subcategories
WITH RECURSIVE category_tree AS (
    SELECT id, name, parent_id, ARRAY[id] AS path
    FROM categories
    WHERE parent_id IS NULL
    
    UNION ALL
    
    SELECT c.id, c.name, c.parent_id, ct.path || c.id
    FROM categories c
    JOIN category_tree ct ON c.parent_id = ct.id
)
SELECT * FROM category_tree;
```

### 19. What are window functions in PostgreSQL?

**Answer:**
Window functions perform calculations across a set of rows related to the current row without collapsing rows into groups.

**Ranking Functions:**
```sql
-- ROW_NUMBER: Sequential numbering
SELECT 
    name,
    salary,
    ROW_NUMBER() OVER (ORDER BY salary DESC) as rank
FROM employees;

-- RANK: Ranks with gaps for ties
SELECT 
    name,
    salary,
    RANK() OVER (ORDER BY salary DESC) as rank
FROM employees;

-- DENSE_RANK: Ranks without gaps
SELECT 
    name,
    salary,
    DENSE_RANK() OVER (ORDER BY salary DESC) as rank
FROM employees;

-- PERCENT_RANK: Relative rank (0 to 1)
SELECT 
    name,
    salary,
    PERCENT_RANK() OVER (ORDER BY salary DESC) as pct_rank
FROM employees;
```

**Aggregate Window Functions:**
```sql
-- Running total
SELECT 
    order_date,
    amount,
    SUM(amount) OVER (ORDER BY order_date) as running_total
FROM orders;

-- Average by department
SELECT 
    name,
    department_id,
    salary,
    AVG(salary) OVER (PARTITION BY department_id) as dept_avg_salary
FROM employees;

-- Window frame
SELECT 
    order_date,
    amount,
    SUM(amount) OVER (
        ORDER BY order_date 
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) as three_day_total
FROM orders;
```

**Value Functions:**
```sql
-- LAG / LEAD: Access previous/next row
SELECT 
    order_date,
    amount,
    LAG(amount) OVER (ORDER BY order_date) as prev_amount,
    LEAD(amount) OVER (ORDER BY order_date) as next_amount
FROM orders;

-- FIRST_VALUE / LAST_VALUE
SELECT 
    name,
    department_id,
    salary,
    FIRST_VALUE(salary) OVER (
        PARTITION BY department_id 
        ORDER BY salary DESC
    ) as highest_salary
FROM employees;

-- NTH_VALUE
SELECT 
    name,
    salary,
    NTH_VALUE(salary, 3) OVER (
        ORDER BY salary DESC
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) as third_highest
FROM employees;
```

**Partitioning:**
```sql
-- Calculate rank within each department
SELECT 
    name,
    department_id,
    salary,
    RANK() OVER (
        PARTITION BY department_id 
        ORDER BY salary DESC
    ) as dept_rank
FROM employees;
```

### 20. What is table partitioning in PostgreSQL?

**Answer:**
Partitioning splits a large table into smaller, more manageable pieces called partitions.

**Types of Partitioning:**

**1. Range Partitioning:**
```sql
-- Create partitioned table
CREATE TABLE orders (
    id SERIAL,
    order_date DATE NOT NULL,
    customer_id INTEGER,
    amount DECIMAL(10, 2)
) PARTITION BY RANGE (order_date);

-- Create partitions
CREATE TABLE orders_2024_q1 PARTITION OF orders
    FOR VALUES FROM ('2024-01-01') TO ('2024-04-01');

CREATE TABLE orders_2024_q2 PARTITION OF orders
    FOR VALUES FROM ('2024-04-01') TO ('2024-07-01');

CREATE TABLE orders_2024_q3 PARTITION OF orders
    FOR VALUES FROM ('2024-07-01') TO ('2024-10-01');

CREATE TABLE orders_2024_q4 PARTITION OF orders
    FOR VALUES FROM ('2024-10-01') TO ('2025-01-01');

-- Default partition
CREATE TABLE orders_default PARTITION OF orders DEFAULT;
```

**2. List Partitioning:**
```sql
CREATE TABLE sales (
    id SERIAL,
    region VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2)
) PARTITION BY LIST (region);

CREATE TABLE sales_north PARTITION OF sales
    FOR VALUES IN ('NY', 'MA', 'CT');

CREATE TABLE sales_south PARTITION OF sales
    FOR VALUES IN ('FL', 'GA', 'TX');

CREATE TABLE sales_west PARTITION OF sales
    FOR VALUES IN ('CA', 'OR', 'WA');
```

**3. Hash Partitioning:**
```sql
CREATE TABLE users (
    id SERIAL,
    name VARCHAR(100),
    email VARCHAR(100)
) PARTITION BY HASH (id);

CREATE TABLE users_0 PARTITION OF users
    FOR VALUES WITH (MODULUS 4, REMAINDER 0);

CREATE TABLE users_1 PARTITION OF users
    FOR VALUES WITH (MODULUS 4, REMAINDER 1);

CREATE TABLE users_2 PARTITION OF users
    FOR VALUES WITH (MODULUS 4, REMAINDER 2);

CREATE TABLE users_3 PARTITION OF users
    FOR VALUES WITH (MODULUS 4, REMAINDER 3);
```

**Partition Management:**
```sql
-- Add new partition
CREATE TABLE orders_2025_q1 PARTITION OF orders
    FOR VALUES FROM ('2025-01-01') TO ('2025-04-01');

-- Detach partition
ALTER TABLE orders DETACH PARTITION orders_2024_q1;

-- Attach partition
CREATE TABLE orders_old (
    LIKE orders INCLUDING ALL
);
ALTER TABLE orders ATTACH PARTITION orders_old
    FOR VALUES FROM ('2020-01-01') TO ('2021-01-01');

-- View partitions
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public' 
AND tablename LIKE 'orders_%';
```

**Benefits:**
- Faster queries (partition pruning)
- Easier maintenance (drop old partitions)
- Better performance for large tables
- Parallel operations on partitions

### 21. What is full-text search in PostgreSQL?

**Answer:**
PostgreSQL provides built-in full-text search capabilities using `tsvector` and `tsquery` types.

**Basic Full-Text Search:**
```sql
-- Create table with full-text search
CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200),
    content TEXT,
    search_vector TSVECTOR
);

-- Create GIN index
CREATE INDEX idx_search_vector ON articles USING GIN (search_vector);

-- Update search vector
UPDATE articles 
SET search_vector = 
    setweight(to_tsvector('english', title), 'A') ||
    setweight(to_tsvector('english', content), 'B');

-- Or use generated column (PostgreSQL 12+)
ALTER TABLE articles 
ADD COLUMN search_vector TSVECTOR 
GENERATED ALWAYS AS (
    setweight(to_tsvector('english', COALESCE(title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(content, '')), 'B')
) STORED;

-- Search
SELECT title, content
FROM articles
WHERE search_vector @@ to_tsquery('english', 'database & postgresql');

-- Rank results
SELECT 
    title,
    content,
    ts_rank(search_vector, to_tsquery('english', 'database & postgresql')) AS rank
FROM articles
WHERE search_vector @@ to_tsquery('english', 'database & postgresql')
ORDER BY rank DESC;
```

**Full-Text Search Operators:**
```sql
-- & (AND)
SELECT * FROM articles 
WHERE search_vector @@ to_tsquery('english', 'database & postgresql');

-- | (OR)
SELECT * FROM articles 
WHERE search_vector @@ to_tsquery('english', 'database | mysql');

-- ! (NOT)
SELECT * FROM articles 
WHERE search_vector @@ to_tsquery('english', 'database & !mysql');

-- Phrase search
SELECT * FROM articles 
WHERE search_vector @@ phraseto_tsquery('english', 'postgresql database');
```

**Text Search Functions:**
```sql
-- to_tsvector: Convert text to searchable vector
SELECT to_tsvector('english', 'PostgreSQL is a powerful database');

-- to_tsquery: Convert text to query
SELECT to_tsquery('english', 'postgresql & database');

-- plainto_tsquery: Convert plain text to query
SELECT plainto_tsquery('english', 'postgresql database');

-- ts_rank: Rank search results
SELECT ts_rank(
    to_tsvector('english', 'PostgreSQL is a database'),
    to_tsquery('english', 'database')
);
```

### 22. What are PostgreSQL extensions?

**Answer:**
Extensions add functionality to PostgreSQL. They can include data types, functions, operators, index methods, etc.

**Common Extensions:**
```sql
-- List available extensions
SELECT * FROM pg_available_extensions;

-- List installed extensions
SELECT * FROM pg_extension;

-- Install extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- Trigram similarity
CREATE EXTENSION IF NOT EXISTS "btree_gin";  -- GIN index for btree
CREATE EXTENSION IF NOT EXISTS "hstore";  -- Key-value storage
CREATE EXTENSION IF NOT EXISTS "postgis";  -- Geographic objects
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";  -- Query statistics

-- Remove extension
DROP EXTENSION IF EXISTS "uuid-ossp";
```

**Useful Extensions:**

**1. pg_trgm (Trigram):**
```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create trigram index
CREATE INDEX idx_name_trgm ON users USING GIN (name gin_trgm_ops);

-- Similarity search
SELECT name, similarity(name, 'John') AS sim
FROM users
WHERE name % 'John'  -- Similarity operator
ORDER BY sim DESC;
```

**2. pg_stat_statements:**
```sql
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- View query statistics
SELECT 
    query,
    calls,
    total_exec_time,
    mean_exec_time,
    max_exec_time
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;
```

**3. uuid-ossp:**
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Generate UUIDs
SELECT uuid_generate_v4();
SELECT uuid_generate_v1();

-- Use in table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100)
);
```

---

## Administration

### 23. How do you monitor PostgreSQL performance?

**Answer:**
PostgreSQL provides several ways to monitor database performance.

**1. pg_stat_statements:**
```sql
-- Enable extension
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- View top queries
SELECT 
    query,
    calls,
    total_exec_time,
    mean_exec_time,
    max_exec_time,
    rows
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;
```

**2. pg_stat_activity:**
```sql
-- View active connections
SELECT 
    pid,
    usename,
    application_name,
    client_addr,
    state,
    query,
    query_start,
    state_change
FROM pg_stat_activity
WHERE state = 'active';

-- View blocking queries
SELECT 
    blocked_locks.pid AS blocked_pid,
    blocking_locks.pid AS blocking_pid,
    blocked_activity.query AS blocked_query,
    blocking_activity.query AS blocking_query
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid
JOIN pg_catalog.pg_locks blocking_locks 
    ON blocking_locks.locktype = blocked_locks.locktype
    AND blocking_locks.database IS NOT DISTINCT FROM blocked_locks.database
    AND blocking_locks.relation IS NOT DISTINCT FROM blocked_locks.relation
    AND blocking_locks.pid != blocked_locks.pid
JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted;
```

**3. Table Statistics:**
```sql
-- View table statistics
SELECT 
    schemaname,
    tablename,
    n_live_tup,
    n_dead_tup,
    last_vacuum,
    last_autovacuum,
    last_analyze,
    last_autoanalyze
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC;

-- View index statistics
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan;
```

**4. Database Size:**
```sql
-- Database sizes
SELECT 
    datname,
    pg_size_pretty(pg_database_size(datname)) AS size
FROM pg_database
ORDER BY pg_database_size(datname) DESC;

-- Table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

**5. Slow Query Log:**
```sql
-- Enable logging (in postgresql.conf)
-- log_min_duration_statement = 1000  -- Log queries > 1 second
-- log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '
-- log_statement = 'all'  -- Log all statements
```

### 24. How do you configure PostgreSQL?

**Answer:**
PostgreSQL configuration is managed through `postgresql.conf` and can be changed at runtime.

**Key Configuration Parameters:**
```sql
-- View current settings
SHOW shared_buffers;
SHOW work_mem;
SHOW max_connections;

-- View all settings
SHOW ALL;

-- Change setting (session level)
SET work_mem = '256MB';

-- Change setting (database level)
ALTER DATABASE mydb SET work_mem = '256MB';

-- Change setting (system level, requires restart)
-- Edit postgresql.conf:
-- shared_buffers = 256MB
-- max_connections = 100
-- work_mem = 4MB
-- maintenance_work_mem = 64MB
```

**Important Settings:**
```sql
-- Memory settings
shared_buffers = 256MB          -- Shared memory for caching
work_mem = 4MB                  -- Memory for sort operations
maintenance_work_mem = 64MB     -- Memory for maintenance operations
effective_cache_size = 1GB      -- Estimated OS cache size

-- Connection settings
max_connections = 100           -- Maximum concurrent connections
listen_addresses = '*'           -- IP addresses to listen on
port = 5432                      -- Port number

-- Write settings
wal_buffers = 16MB              -- WAL buffer size
checkpoint_timeout = 5min       -- Time between checkpoints
max_wal_size = 1GB              -- Maximum WAL size

-- Query planner
random_page_cost = 4.0          -- Cost of random disk access
effective_io_concurrency = 2    -- Concurrent I/O operations
```

**Reload Configuration:**
```sql
-- Reload configuration (no restart needed)
SELECT pg_reload_conf();

-- Or from command line
-- pg_ctl reload
```

---

## Security

### 25. How do you manage users and roles in PostgreSQL?

**Answer:**
PostgreSQL uses roles for authentication and authorization. Roles can be users or groups.

**Creating Roles:**
```sql
-- Create role (user)
CREATE ROLE app_user WITH LOGIN PASSWORD 'secure_password';

-- Create role with options
CREATE ROLE admin_user WITH 
    LOGIN 
    PASSWORD 'secure_password'
    CREATEDB
    CREATEROLE
    SUPERUSER;

-- Create role without login (group)
CREATE ROLE readonly_group;
```

**Granting Privileges:**
```sql
-- Grant table privileges
GRANT SELECT, INSERT, UPDATE ON users TO app_user;
GRANT ALL PRIVILEGES ON users TO admin_user;

-- Grant schema privileges
GRANT USAGE ON SCHEMA public TO app_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO app_user;

-- Grant database privileges
GRANT CONNECT ON DATABASE mydb TO app_user;
GRANT ALL PRIVILEGES ON DATABASE mydb TO admin_user;

-- Grant role to role
GRANT readonly_group TO app_user;
```

**Revoking Privileges:**
```sql
-- Revoke privileges
REVOKE SELECT ON users FROM app_user;
REVOKE ALL PRIVILEGES ON users FROM app_user;
```

**Viewing Privileges:**
```sql
-- View role privileges
SELECT 
    grantee,
    table_schema,
    table_name,
    privilege_type
FROM information_schema.role_table_grants
WHERE grantee = 'app_user';

-- View role members
SELECT 
    role.rolname AS role,
    member.rolname AS member
FROM pg_roles role
JOIN pg_auth_members am ON role.oid = am.roleid
JOIN pg_roles member ON am.member = member.oid;
```

**Default Roles:**
```sql
-- PostgreSQL provides default roles
-- pg_read_all_data: Read all data
-- pg_write_all_data: Write all data
-- pg_monitor: Read monitoring views
-- pg_database_owner: Database owner privileges

GRANT pg_read_all_data TO readonly_user;
```

### 26. How do you secure PostgreSQL?

**Answer:**
PostgreSQL security involves multiple layers.

**1. Authentication (pg_hba.conf):**
```conf
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   all             all                                     peer
host    all             all             127.0.0.1/32            md5
host    all             all             ::1/128                 md5
host    mydb            app_user        192.168.1.0/24          md5
hostssl all             all             0.0.0.0/0               cert
```

**2. SSL/TLS:**
```sql
-- Enable SSL (in postgresql.conf)
ssl = on
ssl_cert_file = 'server.crt'
ssl_key_file = 'server.key'

-- Force SSL connections
hostssl all all 0.0.0.0/0 md5
```

**3. Row Level Security:**
```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY user_policy ON users
    FOR ALL
    TO app_user
    USING (id = current_setting('app.user_id')::integer);

-- Users can only see their own rows
SET app.user_id = 123;
SELECT * FROM users;  -- Only sees user 123
```

**4. Encryption:**
```sql
-- Encrypt sensitive columns (using pgcrypto)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100),
    password_hash TEXT
);

-- Hash password
INSERT INTO users (email, password_hash)
VALUES ('user@example.com', crypt('password', gen_salt('bf')));

-- Verify password
SELECT * FROM users 
WHERE email = 'user@example.com' 
AND password_hash = crypt('password', password_hash);
```

**5. Audit Logging:**
```sql
-- Enable audit logging (in postgresql.conf)
logging_collector = on
log_directory = 'log'
log_filename = 'postgresql-%Y-%m-%d.log'
log_statement = 'ddl'  -- Log DDL statements
log_min_duration_statement = 1000  -- Log slow queries
```

---

## Backup and Recovery

### 27. How do you backup PostgreSQL databases?

**Answer:**
PostgreSQL provides several backup methods.

**1. pg_dump (Logical Backup):**
```bash
# Backup single database
pg_dump -U username -d mydb -F c -f backup.dump

# Backup to SQL file
pg_dump -U username -d mydb -f backup.sql

# Backup specific tables
pg_dump -U username -d mydb -t users -t orders -f backup.sql

# Backup with compression
pg_dump -U username -d mydb -F c -Z 9 -f backup.dump

# Backup all databases
pg_dumpall -U username -f all_databases.sql
```

**2. pg_basebackup (Physical Backup):**
```bash
# Full backup
pg_basebackup -D /backup/postgresql -Ft -z -P

# Streaming backup
pg_basebackup -D /backup/postgresql -Ft -z -P -U replicator
```

**3. Continuous Archiving (WAL):**
```conf
# In postgresql.conf
wal_level = replica
archive_mode = on
archive_command = 'cp %p /backup/wal/%f'
```

**Restoring Backups:**
```bash
# Restore from pg_dump
pg_restore -U username -d mydb -c backup.dump

# Restore from SQL file
psql -U username -d mydb -f backup.sql

# Restore all databases
psql -U username -f all_databases.sql
```

**Point-in-Time Recovery:**
```bash
# 1. Restore base backup
pg_basebackup -D /restore/postgresql

# 2. Configure recovery
# In postgresql.conf:
# restore_command = 'cp /backup/wal/%f %p'
# recovery_target_time = '2024-01-01 12:00:00'

# 3. Create recovery.signal
touch /restore/postgresql/recovery.signal

# 4. Start PostgreSQL
```

### 28. What is WAL (Write-Ahead Logging)?

**Answer:**
WAL is a method for ensuring data integrity by writing changes to a log before applying them to data files.

**How WAL Works:**
1. Changes are written to WAL first
2. WAL is flushed to disk
3. Changes are applied to data files
4. Transaction commits

**Benefits:**
- **Durability**: Changes survive crashes
- **Consistency**: Database can recover to consistent state
- **Replication**: WAL can be streamed to replicas

**WAL Configuration:**
```sql
-- View WAL settings
SHOW wal_level;
SHOW max_wal_size;
SHOW min_wal_size;

-- WAL levels
-- minimal: Only crash recovery
-- replica: Replication and archiving
-- logical: Logical replication
```

**WAL Files:**
```sql
-- View WAL statistics
SELECT * FROM pg_stat_wal;

-- Check WAL size
SELECT pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), '0/0'));
```

---

## Replication and High Availability

### 29. What is streaming replication in PostgreSQL?

**Answer:**
Streaming replication allows a standby server to receive and apply WAL records in real-time.

**Setting Up Replication:**

**Primary Server (postgresql.conf):**
```conf
wal_level = replica
max_wal_senders = 3
archive_mode = on
archive_command = 'cp %p /backup/wal/%f'
```

**Primary Server (pg_hba.conf):**
```conf
host replication replicator 192.168.1.0/24 md5
```

**Create Replication User:**
```sql
CREATE ROLE replicator WITH REPLICATION LOGIN PASSWORD 'password';
```

**Standby Server Setup:**
```bash
# 1. Take base backup
pg_basebackup -h primary_host -D /var/lib/postgresql/data -U replicator -P -W

# 2. Create recovery.conf (PostgreSQL 12+ uses postgresql.conf)
# In postgresql.conf:
primary_conninfo = 'host=primary_host port=5432 user=replicator password=password'
```

**Monitoring Replication:**
```sql
-- On primary: View replication status
SELECT 
    client_addr,
    state,
    sync_state,
    sync_priority
FROM pg_stat_replication;

-- On standby: Check lag
SELECT 
    pg_last_wal_receive_lsn(),
    pg_last_wal_replay_lsn(),
    pg_wal_lsn_diff(pg_current_wal_lsn(), pg_last_wal_replay_lsn()) AS lag_bytes;
```

**Promote Standby to Primary:**
```bash
# On standby server
pg_ctl promote

# Or create trigger file
touch /var/lib/postgresql/data/promote
```

### 30. What is logical replication in PostgreSQL?

**Answer:**
Logical replication replicates data changes at the logical level (table rows) rather than physical WAL records.

**Setting Up Logical Replication:**

**Publisher (Primary):**
```sql
-- Enable logical replication
ALTER SYSTEM SET wal_level = logical;
SELECT pg_reload_conf();

-- Create publication
CREATE PUBLICATION my_publication FOR TABLE users, orders;

-- Or all tables
CREATE PUBLICATION all_tables FOR ALL TABLES;
```

**Subscriber (Replica):**
```sql
-- Create subscription
CREATE SUBSCRIPTION my_subscription
CONNECTION 'host=primary_host port=5432 dbname=mydb user=replicator password=password'
PUBLICATION my_publication;

-- View subscription status
SELECT * FROM pg_subscription;
SELECT * FROM pg_stat_subscription;
```

**Advantages:**
- Replicate specific tables
- Different PostgreSQL versions
- Selective replication
- Bidirectional replication possible

**Limitations:**
- Only DML (INSERT, UPDATE, DELETE)
- No DDL replication
- Requires primary key or unique index

---

## Summary

This comprehensive guide covers essential PostgreSQL interview questions from basic concepts to advanced topics. Key areas include:

1. **Fundamentals**: PostgreSQL features, data types, sequences
2. **Advanced Data Types**: JSONB, Arrays, Range types, HSTORE
3. **Indexes**: B-tree, GIN, GiST, BRIN, and specialized indexes
4. **Concurrency**: MVCC, transaction isolation, locks
5. **Performance**: Query optimization, VACUUM, query planning
6. **Advanced Features**: CTEs, window functions, partitioning, full-text search
7. **Administration**: Monitoring, configuration, extensions
8. **Security**: Users, roles, RLS, encryption
9. **Backup**: pg_dump, pg_basebackup, WAL archiving
10. **Replication**: Streaming and logical replication

Remember to practice writing PostgreSQL queries and understand the underlying concepts. Good luck with your PostgreSQL interviews!
