# Design Patterns - Interview Questions and Answers

## Introduction

Design patterns are reusable solutions to common problems in software design. They represent best practices and provide a template for how to solve problems that can be used in many different situations.

**Categories of Design Patterns:**
1. **Creational Patterns** - Object creation mechanisms
2. **Structural Patterns** - Object composition and relationships
3. **Behavioral Patterns** - Communication between objects

---

## Creational Patterns

### 1. Singleton Pattern

#### What is the Singleton Pattern?

The Singleton pattern ensures a class has only one instance and provides a global point of access to it.

#### When to Use?
- Database connections
- Configuration managers
- Logging services
- Cache managers

#### Example

```typescript
class Database {
  private static instance: Database;
  private connection: string;

  // Private constructor prevents direct instantiation
  private constructor() {
    this.connection = 'Database connection established';
    console.log(this.connection);
  }

  // Static method to get the single instance
  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public query(sql: string): void {
    console.log(`Executing query: ${sql}`);
  }
}

// Usage
const db1 = Database.getInstance();
const db2 = Database.getInstance();

console.log(db1 === db2); // true - Same instance

db1.query('SELECT * FROM users');

// This won't work:
// const db3 = new Database(); // Error: Constructor is private
```

#### Real-World Example: Logger

```typescript
class Logger {
  private static instance: Logger;
  private logs: string[] = [];

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public log(message: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    this.logs.push(logEntry);
    console.log(logEntry);
  }

  public getLogs(): string[] {
    return [...this.logs];
  }

  public clearLogs(): void {
    this.logs = [];
  }
}

// Usage across different modules
const logger1 = Logger.getInstance();
logger1.log('Application started');

const logger2 = Logger.getInstance();
logger2.log('User logged in');

console.log(logger1.getLogs()); // Both log entries
console.log(logger1 === logger2); // true
```

---

### 2. Factory Pattern

#### What is the Factory Pattern?

The Factory pattern provides an interface for creating objects without specifying their exact classes. It delegates the instantiation logic to subclasses or factory methods.

#### When to Use?
- When you don't know ahead of time what exact types of objects you need
- When you want to centralize object creation logic
- When object creation is complex

#### Example

```typescript
// Product interface
interface Vehicle {
  type: string;
  drive(): void;
  fuel(): void;
}

// Concrete products
class Car implements Vehicle {
  type = 'Car';
  
  drive(): void {
    console.log('Driving a car on the road');
  }
  
  fuel(): void {
    console.log('Filling up with gasoline');
  }
}

class Motorcycle implements Vehicle {
  type = 'Motorcycle';
  
  drive(): void {
    console.log('Riding a motorcycle');
  }
  
  fuel(): void {
    console.log('Filling up with gasoline');
  }
}

class Truck implements Vehicle {
  type = 'Truck';
  
  drive(): void {
    console.log('Driving a heavy truck');
  }
  
  fuel(): void {
    console.log('Filling up with diesel');
  }
}

// Factory class
class VehicleFactory {
  static createVehicle(type: string): Vehicle {
    switch (type.toLowerCase()) {
      case 'car':
        return new Car();
      case 'motorcycle':
        return new Motorcycle();
      case 'truck':
        return new Truck();
      default:
        throw new Error(`Vehicle type ${type} not supported`);
    }
  }
}

// Usage
const car = VehicleFactory.createVehicle('car');
car.drive(); // Driving a car on the road

const truck = VehicleFactory.createVehicle('truck');
truck.drive(); // Driving a heavy truck
truck.fuel();  // Filling up with diesel
```

#### Real-World Example: Notification Factory

