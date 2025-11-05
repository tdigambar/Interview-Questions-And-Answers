# Node.js Interview Questions and Answers

This comprehensive guide covers essential Node.js interview questions from basic concepts to advanced topics. Each question includes detailed answers with practical code examples.

## Table of Contents

1. [Node.js Fundamentals](#nodejs-fundamentals)
2. [Event Loop and Asynchronous Programming](#event-loop-and-asynchronous-programming)
3. [Modules and Package Management](#modules-and-package-management)
4. [Streams and Buffers](#streams-and-buffers)
5. [File System Operations](#file-system-operations)
6. [HTTP and Web Servers](#http-and-web-servers)
7. [Error Handling](#error-handling)
8. [Performance and Optimization](#performance-and-optimization)
9. [Security](#security)
10. [Testing](#testing)
11. [Advanced Topics](#advanced-topics)

---

## Node.js Fundamentals

### 1. What is Node.js and how does it work?

**Answer:**
Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. It uses an event-driven, non-blocking I/O model that makes it lightweight and efficient.

**Key Features:**
- **Single-threaded**: Uses one main thread for JavaScript execution
- **Event-driven**: Uses events and callbacks for handling operations
- **Non-blocking I/O**: I/O operations don't block the main thread
- **Cross-platform**: Runs on Windows, macOS, and Linux

**Architecture Components:**
```
┌─────────────────────────────────────┐
│     JavaScript Code (Your App)      │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│         Node.js Bindings            │
└─────────────────────────────────────┘
                 ↓
┌──────────────────┬──────────────────┐
│   V8 Engine      │     libuv        │
│ (JS Execution)   │ (Event Loop,     │
│                  │  I/O Operations) │
└──────────────────┴──────────────────┘
                 ↓
┌─────────────────────────────────────┐
│      Operating System (OS)          │
└─────────────────────────────────────┘
```

**How it works:**

1. **V8 Engine**: Compiles JavaScript to machine code
2. **libuv**: Handles asynchronous I/O operations and event loop
3. **Event Loop**: Manages callbacks and executes them when operations complete
4. **Thread Pool**: Handles file system and DNS operations (default 4 threads)

**Practical Example:**
```javascript
// Node.js uses libuv for I/O operations and V8 for JavaScript execution
const fs = require('fs');

console.log('1. Start reading file');

// Non-blocking file read - delegated to libuv
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log('3. File content:', data);
});

console.log('2. This runs immediately, not waiting for file read');

// Output order:
// 1. Start reading file
// 2. This runs immediately, not waiting for file read
// 3. File content: [file contents]

// Explanation:
// - Line 1 executes synchronously
// - fs.readFile is asynchronous - sent to libuv thread pool
// - Line 2 executes immediately (doesn't wait)
// - When file reading completes, callback is added to event loop queue
// - Callback executes when event loop processes it
```

**Why Node.js is Fast:**
- **Non-blocking**: Can handle thousands of concurrent connections
- **Event-driven**: Efficient callback mechanism
- **V8 optimization**: JIT compilation to machine code
- **Single-threaded**: No context switching overhead for JavaScript execution

### 2. What is the difference between Node.js and traditional server-side languages?

**Answer:**

| Aspect | Node.js | Traditional (PHP, Java, Python) |
|--------|---------|--------------------------------|
| **Threading Model** | Single-threaded with event loop | Multi-threaded |
| **I/O Handling** | Non-blocking, asynchronous | Blocking, synchronous |
| **Concurrency** | Event-driven | Thread-based |
| **Memory Usage** | Lower memory footprint | Higher memory usage |
| **Scalability** | Excellent for I/O intensive | Good for CPU intensive |

**Example:**
```javascript
// Node.js - Non-blocking
const http = require('http');

http.createServer((req, res) => {
  // This doesn't block other requests
  setTimeout(() => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World');
  }, 1000);
}).listen(3000);

// Traditional approach would block the thread
```

### 3. What is the global object in Node.js?

**Answer:**
The global object in Node.js is `global`, but it's different from the browser's `window` object.

**Key global properties:**
```javascript
// Process information
console.log(process.version);        // Node.js version
console.log(process.platform);       // Operating system
console.log(process.cwd());          // Current working directory

// Built-in modules (available globally)
const fs = require('fs');
const path = require('path');

// Global variables
console.log(__filename);             // Current file path
console.log(__dirname);              // Current directory path

// Timer functions
setTimeout(() => console.log('Timeout'), 1000);
setInterval(() => console.log('Interval'), 2000);
setImmediate(() => console.log('Immediate'));

// Buffer (Node.js specific)
const buf = Buffer.from('Hello World');
console.log(buf.toString());
```

---

## Event Loop and Asynchronous Programming

### 4. Explain the Node.js Event Loop

**Answer:**
The event loop is the core of Node.js's asynchronous behavior. It's a single-threaded loop that continuously checks for events and executes callbacks.

**Event Loop Architecture:**
```
   ┌───────────────────────────┐
┌─>│           timers          │  setTimeout(), setInterval()
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │  I/O callbacks deferred
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │  Internal use
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           poll            │  Retrieve new I/O events
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           check           │  setImmediate()
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──│      close callbacks      │  socket.on('close', ...)
   └───────────────────────────┘
```

**Event Loop Phases (Detailed):**

1. **Timer Phase**: 
   - Executes callbacks scheduled by `setTimeout()` and `setInterval()`
   - Checks if timer threshold has been reached
   - Executes callbacks in FIFO order

2. **Pending Callbacks**: 
   - Executes I/O callbacks that were deferred
   - Example: TCP errors like ECONNREFUSED

3. **Idle/Prepare**: 
   - Internal use only by Node.js

4. **Poll Phase** (Most important):
   - Retrieves new I/O events
   - Executes I/O related callbacks (except close, timers, setImmediate)
   - Will block here if no callbacks are pending
   - Two main functions:
     a) Calculate how long to block and poll for I/O
     b) Process events in the poll queue

5. **Check Phase**: 
   - Executes `setImmediate()` callbacks
   - Allows callbacks to execute immediately after poll phase

6. **Close Callbacks**: 
   - Executes close event callbacks
   - Example: `socket.on('close', callback)`

**Microtasks vs Macrotasks:**

**Microtasks** (Executed BEFORE next event loop phase):
- `process.nextTick()` - Highest priority
- `Promise.then()` / `Promise.catch()` / `Promise.finally()`
- `queueMicrotask()`

**Macrotasks** (Event loop phases):
- `setTimeout()` / `setInterval()`
- `setImmediate()`
- I/O operations

**Execution Order Example:**
```javascript
console.log('1. Start');

// Macrotask - Timer phase
setTimeout(() => console.log('2. setTimeout'), 0);

// Macrotask - Check phase
setImmediate(() => console.log('3. setImmediate'));

// Microtask - Highest priority
process.nextTick(() => console.log('4. nextTick'));

// Microtask - Promise queue
Promise.resolve().then(() => console.log('5. Promise'));

// Microtask queue
queueMicrotask(() => console.log('6. queueMicrotask'));

console.log('7. End');

// Output:
// 1. Start
// 7. End
// 4. nextTick          ← Microtasks execute first
// 5. Promise           ← Then promise microtasks
// 6. queueMicrotask    ← Then queued microtasks
// 2. setTimeout        ← Then macrotasks (timers)
// 3. setImmediate      ← Then check phase

// Explanation:
// 1. Synchronous code runs first (1, 7)
// 2. All microtasks execute before moving to next phase
// 3. process.nextTick has highest priority among microtasks
// 4. Then promises and queueMicrotask
// 5. Then event loop phases execute (timers, check)
```

**Complex Example:**
```javascript
console.log('Script start');

setTimeout(() => {
  console.log('setTimeout 1');
  Promise.resolve().then(() => console.log('Promise in setTimeout 1'));
}, 0);

Promise.resolve()
  .then(() => {
    console.log('Promise 1');
    process.nextTick(() => console.log('nextTick in Promise 1'));
  })
  .then(() => console.log('Promise 2'));

process.nextTick(() => {
  console.log('nextTick 1');
  process.nextTick(() => console.log('nextTick 2'));
});

setTimeout(() => {
  console.log('setTimeout 2');
}, 0);

console.log('Script end');

// Output:
// Script start
// Script end
// nextTick 1
// nextTick 2
// Promise 1
// Promise 2
// nextTick in Promise 1
// setTimeout 1
// Promise in setTimeout 1
// setTimeout 2
```

**Key Takeaways:**
- Event loop is single-threaded but can handle concurrent operations
- Microtasks always execute before next event loop phase
- `process.nextTick()` has highest priority
- Understanding phases helps predict execution order
- I/O operations are handled by libuv thread pool

### 5. What's the difference between setImmediate and setTimeout(0)?

**Answer:**

While both `setImmediate()` and `setTimeout(0)` appear to execute callbacks "immediately", they behave differently due to how they're processed in the Node.js event loop.

#### Key Differences

| Feature | setTimeout(0) | setImmediate() |
|---------|---------------|----------------|
| **Event Loop Phase** | Timers phase | Check phase |
| **Execution Order** | Varies in main module | Predictable in I/O callbacks |
| **Use Case** | Delay execution to next event loop iteration | Execute after I/O operations |
| **Minimum Delay** | 1ms (not truly 0) | None |
| **When to Use** | Need to defer to next loop | Need to execute after I/O |

---

#### How They Work

**setTimeout(0):**
- Executes in the **Timers phase** (first phase of event loop)
- Has a minimum delay of 1-4ms (not truly 0)
- Order can be non-deterministic in the main module
- Checks if timer threshold has been reached

**setImmediate():**
- Executes in the **Check phase** (after I/O polling)
- No minimum delay
- Always executes after I/O callbacks
- More predictable in I/O contexts

---

#### Example 1: Main Module (Non-deterministic)

```javascript
// Running in main module
setTimeout(() => {
  console.log('setTimeout');
}, 0);

setImmediate(() => {
  console.log('setImmediate');
});

// Output can be either:
// setTimeout
// setImmediate
// OR
// setImmediate
// setTimeout

// Why? It depends on when the event loop starts
// If loop starts before timer is ready, setImmediate runs first
// If timer is ready when loop starts, setTimeout runs first
```

---

#### Example 2: Inside I/O Callback (Deterministic)

```javascript
const fs = require('fs');

fs.readFile(__filename, () => {
  // Inside I/O callback, order is ALWAYS deterministic
  setTimeout(() => {
    console.log('setTimeout in I/O');
  }, 0);
  
  setImmediate(() => {
    console.log('setImmediate in I/O');
  });
});

// Output is ALWAYS:
// setImmediate in I/O
// setTimeout in I/O

// Why? After I/O callbacks, event loop goes to Check phase (setImmediate)
// Then completes the loop and starts again at Timers phase (setTimeout)
```

---

#### Example 3: Event Loop Phases

```javascript
const fs = require('fs');

console.log('1. Start');

setTimeout(() => {
  console.log('2. setTimeout 0');
}, 0);

setImmediate(() => {
  console.log('3. setImmediate');
});

fs.readFile(__filename, () => {
  console.log('4. I/O callback');
  
  setTimeout(() => {
    console.log('5. setTimeout in I/O');
  }, 0);
  
  setImmediate(() => {
    console.log('6. setImmediate in I/O');
  });
  
  process.nextTick(() => {
    console.log('7. nextTick in I/O');
  });
});

process.nextTick(() => {
  console.log('8. nextTick');
});

console.log('9. End');

// Guaranteed Output Order:
// 1. Start
// 9. End
// 8. nextTick
// 2. setTimeout 0 (or 3)
// 3. setImmediate (or 2)
// 4. I/O callback
// 7. nextTick in I/O
// 6. setImmediate in I/O
// 5. setTimeout in I/O
```

---

#### Example 4: Recursive Scheduling

```javascript
// Using setTimeout(0) - can starve other operations
let count = 0;
function recursiveTimeout() {
  console.log(`setTimeout: ${++count}`);
  if (count < 3) {
    setTimeout(recursiveTimeout, 0);
  }
}
recursiveTimeout();

// Using setImmediate - allows I/O operations between iterations
let count2 = 0;
function recursiveImmediate() {
  console.log(`setImmediate: ${++count2}`);
  if (count2 < 3) {
    setImmediate(recursiveImmediate);
  }
}
recursiveImmediate();

// setImmediate is better for recursive operations
// It yields to I/O operations between each iteration
```

---

#### Example 5: Long-Running Task

```javascript
// ❌ BAD: Using setTimeout(0) for breaking up work
function processArray(array) {
  let index = 0;
  
  function processChunk() {
    const chunk = array.slice(index, index + 1000);
    // Process chunk...
    
    index += 1000;
    if (index < array.length) {
      setTimeout(processChunk, 0); // Less predictable
    }
  }
  
  processChunk();
}

// ✅ GOOD: Using setImmediate for breaking up work
function processArrayBetter(array) {
  let index = 0;
  
  function processChunk() {
    const chunk = array.slice(index, index + 1000);
    // Process chunk...
    
    index += 1000;
    if (index < array.length) {
      setImmediate(processChunk); // More predictable, better for I/O
    }
  }
  
  processChunk();
}
```

---

#### Example 6: HTTP Server Context

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  // Inside an I/O callback (HTTP request)
  
  setTimeout(() => {
    console.log('setTimeout in HTTP');
  }, 0);
  
  setImmediate(() => {
    console.log('setImmediate in HTTP');
    res.end('Response sent');
  });
  
  // Output will ALWAYS be:
  // setImmediate in HTTP
  // setTimeout in HTTP
});

server.listen(3000);
```

---

#### Example 7: Measuring Execution Time

```javascript
// setTimeout(0) - minimum 1ms delay
const start1 = Date.now();
setTimeout(() => {
  console.log(`setTimeout delay: ${Date.now() - start1}ms`);
  // Usually 1-4ms
}, 0);

// setImmediate - no minimum delay
const start2 = Date.now();
setImmediate(() => {
  console.log(`setImmediate delay: ${Date.now() - start2}ms`);
  // Usually < 1ms in I/O context
});
```

---

#### When to Use Which?

**Use `setTimeout(0)` when:**
- ❌ Actually, there's rarely a good reason to use `setTimeout(0)`
- You need backward compatibility with browser code
- You specifically need timer phase behavior

**Use `setImmediate()` when:**
- ✅ Breaking up CPU-intensive operations
- ✅ Deferring execution after I/O operations
- ✅ Recursive operations that should yield to I/O
- ✅ In Node.js-specific code
- ✅ Need predictable behavior in I/O contexts

---

#### Performance Comparison

```javascript
// Benchmark
const iterations = 10000;

// setTimeout(0) benchmark
console.time('setTimeout(0)');
let count1 = 0;
function timeoutTest() {
  if (++count1 < iterations) {
    setTimeout(timeoutTest, 0);
  } else {
    console.timeEnd('setTimeout(0)');
  }
}
timeoutTest();

// setImmediate benchmark
console.time('setImmediate');
let count2 = 0;
function immediateTest() {
  if (++count2 < iterations) {
    setImmediate(immediateTest);
  } else {
    console.timeEnd('setImmediate');
  }
}
immediateTest();

// setImmediate is typically faster
```

---

#### Common Pitfalls

```javascript
// ❌ PITFALL 1: Expecting setTimeout(0) to be instant
setTimeout(() => {
  console.log('This is NOT instant');
}, 0);
// Still has ~1ms delay

// ❌ PITFALL 2: Assuming consistent order in main module
setTimeout(() => console.log('A'), 0);
setImmediate(() => console.log('B'));
// Order is NOT guaranteed in main module

// ✅ SOLUTION: Use in I/O context for deterministic behavior
fs.readFile('file.txt', () => {
  setTimeout(() => console.log('A'), 0);
  setImmediate(() => console.log('B'));
  // B will ALWAYS come before A
});

// ❌ PITFALL 3: Using setTimeout(0) for recursive operations
function recursive() {
  doWork();
  setTimeout(recursive, 0); // Can starve I/O
}

// ✅ SOLUTION: Use setImmediate
function recursive() {
  doWork();
  setImmediate(recursive); // Allows I/O between iterations
}
```

---

#### Browser vs Node.js

```javascript
// In browsers: setImmediate doesn't exist (except IE/Edge legacy)
// In Node.js: Both exist but behave differently

// Browser alternative to setImmediate:
if (typeof setImmediate === 'undefined') {
  var setImmediate = function(callback) {
    setTimeout(callback, 0);
  };
}

// Node.js-specific code should use setImmediate
// Browser/universal code should use setTimeout
```

---

#### Best Practices

1. **✅ Prefer `setImmediate()` in Node.js**
   - More predictable in I/O contexts
   - Better for recursive operations
   - Doesn't have minimum delay

2. **✅ Use `setTimeout()` for actual delays**
   - When you need a specific delay time
   - `setTimeout(callback, 100)` not `setTimeout(callback, 0)`

3. **✅ Use `process.nextTick()` for microtasks**
   - When you need to execute before any I/O
   - But be careful of starving the event loop

4. **✅ Break up long operations**
   - Use `setImmediate()` to yield to I/O
   - Keep event loop responsive

---

#### Summary

| Aspect | setTimeout(0) | setImmediate() |
|--------|---------------|----------------|
| **Actual delay** | ~1-4ms minimum | No minimum delay |
| **Event loop phase** | Timers (first) | Check (after I/O) |
| **In main module** | Order varies | Order varies |
| **In I/O callback** | Runs second | Runs first |
| **Best for** | Specific delays | Breaking up work |
| **Recommendation** | Use with actual delay | Prefer in Node.js |

**Key Takeaway:** In Node.js, prefer `setImmediate()` for deferring execution, especially within I/O callbacks. Reserve `setTimeout()` for when you actually need a delay.

### 6. What are microtasks and macrotasks?

**Answer:**

**Microtasks** (higher priority):
- `process.nextTick()`
- `Promise.then()`
- `queueMicrotask()`

**Macrotasks** (lower priority):
- `setTimeout()`
- `setInterval()`
- `setImmediate()`
- I/O operations

**Execution Order:**
```javascript
console.log('1. Sync');

setTimeout(() => console.log('2. setTimeout'), 0);
setImmediate(() => console.log('3. setImmediate'));

process.nextTick(() => console.log('4. nextTick'));
Promise.resolve().then(() => console.log('5. Promise'));
queueMicrotask(() => console.log('6. queueMicrotask'));

console.log('7. Sync End');

// Output:
// 1. Sync
// 7. Sync End
// 4. nextTick
// 5. Promise
// 6. queueMicrotask
// 2. setTimeout
// 3. setImmediate
```

### 7. How do you handle blocking operations in Node.js?

**Answer:**

Node.js runs on a single-threaded event loop. Blocking operations (CPU-intensive tasks or synchronous I/O) freeze the entire application, preventing it from handling other requests or events.

#### What are Blocking Operations?

**Blocking operations include:**
- Heavy computations (cryptography, image processing, data processing)
- Synchronous file operations (`fs.readFileSync`, `fs.writeFileSync`)
- Large loops without yielding control
- JSON parsing of huge payloads
- Complex regex operations on large strings
- Synchronous database queries

#### Why Blocking is Problematic

```javascript
// ❌ BAD: Blocks the event loop
function calculatePrimes(max) {
  const primes = [];
  for (let i = 2; i < max; i++) {
    let isPrime = true;
    for (let j = 2; j < i; j++) {
      if (i % j === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) primes.push(i);
  }
  return primes;
}

app.get('/primes', (req, res) => {
  const primes = calculatePrimes(100000); // Blocks for seconds!
  res.json(primes);
});

// During this calculation, ALL other requests are blocked!
```

---

#### Solutions to Handle Blocking Operations

#### **1. Use Asynchronous APIs**

Always prefer async versions of Node.js APIs:

```javascript
// ❌ BAD: Synchronous (blocking)
const data = fs.readFileSync('large-file.txt', 'utf8');
console.log(data);

// ✅ GOOD: Asynchronous (non-blocking)
fs.readFile('large-file.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});

// ✅ BETTER: Using promises
const data = await fs.promises.readFile('large-file.txt', 'utf8');
console.log(data);
```

---

#### **2. Use Worker Threads for CPU-Intensive Tasks**

Worker threads allow you to run JavaScript code in parallel threads:

```javascript
// worker.js - Separate file for worker code
const { parentPort } = require('worker_threads');

parentPort.on('message', ({ num }) => {
  const result = fibonacci(num);
  parentPort.postMessage(result);
});

function fibonacci(n) {
  if (n < 2) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// main.js - Main application file
const { Worker } = require('worker_threads');

function runWorker(workerData) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./worker.js');
    
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
    
    worker.postMessage(workerData);
  });
}

// Express route example
app.get('/fibonacci/:num', async (req, res) => {
  try {
    const result = await runWorker({ num: parseInt(req.params.num) });
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Worker Thread Pool Example:**

```javascript
const { Worker } = require('worker_threads');

class WorkerPool {
  constructor(workerPath, numWorkers = 4) {
    this.workerPath = workerPath;
    this.numWorkers = numWorkers;
    this.workers = [];
    this.freeWorkers = [];
    this.queue = [];

    this.init();
  }

  init() {
    for (let i = 0; i < this.numWorkers; i++) {
      const worker = new Worker(this.workerPath);
      this.workers.push(worker);
      this.freeWorkers.push(worker);
    }
  }

  runTask(data) {
    return new Promise((resolve, reject) => {
      const task = { data, resolve, reject };

      if (this.freeWorkers.length > 0) {
        this.executeTask(task);
      } else {
        this.queue.push(task);
      }
    });
  }

  executeTask(task) {
    const worker = this.freeWorkers.pop();

    worker.once('message', (result) => {
      task.resolve(result);
      this.freeWorkers.push(worker);
      
      if (this.queue.length > 0) {
        this.executeTask(this.queue.shift());
      }
    });

    worker.once('error', (error) => {
      task.reject(error);
      this.freeWorkers.push(worker);
    });

    worker.postMessage(task.data);
  }

  destroy() {
    this.workers.forEach(worker => worker.terminate());
  }
}

// Usage
const pool = new WorkerPool('./worker.js', 4);

app.get('/process/:data', async (req, res) => {
  try {
    const result = await pool.runTask({ data: req.params.data });
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

#### **3. Use setImmediate to Break Up Long Operations**

Split CPU-intensive tasks into smaller chunks and yield control back to the event loop:

```javascript
// ❌ BAD: Blocks the event loop
function processLargeArray(array) {
  return array.map(item => {
    // CPU-intensive operation
    return expensiveCalculation(item);
  });
}

// ✅ GOOD: Non-blocking with setImmediate
function processLargeArrayAsync(array, callback) {
  let index = 0;
  const results = [];
  const chunkSize = 1000;
  
  function processChunk() {
    const end = Math.min(index + chunkSize, array.length);
    
    // Process chunk
    for (let i = index; i < end; i++) {
      results.push(expensiveCalculation(array[i]));
    }
    
    index = end;
    
    if (index < array.length) {
      // Yield control back to event loop
      setImmediate(processChunk);
    } else {
      callback(null, results);
    }
  }
  
  processChunk();
}

// Promise-based version
function processLargeArrayPromise(array) {
  return new Promise((resolve, reject) => {
    processLargeArrayAsync(array, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
}

// Usage
app.get('/process', async (req, res) => {
  try {
    const results = await processLargeArrayPromise(largeArray);
    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

#### **4. Use Child Processes**

For completely isolated tasks or running external programs:

```javascript
const { fork } = require('child_process');

// heavy-task.js
process.on('message', (data) => {
  const result = performHeavyComputation(data);
  process.send(result);
});

function performHeavyComputation(data) {
  // CPU-intensive work
  let result = 0;
  for (let i = 0; i < 1000000000; i++) {
    result += Math.sqrt(i);
  }
  return result;
}

// main.js
function runHeavyTask(data) {
  return new Promise((resolve, reject) => {
    const child = fork('./heavy-task.js');
    
    child.send(data);
    
    child.on('message', (result) => {
      resolve(result);
      child.kill();
    });
    
    child.on('error', reject);
  });
}

app.get('/heavy', async (req, res) => {
  try {
    const result = await runHeavyTask(req.query.data);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

#### **5. Use Streams for Large Data**

Process data in chunks instead of loading everything into memory:

```javascript
// ❌ BAD: Load entire file into memory
app.get('/large-file', (req, res) => {
  const data = fs.readFileSync('huge-file.txt', 'utf8');
  res.send(data);
});

// ✅ GOOD: Stream the file
app.get('/large-file', (req, res) => {
  const stream = fs.createReadStream('huge-file.txt', 'utf8');
  stream.pipe(res);
});

// Transform stream for processing
const { Transform } = require('stream');

class UpperCaseTransform extends Transform {
  _transform(chunk, encoding, callback) {
    // Process chunk without blocking
    this.push(chunk.toString().toUpperCase());
    callback();
  }
}

app.get('/process-file', (req, res) => {
  fs.createReadStream('input.txt')
    .pipe(new UpperCaseTransform())
    .pipe(res);
});
```

---

#### **6. Offload to External Services**

Use message queues or external services for heavy processing:

```javascript
// Using Bull Queue (Redis-backed)
const Queue = require('bull');
const imageQueue = new Queue('image-processing');

// Add job to queue (non-blocking)
app.post('/process-image', async (req, res) => {
  const job = await imageQueue.add({
    imageUrl: req.body.url,
    userId: req.user.id
  });
  
  res.json({ jobId: job.id, status: 'queued' });
});

// Worker process (separate process)
imageQueue.process(async (job) => {
  const { imageUrl, userId } = job.data;
  
  // CPU-intensive image processing
  const result = await processImage(imageUrl);
  
  // Store result
  await saveResult(userId, result);
  
  return result;
});

// Check job status
app.get('/job/:id', async (req, res) => {
  const job = await imageQueue.getJob(req.params.id);
  const state = await job.getState();
  
  res.json({ state, result: job.returnvalue });
});
```

---

#### **7. Use Cluster Module for Multi-Core Utilization**

Run multiple Node.js processes to utilize all CPU cores:

```javascript
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers for each CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    // Restart the worker
    cluster.fork();
  });
} else {
  // Workers share the TCP connection
  http.createServer((req, res) => {
    // CPU-intensive work distributed across workers
    const result = heavyComputation();
    res.writeHead(200);
    res.end(`Result: ${result}\n`);
  }).listen(8000);

  console.log(`Worker ${process.pid} started`);
}
```

---

#### **Best Practices Summary**

| Strategy | Use Case | Pros | Cons |
|----------|----------|------|------|
| **Async APIs** | I/O operations | Simple, built-in | Only for I/O |
| **Worker Threads** | CPU-intensive tasks | True parallelism | Memory overhead |
| **setImmediate** | Long loops | Simple, no dependencies | Still CPU-bound |
| **Child Processes** | Isolated tasks | Complete isolation | Higher overhead |
| **Streams** | Large data | Memory efficient | More complex |
| **Message Queues** | Background jobs | Scalable, resilient | External dependency |
| **Cluster** | Utilize all cores | Better throughput | More complex |

#### **Monitoring Blocking Operations**

```javascript
// Detect event loop blocking
const { monitorEventLoopDelay } = require('perf_hooks');

const h = monitorEventLoopDelay({ resolution: 20 });
h.enable();

setInterval(() => {
  const delay = h.mean / 1000000; // Convert to milliseconds
  console.log(`Event loop delay: ${delay.toFixed(2)}ms`);
  
  if (delay > 100) {
    console.warn('Event loop is significantly delayed!');
  }
  
  h.reset();
}, 1000);
```

---

#### **Key Takeaways**

1. ✅ **Always use async APIs** for I/O operations
2. ✅ **Use Worker Threads** for CPU-intensive tasks
3. ✅ **Break up long operations** with setImmediate
4. ✅ **Use streams** for large data processing
5. ✅ **Monitor event loop** delay in production
6. ✅ **Consider external services** for heavy processing
7. ✅ **Profile your code** to identify bottlenecks

**Remember:** Node.js excels at I/O-bound tasks but struggles with CPU-bound operations. Choose the right tool for your specific use case!

---

## Modules and Package Management

### 8. Explain the module system in Node.js

**Answer:**
Node.js uses CommonJS module system by default, with support for ES modules.

**CommonJS (require/module.exports):**
```javascript
// math.js
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

module.exports = {
  add,
  subtract
};

// Or individual exports
exports.multiply = (a, b) => a * b;
exports.divide = (a, b) => a / b;

// app.js
const math = require('./math');
const { add, subtract } = require('./math');

console.log(math.add(5, 3));        // 8
console.log(subtract(10, 4));       // 6
```

**ES Modules:**
```javascript
// math.mjs
export function add(a, b) {
  return a + b;
}

export default function subtract(a, b) {
  return a - b;
}

// app.mjs
import subtract, { add } from './math.mjs';
console.log(add(5, 3));             // 8
console.log(subtract(10, 4));       // 6
```

### 9. What is the difference between require() and import?

**Answer:**

| Feature | require() | import |
|---------|-----------|---------|
| **Loading** | Synchronous | Asynchronous |
| **Hoisting** | No | Yes |
| **Conditional** | Yes | No (top-level only) |
| **File Extension** | Optional | Required for local files |
| **Default Export** | module.exports | export default |

**Examples:**
```javascript
// require() - CommonJS
const fs = require('fs');
const path = require('path');

// Conditional loading
if (condition) {
  const module = require('./module');
}

// import - ES Modules
import fs from 'fs';
import { readFile } from 'fs/promises';
import * as path from 'path';

// Dynamic import (async)
const module = await import('./module.mjs');
```

### 10. How does npm work and what are the different types of dependencies?

**Answer:**
npm (Node Package Manager) is the default package manager for Node.js.

**Dependency Types:**
```json
{
  "dependencies": {
    "express": "^4.18.0"        // Production dependencies
  },
  "devDependencies": {
    "jest": "^29.0.0"           // Development dependencies
  },
  "peerDependencies": {
    "react": ">=16.8.0"         // Peer dependencies
  },
  "optionalDependencies": {
    "fsevents": "^2.3.0"        // Optional dependencies
  }
}
```

**Key npm commands:**
```bash
npm install                    # Install all dependencies
npm install package-name       # Install production dependency
npm install -D package-name    # Install dev dependency
npm install -g package-name    # Install globally
npm update                     # Update dependencies
npm audit                      # Security audit
npm run script-name           # Run npm script
```

---

## Streams and Buffers

### 11. What are streams in Node.js?

**Answer:**
Streams are objects that let you read data from a source or write data to a destination in a continuous fashion. They process data piece by piece (chunks) instead of loading everything into memory.

**Why use Streams?**
- **Memory efficient**: Process large files without loading entire file into memory
- **Time efficient**: Start processing data before all data is available
- **Composable**: Chain multiple operations together

**Types of Streams:**

1. **Readable Stream**: Read data from a source
   - Examples: `fs.createReadStream()`, `http.IncomingMessage`, `process.stdin`
   
2. **Writable Stream**: Write data to a destination
   - Examples: `fs.createWriteStream()`, `http.ServerResponse`, `process.stdout`
   
3. **Duplex Stream**: Both readable and writable
   - Examples: `net.Socket`, `TCP sockets`
   
4. **Transform Stream**: Modify data while reading/writing
   - Examples: `zlib.createGzip()`, `crypto.createCipher()`

**Stream Flow:**
```
Source → Readable Stream → Transform Stream → Writable Stream → Destination
(File)                     (Compress/Encrypt)                   (File/Network)
```

**Basic Stream Example:**
```javascript
const fs = require('fs');

// Without streams - loads entire file into memory (BAD for large files)
fs.readFile('large-file.txt', (err, data) => {
  if (err) throw err;
  console.log(data); // Entire file in memory
});

// With streams - processes data in chunks (GOOD for large files)
const readable = fs.createReadStream('large-file.txt', {
  encoding: 'utf8',
  highWaterMark: 16 * 1024 // 16KB chunks (default is 64KB)
});

readable.on('data', (chunk) => {
  console.log('Received chunk:', chunk.length, 'bytes');
  // Process chunk
});

readable.on('end', () => {
  console.log('Finished reading file');
});

readable.on('error', (err) => {
  console.error('Error:', err);
});
```

**Transform Stream Example:**
```javascript
const { Transform } = require('stream');
const fs = require('fs');

// Create custom transform stream
const upperCaseTransform = new Transform({
  transform(chunk, encoding, callback) {
    // Convert chunk to uppercase
    this.push(chunk.toString().toUpperCase());
    callback();
  }
});

// Another transform example - line counter
const lineCounter = new Transform({
  constructor() {
    super();
    this.lineCount = 0;
  },
  transform(chunk, encoding, callback) {
    const lines = chunk.toString().split('\n').length - 1;
    this.lineCount += lines;
    this.push(chunk); // Pass through unchanged
    callback();
  },
  flush(callback) {
    console.log(`Total lines: ${this.lineCount}`);
    callback();
  }
});

// Chain streams together
fs.createReadStream('input.txt')
  .pipe(upperCaseTransform)
  .pipe(fs.createWriteStream('output.txt'))
  .on('finish', () => {
    console.log('File processing complete');
  });
```

**Pipeline (Recommended Approach):**
```javascript
const { pipeline } = require('stream');
const fs = require('fs');
const zlib = require('zlib');

// Pipeline handles errors and cleanup automatically
pipeline(
  fs.createReadStream('input.txt'),
  zlib.createGzip(), // Compress
  fs.createWriteStream('input.txt.gz'),
  (err) => {
    if (err) {
      console.error('Pipeline failed:', err);
    } else {
      console.log('Pipeline succeeded');
    }
  }
);

// Complex pipeline example
const { Transform } = require('stream');

const addTimestamp = new Transform({
  transform(chunk, encoding, callback) {
    const line = chunk.toString();
    const timestamped = `[${new Date().toISOString()}] ${line}`;
    callback(null, timestamped);
  }
});

pipeline(
  fs.createReadStream('app.log'),
  addTimestamp,
  zlib.createGzip(),
  fs.createWriteStream('app.log.gz'),
  (err) => {
    if (err) {
      console.error('Log compression failed:', err);
    } else {
      console.log('Log compressed successfully');
    }
  }
);
```

**Readable Stream Modes:**

1. **Flowing Mode**: Data flows automatically
```javascript
const readable = fs.createReadStream('file.txt');

readable.on('data', (chunk) => {
  console.log('Received:', chunk);
});
```

2. **Paused Mode**: Data must be explicitly read
```javascript
const readable = fs.createReadStream('file.txt');

readable.on('readable', () => {
  let chunk;
  while ((chunk = readable.read()) !== null) {
    console.log('Received:', chunk);
  }
});
```

**Backpressure Handling:**
```javascript
const fs = require('fs');

const readable = fs.createReadStream('large-file.txt');
const writable = fs.createWriteStream('output.txt');

readable.on('data', (chunk) => {
  // write() returns false if internal buffer is full
  const canContinue = writable.write(chunk);
  
  if (!canContinue) {
    // Pause reading until drain event
    readable.pause();
  }
});

// Resume reading when writable is ready
writable.on('drain', () => {
  readable.resume();
});

readable.on('end', () => {
  writable.end();
});

// Or use pipe() which handles backpressure automatically
readable.pipe(writable);
```

**Real-world Use Cases:**
```javascript
// 1. File upload with progress
const http = require('http');
const fs = require('fs');

http.createServer((req, res) => {
  if (req.method === 'POST') {
    let bytesReceived = 0;
    const writable = fs.createWriteStream('upload.file');
    
    req.on('data', (chunk) => {
      bytesReceived += chunk.length;
      console.log(`Received: ${bytesReceived} bytes`);
    });
    
    req.pipe(writable);
    
    writable.on('finish', () => {
      res.end('Upload complete');
    });
  }
}).listen(3000);

// 2. CSV processing
const { Transform } = require('stream');
const fs = require('fs');

const csvParser = new Transform({
  transform(chunk, encoding, callback) {
    const lines = chunk.toString().split('\n');
    lines.forEach(line => {
      const [name, age, city] = line.split(',');
      const json = JSON.stringify({ name, age, city }) + '\n';
      this.push(json);
    });
    callback();
  }
});

fs.createReadStream('data.csv')
  .pipe(csvParser)
  .pipe(fs.createWriteStream('data.json'));
```

**Key Benefits:**
- **Memory Efficiency**: Process 1GB file with 10MB memory
- **Time Efficiency**: Start processing immediately
- **Composability**: Chain operations easily
- **Backpressure**: Automatic flow control

### 12. What is a Buffer in Node.js?

**Answer:**
Buffer is a global class in Node.js for handling binary data. It's similar to an array of integers but corresponds to raw memory allocation.

**Buffer Operations:**
```javascript
// Creating buffers
const buf1 = Buffer.alloc(10);           // Creates 10-byte buffer filled with zeros
const buf2 = Buffer.allocUnsafe(10);     // Creates 10-byte buffer (may contain old data)
const buf3 = Buffer.from('Hello');       // Creates buffer from string
const buf4 = Buffer.from([1, 2, 3, 4]);  // Creates buffer from array

// Buffer methods
console.log(buf3.toString());            // 'Hello'
console.log(buf3.length);                // 5
console.log(buf3[0]);                    // 72 (ASCII value of 'H')

// Writing to buffer
buf1.write('Hello', 0);
console.log(buf1.toString());            // 'Hello'

// Buffer comparison
const buf5 = Buffer.from('Hello');
const buf6 = Buffer.from('Hello');
console.log(Buffer.compare(buf5, buf6)); // 0 (equal)

// Concatenating buffers
const combined = Buffer.concat([buf3, Buffer.from(' World')]);
console.log(combined.toString());        // 'Hello World'
```

---

## File System Operations

### 13. How do you handle file operations in Node.js?

**Answer:**
Node.js provides both synchronous and asynchronous file operations through the `fs` module.

**Asynchronous Operations:**
```javascript
const fs = require('fs');
const fsPromises = require('fs/promises');

// Callback-based
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  console.log(data);
});

// Promise-based
fsPromises.readFile('file.txt', 'utf8')
  .then(data => console.log(data))
  .catch(err => console.error('Error:', err));

// Async/await
async function readFile() {
  try {
    const data = await fsPromises.readFile('file.txt', 'utf8');
    console.log(data);
  } catch (err) {
    console.error('Error:', err);
  }
}
```

**File Operations:**
```javascript
// Writing files
await fsPromises.writeFile('output.txt', 'Hello World');

// Appending to files
await fsPromises.appendFile('log.txt', 'New log entry\n');

// Reading directory
const files = await fsPromises.readdir('./');
console.log(files);

// File stats
const stats = await fsPromises.stat('file.txt');
console.log(stats.isFile());     // true
console.log(stats.size);         // file size in bytes

// Creating directories
await fsPromises.mkdir('new-directory', { recursive: true });

// Removing files/directories
await fsPromises.unlink('file.txt');
await fsPromises.rmdir('directory');
```

---

## HTTP and Web Servers

### 14. How do you create an HTTP server in Node.js?

**Answer:**
Node.js provides the built-in `http` module for creating HTTP servers.

**Basic HTTP Server:**
```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  // Set response headers
  res.writeHead(200, {
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin': '*'
  });
  
  // Handle different routes
  if (req.url === '/') {
    res.end('Hello World!');
  } else if (req.url === '/api/users') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ users: ['John', 'Jane'] }));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

**Handling POST Data:**
```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ received: data }));
      } catch (err) {
        res.writeHead(400);
        res.end('Invalid JSON');
      }
    });
  } else {
    res.writeHead(405);
    res.end('Method not allowed');
  }
});
```

### 15. What is middleware in Express.js?

**Answer:**
Middleware functions are functions that have access to the request object (req), response object (res), and the next middleware function in the application's request-response cycle.

**Types of Middleware:**
```javascript
const express = require('express');
const app = express();

// Application-level middleware
app.use((req, res, next) => {
  console.log('Request received:', req.method, req.url);
  next(); // Pass control to next middleware
});

// Built-in middleware
app.use(express.json());        // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Custom middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  // Verify token logic here
  next();
};

// Route-specific middleware
app.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Protected route accessed' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
```

---

## Error Handling

### 16. How do you handle errors in Node.js?

**Answer:**
Node.js provides several mechanisms for error handling.

**1. Try-Catch for Synchronous Code:**
```javascript
try {
  const data = JSON.parse(invalidJson);
} catch (error) {
  console.error('JSON parse error:', error.message);
}
```

**2. Callback Error Handling:**
```javascript
const fs = require('fs');

fs.readFile('nonexistent.txt', (err, data) => {
  if (err) {
    console.error('File read error:', err.message);
    return;
  }
  console.log(data);
});
```

**3. Promise Error Handling:**
```javascript
const fsPromises = require('fs/promises');

fsPromises.readFile('nonexistent.txt')
  .then(data => console.log(data))
  .catch(err => console.error('Error:', err.message));

// Or with async/await
async function readFile() {
  try {
    const data = await fsPromises.readFile('nonexistent.txt');
    console.log(data);
  } catch (err) {
    console.error('Error:', err.message);
  }
}
```

**4. Global Error Handling:**
```javascript
// Uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});
```

---

## Performance and Optimization

### 17. How do you optimize Node.js performance?

**Answer:**
Several strategies can improve Node.js performance:

**1. Use Clustering:**

Clustering allows you to create multiple Node.js processes (workers) that share the same server port, utilizing all CPU cores.

**How Clustering Works:**
```
┌─────────────────────────────────────┐
│         Master Process              │
│      (Manages Workers)              │
└──────────┬──────────────────────────┘
           │
    ┌──────┴──────┬──────────┬────────┐
    │             │          │        │
┌───▼───┐   ┌───▼───┐  ┌───▼───┐  ┌──▼────┐
│Worker1│   │Worker2│  │Worker3│  │Worker4│
│(CPU 1)│   │(CPU 2)│  │(CPU 3)│  │(CPU 4)│
└───────┘   └───────┘  └───────┘  └───────┘
```

**Basic Clustering:**
```javascript
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  console.log(`Forking ${numCPUs} workers...`);
  
  // Fork workers (one per CPU core)
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  // Handle worker exit
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    console.log('Starting a new worker...');
    cluster.fork(); // Restart worker automatically
  });
  
  // Track online workers
  cluster.on('online', (worker) => {
    console.log(`Worker ${worker.process.pid} is online`);
  });
  
} else {
  // Worker process - runs your application
  const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`Handled by process ${process.pid}\n`);
  });
  
  server.listen(3000);
  console.log(`Worker ${process.pid} started`);
}
```

**Advanced Clustering with Load Balancing:**
```javascript
const cluster = require('cluster');
const express = require('express');
const os = require('os');

if (cluster.isMaster) {
  const numWorkers = os.cpus().length;
  
  console.log(`Master cluster setting up ${numWorkers} workers...`);
  
  // Track worker metrics
  const workers = {};
  
  for (let i = 0; i < numWorkers; i++) {
    const worker = cluster.fork();
    workers[worker.id] = {
      pid: worker.process.pid,
      requests: 0
    };
  }
  
  // Communication between master and workers
  Object.values(cluster.workers).forEach(worker => {
    worker.on('message', (msg) => {
      if (msg.cmd === 'notifyRequest') {
        workers[worker.id].requests++;
        console.log(`Worker ${worker.id} handled request. Total: ${workers[worker.id].requests}`);
      }
    });
  });
  
  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('Master received SIGTERM, shutting down workers...');
    Object.values(cluster.workers).forEach(worker => {
      worker.kill();
    });
  });
  
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died with code ${code}`);
    delete workers[worker.id];
    
    // Don't restart if intentional shutdown
    if (signal !== 'SIGTERM') {
      const newWorker = cluster.fork();
      workers[newWorker.id] = {
        pid: newWorker.process.pid,
        requests: 0
      };
    }
  });
  
} else {
  // Worker process
  const app = express();
  
  app.get('/', (req, res) => {
    // Notify master of request
    process.send({ cmd: 'notifyRequest' });
    
    res.send(`Worker ${process.pid} handled request`);
  });
  
  // Simulate CPU-intensive task
  app.get('/heavy', (req, res) => {
    const start = Date.now();
    // CPU-intensive operation
    let result = 0;
    for (let i = 0; i < 1e7; i++) {
      result += Math.sqrt(i);
    }
    const duration = Date.now() - start;
    res.send(`Worker ${process.pid} completed in ${duration}ms`);
  });
  
  app.listen(3000, () => {
    console.log(`Worker ${process.pid} listening on port 3000`);
  });
}
```

**Zero-Downtime Restart:**
```javascript
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  // Graceful restart function
  function restartWorkers() {
    const workers = Object.values(cluster.workers);
    
    const restartWorker = (workerIndex) => {
      const worker = workers[workerIndex];
      if (!worker) return;
      
      // Disconnect worker (stops accepting new connections)
      worker.disconnect();
      
      // Fork new worker
      const newWorker = cluster.fork();
      
      // When new worker is ready, kill old worker
      newWorker.on('listening', () => {
        worker.kill();
        
        // Restart next worker after delay
        setTimeout(() => {
          restartWorker(workerIndex + 1);
        }, 1000);
      });
    };
    
    restartWorker(0);
  }
  
  // Trigger restart on SIGUSR2 signal
  process.on('SIGUSR2', () => {
    console.log('Received SIGUSR2, restarting workers...');
    restartWorkers();
  });
  
} else {
  require('./app.js');
}
```

**Benefits of Clustering:**
- Utilizes all CPU cores
- Automatic load balancing
- Process isolation (one crash doesn't affect others)
- Zero-downtime deployments
- Increased throughput

**When to Use:**
- Production environments
- CPU-bound operations
- High-traffic applications
- Need for high availability

**2. Use Worker Threads for CPU-intensive tasks:**
```javascript
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename, {
    workerData: { numbers: [1, 2, 3, 4, 5] }
  });
  
  worker.on('message', (result) => {
    console.log('Result:', result);
  });
} else {
  const { numbers } = workerData;
  const result = numbers.map(n => n * n);
  parentPort.postMessage(result);
}
```

**3. Optimize Event Loop:**
```javascript
// Monitor event loop lag
const start = process.hrtime();

setImmediate(() => {
  const delta = process.hrtime(start);
  const nanosec = delta[0] * 1e9 + delta[1];
  const millisec = nanosec / 1e6;
  
  if (millisec > 10) {
    console.warn('Event loop lag detected:', millisec, 'ms');
  }
});
```

**4. Memory Optimization:**
```javascript
// Monitor memory usage
setInterval(() => {
  const memUsage = process.memoryUsage();
  console.log('Memory Usage:', {
    rss: Math.round(memUsage.rss / 1024 / 1024) + ' MB',
    heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + ' MB',
    heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + ' MB',
    external: Math.round(memUsage.external / 1024 / 1024) + ' MB'
  });
}, 5000);
```

---

## Security

### 18. What is CORS and how do you handle it in Node.js?

**Answer:**

**CORS (Cross-Origin Resource Sharing)** is a security mechanism that restricts web pages from making requests to a different domain than the one serving the page.

**Common CORS Error:**
```
Access to fetch at 'http://api.example.com' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

---

#### Handling CORS in Node.js

**Method 1: Using `cors` Package (Recommended)**

```bash
npm install cors
```

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for all routes
app.use(cors());

// Or configure specific origins
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // Allow cookies
};
app.use(cors(corsOptions));

