'use strict';

/**
 * Libuv Performance Monitoring Demonstration
 * This example shows how to monitor libuv performance and event loop health
 */

console.log('=== Libuv Performance Monitoring Demo ===\n');

// Performance monitoring utilities
class LibuvMonitor {
  constructor () {
    this.startTime = Date.now();
    this.initialMemory = process.memoryUsage();
    this.initialCpu = process.cpuUsage();
    this.eventLoopLag = [];
    this.measurements = [];
  }

  // Measure event loop lag
  measureEventLoopLag () {
    const start = process.hrtime.bigint();

    setImmediate(() => {
      const lag = Number(process.hrtime.bigint() - start) / 1000000; // Convert to milliseconds
      this.eventLoopLag.push(lag);

      // Keep only last 100 measurements
      if (this.eventLoopLag.length > 100) {
        this.eventLoopLag.shift();
      }
    });
  }

  // Get current performance metrics
  getMetrics () {
    const currentMemory = process.memoryUsage();
    const currentCpu = process.cpuUsage(this.initialCpu);
    const uptime = process.uptime();

    const avgEventLoopLag = this.eventLoopLag.length > 0
      ? this.eventLoopLag.reduce((sum, lag) => sum + lag, 0) / this.eventLoopLag.length
      : 0;

    const maxEventLoopLag = this.eventLoopLag.length > 0
      ? Math.max(...this.eventLoopLag)
      : 0;

    return {
      uptime,
      memory: {
        rss: currentMemory.rss,
        heapTotal: currentMemory.heapTotal,
        heapUsed: currentMemory.heapUsed,
        external: currentMemory.external,
        arrayBuffers: currentMemory.arrayBuffers
      },
      memoryDelta: {
        rss: currentMemory.rss - this.initialMemory.rss,
        heapTotal: currentMemory.heapTotal - this.initialMemory.heapTotal,
        heapUsed: currentMemory.heapUsed - this.initialMemory.heapUsed,
        external: currentMemory.external - this.initialMemory.external
      },
      cpu: {
        user: currentCpu.user / 1000, // Convert to milliseconds
        system: currentCpu.system / 1000
      },
      eventLoop: {
        lag: {
          current: this.eventLoopLag[this.eventLoopLag.length - 1] || 0,
          average: avgEventLoopLag,
          max: maxEventLoopLag,
          measurements: this.eventLoopLag.length
        }
      },
      platform: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        pid: process.pid,
        ppid: process.ppid
      }
    };
  }

  // Log metrics
  logMetrics (label = '') {
    const metrics = this.getMetrics();
    console.log(`\n📊 Performance Metrics ${label}:`);
    console.log(`   Uptime: ${metrics.uptime.toFixed(2)}s`);
    console.log(`   Memory RSS: ${(metrics.memory.rss / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Memory Heap Used: ${(metrics.memory.heapUsed / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Memory Delta: ${(metrics.memoryDelta.heapUsed / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   CPU User: ${metrics.cpu.user.toFixed(2)}ms`);
    console.log(`   CPU System: ${metrics.cpu.system.toFixed(2)}ms`);
    console.log(`   Event Loop Lag: ${metrics.eventLoop.lag.current.toFixed(2)}ms (avg: ${metrics.eventLoop.lag.average.toFixed(2)}ms, max: ${metrics.eventLoop.lag.max.toFixed(2)}ms)`);
  }

  // Start continuous monitoring
  startMonitoring (intervalMs = 1000) {
    this.monitoringInterval = setInterval(() => {
      this.measureEventLoopLag();
      this.measurements.push(this.getMetrics());

      // Keep only last 50 measurements
      if (this.measurements.length > 50) {
        this.measurements.shift();
      }
    }, intervalMs);
  }

  // Stop monitoring
  stopMonitoring () {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
  }

  // Get performance summary
  getSummary () {
    if (this.measurements.length === 0) return null;

    const latest = this.measurements[this.measurements.length - 1];
    const first = this.measurements[0];

    const avgMemory = this.measurements.reduce((sum, m) => sum + m.memory.heapUsed, 0) / this.measurements.length;
    const maxMemory = Math.max(...this.measurements.map(m => m.memory.heapUsed));
    const avgLag = this.measurements.reduce((sum, m) => sum + m.eventLoop.lag.average, 0) / this.measurements.length;
    const maxLag = Math.max(...this.measurements.map(m => m.eventLoop.lag.max));

    return {
      duration: latest.uptime - first.uptime,
      memory: {
        average: avgMemory,
        max: maxMemory,
        growth: latest.memory.heapUsed - first.memory.heapUsed
      },
      eventLoop: {
        averageLag: avgLag,
        maxLag: maxLag
      },
      measurements: this.measurements.length
    };
  }
}

