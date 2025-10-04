'use strict';

/**
 * Libuv Samples - Main Entry Point
 * 
 * This file provides a simple way to run different libuv demonstrations
 * and serves as the main entry point for the libuv samples.
 */

const path = require('path');

// Available examples
const examples = {
  'basic-event-loop': 'examples/basic-event-loop.js',
  'async-io': 'examples/async-io-demo.js',
  'event-loop-phases': 'examples/event-loop-phases.js',
  'thread-pool': 'examples/thread-pool-demo.js',
  'performance': 'examples/performance-monitoring.js'
};

// Get command line arguments
const args = process.argv.slice(2);
const exampleName = args[0];

// Display help if no arguments or help requested
if (!exampleName || exampleName === '--help' || exampleName === '-h') {
  console.log(`
Libuv Samples - Node.js Event Loop and Async I/O Examples

Usage: node index.js <example-name>

Available examples:
  basic-event-loop    - Basic event loop demonstration
  async-io           - Asynchronous I/O operations
  event-loop-phases  - Event loop phases demonstration
  thread-pool        - Thread pool usage demonstration
  performance        - Performance monitoring demonstration

Examples:
  node index.js basic-event-loop
  node index.js async-io
  node index.js event-loop-phases
  node index.js thread-pool
  node index.js performance

Or use npm scripts:
  npm run basic-event-loop
  npm run async-io
  npm run event-loop-phases
  npm run thread-pool
  npm run performance

For more information, see README.md
`);
  process.exit(0);
}

// Check if example exists
if (!examples[exampleName]) {
  console.error(`Error: Unknown example "${exampleName}"`);
  console.error('Available examples:', Object.keys(examples).join(', '));
  process.exit(1);
}

// Run the example
const examplePath = path.join(__dirname, examples[exampleName]);
console.log(`Running ${exampleName} example...\n`);

try {
  require(examplePath);
} catch (error) {
  console.error(`Error running example "${exampleName}":`, error.message);
  process.exit(1);
}
