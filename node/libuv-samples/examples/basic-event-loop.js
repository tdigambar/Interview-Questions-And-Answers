'use strict';

/**
 * Basic libuv event loop demonstration
 * This example shows the fundamental concepts of how libuv's event loop works
 */

console.log('=== Libuv Event Loop Basic Demo ===\n');

// 1. Synchronous code executes first
console.log('1. Synchronous code - executes immediately');

// 2. process.nextTick has the highest priority
process.nextTick(() => {
  console.log('2. process.nextTick - highest priority, executes before any other async operation');
});

// 3. Promise microtasks execute after nextTick
Promise.resolve().then(() => {
  console.log('3. Promise.then - microtask, executes after nextTick');
});

// 4. setImmediate executes in the Check phase
setImmediate(() => {
  console.log('4. setImmediate - executes in Check phase');
});

// 5. setTimeout(0) executes in Timer phase
setTimeout(() => {
  console.log('5. setTimeout(0) - executes in Timer phase');
}, 0);

// 6. setTimeout with delay executes after the specified time
setTimeout(() => {
  console.log('6. setTimeout(1000) - executes after 1 second');
}, 1000);

// 7. More synchronous code
console.log('7. More synchronous code - executes immediately');

// 8. Another nextTick (will be queued)
process.nextTick(() => {
  console.log('8. Another process.nextTick - queued after the first one');
});

// 9. Another Promise
Promise.resolve().then(() => {
  console.log('9. Another Promise.then - queued after the first one');
});

console.log('10. End of synchronous code - event loop will now process async operations\n');

// Wait a bit to see all outputs
setTimeout(() => {
  console.log('\n=== Demo completed ===');
  process.exit(0);
}, 2000);