```typescript
interface Notification {
  send(message: string, recipient: string): void;
}

class EmailNotification implements Notification {
  send(message: string, recipient: string): void {
    console.log(`Sending EMAIL to ${recipient}: ${message}`);
  }
}

class SMSNotification implements Notification {
  send(message: string, recipient: string): void {
    console.log(`Sending SMS to ${recipient}: ${message}`);
  }
}

class PushNotification implements Notification {
  send(message: string, recipient: string): void {
    console.log(`Sending PUSH notification to ${recipient}: ${message}`);
  }
}

class NotificationFactory {
  static createNotification(channel: string): Notification {
    switch (channel.toLowerCase()) {
      case 'email':
        return new EmailNotification();
      case 'sms':
        return new SMSNotification();
      case 'push':
        return new PushNotification();
      default:
        throw new Error(`Notification channel ${channel} not supported`);
    }
  }
}

// Usage
const channels = ['email', 'sms', 'push'];
const message = 'Your order has been shipped!';
const recipient = 'user@example.com';

channels.forEach(channel => {
  const notification = NotificationFactory.createNotification(channel);
  notification.send(message, recipient);
});
```

---

### 3. Builder Pattern

#### What is the Builder Pattern?

The Builder pattern separates the construction of a complex object from its representation, allowing the same construction process to create different representations.

#### When to Use?
- When object creation has many optional parameters
- When you want to create immutable objects
- When construction process is complex

#### Example

```typescript
class Computer {
  cpu?: string;
  ram?: string;
  storage?: string;
  gpu?: string;
  os?: string;

  toString(): string {
    return `Computer: CPU=${this.cpu}, RAM=${this.ram}, Storage=${this.storage}, GPU=${this.gpu}, OS=${this.os}`;
  }
}

class ComputerBuilder {
  private computer: Computer;

  constructor() {
    this.computer = new Computer();
  }

  setCPU(cpu: string): ComputerBuilder {
    this.computer.cpu = cpu;
    return this;
  }

  setRAM(ram: string): ComputerBuilder {
    this.computer.ram = ram;
    return this;
  }

  setStorage(storage: string): ComputerBuilder {
    this.computer.storage = storage;
    return this;
  }

  setGPU(gpu: string): ComputerBuilder {
    this.computer.gpu = gpu;
    return this;
  }

  setOS(os: string): ComputerBuilder {
    this.computer.os = os;
    return this;
  }

  build(): Computer {
    return this.computer;
  }
}

// Usage
const gamingPC = new ComputerBuilder()
  .setCPU('Intel i9')
  .setRAM('32GB')
  .setStorage('2TB SSD')
  .setGPU('RTX 4090')
  .setOS('Windows 11')
  .build();

console.log(gamingPC.toString());

const officePC = new ComputerBuilder()
  .setCPU('Intel i5')
  .setRAM('8GB')
  .setStorage('512GB SSD')
  .setOS('Windows 11')
  .build();

console.log(officePC.toString());
```

#### Real-World Example: Query Builder

```typescript
class Query {
  constructor(
    public table: string,
    public fields: string[],
    public whereClause: string,
    public orderBy: string,
    public limit?: number
  ) {}

  toString(): string {
    let query = `SELECT ${this.fields.join(', ')} FROM ${this.table}`;
    if (this.whereClause) query += ` WHERE ${this.whereClause}`;
    if (this.orderBy) query += ` ORDER BY ${this.orderBy}`;
    if (this.limit) query += ` LIMIT ${this.limit}`;
    return query + ';';
  }
}

class QueryBuilder {
  private table: string = '';
  private fields: string[] = ['*'];
  private whereClause: string = '';
  private orderBy: string = '';
  private limit?: number;

  from(table: string): QueryBuilder {
    this.table = table;
    return this;
  }

  select(...fields: string[]): QueryBuilder {
    this.fields = fields;
    return this;
  }

  where(condition: string): QueryBuilder {
    this.whereClause = condition;
    return this;
  }

  orderByField(field: string, direction: 'ASC' | 'DESC' = 'ASC'): QueryBuilder {
    this.orderBy = `${field} ${direction}`;
    return this;
  }

  limitTo(count: number): QueryBuilder {
    this.limit = count;
    return this;
  }

  build(): Query {
    if (!this.table) {
      throw new Error('Table name is required');
    }
    return new Query(
      this.table,
      this.fields,
      this.whereClause,
      this.orderBy,
      this.limit
    );
  }
}

// Usage
const userQuery = new QueryBuilder()
  .select('id', 'name', 'email')
  .from('users')
  .where('age > 18')
  .orderByField('name', 'ASC')
  .limitTo(10)
  .build();

console.log(userQuery.toString());
// SELECT id, name, email FROM users WHERE age > 18 ORDER BY name ASC LIMIT 10;
```

