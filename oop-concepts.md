# Object-Oriented Programming (OOP) Concepts

## Introduction

Object-Oriented Programming (OOP) is a programming paradigm based on the concept of "objects" which contain data (properties/attributes) and code (methods/functions). OOP helps organize code, make it reusable, and easier to maintain.

**Core OOP Concepts:**
1. **Classes and Objects**
2. **Encapsulation**
3. **Inheritance**
4. **Polymorphism**
5. **Abstraction**

---

## 1. Classes and Objects

### Definition

**Class**: A blueprint or template for creating objects. It defines properties and methods that objects will have.

**Object**: An instance of a class. It's a concrete entity created from the class blueprint.

### Example

```typescript
// Class Definition
class Car {
  // Properties (attributes)
  brand: string;
  model: string;
  year: number;
  color: string;

  // Constructor - special method to initialize objects
  constructor(brand: string, model: string, year: number, color: string) {
    this.brand = brand;
    this.model = model;
    this.year = year;
    this.color = color;
  }

  // Methods (behaviors)
  startEngine(): void {
    console.log(`${this.brand} ${this.model} engine started!`);
  }

  drive(): void {
    console.log(`Driving the ${this.color} ${this.brand}`);
  }

  getInfo(): string {
    return `${this.year} ${this.brand} ${this.model} - ${this.color}`;
  }
}

// Creating Objects (Instances)
const car1 = new Car('Toyota', 'Camry', 2023, 'Silver');
const car2 = new Car('Honda', 'Civic', 2022, 'Blue');

// Using objects
console.log(car1.getInfo()); // 2023 Toyota Camry - Silver
car1.startEngine();          // Toyota Camry engine started!
car1.drive();                // Driving the Silver Toyota

console.log(car2.getInfo()); // 2022 Honda Civic - Blue
car2.startEngine();          // Honda Civic engine started!
```

### Real-World Example: User Management

```typescript
class User {
  username: string;
  email: string;
  age: number;
  isActive: boolean;

  constructor(username: string, email: string, age: number) {
    this.username = username;
    this.email = email;
    this.age = age;
    this.isActive = true;
  }

  login(): void {
    if (this.isActive) {
      console.log(`${this.username} logged in successfully`);
    } else {
      console.log(`Account is inactive`);
    }
  }

  updateEmail(newEmail: string): void {
    this.email = newEmail;
    console.log(`Email updated to ${newEmail}`);
  }

  deactivate(): void {
    this.isActive = false;
    console.log(`${this.username} account deactivated`);
  }
}

const user1 = new User('john_doe', 'john@example.com', 30);
user1.login();                          // john_doe logged in successfully
user1.updateEmail('john.doe@email.com'); // Email updated to john.doe@email.com
user1.deactivate();                     // john_doe account deactivated
user1.login();                          // Account is inactive
```

---

## 2. Encapsulation

### Definition

Encapsulation is the bundling of data (properties) and methods that operate on that data within a single unit (class). It also involves hiding internal details and restricting direct access to some components using access modifiers.

**Access Modifiers:**
- `public`: Accessible from anywhere (default)
- `private`: Accessible only within the class
- `protected`: Accessible within the class and subclasses

### Example

```typescript
class BankAccount {
  // Public property
  public accountHolder: string;
  
  // Private properties (hidden from outside)
  private balance: number;
  private accountNumber: string;
  
  constructor(accountHolder: string, initialBalance: number) {
    this.accountHolder = accountHolder;
    this.balance = initialBalance;
    this.accountNumber = this.generateAccountNumber();
  }

  // Private method (internal implementation)
  private generateAccountNumber(): string {
    return 'ACC' + Math.floor(Math.random() * 1000000);
  }

  // Public methods to interact with private data
  public deposit(amount: number): void {
    if (amount > 0) {
      this.balance += amount;
      console.log(`Deposited $${amount}. New balance: $${this.balance}`);
    } else {
      console.log('Invalid deposit amount');
    }
  }

  public withdraw(amount: number): void {
    if (amount > 0 && amount <= this.balance) {
      this.balance -= amount;
      console.log(`Withdrawn $${amount}. Remaining balance: $${this.balance}`);
    } else {
      console.log('Invalid withdrawal amount or insufficient funds');
    }
  }

  // Getter method to safely access private data
  public getBalance(): number {
    return this.balance;
  }

  public getAccountNumber(): string {
    return this.accountNumber;
  }
}

// Usage
const account = new BankAccount('Alice Smith', 1000);

// These work (public methods)
account.deposit(500);           // Deposited $500. New balance: $1500
account.withdraw(200);          // Withdrawn $200. Remaining balance: $1300
console.log(account.getBalance()); // 1300

// These won't work (private properties)
// console.log(account.balance);      // Error: Property 'balance' is private
// account.balance = 10000;           // Error: Cannot access private property
```

