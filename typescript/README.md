# TypeScript Interview Questions and Answers

Quick reference guide for TypeScript interview preparation.

---

## Basic Level

### 1. What is TypeScript and why use it?

**Answer:** TypeScript is a statically typed superset of JavaScript developed by Microsoft. It adds optional static typing, interfaces, and other features to JavaScript.

**Benefits:**
- Catches errors at compile-time rather than runtime
- Better IDE support with autocomplete and IntelliSense
- Improved code maintainability and readability
- Enhanced refactoring capabilities
- Better documentation through type annotations

---

### 2. What are the basic types in TypeScript?

**Answer:** TypeScript includes several basic types:

- `string` - text values
- `number` - numeric values (integers and floats)
- `boolean` - true/false
- `array` - collections (e.g., `number[]` or `Array<number>`)
- `tuple` - fixed-length arrays with specific types
- `enum` - named constants
- `any` - any type (opts out of type checking)
- `void` - absence of a value (typically for functions)
- `null` and `undefined`
- `never` - values that never occur
- `object` - non-primitive types

---

### 3. What is the difference between interface and type?

**Answer:** Both can define object shapes, but have key differences:

**Interface:**
```typescript
interface User {
  name: string;
  age: number;
}

// Can be extended
interface Admin extends User {
  role: string;
}
```

**Type:**
```typescript
type User = {
  name: string;
  age: number;
}

// Uses intersection
type Admin = User & {
  role: string;
}
```

**Key differences:**
- Interfaces can be merged (declaration merging), types cannot
- Types can represent primitives, unions, tuples; interfaces are for objects
- Interfaces can be extended/implemented by classes more naturally
- Types are more flexible for complex type operations

---

## Intermediate Level

### 4. What are Generics and why are they useful?

**Answer:** Generics allow you to write reusable code that works with multiple types while maintaining type safety.

```typescript
function identity<T>(arg: T): T {
  return arg;
}

// Usage
const num = identity<number>(42);
const str = identity<string>("hello");

// Generic interface
interface Box<T> {
  value: T;
}

const numberBox: Box<number> = { value: 123 };
```

**Benefits:** Type safety, reusability, and flexibility without sacrificing type checking.

---

### 5. Explain union and intersection types

**Answer:**

**Union types (OR - can be one type or another):**
```typescript
type Status = "success" | "error" | "loading";
type ID = string | number;

function printId(id: ID) {
  console.log(id);
}
```

**Intersection types (AND - must satisfy all types):**
```typescript
type Person = {
  name: string;
};

type Employee = {
  employeeId: number;
};

type Staff = Person & Employee;

const staff: Staff = {
  name: "John",
  employeeId: 123
};
```

---

### 6. What is readonly and how does it differ from const?

**Answer:**
- `const` prevents reassignment of variables
- `readonly` prevents modification of properties

```typescript
const arr = [1, 2, 3];
arr.push(4); // OK - array is mutable

const readonlyArr: readonly number[] = [1, 2, 3];
// readonlyArr.push(4); // Error!

interface User {
  readonly id: number;
  name: string;
}

const user: User = { id: 1, name: "Alice" };
// user.id = 2; // Error!
user.name = "Bob"; // OK
```

---

### 7. What are utility types? Give examples.

**Answer:** TypeScript provides built-in utility types for common type transformations:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// Partial - makes all properties optional
type PartialUser = Partial<User>;

// Required - makes all properties required
type RequiredUser = Required<PartialUser>;

// Pick - select specific properties
type UserPreview = Pick<User, "id" | "name">;

// Omit - exclude specific properties
type UserWithoutEmail = Omit<User, "email">;

// Readonly - makes all properties readonly
type ImmutableUser = Readonly<User>;

// Record - create object type with specific keys and values
type Roles = Record<string, boolean>;
```

---

## Advanced Level

### 8. What is type narrowing and how do you implement it?

**Answer:** Type narrowing is refining types within conditional blocks.

```typescript
function processValue(value: string | number) {
  // Type guard using typeof
  if (typeof value === "string") {
    return value.toUpperCase(); // value is string here
  }
  return value.toFixed(2); // value is number here
}

// Custom type guard
interface Cat {
  meow(): void;
}

interface Dog {
  bark(): void;
}

function isCat(animal: Cat | Dog): animal is Cat {
  return (animal as Cat).meow !== undefined;
}

function makeSound(animal: Cat | Dog) {
  if (isCat(animal)) {
    animal.meow(); // TypeScript knows it's a Cat
  } else {
    animal.bark(); // TypeScript knows it's a Dog
  }
}
```

---

### 9. Explain unknown vs any

**Answer:**

**`any` - disables type checking completely:**
```typescript
let value: any;
value.foo.bar; // No error, no type checking
```

**`unknown` - type-safe alternative requiring type checking:**
```typescript
let value: unknown;
// value.foo.bar; // Error!

if (typeof value === "string") {
  console.log(value.toUpperCase()); // OK after check
}
```

`unknown` is preferred because it forces you to verify the type before using it.

---

### 10. What are conditional types?

**Answer:** Conditional types select types based on conditions:

```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false

// Practical example
type NonNullable<T> = T extends null | undefined ? never : T;

type Result = NonNullable<string | null>; // string

// Extract function return type
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getUser() {
  return { name: "John", age: 30 };
}

type User = ReturnType<typeof getUser>; // { name: string; age: number }
```

---

### 11. What are mapped types?

**Answer:** Mapped types transform properties of existing types:

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Optional<T> = {
  [P in keyof T]?: T[P];
};

interface User {
  name: string;
  age: number;
}

type ReadonlyUser = Readonly<User>;
// { readonly name: string; readonly age: number; }

// Custom mapped type
type Getters<T> = {
  [P in keyof T as `get${Capitalize<string & P>}`]: () => T[P];
};

type UserGetters = Getters<User>;
// { getName: () => string; getAge: () => number; }
```

---

### 12. What is the infer keyword?

**Answer:** `infer` is used in conditional types to extract types:

```typescript
// Extract array element type
type ArrayElement<T> = T extends (infer E)[] ? E : never;

type Num = ArrayElement<number[]>; // number

// Extract function parameters
type Parameters<T> = T extends (...args: infer P) => any ? P : never;

function foo(a: string, b: number) {}

type FooParams = Parameters<typeof foo>; // [string, number]

// Extract Promise value type
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type Value = UnwrapPromise<Promise<string>>; // string
```

---

## Practical Questions

### 13. How do you handle asynchronous operations with TypeScript?

**Answer:**

```typescript
// Async function with Promise
async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

// Error handling
async function safelyFetchUser(id: number): Promise<User | null> {
  try {
    const user = await fetchUser(id);
    return user;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    return null;
  }
}
```

---

### 14. How would you type a React component?

**Answer:**

```typescript
import React from 'react';

// Functional component with props
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  disabled = false 
}) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};

// With events
interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
```

---

## Summary

These questions cover fundamental to advanced TypeScript concepts and are commonly asked in interviews. Practice writing code examples for each to solidify your understanding!

For comprehensive examples and detailed explanations, see the main [README.md](./README.md) which contains 32 questions with extensive code samples.

