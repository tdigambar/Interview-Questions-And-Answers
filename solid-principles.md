# SOLID Principles - Interview Guide

## Introduction

SOLID is an acronym for five design principles intended to make software designs more understandable, flexible, and maintainable. These principles were introduced by Robert C. Martin (Uncle Bob).

**The SOLID Principles:**
- **S** - Single Responsibility Principle (SRP)
- **O** - Open/Closed Principle (OCP)
- **L** - Liskov Substitution Principle (LSP)
- **I** - Interface Segregation Principle (ISP)
- **D** - Dependency Inversion Principle (DIP)

---

## 1. Single Responsibility Principle (SRP)

### Definition
A class should have only one reason to change, meaning it should have only one job or responsibility.

### Why It Matters
- Easier to understand and maintain
- Reduces coupling between different parts of the application
- Makes testing simpler
- Changes to one responsibility don't affect others

### Bad Example ❌

```typescript
class User {
  constructor(public name: string, public email: string) {}

  // Responsibility 1: User data management
  getUserInfo(): string {
    return `${this.name} - ${this.email}`;
  }

  // Responsibility 2: Database operations
  saveToDatabase(): void {
    console.log('Connecting to database...');
    console.log('Saving user to database...');
  }

  // Responsibility 3: Email operations
  sendWelcomeEmail(): void {
    console.log(`Sending welcome email to ${this.email}`);
  }

  // Responsibility 4: Validation
  validateEmail(): boolean {
    return this.email.includes('@');
  }
}
```

**Problem**: This class has multiple responsibilities - managing user data, database operations, email sending, and validation. Any change in email logic, database structure, or validation rules requires modifying this class.

### Good Example ✅

```typescript
// Responsibility 1: User data management
class User {
  constructor(public name: string, public email: string) {}

  getUserInfo(): string {
    return `${this.name} - ${this.email}`;
  }
}

// Responsibility 2: Database operations
class UserRepository {
  save(user: User): void {
    console.log('Connecting to database...');
    console.log(`Saving user: ${user.name}`);
  }

  findById(id: string): User | null {
    // Database query logic
    return null;
  }
}

// Responsibility 3: Email operations
class EmailService {
  sendWelcomeEmail(user: User): void {
    console.log(`Sending welcome email to ${user.email}`);
  }
}

// Responsibility 4: Validation
class UserValidator {
  validateEmail(email: string): boolean {
    return email.includes('@') && email.includes('.');
  }

  validateName(name: string): boolean {
    return name.length >= 2;
  }
}

// Usage
const user = new User('John Doe', 'john@example.com');
const repository = new UserRepository();
const emailService = new EmailService();
const validator = new UserValidator();

if (validator.validateEmail(user.email)) {
  repository.save(user);
  emailService.sendWelcomeEmail(user);
}
```

### Real-World Example

```typescript
// Bad: Invoice class doing too much
class Invoice {
  calculateTotal(): number { /* ... */ }
  printInvoice(): void { /* ... */ }
  saveToDatabase(): void { /* ... */ }
}

// Good: Separated responsibilities
class Invoice {
  calculateTotal(): number { /* ... */ }
}

class InvoicePrinter {
  print(invoice: Invoice): void { /* ... */ }
}

class InvoiceRepository {
  save(invoice: Invoice): void { /* ... */ }
}
```

---

## 2. Open/Closed Principle (OCP)

### Definition
Software entities (classes, modules, functions) should be open for extension but closed for modification.

### Why It Matters
- Existing code doesn't need to be changed when adding new features
- Reduces the risk of breaking existing functionality
- Promotes code reusability
- Makes the system more maintainable

### Bad Example ❌

```typescript
class PaymentProcessor {
  processPayment(amount: number, type: string): void {
    if (type === 'credit') {
      console.log(`Processing credit card payment: $${amount}`);
      // Credit card specific logic
    } else if (type === 'paypal') {
      console.log(`Processing PayPal payment: $${amount}`);
      // PayPal specific logic
    } else if (type === 'bitcoin') {
      console.log(`Processing Bitcoin payment: $${amount}`);
      // Bitcoin specific logic
    }
    // Need to modify this class every time a new payment method is added
  }
}
```

**Problem**: Every time we want to add a new payment method, we must modify the `PaymentProcessor` class, violating the OCP.

### Good Example ✅