### Benefits of Encapsulation

```typescript
class Employee {
  private salary: number;
  private socialSecurityNumber: string;
  public name: string;

  constructor(name: string, salary: number, ssn: string) {
    this.name = name;
    this.salary = salary;
    this.socialSecurityNumber = ssn;
  }

  // Controlled access with validation
  public setSalary(newSalary: number): void {
    if (newSalary > 0 && newSalary < 1000000) {
      this.salary = newSalary;
      console.log('Salary updated successfully');
    } else {
      console.log('Invalid salary amount');
    }
  }

  public getSalary(): number {
    return this.salary;
  }

  // Read-only access (no setter)
  public getSSN(): string {
    // Return only last 4 digits for security
    return '***-**-' + this.socialSecurityNumber.slice(-4);
  }

  public calculateAnnualSalary(): number {
    return this.salary * 12;
  }
}

const emp = new Employee('Bob Johnson', 5000, '123-45-6789');
console.log(emp.name);                    // Bob Johnson (public)
console.log(emp.getSalary());             // 5000
console.log(emp.getSSN());                // ***-**-6789
console.log(emp.calculateAnnualSalary()); // 60000

emp.setSalary(5500);                      // Salary updated successfully
emp.setSalary(-1000);                     // Invalid salary amount
```

---

## 3. Inheritance

### Definition

Inheritance allows a class (child/derived class) to inherit properties and methods from another class (parent/base class). It promotes code reusability and establishes a hierarchical relationship.

### Example

```typescript
// Parent Class (Base Class)
class Animal {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  eat(): void {
    console.log(`${this.name} is eating`);
  }

  sleep(): void {
    console.log(`${this.name} is sleeping`);
  }

  makeSound(): void {
    console.log(`${this.name} makes a sound`);
  }
}

// Child Class (Derived Class)
class Dog extends Animal {
  breed: string;

  constructor(name: string, age: number, breed: string) {
    super(name, age); // Call parent constructor
    this.breed = breed;
  }

  // Override parent method
  makeSound(): void {
    console.log(`${this.name} barks: Woof! Woof!`);
  }

  // New method specific to Dog
  fetch(): void {
    console.log(`${this.name} is fetching the ball`);
  }
}

class Cat extends Animal {
  color: string;

  constructor(name: string, age: number, color: string) {
    super(name, age);
    this.color = color;
  }

  // Override parent method
  makeSound(): void {
    console.log(`${this.name} meows: Meow! Meow!`);
  }

  // New method specific to Cat
  scratch(): void {
    console.log(`${this.name} is scratching`);
  }
}

// Usage
const dog = new Dog('Buddy', 3, 'Golden Retriever');
dog.eat();        // Buddy is eating (inherited)
dog.sleep();      // Buddy is sleeping (inherited)
dog.makeSound();  // Buddy barks: Woof! Woof! (overridden)
dog.fetch();      // Buddy is fetching the ball (own method)

const cat = new Cat('Whiskers', 2, 'Orange');
cat.eat();        // Whiskers is eating (inherited)
cat.makeSound();  // Whiskers meows: Meow! Meow! (overridden)
cat.scratch();    // Whiskers is scratching (own method)
```

### Real-World Example: Employee Hierarchy