// Route-specific CORS
app.get('/api/public', cors(), (req, res) => {
  res.json({ message: 'Public API' });
});
```

**Method 2: Manual Headers**

```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});
```

**Production Configuration:**

```javascript
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://example.com']
  : ['http://localhost:3000'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
```

**Key Points:**
- Use `cors` package for simplicity
- Never use `*` (wildcard) in production
- Enable `credentials: true` only for trusted origins
- CORS handles preflight OPTIONS requests automatically

### 19. What are common security vulnerabilities in Node.js applications?

**Answer:**
Common security issues and their solutions:

**1. SQL Injection:**
```javascript
// Vulnerable
const query = `SELECT * FROM users WHERE id = ${userId}`;

// Secure - Use parameterized queries
const query = 'SELECT * FROM users WHERE id = ?';
db.query(query, [userId], (err, results) => {
  // Handle results
});
```

**2. XSS (Cross-Site Scripting):**
```javascript
const express = require('express');
const helmet = require('helmet');
const app = express();

// Use helmet for security headers
app.use(helmet());

// Sanitize user input
const validator = require('validator');

app.post('/comment', (req, res) => {
  const comment = validator.escape(req.body.comment);
  // Store sanitized comment
});
```

**3. Environment Variables:**
```javascript
// Never hardcode secrets
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error('JWT_SECRET environment variable is required');
}

