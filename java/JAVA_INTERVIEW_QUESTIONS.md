# Java Interview Questions and Answers

This comprehensive guide covers essential Java interview questions from basic concepts to advanced topics. Each question includes detailed answers with practical code examples.

## Table of Contents

1. [Java Fundamentals](#java-fundamentals)
2. [Object-Oriented Programming](#object-oriented-programming)
3. [Collections Framework](#collections-framework)
4. [Exception Handling](#exception-handling)
5. [Multithreading and Concurrency](#multithreading-and-concurrency)
6. [Java 8+ Features](#java-8-features)
7. [Memory Management and JVM](#memory-management-and-jvm)
8. [Design Patterns](#design-patterns)
9. [Advanced Topics](#advanced-topics)
10. [Best Practices](#best-practices)

---

## Java Fundamentals

### 1. What is Java and what are its key features?

**Answer:**
Java is a high-level, object-oriented programming language developed by Sun Microsystems (now owned by Oracle). It's designed to be platform-independent through the "Write Once, Run Anywhere" (WORA) principle.

**Key Features:**

1. **Platform Independent**: Compiled to bytecode that runs on JVM
2. **Object-Oriented**: Everything is an object (except primitives)
3. **Simple**: Easy to learn and use
4. **Secure**: Built-in security features
5. **Robust**: Strong memory management, exception handling
6. **Multithreaded**: Built-in support for concurrent programming
7. **Architecture Neutral**: No implementation-dependent features
8. **Portable**: Can run on any platform with JVM
9. **High Performance**: JIT compiler for optimization
10. **Distributed**: Network-centric programming support

**Example:**
```java
// Simple Java program
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

### 2. What is the difference between JDK, JRE, and JVM?

**Answer:**

**JVM (Java Virtual Machine):**
- Abstract machine that provides runtime environment
- Converts bytecode to machine code
- Platform-dependent (different for Windows, Linux, macOS)
- Provides memory management, garbage collection

**JRE (Java Runtime Environment):**
- Contains JVM + libraries + other files
- Required to run Java applications
- Does not contain development tools (compiler, debugger)
- Smaller than JDK

**JDK (Java Development Kit):**
- Contains JRE + development tools
- Includes compiler (javac), debugger, documentation
- Required to develop Java applications
- Larger than JRE

**Relationship:**
```
JDK = JRE + Development Tools
JRE = JVM + Libraries
```

**Example:**
```bash
# Check JDK version
javac -version

# Check JRE version
java -version

# Compile Java file (requires JDK)
javac HelloWorld.java

# Run Java program (requires JRE)
java HelloWorld
```

### 3. What are the main differences between Java and C++?

**Answer:**

| Feature | Java | C++ |
|---------|------|-----|
| **Platform** | Platform-independent (JVM) | Platform-dependent |
| **Memory Management** | Automatic (Garbage Collection) | Manual (new/delete) |
| **Pointers** | No explicit pointers | Supports pointers |
| **Multiple Inheritance** | Through interfaces only | Supports multiple inheritance |
| **Operator Overloading** | Not supported | Supported |
| **Preprocessor** | No preprocessor | Has preprocessor (#include, #define) |
| **Compilation** | Compiled to bytecode | Compiled to machine code |
| **Type System** | Strongly typed | Strongly typed |
| **Exception Handling** | Checked and unchecked | Only unchecked |
| **Thread Support** | Built-in | Requires external libraries |

**Example:**
```java
// Java: Automatic memory management
public class Example {
    public void method() {
        String str = new String("Hello");  // GC handles cleanup
        // No need to delete
    }
}
```

```cpp
// C++: Manual memory management
void method() {
    string* str = new string("Hello");
    delete str;  // Must manually delete
}
```

### 4. What are the primitive data types in Java?

**Answer:**
Java has 8 primitive data types that are not objects and are stored directly in memory.

**Primitive Types:**

1. **byte**: 8-bit signed integer (-128 to 127)
2. **short**: 16-bit signed integer (-32,768 to 32,767)
3. **int**: 32-bit signed integer (-2³¹ to 2³¹-1)
4. **long**: 64-bit signed integer (-2⁶³ to 2⁶³-1)
5. **float**: 32-bit IEEE 754 floating point
6. **double**: 64-bit IEEE 754 floating point
7. **boolean**: true or false
8. **char**: 16-bit Unicode character (0 to 65,535)

**Example:**
```java
public class PrimitiveTypes {
    public static void main(String[] args) {
        // Integer types
        byte b = 127;
        short s = 32767;
        int i = 2147483647;
        long l = 9223372036854775807L;  // Note the 'L' suffix
        
        // Floating point types
        float f = 3.14f;  // Note the 'f' suffix
        double d = 3.141592653589793;
        
        // Boolean
        boolean flag = true;
        
        // Character
        char c = 'A';
        
        // Default values (for instance variables)
        int defaultInt;  // 0
        boolean defaultBool;  // false
        char defaultChar;  // '\u0000'
    }
}
```

**Wrapper Classes:**
Each primitive has a corresponding wrapper class:
- `Byte`, `Short`, `Integer`, `Long`
- `Float`, `Double`
- `Boolean`, `Character`

### 5. What is the difference between == and equals() in Java?

**Answer:**

**== Operator:**
- Compares references (memory addresses) for objects
- Compares values for primitives
- Returns `true` if both references point to the same object

**equals() Method:**
- Compares the actual content/value of objects
- Defined in `Object` class
- Should be overridden for meaningful comparison
- Default implementation uses `==`

**Example:**
```java
public class EqualsExample {
    public static void main(String[] args) {
        String str1 = new String("Hello");
        String str2 = new String("Hello");
        String str3 = str1;
        
        // == compares references
        System.out.println(str1 == str2);  // false (different objects)
        System.out.println(str1 == str3);    // true (same reference)
        
        // equals() compares values
        System.out.println(str1.equals(str2));  // true (same content)
        System.out.println(str1.equals(str3)); // true (same content)
        
        // String literals (interned)
        String str4 = "Hello";
        String str5 = "Hello";
        System.out.println(str4 == str5);  // true (same string pool reference)
    }
}
```

**Best Practice:**
```java
// Always use equals() for object comparison
if (str1.equals(str2)) {  // ✅ Good
    // ...
}

// For null safety, use Objects.equals()
if (Objects.equals(str1, str2)) {  // ✅ Better (handles null)
    // ...
}

// Or check null first
if (str1 != null && str1.equals(str2)) {  // ✅ Safe
    // ...
}
```

### 6. What is the String Pool in Java?

**Answer:**
String Pool (String Intern Pool) is a special memory area in the heap where string literals are stored to optimize memory usage.

**How it Works:**
- When a string literal is created, JVM checks the pool
- If the string exists, returns reference to existing object
- If not, creates new string and adds to pool
- `intern()` method can add strings to pool manually

**Example:**
```java
public class StringPool {
    public static void main(String[] args) {
        // String literals (stored in pool)
        String str1 = "Hello";
        String str2 = "Hello";
        System.out.println(str1 == str2);  // true (same pool reference)
        
        // new String() (creates new object, not in pool)
        String str3 = new String("Hello");
        String str4 = new String("Hello");
        System.out.println(str3 == str4);  // false (different objects)
        
        // intern() adds to pool
        String str5 = str3.intern();
        System.out.println(str1 == str5);  // true (now in pool)
        
        // Concatenation at compile time (in pool)
        String str6 = "Hel" + "lo";
        System.out.println(str1 == str6);  // true
        
        // Concatenation at runtime (new object)
        String str7 = "Hel";
        String str8 = str7 + "lo";
        System.out.println(str1 == str8);  // false
    }
}
```

**Benefits:**
- Memory efficiency (reuse of string literals)
- Faster string comparison (can use == for interned strings)
- Reduced memory footprint

---

## Object-Oriented Programming

### 7. What are the four pillars of OOP in Java?

**Answer:**
The four pillars of Object-Oriented Programming are:

**1. Encapsulation:**
- Bundling data and methods together
- Hiding internal implementation details
- Access modifiers (private, protected, public)

**Example:**
```java
public class BankAccount {
    private double balance;  // Encapsulated data
    
    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
        }
    }
    
    public double getBalance() {
        return balance;
    }
}
```

**2. Inheritance:**
- Creating new classes based on existing classes
- Code reusability
- `extends` keyword

**Example:**
```java
class Animal {
    void eat() {
        System.out.println("Eating...");
    }
}

class Dog extends Animal {
    void bark() {
        System.out.println("Barking...");
    }
}

// Dog inherits eat() method
Dog dog = new Dog();
dog.eat();   // Inherited
dog.bark();  // Own method
```

**3. Polymorphism:**
- Same interface, different implementations
- Method overriding and overloading
- Runtime polymorphism (dynamic binding)

**Example:**
```java
class Animal {
    void makeSound() {
        System.out.println("Animal sound");
    }
}

class Dog extends Animal {
    @Override
    void makeSound() {
        System.out.println("Woof!");
    }
}

class Cat extends Animal {
    @Override
    void makeSound() {
        System.out.println("Meow!");
    }
}

// Polymorphism
Animal animal1 = new Dog();
Animal animal2 = new Cat();
animal1.makeSound();  // "Woof!"
animal2.makeSound();  // "Meow!"
```

**4. Abstraction:**
- Hiding implementation details
- Abstract classes and interfaces
- Showing only essential features

**Example:**
```java
// Abstract class
abstract class Shape {
    abstract double area();  // Abstract method
    
    void display() {  // Concrete method
        System.out.println("Shape area: " + area());
    }
}

class Circle extends Shape {
    private double radius;
    
    Circle(double radius) {
        this.radius = radius;
    }
    
    @Override
    double area() {
        return Math.PI * radius * radius;
    }
}

// Interface
interface Drawable {
    void draw();  // Implicitly public and abstract
}

class Rectangle implements Drawable {
    @Override
    public void draw() {
        System.out.println("Drawing rectangle");
    }
}
```

### 8. What is the difference between abstract class and interface?

**Answer:**

| Feature | Abstract Class | Interface |
|---------|---------------|-----------|
| **Keyword** | `abstract class` | `interface` |
| **Variables** | Can have any access modifier | Public, static, final only |
| **Methods** | Can have abstract and concrete methods | Abstract methods (Java 7), default/static (Java 8+) |
| **Constructor** | Can have constructor | Cannot have constructor |
| **Multiple Inheritance** | Cannot extend multiple classes | Can implement multiple interfaces |
| **Access Modifiers** | Any access modifier | Public by default |
| **Usage** | IS-A relationship | CAN-DO relationship |

**Example:**
```java
// Abstract class
abstract class Animal {
    protected String name;  // Can have instance variables
    
    public Animal(String name) {  // Can have constructor
        this.name = name;
    }
    
    abstract void makeSound();  // Abstract method
    
    void sleep() {  // Concrete method
        System.out.println(name + " is sleeping");
    }
}

// Interface (Java 8+)
interface Flyable {
    void fly();  // Abstract method
    
    default void land() {  // Default method
        System.out.println("Landing...");
    }
    
    static void info() {  // Static method
        System.out.println("This is a flyable object");
    }
}

// Multiple interfaces
interface Swimmable {
    void swim();
}

class Duck extends Animal implements Flyable, Swimmable {
    public Duck(String name) {
        super(name);
    }
    
    @Override
    void makeSound() {
        System.out.println("Quack!");
    }
    
    @Override
    public void fly() {
        System.out.println(name + " is flying");
    }
    
    @Override
    public void swim() {
        System.out.println(name + " is swimming");
    }
}
```

### 9. What is method overriding and method overloading?

**Answer:**

**Method Overriding:**
- Redefining a method in a subclass
- Same method signature (name, parameters, return type)
- Runtime polymorphism
- `@Override` annotation recommended

**Method Overloading:**
- Multiple methods with same name but different parameters
- Different method signatures
- Compile-time polymorphism
- Can have different return types (but not just based on return type)

**Example:**
```java
class Parent {
    void display() {
        System.out.println("Parent display");
    }
    
    void show(int x) {
        System.out.println("Parent show: " + x);
    }
}

class Child extends Parent {
    // Method Overriding
    @Override
    void display() {
        System.out.println("Child display");
    }
    
    // Method Overloading (in same class)
    void show(int x) {
        System.out.println("Child show: " + x);
    }
    
    void show(String s) {  // Overloaded method
        System.out.println("Child show: " + s);
    }
    
    void show(int x, String s) {  // Overloaded method
        System.out.println("Child show: " + x + ", " + s);
    }
}

// Usage
Parent parent = new Child();
parent.display();  // "Child display" (overriding)
parent.show(10);  // "Child show: 10" (overriding)

Child child = new Child();
child.show(10);           // "Child show: 10"
child.show("Hello");       // "Child show: Hello" (overloading)
child.show(10, "Hello");   // "Child show: 10, Hello" (overloading)
```

**Rules for Overriding:**
- Method signature must match
- Return type must be same or covariant
- Access modifier cannot be more restrictive
- Cannot override static, final, or private methods

**Rules for Overloading:**
- Must have different parameter list
- Return type can be different
- Access modifier can be different
- Can throw different exceptions

### 10. What is the difference between static and instance methods/variables?

**Answer:**

**Static:**
- Belongs to the class, not instance
- Shared among all instances
- Accessed using class name
- Cannot access instance variables/methods directly
- Loaded when class is loaded

**Instance:**
- Belongs to specific instance
- Each object has its own copy
- Accessed using object reference
- Can access both static and instance members

**Example:**
```java
public class Counter {
    // Instance variable
    private int instanceCount = 0;
    
    // Static variable
    private static int staticCount = 0;
    
    // Instance method
    public void incrementInstance() {
        instanceCount++;
        staticCount++;  // Can access static from instance
    }
    
    // Static method
    public static void incrementStatic() {
        staticCount++;
        // instanceCount++;  // ❌ Cannot access instance from static
    }
    
    public int getInstanceCount() {
        return instanceCount;
    }
    
    public static int getStaticCount() {
        return staticCount;
    }
}

// Usage
Counter c1 = new Counter();
Counter c2 = new Counter();

c1.incrementInstance();  // instanceCount=1, staticCount=1
c2.incrementInstance();  // instanceCount=1, staticCount=2

System.out.println(c1.getInstanceCount());  // 1
System.out.println(c2.getInstanceCount());   // 1
System.out.println(Counter.getStaticCount()); // 2 (shared)

Counter.incrementStatic();  // staticCount=3
System.out.println(Counter.getStaticCount()); // 3
```

**Common Use Cases:**
```java
// Static: Utility methods, constants, counters
class MathUtils {
    public static final double PI = 3.14159;
    
    public static int add(int a, int b) {
        return a + b;
    }
}

// Instance: Object-specific behavior
class BankAccount {
    private double balance;
    
    public void deposit(double amount) {
        balance += amount;
    }
}
```

---

## Collections Framework

### 11. What is the Java Collections Framework?

**Answer:**
The Collections Framework is a unified architecture for representing and manipulating collections. It provides interfaces, implementations, and algorithms.

**Main Interfaces:**

1. **Collection** (root interface)
   - `List`: Ordered, allows duplicates
   - `Set`: No duplicates
   - `Queue`: FIFO ordering

2. **Map**: Key-value pairs

**Example:**
```java
import java.util.*;

public class CollectionsExample {
    public static void main(String[] args) {
        // List - ArrayList
        List<String> list = new ArrayList<>();
        list.add("Apple");
        list.add("Banana");
        list.add("Apple");  // Allows duplicates
        System.out.println(list);  // [Apple, Banana, Apple]
        
        // Set - HashSet
        Set<String> set = new HashSet<>();
        set.add("Apple");
        set.add("Banana");
        set.add("Apple");  // Duplicate ignored
        System.out.println(set);  // [Apple, Banana]
        
        // Map - HashMap
        Map<String, Integer> map = new HashMap<>();
        map.put("Apple", 10);
        map.put("Banana", 20);
        System.out.println(map);  // {Apple=10, Banana=20}
        
        // Queue - LinkedList
        Queue<String> queue = new LinkedList<>();
        queue.offer("First");
        queue.offer("Second");
        System.out.println(queue.poll());  // "First"
    }
}
```

### 12. What is the difference between ArrayList and LinkedList?

**Answer:**

| Feature | ArrayList | LinkedList |
|---------|-----------|------------|
| **Underlying Structure** | Dynamic array | Doubly linked list |
| **Random Access** | O(1) - Fast | O(n) - Slow |
| **Insertion at End** | O(1) amortized | O(1) |
| **Insertion at Middle** | O(n) | O(1) if have reference |
| **Deletion** | O(n) | O(1) if have reference |
| **Memory** | Less overhead | More overhead (pointers) |
| **Use Case** | Frequent random access | Frequent insertions/deletions |

**Example:**
```java
import java.util.*;

public class ListComparison {
    public static void main(String[] args) {
        // ArrayList - Better for random access
        List<Integer> arrayList = new ArrayList<>();
        for (int i = 0; i < 1000000; i++) {
            arrayList.add(i);
        }
        
        long start = System.currentTimeMillis();
        arrayList.get(500000);  // Fast - O(1)
        long end = System.currentTimeMillis();
        System.out.println("ArrayList get: " + (end - start) + "ms");
        
        // LinkedList - Better for insertions/deletions
        List<Integer> linkedList = new LinkedList<>();
        for (int i = 0; i < 1000000; i++) {
            linkedList.add(i);
        }
        
        start = System.currentTimeMillis();
        linkedList.get(500000);  // Slow - O(n)
        end = System.currentTimeMillis();
        System.out.println("LinkedList get: " + (end - start) + "ms");
        
        // Insertion in middle
        start = System.currentTimeMillis();
        arrayList.add(500000, 999);  // O(n) - needs to shift
        end = System.currentTimeMillis();
        System.out.println("ArrayList insert: " + (end - start) + "ms");
        
        start = System.currentTimeMillis();
        linkedList.add(500000, 999);  // O(n) - needs to traverse
        end = System.currentTimeMillis();
        System.out.println("LinkedList insert: " + (end - start) + "ms");
    }
}
```

**When to Use:**
- **ArrayList**: When you need frequent random access, fewer insertions/deletions
- **LinkedList**: When you need frequent insertions/deletions, less random access

### 13. What is the difference between HashMap and HashTable?

**Answer:**

| Feature | HashMap | Hashtable |
|---------|---------|-----------|
| **Synchronization** | Not synchronized (not thread-safe) | Synchronized (thread-safe) |
| **Null Keys/Values** | Allows one null key, multiple null values | Does not allow null |
| **Performance** | Faster (no synchronization overhead) | Slower (synchronization overhead) |
| **Iteration** | Fail-fast iterator | Fail-safe enumerator |
| **Legacy** | Since Java 1.2 | Since Java 1.0 (legacy) |
| **Use Case** | Single-threaded applications | Multi-threaded applications |

**Example:**
```java
import java.util.*;

public class MapComparison {
    public static void main(String[] args) {
        // HashMap
        Map<String, Integer> hashMap = new HashMap<>();
        hashMap.put(null, 1);        // ✅ Allows null key
        hashMap.put("key", null);    // ✅ Allows null value
        System.out.println(hashMap); // {null=1, key=null}
        
        // Hashtable
        Hashtable<String, Integer> hashtable = new Hashtable<>();
        // hashtable.put(null, 1);   // ❌ NullPointerException
        // hashtable.put("key", null); // ❌ NullPointerException
        
        // Synchronization
        // HashMap - not thread-safe
        Map<String, Integer> map = new HashMap<>();
        // Need external synchronization for thread-safety
        Map<String, Integer> syncMap = Collections.synchronizedMap(map);
        
        // Hashtable - thread-safe
        Hashtable<String, Integer> table = new Hashtable<>();
        // Already synchronized
    }
}
```

**Modern Alternative:**
```java
// Use ConcurrentHashMap for thread-safe operations
import java.util.concurrent.ConcurrentHashMap;

Map<String, Integer> concurrentMap = new ConcurrentHashMap<>();
// Better performance than Hashtable (lock striping)
// Thread-safe and allows null values (since Java 8)
```

### 14. What is the difference between HashSet, LinkedHashSet, and TreeSet?

**Answer:**

| Feature | HashSet | LinkedHashSet | TreeSet |
|---------|---------|---------------|---------|
| **Ordering** | No order | Insertion order | Sorted order |
| **Underlying Structure** | HashMap | LinkedHashMap | TreeMap (Red-Black Tree) |
| **Performance** | O(1) average | O(1) average | O(log n) |
| **Null Values** | One null allowed | One null allowed | No null (if natural ordering) |
| **Use Case** | Fast lookup, no order needed | Fast lookup, insertion order | Sorted set needed |

**Example:**
```java
import java.util.*;

public class SetComparison {
    public static void main(String[] args) {
        // HashSet - No order
        Set<String> hashSet = new HashSet<>();
        hashSet.add("Apple");
        hashSet.add("Banana");
        hashSet.add("Cherry");
        System.out.println(hashSet);  // Order not guaranteed
        
        // LinkedHashSet - Insertion order
        Set<String> linkedHashSet = new LinkedHashSet<>();
        linkedHashSet.add("Apple");
        linkedHashSet.add("Banana");
        linkedHashSet.add("Cherry");
        System.out.println(linkedHashSet);  // [Apple, Banana, Cherry]
        
        // TreeSet - Sorted order
        Set<String> treeSet = new TreeSet<>();
        treeSet.add("Apple");
        treeSet.add("Banana");
        treeSet.add("Cherry");
        System.out.println(treeSet);  // [Apple, Banana, Cherry] (sorted)
        
        // TreeSet with custom comparator
        Set<Integer> reverseTreeSet = new TreeSet<>(Collections.reverseOrder());
        reverseTreeSet.add(3);
        reverseTreeSet.add(1);
        reverseTreeSet.add(2);
        System.out.println(reverseTreeSet);  // [3, 2, 1]
    }
}
```

---

## Exception Handling

### 15. What is exception handling in Java?

**Answer:**
Exception handling is a mechanism to handle runtime errors gracefully. It prevents program termination and allows error recovery.

**Exception Hierarchy:**
```
Throwable
├── Error (unchecked)
│   ├── OutOfMemoryError
│   ├── StackOverflowError
│   └── ...
└── Exception
    ├── RuntimeException (unchecked)
    │   ├── NullPointerException
    │   ├── ArrayIndexOutOfBoundsException
    │   ├── IllegalArgumentException
    │   └── ...
    └── Checked Exceptions
        ├── IOException
        ├── SQLException
        └── ...
```

**Example:**
```java
public class ExceptionHandling {
    public static void main(String[] args) {
        try {
            int result = divide(10, 0);
            System.out.println("Result: " + result);
        } catch (ArithmeticException e) {
            System.out.println("Cannot divide by zero: " + e.getMessage());
        } finally {
            System.out.println("Finally block always executes");
        }
    }
    
    static int divide(int a, int b) throws ArithmeticException {
        if (b == 0) {
            throw new ArithmeticException("Division by zero");
        }
        return a / b;
    }
}
```

### 16. What is the difference between checked and unchecked exceptions?

**Answer:**

**Checked Exceptions:**
- Must be handled at compile time
- Extend `Exception` (but not `RuntimeException`)
- Must use `try-catch` or `throws`
- Examples: `IOException`, `SQLException`, `ClassNotFoundException`

**Unchecked Exceptions:**
- Not checked at compile time
- Extend `RuntimeException` or `Error`
- No need to handle explicitly
- Examples: `NullPointerException`, `ArrayIndexOutOfBoundsException`, `IllegalArgumentException`

**Example:**
```java
import java.io.*;

public class ExceptionTypes {
    // Checked exception - must handle
    public void readFile() throws IOException {
        FileReader file = new FileReader("file.txt");
        // IOException is checked, must declare throws
    }
    
    // Unchecked exception - no need to handle
    public void divide(int a, int b) {
        if (b == 0) {
            throw new ArithmeticException("Cannot divide by zero");
            // RuntimeException is unchecked, no need to declare throws
        }
        int result = a / b;
    }
    
    // Handling checked exception
    public void handleChecked() {
        try {
            readFile();
        } catch (IOException e) {
            System.out.println("Error reading file: " + e.getMessage());
        }
    }
    
    // Unchecked exception can be caught but not required
    public void handleUnchecked() {
        try {
            divide(10, 0);
        } catch (ArithmeticException e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}
```

### 17. What is the difference between throw and throws?

**Answer:**

**throw:**
- Used to explicitly throw an exception
- Used inside a method
- Can throw checked or unchecked exceptions
- Syntax: `throw new ExceptionType()`

**throws:**
- Used to declare exceptions that a method might throw
- Used in method signature
- Used for checked exceptions (or to document unchecked)
- Syntax: `methodName() throws ExceptionType`

**Example:**
```java
public class ThrowVsThrows {
    // throws - declares exception in method signature
    public void method1() throws IOException {
        // throw - explicitly throws exception
        throw new IOException("File not found");
    }
    
    // Multiple exceptions
    public void method2() throws IOException, SQLException {
        if (someCondition) {
            throw new IOException("IO error");
        } else {
            throw new SQLException("SQL error");
        }
    }
    
    // Unchecked exception (no throws needed, but can declare)
    public void method3() {
        throw new RuntimeException("Runtime error");
    }
    
    // Calling method must handle checked exceptions
    public void caller() {
        try {
            method1();  // Must handle IOException
        } catch (IOException e) {
            System.out.println("Caught: " + e.getMessage());
        }
    }
}
```

---

## Multithreading and Concurrency

### 18. What is multithreading in Java?

**Answer:**
Multithreading allows multiple threads to execute concurrently within a single program, enabling parallel execution of tasks.

**Creating Threads:**

**1. Extending Thread class:**
```java
class MyThread extends Thread {
    @Override
    public void run() {
        for (int i = 0; i < 5; i++) {
            System.out.println("Thread: " + i);
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}

// Usage
MyThread thread = new MyThread();
thread.start();
```

**2. Implementing Runnable interface:**
```java
class MyRunnable implements Runnable {
    @Override
    public void run() {
        for (int i = 0; i < 5; i++) {
            System.out.println("Runnable: " + i);
        }
    }
}

// Usage
Thread thread = new Thread(new MyRunnable());
thread.start();
```

**3. Lambda expression (Java 8+):**
```java
Thread thread = new Thread(() -> {
    for (int i = 0; i < 5; i++) {
        System.out.println("Lambda: " + i);
    }
});
thread.start();
```

### 19. What is the difference between synchronized and volatile?

**Answer:**

**synchronized:**
- Ensures only one thread can access a method/block at a time
- Provides mutual exclusion
- Guarantees visibility and atomicity
- Can be used on methods or code blocks
- Heavier mechanism (locks)

**volatile:**
- Ensures visibility of variable changes across threads
- Does not provide mutual exclusion
- Lighter mechanism (no locking)
- Prevents compiler optimizations
- Good for flags and simple counters

**Example:**
```java
public class Synchronization {
    private int count = 0;
    private volatile boolean flag = false;
    
    // synchronized method
    public synchronized void increment() {
        count++;  // Thread-safe
    }
    
    // synchronized block
    public void incrementBlock() {
        synchronized (this) {
            count++;
        }
    }
    
    // volatile for visibility
    public void setFlag(boolean value) {
        flag = value;  // Changes visible to all threads immediately
    }
    
    public boolean getFlag() {
        return flag;  // Always reads latest value
    }
}
```

**When to Use:**
- **synchronized**: When you need mutual exclusion (critical sections)
- **volatile**: When you only need visibility (simple flags, one writer)

### 20. What is the Executor Framework?

**Answer:**
The Executor Framework provides a higher-level replacement for working with threads directly. It manages thread creation, lifecycle, and task execution.

**Benefits:**
- Better resource management
- Thread pool reuse
- Task submission and execution separation
- Better error handling

**Example:**
```java
import java.util.concurrent.*;

public class ExecutorExample {
    public static void main(String[] args) {
        // Fixed thread pool
        ExecutorService executor = Executors.newFixedThreadPool(5);
        
        // Submit tasks
        for (int i = 0; i < 10; i++) {
            final int taskId = i;
            executor.submit(() -> {
                System.out.println("Task " + taskId + " executed by " + 
                    Thread.currentThread().getName());
            });
        }
        
        // Shutdown
        executor.shutdown();
        try {
            executor.awaitTermination(60, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
```

**Thread Pool Types:**
```java
// Fixed thread pool
ExecutorService fixedPool = Executors.newFixedThreadPool(10);

// Cached thread pool (creates threads as needed)
ExecutorService cachedPool = Executors.newCachedThreadPool();

// Single thread executor
ExecutorService singleThread = Executors.newSingleThreadExecutor();

// Scheduled executor
ScheduledExecutorService scheduled = Executors.newScheduledThreadPool(5);
scheduled.schedule(() -> System.out.println("Delayed task"), 5, TimeUnit.SECONDS);
```

---

## Java 8+ Features

### 21. What are Lambda Expressions?

**Answer:**
Lambda expressions provide a concise way to represent anonymous functions. They enable functional programming in Java.

**Syntax:**
```java
(parameters) -> expression
// or
(parameters) -> { statements; }
```

**Example:**
```java
import java.util.*;

public class LambdaExample {
    public static void main(String[] args) {
        List<String> names = Arrays.asList("Alice", "Bob", "Charlie");
        
        // Old way (anonymous class)
        Collections.sort(names, new Comparator<String>() {
            @Override
            public int compare(String a, String b) {
                return a.compareTo(b);
            }
        });
        
        // Lambda way
        Collections.sort(names, (a, b) -> a.compareTo(b));
        
        // Method reference
        Collections.sort(names, String::compareTo);
        
        // Lambda with forEach
        names.forEach(name -> System.out.println(name));
        names.forEach(System.out::println);  // Method reference
    }
}
```

**Functional Interfaces:**
```java
// Predicate - returns boolean
Predicate<String> isEmpty = s -> s.isEmpty();

// Function - takes input, returns output
Function<String, Integer> length = s -> s.length();

// Consumer - takes input, returns nothing
Consumer<String> printer = s -> System.out.println(s);

// Supplier - takes nothing, returns output
Supplier<String> supplier = () -> "Hello";
```

### 22. What are Streams in Java?

**Answer:**
Streams provide a functional approach to process collections of data. They enable declarative, parallel processing.

**Characteristics:**
- Not a data structure (doesn't store data)
- Source can be collection, array, or I/O
- Functional in nature (doesn't modify source)
- Lazy evaluation
- Can be parallelized

**Example:**
```java
import java.util.*;
import java.util.stream.*;

public class StreamExample {
    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
        
        // Filter and map
        List<Integer> evenSquares = numbers.stream()
            .filter(n -> n % 2 == 0)      // Filter even numbers
            .map(n -> n * n)               // Square them
            .collect(Collectors.toList()); // Collect to list
        
        System.out.println(evenSquares);  // [4, 16, 36, 64, 100]
        
        // Reduce
        int sum = numbers.stream()
            .reduce(0, Integer::sum);
        System.out.println("Sum: " + sum);  // 55
        
        // Grouping
        Map<String, List<String>> grouped = Arrays.asList("apple", "banana", "apricot")
            .stream()
            .collect(Collectors.groupingBy(s -> s.substring(0, 1)));
        System.out.println(grouped);  // {a=[apple, apricot], b=[banana]}
        
        // Parallel stream
        long count = numbers.parallelStream()
            .filter(n -> n > 5)
            .count();
        System.out.println("Count: " + count);  // 5
    }
}
```

### 23. What is Optional in Java?

**Answer:**
`Optional` is a container object that may or may not contain a non-null value. It helps avoid `NullPointerException`.

**Example:**
```java
import java.util.*;

public class OptionalExample {
    public static void main(String[] args) {
        // Creating Optional
        Optional<String> empty = Optional.empty();
        Optional<String> of = Optional.of("Hello");  // Throws NPE if null
        Optional<String> ofNullable = Optional.ofNullable(null);  // Safe
        
        // Checking value
        if (of.isPresent()) {
            System.out.println(of.get());
        }
        
        // If present
        of.ifPresent(System.out::println);
        
        // Default value
        String value = ofNullable.orElse("Default");
        String value2 = ofNullable.orElseGet(() -> "Default from supplier");
        
        // Map and filter
        Optional<String> upper = of.map(String::toUpperCase);
        Optional<String> filtered = of.filter(s -> s.length() > 3);
        
        // FlatMap
        Optional<String> flatMapped = of.flatMap(s -> Optional.of(s + " World"));
    }
    
    // Method returning Optional
    public static Optional<String> findName(int id) {
        if (id > 0) {
            return Optional.of("Name" + id);
        }
        return Optional.empty();
    }
}
```

---

## Memory Management and JVM

### 24. What is the JVM memory structure?

**Answer:**
JVM memory is divided into several areas:

**1. Method Area (Class Area):**
- Stores class metadata, static variables, constants
- Shared among all threads

**2. Heap:**
- Stores objects and arrays
- Divided into:
  - **Young Generation**: Eden, Survivor spaces
  - **Old Generation (Tenured)**: Long-lived objects
- Shared among all threads

**3. Stack:**
- Stores local variables, method calls, references
- Each thread has its own stack
- StackOverflowError if stack overflows

**4. PC Register (Program Counter):**
- Stores address of current instruction
- One per thread

**5. Native Method Stack:**
- For native methods (C/C++)

**Example:**
```java
public class MemoryStructure {
    private static int staticVar = 10;  // Method Area
    private int instanceVar = 20;        // Heap
    
    public void method() {
        int localVar = 30;               // Stack
        String str = new String("Hello"); // Heap (object), Stack (reference)
    }
}
```

### 25. What is Garbage Collection in Java?

**Answer:**
Garbage Collection automatically reclaims memory occupied by objects that are no longer referenced.

**How it Works:**
1. Identifies unreachable objects
2. Marks them for deletion
3. Reclaims memory

**GC Algorithms:**
- **Serial GC**: Single thread, good for small applications
- **Parallel GC**: Multiple threads, default for server apps
- **G1 GC**: Low latency, good for large heaps
- **ZGC/Shenandoah**: Ultra-low latency (Java 11+)

**Example:**
```java
public class GarbageCollection {
    public static void main(String[] args) {
        // Object becomes eligible for GC when no references
        String obj1 = new String("Object 1");
        String obj2 = new String("Object 2");
        
        obj1 = null;  // Object 1 eligible for GC
        obj2 = obj1;  // Object 2 also eligible (no references)
        
        // Suggest GC (not guaranteed)
        System.gc();
    }
}
```

**Tuning GC:**
```bash
# Heap size
-Xms512m -Xmx2g

# GC algorithm
-XX:+UseG1GC

# GC logging
-Xlog:gc*:file=gc.log
```

---

## Design Patterns

### 26. What is the Singleton Pattern?

**Answer:**
Singleton ensures a class has only one instance and provides global access to it.

**Implementation:**
```java
public class Singleton {
    // Private static instance
    private static Singleton instance;
    
    // Private constructor
    private Singleton() {
    }
    
    // Public static method to get instance
    public static Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}

// Thread-safe version (Double-checked locking)
public class ThreadSafeSingleton {
    private static volatile ThreadSafeSingleton instance;
    
    private ThreadSafeSingleton() {
    }
    
    public static ThreadSafeSingleton getInstance() {
        if (instance == null) {
            synchronized (ThreadSafeSingleton.class) {
                if (instance == null) {
                    instance = new ThreadSafeSingleton();
                }
            }
        }
        return instance;
    }
}

// Enum singleton (best practice)
public enum EnumSingleton {
    INSTANCE;
    
    public void doSomething() {
        System.out.println("Singleton method");
    }
}
```

### 27. What is the Factory Pattern?

**Answer:**
Factory Pattern creates objects without exposing the instantiation logic to the client.

**Example:**
```java
// Product interface
interface Shape {
    void draw();
}

// Concrete products
class Circle implements Shape {
    @Override
    public void draw() {
        System.out.println("Drawing Circle");
    }
}

class Rectangle implements Shape {
    @Override
    public void draw() {
        System.out.println("Drawing Rectangle");
    }
}

// Factory
class ShapeFactory {
    public Shape getShape(String shapeType) {
        if (shapeType == null) {
            return null;
        }
        if (shapeType.equalsIgnoreCase("CIRCLE")) {
            return new Circle();
        } else if (shapeType.equalsIgnoreCase("RECTANGLE")) {
            return new Rectangle();
        }
        return null;
    }
}

// Usage
ShapeFactory factory = new ShapeFactory();
Shape circle = factory.getShape("CIRCLE");
circle.draw();
```

---

## Advanced Topics

### 28. What is Reflection in Java?

**Answer:**
Reflection allows inspection and manipulation of classes, methods, fields at runtime.

**Example:**
```java
import java.lang.reflect.*;

public class ReflectionExample {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = String.class;
        
        // Get methods
        Method[] methods = clazz.getMethods();
        for (Method method : methods) {
            System.out.println(method.getName());
        }
        
        // Invoke method
        Method substring = String.class.getMethod("substring", int.class);
        String result = (String) substring.invoke("Hello World", 6);
        System.out.println(result);  // "World"
        
        // Get fields
        Field[] fields = clazz.getDeclaredFields();
        for (Field field : fields) {
            System.out.println(field.getName());
        }
        
        // Create instance
        Constructor<String> constructor = String.class.getConstructor(String.class);
        String instance = constructor.newInstance("Hello");
    }
}
```

### 29. What are Annotations in Java?

**Answer:**
Annotations provide metadata about code. They don't affect program execution directly.

**Built-in Annotations:**
```java
@Override      // Indicates method overrides superclass method
@Deprecated    // Marks element as deprecated
@SuppressWarnings("unchecked")  // Suppresses compiler warnings
@FunctionalInterface  // Indicates functional interface
```

**Custom Annotation:**
```java
import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@interface MyAnnotation {
    String value() default "default";
    int count() default 0;
}

class MyClass {
    @MyAnnotation(value = "Hello", count = 5)
    public void myMethod() {
    }
}
```

---

## Best Practices

### 30. What are some Java best practices?

**Answer:**

**1. Use meaningful names:**
```java
// ❌ Bad
int x = 10;
void m() { }

// ✅ Good
int userCount = 10;
void calculateTotal() { }
```

**2. Follow naming conventions:**
```java
// Class: PascalCase
public class UserService { }

// Method/Variable: camelCase
public void getUserName() { }
int userId = 1;

// Constants: UPPER_SNAKE_CASE
public static final int MAX_SIZE = 100;
```

**3. Use StringBuilder for string concatenation:**
```java
// ❌ Bad (creates many objects)
String result = "";
for (int i = 0; i < 1000; i++) {
    result += i;
}

// ✅ Good
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append(i);
}
String result = sb.toString();
```

**4. Prefer composition over inheritance:**
```java
// ✅ Good - Composition
class Car {
    private Engine engine;
    // Use engine instead of extending
}
```

**5. Use try-with-resources:**
```java
// ✅ Good - Auto-closes resources
try (FileReader fr = new FileReader("file.txt");
     BufferedReader br = new BufferedReader(fr)) {
    // Use resources
} catch (IOException e) {
    // Handle exception
}
```

**6. Use equals() and hashCode() together:**
```java
@Override
public boolean equals(Object obj) {
    if (this == obj) return true;
    if (obj == null || getClass() != obj.getClass()) return false;
    // Compare fields
}

@Override
public int hashCode() {
    // Return hash based on same fields used in equals()
}
```

---

## Summary

This comprehensive guide covers essential Java interview questions from basic concepts to advanced topics. Key areas include:

1. **Fundamentals**: Java features, JVM, data types, String handling
2. **OOP**: Encapsulation, inheritance, polymorphism, abstraction
3. **Collections**: List, Set, Map implementations and differences
4. **Exception Handling**: Checked vs unchecked, throw vs throws
5. **Multithreading**: Thread creation, synchronization, Executor framework
6. **Java 8+**: Lambda expressions, Streams, Optional
7. **Memory Management**: JVM structure, Garbage Collection
8. **Design Patterns**: Singleton, Factory, and more
9. **Advanced Topics**: Reflection, Annotations
10. **Best Practices**: Coding standards and conventions

Remember to practice writing Java code and understand the underlying concepts. Good luck with your Java interviews!