```typescript
// Base Class
class Employee {
  protected employeeId: string;
  protected name: string;
  protected department: string;

  constructor(employeeId: string, name: string, department: string) {
    this.employeeId = employeeId;
    this.name = name;
    this.department = department;
  }

  getDetails(): string {
    return `${this.name} (ID: ${this.employeeId}) - ${this.department}`;
  }

  work(): void {
    console.log(`${this.name} is working`);
  }
}

// Derived Class 1
class Developer extends Employee {
  private programmingLanguages: string[];

  constructor(
    employeeId: string,
    name: string,
    languages: string[]
  ) {
    super(employeeId, name, 'IT');
    this.programmingLanguages = languages;
  }

  work(): void {
    console.log(`${this.name} is coding in ${this.programmingLanguages.join(', ')}`);
  }

  writeCode(): void {
    console.log(`${this.name} is writing code...`);
  }

  getLanguages(): string[] {
    return this.programmingLanguages;
  }
}

// Derived Class 2
class Manager extends Employee {
  private teamSize: number;

  constructor(
    employeeId: string,
    name: string,
    department: string,
    teamSize: number
  ) {
    super(employeeId, name, department);
    this.teamSize = teamSize;
  }

  work(): void {
    console.log(`${this.name} is managing a team of ${this.teamSize} people`);
  }

  conductMeeting(): void {
    console.log(`${this.name} is conducting a team meeting`);
  }

  getTeamSize(): number {
    return this.teamSize;
  }
}

// Usage
const dev = new Developer('D001', 'Sarah Connor', ['TypeScript', 'Python', 'Go']);
console.log(dev.getDetails());  // Sarah Connor (ID: D001) - IT
dev.work();                     // Sarah Connor is coding in TypeScript, Python, Go
dev.writeCode();                // Sarah Connor is writing code...

const manager = new Manager('M001', 'John Smith', 'Sales', 10);
console.log(manager.getDetails()); // John Smith (ID: M001) - Sales
manager.work();                    // John Smith is managing a team of 10 people
manager.conductMeeting();          // John Smith is conducting a team meeting
```

### Multilevel Inheritance

```typescript
// Level 1
class Vehicle {
  brand: string;

  constructor(brand: string) {
    this.brand = brand;
  }

  start(): void {
    console.log(`${this.brand} vehicle started`);
  }
}

// Level 2
class Car extends Vehicle {
  doors: number;

  constructor(brand: string, doors: number) {
    super(brand);
    this.doors = doors;
  }

  honk(): void {
    console.log('Beep! Beep!');
  }
}

// Level 3
class ElectricCar extends Car {
  batteryCapacity: number;

  constructor(brand: string, doors: number, batteryCapacity: number) {
    super(brand, doors);
    this.batteryCapacity = batteryCapacity;
  }

  charge(): void {
    console.log(`Charging ${this.brand} with ${this.batteryCapacity}kWh battery`);
  }
}

const tesla = new ElectricCar('Tesla', 4, 100);
tesla.start();   // Tesla vehicle started (from Vehicle)
tesla.honk();    // Beep! Beep! (from Car)
tesla.charge();  // Charging Tesla with 100kWh battery (from ElectricCar)
```

---

## 4. Polymorphism

### Definition

Polymorphism means "many forms". It allows objects of different classes to be treated as objects of a common parent class. The same method can behave differently based on the object that calls it.

**Types:**
1. **Method Overriding** (Runtime Polymorphism)
2. **Method Overloading** (Compile-time Polymorphism)

### Method Overriding

```typescript
class Shape {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  // Method to be overridden
  calculateArea(): number {
    return 0;
  }

  describe(): void {
    console.log(`This is a ${this.name}`);
  }
}

class Circle extends Shape {
  radius: number;

  constructor(radius: number) {
    super('Circle');
    this.radius = radius;
  }

  // Override calculateArea for Circle
  calculateArea(): number {
    return Math.PI * this.radius * this.radius;
  }
}

class Rectangle extends Shape {
  width: number;
  height: number;

  constructor(width: number, height: number) {
    super('Rectangle');
    this.width = width;
    this.height = height;
  }

  // Override calculateArea for Rectangle
  calculateArea(): number {
    return this.width * this.height;
  }
}

class Triangle extends Shape {
  base: number;
  height: number;

  constructor(base: number, height: number) {
    super('Triangle');
    this.base = base;
    this.height = height;
  }

  // Override calculateArea for Triangle
  calculateArea(): number {
    return (this.base * this.height) / 2;
  }
}

// Polymorphism in action
function printArea(shape: Shape): void {
  console.log(`${shape.name} area: ${shape.calculateArea().toFixed(2)}`);
}

const shapes: Shape[] = [
  new Circle(5),
  new Rectangle(10, 5),
  new Triangle(8, 6)
];

// Same method call, different behaviors
shapes.forEach(shape => {
  shape.describe();
  printArea(shape);
  console.log('---');
});

// Output:
// This is a Circle
// Circle area: 78.54
// ---
// This is a Rectangle
// Rectangle area: 50.00
// ---
// This is a Triangle
// Triangle area: 24.00
// ---
```

