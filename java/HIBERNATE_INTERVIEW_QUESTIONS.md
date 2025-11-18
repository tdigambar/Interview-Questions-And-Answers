# Hibernate Interview Questions and Answers

This comprehensive guide covers essential Hibernate interview questions from basic concepts to advanced topics. Each question includes detailed answers with practical code examples.

## Table of Contents

1. [Hibernate Fundamentals](#hibernate-fundamentals)
2. [Configuration and Setup](#configuration-and-setup)
3. [Entity Mapping](#entity-mapping)
4. [Relationships](#relationships)
5. [HQL and Criteria API](#hql-and-criteria-api)
6. [Session and Transaction Management](#session-and-transaction-management)
7. [Caching](#caching)
8. [Performance Optimization](#performance-optimization)
9. [Advanced Topics](#advanced-topics)
10. [Best Practices](#best-practices)

---

## Hibernate Fundamentals

### 1. What is Hibernate and what are its key features?

**Answer:**
Hibernate is an open-source, lightweight ORM (Object-Relational Mapping) framework for Java. It simplifies the development of Java applications to interact with databases.

**Key Features:**

1. **ORM**: Maps Java objects to database tables
2. **HQL (Hibernate Query Language)**: Object-oriented query language
3. **Automatic Table Creation**: Can generate database schema
4. **Lazy Loading**: Loads data on demand
5. **Caching**: First-level and second-level caching
6. **Database Independence**: Works with multiple databases
7. **Automatic DDL**: Can create/update database schema
8. **Connection Pooling**: Built-in connection management
9. **Transaction Management**: Handles transactions
10. **Criteria API**: Type-safe query building

**Example:**
```java
// Without Hibernate (JDBC)
Connection conn = DriverManager.getConnection(url, user, password);
PreparedStatement stmt = conn.prepareStatement("SELECT * FROM users WHERE id = ?");
stmt.setInt(1, userId);
ResultSet rs = stmt.executeQuery();
// Manual mapping...

// With Hibernate
Session session = sessionFactory.openSession();
User user = session.get(User.class, userId);
// Automatic mapping!
```

### 2. What is ORM (Object-Relational Mapping)?

**Answer:**
ORM is a programming technique that converts data between incompatible type systems using object-oriented programming languages. It creates a "virtual object database" that can be used from within the programming language.

**Benefits:**
- Reduces boilerplate code
- Database independence
- Automatic mapping
- Relationship management
- Query abstraction

**Example:**
```java
// Database Table
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100)
);

// Java Entity (ORM Mapping)
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name")
    private String name;
    
    @Column(name = "email")
    private String email;
    
    // Getters and setters
}
```

### 3. What is the difference between Hibernate and JDBC?

**Answer:**

| Feature | JDBC | Hibernate |
|---------|------|-----------|
| **Type** | API | ORM Framework |
| **Code** | More boilerplate code | Less code, more abstraction |
| **SQL** | Native SQL required | HQL, Criteria API, Native SQL |
| **Mapping** | Manual mapping | Automatic mapping |
| **Caching** | No built-in caching | First-level and second-level caching |
| **Database Independence** | Database-specific SQL | Database-independent |
| **Performance** | Better for simple queries | Better for complex operations |
| **Learning Curve** | Easier | Steeper |
| **Connection Management** | Manual | Automatic |

**Example:**
```java
// JDBC
Connection conn = DriverManager.getConnection(url, user, password);
PreparedStatement stmt = conn.prepareStatement("INSERT INTO users (name, email) VALUES (?, ?)");
stmt.setString(1, "John");
stmt.setString(2, "john@example.com");
stmt.executeUpdate();
conn.close();

// Hibernate
Session session = sessionFactory.openSession();
Transaction tx = session.beginTransaction();
User user = new User();
user.setName("John");
user.setEmail("john@example.com");
session.save(user);
tx.commit();
session.close();
```

### 4. What are the core interfaces of Hibernate?

**Answer:**
Hibernate has several core interfaces:

**1. SessionFactory:**
- Thread-safe factory for creating Session instances
- Immutable once created
- Expensive to create (create once, reuse)

**2. Session:**
- Single-threaded, short-lived object
- Represents a conversation between application and database
- Main interface for persistence operations

**3. Transaction:**
- Represents a database transaction
- Optional (can use JTA or programmatic transactions)

**4. Query:**
- Represents HQL or native SQL query
- Used to execute queries

**5. Criteria:**
- Type-safe query building
- Alternative to HQL

**Example:**
```java
// SessionFactory (created once)
Configuration config = new Configuration().configure();
SessionFactory sessionFactory = config.buildSessionFactory();

// Session (created per operation)
Session session = sessionFactory.openSession();

// Transaction
Transaction tx = session.beginTransaction();

// Query
Query query = session.createQuery("FROM User WHERE name = :name");
query.setParameter("name", "John");
List<User> users = query.list();

// Criteria
Criteria criteria = session.createCriteria(User.class);
criteria.add(Restrictions.eq("name", "John"));
List<User> users = criteria.list();

tx.commit();
session.close();
```

---

## Configuration and Setup

### 5. How do you configure Hibernate?

**Answer:**
Hibernate can be configured using XML (hibernate.cfg.xml) or properties file (hibernate.properties).

**XML Configuration (hibernate.cfg.xml):**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE hibernate-configuration PUBLIC
    "-//Hibernate/Hibernate Configuration DTD 3.0//EN"
    "http://www.hibernate.org/dtd/hibernate-configuration-3.0.dtd">

<hibernate-configuration>
    <session-factory>
        <!-- Database connection settings -->
        <property name="hibernate.connection.driver_class">com.mysql.cj.jdbc.Driver</property>
        <property name="hibernate.connection.url">jdbc:mysql://localhost:3306/mydb</property>
        <property name="hibernate.connection.username">root</property>
        <property name="hibernate.connection.password">password</property>
        
        <!-- Dialect -->
        <property name="hibernate.dialect">org.hibernate.dialect.MySQL8Dialect</property>
        
        <!-- Show SQL -->
        <property name="hibernate.show_sql">true</property>
        <property name="hibernate.format_sql">true</property>
        
        <!-- Auto DDL -->
        <property name="hibernate.hbm2ddl.auto">update</property>
        
        <!-- Connection pool -->
        <property name="hibernate.c3p0.min_size">5</property>
        <property name="hibernate.c3p0.max_size">20</property>
        
        <!-- Mapping files -->
        <mapping class="com.example.User"/>
        <mapping class="com.example.Order"/>
    </session-factory>
</hibernate-configuration>
```

**Java Configuration (Programmatic):**
```java
Configuration config = new Configuration();
config.setProperty("hibernate.connection.driver_class", "com.mysql.cj.jdbc.Driver");
config.setProperty("hibernate.connection.url", "jdbc:mysql://localhost:3306/mydb");
config.setProperty("hibernate.connection.username", "root");
config.setProperty("hibernate.connection.password", "password");
config.setProperty("hibernate.dialect", "org.hibernate.dialect.MySQL8Dialect");
config.setProperty("hibernate.show_sql", "true");
config.setProperty("hibernate.hbm2ddl.auto", "update");

config.addAnnotatedClass(User.class);
config.addAnnotatedClass(Order.class);

SessionFactory sessionFactory = config.buildSessionFactory();
```

**hbm2ddl.auto Values:**
- `create`: Drop and create schema on startup
- `create-drop`: Drop schema on shutdown
- `update`: Update schema (add new tables/columns)
- `validate`: Validate schema without making changes
- `none`: Do nothing

### 6. What is Hibernate Dialect?

**Answer:**
Dialect is a class that tells Hibernate how to generate SQL for a specific database. Each database has its own SQL syntax and features.

**Common Dialects:**
```java
// MySQL
org.hibernate.dialect.MySQL8Dialect
org.hibernate.dialect.MySQL5Dialect

// PostgreSQL
org.hibernate.dialect.PostgreSQLDialect
org.hibernate.dialect.PostgreSQL10Dialect

// Oracle
org.hibernate.dialect.Oracle12cDialect
org.hibernate.dialect.Oracle10gDialect

// SQL Server
org.hibernate.dialect.SQLServer2012Dialect

// H2 (In-memory)
org.hibernate.dialect.H2Dialect
```

**Why Dialect is Important:**
- Different SQL syntax for different databases
- Database-specific features (pagination, functions)
- Data type mapping
- Query optimization

**Example:**
```xml
<!-- MySQL -->
<property name="hibernate.dialect">org.hibernate.dialect.MySQL8Dialect</property>

<!-- PostgreSQL -->
<property name="hibernate.dialect">org.hibernate.dialect.PostgreSQLDialect</property>
```

---

## Entity Mapping

### 7. What are the different ways to map entities in Hibernate?

**Answer:**
Hibernate supports three ways to map entities:

**1. XML Mapping (hbm.xml):**
```xml
<!-- User.hbm.xml -->
<hibernate-mapping>
    <class name="com.example.User" table="users">
        <id name="id" column="id">
            <generator class="identity"/>
        </id>
        <property name="name" column="name"/>
        <property name="email" column="email"/>
    </class>
</hibernate-mapping>
```

**2. Annotations (JPA):**
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name", nullable = false, length = 100)
    private String name;
    
    @Column(name = "email", unique = true)
    private String email;
}
```

**3. Java-based Configuration (Hibernate 5+):**
```java
@Embeddable
public class Address {
    private String street;
    private String city;
}

@Entity
public class User {
    @Id
    @GeneratedValue
    private Long id;
    
    @Embedded
    private Address address;
}
```

**Comparison:**
- **XML**: More verbose, separate from code, easier to change without recompiling
- **Annotations**: Less verbose, embedded in code, type-safe
- **Annotations are preferred** in modern development

### 8. What is the difference between @Entity and @Table?

**Answer:**

**@Entity:**
- Marks a class as a JPA entity
- Required for entity classes
- Can be used without @Table (uses class name as table name)

**@Table:**
- Specifies the database table name
- Optional (defaults to entity name)
- Can specify schema, catalog, indexes, unique constraints

**Example:**
```java
// Without @Table (uses class name "User" as table name)
@Entity
public class User {
    @Id
    private Long id;
}

// With @Table (explicit table name)
@Entity
@Table(name = "users", schema = "public")
public class User {
    @Id
    private Long id;
}

// With additional table options
@Entity
@Table(
    name = "users",
    schema = "public",
    uniqueConstraints = @UniqueConstraint(columnNames = {"email"}),
    indexes = @Index(name = "idx_name", columnList = "name")
)
public class User {
    @Id
    private Long id;
    
    @Column(unique = true)
    private String email;
    
    private String name;
}
```

### 9. What are the different ID generation strategies in Hibernate?

**Answer:**
Hibernate provides several ID generation strategies:

**1. IDENTITY:**
- Database auto-increment
- Database generates ID
- Most common for MySQL, SQL Server

```java
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
```

**2. SEQUENCE:**
- Uses database sequence
- Good for Oracle, PostgreSQL

```java
@Id
@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_seq")
@SequenceGenerator(name = "user_seq", sequenceName = "user_sequence", allocationSize = 1)
private Long id;
```

**3. TABLE:**
- Uses a separate table to generate IDs
- Works with all databases
- Slower performance

```java
@Id
@GeneratedValue(strategy = GenerationType.TABLE, generator = "user_gen")
@TableGenerator(name = "user_gen", table = "id_generator", pkColumnName = "gen_name", valueColumnName = "gen_value")
private Long id;
```

**4. AUTO:**
- Hibernate chooses the strategy
- Default for @GeneratedValue

```java
@Id
@GeneratedValue(strategy = GenerationType.AUTO)
private Long id;
```

**5. UUID:**
- Generates UUID as ID
- Good for distributed systems

```java
@Id
@GeneratedValue(generator = "uuid")
@GenericGenerator(name = "uuid", strategy = "uuid2")
private String id;
```

### 10. What is the difference between @Column and @Basic?

**Answer:**

**@Column:**
- Specifies column mapping details
- Name, nullable, unique, length, precision, scale
- Used for customizing column properties

**@Basic:**
- Marks a field as a basic property
- Optional (default for non-relationship fields)
- Can specify fetch type (EAGER/LAZY)

**Example:**
```java
@Entity
public class User {
    @Id
    private Long id;
    
    // @Basic is implicit (default)
    private String name;
    
    // Explicit @Basic with fetch type
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "description", length = 1000)
    private String description;
    
    // @Column for customization
    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;
    
    // @Basic with @Column
    @Basic(optional = false)
    @Column(name = "age")
    private Integer age;
}
```

**When to Use:**
- **@Column**: When you need to customize column properties
- **@Basic**: When you need to specify fetch type or optionality

---

## Relationships

### 11. What are the different types of relationships in Hibernate?

**Answer:**
Hibernate supports four types of relationships:

**1. One-to-One (@OneToOne):**
```java
@Entity
public class User {
    @Id
    private Long id;
    
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "address_id")
    private Address address;
}

@Entity
public class Address {
    @Id
    private Long id;
    
    @OneToOne(mappedBy = "address")
    private User user;
}
```

**2. One-to-Many (@OneToMany):**
```java
@Entity
public class Department {
    @Id
    private Long id;
    
    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL)
    private List<Employee> employees = new ArrayList<>();
}

@Entity
public class Employee {
    @Id
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;
}
```

**3. Many-to-One (@ManyToOne):**
```java
@Entity
public class Order {
    @Id
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
```

**4. Many-to-Many (@ManyToMany):**
```java
@Entity
public class Student {
    @Id
    private Long id;
    
    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
        name = "student_course",
        joinColumns = @JoinColumn(name = "student_id"),
        inverseJoinColumns = @JoinColumn(name = "course_id")
    )
    private Set<Course> courses = new HashSet<>();
}

@Entity
public class Course {
    @Id
    private Long id;
    
    @ManyToMany(mappedBy = "courses")
    private Set<Student> students = new HashSet<>();
}
```

### 12. What is the difference between @JoinColumn and mappedBy?

**Answer:**

**@JoinColumn:**
- Defines the foreign key column
- Used on the owning side of the relationship
- Specifies the column name in the database

**mappedBy:**
- Indicates the relationship is mapped by the other side
- Used on the non-owning side
- Points to the field name in the other entity

**Example:**
```java
// Owning side (has @JoinColumn)
@Entity
public class Order {
    @Id
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id")  // Foreign key column
    private User user;
}

// Non-owning side (has mappedBy)
@Entity
public class User {
    @Id
    private Long id;
    
    @OneToMany(mappedBy = "user")  // Mapped by "user" field in Order
    private List<Order> orders = new ArrayList<>();
}
```

**Rules:**
- **@JoinColumn**: Always on the owning side (the side with the foreign key)
- **mappedBy**: Always on the non-owning side (the side without the foreign key)
- In bidirectional relationships, one side has @JoinColumn, other has mappedBy

### 13. What are Cascade Types in Hibernate?

**Answer:**
Cascade types define which operations should be cascaded from parent to child entities.

**Cascade Types:**
```java
public enum CascadeType {
    ALL,           // All operations
    PERSIST,        // Save operation
    MERGE,          // Update operation
    REMOVE,         // Delete operation
    REFRESH,        // Refresh operation
    DETACH          // Detach operation
}
```

**Example:**
```java
@Entity
public class Department {
    @Id
    private Long id;
    
    // Cascade all operations to employees
    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL)
    private List<Employee> employees = new ArrayList<>();
    
    // Cascade only persist and remove
    @OneToMany(mappedBy = "department", cascade = {CascadeType.PERSIST, CascadeType.REMOVE})
    private List<Employee> employees2 = new ArrayList<>();
}

// Usage
Department dept = new Department();
Employee emp = new Employee();
emp.setDepartment(dept);
dept.getEmployees().add(emp);

session.save(dept);  // Saves both department and employee (due to CASCADE)
```

**Common Use Cases:**
- **CascadeType.ALL**: Parent-child relationship (Order-OrderItem)
- **CascadeType.PERSIST**: When child should be saved with parent
- **CascadeType.REMOVE**: When child should be deleted with parent

---

## HQL and Criteria API

### 14. What is HQL (Hibernate Query Language)?

**Answer:**
HQL is an object-oriented query language similar to SQL but works with persistent objects and their properties instead of database tables and columns.

**Key Features:**
- Object-oriented (uses class and property names)
- Database independent
- Supports polymorphism
- Supports associations and joins

**Example:**
```java
// SQL
SELECT * FROM users WHERE name = 'John';

// HQL
Query query = session.createQuery("FROM User WHERE name = :name");
query.setParameter("name", "John");
List<User> users = query.list();

// HQL with joins
Query query = session.createQuery(
    "SELECT u FROM User u JOIN u.orders o WHERE o.total > :amount"
);
query.setParameter("amount", 100.0);
List<User> users = query.list();

// HQL with aggregation
Query query = session.createQuery(
    "SELECT u.name, COUNT(o) FROM User u LEFT JOIN u.orders o GROUP BY u.name"
);
List<Object[]> results = query.list();
```

**HQL vs SQL:**
- HQL uses class names (User) instead of table names (users)
- HQL uses property names (name) instead of column names (user_name)
- HQL is case-sensitive for class and property names
- HQL supports polymorphism

### 15. What is the Criteria API?

**Answer:**
Criteria API provides a type-safe, programmatic way to create queries. It's an alternative to HQL.

**Benefits:**
- Type-safe (compile-time checking)
- Dynamic query building
- No string concatenation
- IDE support

**Example:**
```java
// Simple Criteria query
Criteria criteria = session.createCriteria(User.class);
criteria.add(Restrictions.eq("name", "John"));
List<User> users = criteria.list();

// Criteria with multiple conditions
Criteria criteria = session.createCriteria(User.class);
criteria.add(Restrictions.eq("name", "John"));
criteria.add(Restrictions.gt("age", 18));
criteria.addOrder(Order.asc("name"));
List<User> users = criteria.list();

// Criteria with joins
Criteria criteria = session.createCriteria(User.class);
criteria.createAlias("orders", "o");
criteria.add(Restrictions.gt("o.total", 100.0));
List<User> users = criteria.list();

// Criteria with projections
Criteria criteria = session.createCriteria(User.class);
criteria.setProjection(Projections.rowCount());
Long count = (Long) criteria.uniqueResult();
```

**Criteria API (JPA 2.0 - Type-safe):**
```java
// JPA Criteria API (type-safe)
CriteriaBuilder cb = session.getCriteriaBuilder();
CriteriaQuery<User> query = cb.createQuery(User.class);
Root<User> root = query.from(User.class);
query.select(root).where(cb.equal(root.get("name"), "John"));
List<User> users = session.createQuery(query).getResultList();
```

### 16. What is the difference between get() and load() methods?

**Answer:**

**get():**
- Returns the object immediately
- Returns `null` if object not found
- Always hits the database
- Eager loading

**load():**
- Returns a proxy object
- Throws `ObjectNotFoundException` if object not found (when accessed)
- May not hit database immediately (lazy loading)
- Lazy loading

**Example:**
```java
// get() - Immediate database hit
User user = session.get(User.class, 1L);
if (user != null) {
    System.out.println(user.getName());  // Database already hit
}

// load() - Lazy loading
User user = session.load(User.class, 1L);
// No database hit yet
System.out.println(user.getName());  // Database hit here (if not in cache)

// get() with non-existent ID
User user = session.get(User.class, 999L);  // Returns null

// load() with non-existent ID
User user = session.load(User.class, 999L);  // Returns proxy
System.out.println(user.getName());  // Throws ObjectNotFoundException
```

**When to Use:**
- **get()**: When you need to check if object exists, when you need immediate data
- **load()**: When you're sure object exists, when you want lazy loading

---

## Session and Transaction Management

### 17. What is a Hibernate Session?

**Answer:**
Session is the main interface between Java application and Hibernate. It's a short-lived, non-thread-safe object that represents a conversation between the application and the database.

**Session Lifecycle:**
```java
// 1. Open session
Session session = sessionFactory.openSession();

// 2. Begin transaction
Transaction tx = session.beginTransaction();

// 3. Perform operations
User user = new User();
user.setName("John");
session.save(user);

// 4. Commit transaction
tx.commit();

// 5. Close session
session.close();
```

**Session Methods:**
```java
// Save operations
session.save(object);           // Saves new object
session.persist(object);        // Saves new object (JPA)
session.update(object);         // Updates existing object
session.saveOrUpdate(object);   // Saves or updates

// Retrieve operations
session.get(Class, id);         // Get by ID
session.load(Class, id);        // Load by ID (lazy)
session.createQuery("...");      // Create HQL query

// Delete operations
session.delete(object);         // Delete object

// Flush and clear
session.flush();                // Flush changes to database
session.clear();                // Clear session cache
session.evict(object);          // Remove object from cache
```

**Session States:**
- **Transient**: Object not associated with session
- **Persistent**: Object associated with session
- **Detached**: Object was persistent but session closed
- **Removed**: Object marked for deletion

### 18. What is the difference between save(), persist(), and saveOrUpdate()?

**Answer:**

**save():**
- Returns generated ID immediately
- Can be called outside transaction (but not recommended)
- Assigns ID to object

**persist():**
- Returns void
- Must be called inside transaction
- JPA standard method
- May not assign ID immediately

**saveOrUpdate():**
- Saves if transient, updates if detached
- Determines state automatically
- Useful for web applications

**Example:**
```java
// save()
User user = new User();
user.setName("John");
Long id = (Long) session.save(user);  // Returns ID
System.out.println(id);  // ID assigned

// persist()
User user = new User();
user.setName("John");
session.persist(user);  // Returns void
// ID assigned after flush

// saveOrUpdate()
User user = new User();
user.setName("John");
session.saveOrUpdate(user);  // Saves (transient)

user.setName("Jane");
session.saveOrUpdate(user);  // Updates (detached)
```

### 19. What is the difference between merge() and update()?

**Answer:**

**update():**
- Updates detached object
- Throws exception if object already persistent
- Attaches object to session

**merge():**
- Merges detached object with persistent state
- Returns managed instance
- Doesn't throw exception if object already persistent
- JPA standard method

**Example:**
```java
// update()
Session session1 = sessionFactory.openSession();
Transaction tx1 = session1.beginTransaction();
User user = session1.get(User.class, 1L);
tx1.commit();
session1.close();  // User is now detached

Session session2 = sessionFactory.openSession();
Transaction tx2 = session2.beginTransaction();
user.setName("Updated");
session2.update(user);  // Updates detached object
tx2.commit();
session2.close();

// merge()
Session session1 = sessionFactory.openSession();
Transaction tx1 = session1.beginTransaction();
User user = session1.get(User.class, 1L);
tx1.commit();
session1.close();  // User is now detached

Session session2 = sessionFactory.openSession();
Transaction tx2 = session2.beginTransaction();
user.setName("Updated");
User mergedUser = session2.merge(user);  // Returns managed instance
tx2.commit();
session2.close();
```

**When to Use:**
- **update()**: When you're sure object is detached
- **merge()**: When you're not sure about object state (web applications)

---

## Caching

### 20. What are the different types of caching in Hibernate?

**Answer:**
Hibernate provides two levels of caching:

**1. First-Level Cache (Session Cache):**
- Associated with Session
- Enabled by default
- Automatic
- Lifecycle tied to session
- Not shared across sessions

**2. Second-Level Cache:**
- Associated with SessionFactory
- Optional (needs configuration)
- Shared across sessions
- Requires cache provider (EhCache, Infinispan, etc.)

**Example:**
```java
// First-level cache
Session session = sessionFactory.openSession();
User user1 = session.get(User.class, 1L);  // Database hit
User user2 = session.get(User.class, 1L);  // Cache hit (no database)
session.close();

// Second-level cache (needs configuration)
// hibernate.cfg.xml
<property name="hibernate.cache.use_second_level_cache">true</property>
<property name="hibernate.cache.region.factory_class">
    org.hibernate.cache.ehcache.EhCacheRegionFactory
</property>

// Entity with cache
@Entity
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class User {
    // ...
}
```

### 21. What is Query Cache in Hibernate?

**Answer:**
Query Cache stores the results of queries. It works with second-level cache.

**Configuration:**
```xml
<property name="hibernate.cache.use_query_cache">true</property>
```

**Usage:**
```java
// Enable query cache
Query query = session.createQuery("FROM User WHERE name = :name");
query.setCacheable(true);
query.setParameter("name", "John");
List<User> users = query.list();  // First execution - database hit

// Same query - cache hit
Query query2 = session.createQuery("FROM User WHERE name = :name");
query2.setCacheable(true);
query2.setParameter("name", "John");
List<User> users2 = query2.list();  // Cache hit (no database)
```

**How it Works:**
1. Query results are cached with query and parameters as key
2. When same query executed, results returned from cache
3. Cache invalidated when related entities updated

---

## Performance Optimization

### 22. What is the N+1 Problem in Hibernate?

**Answer:**
N+1 problem occurs when Hibernate executes one query to fetch parent entities and N additional queries to fetch associated child entities.

**Example:**
```java
// N+1 Problem
List<Department> departments = session.createQuery("FROM Department").list();
// 1 query executed

for (Department dept : departments) {
    System.out.println(dept.getEmployees().size());  
    // N queries executed (one per department)
}
// Total: 1 + N queries
```

**Solutions:**

**1. Eager Fetching (JOIN FETCH):**
```java
// Single query with join
List<Department> departments = session.createQuery(
    "SELECT DISTINCT d FROM Department d JOIN FETCH d.employees"
).list();
// Only 1 query executed
```

**2. Batch Fetching:**
```java
// Entity configuration
@Entity
@BatchSize(size = 10)
public class Department {
    @OneToMany(mappedBy = "department")
    private List<Employee> employees;
}
// Executes queries in batches
```

**3. Subselect Fetching:**
```java
@Entity
public class Department {
    @OneToMany(mappedBy = "department", fetch = FetchType.LAZY)
    @Fetch(FetchMode.SUBSELECT)
    private List<Employee> employees;
}
// Uses subselect to fetch all employees at once
```

### 23. What is Lazy Loading and Eager Loading?

**Answer:**

**Lazy Loading:**
- Loads data on demand
- Default for collections (@OneToMany, @ManyToMany)
- Better performance (loads only what's needed)
- May cause LazyInitializationException

**Eager Loading:**
- Loads data immediately
- Default for @ManyToOne, @OneToOne
- May cause N+1 problem
- Always available

**Example:**
```java
// Lazy Loading (default)
@Entity
public class Department {
    @OneToMany(mappedBy = "department", fetch = FetchType.LAZY)
    private List<Employee> employees;  // Not loaded until accessed
}

// Eager Loading
@Entity
public class Department {
    @OneToMany(mappedBy = "department", fetch = FetchType.EAGER)
    private List<Employee> employees;  // Loaded immediately
}

// Usage
Department dept = session.get(Department.class, 1L);
// With LAZY: employees not loaded
// With EAGER: employees loaded immediately

List<Employee> employees = dept.getEmployees();  
// With LAZY: database hit here (if session open)
// With EAGER: already loaded
```

**Best Practice:**
- Use **LAZY** for collections (default)
- Use **EAGER** only when necessary
- Use **JOIN FETCH** for specific queries that need eager loading

---

## Advanced Topics

### 24. What are Hibernate Interceptors?

**Answer:**
Interceptors allow you to intercept and customize Hibernate operations.

**Example:**
```java
public class AuditInterceptor extends EmptyInterceptor {
    @Override
    public boolean onSave(Object entity, Serializable id, 
                         Object[] state, String[] propertyNames, 
                         Type[] types) {
        if (entity instanceof Auditable) {
            for (int i = 0; i < propertyNames.length; i++) {
                if ("createdDate".equals(propertyNames[i])) {
                    state[i] = new Date();
                    return true;
                }
            }
        }
        return false;
    }
    
    @Override
    public boolean onFlushDirty(Object entity, Serializable id,
                                Object[] currentState, Object[] previousState,
                                String[] propertyNames, Type[] types) {
        if (entity instanceof Auditable) {
            for (int i = 0; i < propertyNames.length; i++) {
                if ("updatedDate".equals(propertyNames[i])) {
                    currentState[i] = new Date();
                    return true;
                }
            }
        }
        return false;
    }
}

// Usage
Session session = sessionFactory.withOptions()
    .interceptor(new AuditInterceptor())
    .openSession();
```

### 25. What is Hibernate Envers (Auditing)?

**Answer:**
Hibernate Envers provides auditing and versioning of entities.

**Configuration:**
```xml
<property name="hibernate.envers.audit_table_suffix">_aud</property>
```

**Usage:**
```java
@Entity
@Audited
public class User {
    @Id
    @GeneratedValue
    private Long id;
    
    private String name;
    
    @Audited(targetAuditMode = RelationTargetAuditMode.NOT_AUDITED)
    @ManyToOne
    private Department department;
}

// Query audit history
AuditReader reader = AuditReaderFactory.get(session);
List<Number> revisions = reader.getRevisions(User.class, userId);
User userAtRevision = reader.find(User.class, userId, revisionNumber);
```

### 26. What is the difference between Hibernate and JPA?

**Answer:**

| Feature | Hibernate | JPA |
|---------|-----------|-----|
| **Type** | ORM Framework | Specification |
| **Implementation** | Hibernate implements JPA | Interface/API |
| **Provider** | Hibernate is a JPA provider | Multiple providers (Hibernate, EclipseLink, etc.) |
| **Features** | More features than JPA | Standard features only |
| **Portability** | Hibernate-specific | Portable across providers |
| **Native Features** | HQL, Criteria (legacy) | JPQL, Criteria API |

**Example:**
```java
// JPA (portable)
@Entity
public class User {
    @Id
    @GeneratedValue
    private Long id;
}

EntityManager em = emf.createEntityManager();
User user = em.find(User.class, 1L);

// Hibernate (specific)
Session session = sessionFactory.openSession();
User user = session.get(User.class, 1L);
```

---

## Best Practices

### 27. What are some Hibernate best practices?

**Answer:**

**1. Always use transactions:**
```java
// ✅ Good
Transaction tx = session.beginTransaction();
session.save(user);
tx.commit();

// ❌ Bad
session.save(user);  // Without transaction
```

**2. Close sessions properly:**
```java
// ✅ Good - try-with-resources
try (Session session = sessionFactory.openSession()) {
    // Use session
}

// ✅ Good - finally block
Session session = sessionFactory.openSession();
try {
    // Use session
} finally {
    session.close();
}
```

**3. Use lazy loading for collections:**
```java
// ✅ Good
@OneToMany(fetch = FetchType.LAZY)
private List<Order> orders;

// ❌ Bad (unless necessary)
@OneToMany(fetch = FetchType.EAGER)
private List<Order> orders;
```

**4. Use JOIN FETCH to avoid N+1:**
```java
// ✅ Good
List<Department> depts = session.createQuery(
    "SELECT DISTINCT d FROM Department d JOIN FETCH d.employees"
).list();

// ❌ Bad
List<Department> depts = session.createQuery("FROM Department").list();
for (Department d : depts) {
    d.getEmployees().size();  // N+1 problem
}
```

**5. Use batch operations:**
```java
// ✅ Good
for (int i = 0; i < 1000; i++) {
    session.save(new User());
    if (i % 50 == 0) {
        session.flush();
        session.clear();
    }
}

// ❌ Bad
for (int i = 0; i < 1000; i++) {
    session.save(new User());  // All in memory
}
```

**6. Use DTOs for read-only operations:**
```java
// ✅ Good - DTO projection
Query query = session.createQuery(
    "SELECT new com.example.UserDTO(u.id, u.name) FROM User u"
);
List<UserDTO> users = query.list();

// ❌ Bad - Loading full entities
List<User> users = session.createQuery("FROM User").list();
```

**7. Avoid select N+1:**
```java
// ✅ Good - Batch fetching
@Entity
@BatchSize(size = 10)
public class Department {
    @OneToMany(mappedBy = "department")
    private List<Employee> employees;
}
```

### 28. How do you handle LazyInitializationException?

**Answer:**
LazyInitializationException occurs when trying to access lazy-loaded associations outside an active session.

**Solutions:**

**1. Keep session open (Open Session in View):**
```java
// In web application - filter
public class OpenSessionInViewFilter implements Filter {
    public void doFilter(ServletRequest request, ServletResponse response, 
                        FilterChain chain) {
        Session session = sessionFactory.openSession();
        try {
            chain.doFilter(request, response);
        } finally {
            session.close();
        }
    }
}
```

**2. Use JOIN FETCH:**
```java
// Eagerly fetch in query
List<Department> depts = session.createQuery(
    "SELECT DISTINCT d FROM Department d JOIN FETCH d.employees"
).list();
```

**3. Initialize proxy (Hibernate.initialize()):**
```java
Department dept = session.get(Department.class, 1L);
Hibernate.initialize(dept.getEmployees());  // Initialize collection
session.close();
// Now can access employees
```

**4. Use DTO projection:**
```java
// Fetch only needed data
Query query = session.createQuery(
    "SELECT new com.example.DeptDTO(d.id, d.name, e.name) " +
    "FROM Department d JOIN d.employees e"
);
```

### 29. What is the difference between flush() and commit()?

**Answer:**

**flush():**
- Synchronizes session state with database
- Executes SQL statements but doesn't commit transaction
- Can be called multiple times
- Doesn't end transaction

**commit():**
- Commits the transaction
- Automatically flushes before committing
- Ends the transaction
- Makes changes permanent

**Example:**
```java
Transaction tx = session.beginTransaction();

User user = new User();
user.setName("John");
session.save(user);

session.flush();  // SQL executed, but not committed
// Changes visible in same transaction, not in other transactions

User user2 = session.get(User.class, user.getId());  // Can see user

tx.commit();  // Commits transaction, changes permanent
// Now visible to all transactions
```

**When to Use:**
- **flush()**: When you need to see changes in same transaction, before commit
- **commit()**: To make changes permanent

### 30. What are Hibernate Statistics and how do you use them?

**Answer:**
Hibernate Statistics provides information about Hibernate operations for performance monitoring.

**Enable Statistics:**
```xml
<property name="hibernate.generate_statistics">true</property>
```

**Usage:**
```java
Statistics stats = sessionFactory.getStatistics();

// Query statistics
long queryCount = stats.getQueryExecutionCount();
long queryCacheHitCount = stats.getQueryCacheHitCount();

// Entity statistics
long entityInsertCount = stats.getEntityInsertCount();
long entityUpdateCount = stats.getEntityUpdateCount();
long entityDeleteCount = stats.getEntityDeleteCount();

// Collection statistics
long collectionLoadCount = stats.getCollectionLoadCount();

// Session statistics
long sessionOpenCount = stats.getSessionOpenCount();
long sessionCloseCount = stats.getSessionCloseCount();

// Transaction statistics
long transactionCount = stats.getTransactionCount();
long successfulTransactionCount = stats.getSuccessfulTransactionCount();

// Print all statistics
System.out.println(stats);
stats.logSummary();
```

**Use Cases:**
- Performance monitoring
- Identifying N+1 problems
- Cache hit rate analysis
- Query optimization

---

## Summary

This comprehensive guide covers essential Hibernate interview questions from basic concepts to advanced topics. Key areas include:

1. **Fundamentals**: Hibernate features, ORM, core interfaces
2. **Configuration**: XML and Java configuration, dialects
3. **Entity Mapping**: Annotations, ID generation, column mapping
4. **Relationships**: One-to-One, One-to-Many, Many-to-Many, cascade types
5. **Querying**: HQL, Criteria API, get() vs load()
6. **Session Management**: Session lifecycle, save/persist/merge/update
7. **Caching**: First-level, second-level, query cache
8. **Performance**: N+1 problem, lazy vs eager loading, optimization
9. **Advanced**: Interceptors, Envers, Hibernate vs JPA
10. **Best Practices**: Transaction management, exception handling, statistics

Remember to practice with Hibernate and understand the underlying concepts. Good luck with your Hibernate interviews!

