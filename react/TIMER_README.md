# React Timer Component

A simple React timer component with start, stop, and reset functionality. The timer updates every second and displays the elapsed time.

---

## Implementation

```jsx
import React, { useState, useEffect } from 'react';

function SimpleTimer() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div>
      <h2>Timer: {seconds} seconds</h2>
      <button onClick={() => setIsRunning(true)}>Start</button>
      <button onClick={() => setIsRunning(false)}>Stop</button>
      <button onClick={() => { setIsRunning(false); setSeconds(0); }}>Reset</button>
    </div>
  );
}

export default SimpleTimer;
```

---

## How It Works

### 1. **State Management**
```jsx
const [seconds, setSeconds] = useState(0);       // Tracks elapsed seconds
const [isRunning, setIsRunning] = useState(false); // Tracks if timer is running
```

### 2. **Timer Logic with useEffect**
```jsx
useEffect(() => {
  let interval = null;

  if (isRunning) {
    // Start interval when timer is running
    interval = setInterval(() => {
      setSeconds(seconds => seconds + 1); // Increment every 1000ms (1 second)
    }, 1000);
  }

  // Cleanup: Clear interval when component unmounts or isRunning changes
  return () => clearInterval(interval);
}, [isRunning]); // Re-run effect when isRunning changes
```

### 3. **Control Buttons**
```jsx
// Start: Set isRunning to true
<button onClick={() => setIsRunning(true)}>Start</button>

// Stop: Set isRunning to false
<button onClick={() => setIsRunning(false)}>Stop</button>

// Reset: Stop timer and reset seconds to 0
<button onClick={() => { setIsRunning(false); setSeconds(0); }}>Reset</button>
```

---

## Key Concepts

### 1. **useState Hook**
- Manages component state (seconds and isRunning)
- Triggers re-render when state changes

### 2. **useEffect Hook**
- Handles side effects (starting/stopping the interval)
- Cleanup function prevents memory leaks
- Dependencies array `[isRunning]` means effect runs when `isRunning` changes

### 3. **setInterval**
- Executes code repeatedly at specified intervals
- `setInterval(callback, 1000)` runs callback every 1 second

### 4. **clearInterval**
- Stops the interval
- Must be called to prevent memory leaks

### 5. **Functional State Update**
```jsx
setSeconds(seconds => seconds + 1); // ✅ Correct - uses current state
// Instead of:
setSeconds(seconds + 1); // ❌ May use stale value
```

---

## Usage

```jsx
import SimpleTimer from './timer-simple';

function App() {
  return (
    <div>
      <h1>My Timer App</h1>
      <SimpleTimer />
    </div>
  );
}

export default App;
```

---

## Flow Diagram

```
1. User clicks "Start"
   ↓
2. isRunning = true
   ↓
3. useEffect detects change
   ↓
4. setInterval starts
   ↓
5. Every 1 second: seconds increases by 1
   ↓
6. Component re-renders with new seconds value
   ↓
7. User clicks "Stop"
   ↓
8. isRunning = false
   ↓
9. useEffect cleanup runs
   ↓
10. clearInterval stops the timer
```

---

## Common Issues & Solutions

### Issue 1: Timer doesn't stop
**Problem:** Interval not being cleared  
**Solution:** Always return cleanup function in useEffect
```jsx
return () => clearInterval(interval);
```

### Issue 2: Memory leak warning
**Problem:** Component unmounts while interval is running  
**Solution:** Cleanup function clears interval on unmount
```jsx
useEffect(() => {
  // ... interval code
  return () => clearInterval(interval); // This runs on unmount
}, [isRunning]);
```

### Issue 3: Timer not updating correctly
**Problem:** Using stale state value  
**Solution:** Use functional update
```jsx
setSeconds(seconds => seconds + 1); // Always uses latest value
```

---

## Enhancements

### Add Milliseconds Display
```jsx
const [ms, setMs] = useState(0);

useEffect(() => {
  let interval = null;
  if (isRunning) {
    interval = setInterval(() => {
      setMs(ms => ms + 100);
      if (ms >= 900) {
        setSeconds(seconds => seconds + 1);
        setMs(0);
      }
    }, 100);
  }
  return () => clearInterval(interval);
}, [isRunning, ms]);
```

### Format Time as HH:MM:SS
```jsx
const formatTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

return <h2>Timer: {formatTime(seconds)}</h2>;
```

### Disable Buttons Appropriately
```jsx
<button onClick={() => setIsRunning(true)} disabled={isRunning}>
  Start
</button>
<button onClick={() => setIsRunning(false)} disabled={!isRunning}>
  Stop
</button>
```

---

## Interview Questions

**Q: Why do we need the cleanup function in useEffect?**  
A: To prevent memory leaks by clearing the interval when the component unmounts or when the effect dependencies change.

**Q: Why use functional update `setSeconds(s => s + 1)` instead of `setSeconds(seconds + 1)`?**  
A: Functional updates ensure we're working with the most current state value, avoiding issues with stale closures in setInterval.

**Q: What happens if we don't include `[isRunning]` in the dependency array?**  
A: Without dependencies, the effect would run after every render, creating multiple intervals. With empty array `[]`, it runs only once on mount.

**Q: Can we use `useRef` instead of `useState` for the interval?**  
A: Yes! `useRef` can store the interval ID without causing re-renders:
```jsx
const intervalRef = useRef(null);
intervalRef.current = setInterval(...);
clearInterval(intervalRef.current);
```

---

## Summary

This simple timer demonstrates:
- ✅ State management with `useState`
- ✅ Side effects with `useEffect`
- ✅ Interval handling with `setInterval/clearInterval`
- ✅ Proper cleanup to prevent memory leaks
- ✅ Functional state updates

Perfect for interviews and learning React fundamentals! 🚀
