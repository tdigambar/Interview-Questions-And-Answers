# JavaScript Interview Questions and Answers

A comprehensive collection of JavaScript interview questions covering basic to advanced concepts for frontend and full-stack development interviews.

## Table of Contents

- [Basic Level](#basic-level)
- [Intermediate Level](#intermediate-level)
- [Advanced Level](#advanced-level)

---

## Basic Level

### 1. What is JavaScript?

JavaScript is a high-level, interpreted programming language that is primarily used for creating interactive web pages. It's a multi-paradigm language supporting object-oriented, imperative, and functional programming styles. JavaScript can run on both the client-side (browser) and server-side (Node.js).

### 2. What are the different data types in JavaScript?

JavaScript has two main categories of data types:

**Primitive Types**:
- `number` - Integer and floating-point numbers
- `string` - Text data
- `boolean` - true or false
- `undefined` - Variable declared but not assigned
- `null` - Intentional absence of value
- `symbol` - Unique identifier (ES6)
- `bigint` - Large integers (ES2020)

**Reference Types**:
- `object` - Collections of key-value pairs
- `array` - Ordered lists
- `function` - Reusable code blocks

```javascript
// Primitive types
let num = 42;
let str = "Hello";
let bool = true;
let undef = undefined;
let nul = null;
let sym = Symbol('id');
let big = 123n;

// Reference types
let obj = { name: "John" };
let arr = [1, 2, 3];
let func = function() { return "Hello"; };
```

### 3. What is the difference between `var`, `let`, and `const`?

**var**:
- Function-scoped or globally-scoped
- Can be redeclared
- Can be reassigned
- Hoisted with undefined value

**let**:
- Block-scoped
- Cannot be redeclared in same scope
- Can be reassigned
- Hoisted but not initialized (Temporal Dead Zone)

**const**:
- Block-scoped
- Cannot be redeclared
- Cannot be reassigned
- Must be initialized during declaration

```javascript
// var example
function varExample() {
    console.log(x); // undefined (hoisted)
    var x = 5;
    var x = 10; // Can redeclare
    x = 15; // Can reassign
}

// let example
function letExample() {
    // console.log(y); // ReferenceError (Temporal Dead Zone)
    let y = 5;
    // let y = 10; // SyntaxError: Cannot redeclare
    y = 15; // Can reassign
}

// const example
function constExample() {
    // console.log(z); // ReferenceError (Temporal Dead Zone)
    const z = 5;
    // const z = 10; // SyntaxError: Cannot redeclare
    // z = 15; // TypeError: Cannot reassign
}
```

### 4. What is hoisting in JavaScript?

Hoisting is JavaScript's behavior of moving variable and function declarations to the top of their containing scope during the compilation phase.

```javascript
// Variable hoisting
console.log(x); // undefined (not ReferenceError)
var x = 5;

// Function hoisting
sayHello(); // "Hello!" (works because function is hoisted)

function sayHello() {
    console.log("Hello!");
}

// let/const hoisting (Temporal Dead Zone)
console.log(y); // ReferenceError
let y = 10;
```

### 5. What is the difference between `==` and `===`?

**`==` (Loose Equality)**:
- Performs type coercion
- Converts operands to same type before comparison
- Can lead to unexpected results

**`===` (Strict Equality)**:
- No type coercion
- Compares both value and type
- More predictable and recommended

```javascript
// Loose equality examples
console.log(5 == "5");    // true (string "5" converted to number)
console.log(true == 1);   // true (boolean true converted to 1)
console.log(null == undefined); // true
console.log(0 == false);  // true

// Strict equality examples
console.log(5 === "5");   // false (different types)
console.log(true === 1);  // false (different types)
console.log(null === undefined); // false
console.log(0 === false); // false
```

### 6. What are functions in JavaScript?

Functions are reusable blocks of code that can be called to perform specific tasks.

```javascript
// Function declaration
function greet(name) {
    return `Hello, ${name}!`;
}

// Function expression
const greet2 = function(name) {
    return `Hello, ${name}!`;
};

// Arrow function (ES6)
const greet3 = (name) => {
    return `Hello, ${name}!`;
};

// Arrow function (shorthand)
const greet4 = name => `Hello, ${name}!`;

// Function with default parameters
function greet5(name = "World") {
    return `Hello, ${name}!`;
}

// Function with rest parameters
function sum(...numbers) {
    return numbers.reduce((total, num) => total + num, 0);
}
```

### 7. What are arrays and how do you manipulate them?

Arrays are ordered collections of data that can hold multiple values.

```javascript
// Creating arrays
let fruits = ["apple", "banana", "orange"];
let numbers = new Array(1, 2, 3, 4, 5);

// Array methods
fruits.push("grape");        // Add to end
fruits.pop();               // Remove from end
fruits.unshift("kiwi");     // Add to beginning
fruits.shift();             // Remove from beginning

// Array iteration
fruits.forEach(fruit => console.log(fruit));

// Array transformation
const upperFruits = fruits.map(fruit => fruit.toUpperCase());
const longFruits = fruits.filter(fruit => fruit.length > 5);

// Array searching
const found = fruits.find(fruit => fruit.startsWith("a"));
const index = fruits.indexOf("banana");

// Array reduction
const total = numbers.reduce((sum, num) => sum + num, 0);
```

### 8. What are objects in JavaScript?

Objects are collections of key-value pairs where keys are strings (or symbols) and values can be any data type.

```javascript
// Object creation
const person = {
    name: "John",
    age: 30,
    city: "New York",
    greet: function() {
        return `Hello, I'm ${this.name}`;
    }
};

// Accessing properties
console.log(person.name);        // Dot notation
console.log(person["age"]);      // Bracket notation

// Adding properties
person.email = "john@example.com";
person["phone"] = "123-456-7890";

// Object methods
const keys = Object.keys(person);
const values = Object.values(person);
const entries = Object.entries(person);

// Object destructuring
const { name, age, city } = person;

// Object spread
const updatedPerson = { ...person, age: 31 };
```

### 9. What is the `this` keyword in JavaScript?

The `this` keyword refers to the object that is currently executing the function. Its value depends on how the function is called.

```javascript
// Global context
console.log(this); // Window object (in browser)

// Object method
const obj = {
    name: "John",
    greet: function() {
        return `Hello, I'm ${this.name}`;
    }
};

// Constructor function
function Person(name) {
    this.name = name;
    this.greet = function() {
        return `Hello, I'm ${this.name}`;
    };
}

const person1 = new Person("Alice");

// Arrow functions (lexical this)
const obj2 = {
    name: "Bob",
    greet: () => {
        return `Hello, I'm ${this.name}`; // this refers to global object
    },
    greet2: function() {
        const inner = () => {
            return `Hello, I'm ${this.name}`; // this refers to obj2
        };
        return inner();
    }
};
```

### 10. What are closures in JavaScript?

A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned.

```javascript
// Basic closure
function outerFunction(x) {
    return function innerFunction(y) {
        return x + y; // x is "closed over"
    };
}

const add5 = outerFunction(5);
console.log(add5(3)); // 8

// Practical closure example
function createCounter() {
    let count = 0;
    return {
        increment: () => ++count,
        decrement: () => --count,
        getCount: () => count
    };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount());  // 2
```

---

## Intermediate Level

### 11. What are promises in JavaScript?

Promises are objects that represent the eventual completion or failure of an asynchronous operation.

```javascript
// Creating a promise
const myPromise = new Promise((resolve, reject) => {
    const success = true;
    
    if (success) {
        resolve("Operation successful");
    } else {
        reject("Operation failed");
    }
});

// Using promises
myPromise
    .then(result => console.log(result))
    .catch(error => console.error(error))
    .finally(() => console.log("Promise completed"));

// Promise methods
Promise.all([promise1, promise2, promise3])
    .then(results => console.log("All promises resolved:", results))
    .catch(error => console.error("One promise rejected:", error));

Promise.race([promise1, promise2])
    .then(result => console.log("First promise resolved:", result));

// Async/await (ES2017)
async function fetchData() {
    try {
        const result = await myPromise;
        console.log(result);
    } catch (error) {
        console.error(error);
    }
}
```

### 12. What is the difference between synchronous and asynchronous JavaScript?

**Synchronous**: Code executes line by line, blocking until each operation completes.

**Asynchronous**: Code can execute multiple operations concurrently without blocking.

```javascript
// Synchronous example
console.log("1");
console.log("2");
console.log("3");
// Output: 1, 2, 3

// Asynchronous example
console.log("1");
setTimeout(() => console.log("2"), 0);
console.log("3");
// Output: 1, 3, 2

// Asynchronous with promises
async function asyncExample() {
    console.log("Start");
    
    const result1 = await fetch('/api/data1');
    const result2 = await fetch('/api/data2');
    
    console.log("Both requests completed");
}
```

### 13. What are higher-order functions?

Higher-order functions are functions that either take other functions as arguments or return functions as their result.

```javascript
// Function that takes another function as argument
function higherOrderFunction(callback) {
    return callback(10);
}

const result = higherOrderFunction(x => x * 2); // 20

// Function that returns another function
function createMultiplier(factor) {
    return function(number) {
        return number * factor;
    };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15

// Built-in higher-order functions
const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map(x => x * 2);
const evens = numbers.filter(x => x % 2 === 0);
const sum = numbers.reduce((acc, x) => acc + x, 0);
```

### 14. What is destructuring in JavaScript?

Destructuring allows you to extract values from arrays or properties from objects into distinct variables.

```javascript
// Array destructuring
const colors = ["red", "green", "blue"];
const [first, second, third] = colors;
const [primary, ...rest] = colors;

// Object destructuring
const person = { name: "John", age: 30, city: "NYC" };
const { name, age, city } = person;
const { name: fullName, age: years } = person; // Renaming

// Nested destructuring
const user = {
    id: 1,
    profile: {
        name: "John",
        address: {
            city: "NYC",
            country: "USA"
        }
    }
};

const { profile: { name, address: { city } } } = user;

// Function parameter destructuring
function greet({ name, age }) {
    return `Hello ${name}, you are ${age} years old`;
}
```

### 15. What are template literals?

Template literals are string literals that allow embedded expressions and multi-line strings.

```javascript
// Basic template literal
const name = "John";
const age = 30;
const message = `Hello, my name is ${name} and I am ${age} years old`;

// Multi-line strings
const multiLine = `
    This is a
    multi-line
    string
`;

// Expression evaluation
const a = 5;
const b = 10;
const calculation = `${a} + ${b} = ${a + b}`;

// Tagged template literals
function highlight(strings, ...values) {
    return strings.reduce((result, string, i) => {
        return result + string + (values[i] ? `<mark>${values[i]}</mark>` : '');
    }, '');
}

const highlighted = highlight`Hello ${name}, you are ${age} years old`;
```

### 16. What are classes in JavaScript?

Classes are syntactic sugar over JavaScript's prototype-based inheritance, introduced in ES6.

```javascript
// Class declaration
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    
    greet() {
        return `Hello, I'm ${this.name}`;
    }
    
    // Static method
    static species() {
        return "Homo sapiens";
    }
    
    // Getter
    get info() {
        return `${this.name} is ${this.age} years old`;
    }
    
    // Setter
    set newAge(age) {
        if (age > 0) {
            this.age = age;
        }
    }
}

// Class inheritance
class Student extends Person {
    constructor(name, age, grade) {
        super(name, age);
        this.grade = grade;
    }
    
    study() {
        return `${this.name} is studying`;
    }
    
    // Method overriding
    greet() {
        return `Hello, I'm ${this.name}, a student`;
    }
}

// Usage
const student = new Student("Alice", 20, "A");
console.log(student.greet());
console.log(student.study());
```

### 17. What are modules in JavaScript?

Modules allow you to split your code into separate files and import/export functionality.

```javascript
// math.js (ES6 modules)
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;

export default function multiply(a, b) {
    return a * b;
}

// utils.js
const formatDate = (date) => date.toLocaleDateString();
const formatCurrency = (amount) => `$${amount.toFixed(2)}`;

export { formatDate, formatCurrency };

// main.js
import multiply, { add, subtract } from './math.js';
import { formatDate, formatCurrency } from './utils.js';

// CommonJS (Node.js)
// math.js
exports.add = (a, b) => a + b;
module.exports = { add, subtract };

// main.js
const { add, subtract } = require('./math.js');
```

### 18. What is the event loop in JavaScript?

The event loop is the mechanism that allows JavaScript to handle asynchronous operations while remaining single-threaded.

```javascript
// Event loop example
console.log("1");

setTimeout(() => console.log("2"), 0);

Promise.resolve().then(() => console.log("3"));

console.log("4");

// Output: 1, 4, 3, 2

// Explanation:
// 1. "1" - Synchronous execution
// 2. setTimeout - Added to Web APIs, then to Task Queue
// 3. Promise - Added to Microtask Queue
// 4. "4" - Synchronous execution
// 5. "3" - Microtask Queue (higher priority)
// 6. "2" - Task Queue
```

### 19. What are generators in JavaScript?

Generators are functions that can be paused and resumed, allowing you to control the execution flow.

```javascript
// Generator function
function* numberGenerator() {
    yield 1;
    yield 2;
    yield 3;
    return 4;
}

const gen = numberGenerator();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: 4, done: true }

