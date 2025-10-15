# React.js Interview Questions and Answers

A comprehensive collection of React.js interview questions covering basic to advanced concepts for frontend development interviews.

## Table of Contents

- [Basic Level](#basic-level)
- [Intermediate Level](#intermediate-level)
- [Advanced Level](#advanced-level)

---

## Basic Level

### 1. What is React?

React is an open-source JavaScript library developed by Facebook for building user interfaces, particularly single-page applications. It allows developers to create reusable UI components and efficiently update and render components when data changes using a virtual DOM.

### 2. What are the main features of React?

- **Virtual DOM**: Improves performance by minimizing direct DOM manipulation
- **Component-Based**: Build encapsulated components that manage their own state
- **JSX**: JavaScript syntax extension for writing HTML-like code
- **Unidirectional Data Flow**: Data flows from parent to child components
- **Declarative**: Describes what the UI should look like
- **React Hooks**: Use state and lifecycle features without classes
- **Reusability**: Components can be reused throughout the application

### 3. What is JSX?

JSX (JavaScript XML) is a syntax extension for JavaScript that allows you to write HTML-like code in JavaScript files. It makes React code more readable and is transformed into regular JavaScript by transpilers like Babel.

```jsx
const element = <h1>Hello, World!</h1>;

// Equivalent JavaScript
const element = React.createElement('h1', null, 'Hello, World!');
```

### 4. What is the Virtual DOM?

The Virtual DOM is a lightweight copy of the actual DOM kept in memory. React uses it to:

- Track changes efficiently
- Calculate the minimal number of updates needed
- Batch updates for better performance
- Update only changed parts of the real DOM

### 5. What is the difference between functional and class components?

**Functional Component (Modern approach):**

```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// Or with arrow function
const Welcome = (props) => {
  return <h1>Hello, {props.name}</h1>;
};
```

**Class Component:**

```jsx
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

**Differences:**

- Functional components are simpler and more concise
- Class components have lifecycle methods (before hooks)
- Functional components use hooks for state and effects
- Functional components are the recommended approach in modern React

### 6. What are Props in React?

Props (properties) are read-only data passed from parent to child components. They allow components to be dynamic and reusable.

```jsx
// Parent component
function App() {
  return <Welcome name="John" age={30} />;
}

// Child component
function Welcome(props) {
  return <h1>Hello, {props.name}. You are {props.age} years old.</h1>;
}
```

### 7. What is State in React?

State is a built-in object that stores data that changes over time within a component. When state changes, the component re-renders.

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### 8. What is the difference between State and Props?

| State | Props |
|-------|-------|
| Mutable (can be changed) | Immutable (read-only) |
| Managed within the component | Passed from parent to child |
| Can be changed using setState/useState | Cannot be modified by child |
| Local to component | External data |
| Asynchronous updates | Synchronous |

### 9. What are React Hooks?

Hooks are functions that let you use state and other React features in functional components. Introduced in React 16.8.

**Common hooks:**

- `useState` - State management
- `useEffect` - Side effects
- `useContext` - Context API
- `useRef` - DOM references
- `useMemo` - Memoization
- `useCallback` - Memoized callbacks
- `useReducer` - Complex state logic

### 10. What is useState Hook?

`useState` allows you to add state to functional components.

```jsx
import { useState } from 'react';

function Example() {
  const [count, setCount] = useState(0); // Initial value is 0
  const [name, setName] = useState('John');
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <input value={name} onChange={(e) => setName(e.target.value)} />
    </div>
  );
}
```

---

## Intermediate Level

### 11. What is useEffect Hook?

`useEffect` performs side effects in functional components (data fetching, subscriptions, DOM manipulation).

```jsx
import { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);
  
  // Runs after every render
  useEffect(() => {
    document.title = `Count: ${count}`;
  });
  
  // Runs only once (on mount)
  useEffect(() => {
    console.log('Component mounted');
  }, []);
  
  // Runs when count changes
  useEffect(() => {
    console.log('Count changed:', count);
  }, [count]);
  
  // Cleanup function
  useEffect(() => {
    const timer = setInterval(() => {
      console.log('Tick');
    }, 1000);
    
    return () => clearInterval(timer); // Cleanup
  }, []);
  
  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}
```

### 12. What is the component lifecycle in React?

**Class Component Lifecycle:**

- **Mounting**: constructor → render → componentDidMount
- **Updating**: render → componentDidUpdate
- **Unmounting**: componentWillUnmount

**Functional Component (with hooks):**

```jsx
useEffect(() => {
  // componentDidMount
  console.log('Mounted');
  
  return () => {
    // componentWillUnmount
    console.log('Unmounted');
  };
}, []);

useEffect(() => {
  // componentDidUpdate (when dependencies change)
  console.log('Updated');
}, [dependency]);
```

### 13. What are keys in React and why are they important?

Keys help React identify which items have changed, been added, or removed in lists. They should be unique among siblings.

```jsx
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}
```

**Why important:**

- Improves rendering performance
- Maintains component state correctly
- Prevents unnecessary re-renders

### 14. What is the difference between controlled and uncontrolled components?

**Controlled Component:** Form data handled by React state

```jsx
function ControlledForm() {
  const [value, setValue] = useState('');
  
  return (
    <input 
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
```

**Uncontrolled Component:** Form data handled by DOM

```jsx
function UncontrolledForm() {
  const inputRef = useRef();
  
  const handleSubmit = () => {
    console.log(inputRef.current.value);
  };
  
  return <input ref={inputRef} />;
}
```

### 15. What is prop drilling and how can you avoid it?

Prop drilling is passing props through multiple nested components to reach a deeply nested child.

**Problem:**

```jsx
function App() {
  const user = { name: 'John' };
  return <Parent user={user} />;
}

function Parent({ user }) {
  return <Child user={user} />;
}

function Child({ user }) {
  return <GrandChild user={user} />;
}

function GrandChild({ user }) {
  return <p>{user.name}</p>;
}
```

**Solutions:**

- Context API
- State management libraries (Redux, Zustand)
- Component composition

### 16. What is the Context API?

Context provides a way to share data across the component tree without prop drilling.

```jsx
import { createContext, useContext, useState } from 'react';

// Create context
const ThemeContext = createContext();

// Provider component
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Consumer component
function ThemedButton() {
  const { theme, setTheme } = useContext(ThemeContext);
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current theme: {theme}
    </button>
  );
}

// App
function App() {
  return (
    <ThemeProvider>
      <ThemedButton />
    </ThemeProvider>
  );
}
```

### 17. What are React Fragments?

Fragments let you group children without adding extra DOM nodes.

```jsx
// Long syntax
function List() {
  return (
    <React.Fragment>
      <li>Item 1</li>
      <li>Item 2</li>
    </React.Fragment>
  );
}

// Short syntax
function List() {
  return (
    <>
      <li>Item 1</li>
      <li>Item 2</li>
    </>
  );
}
```

### 18. What is the difference between useCallback and useMemo?

**useMemo:** Memoizes a computed value

```jsx
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);
```

**useCallback:** Memoizes a function

```jsx
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

