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

### 4. What is the Virtual DOM and how does it improve performance?

The Virtual DOM is a lightweight JavaScript representation of the actual DOM. It's essentially a tree of JavaScript objects that mirrors the structure of the real DOM elements.

#### How It Improves Performance

**1. Batch Updates & Reconciliation**
- Instead of directly manipulating the DOM for every change, React first updates the Virtual DOM
- React then compares the new Virtual DOM with the previous version (diffing)
- Only the actual differences are applied to the real DOM in a single batch

**2. Minimizes DOM Manipulation**
- Direct DOM manipulation is expensive (reflows, repaints)
- React calculates the minimal set of changes needed
- Example: If 10 components update, React might only need to modify 2 actual DOM nodes

**3. Efficient Diffing Algorithm**
- O(n) complexity instead of O(n³) for traditional tree diffing
- Uses heuristics:
  - Different component types produce different trees
  - Keys help identify which elements changed in lists
  - Same-level comparison only

**4. Declarative Updates**
```jsx
// You write declarative code
setState({ count: count + 1 })

// React handles:
// 1. Create new Virtual DOM
// 2. Diff with old Virtual DOM  
// 3. Update only changed real DOM nodes
```

**5. Performance Optimizations**
- **Reconciliation**: Smart algorithm to determine what changed
- **Batching**: Multiple setState calls batched together
- **Fiber Architecture**: Can pause, abort, or resume work for better responsiveness

#### Key Performance Wins

1. **Fewer DOM Operations**: 100 state changes → 1 DOM update
2. **Smart Updates**: Only changed nodes are touched
3. **Cross-browser Consistency**: Abstracts browser differences
4. **Predictable Performance**: Declarative code is easier to optimize

#### When It Matters Most

- Frequent UI updates (real-time data, animations)
- Large lists or complex component trees
- Multiple simultaneous state changes
- Interactive applications with heavy user input

**Note:** The Virtual DOM isn't always faster than direct DOM manipulation for simple cases, but it provides consistent, predictable performance for complex applications while keeping code maintainable.

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

### 25. What is forwardRef in React and how does it work?

`forwardRef` allows a component to expose a DOM node or component instance to its parent via a ref. By default, refs only work on DOM elements, not custom components.

**Problem:**
```jsx
// ❌ ref won't be passed through
function CustomInput(props) {
  return <input type="text" />;
}

function App() {
  const inputRef = useRef(null);
  inputRef.current.focus(); // ❌ null - ref ignored
  return <CustomInput ref={inputRef} />;
}
```

**Solution:**
```jsx
import { forwardRef, useRef } from 'react';

const CustomInput = forwardRef((props, ref) => {
  return <input ref={ref} {...props} />;
});

CustomInput.displayName = 'CustomInput'; // For debugging

function App() {
  const inputRef = useRef(null);
  inputRef.current.focus(); // ✅ Works!
  return <CustomInput ref={inputRef} />;
}
```

**Exposing Methods with useImperativeHandle:**
```jsx
import { forwardRef, useImperativeHandle, useRef } from 'react';

const CustomInput = forwardRef((props, ref) => {
  const inputRef = useRef(null);
  
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    clear: () => inputRef.current.value = '',
    getValue: () => inputRef.current.value
  }), []);
  
  return <input ref={inputRef} {...props} />;
});

function App() {
  const inputRef = useRef(null);
  return (
    <>
      <CustomInput ref={inputRef} />
      <button onClick={() => inputRef.current.focus()}>Focus</button>
      <button onClick={() => inputRef.current.clear()}>Clear</button>
    </>
  );
}
```

**TypeScript Example:**
```tsx
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, onClick, ...props }, ref) => {
    return <button ref={ref} onClick={onClick} {...props}>{children}</button>;
  }
);

Button.displayName = 'Button';
```

**Key Points:**
- Ref is the second parameter: `forwardRef((props, ref) => ...)`
- Always set `displayName` for better debugging
- Use sparingly - prefer props and state when possible
- Combine with `useImperativeHandle` to limit exposed API

---

### 26. What are Code Splitting and Lazy Loading in React?