### Method Overloading (TypeScript)

```typescript
class Calculator {
  // Method overloading - same name, different parameters
  add(a: number, b: number): number;
  add(a: string, b: string): string;
  add(a: number[], b: number[]): number[];
  add(a: any, b: any): any {
    if (typeof a === 'number' && typeof b === 'number') {
      return a + b;
    } else if (typeof a === 'string' && typeof b === 'string') {
      return a + b;
    } else if (Array.isArray(a) && Array.isArray(b)) {
      return [...a, ...b];
    }
  }

  multiply(a: number, b: number): number;
  multiply(a: number, b: number, c: number): number;
  multiply(a: number, b: number, c?: number): number {
    if (c !== undefined) {
      return a * b * c;
    }
    return a * b;
  }
}

const calc = new Calculator();

console.log(calc.add(5, 10));              // 15
console.log(calc.add('Hello ', 'World'));  // Hello World
console.log(calc.add([1, 2], [3, 4]));     // [1, 2, 3, 4]

console.log(calc.multiply(2, 3));          // 6
console.log(calc.multiply(2, 3, 4));       // 24
```

### Real-World Example: Payment Processing

```typescript
// Base class
abstract class Payment {
  amount: number;
  date: Date;

  constructor(amount: number) {
    this.amount = amount;
    this.date = new Date();
  }

  // Abstract method - must be implemented by child classes
  abstract processPayment(): void;

  getReceipt(): string {
    return `Payment of $${this.amount} on ${this.date.toDateString()}`;
  }
}

class CreditCardPayment extends Payment {
  cardNumber: string;

  constructor(amount: number, cardNumber: string) {
    super(amount);
    this.cardNumber = cardNumber;
  }

  processPayment(): void {
    console.log(`Processing credit card payment of $${this.amount}`);
    console.log(`Card: ****${this.cardNumber.slice(-4)}`);
  }
}

class PayPalPayment extends Payment {
  email: string;

  constructor(amount: number, email: string) {
    super(amount);
    this.email = email;
  }

  processPayment(): void {
    console.log(`Processing PayPal payment of $${this.amount}`);
    console.log(`Account: ${this.email}`);
  }
}

class CryptoPayment extends Payment {
  walletAddress: string;

  constructor(amount: number, walletAddress: string) {
    super(amount);
    this.walletAddress = walletAddress;
  }

  processPayment(): void {
    console.log(`Processing cryptocurrency payment of $${this.amount}`);
    console.log(`Wallet: ${this.walletAddress.slice(0, 10)}...`);
  }
}

// Polymorphic function
function executePayment(payment: Payment): void {
  payment.processPayment();
  console.log(payment.getReceipt());
  console.log('---');
}

// Different payment types, same interface
const payments: Payment[] = [
  new CreditCardPayment(100, '1234567890123456'),
  new PayPalPayment(50, 'user@example.com'),
  new CryptoPayment(200, '0x1234567890abcdef')
];

payments.forEach(payment => executePayment(payment));
```

---

## 5. Abstraction

### Definition

Abstraction is the process of hiding complex implementation details and showing only the essential features. It focuses on what an object does rather than how it does it.

**Ways to achieve abstraction:**
1. Abstract Classes
2. Interfaces

### Abstract Classes