---

### 4. Prototype Pattern

#### What is the Prototype Pattern?

The Prototype pattern creates new objects by copying existing objects (prototypes) rather than creating new instances from scratch.

#### When to Use?
- When object creation is expensive
- When you need to avoid subclassing
- When objects have only a few different states

#### Example

```typescript
interface Prototype {
  clone(): Prototype;
}

class Car implements Prototype {
  constructor(
    public brand: string,
    public model: string,
    public color: string,
    public features: string[]
  ) {}

  clone(): Car {
    // Deep copy the features array
    return new Car(
      this.brand,
      this.model,
      this.color,
      [...this.features]
    );
  }

  toString(): string {
    return `${this.color} ${this.brand} ${this.model} with features: ${this.features.join(', ')}`;
  }
}

// Usage
const basicCar = new Car('Toyota', 'Camry', 'White', ['AC', 'Radio']);

// Clone and customize
const luxuryCar = basicCar.clone();
luxuryCar.color = 'Black';
luxuryCar.features.push('Leather Seats', 'Sunroof', 'Navigation');

console.log(basicCar.toString());
console.log(luxuryCar.toString());

// They are different objects
console.log(basicCar === luxuryCar); // false
console.log(basicCar.features === luxuryCar.features); // false
```

---

## Structural Patterns

### 5. Adapter Pattern

#### What is the Adapter Pattern?

The Adapter pattern allows incompatible interfaces to work together. It acts as a bridge between two incompatible interfaces.

#### When to Use?
- When you want to use an existing class but its interface doesn't match
- When you want to create reusable classes that cooperate with unrelated classes
- Legacy system integration

#### Example

```typescript
// Old system interface
class OldPaymentProcessor {
  processOldPayment(amount: number): void {
    console.log(`Processing payment of $${amount} using old system`);
  }
}

// New system interface
interface PaymentProcessor {
  processPayment(amount: number, currency: string): void;
}

// Adapter
class PaymentAdapter implements PaymentProcessor {
  constructor(private oldProcessor: OldPaymentProcessor) {}

  processPayment(amount: number, currency: string): void {
    console.log(`Converting ${currency} payment to old system format`);
    this.oldProcessor.processOldPayment(amount);
  }
}

// Modern client code
class CheckoutService {
  constructor(private paymentProcessor: PaymentProcessor) {}

  checkout(amount: number): void {
    this.paymentProcessor.processPayment(amount, 'USD');
  }
}

// Usage
const oldProcessor = new OldPaymentProcessor();
const adapter = new PaymentAdapter(oldProcessor);
const checkout = new CheckoutService(adapter);

checkout.checkout(100);
```

#### Real-World Example: API Adapter

```typescript
// Third-party weather API
class ThirdPartyWeatherAPI {
  getTemperatureInFahrenheit(city: string): number {
    // Simulate API call
    return 75;
  }

  getWindSpeedInMPH(city: string): number {
    return 15;
  }
}

// Our application interface
interface WeatherService {
  getTemperature(city: string): number;  // In Celsius
  getWindSpeed(city: string): number;    // In km/h
}

// Adapter
class WeatherAdapter implements WeatherService {
  constructor(private api: ThirdPartyWeatherAPI) {}

  getTemperature(city: string): number {
    const fahrenheit = this.api.getTemperatureInFahrenheit(city);
    return this.fahrenheitToCelsius(fahrenheit);
  }

  getWindSpeed(city: string): number {
    const mph = this.api.getWindSpeedInMPH(city);
    return this.mphToKmh(mph);
  }

  private fahrenheitToCelsius(f: number): number {
    return Math.round((f - 32) * 5 / 9);
  }

  private mphToKmh(mph: number): number {
    return Math.round(mph * 1.609);
  }
}

// Usage
const thirdPartyAPI = new ThirdPartyWeatherAPI();
const weatherService: WeatherService = new WeatherAdapter(thirdPartyAPI);

console.log(`Temperature: ${weatherService.getTemperature('New York')}°C`);
console.log(`Wind Speed: ${weatherService.getWindSpeed('New York')} km/h`);
```