**Code Splitting** is the process of splitting your application's bundle into smaller chunks that can be loaded on demand, reducing the initial load time.

**Lazy Loading** is the technique of loading components or modules only when they are needed, rather than loading everything upfront.

#### Why Use Code Splitting & Lazy Loading?

**Problems without code splitting:**
- Large bundle size (all code loaded at once)
- Slow initial page load
- Poor user experience on slow networks
- Wasted bandwidth for unused features

**Benefits:**
- ✅ Faster initial page load
- ✅ Reduced bundle size
- ✅ Better performance
- ✅ Load resources on demand
- ✅ Improved user experience

---

#### 1. React.lazy() and Suspense

The most common way to implement code splitting in React:

```jsx
import React, { lazy, Suspense } from 'react';

// ❌ Regular import - loads immediately
// import HeavyComponent from './HeavyComponent';

// ✅ Lazy import - loads when needed
const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <div>
      <h1>My App</h1>
      
      {/* Suspense provides fallback UI while component loads */}
      <Suspense fallback={<div>Loading component...</div>}>
        <HeavyComponent />
      </Suspense>
    </div>
  );
}
```

**How it works:**
1. Component is not in initial bundle
2. When component is rendered, React requests it
3. Fallback UI displays while loading
4. Component renders once loaded

---

#### 2. Route-Based Code Splitting

Split code by routes - most effective strategy:

```jsx
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Static imports for critical components
import Header from './components/Header';
import Footer from './components/Footer';

// Lazy load route components
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));

// Loading component
const LoadingSpinner = () => (
  <div className="loading">
    <div className="spinner"></div>
    <p>Loading...</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Header />
      
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Suspense>
      
      <Footer />
    </BrowserRouter>
  );
}

export default App;
```

---

#### 3. Component-Based Code Splitting

Split large components that aren't always needed:

```jsx
import React, { lazy, Suspense, useState } from 'react';

// Lazy load heavy components
const VideoPlayer = lazy(() => import('./VideoPlayer'));
const Chart = lazy(() => import('./Chart'));
const Map = lazy(() => import('./Map'));

function Dashboard() {
  const [showVideo, setShowVideo] = useState(false);
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Load video player only when user clicks */}
      <button onClick={() => setShowVideo(true)}>
        Show Video
      </button>
      
      {showVideo && (
        <Suspense fallback={<div>Loading video player...</div>}>
          <VideoPlayer url="/video.mp4" />
        </Suspense>
      )}
      
      {/* Load chart on demand */}
      <button onClick={() => setShowChart(true)}>
        Show Chart
      </button>
      
      {showChart && (
        <Suspense fallback={<div>Loading chart...</div>}>
          <Chart data={[1, 2, 3, 4, 5]} />
        </Suspense>
      )}
    </div>
  );
}
```

---

#### 4. Multiple Suspense Boundaries

Use multiple Suspense components for better UX:

```jsx
import React, { lazy, Suspense } from 'react';

const Sidebar = lazy(() => import('./Sidebar'));
const MainContent = lazy(() => import('./MainContent'));
const Comments = lazy(() => import('./Comments'));

function Page() {
  return (
    <div className="page">
      {/* Each section has its own loading state */}
      <Suspense fallback={<div>Loading sidebar...</div>}>
        <Sidebar />
      </Suspense>
      
      <Suspense fallback={<div>Loading content...</div>}>
        <MainContent />
      </Suspense>
      
      <Suspense fallback={<div>Loading comments...</div>}>
        <Comments />
      </Suspense>
    </div>
  );
}
```

---

#### 5. Named Exports with Lazy Loading

Handle named exports (not default):

```jsx
// Component.js
export const Button = () => <button>Click me</button>;
export const Input = () => <input />;

// App.js
import React, { lazy, Suspense } from 'react';

// ❌ This won't work
// const Button = lazy(() => import('./Component').Button);

// ✅ Correct way - re-export as default
const Button = lazy(() => 
  import('./Component').then(module => ({ default: module.Button }))
);

const Input = lazy(() =>
  import('./Component').then(module => ({ default: module.Input }))
);

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Button />
      <Input />
    </Suspense>
  );
}
```