// Generator with parameters
function* fibonacci() {
    let a = 0, b = 1;
    while (true) {
        yield a;
        [a, b] = [b, a + b];
    }
}

const fib = fibonacci();
console.log(fib.next().value); // 0
console.log(fib.next().value); // 1
console.log(fib.next().value); // 1
console.log(fib.next().value); // 2
```

### 20. What is the difference between `call`, `apply`, and `bind`?

These methods allow you to control the `this` context of a function.

```javascript
const person = {
    name: "John",
    greet: function(greeting, punctuation) {
        return `${greeting}, I'm ${this.name}${punctuation}`;
    }
};

const anotherPerson = { name: "Alice" };

// call - Invokes function with specific this and individual arguments
const result1 = person.greet.call(anotherPerson, "Hello", "!");
// "Hello, I'm Alice!"

// apply - Invokes function with specific this and array of arguments
const result2 = person.greet.apply(anotherPerson, ["Hi", "?"]);
// "Hi, I'm Alice?"

// bind - Returns new function with bound this and preset arguments
const boundGreet = person.greet.bind(anotherPerson, "Hey");
const result3 = boundGreet("!");
// "Hey, I'm Alice!"
```

---

## Advanced Level

### 21. What are proxies in JavaScript?

Proxies allow you to intercept and customize operations performed on objects.

```javascript
// Basic proxy
const target = { name: "John", age: 30 };
const proxy = new Proxy(target, {
    get(target, property) {
        console.log(`Getting ${property}`);
        return target[property];
    },
    set(target, property, value) {
        console.log(`Setting ${property} to ${value}`);
        target[property] = value;
        return true;
    }
});