### 19. What is useRef Hook?

`useRef` creates a mutable reference that persists across renders.

```jsx
function TextInput() {
  const inputRef = useRef(null);
  
  const focusInput = () => {
    inputRef.current.focus();
  };
  
  return (
    <>
      <input ref={inputRef} />
      <button onClick={focusInput}>Focus Input</button>
    </>
  );
}

// Storing mutable values
function Timer() {
  const countRef = useRef(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      countRef.current += 1; // Doesn't trigger re-render
      console.log(countRef.current);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return <div>Check console</div>;
}
```

### 20. What is conditional rendering in React?

```jsx
function Greeting({ isLoggedIn }) {
  // Using if-else
  if (isLoggedIn) {
    return <h1>Welcome back!</h1>;
  }
  return <h1>Please sign in.</h1>;
}

// Using ternary operator
function Greeting({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? <h1>Welcome back!</h1> : <h1>Please sign in.</h1>}
    </div>
  );
}

// Using && operator
function Notification({ hasNotifications, count }) {
  return (
    <div>
      {hasNotifications && <span>You have {count} notifications</span>}
    </div>
  );
}
```

---

## Advanced Level

### 21. What is useReducer Hook?

`useReducer` is an alternative to `useState` for complex state logic.

```jsx
import { useReducer } from 'react';

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return initialState;
    default:
      throw new Error('Unknown action');
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
}
```

### 22. What are Higher-Order Components (HOC)?

A HOC is a function that takes a component and returns a new component with additional props or functionality.

```jsx
// HOC that adds authentication
function withAuth(Component) {
  return function AuthComponent(props) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    useEffect(() => {
      // Check authentication
      setIsAuthenticated(checkAuth());
    }, []);
    
    if (!isAuthenticated) {
      return <div>Please log in</div>;
    }
    
    return <Component {...props} />;
  };
}

// Usage
const ProtectedPage = withAuth(Dashboard);
```