---

#### 6. Preloading Components

Preload components before they're needed:

```jsx
import React, { lazy, Suspense, useState, useEffect } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

// Preload function
const preloadComponent = () => {
  const component = import('./HeavyComponent');
  return component;
};

function App() {
  const [show, setShow] = useState(false);

  // Preload on mouse hover
  const handleMouseEnter = () => {
    preloadComponent();
  };

  // Or preload after initial render
  useEffect(() => {
    // Preload after 2 seconds
    const timer = setTimeout(() => {
      preloadComponent();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <button 
        onClick={() => setShow(true)}
        onMouseEnter={handleMouseEnter}
      >
        Show Component
      </button>
      
      {show && (
        <Suspense fallback={<div>Loading...</div>}>
          <HeavyComponent />
        </Suspense>
      )}
    </div>
  );
}
```

---

#### 7. Error Handling with Lazy Loading

Combine with Error Boundaries:

```jsx
import React, { lazy, Suspense, Component } from 'react';

// Error Boundary
class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Lazy loading error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Failed to load component</h2>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const LazyComponent = lazy(() => import('./LazyComponent'));

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <LazyComponent />
      </Suspense>
    </ErrorBoundary>
  );
}
```

---

#### 8. Dynamic Import with Variables

Load components based on conditions:

```jsx
import React, { lazy, Suspense, useState } from 'react';

function DynamicComponentLoader() {
  const [componentName, setComponentName] = useState('');
  const [Component, setComponent] = useState(null);

  const loadComponent = (name) => {
    // Dynamic import based on user selection
    const LazyComponent = lazy(() => 
      import(`./components/${name}`)
        .catch(() => import('./components/NotFound'))
    );
    
    setComponent(() => LazyComponent);
  };

  return (
    <div>
      <select onChange={(e) => loadComponent(e.target.value)}>
        <option value="">Select Component</option>
        <option value="Dashboard">Dashboard</option>
        <option value="Profile">Profile</option>
        <option value="Settings">Settings</option>
      </select>

      {Component && (
        <Suspense fallback={<div>Loading...</div>}>
          <Component />
        </Suspense>
      )}
    </div>
  );
}
```

---

#### 9. Library Code Splitting

Split large libraries:

```jsx
import React, { lazy, Suspense, useState } from 'react';

// Don't import heavy libraries at the top
// import moment from 'moment'; // ❌ Large library loaded upfront

function DateFormatter() {
  const [formattedDate, setFormattedDate] = useState('');

  const formatDate = async () => {
    // ✅ Load library only when needed
    const moment = await import('moment');
    const formatted = moment.default().format('MMMM Do YYYY');
    setFormattedDate(formatted);
  };

  return (
    <div>
      <button onClick={formatDate}>Format Date</button>
      {formattedDate && <p>{formattedDate}</p>}
    </div>
  );
}

// Or with lazy loading
const DatePicker = lazy(() => 
  import('react-datepicker').then(module => ({
    default: module.default
  }))
);
```

---

#### 10. Webpack Magic Comments

Control how chunks are loaded:

```jsx
import React, { lazy, Suspense } from 'react';

// Name the chunk
const Dashboard = lazy(() => 
  import(/* webpackChunkName: "dashboard" */ './Dashboard')
);

// Prefetch - load during idle time
const Profile = lazy(() => 
  import(/* webpackPrefetch: true */ './Profile')
);

// Preload - load in parallel with parent
const Settings = lazy(() => 
  import(/* webpackPreload: true */ './Settings')
);

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Dashboard />
    </Suspense>
  );
}
```

---

#### Best Practices

1. **Route-Based Splitting First**
   - Split by routes before components
   - Biggest impact on initial load time

2. **Use Multiple Suspense Boundaries**
   - Better loading experience
   - Isolated loading states

3. **Meaningful Fallbacks**
   - Show skeleton screens
   - Match the component's layout

4. **Error Boundaries**
   - Always wrap lazy components
   - Handle loading failures gracefully

5. **Preload Critical Components**
   - Preload on hover/interaction
   - Improve perceived performance