proxy.name; // "Getting name"
proxy.age = 31; // "Setting age to 31"

// Validation proxy
const userProxy = new Proxy({}, {
    set(target, property, value) {
        if (property === 'age' && (typeof value !== 'number' || value < 0)) {
            throw new Error('Age must be a positive number');
        }
        target[property] = value;
        return true;
    }
});

userProxy.age = 25; // OK
// userProxy.age = -5; // Error: Age must be a positive number
```

### 22. What are symbols in JavaScript?

Symbols are primitive data types that represent unique identifiers.

```javascript
// Creating symbols
const sym1 = Symbol();
const sym2 = Symbol('description');
const sym3 = Symbol('description');

console.log(sym2 === sym3); // false (each symbol is unique)

// Global symbol registry
const globalSym = Symbol.for('global');
const sameGlobalSym = Symbol.for('global');
console.log(globalSym === sameGlobalSym); // true

// Using symbols as object keys
const obj = {
    [sym1]: 'value1',
    [sym2]: 'value2',
    regularKey: 'value3'
};

// Well-known symbols
class MyArray extends Array {
    static get [Symbol.species]() {
        return Array; // Return Array instead of MyArray
    }
}

// Custom iteration
const iterable = {
    [Symbol.iterator]: function* () {
        yield 1;
        yield 2;
        yield 3;
    }
};

