'use strict';

const fs = require('fs-extra');
const path = require('path');

/**
 * Asynchronous I/O demonstration using libuv
 * This example shows how libuv handles file system operations asynchronously
 */

console.log('=== Libuv Async I/O Demo ===\n');

const demoDir = '/tmp/libuv-async-demo';
const demoFile = path.join(demoDir, 'demo.txt');

async function demonstrateAsyncIO () {
  try {
    console.log('1. Starting async I/O operations...\n');

    // Create directory asynchronously
    console.log('2. Creating directory asynchronously...');
    await fs.ensureDir(demoDir);
    console.log('   ✓ Directory created');

    // Write file asynchronously
    console.log('3. Writing file asynchronously...');
    const content = `Libuv Async I/O Demo
Created at: ${new Date().toISOString()}
This file was created using libuv's async file system operations.`;

    await fs.writeFile(demoFile, content);
    console.log('   ✓ File written');

    // Read file asynchronously
    console.log('4. Reading file asynchronously...');
    const readContent = await fs.readFile(demoFile, 'utf8');
    console.log('   ✓ File read');
    console.log('   Content preview:', readContent.substring(0, 50) + '...');

    // Get file stats asynchronously
    console.log('5. Getting file stats asynchronously...');
    const stats = await fs.stat(demoFile);
    console.log('   ✓ Stats retrieved');
    console.log('   File size:', stats.size, 'bytes');
    console.log('   Created:', stats.birthtime);

    // List directory asynchronously
    console.log('6. Listing directory asynchronously...');
    const files = await fs.readdir(demoDir);
    console.log('   ✓ Directory listed');
    console.log('   Files:', files);

    // Demonstrate concurrent operations
    console.log('\n7. Demonstrating concurrent async operations...');
    const startTime = Date.now();

    const concurrentOps = [
      fs.readFile(demoFile, 'utf8'),
      fs.stat(demoFile),
      fs.readdir(demoDir),
      fs.pathExists(demoFile)
    ];

    const results = await Promise.all(concurrentOps);
    const endTime = Date.now();

    console.log('   ✓ All concurrent operations completed');
    console.log('   Execution time:', endTime - startTime, 'ms');
    console.log('   Results:', {
      fileContent: results[0].substring(0, 30) + '...',
      fileSize: results[1].size,
      fileCount: results[2].length,
      fileExists: results[3]
    });

    // Cleanup
    console.log('\n8. Cleaning up...');
    await fs.remove(demoDir);
    console.log('   ✓ Cleanup completed');

    console.log('\n=== Async I/O Demo completed successfully ===');
  } catch (error) {
    console.error('Error in async I/O demo:', error.message);
  }
}

// Run the demo
demonstrateAsyncIO().then(() => {
  console.log('\nDemo finished. Process will exit in 1 second...');
  setTimeout(() => process.exit(0), 1000);
});
