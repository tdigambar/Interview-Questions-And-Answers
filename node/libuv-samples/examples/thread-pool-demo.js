'use strict';

const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');

/**
 * Libuv Thread Pool Demonstration
 * This example shows how libuv uses a thread pool for certain operations
 */

console.log('=== Libuv Thread Pool Demo ===\n');

// Show current thread pool size
console.log('Thread pool size (UV_THREADPOOL_SIZE):', process.env.UV_THREADPOOL_SIZE || 'default (4)');
console.log('Platform:', process.platform);
console.log('Architecture:', process.arch);
console.log('Node.js version:', process.version);
console.log('');

async function demonstrateThreadPool () {
  try {
    console.log('1. Demonstrating file system operations (use thread pool)...\n');

    const tempDir = '/tmp/libuv-thread-pool-demo';
    await fs.ensureDir(tempDir);

    // Create multiple files concurrently to demonstrate thread pool usage
    const filePromises = [];
    const startTime = Date.now();

    for (let i = 0; i < 8; i++) {
      const filePath = path.join(tempDir, `file-${i}.txt`);
      const content = `File ${i} content\nCreated at: ${new Date().toISOString()}\nRandom data: ${crypto.randomBytes(16).toString('hex')}`;

      filePromises.push(
        fs.writeFile(filePath, content).then(() => {
          console.log(`   ✓ File ${i} written`);
          return fs.stat(filePath);
        })
      );
    }

    const results = await Promise.all(filePromises);
    const endTime = Date.now();

    console.log(`\n   All file operations completed in ${endTime - startTime}ms`);
    console.log(`   Total files created: ${results.length}`);
    console.log(`   Average file size: ${Math.round(results.reduce((sum, stat) => sum + stat.size, 0) / results.length)} bytes`);

    console.log('\n2. Demonstrating CPU-intensive operations...\n');

    // CPU-intensive operation that will use the thread pool
    const cpuStartTime = Date.now();
    const cpuPromises = [];

    for (let i = 0; i < 4; i++) {
      cpuPromises.push(
        new Promise((resolve) => {
          // Simulate CPU-intensive work
          let result = 0;
          for (let j = 0; j < 1000000; j++) {
            result += Math.sqrt(j) * Math.sin(j);
          }
          console.log(`   ✓ CPU operation ${i} completed, result: ${result.toFixed(2)}`);
          resolve(result);
        })
      );
    }

    const cpuResults = await Promise.all(cpuPromises);
    const cpuEndTime = Date.now();

    console.log(`\n   All CPU operations completed in ${cpuEndTime - cpuStartTime}ms`);
    console.log(`   Total operations: ${cpuResults.length}`);

    console.log('\n3. Demonstrating crypto operations (use thread pool)...\n');

    const cryptoStartTime = Date.now();
    const cryptoPromises = [];

    for (let i = 0; i < 6; i++) {
      cryptoPromises.push(
        new Promise((resolve) => {
          const data = crypto.randomBytes(1024 * 1024); // 1MB of random data
          const hash = crypto.createHash('sha256').update(data).digest('hex');
          console.log(`   ✓ Crypto operation ${i} completed, hash: ${hash.substring(0, 16)}...`);
          resolve(hash);
        })
      );
    }

    const cryptoResults = await Promise.all(cryptoPromises);
    const cryptoEndTime = Date.now();

    console.log(`\n   All crypto operations completed in ${cryptoEndTime - cryptoStartTime}ms`);
    console.log(`   Total operations: ${cryptoResults.length}`);

    console.log('\n4. Demonstrating mixed operations...\n');

    const mixedStartTime = Date.now();
    const mixedPromises = [];

    // Mix file operations, CPU operations, and crypto operations
    for (let i = 0; i < 3; i++) {
      // File operation
      mixedPromises.push(
        fs.readFile(path.join(tempDir, `file-${i}.txt`), 'utf8').then(content => {
          console.log(`   ✓ Mixed file read ${i} completed`);
          return { type: 'file', index: i, length: content.length };
        })
      );

      // CPU operation
      mixedPromises.push(
        new Promise((resolve) => {
          let result = 0;
          for (let j = 0; j < 500000; j++) {
            result += Math.sqrt(j);
          }
          console.log(`   ✓ Mixed CPU operation ${i} completed`);
          resolve({ type: 'cpu', index: i, result });
        })
      );

      // Crypto operation
      mixedPromises.push(
        new Promise((resolve) => {
          const hash = crypto.createHash('md5').update(`data-${i}`).digest('hex');
          console.log(`   ✓ Mixed crypto operation ${i} completed`);
          resolve({ type: 'crypto', index: i, hash });
        })
      );
    }

    const mixedResults = await Promise.all(mixedPromises);
    const mixedEndTime = Date.now();

    console.log(`\n   All mixed operations completed in ${mixedEndTime - mixedStartTime}ms`);
    console.log(`   Total operations: ${mixedResults.length}`);

    // Group results by type
    const groupedResults = mixedResults.reduce((acc, result) => {
      if (!acc[result.type]) acc[result.type] = [];
      acc[result.type].push(result);
      return acc;
    }, {});

    console.log('   Results by type:');
    Object.keys(groupedResults).forEach(type => {
      console.log(`     ${type}: ${groupedResults[type].length} operations`);
    });

    console.log('\n5. Cleaning up...\n');
    await fs.remove(tempDir);
    console.log('   ✓ Cleanup completed');

    console.log('\n=== Thread Pool Demo completed successfully ===');
  } catch (error) {
    console.error('Error in thread pool demo:', error.message);
  }
}

// Run the demo
demonstrateThreadPool().then(() => {
  console.log('\nDemo finished. Process will exit in 1 second...');
  setTimeout(() => process.exit(0), 1000);
});