for (const value of iterable) {
    console.log(value); // 1, 2, 3
}
```

### 23. What are WeakMap and WeakSet?

WeakMap and WeakSet are collections that hold weak references to their keys/elements.

```javascript
// WeakMap - keys must be objects
const weakMap = new WeakMap();
const obj1 = { id: 1 };
const obj2 = { id: 2 };

weakMap.set(obj1, 'value1');
weakMap.set(obj2, 'value2');

console.log(weakMap.get(obj1)); // 'value1'

// WeakSet - elements must be objects
const weakSet = new WeakSet();
const obj3 = { id: 3 };
const obj4 = { id: 4 };

weakSet.add(obj3);
weakSet.add(obj4);

console.log(weakSet.has(obj3)); // true

// Key differences from Map/Set:
// - No iteration methods
// - No size property
// - Keys/elements can be garbage collected
// - No enumeration of keys/elements
```

### 24. What is the difference between shallow and deep copying?

**Shallow Copy**: Creates a new object but copies references to nested objects.
**Deep Copy**: Creates a new object and recursively copies all nested objects.

```javascript
const original = {
    name: "John",
    age: 30,
    address: {
        city: "NYC",
        country: "USA"
    },
    hobbies: ["reading", "coding"]
};

// Shallow copy methods
const shallow1 = Object.assign({}, original);
const shallow2 = { ...original };