---

### 6. Decorator Pattern

#### What is the Decorator Pattern?

The Decorator pattern allows behavior to be added to individual objects dynamically without affecting other objects of the same class.

#### When to Use?
- When you want to add responsibilities to objects dynamically
- When extension by subclassing is impractical
- For adding features that can be withdrawn

#### Example

```typescript
// Component interface
interface Coffee {
  cost(): number;
  description(): string;
}

// Concrete component
class SimpleCoffee implements Coffee {
  cost(): number {
    return 5;
  }

  description(): string {
    return 'Simple coffee';
  }
}

// Decorator base class
abstract class CoffeeDecorator implements Coffee {
  constructor(protected coffee: Coffee) {}

  abstract cost(): number;
  abstract description(): string;
}

// Concrete decorators
class MilkDecorator extends CoffeeDecorator {
  cost(): number {
    return this.coffee.cost() + 1;
  }

  description(): string {
    return this.coffee.description() + ', milk';
  }
}

class SugarDecorator extends CoffeeDecorator {
  cost(): number {
    return this.coffee.cost() + 0.5;
  }

  description(): string {
    return this.coffee.description() + ', sugar';
  }
}

class WhippedCreamDecorator extends CoffeeDecorator {
  cost(): number {
    return this.coffee.cost() + 2;
  }

  description(): string {
    return this.coffee.description() + ', whipped cream';
  }
}

// Usage
let coffee: Coffee = new SimpleCoffee();
console.log(`${coffee.description()} - $${coffee.cost()}`);

coffee = new MilkDecorator(coffee);
console.log(`${coffee.description()} - $${coffee.cost()}`);

coffee = new SugarDecorator(coffee);
console.log(`${coffee.description()} - $${coffee.cost()}`);

coffee = new WhippedCreamDecorator(coffee);
console.log(`${coffee.description()} - $${coffee.cost()}`);

// Output:
// Simple coffee - $5
// Simple coffee, milk - $6
// Simple coffee, milk, sugar - $6.5
// Simple coffee, milk, sugar, whipped cream - $8.5
```

---

### 7. Facade Pattern

#### What is the Facade Pattern?

The Facade pattern provides a simplified interface to a complex subsystem. It hides the complexities of the system and provides a simple interface to the client.

#### When to Use?
- When you want to provide a simple interface to a complex system
- When there are many interdependent classes
- When you want to layer your subsystems

#### Example

```typescript
// Complex subsystem classes
class CPU {
  freeze(): void {
    console.log('CPU: Freezing...');
  }

  jump(position: number): void {
    console.log(`CPU: Jumping to ${position}`);
  }

  execute(): void {
    console.log('CPU: Executing...');
  }
}

class Memory {
  load(position: number, data: string): void {
    console.log(`Memory: Loading data "${data}" at position ${position}`);
  }
}

class HardDrive {
  read(lba: number, size: number): string {
    console.log(`HardDrive: Reading ${size} bytes from LBA ${lba}`);
    return 'boot data';
  }
}

// Facade
class ComputerFacade {
  private cpu: CPU;
  private memory: Memory;
  private hardDrive: HardDrive;

  constructor() {
    this.cpu = new CPU();
    this.memory = new Memory();
    this.hardDrive = new HardDrive();
  }

  start(): void {
    console.log('Starting computer...\n');
    this.cpu.freeze();
    const bootData = this.hardDrive.read(0, 1024);
    this.memory.load(0, bootData);
    this.cpu.jump(0);
    this.cpu.execute();
    console.log('\nComputer started successfully!');
  }
}

// Usage - Simple interface for complex operations
const computer = new ComputerFacade();
computer.start();
```