```typescript
// Abstract payment method
interface PaymentMethod {
  processPayment(amount: number): void;
}

// Concrete implementations
class CreditCardPayment implements PaymentMethod {
  processPayment(amount: number): void {
    console.log(`Processing credit card payment: $${amount}`);
    // Credit card specific logic
  }
}

class PayPalPayment implements PaymentMethod {
  processPayment(amount: number): void {
    console.log(`Processing PayPal payment: $${amount}`);
    // PayPal specific logic
  }
}

class BitcoinPayment implements PaymentMethod {
  processPayment(amount: number): void {
    console.log(`Processing Bitcoin payment: $${amount}`);
    // Bitcoin specific logic
  }
}

// Can add new payment methods without modifying existing code
class ApplePayPayment implements PaymentMethod {
  processPayment(amount: number): void {
    console.log(`Processing Apple Pay payment: $${amount}`);
  }
}

// Payment processor is closed for modification, open for extension
class PaymentProcessor {
  process(paymentMethod: PaymentMethod, amount: number): void {
    paymentMethod.processPayment(amount);
  }
}

// Usage
const processor = new PaymentProcessor();
processor.process(new CreditCardPayment(), 100);
processor.process(new PayPalPayment(), 200);
processor.process(new ApplePayPayment(), 150); // New method added without changing processor
```

### Real-World Example

```typescript
// Shape area calculator following OCP
abstract class Shape {
  abstract calculateArea(): number;
}

class Rectangle extends Shape {
  constructor(private width: number, private height: number) {
    super();
  }

  calculateArea(): number {
    return this.width * this.height;
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }

  calculateArea(): number {
    return Math.PI * this.radius * this.radius;
  }
}

class Triangle extends Shape {
  constructor(private base: number, private height: number) {
    super();
  }

  calculateArea(): number {
    return (this.base * this.height) / 2;
  }
}

class AreaCalculator {
  calculateTotalArea(shapes: Shape[]): number {
    return shapes.reduce((total, shape) => total + shape.calculateArea(), 0);
  }
}

// Adding new shapes doesn't require modifying AreaCalculator
const calculator = new AreaCalculator();
const shapes = [
  new Rectangle(10, 5),
  new Circle(7),
  new Triangle(6, 8)
];
console.log(calculator.calculateTotalArea(shapes));
```

---

## 3. Liskov Substitution Principle (LSP)

### Definition
Objects of a superclass should be replaceable with objects of its subclasses without breaking the application. Subclasses should extend, not replace, the behavior of the base class.

### Why It Matters
- Ensures inheritance hierarchies are logically correct
- Prevents unexpected behavior in polymorphic code
- Makes code more predictable and reliable
- Enables proper use of abstraction

### Bad Example ❌

```typescript
class Bird {
  fly(): void {
    console.log('Flying...');
  }
}

class Sparrow extends Bird {
  fly(): void {
    console.log('Sparrow flying...');
  }
}

class Penguin extends Bird {
  fly(): void {
    throw new Error('Penguins cannot fly!'); // Violates LSP
  }
}

function makeBirdFly(bird: Bird): void {
  bird.fly(); // Will throw error for Penguin
}

makeBirdFly(new Sparrow()); // Works
makeBirdFly(new Penguin());  // Throws error! ❌
```

**Problem**: `Penguin` cannot be substituted for `Bird` without causing errors. The contract of the base class is broken.

### Good Example ✅

```typescript
// Better hierarchy
abstract class Bird {
  abstract move(): void;
}

class FlyingBird extends Bird {
  move(): void {
    this.fly();
  }

  fly(): void {
    console.log('Flying...');
  }
}

class Sparrow extends FlyingBird {
  fly(): void {
    console.log('Sparrow flying...');
  }
}

class Penguin extends Bird {
  move(): void {
    this.swim();
  }

  swim(): void {
    console.log('Penguin swimming...');
  }
}

function makeBirdMove(bird: Bird): void {
  bird.move(); // Works for all birds
}

makeBirdMove(new Sparrow()); // Sparrow flying...
makeBirdMove(new Penguin());  // Penguin swimming... ✅
```

### Real-World Example