```typescript
// Abstract class - cannot be instantiated directly
abstract class Database {
  protected connectionString: string;

  constructor(connectionString: string) {
    this.connectionString = connectionString;
  }

  // Abstract methods - must be implemented by child classes
  abstract connect(): void;
  abstract disconnect(): void;
  abstract query(sql: string): any[];

  // Concrete method - can be used as-is
  log(message: string): void {
    console.log(`[Database Log]: ${message}`);
  }
}

class MySQLDatabase extends Database {
  connect(): void {
    console.log(`Connecting to MySQL: ${this.connectionString}`);
    this.log('MySQL connection established');
  }

  disconnect(): void {
    console.log('Disconnecting from MySQL');
    this.log('MySQL connection closed');
  }

  query(sql: string): any[] {
    console.log(`Executing MySQL query: ${sql}`);
    return [];
  }
}

class PostgreSQLDatabase extends Database {
  connect(): void {
    console.log(`Connecting to PostgreSQL: ${this.connectionString}`);
    this.log('PostgreSQL connection established');
  }

  disconnect(): void {
    console.log('Disconnecting from PostgreSQL');
    this.log('PostgreSQL connection closed');
  }

  query(sql: string): any[] {
    console.log(`Executing PostgreSQL query: ${sql}`);
    return [];
  }
}

// Cannot do: const db = new Database('connection'); // Error!

// Can do:
const mysqlDb = new MySQLDatabase('mysql://localhost:3306/mydb');
mysqlDb.connect();
mysqlDb.query('SELECT * FROM users');
mysqlDb.disconnect();

console.log('---');

const postgresDb = new PostgreSQLDatabase('postgres://localhost:5432/mydb');
postgresDb.connect();
postgresDb.query('SELECT * FROM products');
postgresDb.disconnect();
```

### Interfaces

```typescript
// Interface defines a contract
interface Flyable {
  fly(): void;
  land(): void;
}

interface Swimmable {
  swim(): void;
}

// Class can implement multiple interfaces
class Duck implements Flyable, Swimmable {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  fly(): void {
    console.log(`${this.name} is flying`);
  }

  land(): void {
    console.log(`${this.name} is landing`);
  }

  swim(): void {
    console.log(`${this.name} is swimming`);
  }
}

class Airplane implements Flyable {
  model: string;

  constructor(model: string) {
    this.model = model;
  }

  fly(): void {
    console.log(`${this.model} is flying at 30,000 feet`);
  }

  land(): void {
    console.log(`${this.model} is landing on the runway`);
  }
}

class Fish implements Swimmable {
  species: string;

  constructor(species: string) {
    this.species = species;
  }

  swim(): void {
    console.log(`${this.species} is swimming underwater`);
  }
}

// Polymorphism with interfaces
function makeFly(flyable: Flyable): void {
  flyable.fly();
  flyable.land();
}

const duck = new Duck('Donald');
const plane = new Airplane('Boeing 747');

makeFly(duck);   // Duck can fly
makeFly(plane);  // Airplane can fly
```

### Real-World Example: Logger System

```typescript
// Interface for logging
interface Logger {
  log(message: string): void;
  error(message: string): void;
  warn(message: string): void;
}

class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(`[LOG]: ${message}`);
  }

  error(message: string): void {
    console.error(`[ERROR]: ${message}`);
  }

  warn(message: string): void {
    console.warn(`[WARN]: ${message}`);
  }
}

class FileLogger implements Logger {
  private filename: string;

  constructor(filename: string) {
    this.filename = filename;
  }

  log(message: string): void {
    console.log(`Writing to ${this.filename}: [LOG] ${message}`);
  }

  error(message: string): void {
    console.log(`Writing to ${this.filename}: [ERROR] ${message}`);
  }

  warn(message: string): void {
    console.log(`Writing to ${this.filename}: [WARN] ${message}`);
  }
}

class Application {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  run(): void {
    this.logger.log('Application started');
    this.logger.warn('Low memory warning');
    this.logger.error('Database connection failed');
  }
}

// Easy to switch logger implementation
const app1 = new Application(new ConsoleLogger());
app1.run();

console.log('---');

const app2 = new Application(new FileLogger('app.log'));
app2.run();
```

---

## Additional OOP Concepts

### 1. Static Members

Static members belong to the class itself, not to instances.

```typescript
class MathUtils {
  static PI: number = 3.14159;

  static calculateCircleArea(radius: number): number {
    return this.PI * radius * radius;
  }

  static max(a: number, b: number): number {
    return a > b ? a : b;
  }
}

// Access static members without creating instance
console.log(MathUtils.PI);                    // 3.14159
console.log(MathUtils.calculateCircleArea(5)); // 78.53975
console.log(MathUtils.max(10, 20));           // 20

// No need to instantiate
// const util = new MathUtils(); // Not needed
```