// Use dotenv for development
require('dotenv').config();
```

**4. HTTPS and Security Headers:**
```javascript
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem')
};

https.createServer(options, app).listen(443);
```

---

## Testing

### 20. How do you test Node.js applications?

**Answer:**
Testing strategies for Node.js applications:

**1. Unit Testing with Jest:**
```javascript
// math.js
function add(a, b) {
  return a + b;
}

module.exports = { add };

// math.test.js
const { add } = require('./math');

describe('Math functions', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(add(1, 2)).toBe(3);
  });
  
  test('adds negative numbers', () => {
    expect(add(-1, -2)).toBe(-3);
  });
});
```

**2. Integration Testing:**
```javascript
const request = require('supertest');
const app = require('./app');

describe('API endpoints', () => {
  test('GET /api/users', async () => {
    const response = await request(app)
      .get('/api/users')
      .expect(200);
    
    expect(response.body).toHaveProperty('users');
    expect(Array.isArray(response.body.users)).toBe(true);
  });
  
  test('POST /api/users', async () => {
    const newUser = { name: 'John', email: 'john@example.com' };
    
    const response = await request(app)
      .post('/api/users')
      .send(newUser)
      .expect(201);
    
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('John');
  });
});
```

**3. Mocking:**
```javascript
const fs = require('fs');
jest.mock('fs');