```typescript
// Bad: Rectangle-Square problem
class Rectangle {
  constructor(protected width: number, protected height: number) {}

  setWidth(width: number): void {
    this.width = width;
  }

  setHeight(height: number): void {
    this.height = height;
  }

  getArea(): number {
    return this.width * this.height;
  }
}

class Square extends Rectangle {
  setWidth(width: number): void {
    this.width = width;
    this.height = width; // Violates LSP - changing behavior
  }

  setHeight(height: number): void {
    this.width = height;  // Violates LSP - changing behavior
    this.height = height;
  }
}

function testRectangle(rectangle: Rectangle): void {
  rectangle.setWidth(5);
  rectangle.setHeight(4);
  console.log(`Expected area: 20, Got: ${rectangle.getArea()}`);
  // For Square, this would be 16, not 20!
}

// Good: Using composition instead of inheritance
interface Shape {
  getArea(): number;
}

class Rectangle implements Shape {
  constructor(private width: number, private height: number) {}

  getArea(): number {
    return this.width * this.height;
  }
}

class Square implements Shape {
  constructor(private side: number) {}

  getArea(): number {
    return this.side * this.side;
  }
}
```

---

## 4. Interface Segregation Principle (ISP)

### Definition
No client should be forced to depend on methods it does not use. Many specific interfaces are better than one general-purpose interface.

### Why It Matters
- Reduces coupling between classes
- Makes code more flexible and easier to refactor
- Prevents "fat" interfaces with unnecessary methods
- Improves code clarity

### Bad Example ❌

```typescript
interface Worker {
  work(): void;
  eat(): void;
  sleep(): void;
}

class HumanWorker implements Worker {
  work(): void {
    console.log('Human working...');
  }

  eat(): void {
    console.log('Human eating...');
  }

  sleep(): void {
    console.log('Human sleeping...');
  }
}

class RobotWorker implements Worker {
  work(): void {
    console.log('Robot working...');
  }

  eat(): void {
    // Robots don't eat!
    throw new Error('Robots do not eat');
  }

  sleep(): void {
    // Robots don't sleep!
    throw new Error('Robots do not sleep');
  }
}
```

**Problem**: `RobotWorker` is forced to implement methods (`eat`, `sleep`) it doesn't need, violating ISP.

### Good Example ✅

```typescript
// Segregated interfaces
interface Workable {
  work(): void;
}

interface Eatable {
  eat(): void;
}

interface Sleepable {
  sleep(): void;
}

class HumanWorker implements Workable, Eatable, Sleepable {
  work(): void {
    console.log('Human working...');
  }

  eat(): void {
    console.log('Human eating...');
  }

  sleep(): void {
    console.log('Human sleeping...');
  }
}

class RobotWorker implements Workable {
  work(): void {
    console.log('Robot working...');
  }
  // Only implements what it needs
}

class Manager {
  manageWorker(worker: Workable): void {
    worker.work();
  }

  manageLunch(eater: Eatable): void {
    eater.eat();
  }
}
```

### Real-World Example

```typescript
// Bad: Fat interface
interface SmartDevice {
  print(): void;
  scan(): void;
  fax(): void;
  call(): void;
  takePicture(): void;
}

// Printer forced to implement methods it doesn't support
class Printer implements SmartDevice {
  print(): void { console.log('Printing...'); }
  scan(): void { throw new Error('Not supported'); }
  fax(): void { throw new Error('Not supported'); }
  call(): void { throw new Error('Not supported'); }
  takePicture(): void { throw new Error('Not supported'); }
}

// Good: Segregated interfaces
interface Printable {
  print(): void;
}

interface Scannable {
  scan(): void;
}

interface Faxable {
  fax(): void;
}

interface Callable {
  call(): void;
}

interface Photographable {
  takePicture(): void;
}

class SimplePrinter implements Printable {
  print(): void {
    console.log('Printing...');
  }
}

class MultiFunctionPrinter implements Printable, Scannable, Faxable {
  print(): void {
    console.log('Printing...');
  }

  scan(): void {
    console.log('Scanning...');
  }

  fax(): void {
    console.log('Faxing...');
  }
}

class Smartphone implements Callable, Photographable {
  call(): void {
    console.log('Making call...');
  }

  takePicture(): void {
    console.log('Taking picture...');
  }
}
```

---

## 5. Dependency Inversion Principle (DIP)

### Definition
High-level modules should not depend on low-level modules. Both should depend on abstractions. Abstractions should not depend on details. Details should depend on abstractions.

### Why It Matters
- Reduces coupling between modules
- Makes code more testable (easy to mock dependencies)
- Increases flexibility and reusability
- Enables easier changes and maintenance

