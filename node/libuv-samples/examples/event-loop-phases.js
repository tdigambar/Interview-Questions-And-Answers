'use strict';

/**
 * Libuv Event Loop Phases Demonstration
 * This example shows the different phases of the libuv event loop
 */

console.log('=== Libuv Event Loop Phases Demo ===\n');

// Phase 1: Timer Phase
console.log('Setting up Timer Phase operations...');
setTimeout(() => {
  console.log('⏰ Timer Phase: setTimeout(100) executed');
}, 100);

setTimeout(() => {
  console.log('⏰ Timer Phase: setTimeout(200) executed');
}, 200);

setInterval(() => {
  console.log('⏰ Timer Phase: setInterval executed');
}, 300);

// Phase 2: Pending Callbacks Phase
// This phase executes I/O callbacks deferred to the next loop iteration
console.log('Setting up Pending Callbacks Phase operations...');

// Phase 3: Idle/Prepare Phase
// Used internally by libuv

// Phase 4: Poll Phase
// This phase fetches new I/O events and executes I/O related callbacks
console.log('Setting up Poll Phase operations...');

// Simulate I/O operation with setImmediate
setImmediate(() => {
  console.log('📡 Poll Phase: setImmediate executed (simulating I/O completion)');
});

// Phase 5: Check Phase
// This phase executes callbacks scheduled by setImmediate
console.log('Setting up Check Phase operations...');
setImmediate(() => {
  console.log('✅ Check Phase: setImmediate callback executed');
});

setImmediate(() => {
  console.log('✅ Check Phase: Another setImmediate callback executed');
});

// Phase 6: Close Callbacks Phase
// This phase executes close callbacks
console.log('Setting up Close Callbacks Phase operations...');

// Demonstrate the execution order with different async operations
console.log('\n=== Demonstrating Execution Order ===\n');

// Synchronous code
console.log('1. Synchronous code - executes first');

// process.nextTick has highest priority
process.nextTick(() => {
  console.log('2. process.nextTick - highest priority');
});

// Promise microtasks
Promise.resolve().then(() => {
  console.log('3. Promise.then - microtask queue');
});

// setImmediate (Check phase)
setImmediate(() => {
  console.log('4. setImmediate - Check phase');
});

// setTimeout(0) (Timer phase)
setTimeout(() => {
  console.log('5. setTimeout(0) - Timer phase');
}, 0);

// More synchronous code
console.log('6. More synchronous code');

// Another nextTick
process.nextTick(() => {
  console.log('7. Another process.nextTick');
});

// Another Promise
Promise.resolve().then(() => {
  console.log('8. Another Promise.then');
});

console.log('9. End of synchronous code - event loop starts processing\n');

// Demonstrate event loop blocking
console.log('=== Demonstrating Event Loop Blocking ===\n');

let blockCount = 0;
const blockInterval = setInterval(() => {
  blockCount++;
  console.log(`Blocking operation ${blockCount} - this blocks the event loop`);

  // Block the event loop for 50ms
  const start = Date.now();
  while (Date.now() - start < 50) {
    // Blocking operation
  }

  if (blockCount >= 3) {
    clearInterval(blockInterval);
    console.log('Blocking demo completed\n');
  }
}, 100);

// Non-blocking alternative
console.log('=== Demonstrating Non-blocking Alternative ===\n');

let nonBlockCount = 0;
const nonBlockInterval = setInterval(() => {
  nonBlockCount++;
  console.log(`Non-blocking operation ${nonBlockCount} - this doesn't block the event loop`);

  // Use setImmediate to break up the work
  setImmediate(() => {
    console.log(`  Non-blocking work ${nonBlockCount} completed asynchronously`);
  });

  if (nonBlockCount >= 3) {
    clearInterval(nonBlockInterval);
    console.log('Non-blocking demo completed\n');
  }
}, 100);

// Cleanup and exit
setTimeout(() => {
  console.log('=== Event Loop Phases Demo completed ===');
  process.exit(0);
}, 2000);
