/**
 * Functions in TypeScript
 * Demonstrates function types, signatures, and overloads
 */

// Basic Function Types
function add(a: number, b: number): number {
  return a + b;
}

const subtract = (a: number, b: number): number => {
  return a - b;
};

// Optional Parameters
function greet(name: string, greeting?: string): string {
  return greeting ? `${greeting}, ${name}!` : `Hello, ${name}!`;
}

console.log(greet("Alice"));
console.log(greet("Bob", "Good morning"));

// Default Parameters
function createUser(name: string, age: number = 18, role: string = "user") {
  return { name, age, role };
}

// Rest Parameters
function sum(...numbers: number[]): number {
  return numbers.reduce((acc, num) => acc + num, 0);
}

console.log(sum(1, 2, 3, 4, 5)); // 15

// Function Type Expressions
type MathOperation = (a: number, b: number) => number;

const multiply: MathOperation = (a, b) => a * b;
const divide: MathOperation = (a, b) => a / b;

// Call Signatures
interface Calculator {
  (a: number, b: number): number;
  description: string;
}

const calculator: Calculator = ((a: number, b: number) => a + b) as Calculator;
calculator.description = "Simple addition calculator";

// Function Overloads
function createElement(tag: "div"): HTMLDivElement;
function createElement(tag: "span"): HTMLSpanElement;
function createElement(tag: "input"): HTMLInputElement;
function createElement(tag: string): HTMLElement;
function createElement(tag: string): HTMLElement {
  return document.createElement(tag);
}

const div = createElement("div"); // Type: HTMLDivElement
const span = createElement("span"); // Type: HTMLSpanElement

// Generic Functions
function identity<T>(arg: T): T {
  return arg;
}

const num = identity(42); // Type: number
const str = identity("hello"); // Type: string

function getFirstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

const firstNumber = getFirstElement([1, 2, 3]); // Type: number | undefined
const firstName = getFirstElement(["a", "b", "c"]); // Type: string | undefined

// Generic Constraints
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

logLength("hello"); // OK - string has length
logLength([1, 2, 3]); // OK - array has length
logLength({ length: 10, value: "test" }); // OK - object has length
// logLength(42); // Error - number doesn't have length

// Using keyof in Generic Functions
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person = { name: "Alice", age: 30, city: "NYC" };
const name = getProperty(person, "name"); // Type: string
const age = getProperty(person, "age"); // Type: number

// Async Functions
async function fetchUser(id: number): Promise<{ id: number; name: string }> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

// Async function with error handling
async function getData(url: string): Promise<any> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

// Type Guards
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function processValue(value: string | number) {
  if (isString(value)) {
    console.log(value.toUpperCase());
  } else {
    console.log(value.toFixed(2));
  }
}

// Callback Functions
type Callback<T> = (result: T) => void;

function fetchData<T>(url: string, callback: Callback<T>): void {
  fetch(url)
    .then((response) => response.json())
    .then((data) => callback(data));
}

// Higher-Order Functions
function createMultiplier(factor: number): (num: number) => number {
  return (num: number) => num * factor;
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15

// Function with This Parameter
interface Database {
  query(sql: string): void;
}

function executeQuery(this: Database, sql: string) {
  this.query(sql);
}

// Void vs Undefined
function logVoid(message: string): void {
  console.log(message);
  // Can optionally return undefined or nothing
}

function returnUndefined(message: string): undefined {
  console.log(message);
  return undefined; // Must explicitly return undefined
}

// Never Return Type
function fail(message: string): never {
  throw new Error(message);
}

function infiniteLoop(): never {
  while (true) {
    console.log("Running forever");
  }
}

// Function Type Predicates
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

// Currying
function curry<A, B, C>(fn: (a: A, b: B) => C): (a: A) => (b: B) => C {
  return (a: A) => (b: B) => fn(a, b);
}

const curriedAdd = curry((a: number, b: number) => a + b);
const add5 = curriedAdd(5);
console.log(add5(3)); // 8

export {};