#### Real-World Example: Online Shopping Facade

```typescript
// Subsystem classes
class Inventory {
  checkStock(productId: string): boolean {
    console.log(`Checking inventory for product ${productId}`);
    return true;
  }

  updateStock(productId: string, quantity: number): void {
    console.log(`Updating stock: ${productId} - ${quantity}`);
  }
}

class PaymentProcessor {
  processPayment(amount: number, method: string): boolean {
    console.log(`Processing payment of $${amount} via ${method}`);
    return true;
  }
}

class ShippingService {
  shipOrder(orderId: string, address: string): string {
    console.log(`Shipping order ${orderId} to ${address}`);
    return 'TRACK123';
  }
}

class NotificationService {
  sendConfirmation(email: string, orderId: string): void {
    console.log(`Sending confirmation email to ${email} for order ${orderId}`);
  }
}

// Facade
class OrderFacade {
  private inventory: Inventory;
  private payment: PaymentProcessor;
  private shipping: ShippingService;
  private notification: NotificationService;

  constructor() {
    this.inventory = new Inventory();
    this.payment = new PaymentProcessor();
    this.shipping = new ShippingService();
    this.notification = new NotificationService();
  }

  placeOrder(
    productId: string,
    quantity: number,
    amount: number,
    paymentMethod: string,
    shippingAddress: string,
    email: string
  ): string {
    console.log('=== Processing Order ===\n');

    // Check inventory
    if (!this.inventory.checkStock(productId)) {
      return 'Order failed: Out of stock';
    }

    // Process payment
    if (!this.payment.processPayment(amount, paymentMethod)) {
      return 'Order failed: Payment declined';
    }

    // Update inventory
    this.inventory.updateStock(productId, -quantity);

    // Ship order
    const orderId = `ORD-${Date.now()}`;
    const trackingNumber = this.shipping.shipOrder(orderId, shippingAddress);

    // Send confirmation
    this.notification.sendConfirmation(email, orderId);

    console.log('\n=== Order Complete ===');
    return `Order successful! Tracking: ${trackingNumber}`;
  }
}

// Usage - Simple interface for complex process
const orderSystem = new OrderFacade();
const result = orderSystem.placeOrder(
  'PROD-123',
  2,
  99.99,
  'Credit Card',
  '123 Main St',
  'customer@example.com'
);
console.log(result);
```

---

### 8. Proxy Pattern

#### What is the Proxy Pattern?

The Proxy pattern provides a surrogate or placeholder for another object to control access to it.

#### When to Use?
- Lazy initialization (virtual proxy)
- Access control (protection proxy)
- Logging and caching
- Remote objects (remote proxy)

#### Example

```typescript
interface Image {
  display(): void;
}

// Real object
class RealImage implements Image {
  private filename: string;

  constructor(filename: string) {
    this.filename = filename;
    this.loadFromDisk();
  }

  private loadFromDisk(): void {
    console.log(`Loading image from disk: ${this.filename}`);
  }

  display(): void {
    console.log(`Displaying image: ${this.filename}`);
  }
}

// Proxy object
class ImageProxy implements Image {
  private realImage: RealImage | null = null;
  private filename: string;

  constructor(filename: string) {
    this.filename = filename;
  }

  display(): void {
    // Lazy loading - only load when needed
    if (this.realImage === null) {
      this.realImage = new RealImage(this.filename);
    }
    this.realImage.display();
  }
}

// Usage
console.log('Creating proxy...');
const image = new ImageProxy('photo.jpg');

console.log('\nFirst display (loads image):');
image.display();

console.log('\nSecond display (uses cached):');
image.display();
```

---

## Behavioral Patterns

### 9. Observer Pattern

#### What is the Observer Pattern?

The Observer pattern defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified automatically.

#### When to Use?
- Event handling systems
- Implementing distributed event handling
- When changes to one object require changing others

#### Example