// Deep copy methods
const deep1 = JSON.parse(JSON.stringify(original)); // Limited (no functions, dates, etc.)

// Custom deep copy function
function deepCopy(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof Array) return obj.map(item => deepCopy(item));
    if (typeof obj === 'object') {
        const copy = {};
        Object.keys(obj).forEach(key => {
            copy[key] = deepCopy(obj[key]);
        });
        return copy;
    }
}

const deep2 = deepCopy(original);

// Modifying nested object
shallow1.address.city = "LA"; // Affects original
deep2.address.city = "LA";    // Doesn't affect original
```

### 25. What are decorators in JavaScript?

Decorators are a design pattern that allows you to add behavior to objects dynamically.

```javascript
// Function decorator
function withLogging(fn) {
    return function(...args) {
        console.log(`Calling ${fn.name} with args:`, args);
        const result = fn.apply(this, args);
        console.log(`${fn.name} returned:`, result);
        return result;
    };
}

function add(a, b) {
    return a + b;
}

const loggedAdd = withLogging(add);
loggedAdd(2, 3); // Logs the function call and result

// Class decorator
function withTiming(target) {
    const originalMethod = target.prototype.someMethod;
    target.prototype.someMethod = function(...args) {
        const start = performance.now();
        const result = originalMethod.apply(this, args);
        const end = performance.now();
        console.log(`Method took ${end - start} milliseconds`);
        return result;
    };
    return target;
}

@withTiming
class MyClass {
    someMethod() {
        // Some computation
        return "result";
    }
}
```

### 26. What are Web Workers in JavaScript?

Web Workers allow you to run JavaScript code in background threads without blocking the main thread.

```javascript
// main.js
const worker = new Worker('worker.js');

worker.postMessage({ command: 'start', data: [1, 2, 3, 4, 5] });

worker.onmessage = function(e) {
    console.log('Result from worker:', e.data);
};

worker.onerror = function(error) {
    console.error('Worker error:', error);
};

// worker.js
self.onmessage = function(e) {
    const { command, data } = e.data;
    
    if (command === 'start') {
        // Heavy computation
        const result = data.reduce((sum, num) => sum + num * num, 0);
        self.postMessage({ result });
    }
};

// SharedArrayBuffer (for shared memory)
const sharedBuffer = new SharedArrayBuffer(1024);
const sharedArray = new Int32Array(sharedBuffer);
```

### 27. What are async iterators and async generators?

Async iterators allow you to iterate over asynchronous data sources.

```javascript
// Async generator
async function* asyncNumberGenerator() {
    for (let i = 1; i <= 5; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        yield i;
    }
}

