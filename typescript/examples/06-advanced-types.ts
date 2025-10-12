/**
 * Advanced Types in TypeScript
 * Demonstrates mapped types, conditional types, and utility types
 */

// Mapped Types
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};

type Required<T> = {
  [P in keyof T]-?: T[P];
};

interface User {
  name: string;
  age: number;
  email?: string;
}

type ReadonlyUser = Readonly<User>;
type PartialUser = Partial<User>;
type RequiredUser = Required<User>;

// Custom Mapped Types
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

type Stringify<T> = {
  [P in keyof T]: string;
};

type NullableUser = Nullable<User>;
// { name: string | null; age: number | null; email?: string | null; }

// Conditional Types
type NonNullable<T> = T extends null | undefined ? never : T;

type Example1 = NonNullable<string | null>; // string
type Example2 = NonNullable<number | undefined>; // number

// Distributive Conditional Types
type ToArray<T> = T extends any ? T[] : never;
type StrOrNumArray = ToArray<string | number>; // string[] | number[]

// Infer Keyword
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

function getUser() {
  return { name: "Alice", age: 30 };
}

type UserType = ReturnType<typeof getUser>; // { name: string; age: number; }

// Extract Parameters
type Parameters<T> = T extends (...args: infer P) => any ? P : never;

function createUser(name: string, age: number, email: string) {
  return { name, age, email };
}

type CreateUserParams = Parameters<typeof createUser>; // [string, number, string]

// Awaited Type
type Awaited<T> = T extends Promise<infer U> ? U : T;

type AsyncUser = Promise<User>;
type SyncUser = Awaited<AsyncUser>; // User

// Template Literal Types
type World = "world";
type Greeting = `hello ${World}`; // "hello world"

type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";
type Endpoint = "users" | "posts";
type APIRoute = `/${Endpoint}`;
type HTTPRequest = `${HTTPMethod} ${APIRoute}`;

// Uppercase, Lowercase, Capitalize, Uncapitalize
type UppercaseGreeting = Uppercase<"hello">; // "HELLO"
type LowercaseGreeting = Lowercase<"HELLO">; // "hello"
type CapitalizedGreeting = Capitalize<"hello">; // "Hello"
type UncapitalizedGreeting = Uncapitalize<"Hello">; // "hello"

// Property Event Source Pattern
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

// Recursive Type Aliases
type NestedArray<T> = T | NestedArray<T>[];

const nested: NestedArray<number> = [1, [2, [3, [4, 5]]]];

// Deep Readonly
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

interface NestedObject {
  name: string;
  details: {
    age: number;
    address: {
      city: string;
      country: string;
    };
  };
}

type ReadonlyNested = DeepReadonly<NestedObject>;

// Utility Types

// Pick and Omit
interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type TodoPreview = Pick<Todo, "id" | "title" | "completed">;
type TodoCreate = Omit<Todo, "id" | "createdAt" | "updatedAt">;

// Record Type
type UserRole = "admin" | "user" | "guest";

const permissions: Record<UserRole, string[]> = {
  admin: ["read", "write", "delete"],
  user: ["read", "write"],
  guest: ["read"]
};

type PageInfo = Record<string, { title: string; url: string }>;

const pages: PageInfo = {
  home: { title: "Home", url: "/" },
  about: { title: "About", url: "/about" }
};

// Extract and Exclude
type Status = "pending" | "approved" | "rejected" | "cancelled";

type ActiveStatus = Exclude<Status, "cancelled" | "rejected">; // "pending" | "approved"
type EndStatus = Extract<Status, "approved" | "rejected">; // "approved" | "rejected"

// NonNullable
type NullableString = string | null | undefined;
type NonNullString = NonNullable<NullableString>; // string

// InstanceType
class MyClass {
  constructor(public value: number) {}
}

type MyInstance = InstanceType<typeof MyClass>; // MyClass

// ThisParameterType and OmitThisParameter
function toHex(this: Number) {
  return this.toString(16);
}