```typescript
// Observer interface
interface Observer {
  update(data: any): void;
}

// Subject interface
interface Subject {
  attach(observer: Observer): void;
  detach(observer: Observer): void;
  notify(): void;
}

// Concrete Subject
class NewsAgency implements Subject {
  private observers: Observer[] = [];
  private news: string = '';

  attach(observer: Observer): void {
    const exists = this.observers.includes(observer);
    if (!exists) {
      this.observers.push(observer);
      console.log('Observer attached');
    }
  }

  detach(observer: Observer): void {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
      console.log('Observer detached');
    }
  }

  notify(): void {
    console.log('\nNotifying all observers...');
    for (const observer of this.observers) {
      observer.update(this.news);
    }
  }

  setNews(news: string): void {
    console.log(`\nNews Agency: Breaking news - ${news}`);
    this.news = news;
    this.notify();
  }
}

// Concrete Observers
class NewsChannel implements Observer {
  constructor(private name: string) {}

  update(news: string): void {
    console.log(`${this.name} received news: ${news}`);
  }
}

class NewsWebsite implements Observer {
  constructor(private url: string) {}

  update(news: string): void {
    console.log(`${this.url} published: ${news}`);
  }
}

// Usage
const agency = new NewsAgency();

const cnn = new NewsChannel('CNN');
const bbc = new NewsChannel('BBC');
const website = new NewsWebsite('news.com');

agency.attach(cnn);
agency.attach(bbc);
agency.attach(website);

agency.setNews('Market reaches all-time high!');

agency.detach(bbc);

agency.setNews('New technology breakthrough announced!');
```

---

### 10. Strategy Pattern

#### What is the Strategy Pattern?

The Strategy pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable. It lets the algorithm vary independently from clients that use it.

#### When to Use?
- When you have multiple ways to perform an operation
- When you want to avoid conditional statements
- When algorithms should be interchangeable

#### Example

```typescript
// Strategy interface
interface PaymentStrategy {
  pay(amount: number): void;
}

// Concrete strategies
class CreditCardStrategy implements PaymentStrategy {
  constructor(
    private cardNumber: string,
    private cvv: string,
    private expiryDate: string
  ) {}

  pay(amount: number): void {
    console.log(`Paid $${amount} using Credit Card ending in ${this.cardNumber.slice(-4)}`);
  }
}

class PayPalStrategy implements PaymentStrategy {
  constructor(private email: string) {}

  pay(amount: number): void {
    console.log(`Paid $${amount} using PayPal account: ${this.email}`);
  }
}

class CryptoStrategy implements PaymentStrategy {
  constructor(private walletAddress: string) {}

  pay(amount: number): void {
    console.log(`Paid $${amount} using Crypto wallet: ${this.walletAddress.slice(0, 10)}...`);
  }
}

// Context
class ShoppingCart {
  private items: Array<{ name: string; price: number }> = [];
  private paymentStrategy?: PaymentStrategy;

  addItem(name: string, price: number): void {
    this.items.push({ name, price });
  }

  setPaymentStrategy(strategy: PaymentStrategy): void {
    this.paymentStrategy = strategy;
  }

  checkout(): void {
    const total = this.items.reduce((sum, item) => sum + item.price, 0);
    
    console.log('\n=== Checkout ===');
    this.items.forEach(item => {
      console.log(`${item.name}: $${item.price}`);
    });
    console.log(`Total: $${total}\n`);

    if (!this.paymentStrategy) {
      console.log('Please select a payment method');
      return;
    }

    this.paymentStrategy.pay(total);
  }
}

// Usage
const cart = new ShoppingCart();
cart.addItem('Laptop', 999);
cart.addItem('Mouse', 25);

// Pay with credit card
cart.setPaymentStrategy(new CreditCardStrategy('1234-5678-9012-3456', '123', '12/25'));
cart.checkout();

// Pay with PayPal
cart.setPaymentStrategy(new PayPalStrategy('user@example.com'));
cart.checkout();

// Pay with Crypto
cart.setPaymentStrategy(new CryptoStrategy('0x1234567890abcdef'));
cart.checkout();
```

---

### 11. Command Pattern

#### What is the Command Pattern?

