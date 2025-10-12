/**
 * Classes and Object-Oriented Programming in TypeScript
 * Demonstrates classes, inheritance, access modifiers, and OOP concepts
 */

// Basic Class
class Person {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  greet(): string {
    return `Hello, my name is ${this.name}`;
  }
}

const person = new Person("Alice", 30);
console.log(person.greet());

// Access Modifiers
class Employee {
  public name: string; // Accessible everywhere (default)
  private salary: number; // Only accessible within the class
  protected department: string; // Accessible within class and subclasses

  constructor(name: string, salary: number, department: string) {
    this.name = name;
    this.salary = salary;
    this.department = department;
  }

  public getDetails(): string {
    return `${this.name} works in ${this.department}`;
  }

  private calculateBonus(): number {
    return this.salary * 0.1;
  }

  public getTotalCompensation(): number {
    return this.salary + this.calculateBonus();
  }
}

const emp = new Employee("Bob", 50000, "Engineering");
console.log(emp.name); // OK
// console.log(emp.salary); // Error: private
// console.log(emp.department); // Error: protected

// Parameter Properties (Shorthand)
class User {
  constructor(
    public id: number,
    public name: string,
    private email: string,
    protected role: string
  ) {
    // Properties automatically created and assigned
  }

  getEmail(): string {
    return this.email;
  }
}

const user = new User(1, "Alice", "alice@example.com", "admin");

// Readonly Properties
class Point {
  readonly x: number;
  readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  // x and y cannot be modified after initialization
}

const point = new Point(10, 20);
// point.x = 15; // Error: readonly property

// Getters and Setters
class Temperature {
  private _celsius: number = 0;

  get celsius(): number {
    return this._celsius;
  }

  set celsius(value: number) {
    if (value < -273.15) {
      throw new Error("Temperature cannot be below absolute zero");
    }
    this._celsius = value;
  }

  get fahrenheit(): number {
    return (this._celsius * 9) / 5 + 32;
  }

  set fahrenheit(value: number) {
    this._celsius = ((value - 32) * 5) / 9;
  }
}

const temp = new Temperature();
temp.celsius = 25;
console.log(temp.fahrenheit); // 77

// Inheritance
class Animal {
  constructor(public name: string) {}

  makeSound(): string {
    return "Some generic animal sound";
  }

  move(distance: number): string {
    return `${this.name} moved ${distance} meters`;
  }
}

class Dog extends Animal {
  constructor(name: string, public breed: string) {
    super(name);
  }

  makeSound(): string {
    return "Woof! Woof!";
  }

  fetch(): string {
    return `${this.name} is fetching the ball`;
  }
}

class Cat extends Animal {
  makeSound(): string {
    return "Meow!";
  }

  scratch(): string {
    return `${this.name} is scratching the furniture`;
  }
}

const dog = new Dog("Buddy", "Golden Retriever");
console.log(dog.makeSound()); // "Woof! Woof!"
console.log(dog.fetch());

// Abstract Classes
abstract class Shape {
  constructor(public color: string) {}

  abstract area(): number;
  abstract perimeter(): number;

  describe(): string {
    return `A ${this.color} shape with area ${this.area()}`;
  }
}

class Circle extends Shape {
  constructor(color: string, public radius: number) {
    super(color);
  }

  area(): number {
    return Math.PI * this.radius ** 2;
  }

  perimeter(): number {
    return 2 * Math.PI * this.radius;
  }
}

class Rectangle extends Shape {
  constructor(color: string, public width: number, public height: number) {
    super(color);
  }

  area(): number {
    return this.width * this.height;
  }

  perimeter(): number {
    return 2 * (this.width + this.height);
  }
}

// const shape = new Shape("red"); // Error: Cannot instantiate abstract class
const circle = new Circle("blue", 5);
console.log(circle.describe());

// Implementing Interfaces
interface Printable {
  print(): void;
}

interface Serializable {
  serialize(): string;
  deserialize(data: string): void;
}

class Document implements Printable, Serializable {
  constructor(public title: string, public content: string) {}

  print(): void {
    console.log(`Title: ${this.title}\n${this.content}`);
  }

  serialize(): string {
    return JSON.stringify({ title: this.title, content: this.content });
  }

  deserialize(data: string): void {
    const obj = JSON.parse(data);
    this.title = obj.title;
    this.content = obj.content;
  }
}