// Create monitor instance
const monitor = new LibuvMonitor();

// Start monitoring
monitor.startMonitoring(500);

// Log initial metrics
monitor.logMetrics('(Initial)');

// Demonstrate different types of operations and their impact on performance
async function demonstratePerformanceImpact () {
  console.log('\n=== Demonstrating Performance Impact ===\n');

  // 1. Light operations
  console.log('1. Light operations (setTimeout, setImmediate)...');
  for (let i = 0; i < 100; i++) {
    setTimeout(() => {}, 0);
    setImmediate(() => {});
  }

  await new Promise(resolve => setTimeout(resolve, 1000));
  monitor.logMetrics('(After Light Operations)');

  // 2. Memory allocation
  console.log('\n2. Memory allocation...');
  const arrays = [];
  for (let i = 0; i < 1000; i++) {
    arrays.push(new Array(1000).fill(i));
  }

  await new Promise(resolve => setTimeout(resolve, 1000));
  monitor.logMetrics('(After Memory Allocation)');

  // 3. CPU-intensive operations
  console.log('\n3. CPU-intensive operations...');
  const cpuPromises = [];
  for (let i = 0; i < 4; i++) {
    cpuPromises.push(
      new Promise(resolve => {
        let result = 0;
        for (let j = 0; j < 1000000; j++) {
          result += Math.sqrt(j);
        }
        resolve(result);
      })
    );
  }

  await Promise.all(cpuPromises);
  monitor.logMetrics('(After CPU Operations)');

  // 4. Event loop blocking
  console.log('\n4. Event loop blocking...');
  const blockStart = Date.now();
  while (Date.now() - blockStart < 100) {
    // Block for 100ms
  }

  await new Promise(resolve => setTimeout(resolve, 1000));
  monitor.logMetrics('(After Event Loop Blocking)');

  // 5. Garbage collection trigger
  console.log('\n5. Triggering garbage collection...');
  arrays.length = 0; // Clear arrays
  if (global.gc) {
    global.gc();
  }

  await new Promise(resolve => setTimeout(resolve, 1000));
  monitor.logMetrics('(After Garbage Collection)');
}

// Run the demonstration
demonstratePerformanceImpact().then(() => {
  // Stop monitoring
  monitor.stopMonitoring();

  // Log final metrics
  monitor.logMetrics('(Final)');

  // Show summary
  const summary = monitor.getSummary();
  if (summary) {
    console.log('\n📈 Performance Summary:');
    console.log(`   Duration: ${summary.duration.toFixed(2)}s`);
    console.log(`   Average Memory: ${(summary.memory.average / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Max Memory: ${(summary.memory.max / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Memory Growth: ${(summary.memory.growth / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Average Event Loop Lag: ${summary.eventLoop.averageLag.toFixed(2)}ms`);
    console.log(`   Max Event Loop Lag: ${summary.eventLoop.maxLag.toFixed(2)}ms`);
    console.log(`   Measurements Taken: ${summary.measurements}`);
  }

  console.log('\n=== Performance Monitoring Demo completed ===');

  // Exit after a short delay
  setTimeout(() => process.exit(0), 1000);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n\nReceived SIGINT, stopping monitoring...');
  monitor.stopMonitoring();
  monitor.logMetrics('(On Exit)');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\nReceived SIGTERM, stopping monitoring...');
  monitor.stopMonitoring();
  monitor.logMetrics('(On Exit)');
  process.exit(0);
});