The Command pattern encapsulates a request as an object, thereby letting you parameterize clients with different requests, queue or log requests, and support undoable operations.

#### When to Use?
- Implementing undo/redo functionality
- Queuing operations
- Logging operations
- Supporting transactions

#### Example

```typescript
// Command interface
interface Command {
  execute(): void;
  undo(): void;
}

// Receiver
class Light {
  private isOn: boolean = false;

  turnOn(): void {
    this.isOn = true;
    console.log('Light is ON');
  }

  turnOff(): void {
    this.isOn = false;
    console.log('Light is OFF');
  }
}

// Concrete commands
class LightOnCommand implements Command {
  constructor(private light: Light) {}

  execute(): void {
    this.light.turnOn();
  }

  undo(): void {
    this.light.turnOff();
  }
}

class LightOffCommand implements Command {
  constructor(private light: Light) {}

  execute(): void {
    this.light.turnOff();
  }

  undo(): void {
    this.light.turnOn();
  }
}

// Invoker
class RemoteControl {
  private history: Command[] = [];

  executeCommand(command: Command): void {
    command.execute();
    this.history.push(command);
  }

  undo(): void {
    const command = this.history.pop();
    if (command) {
      command.undo();
    } else {
      console.log('Nothing to undo');
    }
  }
}

// Usage
const light = new Light();
const remote = new RemoteControl();

const turnOn = new LightOnCommand(light);
const turnOff = new LightOffCommand(light);

remote.executeCommand(turnOn);   // Light is ON
remote.executeCommand(turnOff);  // Light is OFF
remote.undo();                   // Light is ON (undo off)
remote.undo();                   // Light is OFF (undo on)
```

#### Real-World Example: Text Editor

```typescript
interface EditorCommand {
  execute(): void;
  undo(): void;
}

class TextEditor {
  private content: string = '';

  getContent(): string {
    return this.content;
  }

  setContent(content: string): void {
    this.content = content;
  }

  insertText(text: string): void {
    this.content += text;
  }

  deleteText(length: number): void {
    this.content = this.content.slice(0, -length);
  }
}

class InsertCommand implements EditorCommand {
  constructor(
    private editor: TextEditor,
    private text: string
  ) {}

  execute(): void {
    this.editor.insertText(this.text);
    console.log(`Inserted: "${this.text}"`);
    console.log(`Content: "${this.editor.getContent()}"`);
  }

  undo(): void {
    this.editor.deleteText(this.text.length);
    console.log(`Undid insert of: "${this.text}"`);
    console.log(`Content: "${this.editor.getContent()}"`);
  }
}

class CommandManager {
  private history: EditorCommand[] = [];
  private currentIndex: number = -1;

  executeCommand(command: EditorCommand): void {
    // Remove any commands after current index
    this.history = this.history.slice(0, this.currentIndex + 1);
    
    command.execute();
    this.history.push(command);
    this.currentIndex++;
  }

  undo(): void {
    if (this.currentIndex >= 0) {
      this.history[this.currentIndex].undo();
      this.currentIndex--;
    } else {
      console.log('Nothing to undo');
    }
  }

  redo(): void {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      this.history[this.currentIndex].execute();
    } else {
      console.log('Nothing to redo');
    }
  }
}

// Usage
const editor = new TextEditor();
const manager = new CommandManager();

manager.executeCommand(new InsertCommand(editor, 'Hello '));
manager.executeCommand(new InsertCommand(editor, 'World'));
manager.executeCommand(new InsertCommand(editor, '!'));

console.log('\n--- Undo operations ---');
manager.undo();
manager.undo();

console.log('\n--- Redo operations ---');
manager.redo();
```

---

### 12. Template Method Pattern

#### What is the Template Method Pattern?

The Template Method pattern defines the skeleton of an algorithm in a base class but lets subclasses override specific steps without changing the algorithm's structure.

#### When to Use?
- When you have algorithms with similar structures
- When you want to avoid code duplication
- When you want to control which steps can be overridden

#### Example

