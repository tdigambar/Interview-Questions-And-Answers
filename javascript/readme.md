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

### 11. What are promises and async/await in JavaScript?

**Promise** is an object representing the eventual completion or failure of an asynchronous operation.

**Promise States:**
1. **Pending** - Initial state
2. **Fulfilled** - Operation completed successfully
3. **Rejected** - Operation failed

---

#### Creating a Promise

```javascript
const myPromise = new Promise((resolve, reject) => {
    const success = true;
    
    if (success) {
        resolve("Operation successful"); // Fulfilled
    } else {
        reject("Operation failed"); // Rejected
    }
});
```

---

#### Using Promises - `.then()` / `.catch()`

```javascript
// Chaining promises
fetch('https://api.example.com/users')
    .then(response => response.json())
    .then(data => {
        console.log('Users:', data);
        return fetch(`https://api.example.com/posts`);
    })
    .then(response => response.json())
    .then(posts => console.log('Posts:', posts))
    .catch(error => console.error('Error:', error))
    .finally(() => console.log('Request completed'));
```

---

#### Async/Await (Modern Approach)

**Async/await** makes asynchronous code look and behave like synchronous code.

```javascript
// Async function returns a promise
async function fetchUserData() {
    try {
        const response = await fetch('https://api.example.com/users');
        const data = await response.json();
        console.log('Users:', data);
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

// Usage
fetchUserData();
```

---

#### Promise Methods

**1. `Promise.all()` - Wait for all to complete**
```javascript
const promises = [
    fetch('/api/users'),
    fetch('/api/posts'),
    fetch('/api/comments')
];

Promise.all(promises)
    .then(responses => Promise.all(responses.map(r => r.json())))
    .then(data => console.log(data))
    .catch(error => console.error('One failed:', error));

// ⚠️ If ANY promise rejects, entire Promise.all rejects
```

**2. `Promise.allSettled()` - Wait for all, get all results**
```javascript
Promise.allSettled(promises)
    .then(results => {
        results.forEach(result => {
            if (result.status === 'fulfilled') {
                console.log('Success:', result.value);
            } else {
                console.log('Failed:', result.reason);
            }
        });
    });

// ✅ Always resolves, never rejects
```

**3. `Promise.race()` - First to complete wins**
```javascript
Promise.race([
    fetch('/api/fast'),
    fetch('/api/slow')
])
    .then(response => console.log('First response:', response));

// Returns first promise to resolve/reject
```

**4. `Promise.any()` - First to succeed wins**
```javascript
Promise.any([
    fetch('/api/server1'),
    fetch('/api/server2'),
    fetch('/api/server3')
])
    .then(response => console.log('First success:', response))
    .catch(error => console.error('All failed:', error));

// Returns first fulfilled promise, ignores rejections
```

---

#### Comparison: Promises vs Async/Await

```javascript
// Using Promises (.then)
function getUserPosts() {
    return fetch('/api/user/1')
        .then(response => response.json())
        .then(user => fetch(`/api/users/${user.id}/posts`))
        .then(response => response.json())
        .then(posts => console.log(posts))
        .catch(error => console.error(error));
}

// Using Async/Await (cleaner)
async function getUserPosts() {
    try {
        const userResponse = await fetch('/api/user/1');
        const user = await userResponse.json();
        
        const postsResponse = await fetch(`/api/users/${user.id}/posts`);
        const posts = await postsResponse.json();
        
        console.log(posts);
    } catch (error) {
        console.error(error);
    }
}
```

---

#### Real-World Example: Parallel Requests

```javascript
// ❌ Sequential (slow) - 6 seconds total
async function fetchSequential() {
    const user = await fetch('/api/user'); // 2s
    const posts = await fetch('/api/posts'); // 2s
    const comments = await fetch('/api/comments'); // 2s
}

// ✅ Parallel (fast) - 2 seconds total
async function fetchParallel() {
    const [user, posts, comments] = await Promise.all([
        fetch('/api/user'),
        fetch('/api/posts'),
        fetch('/api/comments')
    ]);
}
```

---

#### Key Differences

| Feature | Promises | Async/Await |
|---------|----------|-------------|
| **Syntax** | `.then()` chains | `await` keyword |
| **Readability** | Can be complex | Cleaner, linear |
| **Error handling** | `.catch()` | `try-catch` |
| **Debugging** | Harder | Easier |
| **Return value** | Promise | Promise (implicit) |

---

#### Important Notes

**1. `await` only works inside `async` functions**
```javascript
// ❌ Error
function getData() {
    const data = await fetch('/api'); // SyntaxError
}

// ✅ Correct
async function getData() {
    const data = await fetch('/api');
}
```

**2. Async functions always return a promise**
```javascript
async function getValue() {
    return 42; // Automatically wrapped in Promise.resolve(42)
}

getValue().then(value => console.log(value)); // 42
```

**3. Multiple awaits run sequentially**
```javascript
// Sequential (3 seconds)
const a = await task1(); // 1s
const b = await task2(); // 1s
const c = await task3(); // 1s

// Parallel (1 second)
const [a, b, c] = await Promise.all([task1(), task2(), task3()]);
```

**Key Takeaways:**
- **Promises** - Handle async operations with `.then()/.catch()`
- **Async/Await** - Syntactic sugar making promises easier to read
- **Use `Promise.all()`** for parallel operations
- **Use `try-catch`** with async/await for error handling

### 11b. What are handled and unhandled exceptions in promises?

**Handled Exceptions**: Errors caught using `.catch()` or `try-catch` blocks.

**Unhandled Exceptions**: Promise rejections not caught, causing potential crashes.

---

#### 1. Handled Promise Exceptions

**Using `.catch()`**
```javascript
// ✅ HANDLED
fetch("/api/data")
    .then(response => response.json())
    .catch(error => console.error("Error:", error.message));
```

**Using `async/await` with `try-catch`**
```javascript
// ✅ HANDLED
async function getData() {
    try {
        const data = await fetch("/api/data");
        return data;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}
```

**Using `Promise.allSettled()`**
```javascript
// ✅ HANDLED - All promises complete regardless of failures
const results = await Promise.allSettled([
    fetch("/api/users"),
    fetch("/api/posts")
]);

results.forEach(result => {
    if (result.status === 'fulfilled') {
        console.log("Success:", result.value);
    } else {
        console.error("Failed:", result.reason);
    }
});
```

---

#### 2. Unhandled Promise Exceptions

**Missing `.catch()`**
```javascript
// ❌ UNHANDLED
fetch("/api/data")
    .then(response => response.json());
// No .catch() - unhandled rejection!
```

**Async without `try-catch`**
```javascript
// ❌ UNHANDLED
async function getData() {
    const data = await fetch("/api/data"); // If fails, error unhandled
    return data;
}
```

**Promise.all without error handling**
```javascript
// ❌ UNHANDLED
Promise.all([promise1, promise2])
    .then(results => console.log(results));
// No .catch() - if any rejects, unhandled!
```

---

#### 3. Global Error Handlers

**Node.js**
```javascript
process.on('unhandledRejection', (reason, promise) => {
    console.error('🚨 Unhandled Rejection:', reason);
    process.exit(1);
});
```

**Browser**
```javascript
window.addEventListener('unhandledrejection', (event) => {
    console.error('🚨 Unhandled rejection:', event.reason);
    event.preventDefault();
});
```

---

#### 4. Practical Comparison

```javascript
// ❌ BAD
async function fetchUser() {
    const response = await fetch("/api/user");
    return await response.json();
}

// ✅ GOOD
async function fetchUserSafe() {
    try {
        const response = await fetch("/api/user");
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Failed:", error);
        return null;
    }
}
```

---

#### 5. Error Handling Patterns

**Centralized Error Handler**
```javascript
function handleError(error, context = "") {
    console.error(`[${context}]`, error.message);
    return { success: false, error: "An error occurred" };
}

async function fetchData(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        return handleError(error, "fetchData");
    }
}
```

**Retry Logic**
```javascript
async function fetchWithRetry(url, retries = 3) {
    for (let i = 1; i <= retries; i++) {
        try {
            return await fetch(url).then(r => r.json());
        } catch (error) {
            if (i === retries) throw error;
            await new Promise(r => setTimeout(r, 1000 * i));
        }
    }
}
```

---

#### Summary Table

| Type | Method | Handled? |
|------|--------|----------|
| Promise with `.catch()` | `promise.then().catch()` | ✅ Yes |
| Promise without `.catch()` | `promise.then()` | ❌ No |
| Async with `try-catch` | `try { await fetch() } catch {}` | ✅ Yes |
| Async without `try-catch` | `await fetch()` | ❌ No |
| Global handler | `process.on('unhandledRejection')` | ✅ Yes |

**Best Practices:**
- Always use `.catch()` or `try-catch`
- Add global error handlers
- Use `Promise.allSettled()` for parallel operations
- Log errors with context
- Return fallback values when appropriate

### 12. What is event bubbling and how do you stop it?

**Event Bubbling** is the process where an event starts from the target element and propagates up through its ancestors in the DOM tree.

**Event Propagation Order:**
1. **Capturing Phase** - Window → Document → Parent → Target (rarely used)
2. **Target Phase** - Event reaches the target element
3. **Bubbling Phase** - Target → Parent → Document → Window (default)

---

#### Example: Event Bubbling

```javascript
// HTML: <div id="parent"><button id="child">Click Me</button></div>

const parent = document.getElementById('parent');
const child = document.getElementById('child');

parent.addEventListener('click', () => {
  console.log('Parent clicked');
});

child.addEventListener('click', () => {
  console.log('Child clicked');
});

// When you click the button:
// Output:
// "Child clicked"    ← Target phase
// "Parent clicked"   ← Bubbling phase (event bubbles up)
```

---

#### How to Stop Event Bubbling

**1. `stopPropagation()` - Stops bubbling to parent**

```javascript
child.addEventListener('click', (event) => {
  event.stopPropagation(); // ✅ Stops bubbling
  console.log('Child clicked');
});

// Output: "Child clicked" (parent handler won't run)
```

**2. `preventDefault()` - Prevents default action (not bubbling)**

```javascript
// Prevents form submission but doesn't stop bubbling
form.addEventListener('submit', (event) => {
  event.preventDefault();
  console.log('Form not submitted');
});
```

---

#### Practical Example: Modal Close

```javascript
const overlay = document.getElementById('overlay');
const modalContent = document.querySelector('.modal-content');

// Close modal when clicking overlay
overlay.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Prevent closing when clicking modal content
modalContent.addEventListener('click', (event) => {
  event.stopPropagation(); // Don't bubble to overlay
});
```

---

#### Comparison Table

| Method | Purpose | Example Use Case |
|--------|---------|------------------|
| `stopPropagation()` | Stops event bubbling | Modal content, dropdown menu |
| `preventDefault()` | Prevents default action | Form submit, link navigation |
| `stopImmediatePropagation()` | Stops all handlers | Emergency stop of all events |

---

#### Event Delegation (Using Bubbling)

```javascript
// ✅ GOOD - Single listener on parent (better performance)
const list = document.querySelector('.list');
list.addEventListener('click', (event) => {
  if (event.target.classList.contains('list-item')) {
    console.log('Item clicked:', event.target.textContent);
  }
});

// Benefits: Works with dynamically added elements, better performance
```

**Key Points:**
- `event.target` - Element that triggered the event
- `event.currentTarget` - Element with the event listener
- Most events bubble (click, keydown, submit) except focus, blur, load

### 13. What is debouncing and throttling?

Both are techniques to control how often a function executes, especially for performance optimization with events like scrolling, resizing, or typing.

---

#### Debouncing

**Definition:** Delays function execution until after a specified time has passed since the last event.

**When to use:** Search input, form validation, window resize

**How it works:**
- Wait for user to stop typing/acting
- Execute function only after delay period
- Each new event resets the timer

```javascript
function debounce(func, delay) {
  let timeoutId;
  
  return function(...args) {
    clearTimeout(timeoutId); // Clear previous timer
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Usage: Search input
const searchInput = document.getElementById('search');
const search = debounce((query) => {
  console.log('Searching for:', query);
  // Make API call
}, 500);

searchInput.addEventListener('input', (e) => search(e.target.value));

// User types "hello" → Only 1 API call after 500ms of inactivity
```

---

#### Throttling

**Definition:** Limits function execution to once per specified time period.

**When to use:** Scroll events, button clicks, window resize

**How it works:**
- Execute immediately on first call
- Ignore subsequent calls until time period passes
- Execute at regular intervals during continuous events

```javascript
function throttle(func, limit) {
  let inThrottle;
  
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Usage: Scroll event
const handleScroll = throttle(() => {
  console.log('Scrolled at:', Date.now());
  // Update scroll position, load more content
}, 1000);

window.addEventListener('scroll', handleScroll);

// Executes maximum once per second while scrolling
```

---

#### Comparison

**Visual Representation:**

```
User Actions:  ||||||||||||||||||||
               ↓

Debouncing:    ------------------- X  (waits until end)
               
Throttling:    X-----X-----X-----X    (regular intervals)
```

| Feature | Debouncing | Throttling |
|---------|-----------|------------|
| **Execution** | After delay ends | At regular intervals |
| **Best for** | Search, form validation | Scroll, resize, button clicks |
| **Guarantees** | Last call executes | Consistent execution rate |
| **Example** | Wait 500ms after typing stops | Execute once per second while scrolling |

---

#### Real-World Examples

**Debouncing - Search Autocomplete**
```javascript
const searchAPI = debounce((query) => {
  fetch(`/api/search?q=${query}`)
    .then(res => res.json())
    .then(results => displayResults(results));
}, 300);

// User types: "j" "a" "v" "a"
// API called only once after 300ms of no typing
```

**Throttling - Infinite Scroll**
```javascript
const loadMore = throttle(() => {
  const scrollPosition = window.scrollY + window.innerHeight;
  const threshold = document.body.offsetHeight - 500;
  
  if (scrollPosition > threshold) {
    fetchMoreItems();
  }
}, 500);

window.addEventListener('scroll', loadMore);

// Checks scroll position maximum once every 500ms
```

---

#### When to Use Which?

**Use Debouncing when:**
- ✅ You want to wait for user to finish an action
- ✅ Only the final result matters
- ✅ Examples: Search input, form validation, auto-save

**Use Throttling when:**
- ✅ You want regular updates during continuous action
- ✅ Intermediate results matter
- ✅ Examples: Scroll position tracking, mouse movement, resize events

---

#### Advanced: Leading vs Trailing

```javascript
// Trailing debounce (default) - executes after delay
function debounceTrailing(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Leading debounce - executes immediately, then waits
function debounceLeading(func, delay) {
  let timeoutId;
  return function(...args) {
    const callNow = !timeoutId;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => timeoutId = null, delay);
    if (callNow) func.apply(this, args);
  };
}
```

**Key Takeaways:**
- **Debouncing** = Wait until action stops
- **Throttling** = Limit execution rate
- Both improve performance by reducing function calls
- Choose based on whether you need final result or continuous updates

### 14. What is prototypal inheritance in JavaScript?

**Prototypal Inheritance** is JavaScript's way of allowing objects to inherit properties and methods from other objects through the prototype chain.

**Key Concept:** Every object has a hidden `[[Prototype]]` property that links to another object.

---

#### The Prototype Chain

```javascript
const animal = {
  eats: true,
  walk() {
    console.log('Animal walks');
  }
};

const rabbit = {
  jumps: true
};

// Set animal as prototype of rabbit
rabbit.__proto__ = animal; // or Object.setPrototypeOf(rabbit, animal)

console.log(rabbit.eats);  // true (inherited from animal)
console.log(rabbit.jumps); // true (own property)
rabbit.walk();             // "Animal walks" (inherited method)
```

**Prototype Chain Lookup:**
```
rabbit.eats → rabbit object (not found)
           → animal object (found: true)
           → Object.prototype (if not found)
           → null (end of chain)
```

---

#### Constructor Functions and Prototypes

```javascript
// Constructor function
function Person(name, age) {
  this.name = name;
  this.age = age;
}

// Add method to prototype (shared by all instances)
Person.prototype.greet = function() {
  return `Hello, I'm ${this.name}`;
};

// Create instances
const john = new Person('John', 30);
const jane = new Person('Jane', 25);

console.log(john.greet()); // "Hello, I'm John"
console.log(jane.greet()); // "Hello, I'm Jane"

// Both instances share the same greet method
console.log(john.greet === jane.greet); // true
```

---

#### ES6 Classes (Syntactic Sugar)

```javascript
// Class syntax (under the hood, still uses prototypes)
class Animal {
  constructor(name) {
    this.name = name;
  }
  
  speak() {
    console.log(`${this.name} makes a sound`);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // Call parent constructor
    this.breed = breed;
  }
  
  speak() {
    console.log(`${this.name} barks`);
  }
}

const dog = new Dog('Buddy', 'Golden Retriever');
dog.speak(); // "Buddy barks"
```

---

#### Prototype Methods

**1. `Object.create()` - Create object with specific prototype**
```javascript
const animal = {
  eats: true
};

const rabbit = Object.create(animal);
rabbit.jumps = true;

console.log(rabbit.eats);  // true (inherited)
console.log(rabbit.jumps); // true (own property)
```

**2. Checking prototypes**
```javascript
// Check if object is prototype of another
console.log(animal.isPrototypeOf(rabbit)); // true

// Get prototype
console.log(Object.getPrototypeOf(rabbit) === animal); // true

// Check own property (not inherited)
console.log(rabbit.hasOwnProperty('jumps')); // true
console.log(rabbit.hasOwnProperty('eats'));  // false
```

---

#### Inheritance Example

```javascript
// Parent constructor
function Vehicle(brand) {
  this.brand = brand;
}

Vehicle.prototype.start = function() {
  console.log(`${this.brand} is starting`);
};

// Child constructor
function Car(brand, model) {
  Vehicle.call(this, brand); // Call parent constructor
  this.model = model;
}

// Set up inheritance
Car.prototype = Object.create(Vehicle.prototype);
Car.prototype.constructor = Car;

// Add child-specific method
Car.prototype.drive = function() {
  console.log(`${this.brand} ${this.model} is driving`);
};

const myCar = new Car('Toyota', 'Camry');
myCar.start(); // "Toyota is starting" (inherited)
myCar.drive(); // "Toyota Camry is driving" (own method)
```

---

#### Comparison: Prototypal vs Classical Inheritance

| Feature | JavaScript (Prototypal) | Classical (Java, C++) |
|---------|------------------------|----------------------|
| **Inheritance** | Objects inherit from objects | Classes inherit from classes |
| **Syntax** | Prototype chain | Class-based |
| **Flexibility** | Dynamic, runtime changes | Static, compile-time |
| **Memory** | Methods shared via prototype | Methods copied to instances |

---

#### Common Pitfalls

**1. Modifying built-in prototypes (BAD PRACTICE)**
```javascript
// ❌ Don't do this
Array.prototype.myMethod = function() {
  // Can break existing code
};

// ✅ Create your own class instead
class MyArray extends Array {
  myMethod() {
    // Safe custom method
  }
}
```

**2. Losing constructor reference**
```javascript
// ❌ Wrong
Child.prototype = Parent.prototype; // Both point to same object

// ✅ Correct
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;
```

---

#### Real-World Example

```javascript
// Shape (parent)
function Shape(color) {
  this.color = color;
}

Shape.prototype.getColor = function() {
  return this.color;
};

// Circle (child)
function Circle(color, radius) {
  Shape.call(this, color);
  this.radius = radius;
}

Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle;

Circle.prototype.getArea = function() {
  return Math.PI * this.radius ** 2;
};

const circle = new Circle('red', 5);
console.log(circle.getColor()); // "red" (inherited)
console.log(circle.getArea());  // 78.54 (own method)
```

**Key Takeaways:**
- **Every object has a prototype** (except `Object.prototype`)
- **Inheritance via prototype chain** - properties/methods lookup
- **Constructor functions** use `prototype` property to share methods
- **ES6 classes** are syntactic sugar over prototypes
- **Use `Object.create()`** for clean prototypal inheritance

### 15. What is the difference between synchronous and asynchronous JavaScript?

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

These methods allow you to control the `this` context of a function. All three are used to explicitly set what `this` refers to when a function is called.

**Comparison Table:**

| Feature | `call()` | `apply()` | `bind()` |
|---------|----------|-----------|----------|
| **Invokes immediately?** | ✅ Yes | ✅ Yes | ❌ No (returns function) |
| **Arguments format** | Individual | Array | Individual |
| **Returns** | Function result | Function result | New function |
| **Use case** | Immediate execution | Immediate with array args | Create reusable function |

**1. `call()` - Invokes immediately with arguments listed individually**

```javascript
function greet(greeting, punctuation) {
    return `${greeting}, ${this.name}${punctuation}`;
}

const person = { name: "John" };

// Syntax: func.call(thisArg, arg1, arg2, ...)
const result = greet.call(person, "Hello", "!");
// Output: "Hello, John!"
```

**2. `apply()` - Invokes immediately with arguments as an array**

```javascript
function greet(greeting, punctuation) {
    return `${greeting}, ${this.name}${punctuation}`;
}

const person = { name: "John" };

// Syntax: func.apply(thisArg, [argsArray])
const result = greet.apply(person, ["Hello", "!"]);
// Output: "Hello, John!"

// Useful with Math functions
const numbers = [5, 6, 2, 3, 7];
const max = Math.max.apply(null, numbers); // 7
```

**3. `bind()` - Returns a new function (doesn't invoke immediately)**

```javascript
function greet(greeting, punctuation) {
    return `${greeting}, ${this.name}${punctuation}`;
}

const person = { name: "John" };

// Syntax: func.bind(thisArg, arg1, arg2, ...)
const boundGreet = greet.bind(person, "Hello");
boundGreet("!"); // "Hello, John!"

// Can invoke later
setTimeout(boundGreet, 1000, "?");
```

**Practical Examples:**

```javascript
// Example 1: Borrowing Methods
const person1 = {
    name: "Alice",
    introduce: function() {
        return `Hi, I'm ${this.name}`;
    }
};

const person2 = { name: "Bob" };

person1.introduce.call(person2);  // "Hi, I'm Bob"
person1.introduce.apply(person2); // "Hi, I'm Bob"
const bobIntroduce = person1.introduce.bind(person2);
bobIntroduce(); // "Hi, I'm Bob"

// Example 2: Event Handlers
class Button {
    constructor(label) {
        this.label = label;
        this.clicks = 0;
    }
    
    handleClick() {
        this.clicks++;
        console.log(`${this.label} clicked ${this.clicks} times`);
    }
}

const button = new Button("Submit");

// Without bind - loses context ❌
// element.addEventListener('click', button.handleClick);

// With bind - preserves context ✅
element.addEventListener('click', button.handleClick.bind(button));

// Example 3: Function Currying with bind
function multiply(a, b) {
    return a * b;
}

const double = multiply.bind(null, 2);
const triple = multiply.bind(null, 3);

console.log(double(5));  // 10
console.log(triple(5));  // 15

// Example 4: Array-like Objects
function sumArguments() {
    // Convert arguments to array
    const args = Array.prototype.slice.call(arguments);
    return args.reduce((sum, num) => sum + num, 0);
}

console.log(sumArguments(1, 2, 3, 4)); // 10

// Modern alternative with spread operator
const modernMax = Math.max(...[1, 2, 3, 4, 5]); // 5
```

**When to Use Each:**

- **Use `call()`**: When you need immediate execution with a few known arguments
- **Use `apply()`**: When you need immediate execution with arguments in an array
- **Use `bind()`**: When you need to create a new function with fixed `this` context (event handlers, callbacks, partial application)

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

### 31. What are cookies and how do you work with them in JavaScript?

Cookies are small pieces of data (max ~4KB) stored in the browser that are automatically sent to the server with every HTTP request. They are commonly used for session management, user preferences, and tracking.

**Key Characteristics**:
- Automatically sent with HTTP requests
- Can have expiration dates
- Can be secured with HttpOnly, Secure, and SameSite flags

```javascript
// Set a cookie
document.cookie = "username=john_doe; expires=Fri, 31 Dec 2025 23:59:59 GMT; path=/";

// Set with security flags
document.cookie = "sessionId=abc123; Secure; SameSite=Strict; path=/";

// Get all cookies
console.log(document.cookie); // "username=john_doe; sessionId=abc123"

// Simple helper functions
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
}

function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [key, val] = cookie.trim().split('=');
        if (key === name) return val;
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

// Usage
setCookie('theme', 'dark', 7);
console.log(getCookie('theme')); // 'dark'
deleteCookie('theme');
```

**Use Cases**: Authentication tokens, user preferences, shopping cart, session management

### 32. What is Web Storage (localStorage and sessionStorage)?

Web Storage API provides two mechanisms for storing data in the browser: `localStorage` (persistent) and `sessionStorage` (session-only). Both offer ~5-10MB storage and don't send data with HTTP requests.

**Comparison**:

| Feature | localStorage | sessionStorage | Cookies |
|---------|-------------|----------------|---------|
| Storage Limit | ~5-10MB | ~5-10MB | ~4KB |
| Expiration | Never | Tab close | Configurable |
| Sent with HTTP | No | No | Yes |

```javascript
// ========== localStorage (persists after browser close) ==========
localStorage.setItem('username', 'john_doe');
localStorage.setItem('theme', 'dark');

const username = localStorage.getItem('username');
console.log(username); // 'john_doe'

localStorage.removeItem('username');
localStorage.clear(); // Remove all items

// Storing objects (must stringify/parse)
const user = { name: 'Alice', age: 30 };
localStorage.setItem('user', JSON.stringify(user));
const storedUser = JSON.parse(localStorage.getItem('user'));

// ========== sessionStorage (cleared when tab closes) ==========
sessionStorage.setItem('tempData', 'temporary');
const temp = sessionStorage.getItem('tempData');
sessionStorage.removeItem('tempData');
sessionStorage.clear();

// ========== Storage Events (listen for changes in other tabs) ==========
window.addEventListener('storage', (event) => {
    console.log(`Key: ${event.key}`);
    console.log(`New Value: ${event.newValue}`);
});

// ========== Error Handling ==========
try {
    localStorage.setItem('key', 'value');
} catch (error) {
    if (error.name === 'QuotaExceededError') {
        console.error('Storage quota exceeded');
    }
}
```

**Use Cases**:
- **localStorage**: User preferences, shopping cart, offline data
- **sessionStorage**: Form data, temporary state, wizard steps
- **Cookies**: Authentication, server-side sessions

**Key Points**:
- Both use synchronous API (key-value storage)
- Data is stored as strings only
- XSS attacks can access storage (never store sensitive data in plain text)
- Check availability: `typeof(Storage) !== "undefined"`

### 33. How do you prevent SQL Injection and XSS attacks in web applications?

Security is crucial in web development. Two of the most common attacks are SQL Injection (backend) and Cross-Site Scripting/XSS (frontend). Here's how to prevent them:

---

#### SQL Injection Attack

SQL Injection occurs when attackers insert malicious SQL code through user input to manipulate or access the database.

**Vulnerable Code (❌ Never do this)**:
```javascript
// BAD: Direct string concatenation
const userId = req.body.userId; // User input: "1 OR 1=1"
const query = `SELECT * FROM users WHERE id = ${userId}`;
db.query(query); // Executes: SELECT * FROM users WHERE id = 1 OR 1=1
// Returns all users instead of one!
```

**Prevention Methods**:

```javascript
// ✅ Method 1: Parameterized Queries (Best Practice)
const query = 'SELECT * FROM users WHERE id = ?';
db.query(query, [userId]); // Values are escaped automatically

// ✅ Method 2: Prepared Statements
const query = 'SELECT * FROM users WHERE email = ? AND status = ?';
db.execute(query, [email, status]);

// ✅ Method 3: ORM Libraries (Sequelize, Prisma, TypeORM)
const user = await User.findOne({ where: { id: userId } });

// ✅ Method 4: Input Validation
function validateUserId(id) {
    const numId = parseInt(id, 10);
    if (isNaN(numId) || numId <= 0) {
        throw new Error('Invalid user ID');
    }
    return numId;
}
const safeId = validateUserId(req.body.userId);
```

---

#### Cross-Site Scripting (XSS) Attack

XSS occurs when attackers inject malicious JavaScript code into web pages that executes in other users' browsers.

**Types of XSS**:
1. **Stored XSS**: Malicious script stored in database
2. **Reflected XSS**: Script reflected from URL/input
3. **DOM-based XSS**: Script manipulates DOM directly

**Vulnerable Code (❌ Never do this)**:
```javascript
// BAD: Directly inserting user input
const username = "<script>alert('XSS')</script>";
document.getElementById('welcome').innerHTML = `Welcome ${username}`;
// Script executes!

// BAD: Using eval with user input
const userCode = req.query.code;
eval(userCode); // Never use eval with user input!

// BAD: Unescaped template rendering
const comment = req.body.comment; // "<img src=x onerror='alert(1)'>"
res.send(`<div>${comment}</div>`); // XSS vulnerability
```

**Prevention Methods**:

```javascript
// ✅ Method 1: Use textContent instead of innerHTML
const username = "<script>alert('XSS')</script>";
document.getElementById('welcome').textContent = `Welcome ${username}`;
// Displays as plain text, doesn't execute

// ✅ Method 2: Escape HTML characters
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
const safeUsername = escapeHtml(username);
element.innerHTML = `Welcome ${safeUsername}`;

// ✅ Method 3: Content Security Policy (CSP) Headers
// In your server (Express.js example)
app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'"
    );
    next();
});

// ✅ Method 4: Sanitize user input (DOMPurify library)
import DOMPurify from 'dompurify';
const dirty = "<img src=x onerror='alert(1)'>";
const clean = DOMPurify.sanitize(dirty);
element.innerHTML = clean; // Safe to use

// ✅ Method 5: React automatically escapes (when using JSX)
function Welcome({ username }) {
    return <div>Welcome {username}</div>; // Auto-escaped
}
// But be careful with dangerouslySetInnerHTML!

// ✅ Method 6: Validate and sanitize input on backend
const validator = require('validator');

function sanitizeInput(input) {
    // Remove HTML tags
    let clean = input.replace(/<[^>]*>/g, '');
    // Trim whitespace
    clean = clean.trim();
    // Escape special characters
    clean = validator.escape(clean);
    return clean;
}

// ✅ Method 7: Use HTTP-only cookies for sensitive data
res.cookie('sessionId', token, {
    httpOnly: true,  // Prevents JavaScript access
    secure: true,    // HTTPS only
    sameSite: 'strict' // CSRF protection
});
```

---

#### Additional Security Best Practices

```javascript
// 1. Input Validation
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// 2. Rate Limiting (prevents brute force)
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// 3. CORS Configuration
const cors = require('cors');
app.use(cors({
    origin: 'https://yourdomain.com',
    credentials: true
}));

// 4. Helmet.js (sets security headers)
const helmet = require('helmet');
app.use(helmet());

// 5. Password Hashing
const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash(password, 10);

// 6. JWT Token Validation
const jwt = require('jsonwebtoken');
function verifyToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid token');
    }
}

// 7. Environment Variables (never hardcode secrets)
// Use .env file
require('dotenv').config();
const dbPassword = process.env.DB_PASSWORD;
```

---

#### Security Checklist

**Frontend**:
- ✅ Escape all user input before rendering
- ✅ Use `textContent` instead of `innerHTML` when possible
- ✅ Implement Content Security Policy (CSP)
- ✅ Use DOMPurify for sanitizing HTML
- ✅ Avoid `eval()`, `Function()`, `setTimeout(string)` with user input
- ✅ Validate input on client side (but always validate on server too)

**Backend**:
- ✅ Use parameterized queries or ORMs
- ✅ Validate and sanitize all user input
- ✅ Implement rate limiting
- ✅ Use HTTPS everywhere
- ✅ Set security headers (Helmet.js)
- ✅ Use HTTP-only and Secure flags for cookies
- ✅ Hash passwords (never store plain text)
- ✅ Keep dependencies updated
- ✅ Implement proper authentication and authorization
- ✅ Log security events for monitoring

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
- **Browser Storage**: Cookies, localStorage, sessionStorage, and web storage APIs
- **Security**: SQL Injection prevention, XSS protection, and security best practices
