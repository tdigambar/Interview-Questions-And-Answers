# TypeScript Interview Questions and Answers

A comprehensive guide to TypeScript interview questions with detailed answers and practical examples.

## Table of Contents

1. [Basics](#basics)
2. [Type System](#type-system)
3. [Advanced Types](#advanced-types)
4. [Utility Types](#utility-types)
5. [Generics](#generics)
6. [Classes and OOP](#classes-and-oop)
7. [Interfaces vs Types](#interfaces-vs-types)
8. [Modules and Namespaces](#modules-and-namespaces)
9. [Configuration](#configuration)
10. [Best Practices](#best-practices)
11. [Practical Scenarios](#practical-scenarios)

---

## Basics

### 1. What is TypeScript and why use it?

**Answer:**
TypeScript is a statically typed superset of JavaScript that compiles to plain JavaScript. It adds optional type annotations, interfaces, classes, and other features to JavaScript.

**Benefits:**
- **Type Safety**: Catches errors at compile time rather than runtime
- **Better IDE Support**: Enhanced autocomplete, refactoring, and navigation
- **Code Documentation**: Types serve as inline documentation
- **Easier Refactoring**: Type checking helps prevent breaking changes
- **Object-Oriented Features**: Classes, interfaces, access modifiers
- **Latest JavaScript Features**: Use modern ES features that compile down to older versions

```typescript
// JavaScript - no type checking
function add(a, b) {
  return a + b;
}
add(5, "10"); // Returns "510" - unexpected behavior

// TypeScript - type safety
function add(a: number, b: number): number {
  return a + b;
}
add(5, "10"); // Compile error: Argument of type 'string' is not assignable to parameter of type 'number'
```

### 2. What are the basic types in TypeScript?

**Answer:**
TypeScript provides several primitive and complex types:

```typescript
// Primitive Types
let isDone: boolean = false;
let decimal: number = 6;
let color: string = "blue";
let notDefined: undefined = undefined;
let notPresent: null = null;

// Complex Types
let list: number[] = [1, 2, 3];
let tuple: [string, number] = ["hello", 10];
let anyType: any = 4; // Can be any type
let unknownType: unknown = 4; // Safer version of any
let voidReturn: void = undefined; // Usually for functions that don't return
let neverReturn: never; // For functions that never return

// Object
let obj: object = { name: "John" };

// Enum
enum Color {
  Red,
  Green,
  Blue
}
let c: Color = Color.Green;
```

### 3. What is the difference between `any` and `unknown`?

**Answer:**
- **`any`**: Disables all type checking. You can do anything with it.
- **`unknown`**: A type-safe counterpart of `any`. You must perform type checking before using it.

```typescript
let anyValue: any = 10;
let unknownValue: unknown = 10;

// any - no type checking
anyValue.toUpperCase(); // No error, but will fail at runtime
anyValue.foo.bar; // No error

// unknown - requires type checking
unknownValue.toUpperCase(); // Error: Object is of type 'unknown'

// Need to narrow the type first
if (typeof unknownValue === "string") {
  unknownValue.toUpperCase(); // OK
}
```

### 4. What is type inference?

**Answer:**
Type inference is TypeScript's ability to automatically determine types based on the values assigned.

```typescript
// Type is inferred as number
let x = 3;

// Type is inferred as string
let name = "Alice";

// Type is inferred from return value
function multiply(a: number, b: number) {
  return a * b; // Return type inferred as number
}

// Array type inference
let numbers = [1, 2, 3]; // Type: number[]
let mixed = [1, "two", 3]; // Type: (string | number)[]
```

---

## Type System

### 5. What are union types?

**Answer:**
Union types allow a variable to hold values of multiple types using the `|` operator.

```typescript
function printId(id: number | string) {
  if (typeof id === "string") {
    console.log(id.toUpperCase());
  } else {
    console.log(id.toFixed(2));
  }
}

printId(101); // OK
printId("202"); // OK
printId(true); // Error

type Status = "pending" | "approved" | "rejected";
let orderStatus: Status = "pending"; // OK
orderStatus = "shipped"; // Error: Type '"shipped"' is not assignable to type 'Status'
```

### 6. What are intersection types?

**Answer:**
Intersection types combine multiple types into one using the `&` operator.

```typescript
interface BusinessPartner {
  name: string;
  credit: number;
}

interface Contact {
  email: string;
  phone: string;
}

type Customer = BusinessPartner & Contact;

const customer: Customer = {
  name: "John Doe",
  credit: 1000,
  email: "john@example.com",
  phone: "555-1234"
};
```

### 7. What are type guards?

**Answer:**
Type guards are expressions that perform runtime checks to narrow down types within a conditional block.

```typescript
// typeof type guard
function padLeft(value: string, padding: string | number) {
  if (typeof padding === "number") {
    return Array(padding + 1).join(" ") + value;
  }
  return padding + value;
}

// instanceof type guard
class Dog {
  bark() {
    console.log("Woof!");
  }
}

class Cat {
  meow() {
    console.log("Meow!");
  }
}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark();
  } else {
    animal.meow();
  }
}

// Custom type guard
interface Fish {
  swim: () => void;
}

interface Bird {
  fly: () => void;
}

function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

function move(pet: Fish | Bird) {
  if (isFish(pet)) {
    pet.swim();
  } else {
    pet.fly();
  }
}
```

### 8. What is type assertion?

**Answer:**
Type assertion tells TypeScript to treat a value as a specific type. It's like type casting in other languages but performs no runtime checking.

```typescript
// Angle-bracket syntax
let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length;

// as syntax (preferred in JSX)
let someValue2: any = "this is a string";
let strLength2: number = (someValue2 as string).length;

// DOM example
const input = document.getElementById("myInput") as HTMLInputElement;
input.value = "Hello"; // OK because we asserted HTMLInputElement

// Non-null assertion operator
function processValue(value: string | null) {
  console.log(value!.toUpperCase()); // ! asserts value is not null
}
```

---

## Advanced Types

### 9. What are mapped types?

**Answer:**
Mapped types create new types by transforming properties of an existing type.

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};

interface User {
  name: string;
  age: number;
  email: string;
}

// Make all properties readonly
type ReadonlyUser = Readonly<User>;

// Make all properties optional
type PartialUser = Partial<User>;

// Custom mapped type
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

type NullableUser = Nullable<User>;
// { name: string | null; age: number | null; email: string | null; }
```

### 10. What are conditional types?

**Answer:**
Conditional types select one of two possible types based on a condition expressed as a type relationship test.

```typescript
// Syntax: T extends U ? X : Y
type NonNullable<T> = T extends null | undefined ? never : T;

type Example1 = NonNullable<string | null>; // string
type Example2 = NonNullable<number | undefined>; // number

// Infer keyword in conditional types
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

function getUser() {
  return { name: "Alice", age: 30 };
}

type User = ReturnType<typeof getUser>; // { name: string; age: number; }

// Distributive conditional types
type ToArray<T> = T extends any ? T[] : never;
type StrOrNumArray = ToArray<string | number>; // string[] | number[]
```

### 11. What are template literal types?

**Answer:**
Template literal types build on string literal types to create new types through string manipulation.

```typescript
type World = "world";
type Greeting = `hello ${World}`; // "hello world"

type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";
type Endpoint = "users" | "posts" | "comments";

type APIRoute = `/${Endpoint}`;
// "/" | "/users" | "/posts" | "/comments"

type HTTPRequest = `${HTTPMethod} ${APIRoute}`;
// "GET /users" | "POST /users" | "PUT /users" | ...

// Practical example
type PropEventSource<T> = {
  on<K extends string & keyof T>(
    eventName: `${K}Changed`,
    callback: (newValue: T[K]) => void
  ): void;
};

declare function makeWatchedObject<T>(obj: T): T & PropEventSource<T>;

const person = makeWatchedObject({
  firstName: "John",
  age: 30
});

person.on("firstNameChanged", (newName) => {
  console.log(`Name changed to ${newName}`);
});
```

### 12. What is the `keyof` operator?

**Answer:**
The `keyof` operator takes an object type and produces a string or numeric literal union of its keys.

```typescript
interface Person {
  name: string;
  age: number;
  location: string;
}

type PersonKeys = keyof Person; // "name" | "age" | "location"

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person: Person = {
  name: "Alice",
  age: 30,
  location: "NYC"
};

const name = getProperty(person, "name"); // Type: string
const age = getProperty(person, "age"); // Type: number
// getProperty(person, "invalid"); // Error
```

### 13. What are TypeScript utility types?

**Answer:**
Utility types are built-in generic types that help transform and manipulate existing types. They're included in TypeScript's standard library and don't require imports.

**Common Utility Types:**

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// 1. Partial<T> - Makes all properties optional
type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; age?: number; }

function updateUser(id: number, updates: Partial<User>) {
  // Can pass only the fields you want to update
}

// 2. Required<T> - Makes all properties required
interface Config {
  host?: string;
  port?: number;
}
type RequiredConfig = Required<Config>;
// { host: string; port: number; }

// 3. Readonly<T> - Makes all properties readonly
type ReadonlyUser = Readonly<User>;
const user: ReadonlyUser = { id: 1, name: "Alice", email: "alice@example.com", age: 30 };
// user.age = 31; // Error: Cannot assign to 'age' because it is a read-only property

// 4. Pick<T, K> - Pick specific properties
type UserPreview = Pick<User, "id" | "name" | "email">;
// { id: number; name: string; email: string; }

// 5. Omit<T, K> - Omit specific properties
type UserWithoutPassword = Omit<User, "password">;
type UserCreate = Omit<User, "id">; // For creating new users

// 6. Record<K, T> - Create object type with keys K and values T
type UserRole = "admin" | "user" | "guest";
const permissions: Record<UserRole, string[]> = {
  admin: ["read", "write", "delete"],
  user: ["read", "write"],
  guest: ["read"]
};

// 7. Exclude<T, U> - Remove types from union
type Status = "pending" | "approved" | "rejected" | "cancelled";
type ActiveStatus = Exclude<Status, "cancelled" | "rejected">;
// "pending" | "approved"

// 8. Extract<T, U> - Extract types from union
type CompletedStatus = Extract<Status, "approved" | "rejected">;
// "approved" | "rejected"

// 9. NonNullable<T> - Remove null and undefined
type MaybeString = string | null | undefined;
type DefinitelyString = NonNullable<MaybeString>; // string

// 10. ReturnType<T> - Extract function return type
function getUser() {
  return { id: 1, name: "Alice", email: "alice@example.com" };
}
type UserType = ReturnType<typeof getUser>;
// { id: number; name: string; email: string; }

// 11. Parameters<T> - Extract function parameter types
function createUser(name: string, age: number, email: string) {
  return { name, age, email };
}
type CreateUserParams = Parameters<typeof createUser>;
// [name: string, age: number, email: string]

// 12. Awaited<T> - Unwrap Promise type
type AsyncUser = Promise<User>;
type SyncUser = Awaited<AsyncUser>; // User

// 13. String Manipulation Types
type Greeting = "hello world";
type Upper = Uppercase<Greeting>; // "HELLO WORLD"
type Lower = Lowercase<Greeting>; // "hello world"
type Capitalized = Capitalize<Greeting>; // "Hello world"
type Uncapitalized = Uncapitalize<"Hello">; // "hello"
```

**Real-World Example:**

```typescript
interface Article {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
}

// For API requests
type ArticleCreate = Omit<Article, "id" | "createdAt" | "updatedAt" | "published">;
type ArticleUpdate = Partial<Omit<Article, "id">> & Pick<Article, "id">;

// For responses
type ArticleResponse = Readonly<Article>;
type ArticleListItem = Pick<Article, "id" | "title" | "author" | "published">;

// Usage
function createArticle(data: ArticleCreate): Article {
  return {
    ...data,
    id: Date.now(),
    createdAt: new Date(),
    updatedAt: new Date(),
    published: false
  };
}
```

---

## Utility Types

*(See Question 13 above for comprehensive utility types coverage)*

---

## Generics

### 14. What are generics and why use them?

**Answer:**
Generics allow you to create reusable components that work with multiple types while maintaining type safety.

```typescript
// Without generics - not reusable
function identityNumber(arg: number): number {
  return arg;
}

function identityString(arg: string): string {
  return arg;
}

// With generics - reusable and type-safe
function identity<T>(arg: T): T {
  return arg;
}

const num = identity<number>(42); // Type: number
const str = identity<string>("hello"); // Type: string
const auto = identity(true); // Type inferred as boolean

// Generic array
function firstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

const first = firstElement([1, 2, 3]); // Type: number | undefined
const firstStr = firstElement(["a", "b"]); // Type: string | undefined
```

### 15. How do you constrain generics?

**Answer:**
Generic constraints limit the types that can be used with generics using the `extends` keyword.

```typescript
// Constraint: T must have a length property
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

logLength("hello"); // OK
logLength([1, 2, 3]); // OK
logLength({ length: 10, value: 3 }); // OK
// logLength(3); // Error: number doesn't have length

// Using keyof constraint
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// Multiple constraints
interface HasId {
  id: number;
}

interface HasName {
  name: string;
}

function displayEntity<T extends HasId & HasName>(entity: T): string {
  return `${entity.id}: ${entity.name}`;
}
```

### 16. What are generic classes?

**Answer:**
Generic classes have a generic type parameter list in angle brackets following the class name.

```typescript
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;

  constructor(zeroValue: T, addFn: (x: T, y: T) => T) {
    this.zeroValue = zeroValue;
    this.add = addFn;
  }
}

const myGenericNumber = new GenericNumber<number>(0, (x, y) => x + y);
console.log(myGenericNumber.add(5, 10)); // 15

const myGenericString = new GenericNumber<string>("", (x, y) => x + y);
console.log(myGenericString.add("Hello, ", "World")); // "Hello, World"

// Generic data structure
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

const numberStack = new Stack<number>();
numberStack.push(1);
numberStack.push(2);
console.log(numberStack.pop()); // 2
```

---

## Classes and OOP

### 17. Explain access modifiers in TypeScript

**Answer:**
TypeScript supports three access modifiers: `public`, `private`, and `protected`.

```typescript
class Animal {
  public name: string; // Accessible everywhere (default)
  private age: number; // Only accessible within the class
  protected species: string; // Accessible within class and subclasses

  constructor(name: string, age: number, species: string) {
    this.name = name;
    this.age = age;
    this.species = species;
  }

  public makeSound(): void {
    console.log("Some sound");
  }

  private getAge(): number {
    return this.age;
  }

  protected getSpecies(): string {
    return this.species;
  }
}

class Dog extends Animal {
  constructor(name: string, age: number) {
    super(name, age, "Canine");
  }

  public displayInfo(): void {
    console.log(this.name); // OK - public
    // console.log(this.age); // Error - private
    console.log(this.species); // OK - protected
  }
}

const dog = new Dog("Buddy", 5);
console.log(dog.name); // OK
// console.log(dog.age); // Error
// console.log(dog.species); // Error
```

### 18. What are abstract classes?

**Answer:**
Abstract classes are base classes that cannot be instantiated directly. They may contain abstract methods that must be implemented by derived classes.

```typescript
abstract class Shape {
  abstract area(): number;
  abstract perimeter(): number;

  describe(): string {
    return `Area: ${this.area()}, Perimeter: ${this.perimeter()}`;
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }

  area(): number {
    return Math.PI * this.radius ** 2;
  }

  perimeter(): number {
    return 2 * Math.PI * this.radius;
  }
}

class Rectangle extends Shape {
  constructor(private width: number, private height: number) {
    super();
  }

  area(): number {
    return this.width * this.height;
  }

  perimeter(): number {
    return 2 * (this.width + this.height);
  }
}

// const shape = new Shape(); // Error: Cannot create instance of abstract class
const circle = new Circle(5);
console.log(circle.describe());
```

### 19. What are getters and setters?

**Answer:**
Getters and setters provide a way to control access to object properties.

```typescript
class Employee {
  private _salary: number = 0;
  private _name: string;

  constructor(name: string) {
    this._name = name;
  }

  get salary(): number {
    return this._salary;
  }

  set salary(value: number) {
    if (value < 0) {
      throw new Error("Salary cannot be negative");
    }
    this._salary = value;
  }

  get name(): string {
    return this._name;
  }

  // Computed property
  get annualSalary(): number {
    return this._salary * 12;
  }
}

const emp = new Employee("John");
emp.salary = 5000;
console.log(emp.salary); // 5000
console.log(emp.annualSalary); // 60000
// emp.salary = -1000; // Throws error
```

### 20. What is the `readonly` modifier?

**Answer:**
The `readonly` modifier prevents properties from being changed after initialization.

```typescript
class Person {
  readonly id: number;
  readonly name: string;
  age: number;

  constructor(id: number, name: string, age: number) {
    this.id = id;
    this.name = name;
    this.age = age;
  }

  updateAge(newAge: number): void {
    this.age = newAge; // OK
    // this.id = 123; // Error: Cannot assign to 'id' because it is a read-only property
  }
}

// Readonly with interfaces
interface Point {
  readonly x: number;
  readonly y: number;
}

const point: Point = { x: 10, y: 20 };
// point.x = 5; // Error: Cannot assign to 'x' because it is a read-only property

// ReadonlyArray
const arr: ReadonlyArray<number> = [1, 2, 3];
// arr.push(4); // Error: Property 'push' does not exist on type 'readonly number[]'
```

---

## Interfaces vs Types

### 21. What's the difference between interfaces and type aliases?

**Answer:**
Both interfaces and type aliases can be used to define object shapes, but they have some key differences.

```typescript
// Interface
interface User {
  name: string;
  age: number;
}

// Type alias
type UserType = {
  name: string;
  age: number;
};

// Key Differences:

// 1. Declaration Merging - Only interfaces support it
interface Animal {
  name: string;
}

interface Animal {
  species: string;
}

// Merged: { name: string; species: string; }

// 2. Extending

// Interface extending
interface Bird extends Animal {
  wingspan: number;
}

// Type intersection
type BirdType = Animal & {
  wingspan: number;
};

// 3. Types can represent primitives, unions, tuples
type ID = string | number; // Union
type Callback = () => void; // Function
type Tuple = [string, number]; // Tuple
type StringOrNumber = string | number; // Union

// 4. Computed properties
type Keys = "name" | "age";
type UserRecord = {
  [K in Keys]: string;
};

// 5. Interfaces can be implemented by classes
interface IShape {
  area(): number;
}

class Square implements IShape {
  constructor(private size: number) {}
  area(): number {
    return this.size * this.size;
  }
}
```

### 22. When should you use interfaces vs type aliases?

**Answer:**
**Use Interfaces when:**
- Defining object shapes that might be extended by declaration merging
- Working with classes and implementing contracts
- You want better error messages (interfaces provide clearer error messages)
- Building a public API that others might extend

**Use Type Aliases when:**
- You need unions, intersections, or primitives
- You need mapped types or conditional types
- Creating utility types
- You need tuples or complex type manipulations

```typescript
// Prefer interface for object contracts
interface UserInterface {
  id: number;
  name: string;
  email: string;
}

// Prefer type for unions and complex types
type Status = "pending" | "approved" | "rejected";
type Result<T> = { success: true; data: T } | { success: false; error: string };

// Prefer interface for extensibility
interface BaseConfig {
  apiUrl: string;
}

interface AppConfig extends BaseConfig {
  timeout: number;
  retries: number;
}
```

---

## Modules and Namespaces

### 23. What's the difference between modules and namespaces?

**Answer:**
**Modules** (ES6 modules):
- External modules that use import/export
- File-based
- Recommended for modern TypeScript development

**Namespaces** (formerly "internal modules"):
- Organizational construct within a file
- Use `namespace` keyword
- Legacy approach, mainly for compatibility

```typescript
// Module approach (preferred)
// user.ts
export interface User {
  name: string;
  age: number;
}

export function createUser(name: string, age: number): User {
  return { name, age };
}

// main.ts
import { User, createUser } from "./user";

const user: User = createUser("Alice", 30);

// Namespace approach (legacy)
namespace UserManagement {
  export interface User {
    name: string;
    age: number;
  }

  export function createUser(name: string, age: number): User {
    return { name, age };
  }
}

const user = UserManagement.createUser("Bob", 25);
```

### 24. What are ambient declarations?

**Answer:**
Ambient declarations describe the type of existing JavaScript code to TypeScript using the `declare` keyword.

```typescript
// Declaring a global variable from external library
declare const jQuery: (selector: string) => any;

// Declaring a module
declare module "my-library" {
  export function doSomething(value: string): number;
  export interface Options {
    timeout: number;
  }
}

// Usage
import { doSomething } from "my-library";

// Declaring global namespace augmentation
declare global {
  interface Window {
    myCustomProperty: string;
  }
}

window.myCustomProperty = "Hello"; // OK

// .d.ts file for type definitions
// types.d.ts
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}
```

---

## Configuration

### 25. Explain important `tsconfig.json` options

**Answer:**
The `tsconfig.json` file configures TypeScript compiler options.

```json
{
  "compilerOptions": {
    // Basic Options
    "target": "ES2020",                    // ECMAScript target version
    "module": "commonjs",                  // Module system
    "lib": ["ES2020", "DOM"],             // Library files to include
    "outDir": "./dist",                    // Output directory
    "rootDir": "./src",                    // Input directory
    
    // Strict Type-Checking Options
    "strict": true,                        // Enable all strict type checking
    "noImplicitAny": true,                // Error on expressions with implied 'any'
    "strictNullChecks": true,             // Enable strict null checks
    "strictFunctionTypes": true,          // Strict checking of function types
    "strictBindCallApply": true,          // Strict bind/call/apply methods
    "strictPropertyInitialization": true, // Ensure properties are initialized
    "noImplicitThis": true,               // Error on 'this' with implied 'any'
    "alwaysStrict": true,                 // Parse in strict mode
    
    // Additional Checks
    "noUnusedLocals": true,               // Report errors on unused locals
    "noUnusedParameters": true,           // Report errors on unused parameters
    "noImplicitReturns": true,            // Error when not all paths return value
    "noFallthroughCasesInSwitch": true,  // Report fallthrough cases in switch
    
    // Module Resolution Options
    "moduleResolution": "node",            // Module resolution strategy
    "baseUrl": "./",                       // Base directory for non-relative imports
    "paths": {                             // Path mapping for imports
      "@app/*": ["src/app/*"],
      "@utils/*": ["src/utils/*"]
    },
    "esModuleInterop": true,              // Emit helpers for importing CommonJS
    "allowSyntheticDefaultImports": true, // Allow default imports from modules
    
    // Source Map Options
    "sourceMap": true,                     // Generate source maps
    "declarationMap": true,                // Generate declaration maps
    
    // Experimental Options
    "experimentalDecorators": true,        // Enable decorators
    "emitDecoratorMetadata": true,        // Emit metadata for decorators
    
    // Advanced Options
    "skipLibCheck": true,                  // Skip type checking of declaration files
    "forceConsistentCasingInFileNames": true, // Disallow inconsistent casing
    "resolveJsonModule": true,             // Include .json files
    "declaration": true,                   // Generate .d.ts files
    "removeComments": true                 // Remove comments from output
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.spec.ts"]
}
```

### 26. What is `strict` mode in TypeScript?

**Answer:**
`strict` mode enables all strict type-checking options at once.

```typescript
// With strict mode enabled

// 1. noImplicitAny - Must specify types
function add(a, b) { // Error: Parameter 'a' implicitly has an 'any' type
  return a + b;
}

// 2. strictNullChecks - Must handle null/undefined
function getLength(s: string) {
  return s.length;
}
// getLength(null); // Error: Argument of type 'null' is not assignable

// Must explicitly allow null
function getLength2(s: string | null) {
  return s?.length; // OK with optional chaining
}

// 3. strictFunctionTypes - Contravariant function parameters
interface Animal { name: string; }
interface Dog extends Animal { breed: string; }

let f1: (x: Animal) => void = (x: Dog) => {}; // Error in strict mode

// 4. strictPropertyInitialization - Properties must be initialized
class User {
  name: string; // Error: Property 'name' has no initializer
  
  // Solutions:
  age!: number; // Definite assignment assertion
  email: string = ""; // Initialize in declaration
  address: string; // Initialize in constructor
  
  constructor() {
    this.address = "";
  }
}

// 5. noImplicitThis - 'this' must have explicit type
const obj = {
  value: 10,
  getValue() {
    return this.value;
  },
  getValueLater() {
    setTimeout(function() {
      return this.value; // Error: 'this' implicitly has type 'any'
    }, 1000);
  }
};
```

---

## Best Practices

### 27. What are some TypeScript best practices?

**Answer:**

```typescript
// 1. Enable strict mode
// tsconfig.json: "strict": true

// 2. Use explicit types for function returns
function calculateTotal(items: number[]): number {
  return items.reduce((sum, item) => sum + item, 0);
}

// 3. Prefer interfaces for object shapes
interface User {
  id: number;
  name: string;
  email: string;
}

// 4. Use union types instead of enums when possible
type Status = "pending" | "active" | "inactive";

// 5. Avoid 'any' - use 'unknown' for truly unknown types
function processValue(value: unknown): void {
  if (typeof value === "string") {
    console.log(value.toUpperCase());
  }
}

// 6. Use const assertions for literal types
const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000
} as const;
// Type: { readonly apiUrl: "https://api.example.com"; readonly timeout: 5000; }

// 7. Use optional chaining and nullish coalescing
const userName = user?.profile?.name ?? "Guest";

// 8. Create utility types for reusability
type Nullable<T> = T | null;
type AsyncReturn<T> = Promise<T>;

// 9. Use discriminated unions for complex state
type LoadingState =
  | { status: "loading" }
  | { status: "success"; data: string }
  | { status: "error"; error: Error };

function handleState(state: LoadingState) {
  switch (state.status) {
    case "loading":
      return "Loading...";
    case "success":
      return state.data;
    case "error":
      return state.error.message;
  }
}

// 10. Use branded types for type safety
type UserId = string & { readonly brand: unique symbol };
type ProductId = string & { readonly brand: unique symbol };

function createUserId(id: string): UserId {
  return id as UserId;
}

function getUser(id: UserId): void {
  console.log(`Getting user: ${id}`);
}

const userId = createUserId("user-123");
getUser(userId); // OK
// getUser("user-456"); // Error: string is not assignable to UserId
```

### 28. How do you handle errors with TypeScript?

**Answer:**

```typescript
// 1. Custom Error Classes
class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = "ValidationError";
  }
}

class NetworkError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = "NetworkError";
  }
}

// 2. Result Type Pattern
type Result<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E };

function divide(a: number, b: number): Result<number> {
  if (b === 0) {
    return { success: false, error: new Error("Division by zero") };
  }
  return { success: true, value: a / b };
}

const result = divide(10, 2);
if (result.success) {
  console.log(result.value); // Type: number
} else {
  console.error(result.error); // Type: Error
}

// 3. Either Type Pattern
type Either<L, R> = Left<L> | Right<R>;

interface Left<L> {
  readonly _tag: "Left";
  readonly left: L;
}

interface Right<R> {
  readonly _tag: "Right";
  readonly right: R;
}

const left = <L>(l: L): Either<L, never> => ({
  _tag: "Left",
  left: l
});

const right = <R>(r: R): Either<never, R> => ({
  _tag: "Right",
  right: r
});

function parseJSON(text: string): Either<Error, unknown> {
  try {
    return right(JSON.parse(text));
  } catch (error) {
    return left(new Error("Invalid JSON"));
  }
}

// 4. Try-Catch with Type Guards
function isError(error: unknown): error is Error {
  return error instanceof Error;
}

async function fetchData(url: string): Promise<Result<any>> {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return { success: true, value: data };
  } catch (error) {
    if (isError(error)) {
      return { success: false, error };
    }
    return { success: false, error: new Error("Unknown error") };
  }
}
```

---

## Practical Scenarios

### 29. How do you handle asynchronous operations with TypeScript?

**Answer:**
TypeScript provides excellent support for async operations with proper type safety.

**1. Basic Promises with Type Annotations:**

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

function fetchUser(id: number): Promise<User> {
  return fetch(`/api/users/${id}`)
    .then(response => response.json())
    .then(data => data as User);
}

// Using the promise
fetchUser(1)
  .then((user: User) => console.log(user.name))
  .catch((error: Error) => console.error(error.message));
```

**2. Async/Await (Recommended):**

```typescript
async function getUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  const user: User = await response.json();
  return user;
}

async function displayUser() {
  try {
    const user = await getUser(1);
    console.log(user.name); // TypeScript knows user is User
  } catch (error) {
    console.error('Failed to fetch user:', error);
  }
}
```

**3. Generic Async Functions:**

```typescript
async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json() as T;
}

// Usage with type inference
interface Product {
  id: number;
  name: string;
  price: number;
}

const product = await fetchData<Product>('/api/products/1');
const products = await fetchData<Product[]>('/api/products');
```

**4. Result Type Pattern (Type-Safe Error Handling):**

```typescript
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

async function safeFetchUser(id: number): Promise<Result<User>> {
  try {
    const response = await fetch(`/api/users/${id}`);
    
    if (!response.ok) {
      return {
        success: false,
        error: new Error(`HTTP ${response.status}`)
      };
    }

    const user = await response.json();
    return { success: true, data: user };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

// Usage - forces error checking
async function displayUserSafely(id: number) {
  const result = await safeFetchUser(id);
  
  if (result.success) {
    console.log(result.data.name); // TypeScript knows data exists
  } else {
    console.error(result.error.message); // TypeScript knows error exists
  }
}
```

**5. Promise.all with TypeScript:**

```typescript
async function fetchUserAndPosts(userId: number) {
  const [user, posts] = await Promise.all([
    fetchData<User>(`/api/users/${userId}`),
    fetchData<Post[]>(`/api/posts?userId=${userId}`)
  ]);

  // TypeScript infers: user is User, posts is Post[]
  return { user, posts };
}
```

**6. Error Handling with Type Guards:**

```typescript
class NetworkError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = 'NetworkError';
  }
}

function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}

async function saveUser(user: User): Promise<void> {
  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new NetworkError('Failed to save user', response.status);
    }
  } catch (error) {
    if (isNetworkError(error)) {
      console.error(`Network error (${error.statusCode}): ${error.message}`);
    } else {
      console.error('Unknown error:', error);
    }
    throw error;
  }
}
```

**7. Async State Management:**

```typescript
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

class AsyncDataManager<T> {
  private state: AsyncState<T> = { status: 'idle' };

  async execute(fn: () => Promise<T>): Promise<void> {
    this.state = { status: 'loading' };

    try {
      const data = await fn();
      this.state = { status: 'success', data };
    } catch (error) {
      this.state = {
        status: 'error',
        error: error instanceof Error ? error : new Error('Unknown error')
      };
    }
  }

  getState(): AsyncState<T> {
    return this.state;
  }
}
```

**Best Practices:**
- Always specify return types for async functions
- Use `async/await` instead of raw promises for readability
- Handle errors explicitly with try/catch or Result types
- Use type guards for specific error handling
- Avoid `any` - use `unknown` for caught errors
- Use generics for reusable async functions

### 30. How do you type a function that accepts variable arguments?

**Answer:**

```typescript
// 1. Rest parameters with typed array
function sum(...numbers: number[]): number {
  return numbers.reduce((acc, num) => acc + num, 0);
}

sum(1, 2, 3, 4); // OK
// sum(1, "2", 3); // Error

// 2. Function overloads
function createElement(tag: "div"): HTMLDivElement;
function createElement(tag: "span"): HTMLSpanElement;
function createElement(tag: "input"): HTMLInputElement;
function createElement(tag: string): HTMLElement {
  return document.createElement(tag);
}

const div = createElement("div"); // Type: HTMLDivElement

// 3. Generic rest parameters
function concat<T>(...arrays: T[][]): T[] {
  return arrays.flat();
}

const result = concat([1, 2], [3, 4], [5, 6]); // Type: number[]

// 4. Mixed parameter types
function format(template: string, ...values: (string | number)[]): string {
  return values.reduce(
    (str, val, i) => str.replace(`{${i}}`, String(val)),
    template
  );
}

format("Hello {0}, you are {1} years old", "Alice", 30);
```

### 31. How do you type React components in TypeScript?

**Answer:**

```typescript
import React, { useState, useEffect, ReactNode } from "react";

// 1. Function component with props
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false,
  variant = "primary"
}) => {
  return (
    <button onClick={onClick} disabled={disabled} className={variant}>
      {label}
    </button>
  );
};

// 2. Component with children
interface CardProps {
  title: string;
  children: ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children }) => {
  return (
    <div className="card">
      <h2>{title}</h2>
      {children}
    </div>
  );
};

// 3. Generic component
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return <ul>{items.map((item, i) => <li key={i}>{renderItem(item)}</li>)}</ul>;
}

// Usage
<List items={[1, 2, 3]} renderItem={(num) => <span>{num}</span>} />;

// 4. Hooks with TypeScript
interface User {
  id: number;
  name: string;
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/user")
      .then((res) => res.json())
      .then((data: User) => {
        setUser(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>No user found</div>;

  return <div>{user.name}</div>;
};

// 5. Event handlers
const Form: React.FC = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleChange} />
    </form>
  );
};
```

### 32. How do you create a type-safe API client?

**Answer:**

```typescript
// Define API response types
interface User {
  id: number;
  name: string;
  email: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  userId: number;
}

// API endpoints configuration
type ApiEndpoints = {
  "/users": {
    GET: { response: User[] };
    POST: { body: Omit<User, "id">; response: User };
  };
  "/users/:id": {
    GET: { response: User };
    PUT: { body: Partial<User>; response: User };
    DELETE: { response: void };
  };
  "/posts": {
    GET: { response: Post[] };
    POST: { body: Omit<Post, "id">; response: Post };
  };
};

// Type-safe API client
class ApiClient {
  constructor(private baseUrl: string) {}

  async get<T extends keyof ApiEndpoints>(
    endpoint: T
  ): Promise<ApiEndpoints[T]["GET"]["response"]> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    return response.json();
  }

  async post<T extends keyof ApiEndpoints>(
    endpoint: T,
    body: ApiEndpoints[T]["POST"]["body"]
  ): Promise<ApiEndpoints[T]["POST"]["response"]> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    return response.json();
  }

  async put<T extends keyof ApiEndpoints>(
    endpoint: T,
    body: ApiEndpoints[T]["PUT"]["body"]
  ): Promise<ApiEndpoints[T]["PUT"]["response"]> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    return response.json();
  }

  async delete<T extends keyof ApiEndpoints>(
    endpoint: T
  ): Promise<ApiEndpoints[T]["DELETE"]["response"]> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "DELETE"
    });
    return response.json();
  }
}

// Usage with full type safety
const api = new ApiClient("https://api.example.com");

// GET request
const users = await api.get("/users"); // Type: User[]

// POST request
const newUser = await api.post("/users", {
  name: "John Doe",
  email: "john@example.com"
}); // Type: User

// PUT request (with path parameters handling)
// const updatedUser = await api.put("/users/:id", { name: "Jane Doe" });
```

---

## Additional Resources

- [TypeScript Official Documentation](https://www.typescriptlang.org/docs/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Effective TypeScript Book](https://effectivetypescript.com/)

## Examples

Check out the `examples/` directory for practical TypeScript code samples demonstrating these concepts.

