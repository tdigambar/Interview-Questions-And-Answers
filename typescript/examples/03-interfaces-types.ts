/**
 * Interfaces and Type Aliases
 * Demonstrates the differences and use cases for interfaces and types
 */

// Basic Interface
interface User {
  id: number;
  name: string;
  email: string;
  age?: number; // Optional property
  readonly createdAt: Date; // Readonly property
}

const user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  createdAt: new Date()
};

// user.createdAt = new Date(); // Error: Cannot assign to 'createdAt' because it is a read-only property

// Interface with Methods
interface Calculator {
  add(a: number, b: number): number;
  subtract(a: number, b: number): number;
}

const calculator: Calculator = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
};

// Interface Extending
interface Person {
  name: string;
  age: number;
}

interface Employee extends Person {
  employeeId: number;
  department: string;
}

const employee: Employee = {
  name: "Bob",
  age: 30,
  employeeId: 12345,
  department: "Engineering"
};

// Multiple Interface Inheritance
interface Printable {
  print(): void;
}

interface Serializable {
  serialize(): string;
}

interface Document extends Printable, Serializable {
  title: string;
}

const doc: Document = {
  title: "My Document",
  print() {
    console.log(this.title);
  },
  serialize() {
    return JSON.stringify(this);
  }
};

// Declaration Merging (Only with Interfaces)
interface Animal {
  name: string;
}

interface Animal {
  species: string;
}

// Merged: { name: string; species: string; }
const animal: Animal = {
  name: "Lion",
  species: "Panthera leo"
};

// Type Aliases
type UserType = {
  id: number;
  name: string;
  email: string;
};

// Type Aliases for Primitives
type ID = string | number;
type Status = "pending" | "approved" | "rejected";

// Type Aliases for Functions
type MathOperation = (a: number, b: number) => number;

const multiply: MathOperation = (a, b) => a * b;

// Type Aliases for Tuples
type Point = [number, number];
type RGBColor = [number, number, number];

const point: Point = [10, 20];
const color: RGBColor = [255, 0, 128];

// Union Types with Type Aliases
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };

function fetchUser(id: number): Result<User> {
  if (id > 0) {
    return {
      success: true,
      data: {
        id,
        name: "Alice",
        email: "alice@example.com",
        createdAt: new Date()
      }
    };
  }
  return { success: false, error: "Invalid user ID" };
}

// Intersection Types
type Point2D = { x: number; y: number };
type Labeled = { label: string };
type LabeledPoint = Point2D & Labeled;

const labeledPoint: LabeledPoint = {
  x: 10,
  y: 20,
  label: "Origin"
};

// Type Intersection with Interfaces
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
  credit: 5000,
  email: "john@example.com",
  phone: "555-1234"
};

// Index Signatures
interface StringMap {
  [key: string]: string;
}

const config: StringMap = {
  apiUrl: "https://api.example.com",
  timeout: "5000" // Must be string
};

// Numeric Index Signature
interface NumberMap {
  [index: number]: string;
}

const items: NumberMap = {
  0: "first",
  1: "second",
  2: "third"
};

// Mixed Index Signatures
interface Dictionary {
  [key: string]: any;
  count: number; // Explicit property
}

const dict: Dictionary = {
  count: 3,
  name: "Alice",
  age: 30
};

// Mapped Types
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};

type ReadonlyUser = Readonly<User>;
type PartialUser = Partial<User>;

// Custom Mapped Type
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

type NullableUser = Nullable<User>;

// Conditional Types with Type Aliases
type NonNullable<T> = T extends null | undefined ? never : T;

type Example1 = NonNullable<string | null>; // string
type Example2 = NonNullable<number | undefined>; // number

// Extract and Exclude
type Status2 = "pending" | "approved" | "rejected" | "cancelled";

type ActiveStatus = Exclude<Status2, "cancelled" | "rejected">; // "pending" | "approved"
type EndStatus = Extract<Status2, "approved" | "rejected">; // "approved" | "rejected"

// Pick and Omit
interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
}

type TodoPreview = Pick<Todo, "id" | "title" | "completed">;
type TodoCreate = Omit<Todo, "id" | "createdAt">;

// Record Type
type UserRole = "admin" | "user" | "guest";

const permissions: Record<UserRole, string[]> = {
  admin: ["read", "write", "delete"],
  user: ["read", "write"],
  guest: ["read"]
};

// Interface vs Type - When to Use What

// Use Interface for:
// 1. Object shapes that might be extended
interface BaseConfig {
  apiUrl: string;
}

interface AppConfig extends BaseConfig {
  timeout: number;
}

// 2. Declaration merging
interface Plugin {
  name: string;
}

interface Plugin {
  version: string;
}

// 3. Implementing in classes
interface IShape {
  area(): number;
  perimeter(): number;
}

class Circle implements IShape {
  constructor(private radius: number) {}

  area(): number {
    return Math.PI * this.radius ** 2;
  }

  perimeter(): number {
    return 2 * Math.PI * this.radius;
  }
}

// Use Type for:
// 1. Union types
type StringOrNumber = string | number;

// 2. Tuple types
type Coordinates = [number, number, number];

// 3. Function types
type Predicate<T> = (value: T) => boolean;

// 4. Mapped types
type Optional<T> = {
  [P in keyof T]?: T[P];
};

// 5. Conditional types
type TypeName<T> = T extends string
  ? "string"
  : T extends number
  ? "number"
  : T extends boolean
  ? "boolean"
  : "object";

// Extending Types
type PersonType = {
  name: string;
  age: number;
};

type EmployeeType = PersonType & {
  employeeId: number;
};

export {};