6. **Avoid Over-Splitting**
   - Too many small chunks = many HTTP requests
   - Balance chunk size and quantity

7. **Monitor Bundle Size**
   - Use webpack-bundle-analyzer
   - Track chunk sizes over time

---

#### Common Patterns

**Loading Skeleton:**

```jsx
const Skeleton = () => (
  <div className="skeleton">
    <div className="skeleton-header" />
    <div className="skeleton-content" />
    <div className="skeleton-footer" />
  </div>
);

function App() {
  return (
    <Suspense fallback={<Skeleton />}>
      <LazyComponent />
    </Suspense>
  );
}
```

**Retry Mechanism:**

```jsx
function lazyWithRetry(componentImport) {
  return new Promise((resolve, reject) => {
    const hasRefreshed = JSON.parse(
      window.sessionStorage.getItem('retry-lazy-refreshed') || 'false'
    );

    componentImport()
      .then(component => {
        window.sessionStorage.setItem('retry-lazy-refreshed', 'false');
        resolve(component);
      })
      .catch(error => {
        if (!hasRefreshed) {
          window.sessionStorage.setItem('retry-lazy-refreshed', 'true');
          return window.location.reload();
        }
        reject(error);
      });
  });
}

const LazyComponent = lazy(() => lazyWithRetry(() => import('./Component')));
```

---

#### Measuring Impact

```jsx
// Before code splitting
// Initial bundle: 2.5 MB
// Load time: 8s

// After code splitting
// Initial bundle: 300 KB
// Route chunks: 200 KB each
// Load time: 1.5s (initial), 0.5s (per route)
```

**Key Takeaways:**

- ✅ Use `React.lazy()` for component code splitting
- ✅ Always wrap lazy components with `Suspense`
- ✅ Split by routes first, then by components
- ✅ Use multiple Suspense boundaries for better UX
- ✅ Combine with Error Boundaries for error handling
- ✅ Preload components when user intent is clear
- ✅ Monitor and analyze your bundle sizes

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

### 35. What are the design patterns used in React?

React uses several design patterns to build maintainable and reusable applications.

**1. Container/Presentational Components:**

**Definition:** Separates components into two categories:
- **Presentational Components**: Pure UI components that receive data via props and render it. They don't know where data comes from or how to change it.
- **Container Components**: Components that handle data fetching, state management, and business logic, then pass data to presentational components.

**Benefits:** Better separation of concerns, easier testing, and improved reusability.
```jsx
// Presentational Component (UI only)
function UserList({ users, onUserClick }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id} onClick={() => onUserClick(user.id)}>
          {user.name}
        </li>
      ))}
    </ul>
  );
}

// Container Component (Logic + Data)
function UserListContainer() {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    fetch('/api/users').then(res => res.json()).then(setUsers);
  }, []);
  
  const handleUserClick = (id) => {
    console.log('User clicked:', id);
  };
  
  return <UserList users={users} onUserClick={handleUserClick} />;
}
```

**2. Higher-Order Components (HOC):**

**Definition:** A function that takes a component and returns a new enhanced component with additional props or functionality. HOCs allow you to reuse component logic across different components without modifying the original component.

**Benefits:** Code reuse, cross-cutting concerns (auth, logging, data fetching), and separation of logic from UI.
```jsx
// HOC adds functionality
function withLoading(Component) {
  return function WithLoadingComponent({ isLoading, ...props }) {
    if (isLoading) return <div>Loading...</div>;
    return <Component {...props} />;
  };
}

const UserListWithLoading = withLoading(UserList);
```

**3. Render Props Pattern:**

**Definition:** A pattern where a component receives a function as a prop (typically called "render" or "children") that returns React elements. This function receives state/data from the component and uses it to render the UI. The component shares its internal state and logic through this function prop.

**Benefits:** Flexible component composition, shared state/logic, and avoids prop drilling.
```jsx
// Component that shares logic via render prop
function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return render(position);
}

// Usage
<MouseTracker render={({ x, y }) => (
  <p>Mouse position: {x}, {y}</p>
)} />
```

**4. Compound Components:**

