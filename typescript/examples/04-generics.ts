/**
 * Generics in TypeScript
 * Demonstrates generic types, functions, classes, and constraints
 */

// Basic Generic Function
function identity<T>(arg: T): T {
  return arg;
}

const num = identity<number>(42);
const str = identity<string>("hello");
const auto = identity(true); // Type inferred

// Generic Function with Array
function getFirstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

const first = getFirstElement([1, 2, 3]); // number | undefined
const firstStr = getFirstElement(["a", "b"]); // string | undefined

// Multiple Type Parameters
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const result = pair("age", 30); // [string, number]
const coords = pair(10, 20); // [number, number]

// Generic Constraints
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(`Length: ${arg.length}`);
  return arg;
}

logLength("hello"); // OK
logLength([1, 2, 3]); // OK
logLength({ length: 10, value: "test" }); // OK
// logLength(42); // Error: number doesn't have length property

// Using Type Parameters in Constraints
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person = { name: "Alice", age: 30, city: "NYC" };
const name = getProperty(person, "name"); // string
const age = getProperty(person, "age"); // number
// const invalid = getProperty(person, "invalid"); // Error

// Generic Interfaces
interface Box<T> {
  value: T;
  getValue(): T;
  setValue(value: T): void;
}

const numberBox: Box<number> = {
  value: 42,
  getValue() {
    return this.value;
  },
  setValue(value: number) {
    this.value = value;
  }
};

// Generic Type Aliases
type Container<T> = {
  value: T;
  map<U>(fn: (value: T) => U): Container<U>;
};

// Generic Classes
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
console.log(myGenericString.add("Hello ", "World")); // "Hello World"

// Generic Data Structures

// Stack Implementation
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

  size(): number {
    return this.items.length;
  }

  clear(): void {
    this.items = [];
  }
}

const numberStack = new Stack<number>();
numberStack.push(1);
numberStack.push(2);
console.log(numberStack.pop()); // 2

// Queue Implementation
class Queue<T> {
  private items: T[] = [];

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  peek(): T | undefined {
    return this.items[0];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }
}

const stringQueue = new Queue<string>();
stringQueue.enqueue("first");
stringQueue.enqueue("second");
console.log(stringQueue.dequeue()); // "first"

// LinkedList Implementation
class LinkedListNode<T> {
  constructor(public data: T, public next: LinkedListNode<T> | null = null) {}
}

class LinkedList<T> {
  private head: LinkedListNode<T> | null = null;
  private tail: LinkedListNode<T> | null = null;
  private length: number = 0;

  append(data: T): void {
    const newNode = new LinkedListNode(data);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail!.next = newNode;
      this.tail = newNode;
    }

    this.length++;
  }

  prepend(data: T): void {
    const newNode = new LinkedListNode(data, this.head);
    this.head = newNode;

    if (!this.tail) {
      this.tail = newNode;
    }

    this.length++;
  }

  find(predicate: (data: T) => boolean): T | null {
    let current = this.head;

    while (current) {
      if (predicate(current.data)) {
        return current.data;
      }
      current = current.next;
    }

    return null;
  }

  toArray(): T[] {
    const result: T[] = [];
    let current = this.head;

    while (current) {
      result.push(current.data);
      current = current.next;
    }

    return result;
  }

  getLength(): number {
    return this.length;
  }
}

// Generic Promise Wrapper
class AsyncResult<T, E = Error> {
  constructor(
    private promise: Promise<T>,
    private errorHandler?: (error: any) => E
  ) {}

  async execute(): Promise<
    { success: true; data: T } | { success: false; error: E }
  > {
    try {
      const data = await this.promise;
      return { success: true, data };
    } catch (error) {
      const handledError = this.errorHandler
        ? this.errorHandler(error)
        : (error as E);
      return { success: false, error: handledError };
    }
  }
}

// Generic Mapped Types
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};

type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

interface User {
  name: string;
  age: number;
  email: string;
}

type ReadonlyUser = Readonly<User>;
type PartialUser = Partial<User>;
type NullableUser = Nullable<User>;

// Generic Utility Functions
function map<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn);
}

function filter<T>(arr: T[], predicate: (item: T) => boolean): T[] {
  return arr.filter(predicate);
}

function reduce<T, U>(arr: T[], fn: (acc: U, item: T) => U, initial: U): U {
  return arr.reduce(fn, initial);
}

// Generic API Response Type
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

async function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  const response = await fetch(url);
  const data = await response.json();

  return {
    data,
    status: response.status,
    message: response.statusText
  };
}

// Generic Builder Pattern
class QueryBuilder<T> {
  private filters: Array<(item: T) => boolean> = [];
  private sortFn?: (a: T, b: T) => number;
  private limitValue?: number;

  where(predicate: (item: T) => boolean): this {
    this.filters.push(predicate);
    return this;
  }

  orderBy(compareFn: (a: T, b: T) => number): this {
    this.sortFn = compareFn;
    return this;
  }

  limit(count: number): this {
    this.limitValue = count;
    return this;
  }

  execute(data: T[]): T[] {
    let result = data;

    // Apply filters
    for (const filter of this.filters) {
      result = result.filter(filter);
    }

    // Apply sorting
    if (this.sortFn) {
      result = result.sort(this.sortFn);
    }

    // Apply limit
    if (this.limitValue !== undefined) {
      result = result.slice(0, this.limitValue);
    }

    return result;
  }
}

// Usage
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

const products: Product[] = [
  { id: 1, name: "Laptop", price: 1000, category: "Electronics" },
  { id: 2, name: "Phone", price: 500, category: "Electronics" },
  { id: 3, name: "Desk", price: 300, category: "Furniture" }
];

const query = new QueryBuilder<Product>()
  .where((p) => p.category === "Electronics")
  .where((p) => p.price < 800)
  .orderBy((a, b) => a.price - b.price)
  .limit(10);

const results = query.execute(products);

// Generic Default Parameters
interface Dictionary<K extends string | number = string, V = any> {
  [key: string]: V;
}

const stringDict: Dictionary = { name: "Alice", age: 30 };
const numberDict: Dictionary<string, number> = { count: 42, total: 100 };

// Conditional Types with Generics
type Unpromise<T> = T extends Promise<infer U> ? U : T;

type Example1 = Unpromise<Promise<string>>; // string
type Example2 = Unpromise<number>; // number

// Recursive Generic Types
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

export {};