### Bad Example ❌

```typescript
class MySQLDatabase {
  connect(): void {
    console.log('Connecting to MySQL database...');
  }

  query(sql: string): any[] {
    console.log(`Executing query: ${sql}`);
    return [];
  }
}

class UserService {
  private database: MySQLDatabase; // Directly depends on concrete class

  constructor() {
    this.database = new MySQLDatabase(); // Tight coupling
  }

  getUsers(): any[] {
    this.database.connect();
    return this.database.query('SELECT * FROM users');
  }
}

// Problem: Cannot easily switch to PostgreSQL or MongoDB
// Hard to test without connecting to actual MySQL database
```

**Problem**: `UserService` is tightly coupled to `MySQLDatabase`. Changing to a different database requires modifying `UserService`.

### Good Example ✅

```typescript
// Abstraction
interface Database {
  connect(): void;
  query(sql: string): any[];
}

// Low-level modules depend on abstraction
class MySQLDatabase implements Database {
  connect(): void {
    console.log('Connecting to MySQL database...');
  }

  query(sql: string): any[] {
    console.log(`Executing MySQL query: ${sql}`);
    return [];
  }
}

class PostgreSQLDatabase implements Database {
  connect(): void {
    console.log('Connecting to PostgreSQL database...');
  }

  query(sql: string): any[] {
    console.log(`Executing PostgreSQL query: ${sql}`);
    return [];
  }
}

class MongoDBDatabase implements Database {
  connect(): void {
    console.log('Connecting to MongoDB...');
  }

  query(sql: string): any[] {
    console.log(`Executing MongoDB query: ${sql}`);
    return [];
  }
}

// High-level module depends on abstraction
class UserService {
  constructor(private database: Database) {} // Dependency injection

  getUsers(): any[] {
    this.database.connect();
    return this.database.query('SELECT * FROM users');
  }
}

// Usage - easy to switch databases
const mysqlService = new UserService(new MySQLDatabase());
const postgresService = new UserService(new PostgreSQLDatabase());
const mongoService = new UserService(new MongoDBDatabase());

// Easy to test with mock
class MockDatabase implements Database {
  connect(): void {}
  query(sql: string): any[] {
    return [{ id: 1, name: 'Test User' }];
  }
}

const testService = new UserService(new MockDatabase());
```

### Real-World Example

```typescript
// Bad: Notification system with tight coupling
class EmailSender {
  send(message: string): void {
    console.log(`Sending email: ${message}`);
  }
}

class NotificationService {
  private emailSender: EmailSender;

  constructor() {
    this.emailSender = new EmailSender();
  }

  notify(message: string): void {
    this.emailSender.send(message);
  }
}

// Good: Using dependency inversion
interface MessageSender {
  send(message: string): void;
}

class EmailSender implements MessageSender {
  send(message: string): void {
    console.log(`Sending email: ${message}`);
  }
}

class SMSSender implements MessageSender {
  send(message: string): void {
    console.log(`Sending SMS: ${message}`);
  }
}

class PushNotificationSender implements MessageSender {
  send(message: string): void {
    console.log(`Sending push notification: ${message}`);
  }
}

class NotificationService {
  private senders: MessageSender[];

  constructor(senders: MessageSender[]) {
    this.senders = senders;
  }

  notify(message: string): void {
    this.senders.forEach(sender => sender.send(message));
  }
}

// Usage - flexible and extensible
const notificationService = new NotificationService([
  new EmailSender(),
  new SMSSender(),
  new PushNotificationSender()
]);

notificationService.notify('Hello, SOLID principles!');
```

---

## Complete Example: E-Commerce Order System

Here's a complete example demonstrating all SOLID principles:

```typescript
// ============================================
// SOLID Principles Applied to Order System
// ============================================

// --- Interfaces (DIP & ISP) ---
interface Product {
  id: string;
  name: string;
  price: number;
}

interface PaymentProcessor {
  processPayment(amount: number): boolean;
}

interface OrderRepository {
  save(order: Order): void;
  findById(id: string): Order | null;
}

interface NotificationService {
  notify(message: string): void;
}

// --- Domain Model (SRP) ---
class Order {
  constructor(
    public id: string,
    public products: Product[],
    public total: number,
    public status: 'pending' | 'paid' | 'shipped' = 'pending'
  ) {}
}

// --- Single Responsibility: Each class has one job ---

// Calculates order total
class OrderCalculator {
  calculateTotal(products: Product[]): number {
    return products.reduce((sum, product) => sum + product.price, 0);
  }
}

// Validates order
class OrderValidator {
  validate(products: Product[]): boolean {
    return products.length > 0 && products.every(p => p.price > 0);
  }
}

// --- Open/Closed: Payment processors can be extended ---
class CreditCardProcessor implements PaymentProcessor {
  processPayment(amount: number): boolean {
    console.log(`Processing credit card payment: $${amount}`);
    return true;
  }
}

class PayPalProcessor implements PaymentProcessor {
  processPayment(amount: number): boolean {
    console.log(`Processing PayPal payment: $${amount}`);
    return true;
  }
}

// --- Repository implementation (SRP & DIP) ---
class InMemoryOrderRepository implements OrderRepository {
  private orders: Map<string, Order> = new Map();

  save(order: Order): void {
    this.orders.set(order.id, order);
    console.log(`Order ${order.id} saved`);
  }

  findById(id: string): Order | null {
    return this.orders.get(id) || null;
  }
}

// --- Notification services (ISP & OCP) ---
class EmailNotification implements NotificationService {
  notify(message: string): void {
    console.log(`Email: ${message}`);
  }
}

class SMSNotification implements NotificationService {
  notify(message: string): void {
    console.log(`SMS: ${message}`);
  }
}

// --- Main service using Dependency Inversion ---
class OrderService {
  constructor(
    private calculator: OrderCalculator,
    private validator: OrderValidator,
    private repository: OrderRepository,
    private paymentProcessor: PaymentProcessor,
    private notificationService: NotificationService
  ) {}

  createOrder(products: Product[]): Order | null {
    // Validate
    if (!this.validator.validate(products)) {
      console.log('Invalid order');
      return null;
    }

    // Calculate
    const total = this.calculator.calculateTotal(products);

    // Create order
    const order = new Order(
      `ORDER-${Date.now()}`,
      products,
      total
    );

    // Process payment
    const paymentSuccess = this.paymentProcessor.processPayment(total);
    
    if (paymentSuccess) {
      order.status = 'paid';
      this.repository.save(order);
      this.notificationService.notify(
        `Order ${order.id} created successfully! Total: $${total}`
      );
      return order;
    }

    return null;
  }
}

// --- Usage ---
const products: Product[] = [
  { id: '1', name: 'Laptop', price: 999 },
  { id: '2', name: 'Mouse', price: 25 }
];

// Dependency injection - easy to swap implementations
const orderService = new OrderService(
  new OrderCalculator(),
  new OrderValidator(),
  new InMemoryOrderRepository(),
  new CreditCardProcessor(), // Can easily switch to PayPalProcessor
  new EmailNotification()     // Can easily switch to SMSNotification
);

const order = orderService.createOrder(products);
console.log('Order created:', order);
```

---

## Summary: Benefits of SOLID Principles

| Principle | Key Benefit |
|-----------|-------------|
| **SRP** | Easier maintenance, single reason to change |
| **OCP** | Add features without modifying existing code |
| **LSP** | Reliable inheritance, predictable substitution |
| **ISP** | Focused interfaces, no unnecessary dependencies |
| **DIP** | Loose coupling, better testability |

## Common Interview Questions

### 1. What problems do SOLID principles solve?
- Code maintenance difficulties
- Tight coupling
- Fragile code that breaks easily
- Hard-to-test code
- Difficulty adding new features

### 2. Can you violate SOLID principles?
Yes, in some cases pragmatism trumps principles:
- Small, simple projects
- Prototypes or proof of concepts
- When over-engineering would add unnecessary complexity
- Performance-critical sections (rare)

### 3. How do SOLID principles relate to design patterns?
Many design patterns implement SOLID principles:
- Strategy Pattern → OCP
- Adapter Pattern → DIP
- Facade Pattern → ISP
- Template Method → OCP & LSP

### 4. Are SOLID principles only for OOP?
While SOLID originated in OOP, the concepts apply to other paradigms:
- Functional programming has similar concepts
- Microservices architecture follows similar principles
- React components can follow SOLID principles

---

**Remember**: SOLID principles are guidelines, not strict rules. Apply them thoughtfully to create maintainable, flexible, and robust software!