### 2. Getters and Setters

```typescript
class Person {
  private _age: number;
  private _name: string;

  constructor(name: string, age: number) {
    this._name = name;
    this._age = age;
  }

  // Getter
  get age(): number {
    return this._age;
  }

  // Setter with validation
  set age(value: number) {
    if (value > 0 && value < 150) {
      this._age = value;
    } else {
      console.log('Invalid age');
    }
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    if (value.length >= 2) {
      this._name = value;
    } else {
      console.log('Name too short');
    }
  }

  // Computed property
  get info(): string {
    return `${this._name} is ${this._age} years old`;
  }
}

const person = new Person('Alice', 25);

// Use like properties, not methods
console.log(person.age);      // 25
person.age = 30;              // Calls setter
console.log(person.age);      // 30
person.age = -5;              // Invalid age

console.log(person.info);     // Alice is 30 years old
```

### 3. Constructor Overloading

```typescript
class Product {
  name: string;
  price: number;
  category: string;

  // Constructor overloading
  constructor(name: string);
  constructor(name: string, price: number);
  constructor(name: string, price: number, category: string);
  constructor(name: string, price?: number, category?: string) {
    this.name = name;
    this.price = price || 0;
    this.category = category || 'General';
  }

  getInfo(): string {
    return `${this.name} - $${this.price} (${this.category})`;
  }
}

const product1 = new Product('Laptop');
const product2 = new Product('Mouse', 25);
const product3 = new Product('Keyboard', 75, 'Electronics');

console.log(product1.getInfo()); // Laptop - $0 (General)
console.log(product2.getInfo()); // Mouse - $25 (General)
console.log(product3.getInfo()); // Keyboard - $75 (Electronics)
```

### 4. Method Chaining

```typescript
class QueryBuilder {
  private query: string = '';

  select(fields: string): QueryBuilder {
    this.query += `SELECT ${fields} `;
    return this;
  }

  from(table: string): QueryBuilder {
    this.query += `FROM ${table} `;
    return this;
  }

  where(condition: string): QueryBuilder {
    this.query += `WHERE ${condition} `;
    return this;
  }

  orderBy(field: string): QueryBuilder {
    this.query += `ORDER BY ${field} `;
    return this;
  }

  build(): string {
    return this.query.trim() + ';';
  }
}

// Method chaining in action
const query = new QueryBuilder()
  .select('name, email')
  .from('users')
  .where('age > 18')
  .orderBy('name')
  .build();

console.log(query);
// SELECT name, email FROM users WHERE age > 18 ORDER BY name;
```

---

## Complete Real-World Example: E-Commerce System