describe('File operations', () => {
  test('reads file content', () => {
    fs.readFileSync.mockReturnValue('file content');
    
    const content = fs.readFileSync('test.txt', 'utf8');
    expect(content).toBe('file content');
    expect(fs.readFileSync).toHaveBeenCalledWith('test.txt', 'utf8');
  });
});
```

---

## Advanced Topics

### 21. What are the differences between child_process, cluster, and worker_threads?

**Answer:**

| Feature | child_process | cluster | worker_threads |
|---------|---------------|---------|----------------|
| **Isolation** | Separate process | Separate process | Same process |
| **Memory** | Separate memory space | Separate memory space | Shared memory |
| **Communication** | IPC, pipes | IPC | MessagePort, SharedArrayBuffer |
| **Use Case** | External programs | Load balancing | CPU-intensive tasks |
| **Overhead** | High | High | Low |

**Examples:**

**child_process:**
```javascript
const { spawn, exec } = require('child_process');

// Spawn a new process
const child = spawn('ls', ['-la']);
child.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

// Execute command
exec('node --version', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error}`);
    return;
  }
  console.log(`Node version: ${stdout}`);
});
```

**cluster:**
```javascript
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  require('./app.js');
}
```

**worker_threads:**
```javascript
const { Worker, isMainThread, parentPort } = require('worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename);
  worker.postMessage('Hello from main thread');
  worker.on('message', (msg) => {
    console.log('Message from worker:', msg);
  });
} else {
  parentPort.on('message', (msg) => {
    console.log('Message from main:', msg);
    parentPort.postMessage('Hello from worker thread');
  });
}
```