// Using async iterator
async function processAsyncData() {
    for await (const number of asyncNumberGenerator()) {
        console.log(number);
    }
}

// Custom async iterable
const asyncIterable = {
    async *[Symbol.asyncIterator]() {
        yield 'first';
        await new Promise(resolve => setTimeout(resolve, 1000));
        yield 'second';
        await new Promise(resolve => setTimeout(resolve, 1000));
        yield 'third';
    }
};

// Usage
(async () => {
    for await (const value of asyncIterable) {
        console.log(value);
    }
})();
```

### 28. What is the difference between `Object.create()` and `new` operator?

**Object.create()**: Creates a new object with specified prototype.
**new operator**: Creates an instance of a constructor function.

```javascript
// Object.create() example
const parent = {
    greet() {
        return `Hello, I'm ${this.name}`;
    }
};

const child = Object.create(parent);
child.name = "John";
console.log(child.greet()); // "Hello, I'm John"

// new operator example
function Person(name) {
    this.name = name;
}

Person.prototype.greet = function() {
    return `Hello, I'm ${this.name}`;
};

const person = new Person("John");
console.log(person.greet()); // "Hello, I'm John"

// Comparison
console.log(Object.getPrototypeOf(child) === parent); // true
console.log(Object.getPrototypeOf(person) === Person.prototype); // true
```

### 29. What are tagged template literals?

Tagged template literals allow you to parse template literals with a function.

```javascript
// Basic tagged template
function myTag(strings, ...values) {
    console.log('Strings:', strings);
    console.log('Values:', values);
    return 'Processed result';
}

const name = 'John';
const age = 30;
const result = myTag`Hello ${name}, you are ${age} years old`;

// Advanced example - SQL query builder
function sql(strings, ...values) {
    return {
        query: strings.join('?'),
        params: values
    };
}

const userId = 123;
const query = sql`SELECT * FROM users WHERE id = ${userId}`;
console.log(query); // { query: "SELECT * FROM users WHERE id = ?", params: [123] }

// HTML escaping
function html(strings, ...values) {
    return strings.reduce((result, string, i) => {
        const value = values[i] ? String(values[i])
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;') : '';
        return result + string + value;
    }, '');
}

const userInput = '<script>alert("xss")</script>';
const safeHtml = html`<div>${userInput}</div>`;
```

### 30. What are JavaScript engines and how do they work?

JavaScript engines are programs that execute JavaScript code. Popular engines include V8 (Chrome, Node.js), SpiderMonkey (Firefox), and JavaScriptCore (Safari).

```javascript
// Engine optimization example
function optimizedFunction() {
    // V8 optimizations
    const arr = [];
    for (let i = 0; i < 1000000; i++) {
        arr.push(i * 2);
    }
    return arr;
}

// Hidden classes optimization
function createObject(useName) {
    const obj = {};
    if (useName) {
        obj.name = 'John';
    }
    obj.age = 30; // Different hidden class if name was set
    return obj;
}

// Inline caching
function getProperty(obj) {
    return obj.property; // V8 caches property access
}

// Just-in-time compilation
function hotFunction(x) {
    return x * x + 2 * x + 1; // Gets compiled to optimized machine code
}

// Performance tips
console.time('optimized');
for (let i = 0; i < 1000000; i++) {
    hotFunction(i);
}
console.timeEnd('optimized');
```

---

## Conclusion

These JavaScript interview questions cover fundamental concepts to advanced features, including ES6+ syntax, asynchronous programming, modern JavaScript patterns, and performance optimization. Understanding these concepts will help you excel in JavaScript interviews and build robust, efficient applications.

Key areas covered include:
- **Core JavaScript**: Variables, functions, objects, arrays
- **ES6+ Features**: Classes, modules, destructuring, template literals
- **Asynchronous Programming**: Promises, async/await, event loop
- **Advanced Concepts**: Proxies, symbols, generators, decorators
- **Performance**: Engine optimization, memory management
- **Modern Patterns**: Web Workers, async iterators, tagged templates