```typescript
// ============================================
// Complete OOP Example: E-Commerce System
// ============================================

// Abstract base class
abstract class Product {
  constructor(
    public id: string,
    public name: string,
    public price: number,
    public stock: number
  ) {}

  abstract getDescription(): string;

  isAvailable(): boolean {
    return this.stock > 0;
  }

  updateStock(quantity: number): void {
    this.stock += quantity;
  }
}

// Inheritance
class PhysicalProduct extends Product {
  constructor(
    id: string,
    name: string,
    price: number,
    stock: number,
    public weight: number,
    public dimensions: string
  ) {
    super(id, name, price, stock);
  }

  getDescription(): string {
    return `${this.name} - $${this.price} (Weight: ${this.weight}kg, ${this.dimensions})`;
  }

  calculateShipping(): number {
    return this.weight * 2; // $2 per kg
  }
}

class DigitalProduct extends Product {
  constructor(
    id: string,
    name: string,
    price: number,
    stock: number,
    public downloadLink: string,
    public fileSize: number
  ) {
    super(id, name, price, stock);
  }

  getDescription(): string {
    return `${this.name} - $${this.price} (Digital - ${this.fileSize}MB)`;
  }

  getDownloadLink(): string {
    return this.downloadLink;
  }
}

// Encapsulation
class Customer {
  private _email: string;
  private _password: string;

  constructor(
    public id: string,
    public name: string,
    email: string,
    password: string
  ) {
    this._email = email;
    this._password = this.hashPassword(password);
  }

  private hashPassword(password: string): string {
    return `hashed_${password}`; // Simplified
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    if (value.includes('@')) {
      this._email = value;
    } else {
      console.log('Invalid email format');
    }
  }

  verifyPassword(password: string): boolean {
    return this._password === this.hashPassword(password);
  }
}

// Interface
interface Discountable {
  applyDiscount(percentage: number): number;
}

// Polymorphism
class ShoppingCart implements Discountable {
  private items: Map<string, { product: Product; quantity: number }> = new Map();

  addItem(product: Product, quantity: number): void {
    if (product.isAvailable() && product.stock >= quantity) {
      this.items.set(product.id, { product, quantity });
      product.updateStock(-quantity);
      console.log(`Added ${quantity}x ${product.name} to cart`);
    } else {
      console.log(`${product.name} is not available in requested quantity`);
    }
  }

  removeItem(productId: string): void {
    const item = this.items.get(productId);
    if (item) {
      item.product.updateStock(item.quantity);
      this.items.delete(productId);
      console.log(`Removed ${item.product.name} from cart`);
    }
  }

  getTotal(): number {
    let total = 0;
    this.items.forEach(item => {
      total += item.product.price * item.quantity;
    });
    return total;
  }

  applyDiscount(percentage: number): number {
    const total = this.getTotal();
    const discount = total * (percentage / 100);
    return total - discount;
  }

  getItems(): Array<{ product: Product; quantity: number }> {
    return Array.from(this.items.values());
  }

  clear(): void {
    this.items.clear();
  }
}

class Order {
  private static orderCounter: number = 0;
  public orderId: string;
  public orderDate: Date;
  public status: 'pending' | 'processing' | 'shipped' | 'delivered';

  constructor(
    public customer: Customer,
    public items: Array<{ product: Product; quantity: number }>,
    public totalAmount: number
  ) {
    this.orderId = `ORD-${++Order.orderCounter}`;
    this.orderDate = new Date();
    this.status = 'pending';
  }

  static getOrderCount(): number {
    return Order.orderCounter;
  }

  updateStatus(newStatus: typeof this.status): void {
    this.status = newStatus;
    console.log(`Order ${this.orderId} status: ${this.status}`);
  }

  getSummary(): string {
    return `Order ${this.orderId} for ${this.customer.name} - $${this.totalAmount} (${this.status})`;
  }
}

// ============================================
// Usage Example
// ============================================

// Create products
const laptop = new PhysicalProduct('P001', 'Laptop', 999, 10, 2.5, '15x10x1 inches');
const ebook = new DigitalProduct('D001', 'Learn TypeScript', 29, 100, 'https://example.com/ebook', 5);

// Create customer
const customer = new Customer('C001', 'John Doe', 'john@example.com', 'password123');

// Create shopping cart
const cart = new ShoppingCart();
cart.addItem(laptop, 1);
cart.addItem(ebook, 2);

// Display cart
console.log('\n--- Shopping Cart ---');
cart.getItems().forEach(item => {
  console.log(`${item.quantity}x ${item.product.getDescription()}`);
});

console.log(`\nSubtotal: $${cart.getTotal()}`);
console.log(`With 10% discount: $${cart.applyDiscount(10)}`);

// Create order
const order = new Order(customer, cart.getItems(), cart.applyDiscount(10));
console.log(`\n${order.getSummary()}`);

// Update order status
order.updateStatus('processing');
order.updateStatus('shipped');
order.updateStatus('delivered');

console.log(`\nTotal orders placed: ${Order.getOrderCount()}`);

// Shipping calculation for physical products
if (laptop instanceof PhysicalProduct) {
  console.log(`\nShipping cost for laptop: $${laptop.calculateShipping()}`);
}
```

---

## OOP Benefits

| Benefit | Description |
|---------|-------------|
| **Modularity** | Code is organized into separate classes |
| **Reusability** | Classes can be reused through inheritance |
| **Maintainability** | Changes are localized to specific classes |
| **Scalability** | Easy to add new features without breaking existing code |
| **Security** | Encapsulation protects data |
| **Flexibility** | Polymorphism enables flexible code |

---

## Common Interview Questions

### 1. What is the difference between an abstract class and an interface?

**Answer:** Abstract classes and interfaces both help achieve abstraction, but serve different purposes:

**Abstract Class:**
- Can have constructors
- Can have properties/state
- Can have both abstract methods (no implementation) and concrete methods (with implementation)
- Single inheritance (can extend only one class)
- Use `extends` keyword
- Can have access modifiers (private, protected, public)

**Interface:**
- Cannot have constructors
- Cannot have state (TypeScript allows properties but no implementation)
- Only method signatures (no implementation, though TypeScript allows some)
- Multiple inheritance (can implement multiple interfaces)
- Use `implements` keyword
- All members are public by default

**Abstract Class Example:**
```typescript
abstract class Animal {
  protected name: string;
  
  constructor(name: string) {
    this.name = name;
  }
  
  // Abstract method - must be implemented by child
  abstract makeSound(): void;
  
  // Concrete method - has implementation
  move(): void {
    console.log(`${this.name} is moving`);
  }
}

class Dog extends Animal {
  makeSound(): void {
    console.log('Woof!');
  }
}

// Cannot do: const animal = new Animal('Pet'); // Error!
const dog = new Dog('Buddy');
dog.makeSound(); // Woof!
dog.move();      // Buddy is moving
```

**Interface Example:**
```typescript
interface Flyable {
  fly(): void;
}

interface Swimmable {
  swim(): void;
}

// Class can implement multiple interfaces
class Duck implements Flyable, Swimmable {
  fly(): void {
    console.log('Duck is flying');
  }
  
  swim(): void {
    console.log('Duck is swimming');
  }
}

class Airplane implements Flyable {
  fly(): void {
    console.log('Airplane is flying');
  }
}
```

**Key Differences Table:**

| Feature | Abstract Class | Interface |
|---------|----------------|-----------|
| **Instantiation** | Cannot be instantiated | Cannot be instantiated |
| **Implementation** | Can have both abstract and concrete methods | Only method signatures |
| **Constructors** | Can have constructors | Cannot have constructors |
| **Properties/State** | Can have properties with state | No state (TypeScript allows properties) |
| **Inheritance** | Single inheritance (`extends`) | Multiple inheritance (`implements`) |
| **Access Modifiers** | Can have private, protected, public | All members are public |
| **Use Case** | Share common code among related classes | Define contracts for unrelated classes |

**When to Use Each:**

**Use Abstract Class when:**
- You want to share common code among related classes
- You need to provide a base implementation
- You need constructors or private/protected members
- Classes have a strong "IS-A" relationship

**Use Interface when:**
- You want to define a contract for unrelated classes
- You need multiple inheritance
- You want to ensure classes follow a specific structure
- Classes have a "CAN-DO" relationship

**Real-World Example:**
```typescript
// Abstract Class - for related classes with shared code
abstract class Database {
  protected connectionString: string;
  
  constructor(connectionString: string) {
    this.connectionString = connectionString;
  }
  
  abstract connect(): void;
  abstract query(sql: string): any[];
  
  // Shared implementation
  log(message: string): void {
    console.log(`[DB Log]: ${message}`);
  }
}

class MySQL extends Database {
  connect(): void {
    console.log('Connecting to MySQL...');
  }
  
  query(sql: string): any[] {
    return [];
  }
}

// Interface - for contracts across unrelated classes
interface Loggable {
  log(message: string): void;
}

class User implements Loggable {
  log(message: string): void {
    console.log(`User: ${message}`);
  }
}

class Product implements Loggable {
  log(message: string): void {
    console.log(`Product: ${message}`);
  }
}
```

### 2. What is the difference between Composition and Inheritance?

**Inheritance**: "IS-A" relationship
```typescript
class Dog extends Animal {} // Dog IS-A Animal
```

**Composition**: "HAS-A" relationship
```typescript
class Car {
  private engine: Engine; // Car HAS-A Engine
  constructor() {
    this.engine = new Engine();
  }
}
```

### 3. What are the advantages of OOP?

- Better code organization
- Code reusability through inheritance
- Data security through encapsulation
- Flexibility through polymorphism
- Easy maintenance and debugging
- Real-world modeling

### 4. What is the Diamond Problem?

Occurs in multiple inheritance when a class inherits from two classes that have a common base class. TypeScript/JavaScript avoid this by not supporting multiple class inheritance (but allow multiple interface implementation).

---

**Remember**: OOP principles help create maintainable, scalable, and robust applications. Practice these concepts with real-world examples to master them!