### 22. How do you implement caching in Node.js?

**Answer:**
Several caching strategies for Node.js applications:

**1. In-Memory Caching:**
```javascript
class MemoryCache {
  constructor(ttl = 300000) { // 5 minutes default
    this.cache = new Map();
    this.ttl = ttl;
  }
  
  set(key, value) {
    this.cache.set(key, {
      value,
      expires: Date.now() + this.ttl
    });
  }
  
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }
  
  delete(key) {
    this.cache.delete(key);
  }
  
  clear() {
    this.cache.clear();
  }
}

// Usage
const cache = new MemoryCache();

function expensiveOperation(id) {
  const cached = cache.get(id);
  if (cached) {
    return cached;
  }
  
  const result = performExpensiveOperation(id);
  cache.set(id, result);
  return result;
}
```

**2. Redis Caching:**
```javascript
const redis = require('redis');
const client = redis.createClient();

async function getCachedData(key) {
  try {
    const cached = await client.get(key);
    if (cached) {
      return JSON.parse(cached);
    }
    
    const data = await fetchDataFromDatabase();
    await client.setex(key, 3600, JSON.stringify(data)); // Cache for 1 hour
    return data;
  } catch (error) {
    console.error('Cache error:', error);
    return await fetchDataFromDatabase();
  }
}
```