**Definition:** A pattern where multiple components work together as a cohesive unit. These components share implicit state and communicate with each other, but the user can compose them flexibly. They're typically used for complex UI components like tabs, modals, or dropdowns.

**Benefits:** Flexible API, better encapsulation, and intuitive component structure.
```jsx
// Components that work together
const Tabs = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);
  return <div>{children({ activeTab, setActiveTab })}</div>;
};

const TabList = ({ children, activeTab, setActiveTab }) => (
  <div>{children}</div>
);

const Tab = ({ id, activeTab, setActiveTab, children }) => (
  <button 
    onClick={() => setActiveTab(id)}
    className={activeTab === id ? 'active' : ''}
  >
    {children}
  </button>
);

// Usage
<Tabs>
  {({ activeTab, setActiveTab }) => (
    <>
      <TabList activeTab={activeTab} setActiveTab={setActiveTab}>
        <Tab id={0} activeTab={activeTab} setActiveTab={setActiveTab}>Tab 1</Tab>
        <Tab id={1} activeTab={activeTab} setActiveTab={setActiveTab}>Tab 2</Tab>
      </TabList>
    </>
  )}
</Tabs>
```

**5. Provider Pattern (Context API):**

**Definition:** A pattern that uses React's Context API to share data across multiple components in the component tree without prop drilling. A Provider component wraps the tree and supplies data to all descendant components through Context.

**Benefits:** Avoids prop drilling, global state management, and cleaner component APIs.
```jsx
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

// Consumer hook
function useTheme() {
  return useContext(ThemeContext);
}
```

**6. Custom Hooks Pattern:**

**Definition:** Custom hooks are JavaScript functions that start with "use" and can call other hooks. They encapsulate reusable stateful logic and can be shared across multiple components. Custom hooks allow you to extract component logic into reusable functions.

**Benefits:** Logic reuse, cleaner components, and separation of concerns.
```jsx
// Reusable logic as custom hook
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });
  
  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };
  
  return [storedValue, setValue];
}

// Usage
function App() {
  const [name, setName] = useLocalStorage('name', '');
  return <input value={name} onChange={(e) => setName(e.target.value)} />;
}
```

**7. Component Composition:**

**Definition:** A pattern where you build complex UIs by combining smaller, simpler components together. Instead of creating monolithic components, you compose them by passing components as props or children, allowing flexible and reusable component structures.

**Benefits:** Reusability, flexibility, easier maintenance, and better code organization.
```jsx
// Compose components together
function Page({ header, sidebar, content, footer }) {
  return (
    <div>
      {header}
      <div className="layout">
        {sidebar}
        {content}
      </div>
      {footer}
    </div>
  );
}

// Usage
<Page
  header={<Header />}
  sidebar={<Sidebar />}
  content={<MainContent />}
  footer={<Footer />}
/>
```

**8. Controlled vs Uncontrolled Components:**

**Definition:** Two approaches for handling form inputs in React:
- **Controlled Components**: React controls the form data via state. The component's value is controlled by React state, and changes are handled through event handlers.
- **Uncontrolled Components**: The DOM itself manages the form data. React uses refs to access form values directly from the DOM.

**Benefits:** Controlled components provide more control and validation, while uncontrolled components are simpler for basic use cases.
```jsx
// Controlled - React manages state
function ControlledInput() {
  const [value, setValue] = useState('');
  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
}

// Uncontrolled - DOM manages state
function UncontrolledInput() {
  const inputRef = useRef();
  return <input ref={inputRef} defaultValue="initial" />;
}
```

**Key Takeaways:**
- **Container/Presentational**: Separates logic from UI
- **HOC**: Enhances components with additional functionality
- **Render Props**: Shares code via prop function
- **Compound Components**: Components that work together
- **Provider**: Shares data via Context API
- **Custom Hooks**: Reusable stateful logic
- **Composition**: Build complex UIs from simple components

### 36. What are some best practices in React?

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

These questions cover React fundamentals through advanced concepts and should thoroughly prepare you for a React.js interview! The topics range from basic component structure to advanced patterns like HOCs, custom hooks, design patterns, and performance optimization techniques that are essential for building modern React applications.