### 23. What are Custom Hooks?

Custom hooks are reusable functions that use React hooks.

```jsx
// Custom hook for fetching data
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [url]);
  
  return { data, loading, error };
}

// Usage
function UserList() {
  const { data, loading, error } = useFetch('/api/users');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <ul>
      {data.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}
```

### 24. What is React.memo?

`React.memo` is a higher-order component that memoizes a component to prevent unnecessary re-renders.

```jsx
const MyComponent = React.memo(function MyComponent({ name }) {
  console.log('Rendering MyComponent');
  return <div>Hello, {name}</div>;
});

// Custom comparison
const MyComponent = React.memo(
  function MyComponent({ user }) {
    return <div>{user.name}</div>;
  },
  (prevProps, nextProps) => {
    return prevProps.user.id === nextProps.user.id;
  }
);
```

### 25. What is lazy loading in React?

Lazy loading splits code into smaller chunks and loads components on demand.

```jsx
import { lazy, Suspense } from 'react';

// Lazy load component
const LazyComponent = lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

### 26. What is Error Boundary?

Error boundaries catch JavaScript errors in child components and display fallback UI.

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.log('Error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    
    return this.props.children;
  }
}

// Usage
function App() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  );
}
```

### 27. What is the difference between React Router's Link and anchor tag?

- **`<Link>`**: Prevents full page reload, uses client-side routing
- **`<a>`**: Causes full page reload, server request

```jsx
import { Link } from 'react-router-dom';

// React Router Link (preferred)
<Link to="/about">About</Link>

// Anchor tag (causes reload)
<a href="/about">About</a>
```

### 28. What are Portals in React?

Portals render children into a DOM node outside the parent component hierarchy.

```jsx
import { createPortal } from 'react-dom';

function Modal({ children }) {
  return createPortal(
    <div className="modal">
      {children}
    </div>,
    document.getElementById('modal-root')
  );
}
```

### 29. What is the difference between createElement and cloneElement?

**createElement:** Creates a new React element

```jsx
React.createElement('div', { className: 'container' }, 'Hello');
```

**cloneElement:** Clones an existing element and adds/overrides props

```jsx
const element = <button>Click</button>;
const cloned = React.cloneElement(element, { onClick: handleClick });
```

### 30. What are some React performance optimization techniques?

- Use `React.memo` for component memoization
- Use `useMemo` for expensive calculations
- Use `useCallback` for function memoization
- Lazy load components with `React.lazy`
- Use virtualization for long lists (react-window, react-virtualized)
- Avoid inline functions in render
- Use proper key props in lists
- Code splitting
- Avoid unnecessary state updates
- Use production build
- Optimize images and assets
- Use React DevTools Profiler

### 31. What is the difference between componentWillMount and componentDidMount?

- **componentWillMount** (deprecated): Called before mounting, not recommended
- **componentDidMount**: Called after component is mounted, ideal for API calls, subscriptions

### 32. What is reconciliation in React?

Reconciliation is the process React uses to diff the virtual DOM with the previous version and update only changed parts of the real DOM efficiently using a diffing algorithm.

### 33. What are Synthetic Events in React?

Synthetic Events are React's cross-browser wrapper around native browser events, providing consistent API across browsers.

```jsx
function handleClick(e) {
  e.preventDefault(); // Synthetic event
  console.log(e.type); // Works consistently across browsers
}
```

### 34. What is StrictMode in React?

StrictMode helps identify potential problems during development.

```jsx
import { StrictMode } from 'react';

function App() {
  return (
    <StrictMode>
      <MyComponent />
    </StrictMode>
  );
}
```

**Features:**

- Identifies unsafe lifecycles
- Warns about legacy APIs
- Detects unexpected side effects
- Double-invokes functions to find bugs

### 35. What are some best practices in React?

- Use functional components and hooks
- Keep components small and focused
- Use meaningful component names
- Avoid prop drilling (use Context or state management)
- Handle errors with Error Boundaries
- Use TypeScript for type safety
- Write reusable custom hooks
- Optimize performance with memoization
- Use proper key props
- Keep business logic separate from UI
- Write tests for components
- Use ESLint and Prettier
- Follow consistent folder structure
- Document complex components

---

## Conclusion

These questions cover React fundamentals through advanced concepts and should thoroughly prepare you for a React.js interview! The topics range from basic component structure to advanced patterns like HOCs, custom hooks, and performance optimization techniques that are essential for building modern React applications.