### 23. How do you handle database connections in Node.js?

**Answer:**
Database connection management strategies:

**1. Connection Pooling:**
```javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'mydb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function getUsers() {
  try {
    const [rows] = await pool.execute('SELECT * FROM users');
    return rows;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  await pool.end();
  process.exit(0);
});
```

**2. MongoDB with Mongoose:**
```javascript
const mongoose = require('mongoose');

// Connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

mongoose.connect('mongodb://localhost:27017/mydb', options);

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});
```

---

## Design Patterns in Node.js

### What are the design patterns used in Node.js?

Node.js applications use several design patterns to build scalable, maintainable, and efficient server-side applications.

**1. Module Pattern:**

**Definition:** Node.js uses the CommonJS module system (and ES modules) to organize code into reusable, encapsulated modules. Each file is treated as a separate module with its own scope, preventing global namespace pollution.

**Benefits:** Code organization, reusability, encapsulation, dependency management, easier testing.

```javascript
// math.js (Module)
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

module.exports = {
  add,
  subtract
};

// app.js (Using the module)
const math = require('./math');
console.log(math.add(5, 3)); // 8
```

**2. Callback Pattern:**

**Definition:** The fundamental pattern for handling asynchronous operations in Node.js. Functions accept callbacks as parameters that execute when async operations complete, enabling non-blocking I/O.

