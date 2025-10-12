/**
 * Basic Types in TypeScript
 * Demonstrates fundamental type annotations and type inference
 */

// Primitive Types
const isActive: boolean = true;
const count: number = 42;
const username: string = "Alice";
const notDefined: undefined = undefined;
const notPresent: null = null;

// Array Types
const numbers: number[] = [1, 2, 3, 4, 5];
const names: Array<string> = ["Alice", "Bob", "Charlie"];

// Tuple Types - fixed length arrays with known types
const person: [string, number] = ["Alice", 30];
const rgb: [number, number, number] = [255, 0, 128];

// Tuple with optional and rest elements
type StringNumberBooleans = [string, number, ...boolean[]];
const example: StringNumberBooleans = ["hello", 42, true, false, true];

// Enum Types
enum Color {
  Red,
  Green,
  Blue
}

enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT"
}

const favoriteColor: Color = Color.Blue;
const moveDirection: Direction = Direction.Up;

// Any Type - avoid when possible
let dynamicValue: any = 42;
dynamicValue = "now a string";
dynamicValue = { key: "value" };

// Unknown Type - safer than any
let unknownValue: unknown = 42;

if (typeof unknownValue === "string") {
  console.log(unknownValue.toUpperCase());
} else if (typeof unknownValue === "number") {
  console.log(unknownValue.toFixed(2));
}

// Void Type - typically for functions that don't return
function logMessage(message: string): void {
  console.log(message);
}

// Never Type - for functions that never return
function throwError(message: string): never {
  throw new Error(message);
}

function infiniteLoop(): never {
  while (true) {
    // This function never returns
  }
}

// Object Type
const user: object = {
  name: "Alice",
  age: 30
};

// Better object typing with interface
interface User {
  name: string;
  age: number;
  email?: string; // Optional property
}

const betterUser: User = {
  name: "Bob",
  age: 25,
  email: "bob@example.com"
};

// Type Inference
let inferredNumber = 42; // Type: number
let inferredString = "hello"; // Type: string
let inferredArray = [1, 2, 3]; // Type: number[]
let inferredMixed = [1, "two", 3]; // Type: (string | number)[]

// Function with inferred return type
function add(a: number, b: number) {
  return a + b; // Return type inferred as number
}

// Literal Types
let direction: "left" | "right" | "up" | "down";
direction = "left"; // OK
// direction = "diagonal"; // Error

const constantValue = "hello" as const; // Type: "hello" not string

// Union Types
function printId(id: number | string) {
  console.log(`ID: ${id}`);
}

printId(101);
printId("ABC123");

// Type Aliases
type ID = number | string;
type Status = "pending" | "approved" | "rejected";

function processOrder(orderId: ID, status: Status) {
  console.log(`Processing order ${orderId} with status ${status}`);
}

// Intersection Types
type Point = { x: number; y: number };
type Labeled = { label: string };
type LabeledPoint = Point & Labeled;

const labeledPoint: LabeledPoint = {
  x: 10,
  y: 20,
  label: "Origin"
};

export {};

