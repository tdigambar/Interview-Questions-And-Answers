# Libuv Sample Implementation

This directory contains comprehensive examples and demonstrations of how libuv works in Node.js. Libuv is the C library that provides the event loop and asynchronous I/O capabilities that make Node.js so powerful.

## What is Libuv?

Libuv is a multi-platform C library that provides support for asynchronous I/O operations. It was originally written for Node.js but is now used by other projects as well. Libuv provides:

- **Event Loop**: The core of Node.js's asynchronous behavior
- **Thread Pool**: For CPU-intensive operations
- **File System Operations**: Asynchronous file I/O
- **Network Operations**: TCP/UDP sockets, HTTP, etc.
- **Timers**: setTimeout, setInterval, setImmediate
- **Process Management**: Child processes, signals

## Event Loop Phases

The libuv event loop consists of several phases that execute in order:

1. **Timer Phase**: Executes callbacks scheduled by `setTimeout()` and `setInterval()`
2. **Pending Callbacks Phase**: Executes I/O callbacks deferred to the next loop iteration
3. **Idle/Prepare Phase**: Used internally by libuv
4. **Poll Phase**: Fetches new I/O events and executes I/O related callbacks
5. **Check Phase**: Executes callbacks scheduled by `setImmediate()`
6. **Close Callbacks Phase**: Executes close callbacks (e.g., `socket.on('close', ...)`)

## Examples

### 1. Basic Event Loop (`examples/basic-event-loop.js`)
Demonstrates the fundamental concepts of how libuv's event loop works:
```bash
npm run basic-event-loop
```

### 2. Async I/O Demo (`examples/async-io-demo.js`)
Shows how libuv handles file system operations asynchronously:
```bash
npm run async-io
```

### 3. Event Loop Phases (`examples/event-loop-phases.js`)
Detailed demonstration of all event loop phases and execution order:
```bash
npm run event-loop-phases
```

### 4. Thread Pool Demo (`examples/thread-pool-demo.js`)
Shows how libuv uses a thread pool for certain operations:
```bash
npm run thread-pool
```

### 5. Performance Monitoring (`examples/performance-monitoring.js`)
Tools to monitor libuv performance and event loop health:
```bash
npm run performance
```

## Key Concepts Demonstrated

### 1. Event Loop Execution Order

```javascript
// Execution order: nextTick > Promise > setImmediate > setTimeout(0)
process.nextTick(() => console.log('1. nextTick'));
Promise.resolve().then(() => console.log('2. Promise'));
setImmediate(() => console.log('3. setImmediate'));
setTimeout(() => console.log('4. setTimeout(0)'), 0);
```

### 2. Microtask Queue vs Macrotask Queue

- **Microtasks**: process.nextTick, Promise.then, queueMicrotask
- **Macrotasks**: setTimeout, setInterval, setImmediate, I/O operations

### 3. Thread Pool Usage

Libuv uses a thread pool (default 4 threads) for:
- File system operations
- DNS lookups
- CPU-intensive operations

### 4. Non-blocking I/O

All I/O operations in Node.js are non-blocking thanks to libuv:
- File system operations
- Network requests
- Database queries

## Installation

```bash
npm install
```

## Usage

Run any of the examples:

```bash
# Basic event loop demonstration
npm run basic-event-loop

# Async I/O operations
npm run async-io

# Event loop phases
npm run event-loop-phases

# Thread pool usage
npm run thread-pool

# Performance monitoring
npm run performance
```

## Understanding the Output

### Event Loop Execution Order
The examples will show you the exact order in which different types of callbacks are executed, helping you understand:
- Why `process.nextTick` executes before `setImmediate`
- How Promise microtasks are prioritized
- The difference between timer and check phases

### Performance Metrics
The performance monitoring example shows:
- Event loop lag measurements
- Memory usage patterns
- CPU usage statistics
- Thread pool utilization

## Best Practices

1. **Avoid Blocking Operations**: Use asynchronous alternatives
2. **Understand Execution Order**: nextTick > Promise > setImmediate > setTimeout
3. **Monitor Event Loop**: Use tools like clinic.js or 0x for profiling
4. **Use Worker Threads**: For CPU-intensive operations
5. **Optimize I/O**: Batch operations when possible

## Performance Considerations

- **Event Loop Lag**: Monitor with `process.hrtime()`
- **Memory Usage**: Watch for memory leaks in long-running processes
- **Thread Pool**: Increase UV_THREADPOOL_SIZE for I/O heavy applications
- **Garbage Collection**: Monitor GC frequency and duration

## Debugging Tips

1. Use `--trace-event-categories` flag for detailed event tracing
2. Monitor with `process.memoryUsage()` and `process.cpuUsage()`
3. Use `setImmediate()` to break up long-running operations
4. Profile with Node.js built-in profiler or external tools

## Further Reading

- [Node.js Event Loop Documentation](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)
- [Libuv Official Documentation](http://docs.libuv.org/)
- [Understanding the Node.js Event Loop](https://blog.risingstack.com/node-js-at-scale-understanding-node-js-event-loop/)
- [Node.js Performance Best Practices](https://nodejs.org/en/docs/guides/simple-profiling/)

## Interview Questions

These examples help answer common interview questions like:

1. **"Explain the Node.js event loop"**
2. **"What's the difference between setImmediate and setTimeout(0)?"**
3. **"How does Node.js handle blocking operations?"**
4. **"What is the thread pool in Node.js?"**
5. **"How do you monitor Node.js performance?"**
6. **"Explain the difference between microtasks and macrotasks"**
7. **"What happens when you block the event loop?"**
8. **"How does libuv work?"**

Run the examples and study the output to understand these concepts deeply!