**Benefits:** Non-blocking I/O, event-driven programming, scalable I/O operations.

```javascript
// Callback pattern
const fs = require('fs');

fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  console.log('File content:', data);
});
```

**3. Event Emitter Pattern:**

**Definition:** Node.js uses the EventEmitter pattern for handling events. Objects emit events and listeners can subscribe to those events, enabling loose coupling and event-driven architecture.

**Benefits:** Decoupled components, event-driven architecture, flexible communication, scalable design.

```javascript
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

// Listen for event
myEmitter.on('event', (data) => {
  console.log('Event received:', data);
});

// Emit event
myEmitter.emit('event', 'Hello World');
```

**4. Stream Pattern:**

**Definition:** Streams handle data in chunks rather than loading everything into memory. They're used for processing large files, network communications, and real-time data processing.

**Benefits:** Memory efficiency, backpressure handling, composability, real-time processing.

```javascript
const fs = require('fs');
const { Transform } = require('stream');

// Transform stream
const upperCase = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk.toString().toUpperCase());
  }
});

// Pipe streams
fs.createReadStream('input.txt')
  .pipe(upperCase)
  .pipe(fs.createWriteStream('output.txt'));
```

**5. Middleware Pattern:**

**Definition:** Middleware functions process requests in a chain, each function handling a specific aspect (authentication, logging, parsing) before passing control to the next middleware. Common in frameworks like Express.js.