```typescript
abstract class DataProcessor {
  // Template method
  process(): void {
    this.readData();
    this.processData();
    this.validateData();
    this.saveData();
  }

  abstract readData(): void;
  abstract processData(): void;

  // Hook with default implementation
  validateData(): void {
    console.log('Validating data...');
  }

  abstract saveData(): void;
}

class CSVDataProcessor extends DataProcessor {
  readData(): void {
    console.log('Reading data from CSV file');
  }

  processData(): void {
    console.log('Processing CSV data');
  }

  saveData(): void {
    console.log('Saving data to database from CSV');
  }
}

class JSONDataProcessor extends DataProcessor {
  readData(): void {
    console.log('Reading data from JSON file');
  }

  processData(): void {
    console.log('Processing JSON data');
  }

  validateData(): void {
    console.log('Validating JSON schema');
  }

  saveData(): void {
    console.log('Saving data to database from JSON');
  }
}

// Usage
console.log('=== CSV Processing ===');
const csvProcessor = new CSVDataProcessor();
csvProcessor.process();

console.log('\n=== JSON Processing ===');
const jsonProcessor = new JSONDataProcessor();
jsonProcessor.process();
```

---

## Design Pattern Comparison

### When to Use Which Pattern?

| Pattern | Use Case | Example |
|---------|----------|---------|
| **Singleton** | One instance needed globally | Database connection, Logger |
| **Factory** | Create objects without specifying exact class | Payment methods, Notifications |
| **Builder** | Complex object construction | Building queries, Configuration objects |
| **Adapter** | Make incompatible interfaces work together | Legacy system integration |
| **Decorator** | Add responsibilities dynamically | Adding features to coffee, Text formatting |
| **Facade** | Simplify complex subsystem | Computer startup, Order processing |
| **Proxy** | Control access to an object | Lazy loading, Access control |
| **Observer** | One-to-many dependency | Event systems, Pub/sub |
| **Strategy** | Interchangeable algorithms | Payment methods, Sorting algorithms |
| **Command** | Encapsulate requests as objects | Undo/redo, Transaction systems |
| **Template Method** | Algorithm skeleton with customizable steps | Data processing pipelines |

---

## Common Interview Questions

### 1. What's the difference between Factory and Abstract Factory patterns?

**Factory Pattern:**
- Creates objects of a single family/type
- Uses a single method to create objects
- Simpler and more common

**Abstract Factory Pattern:**
- Creates families of related objects
- Uses multiple factory methods
- More complex, used when you need to create related objects

### 2. What's the difference between Adapter and Facade patterns?

**Adapter:**
- Converts one interface to another
- Works with a single class
- Makes existing classes work together

**Facade:**
- Provides a simplified interface to a complex subsystem
- Works with multiple classes
- Hides complexity

### 3. What's the difference between Strategy and State patterns?

**Strategy:**
- Algorithms are interchangeable
- Client chooses the strategy
- Focuses on behavior

**State:**
- Behavior changes based on internal state
- Object changes its own state
- Focuses on state transitions

### 4. What's the difference between Proxy and Decorator patterns?

**Proxy:**
- Controls access to an object
- Same interface as the real object
- Focuses on access control

**Decorator:**
- Adds new functionality
- Enhances the object
- Focuses on extending behavior

### 5. Can you combine multiple patterns?

Yes! Patterns often work together:
- **Singleton + Factory**: Single factory instance
- **Observer + Mediator**: Complex event handling
- **Strategy + Factory**: Creating strategy objects
- **Decorator + Factory**: Creating decorated objects

---

## Best Practices

1. **Don't Force Patterns**: Use patterns when they solve a real problem, not just for the sake of using them
2. **Start Simple**: Begin with simple solutions and refactor to patterns when needed
3. **Understand Trade-offs**: Each pattern has pros and cons
4. **SOLID Principles**: Patterns should support SOLID principles
5. **Document Your Intent**: Make it clear why you're using a particular pattern

---

**Remember**: Design patterns are tools, not rules. Use them wisely to write clean, maintainable, and scalable code!

