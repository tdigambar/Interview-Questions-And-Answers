# SQL Interview Questions and Answers

This comprehensive guide covers essential SQL interview questions from basic concepts to advanced topics. Each question includes detailed answers with practical code examples.

## Table of Contents

1. [SQL Fundamentals](#sql-fundamentals)
2. [Data Types and Constraints](#data-types-and-constraints)
3. [Basic Queries](#basic-queries)
4. [Joins](#joins)
5. [Aggregations and Grouping](#aggregations-and-grouping)
6. [Subqueries](#subqueries)
7. [Window Functions](#window-functions)
8. [Indexes and Performance](#indexes-and-performance)
9. [Transactions and ACID](#transactions-and-acid)
10. [Advanced Topics](#advanced-topics)
    - [Find 3rd Highest Salary](#26-how-do-you-find-the-3rd-highest-salary-from-a-table)
    - [Read Replicas](#27-what-are-read-replicas-and-how-do-they-improve-performance)
    - [Write Scaling](#28-how-do-you-scale-writes-in-a-database)

---

## SQL Fundamentals

### 1. What is SQL and what are its main components?

**Answer:**
SQL (Structured Query Language) is a standard language for managing relational databases. It's used to create, read, update, and delete data.

**Main Components:**

1. **DDL (Data Definition Language)**: Defines database structure
   - `CREATE`, `ALTER`, `DROP`, `TRUNCATE`

2. **DML (Data Manipulation Language)**: Manipulates data
   - `SELECT`, `INSERT`, `UPDATE`, `DELETE`

3. **DCL (Data Control Language)**: Controls access
   - `GRANT`, `REVOKE`

4. **TCL (Transaction Control Language)**: Manages transactions
   - `COMMIT`, `ROLLBACK`, `SAVEPOINT`

**Example:**
```sql
-- DDL: Create table
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100)
);

-- DML: Insert data
INSERT INTO users (id, name, email) VALUES (1, 'John', 'john@example.com');

-- DML: Query data
SELECT * FROM users WHERE id = 1;

-- DML: Update data
UPDATE users SET email = 'john.doe@example.com' WHERE id = 1;

-- DML: Delete data
DELETE FROM users WHERE id = 1;
```

### 2. What is a database and what is a table?

**Answer:**

**Database**: A collection of related data organized in a structured way. It contains tables, views, indexes, procedures, etc.

**Table**: A collection of related data organized in rows and columns. Each row represents a record, and each column represents a field.

**Example:**
```sql
-- Database: ecommerce_db
-- Table: products
CREATE TABLE products (
    product_id INT PRIMARY KEY,
    product_name VARCHAR(100),
    price DECIMAL(10, 2),
    category VARCHAR(50),
    stock_quantity INT
);

-- Table: orders
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT,
    order_date DATE,
    total_amount DECIMAL(10, 2)
);
```

### 3. What are the different types of SQL statements?

**Answer:**

**1. SELECT**: Retrieves data from tables
```sql
SELECT column1, column2 FROM table_name WHERE condition;
```

**2. INSERT**: Adds new rows to a table
```sql
INSERT INTO table_name (column1, column2) VALUES (value1, value2);
```

**3. UPDATE**: Modifies existing data
```sql
UPDATE table_name SET column1 = value1 WHERE condition;
```

**4. DELETE**: Removes rows from a table
```sql
DELETE FROM table_name WHERE condition;
```

**5. CREATE**: Creates database objects
```sql
CREATE TABLE table_name (column1 datatype, column2 datatype);
```

**6. ALTER**: Modifies database structure
```sql
ALTER TABLE table_name ADD column_name datatype;
```

**7. DROP**: Deletes database objects
```sql
DROP TABLE table_name;
```

---

## Data Types and Constraints

### 4. What are the common SQL data types?

**Answer:**

**Numeric Types:**
- `INT` / `INTEGER`: Whole numbers
- `BIGINT`: Large whole numbers
- `DECIMAL(p, s)` / `NUMERIC`: Fixed-point numbers
- `FLOAT` / `REAL`: Floating-point numbers
- `DOUBLE`: Double precision floating-point

**String Types:**
- `VARCHAR(n)`: Variable-length string (max n characters)
- `CHAR(n)`: Fixed-length string (n characters)
- `TEXT`: Large text data

**Date/Time Types:**
- `DATE`: Date (YYYY-MM-DD)
- `TIME`: Time (HH:MM:SS)
- `DATETIME` / `TIMESTAMP`: Date and time
- `YEAR`: Year value

**Other Types:**
- `BOOLEAN` / `BOOL`: True/false
- `BLOB`: Binary large object
- `JSON`: JSON data (MySQL 5.7+, PostgreSQL)

**Example:**
```sql
CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    salary DECIMAL(10, 2),
    hire_date DATE,
    is_active BOOLEAN,
    bio TEXT,
    metadata JSON
);
```

### 5. What are SQL constraints?

**Answer:**
Constraints enforce rules on data to ensure data integrity.

**Types of Constraints:**

**1. PRIMARY KEY**: Uniquely identifies each row
```sql
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(100)
);
```

**2. FOREIGN KEY**: References a primary key in another table
```sql
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

**3. UNIQUE**: Ensures all values in a column are unique
```sql
CREATE TABLE users (
    id INT PRIMARY KEY,
    email VARCHAR(100) UNIQUE
);
```

**4. NOT NULL**: Prevents NULL values
```sql
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);
```

**5. CHECK**: Validates data against a condition
```sql
CREATE TABLE products (
    id INT PRIMARY KEY,
    price DECIMAL(10, 2) CHECK (price > 0),
    age INT CHECK (age >= 18)
);
```

**6. DEFAULT**: Sets a default value
```sql
CREATE TABLE orders (
    id INT PRIMARY KEY,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Basic Queries

### 6. What is the SELECT statement and how do you use it?

**Answer:**
SELECT retrieves data from one or more tables.

**Basic Syntax:**
```sql
SELECT column1, column2, ...
FROM table_name
WHERE condition
ORDER BY column_name [ASC|DESC]
LIMIT number;
```

**Examples:**
```sql
-- Select all columns
SELECT * FROM users;

-- Select specific columns
SELECT name, email FROM users;

-- Select with WHERE clause
SELECT * FROM users WHERE age > 18;

-- Select with multiple conditions
SELECT * FROM users 
WHERE age > 18 AND city = 'New York';

-- Select with ORDER BY
SELECT * FROM users ORDER BY name ASC;

-- Select with LIMIT
SELECT * FROM users LIMIT 10;

-- Select distinct values
SELECT DISTINCT city FROM users;

-- Select with aliases
SELECT name AS full_name, email AS email_address FROM users;
```

### 7. What is the WHERE clause and what operators can you use?

**Answer:**
WHERE filters rows based on specified conditions.

**Comparison Operators:**
```sql
-- Equal
SELECT * FROM users WHERE age = 25;

-- Not equal
SELECT * FROM users WHERE age != 25;
SELECT * FROM users WHERE age <> 25;

-- Greater than / Less than
SELECT * FROM users WHERE age > 18;
SELECT * FROM users WHERE age < 65;
SELECT * FROM users WHERE age >= 18;
SELECT * FROM users WHERE age <= 65;

-- BETWEEN
SELECT * FROM users WHERE age BETWEEN 18 AND 65;

-- IN
SELECT * FROM users WHERE city IN ('New York', 'London', 'Paris');

-- LIKE (pattern matching)
SELECT * FROM users WHERE name LIKE 'John%';  -- Starts with John
SELECT * FROM users WHERE email LIKE '%@gmail.com';  -- Ends with @gmail.com
SELECT * FROM users WHERE name LIKE '_ohn';  -- Single character wildcard

-- IS NULL / IS NOT NULL
SELECT * FROM users WHERE email IS NULL;
SELECT * FROM users WHERE email IS NOT NULL;
```

**Logical Operators:**
```sql
-- AND
SELECT * FROM users WHERE age > 18 AND city = 'New York';

-- OR
SELECT * FROM users WHERE city = 'New York' OR city = 'London';

-- NOT
SELECT * FROM users WHERE NOT age < 18;
```

### 8. What is the difference between WHERE and HAVING?

**Answer:**

**WHERE**: Filters rows before grouping
- Used with SELECT, UPDATE, DELETE
- Cannot use aggregate functions
- Applied to individual rows

**HAVING**: Filters groups after grouping
- Used with GROUP BY
- Can use aggregate functions
- Applied to groups

**Example:**
```sql
-- WHERE filters rows
SELECT * FROM orders WHERE amount > 100;

-- HAVING filters groups
SELECT customer_id, COUNT(*) as order_count
FROM orders
GROUP BY customer_id
HAVING COUNT(*) > 5;  -- Only customers with more than 5 orders

-- Both WHERE and HAVING
SELECT customer_id, SUM(amount) as total_spent
FROM orders
WHERE order_date >= '2024-01-01'  -- Filter rows first
GROUP BY customer_id
HAVING SUM(amount) > 1000;  -- Then filter groups
```

---

## Joins

### 9. What are SQL joins and what are the different types?

**Answer:**
Joins combine rows from two or more tables based on related columns.

**Types of Joins:**

**1. INNER JOIN**: Returns matching rows from both tables
```sql
SELECT users.name, orders.order_id, orders.amount
FROM users
INNER JOIN orders ON users.id = orders.user_id;
```

**2. LEFT JOIN (LEFT OUTER JOIN)**: Returns all rows from left table + matching rows from right
```sql
SELECT users.name, orders.order_id
FROM users
LEFT JOIN orders ON users.id = orders.user_id;
-- Returns all users, even if they have no orders
```

**3. RIGHT JOIN (RIGHT OUTER JOIN)**: Returns all rows from right table + matching rows from left
```sql
SELECT users.name, orders.order_id
FROM users
RIGHT JOIN orders ON users.id = orders.user_id;
-- Returns all orders, even if user doesn't exist
```

**4. FULL OUTER JOIN**: Returns all rows from both tables
```sql
SELECT users.name, orders.order_id
FROM users
FULL OUTER JOIN orders ON users.id = orders.user_id;
-- Returns all users and all orders
```

**5. CROSS JOIN**: Returns Cartesian product (all combinations)
```sql
SELECT users.name, products.product_name
FROM users
CROSS JOIN products;
-- Returns every user with every product
```

**6. SELF JOIN**: Joins a table with itself
```sql
-- Find employees and their managers
SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;
```

### 10. What is the difference between INNER JOIN and LEFT JOIN?

**Answer:**

**INNER JOIN**: Returns only rows where there's a match in both tables
- Excludes rows with no match
- More restrictive

**LEFT JOIN**: Returns all rows from the left table + matching rows from right
- Includes rows from left table even if no match in right
- NULL values for right table columns when no match

**Example:**
```sql
-- Sample data
-- users: id=1 (John), id=2 (Jane), id=3 (Bob)
-- orders: user_id=1 (Order1), user_id=1 (Order2)

-- INNER JOIN: Returns only users with orders
SELECT users.name, orders.order_id
FROM users
INNER JOIN orders ON users.id = orders.user_id;
-- Result: John (Order1), John (Order2)
-- Jane and Bob are excluded

-- LEFT JOIN: Returns all users
SELECT users.name, orders.order_id
FROM users
LEFT JOIN orders ON users.id = orders.user_id;
-- Result: John (Order1), John (Order2), Jane (NULL), Bob (NULL)
```

---

## Aggregations and Grouping

### 11. What are aggregate functions in SQL?

**Answer:**
Aggregate functions perform calculations on a set of rows and return a single value.

**Common Aggregate Functions:**

**1. COUNT**: Counts rows
```sql
SELECT COUNT(*) FROM users;  -- Total rows
SELECT COUNT(email) FROM users;  -- Non-NULL emails
SELECT COUNT(DISTINCT city) FROM users;  -- Unique cities
```

**2. SUM**: Sums numeric values
```sql
SELECT SUM(amount) FROM orders;
SELECT SUM(quantity * price) AS total_revenue FROM order_items;
```

**3. AVG**: Calculates average
```sql
SELECT AVG(age) FROM users;
SELECT AVG(amount) FROM orders;
```

**4. MIN / MAX**: Finds minimum/maximum
```sql
SELECT MIN(price) FROM products;
SELECT MAX(age) FROM users;
```

**5. GROUP_CONCAT / STRING_AGG**: Concatenates strings
```sql
-- MySQL
SELECT customer_id, GROUP_CONCAT(product_name) 
FROM orders 
GROUP BY customer_id;

-- PostgreSQL
SELECT customer_id, STRING_AGG(product_name, ', ') 
FROM orders 
GROUP BY customer_id;
```

**Example with GROUP BY:**
```sql
SELECT 
    customer_id,
    COUNT(*) as order_count,
    SUM(amount) as total_spent,
    AVG(amount) as avg_order_value
FROM orders
GROUP BY customer_id;
```

### 12. What is GROUP BY and how does it work?

**Answer:**
GROUP BY groups rows that have the same values in specified columns and allows aggregate functions to be applied to each group.

**Syntax:**
```sql
SELECT column1, aggregate_function(column2)
FROM table_name
WHERE condition
GROUP BY column1
HAVING condition;
```

**Examples:**
```sql
-- Group by single column
SELECT category, COUNT(*) as product_count
FROM products
GROUP BY category;

-- Group by multiple columns
SELECT category, supplier_id, COUNT(*) as product_count
FROM products
GROUP BY category, supplier_id;

-- Group by with aggregate functions
SELECT 
    customer_id,
    COUNT(*) as order_count,
    SUM(amount) as total_spent,
    AVG(amount) as avg_amount,
    MIN(order_date) as first_order,
    MAX(order_date) as last_order
FROM orders
GROUP BY customer_id;

-- Group by with HAVING
SELECT category, AVG(price) as avg_price
FROM products
GROUP BY category
HAVING AVG(price) > 100;
```

**Important Rules:**
- All non-aggregated columns in SELECT must be in GROUP BY
- WHERE filters rows before grouping
- HAVING filters groups after grouping

---

## Subqueries

### 13. What are subqueries and what are the different types?

**Answer:**
Subqueries (nested queries) are queries within another SQL query.

**Types of Subqueries:**

**1. Scalar Subquery**: Returns a single value
```sql
-- Find users older than the average age
SELECT name, age
FROM users
WHERE age > (SELECT AVG(age) FROM users);
```

**2. Row Subquery**: Returns a single row
```sql
SELECT * FROM users
WHERE (age, salary) = (
    SELECT MAX(age), MAX(salary) FROM users
);
```

**3. Column Subquery**: Returns a single column
```sql
-- Find users who have placed orders
SELECT name
FROM users
WHERE id IN (SELECT DISTINCT user_id FROM orders);
```

**4. Table Subquery**: Returns a table (used in FROM clause)
```sql
SELECT *
FROM (
    SELECT customer_id, SUM(amount) as total
    FROM orders
    GROUP BY customer_id
) AS customer_totals
WHERE total > 1000;
```

**5. Correlated Subquery**: References outer query
```sql
-- Find employees earning more than their department average
SELECT e.name, e.salary, e.department_id
FROM employees e
WHERE e.salary > (
    SELECT AVG(salary)
    FROM employees
    WHERE department_id = e.department_id
);
```

**6. EXISTS / NOT EXISTS**: Checks for existence
```sql
-- Find customers who have placed orders
SELECT name
FROM customers c
WHERE EXISTS (
    SELECT 1 FROM orders o WHERE o.customer_id = c.id
);

-- Find customers who haven't placed orders
SELECT name
FROM customers c
WHERE NOT EXISTS (
    SELECT 1 FROM orders o WHERE o.customer_id = c.id
);
```

### 14. What is the difference between IN, EXISTS, and JOIN?

**Answer:**

**IN**: Checks if a value exists in a list or subquery result
```sql
SELECT * FROM users
WHERE id IN (1, 2, 3, 4, 5);

SELECT * FROM users
WHERE id IN (SELECT user_id FROM orders);
```

**EXISTS**: Checks if a subquery returns any rows (returns boolean)
```sql
SELECT * FROM users u
WHERE EXISTS (
    SELECT 1 FROM orders o WHERE o.user_id = u.id
);
```

**JOIN**: Combines rows from multiple tables
```sql
SELECT DISTINCT u.*
FROM users u
INNER JOIN orders o ON u.id = o.user_id;
```

**Performance Considerations:**
- **IN**: Good for small lists, can be slow with large subqueries
- **EXISTS**: Often faster for correlated subqueries, stops at first match
- **JOIN**: Usually most efficient, can use indexes effectively

**Example Comparison:**
```sql
-- All three return same result, but different approaches:

-- Using IN
SELECT * FROM users WHERE id IN (SELECT user_id FROM orders);

-- Using EXISTS
SELECT * FROM users u 
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);

-- Using JOIN
SELECT DISTINCT u.* FROM users u 
INNER JOIN orders o ON u.id = o.user_id;
```

---

## Window Functions

### 15. What are window functions in SQL?

**Answer:**
Window functions perform calculations across a set of rows related to the current row, without collapsing rows into groups.

**Key Characteristics:**
- Don't collapse rows (unlike GROUP BY)
- Use OVER() clause
- Can access other rows in the result set

**Types of Window Functions:**

**1. Ranking Functions:**
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
```

**2. Aggregate Window Functions:**
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
```

**3. Value Functions:**
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
```

**4. Partitioning:**
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

---

## Indexes and Performance

### 16. What are indexes and why are they important?

**Answer:**
Indexes are database structures that improve query performance by allowing faster data retrieval.

**Benefits:**
- Faster SELECT queries
- Faster JOINs
- Faster WHERE clause filtering
- Enforces uniqueness (unique indexes)

**Drawbacks:**
- Slower INSERT/UPDATE/DELETE (indexes must be updated)
- Additional storage space

**Types of Indexes:**

**1. Primary Key Index**: Automatically created
```sql
CREATE TABLE users (
    id INT PRIMARY KEY,  -- Automatically indexed
    name VARCHAR(100)
);
```

**2. Unique Index**: Ensures uniqueness
```sql
CREATE UNIQUE INDEX idx_email ON users(email);
```

**3. Composite Index**: Multiple columns
```sql
CREATE INDEX idx_name_city ON users(name, city);
```

**4. Partial Index**: Index on filtered data (PostgreSQL)
```sql
CREATE INDEX idx_active_users ON users(email) 
WHERE is_active = true;
```

**Example:**
```sql
-- Create index
CREATE INDEX idx_customer_id ON orders(customer_id);

-- Query uses index automatically
SELECT * FROM orders WHERE customer_id = 123;

-- Check if index is used (MySQL)
EXPLAIN SELECT * FROM orders WHERE customer_id = 123;
```

### 17. How do you optimize SQL queries?

**Answer:**

**1. Use Indexes:**
```sql
-- Create indexes on frequently queried columns
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_order_date ON orders(order_date);
```

**2. Avoid SELECT *:**
```sql
-- ❌ Bad
SELECT * FROM users WHERE id = 1;

-- ✅ Good
SELECT id, name, email FROM users WHERE id = 1;
```

**3. Use WHERE to Filter Early:**
```sql
-- ✅ Filter before JOIN
SELECT u.name, o.amount
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE u.city = 'New York';
```

**4. Use LIMIT:**
```sql
-- ✅ Limit results
SELECT * FROM orders ORDER BY order_date DESC LIMIT 10;
```

**5. Avoid Functions in WHERE:**
```sql
-- ❌ Bad (can't use index)
SELECT * FROM users WHERE YEAR(created_at) = 2024;

-- ✅ Good
SELECT * FROM users WHERE created_at >= '2024-01-01' 
AND created_at < '2025-01-01';
```

**6. Use EXPLAIN to Analyze:**
```sql
-- MySQL
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';

-- PostgreSQL
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';
```

**7. Optimize JOINs:**
```sql
-- ✅ Use appropriate JOIN type
-- ✅ Join on indexed columns
-- ✅ Filter before joining large tables
```

---

## Transactions and ACID

### 18. What are transactions and what is ACID?

**Answer:**

**Transaction**: A sequence of database operations that are executed as a single unit. Either all operations succeed, or all fail.

**ACID Properties:**

**1. Atomicity**: All or nothing
- Either all operations complete, or none do
- No partial updates

**2. Consistency**: Data remains valid
- Database constraints are maintained
- No invalid states

**3. Isolation**: Concurrent transactions don't interfere
- Transactions are isolated from each other
- Prevents dirty reads, phantom reads

**4. Durability**: Changes persist
- Once committed, changes survive system failures
- Written to permanent storage

**Example:**
```sql
-- Start transaction
BEGIN TRANSACTION;

-- Transfer money between accounts
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

-- Commit (save changes)
COMMIT;

-- Or rollback (undo changes)
-- ROLLBACK;
```

### 19. What are transaction isolation levels?

**Answer:**
Isolation levels control how transactions interact with each other.

**Levels (from least to most strict):**

**1. READ UNCOMMITTED**: Lowest isolation
- Can read uncommitted data (dirty reads)
- Fastest but least safe

**2. READ COMMITTED**: Default in most databases
- Can only read committed data
- Prevents dirty reads
- Allows non-repeatable reads

**3. REPEATABLE READ**: MySQL default
- Same read returns same result
- Prevents dirty reads and non-repeatable reads
- May have phantom reads

**4. SERIALIZABLE**: Highest isolation
- Transactions execute serially
- Prevents all concurrency issues
- Slowest but safest

**Example:**
```sql
-- Set isolation level
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

BEGIN TRANSACTION;
SELECT * FROM accounts WHERE id = 1;
-- Other transactions can't see uncommitted changes
COMMIT;
```

---

## Advanced Topics

### 20. What is the difference between DELETE, TRUNCATE, and DROP?

**Answer:**

**DELETE**: Removes rows from a table
- DML statement
- Can use WHERE clause
- Can be rolled back
- Slower (row-by-row)
- Triggers fire
- Maintains auto-increment

```sql
DELETE FROM users WHERE id = 1;
DELETE FROM users;  -- Deletes all rows
```

**TRUNCATE**: Removes all rows from a table
- DDL statement
- Cannot use WHERE clause
- Faster than DELETE
- Cannot be rolled back (in most databases)
- Resets auto-increment
- Doesn't fire triggers

```sql
TRUNCATE TABLE users;
```

**DROP**: Removes the entire table
- DDL statement
- Removes table structure and data
- Cannot be rolled back
- Fastest

```sql
DROP TABLE users;
```

**Comparison:**

| Feature | DELETE | TRUNCATE | DROP |
|---------|--------|----------|------|
| **Type** | DML | DDL | DDL |
| **WHERE clause** | Yes | No | No |
| **Speed** | Slow | Fast | Fastest |
| **Rollback** | Yes | Usually No | No |
| **Auto-increment** | Maintains | Resets | Removes |
| **Triggers** | Fires | Doesn't fire | N/A |
| **Table structure** | Keeps | Keeps | Removes |

### 21. What are views in SQL?

**Answer:**
Views are virtual tables based on the result of a SQL query. They don't store data but provide a way to simplify complex queries.

**Benefits:**
- Simplify complex queries
- Security (hide sensitive columns)
- Reusability
- Abstraction layer

**Example:**
```sql
-- Create view
CREATE VIEW active_users AS
SELECT id, name, email
FROM users
WHERE is_active = true;

-- Use view
SELECT * FROM active_users;

-- Update view (if updatable)
UPDATE active_users SET name = 'John' WHERE id = 1;

-- Drop view
DROP VIEW active_users;
```

**Materialized View** (PostgreSQL, Oracle):
```sql
-- Stores actual data (refreshed periodically)
CREATE MATERIALIZED VIEW user_stats AS
SELECT 
    COUNT(*) as total_users,
    AVG(age) as avg_age
FROM users;

-- Refresh materialized view
REFRESH MATERIALIZED VIEW user_stats;
```

### 22. What are stored procedures and functions?

**Answer:**

**Stored Procedures**: Pre-compiled SQL code stored in the database
- Can return multiple values
- Can have side effects
- Called with CALL or EXECUTE

**Functions**: Return a single value
- Must return a value
- Can be used in SELECT statements
- Usually no side effects

**Example (MySQL):**
```sql
-- Stored Procedure
DELIMITER //
CREATE PROCEDURE GetUserOrders(IN user_id INT)
BEGIN
    SELECT * FROM orders WHERE customer_id = user_id;
END //
DELIMITER ;

-- Call procedure
CALL GetUserOrders(123);

-- Function
DELIMITER //
CREATE FUNCTION CalculateTotal(price DECIMAL, quantity INT)
RETURNS DECIMAL
DETERMINISTIC
BEGIN
    RETURN price * quantity;
END //
DELIMITER ;

-- Use function
SELECT product_name, CalculateTotal(price, quantity) as total
FROM order_items;
```

### 23. What is normalization and what are the normal forms?

**Answer:**
Normalization is the process of organizing data to reduce redundancy and improve data integrity.

**Normal Forms:**

**1NF (First Normal Form):**
- Each column contains atomic values
- No repeating groups
- Each row is unique

**2NF (Second Normal Form):**
- Must be in 1NF
- All non-key columns depend on the entire primary key
- No partial dependencies

**3NF (Third Normal Form):**
- Must be in 2NF
- No transitive dependencies
- Non-key columns don't depend on other non-key columns

**Example:**
```sql
-- ❌ Not normalized
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_name VARCHAR(100),
    customer_email VARCHAR(100),
    product1 VARCHAR(100),
    product2 VARCHAR(100),
    product3 VARCHAR(100)
);

-- ✅ Normalized
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE customers (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100)
);

CREATE TABLE order_items (
    order_id INT,
    product_id INT,
    quantity INT,
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

### 24. What is a UNION and how does it differ from JOIN?

**Answer:**

**UNION**: Combines results from multiple SELECT statements vertically
- Combines rows (not columns)
- Removes duplicates (use UNION ALL to keep duplicates)
- All SELECTs must have same number of columns
- Column types must be compatible

**JOIN**: Combines columns from multiple tables horizontally
- Combines columns based on related data
- Matches rows based on conditions

**Example:**
```sql
-- UNION: Combine rows
SELECT name FROM users
UNION
SELECT name FROM customers;
-- Returns all unique names from both tables

-- UNION ALL: Keep duplicates
SELECT name FROM users
UNION ALL
SELECT name FROM customers;
-- Returns all names including duplicates

-- JOIN: Combine columns
SELECT u.name, o.order_id
FROM users u
JOIN orders o ON u.id = o.user_id;
-- Returns name and order_id for matching rows
```

### 25. How do you handle NULL values in SQL?

**Answer:**

**Checking for NULL:**
```sql
-- Use IS NULL / IS NOT NULL (not = NULL)
SELECT * FROM users WHERE email IS NULL;
SELECT * FROM users WHERE email IS NOT NULL;
```

**Functions for NULL:**
```sql
-- COALESCE: Returns first non-NULL value
SELECT name, COALESCE(email, 'No email') as email
FROM users;

-- NULLIF: Returns NULL if values are equal
SELECT NULLIF(column1, column2) FROM table;

-- IFNULL (MySQL) / ISNULL (SQL Server)
SELECT name, IFNULL(email, 'No email') as email FROM users;

-- CASE for NULL handling
SELECT 
    name,
    CASE 
        WHEN email IS NULL THEN 'No email'
        ELSE email
    END as email
FROM users;
```

**Aggregates with NULL:**
```sql
-- COUNT(*) counts all rows including NULL
-- COUNT(column) counts non-NULL values only
SELECT 
    COUNT(*) as total_rows,
    COUNT(email) as users_with_email
FROM users;
```

### 26. How do you find the 3rd highest salary from a table?

**Answer:** There are multiple approaches to find the nth highest salary. Here are the most common methods:

**Sample Table:**
```sql
CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    salary DECIMAL(10, 2)
);

INSERT INTO employees VALUES
(1, 'John', 50000),
(2, 'Jane', 60000),
(3, 'Bob', 55000),
(4, 'Alice', 70000),
(5, 'Charlie', 60000),
(6, 'David', 65000);
```

**Method 1: Using Subquery with DISTINCT and LIMIT/OFFSET (MySQL, PostgreSQL)**
```sql
SELECT DISTINCT salary
FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 2;
-- OFFSET 2 means skip first 2 rows, get the 3rd
```

**Method 2: Using Subquery with COUNT (Works in all databases)**
```sql
SELECT salary
FROM employees e1
WHERE 2 = (
    SELECT COUNT(DISTINCT salary)
    FROM employees e2
    WHERE e2.salary > e1.salary
);
-- Finds salary where exactly 2 salaries are higher
```

**Method 3: Using Window Functions (ROW_NUMBER)**
```sql
SELECT salary
FROM (
    SELECT 
        salary,
        ROW_NUMBER() OVER (ORDER BY salary DESC) as rn
    FROM employees
) ranked
WHERE rn = 3;
```

**Method 4: Using Window Functions (DENSE_RANK) - Handles duplicates**
```sql
SELECT salary
FROM (
    SELECT 
        salary,
        DENSE_RANK() OVER (ORDER BY salary DESC) as dr
    FROM employees
) ranked
WHERE dr = 3;
-- DENSE_RANK handles duplicate salaries better
```

**Method 5: Using LIMIT with Subquery (MySQL)**
```sql
SELECT salary
FROM employees
ORDER BY salary DESC
LIMIT 2, 1;
-- LIMIT offset, count - skip 2, get 1
```

**Method 6: Generic solution for nth highest (e.g., 3rd)**
```sql
-- For 3rd highest, change 2 to (n-1)
SELECT salary
FROM employees e1
WHERE (3 - 1) = (
    SELECT COUNT(DISTINCT e2.salary)
    FROM employees e2
    WHERE e2.salary > e1.salary
);
```

**Comparison:**

| Method | Pros | Cons | Database Support |
|-------|------|------|------------------|
| **LIMIT/OFFSET** | Simple, fast | Doesn't handle duplicates well | MySQL, PostgreSQL |
| **Subquery with COUNT** | Works everywhere, handles duplicates | Can be slower | All databases |
| **ROW_NUMBER** | Fast, clear | Doesn't handle duplicates | MySQL 8+, PostgreSQL, SQL Server |
| **DENSE_RANK** | Handles duplicates perfectly | Slightly more complex | MySQL 8+, PostgreSQL, SQL Server |

**Example Results:**
```
Salaries: 70000, 65000, 60000, 60000, 55000, 50000

3rd highest = 60000 (using ROW_NUMBER)
3rd highest = 60000 (using DENSE_RANK - treats duplicates as same rank)
```

**For nth highest salary (general solution):**
```sql
-- Replace 3 with any number n
SELECT salary
FROM employees e1
WHERE (n - 1) = (
    SELECT COUNT(DISTINCT e2.salary)
    FROM employees e2
    WHERE e2.salary > e1.salary
);
```

### 27. What are Read Replicas and how do they improve performance?

**Answer:**

Read replicas are copies of your primary database that are kept in sync for read-only operations. They allow you to distribute read traffic away from the primary database, improving overall system performance and scalability.

**How Read Replicas Work:**

1. **Primary Database**: Handles all writes (INSERT, UPDATE, DELETE)
2. **Replication**: Primary database logs all changes to a binary log
3. **Replica Databases**: Read the binary log and apply the same changes asynchronously
4. **Reads**: Application routes read queries to replicas, writes to primary

**Benefits of Read Replicas:**

1. **Improved Read Performance**: Distribute read load across multiple instances
2. **High Availability**: Failover to replica if primary goes down
3. **Backup**: Use replicas for backups without impacting primary
4. **Geographic Distribution**: Place replicas in different regions for local reads
5. **Reporting**: Use replicas for heavy reporting/analytics queries

**Example (MySQL Master-Slave):**
```sql
-- On Primary Database (my.cnf)
-- [mysqld]
-- server-id = 1
-- log_bin = mysql-bin
-- binlog_do_db = myapp_db

-- On Replica Database (my.cnf)
-- [mysqld]
-- server-id = 2
-- relay-log = mysql-relay-bin

-- Configure replica to replicate from primary
CHANGE REPLICATION SOURCE TO
    SOURCE_HOST='primary.example.com',
    SOURCE_USER='repl_user',
    SOURCE_PASSWORD='password',
    SOURCE_LOG_FILE='mysql-bin.000001',
    SOURCE_LOG_POS=154;

START REPLICA;

-- Check replica status
SHOW REPLICA STATUS\G
```

**Replication Lag:**

Replicas are asynchronous, so there can be a delay between writes on primary and visibility on replicas.

```
Time: 0s    Application writes to primary
Time: 0.5s  Change recorded to binary log
Time: 1s    Replica processes the change
Time: 1.5s  Data visible on replica

Replication Lag = ~1.5 seconds
```

**Handling Replication Lag:**
```java
// Send recent writes to primary, reads to replica
if (isRecentWrite()) {
    return database.primary.query(sql);
} else {
    return database.replica.query(sql);
}
```

**Limitations:**
- Read-only (mostly) — some databases support writes to replica with conflicts
- Replication lag — eventual consistency, not strong consistency
- Network overhead — continuous log shipping
- Storage overhead — replica stores full copy of data

---

### 28. How do you scale writes in a database?

**Answer:**

Write scaling is more challenging than read scaling because writes must go to the same data store to maintain consistency. Here are common approaches:

**1. Vertical Scaling (Scale Up)**

Add more resources to the primary database:
- Faster CPU/memory
- Better storage (SSD vs HDD)
- Simpler but has limits

**2. Horizontal Scaling with Sharding**

Split data across multiple databases based on shard key (partition key).

```
Shard Key: user_id (hash-based)

user_id % 4 = 0,1,2,3  →  4 different shards

Write for user 5 goes to Shard 1
Write for user 8 goes to Shard 0
Write for user 10 goes to Shard 2
```

**Sharding Example (Application Level):**
```java
public class ShardRouter {
    private Database[] shards = new Database[4];
    
    public void writeUser(User user) {
        int shardId = user.userId % 4;
        shards[shardId].insert(user);
    }
    
    public User getUser(int userId) {
        int shardId = userId % 4;
        return shards[shardId].query("SELECT * FROM users WHERE id = ?", userId);
    }
}
```

**Pros of Sharding:**
- Linear write scaling (add more shards = more write capacity)
- Data locality (smaller datasets per shard = faster queries)
- Independent failures (one shard failure doesn't affect others)

**Cons of Sharding:**
- Complex application logic
- Cross-shard queries are expensive
- Rebalancing is difficult (moving data between shards)
- Hot shards (uneven distribution of data)

**3. Write-Through Caching**

Reduce database writes using caching layers to deduplicate and batch writes:

```python
import redis

class WriteCache:
    def __init__(self):
        self.cache = redis.Redis()
        self.batch_size = 100
        self.batch = []
    
    def write(self, key, value):
        # Write to cache immediately
        self.cache.set(key, value)
        
        # Batch writes to database
        self.batch.append((key, value))
        if len(self.batch) >= self.batch_size:
            self.flush_to_db()
    
    def flush_to_db(self):
        # Batch insert to database (much faster)
        db.bulk_insert(self.batch)
        self.batch = []
```

**4. Event Sourcing**

Instead of updating records, append writes to an immutable log:

```
Traditional:  UPDATE users SET balance=150 WHERE id=1
              (Overwrites previous state)

Event Sourcing:
  Event Log:
  1. UserCreated(id=1, balance=100)
  2. DepositMade(id=1, amount=50)
  3. WithdrawalMade(id=1, amount=0)
  
  Current State = Replay all events
```

**Benefits:**
- Faster writes (append-only log)
- Full history/audit trail
- Can replay state to any point in time

**5. CQRS (Command Query Responsibility Segregation)**

Separate read and write models:

```
Writes go to Write DB (optimized for writes)
Reads come from Read DB (optimized for reads, eventually consistent)

Application
    │
    ├─ Write Request ──→ Write DB (Normalized, optimized for writes)
    │                        ↓ (Async sync via message queue)
    │                   Read DB (Denormalized, optimized for reads)
    │
    └─ Read Request ───→ Read DB
```

**Comparison of Write Scaling Techniques:**

| Technique | Complexity | Latency | Consistency | Scalability |
|-----------|-----------|---------|-------------|------------|
| Vertical Scaling | Low | Low | Strong | Limited |
| Sharding | High | Low | Strong | Excellent |
| Caching | Medium | Low | Eventual | Good |
| Event Sourcing | High | Low | Eventual | Excellent |
| CQRS | High | High | Eventual | Excellent |

**Best Practices for Write Scaling:**

1. **Start simple**: Optimize queries, add indexes, vertical scale first
2. **Use caching**: Reduce writes with Redis/Memcached
3. **Batch writes**: Insert many rows at once, not one by one
4. **Choose shard key wisely**: Avoid hot shards (uneven distribution)
5. **Monitor writes**: Track query performance and replication lag
6. **Plan for rebalancing**: Have a strategy for adding/removing shards

**Warning Signs You Need Write Scaling:**
- Primary database CPU/disk usage consistently > 80%
- Write queries taking > 100ms
- Application experiencing timeout errors during peak traffic
- Replication lag constantly increasing

---

## Summary

This comprehensive guide covers essential SQL interview questions from basic concepts to advanced topics. Key areas to focus on:

1. **Fundamentals**: SQL components, data types, constraints
2. **Queries**: SELECT, WHERE, HAVING, ORDER BY
3. **Joins**: INNER, LEFT, RIGHT, FULL OUTER, CROSS, SELF
4. **Aggregations**: COUNT, SUM, AVG, GROUP BY, HAVING
5. **Subqueries**: Scalar, row, column, table, correlated
6. **Window Functions**: ROW_NUMBER, RANK, LAG, LEAD
7. **Performance**: Indexes, query optimization
8. **Transactions**: ACID properties, isolation levels
9. **Advanced**: Views, stored procedures, normalization

Remember to practice writing SQL queries and understand the underlying concepts rather than just memorizing syntax. Good luck with your SQL interviews!