**Benefits:** Modular request handling, code reuse, separation of concerns, flexible architecture.

```javascript
// Express middleware pattern
const express = require('express');
const app = express();

// Middleware function
function logger(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next(); // Pass to next middleware
}

function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

app.use(logger); // Apply to all routes
app.get('/api/data', auth, (req, res) => {
  res.json({ data: 'protected data' });
});
```

**6. Factory Pattern:**

**Definition:** A function that creates and returns objects. Used to create instances of objects with different configurations without exposing the creation logic.

**Benefits:** Encapsulation, flexibility, easy object creation, configuration management.

```javascript
// Factory pattern
function createUser(name, role) {
  return {
    name,
    role,
    createdAt: new Date(),
    permissions: getPermissions(role),
    greet() {
      console.log(`Hello, I'm ${this.name}, a ${this.role}`);
    }
  };
}

function getPermissions(role) {
  const permissions = {
    admin: ['read', 'write', 'delete'],
    user: ['read'],
    guest: []
  };
  return permissions[role] || [];
}

const admin = createUser('John', 'admin');
const user = createUser('Jane', 'user');
```

**7. Singleton Pattern:**

**Definition:** Ensures a class has only one instance and provides a global point of access to it. Common for database connections, configuration objects, and logging systems.

**Benefits:** Single instance, global access, resource management, shared state.

```javascript
// Singleton pattern
class DatabaseConnection {
  constructor() {
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance;
    }
    
    this.connection = this.connect();
    DatabaseConnection.instance = this;
  }
  
  connect() {
    console.log('Connecting to database...');
    return { connected: true };
  }
  
  query(sql) {
    console.log(`Executing: ${sql}`);
    return { results: [] };
  }
}

const db1 = new DatabaseConnection();
const db2 = new DatabaseConnection();
console.log(db1 === db2); // true (same instance)
```

**8. Observer Pattern:**

**Definition:** Objects (observers) subscribe to events from a subject and get notified when events occur. Built into Node.js through EventEmitter and used extensively in event-driven architectures.

**Benefits:** Loose coupling, event-driven programming, scalable architecture, reactive programming.

```javascript
// Observer pattern using EventEmitter
const EventEmitter = require('events');

class NewsPublisher extends EventEmitter {
  publishNews(news) {
    console.log('Publishing news:', news);
    this.emit('news', news);
  }
}

class NewsSubscriber {
  constructor(name) {
    this.name = name;
  }
  
  update(news) {
    console.log(`${this.name} received: ${news}`);
  }
}

const publisher = new NewsPublisher();
const subscriber1 = new NewsSubscriber('Subscriber 1');
const subscriber2 = new NewsSubscriber('Subscriber 2');

publisher.on('news', (news) => subscriber1.update(news));
publisher.on('news', (news) => subscriber2.update(news));

publisher.publishNews('Breaking: Node.js update released!');
```

**9. Repository Pattern:**

**Definition:** Abstracts data access logic, providing a clean interface between business logic and data layer. Separates data access from business logic, making code more testable and maintainable.

**Benefits:** Separation of concerns, testability, maintainability, database abstraction.

```javascript
// Repository pattern
class UserRepository {
  constructor(db) {
    this.db = db;
  }
  
  async findById(id) {
    return await this.db.query('SELECT * FROM users WHERE id = ?', [id]);
  }
  
  async create(userData) {
    return await this.db.query(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [userData.name, userData.email]
    );
  }
  
  async update(id, userData) {
    return await this.db.query(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [userData.name, userData.email, id]
    );
  }
  
  async delete(id) {
    return await this.db.query('DELETE FROM users WHERE id = ?', [id]);
  }
}

// Usage
const userRepo = new UserRepository(database);
const user = await userRepo.findById(1);
```

**10. Dependency Injection Pattern:**

**Definition:** Dependencies are injected into a component rather than created within it. This makes code more testable, flexible, and maintainable by decoupling components from their dependencies.

**Benefits:** Testability, flexibility, loose coupling, easier maintenance.

```javascript
// Dependency injection pattern
class UserService {
  constructor(userRepository, emailService) {
    this.userRepository = userRepository;
    this.emailService = emailService;
  }
  
  async createUser(userData) {
    const user = await this.userRepository.create(userData);
    await this.emailService.sendWelcomeEmail(user.email);
    return user;
  }
}

// Inject dependencies
const userRepo = new UserRepository(db);
const emailService = new EmailService();
const userService = new UserService(userRepo, emailService);
```

**11. Strategy Pattern:**

**Definition:** Defines a family of algorithms, encapsulates each one, and makes them interchangeable. Allows selecting an algorithm at runtime, useful for different payment methods, authentication strategies, etc.

**Benefits:** Algorithm selection at runtime, flexibility, open/closed principle, algorithm encapsulation.

```javascript
// Strategy pattern
class PaymentProcessor {
  constructor(strategy) {
    this.strategy = strategy;
  }
  
  process(amount) {
    return this.strategy.pay(amount);
  }
  
  setStrategy(strategy) {
    this.strategy = strategy;
  }
}

// Strategies
const creditCardStrategy = {
  pay(amount) {
    console.log(`Paid ${amount} using Credit Card`);
    return { success: true, method: 'credit-card' };
  }
};

const paypalStrategy = {
  pay(amount) {
    console.log(`Paid ${amount} using PayPal`);
    return { success: true, method: 'paypal' };
  }
};

// Usage
const processor = new PaymentProcessor(creditCardStrategy);
processor.process(100);

processor.setStrategy(paypalStrategy);
processor.process(200);
```

**12. Promise Pattern:**

**Definition:** Promises represent the eventual completion (or failure) of an asynchronous operation. They provide a cleaner alternative to callbacks, avoiding callback hell and enabling better error handling.

**Benefits:** Better error handling, avoids callback hell, chainable operations, async/await support.

```javascript
// Promise pattern
function fetchUserData(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId) {
        resolve({ id: userId, name: 'John Doe' });
      } else {
        reject(new Error('Invalid user ID'));
      }
    }, 1000);
  });
}

// Using promises
fetchUserData(1)
  .then(user => {
    console.log('User:', user);
    return fetchUserPosts(user.id);
  })
  .then(posts => console.log('Posts:', posts))
  .catch(error => console.error('Error:', error));
```

**Key Takeaways:**
- **Module Pattern**: Code organization and encapsulation
- **Callback Pattern**: Fundamental async handling
- **Event Emitter**: Event-driven architecture
- **Stream Pattern**: Efficient data processing
- **Middleware Pattern**: Request processing chain
- **Factory Pattern**: Object creation
- **Singleton Pattern**: Single instance management
- **Observer Pattern**: Event subscription
- **Repository Pattern**: Data access abstraction
- **Dependency Injection**: Loose coupling
- **Strategy Pattern**: Algorithm selection
- **Promise Pattern**: Modern async handling

---

## Summary

This comprehensive guide covers the essential Node.js interview questions from basic concepts to advanced topics. Key areas to focus on:

1. **Event Loop**: Understanding the core of Node.js asynchronous behavior
2. **Modules**: CommonJS vs ES modules, require vs import
3. **Streams**: Efficient data handling for large datasets
4. **Error Handling**: Proper error management strategies
5. **Performance**: Optimization techniques and monitoring
6. **Security**: Common vulnerabilities and prevention
7. **Testing**: Unit, integration, and mocking strategies
8. **Advanced Topics**: Clustering, worker threads, caching, and database connections

Remember to practice with real code examples and understand the underlying concepts rather than just memorizing answers. Good luck with your Node.js interviews!