// Static Members
class MathUtils {
  static PI: number = 3.14159;

  static circleArea(radius: number): number {
    return MathUtils.PI * radius ** 2;
  }

  static rectangleArea(width: number, height: number): number {
    return width * height;
  }
}

console.log(MathUtils.PI);
console.log(MathUtils.circleArea(5));

// Static Factory Pattern
class UserFactory {
  private static idCounter: number = 0;

  static createUser(name: string, email: string): User {
    return new User(++UserFactory.idCounter, name, email, "user");
  }

  static createAdmin(name: string, email: string): User {
    return new User(++UserFactory.idCounter, name, email, "admin");
  }
}

// Generic Classes
class Box<T> {
  private _value: T;

  constructor(value: T) {
    this._value = value;
  }

  get value(): T {
    return this._value;
  }

  set value(newValue: T) {
    this._value = newValue;
  }

  map<U>(fn: (value: T) => U): Box<U> {
    return new Box(fn(this._value));
  }
}

const numberBox = new Box(42);
const stringBox = numberBox.map((n) => n.toString());

// Private Fields (ES2022)
class BankAccount {
  #balance: number = 0; // Private field

  constructor(initialBalance: number) {
    this.#balance = initialBalance;
  }

  deposit(amount: number): void {
    if (amount > 0) {
      this.#balance += amount;
    }
  }

  withdraw(amount: number): boolean {
    if (amount > 0 && amount <= this.#balance) {
      this.#balance -= amount;
      return true;
    }
    return false;
  }

  getBalance(): number {
    return this.#balance;
  }
}

// Method Overloading
class Calculator {
  add(a: number, b: number): number;
  add(a: string, b: string): string;
  add(a: number[], b: number[]): number[];
  add(a: any, b: any): any {
    if (typeof a === "number" && typeof b === "number") {
      return a + b;
    } else if (typeof a === "string" && typeof b === "string") {
      return a + b;
    } else if (Array.isArray(a) && Array.isArray(b)) {
      return [...a, ...b];
    }
  }
}

const calc = new Calculator();
console.log(calc.add(5, 3)); // 8
console.log(calc.add("Hello ", "World")); // "Hello World"
console.log(calc.add([1, 2], [3, 4])); // [1, 2, 3, 4]

// Singleton Pattern
class Singleton {
  private static instance: Singleton;
  private constructor() {
    // Private constructor prevents instantiation
  }

  static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }

  doSomething(): void {
    console.log("Singleton method called");
  }
}

const singleton1 = Singleton.getInstance();
const singleton2 = Singleton.getInstance();
console.log(singleton1 === singleton2); // true

// Builder Pattern
class ProductBuilder {
  private product: Partial<Product> = {};

  setName(name: string): this {
    this.product.name = name;
    return this;
  }

  setPrice(price: number): this {
    this.product.price = price;
    return this;
  }

  setCategory(category: string): this {
    this.product.category = category;
    return this;
  }

  build(): Product {
    if (!this.product.name || !this.product.price || !this.product.category) {
      throw new Error("Product is incomplete");
    }
    return this.product as Product;
  }
}

interface Product {
  name: string;
  price: number;
  category: string;
}

const product = new ProductBuilder()
  .setName("Laptop")
  .setPrice(1000)
  .setCategory("Electronics")
  .build();

// Mixin Pattern
type Constructor<T = {}> = new (...args: any[]) => T;

function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    timestamp = new Date();

    getTimestamp(): Date {
      return this.timestamp;
    }
  };
}

function Activatable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    isActive = false;

    activate(): void {
      this.isActive = true;
    }

    deactivate(): void {
      this.isActive = false;
    }
  };
}

class BasicUser {
  constructor(public name: string) {}
}

const TimestampedUser = Timestamped(BasicUser);
const ActivatableUser = Activatable(TimestampedUser);

const mixinUser = new ActivatableUser("Alice");
mixinUser.activate();
console.log(mixinUser.getTimestamp());
console.log(mixinUser.isActive);

// Decorator Pattern (with experimental decorators)
function logged(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    console.log(`Calling ${propertyKey} with args:`, args);
    const result = originalMethod.apply(this, args);
    console.log(`Result:`, result);
    return result;
  };

  return descriptor;
}

class Service {
  @logged
  getData(id: number): string {
    return `Data for id: ${id}`;
  }
}

export {};