type ToHexThisType = ThisParameterType<typeof toHex>; // Number

// Branded Types
type Brand<K, T> = K & { __brand: T };

type UserId = Brand<string, "UserId">;
type ProductId = Brand<string, "ProductId">;

function createUserId(id: string): UserId {
  return id as UserId;
}

function getUser(id: UserId) {
  console.log(`Getting user: ${id}`);
}

const userId = createUserId("user-123");
getUser(userId); // OK
// getUser("user-456"); // Error

// Discriminated Unions
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number }
  | { kind: "triangle"; base: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
    case "triangle":
      return (shape.base * shape.height) / 2;
  }
}

// Result Type Pattern
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

function divide(a: number, b: number): Result<number> {
  if (b === 0) {
    return { success: false, error: new Error("Division by zero") };
  }
  return { success: true, data: a / b };
}

const result = divide(10, 2);
if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error);
}

// Option Type Pattern
type Option<T> = Some<T> | None;

interface Some<T> {
  _tag: "Some";
  value: T;
}

interface None {
  _tag: "None";
}

function some<T>(value: T): Option<T> {
  return { _tag: "Some", value };
}

function none(): Option<never> {
  return { _tag: "None" };
}

function map<T, U>(option: Option<T>, fn: (value: T) => U): Option<U> {
  return option._tag === "Some" ? some(fn(option.value)) : none();
}

// Index Signature with Mapped Types
type DynamicObject = {
  [key: string]: any;
  id: number; // Known property
  name: string; // Known property
};

// Const Assertions
const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retries: 3
} as const;

// Type: { readonly apiUrl: "https://api.example.com"; readonly timeout: 5000; readonly retries: 3; }

// Tuple with Named Elements
type Point = [x: number, y: number];
type RGBColor = [red: number, green: number, blue: number];

function createPoint(x: number, y: number): Point {
  return [x, y];
}

// Variadic Tuple Types
type Tuple1 = [string, number];
type Tuple2 = [boolean, ...Tuple1]; // [boolean, string, number]

function concat<T extends any[], U extends any[]>(
  arr1: T,
  arr2: U
): [...T, ...U] {
  return [...arr1, ...arr2];
}

const result1 = concat([1, 2], ["a", "b"]); // [number, number, string, string]

// Type Predicates
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

function processValue(value: string | number) {
  if (isString(value)) {
    console.log(value.toUpperCase());
  } else {
    console.log(value.toFixed(2));
  }
}

// Assertion Functions
function assert(condition: any, msg?: string): asserts condition {
  if (!condition) {
    throw new Error(msg);
  }
}

function assertIsString(value: any): asserts value is string {
  if (typeof value !== "string") {
    throw new Error("Value must be a string");
  }
}

function example(value: unknown) {
  assertIsString(value);
  // value is now narrowed to string
  console.log(value.toUpperCase());
}

// Key Remapping in Mapped Types
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

interface Person {
  name: string;
  age: number;
  location: string;
}

type PersonGetters = Getters<Person>;
// { getName: () => string; getAge: () => number; getLocation: () => string; }

// Filtering Properties
type RemoveKindField<T> = {
  [K in keyof T as Exclude<K, "kind">]: T[K];
};

interface Product {
  kind: string;
  name: string;
  price: number;
}

type ProductWithoutKind = RemoveKindField<Product>;
// { name: string; price: number; }

// Conditional Type Constraints
type Flatten<T> = T extends Array<infer U> ? U : T;

type Str = Flatten<string[]>; // string
type Num = Flatten<number>; // number

// Multiple Conditional Types
type TypeName<T> = T extends string
  ? "string"
  : T extends number
  ? "number"
  : T extends boolean
  ? "boolean"
  : T extends undefined
  ? "undefined"
  : T extends Function
  ? "function"
  : "object";

type T0 = TypeName<string>; // "string"
type T1 = TypeName<42>; // "number"
type T2 = TypeName<true>; // "boolean"

export {};

