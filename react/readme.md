# React.js Interview Questions and Answers

A comprehensive collection of React.js interview questions covering basic to advanced concepts for frontend development interviews.

## Table of Contents

- [Basic Level](#basic-level)
- [Intermediate Level](#intermediate-level)
- [Advanced Level](#advanced-level)
  - [Offline Browsing Implementation](#40-how-do-you-implement-offline-browsing-in-react)
  - [Vite vs Webpack](#42-what-is-vite-what-is-webpack-what-is-the-difference)
  - [Clock with Increment/Decrement Buttons](#43-build-a-clock-with-incrementdecrement-buttons-for-hours-and-minutes)
  - [Dice Component](#44-build-a-dice-component)

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

### How many ways can we share data across different components in React?

There are many ways to share data across components depending on scope and complexity. Common approaches include:

- **Props (Parent → Child):** Pass data and callbacks down the component tree.
- **Lifting State Up:** Move shared state to the nearest common ancestor and pass it via props.
- **Context API:** Provide values to many descendants without prop drilling.
- **State Management Libraries:** Global stores like Redux, MobX, Recoil, or Zustand for app-wide state.
- **useReducer + Context:** Combine `useReducer` with Context for predictable state and actions across components.
- **Custom Hooks:** Encapsulate shared logic/state in hooks and reuse them across components.
- **Render Props / Function-as-Child:** Share behavior or data by passing a function as a child (older pattern).
- **Higher-Order Components (HOCs):** Wrap components to inject props or behavior (older pattern).
- **URL / Route Params:** Share state via query parameters or route params for navigation-related data.
- **Local Storage / Session Storage:** Persist and share state via browser storage for cross-tab or reload persistence.
- **Server / Backend Sync:** Keep shared data on the server and fetch where needed.
- **Event Emitters / Pub-Sub:** Use an event bus (or libraries) for decoupled communication between distant components.

Notes:
- Choose lightweight options (`props`, `Context`, `custom hooks`) for component-level needs.
- Use global stores (Redux, Recoil, Zustand) when you need predictable, testable, app-wide state.
- Prefer `Context` with `useReducer` over heavy libraries for medium complexity.

### Microfrontends with React (short Q&A)

**What is a microfrontend?**

Microfrontends apply microservice principles to the frontend: a large UI is split into smaller, independently developed and deployed “microapps.” Each microapp owns its UI, data-fetching, tests, and deployment, and is integrated into a host (shell) at runtime or build-time.

**Why use microfrontends?**

- **Team autonomy:** Teams can work independently, choose tools, and deploy without coordinating a monolithic release.
- **Independent deploys & scaling:** Roll out features or fixes for one microapp without deploying the entire frontend.
- **Incremental migration:** Migrate or replace parts of a large app gradually (e.g., rewrite one screen at a time).
- **Tech heterogeneity:** Allow different microapps to use different frameworks or library versions where appropriate.
- **Clear ownership:** Each microapp has its own repository/pipeline, improving ownership and accountability.

**When not to use microfrontends**

- For small apps or teams — added infra and operational complexity outweighs benefits.
- When network overhead or performance constraints make many independent bundles impractical.

**Composition patterns**

- **Build-time composition:** Package microapps together at build (simple but couples builds).
- **Runtime composition:** Load remotes at runtime using Module Federation, import maps/SystemJS, or `single-spa` (enables independent deploys).

**Turborepo approach**

Use a Turborepo-managed monorepo with `apps/` (host + micro-apps) and `packages/` (shared libs). Turborepo orchestrates builds and caching; combine it with Module Federation (webpack) or Vite federation to load remotes at runtime.

**Key considerations**

- **Shared deps:** Prefer singletons for React and critical libs to avoid duplicate React instances (Module Federation `shared` config).
- **Routing ownership:** Host owns top-level routes; micro-apps own internal routing. Use a lifecycle manager like `single-spa` for mount/unmount.
- **Communication:** Use explicit contracts — route params, host-owned global state, events/pub-sub, or `window.postMessage` for iframes.
- **Styling isolation:** Avoid CSS collisions via CSS Modules, CSS-in-JS, or Shadow DOM.
- **Tradeoffs:** Adds infra, debugging complexity, and potential bundle/network overhead; enforce semver and singletons to reduce runtime issues.

If you'd like, I can scaffold a runnable Turborepo starter (host + one remote) using either `webpack` (Module Federation) or `vite` (federation plugin). Which bundler do you prefer?

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

### How to pass data when navigating with `useNavigate`?

You can pass transient data via the `state` option of `useNavigate`, and read it in the destination with `useLocation`.

Example (sender):

```jsx
import { useNavigate } from 'react-router-dom';

function From() {
  const navigate = useNavigate();
  const user = { id: 1, name: 'Alice' };

  const go = () => navigate('/to', { state: { user, from: '/from' } });

  return <button onClick={go}>Go to details</button>;
}
```

Example (receiver):

```jsx
import { useLocation } from 'react-router-dom';

function To() {
  const { state } = useLocation();
  const user = state?.user;

  return <div>{user ? `Hello ${user.name}` : 'No data received'}</div>;
}
```

Notes:
- Data passed via `navigate(..., { state })` is stored in history state and is not part of the URL. It will be lost on a full page refresh or when someone opens the URL directly.
- For persistence across refresh/bookmark/share use query params, route params (`useParams()`), or persist to storage (`sessionStorage`/`localStorage`) and rehydrate on mount.
- Use `replace: true` to navigate without adding a new history entry: `navigate('/to', { state, replace: true })`.
- For cross-tab or long-lived sharing prefer server-side state (IDs in URL) or storage plus a URL token.


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

### 25. How do we prevent unnecessary re-renders of child components? What strategies does React provide for optimizing this?

**Answer:**
React provides several strategies to prevent unnecessary re-renders:

**1. React.memo:**
Prevents re-renders when props haven't changed.

```jsx
const Child = React.memo(({ name }) => {
  return <div>{name}</div>;
});
```

**2. useCallback:**
Memoizes functions to prevent new function references.

```jsx
const handleClick = useCallback(() => {
  console.log('clicked');
}, []);

return <Child onClick={handleClick} />;
```

**3. useMemo:**
Memoizes values to prevent new object/array references.

```jsx
const user = useMemo(() => ({ name: 'John', age: 30 }), []);
return <Child user={user} />;
```

**4. Split Components:**
Isolate frequently changing state.

```jsx
// Separate state into wrapper components
function CounterWrapper() {
  const [count, setCount] = useState(0);
  return <Counter count={count} />;
}
```

**Best Practices:**
- Use `React.memo` for expensive components
- Use `useCallback` for functions passed as props
- Use `useMemo` for objects/arrays passed as props
- Split components to isolate state changes

### 26. What is forwardRef in React and how does it work?

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

### 27. What is React Fiber?

React Fiber is the reimplementation of React's reconciliation algorithm (introduced in React 16). It breaks rendering work into small units called "fibers" so work can be paused, aborted, or resumed. Key points:

- Fiber is a linked tree of units of work representing components and their state
- Enables incremental (time-sliced) rendering and cooperative scheduling
- Supports prioritization of updates (higher-priority updates interrupt lower-priority work)
- Makes features like Suspense, concurrent rendering and interruptible rendering possible

In short, Fiber lets React keep the UI responsive by splitting rendering into chunks and scheduling them according to priority.

### 28. What is batching in React?

Batching groups multiple state updates into a single render to avoid unnecessary renders and improve performance. Notes:

- Historically, React batched updates inside React event handlers; updates from other async sources were not batched.
- Since React 18, automatic batching applies across more contexts (promises, timeouts, native event handlers), so multiple state updates are usually combined into one render.
- Use `flushSync` (or `ReactDOM.flushSync`) to force a synchronous render when needed.

Example:

```jsx
// multiple setState calls will be batched into one render
setCount(c => c + 1);
setName('Alice');
```

### 29. What is React concurrency (concurrent rendering)?

React concurrency (often called concurrent rendering) is the set of capabilities built on Fiber that allow React to prepare and update UI in an interruptible, prioritized way. Important ideas:

- Not parallel threads — it's cooperative scheduling on the main thread that can pause and resume rendering work
- Enables smoother UIs by yielding to user input, keeping interactions responsive
- Core features: time-slicing, Suspense, `useTransition`/`startTransition`, and server components
- `useTransition` lets you mark updates as low priority (transitions) so urgent updates remain responsive

Example using `useTransition`:

```jsx
import { useTransition } from 'react';

function Search() {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  function onChange(e) {
    const value = e.target.value;
    // mark this update as non-urgent
    startTransition(() => {
      setQuery(value);
    });
  }

  return (
    <>
      <input onChange={onChange} />
      {isPending ? <div>Loading...</div> : <Results query={query} />}
    </>
  );
}
```

These features let developers prioritize what matters for responsiveness while deferring expensive renders.

---

### 27. What are Code Splitting and Lazy Loading in React?

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

### 28. What is Error Boundary?

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

### 29. What is the difference between React Router's Link and anchor tag?

- **`<Link>`**: Prevents full page reload, uses client-side routing
- **`<a>`**: Causes full page reload, server request

```jsx
import { Link } from 'react-router-dom';

// React Router Link (preferred)
<Link to="/about">About</Link>

// Anchor tag (causes reload)
<a href="/about">About</a>
```

### 30. What are Portals in React?

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

### 31. What is the difference between createElement and cloneElement?

**createElement:** Creates a new React element

```jsx
React.createElement('div', { className: 'container' }, 'Hello');
```

**cloneElement:** Clones an existing element and adds/overrides props

```jsx
const element = <button>Click</button>;
const cloned = React.cloneElement(element, { onClick: handleClick });
```

### 32. What are some React performance optimization techniques?

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

### 33. What is the difference between componentWillMount and componentDidMount?

- **componentWillMount** (deprecated): Called before mounting, not recommended
- **componentDidMount**: Called after component is mounted, ideal for API calls, subscriptions

### 34. What is reconciliation in React?

Reconciliation is the process React uses to diff the virtual DOM with the previous version and update only changed parts of the real DOM efficiently using a diffing algorithm.

### 35. What are Synthetic Events in React?

Synthetic Events are React's cross-browser wrapper around native browser events, providing consistent API across browsers.

```jsx
function handleClick(e) {
  e.preventDefault(); // Synthetic event
  console.log(e.type); // Works consistently across browsers
}
```

### 36. What is StrictMode in React?

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

### 37. What are the design patterns used in React?

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

### 38. How do you display 5 divs in a row without using flex, margin, or padding?

There are several ways to display multiple divs in a row without using flexbox, margin, or padding.

**Solution 1: Using `display: inline-block` with `font-size: 0`**

```jsx
function InlineBlockExample() {
  const containerStyle = {
    fontSize: 0,  // Removes whitespace between inline-block elements
    width: '100%'
  };
  
  const divStyle = {
    display: 'inline-block',
    width: '20%',
    backgroundColor: '#e3f2fd',
    border: '1px solid #2196f3',
    height: '100px',
    fontSize: '16px',  // Restore font size for content
    verticalAlign: 'top',
    textAlign: 'center',
    lineHeight: '100px',
    boxSizing: 'border-box'
  };
  
  return (
    <div style={containerStyle}>
      <div style={divStyle}>Div 1</div>
      <div style={divStyle}>Div 2</div>
      <div style={divStyle}>Div 3</div>
      <div style={divStyle}>Div 4</div>
      <div style={divStyle}>Div 5</div>
    </div>
  );
}
```

**Key Points:**
- `fontSize: 0` on parent removes whitespace between inline-block elements
- Each div gets `width: 20%` (5 divs = 100%)
- `verticalAlign: 'top'` aligns divs at the top
- Restore `fontSize` on child divs if they contain text

**Solution 2: Using CSS Grid**

```jsx
function GridExample() {
  const containerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',  // 5 equal columns
    width: '100%'
  };
  
  const divStyle = {
    backgroundColor: '#f3e5f5',
    border: '1px solid #9c27b0',
    height: '100px',
    textAlign: 'center',
    lineHeight: '100px',
    boxSizing: 'border-box'
  };
  
  return (
    <div style={containerStyle}>
      <div style={divStyle}>Div 1</div>
      <div style={divStyle}>Div 2</div>
      <div style={divStyle}>Div 3</div>
      <div style={divStyle}>Div 4</div>
      <div style={divStyle}>Div 5</div>
    </div>
  );
}
```

**Key Points:**
- `gridTemplateColumns: 'repeat(5, 1fr)'` creates 5 equal columns
- No whitespace issues
- Modern and clean approach
- No need for `font-size: 0` trick

**Alternative: Using Float (Less Common)**

```jsx
function FloatExample() {
  const containerStyle = {
    overflow: 'hidden'  // Clear float
  };
  
  const divStyle = {
    float: 'left',
    width: '20%',
    backgroundColor: '#fff3e0',
    border: '1px solid #ff9800',
    height: '100px',
    textAlign: 'center',
    lineHeight: '100px',
    boxSizing: 'border-box'
  };
  
  return (
    <div style={containerStyle}>
      <div style={divStyle}>Div 1</div>
      <div style={divStyle}>Div 2</div>
      <div style={divStyle}>Div 3</div>
      <div style={divStyle}>Div 4</div>
      <div style={divStyle}>Div 5</div>
    </div>
  );
}
```

**Why these approaches work:**
- **Inline-block**: Elements flow horizontally, `font-size: 0` removes whitespace
- **Grid**: Modern layout system that creates columns automatically
- **Float**: Older technique, requires clearing with `overflow: hidden`

**Recommendation:** Use CSS Grid (Solution 2) for modern browsers, or inline-block (Solution 1) for broader compatibility.

### 39. How do you build a To-Do List application and optimize re-renders?

Building an optimized To-Do List requires understanding React's rendering behavior and applying optimization techniques to prevent unnecessary re-renders.

**Key Optimization Techniques:**

**1. React.memo for Component Memoization:**
```jsx
// Memoized TodoItem - only re-renders when props change
const TodoItem = memo(({ todo, onToggle, onDelete }) => {
  return (
    <li>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span>{todo.text}</span>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </li>
  );
});
```

**2. useCallback for Function Memoization:**
```jsx
function TodoList() {
  const [todos, setTodos] = useState([]);
  
  // Memoized callbacks - same reference across renders
  const handleToggle = useCallback((id) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []); // Empty deps - function never changes
  
  const handleDelete = useCallback((id) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  }, []);
  
  return (
    <ul>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      ))}
    </ul>
  );
}
```

**3. useMemo for Expensive Calculations:**
```jsx
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  
  // Memoized filtered todos - only recalculates when dependencies change
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);
  
  // Memoized statistics
  const stats = useMemo(() => ({
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length
  }), [todos]);
  
  return (
    <div>
      <p>Total: {stats.total}, Active: {stats.active}, Completed: {stats.completed}</p>
      {filteredTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}
```

**Complete Optimized Example:**
```jsx
import React, { useState, useCallback, useMemo, memo } from 'react';

const TodoItem = memo(({ todo, onToggle, onDelete }) => {
  return (
    <li>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
        {todo.text}
      </span>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </li>
  );
});

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  
  const handleAdd = useCallback((text) => {
    setTodos(prev => [...prev, {
      id: Date.now(),
      text,
      completed: false
    }]);
  }, []);
  
  const handleToggle = useCallback((id) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }, []);
  
  const handleDelete = useCallback((id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);
  
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active': return todos.filter(t => !t.completed);
      case 'completed': return todos.filter(t => t.completed);
      default: return todos;
    }
  }, [todos, filter]);
  
  return (
    <div>
      <TodoForm onAdd={handleAdd} />
      <div>
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('active')}>Active</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
      </div>
      <ul>
        {filteredTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}
      </ul>
    </div>
  );
}
```

**Optimization Benefits:**
- **React.memo**: Prevents TodoItem from re-rendering when other todos change
- **useCallback**: Stable function references prevent unnecessary re-renders
- **useMemo**: Expensive calculations (filtering, stats) only run when needed
- **Stable keys**: Using `todo.id` helps React efficiently track changes
- **Functional updates**: `prev => ...` ensures working with latest state

**Performance Impact:**
- Without optimization: All items re-render when any todo changes
- With optimization: Only changed items re-render
- Significant improvement with large lists (100+ todos)

### 40. How do you implement offline browsing in React?

**Answer:** Offline browsing in React is achieved through **Progressive Web Apps (PWA)** using **Service Workers** and caching strategies. This allows your app to work without an internet connection by storing resources locally and serving them when the network is unavailable.

**How It Works:**

1. **Service Worker**: A JavaScript file that runs in the background, separate from your web page. It acts as a proxy between your app and the network, intercepting requests and serving cached responses when offline.

2. **Caching**: Resources (HTML, CSS, JS, images, API responses) are stored in the browser's Cache API. The service worker decides when to use cached data vs. fetching from the network.

3. **Manifest File**: Defines your app as installable and provides metadata for "Add to Home Screen" functionality.

**Key Concepts:**

- **Service Workers** run on a separate thread and can work even when the page is closed
- **Cache API** provides persistent storage that survives page refreshes
- **Event-driven**: Service workers respond to install, activate, and fetch events
- **Lifecycle**: Install → Activate → Fetch (intercepting network requests)

#### 1. Service Worker Setup

**Create `public/sw.js`:**

```javascript
const CACHE_NAME = 'my-app-v1';
const urlsToCache = ['/', '/static/css/main.css', '/static/js/main.js'];

// Install: Cache resources when service worker is first installed
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch: Intercept network requests, serve from cache if offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => 
      response || fetch(event.request)
    )
  );
});

// Activate: Clean up old caches when new service worker activates
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.map((name) => 
        name !== CACHE_NAME && caches.delete(name)
      ))
    )
  );
});
```

**Explanation:**
- **Install event**: Runs once when the service worker is first registered. Caches critical resources immediately.
- **Fetch event**: Intercepts every network request. Checks cache first, falls back to network if not found.
- **Activate event**: Runs when a new service worker takes control. Deletes old caches to free up space.

#### 2. Register Service Worker

**In `src/index.js`:**

```jsx
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => console.log('SW registered'))
      .catch((err) => console.log('SW registration failed', err));
  });
}
```

**Explanation:** Service workers must be registered from the main thread. We wait for the page to load to avoid blocking initial rendering. The registration is asynchronous and returns a promise.

#### 3. Web App Manifest

**Create `public/manifest.json`:**

```json
{
  "short_name": "My App",
  "name": "My React App",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff",
  "icons": [
    { "src": "logo192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "logo512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

**Add to `public/index.html`:**

```html
<link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
<meta name="theme-color" content="#000000" />
```

**Explanation:** The manifest makes your app installable. It defines how the app appears when added to the home screen, what icon to use, and the start URL. The theme-color meta tag sets the browser UI color.

#### 4. Offline Detection Hook

```jsx
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
```

**Explanation:** `navigator.onLine` gives the initial status, but it's not always reliable. The `online` and `offline` events fire when the browser detects network changes. This hook provides a reactive way to track connectivity in your components.

#### 5. Caching Strategies

**Cache First (for static assets):**
- Check cache first, use if found
- Only fetch from network if not in cache
- Best for: Images, fonts, CSS, JS files that rarely change

**Network First (for API calls):**
- Try network first, fall back to cache if offline
- Updates cache with fresh data when online
- Best for: API responses, dynamic content that changes frequently

**Example:**

```javascript
// Cache First for images
self.addEventListener('fetch', (event) => {
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request).then((cached) =>
        cached || fetch(event.request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
      )
    );
  }
});
```

**Explanation:** For images, we prioritize cache (faster) but still fetch and cache new images for future use. This provides instant loading for previously viewed images while keeping the cache updated.

#### 6. Using Workbox (Recommended)

**Workbox** is a library that simplifies service worker implementation with pre-built strategies.

**Install:**
```bash
npm install workbox-webpack-plugin --save-dev
```

**Configure:**
```javascript
// webpack.config.js
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  plugins: [
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [{
        urlPattern: /^https:\/\/api\./,
        handler: 'NetworkFirst',
        options: { cacheName: 'api-cache', expiration: { maxEntries: 50 } }
      }]
    })
  ]
};
```

**Explanation:** Workbox generates a service worker automatically with best practices. `clientsClaim` makes the new service worker take control immediately. `skipWaiting` activates it without waiting for all tabs to close. Runtime caching defines how different URL patterns should be cached.

**Key Points:**

- ✅ **Service Workers** run in the background and intercept network requests
- ✅ **Cache API** stores resources locally for offline access
- ✅ **Cache First** for static assets (images, CSS, JS) - prioritize speed
- ✅ **Network First** for dynamic content (APIs) - prioritize freshness
- ✅ **Manifest.json** enables "Add to Home Screen" functionality
- ✅ **Workbox** simplifies implementation with pre-built strategies
- ✅ Test in Chrome DevTools → Application → Service Workers → Offline checkbox

**Best Practices:**

1. **Cache critical resources** on install for instant offline access
2. **Use appropriate strategies** - Cache First for assets, Network First for APIs
3. **Version your caches** - Update CACHE_NAME when app updates to clear old caches
4. **Show offline indicator** - Inform users when they're offline
5. **Sync when online** - Queue actions while offline, sync when connection returns
6. **Limit cache size** - Set maxEntries and maxAgeSeconds to prevent unlimited growth
7. **Handle errors gracefully** - Provide fallback UI when cache and network both fail

### 41. What are some best practices in React?

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

### 42. What is Vite? What is Webpack? What is the difference?

**Answer:**

#### Vite

Vite is a modern, fast build tool created by Evan You (Vue.js creator). It's designed for speed and better developer experience.

**How it works:**
- Uses **native ES modules** in the browser during development
- No bundling needed in dev mode — serves files directly
- Only transforms files on-demand when browser requests them
- Uses **esbuild** (extremely fast, written in Go) for pre-bundling dependencies
- Uses **Rollup** for production builds

**Key benefits:**
- ⚡ Instant server start (< 1 second)
- ⚡ Near-instant Hot Module Replacement (HMR)
- Minimal configuration required
- Built-in TypeScript, JSX, CSS support

#### Webpack

Webpack is a powerful, mature module bundler that has been the industry standard for years. It bundles JavaScript, CSS, images, and assets into optimized output files.

**How it works:**
- Analyzes entire dependency graph at startup
- Bundles everything before serving
- Uses **loaders** to transform files (Babel, CSS, images)
- Uses **plugins** for additional functionality (minification, optimization)

**Key benefits:**
- Highly configurable and extensible
- Massive plugin ecosystem
- Code splitting and lazy loading
- Works with virtually any asset type
- Better legacy browser support

#### Key Differences

| Feature | Vite | Webpack |
|---------|------|---------|
| **Dev Server Startup** | Instant (no bundling) | Slow (bundles first) |
| **HMR Speed** | ~50ms | 1-3 seconds |
| **Configuration** | Minimal | Complex |
| **Dev Mode** | Native ES modules | Full bundling |
| **Production Build** | Rollup | Webpack |
| **Learning Curve** | Easy | Steep |
| **Maturity** | Newer (2020) | Established (2012) |
| **Ecosystem** | Growing | Massive |

#### Why Vite is Faster in Development

1. **No bundling on startup** — Serves source files directly via native ES modules
2. **On-demand compilation** — Only transforms files when browser requests them
3. **Pre-bundling with esbuild** — Pre-bundles `node_modules` using esbuild (10-100x faster than JavaScript-based tools)

**Example: Cold start with 1000 modules**
- Webpack: 20-30 seconds
- Vite: < 1 second

#### When to Use Each

**Choose Vite when:**
- Starting a new React/Vue/Svelte project
- Developer experience and speed are priorities
- You want minimal configuration
- Building modern SPAs

**Choose Webpack when:**
- Working on legacy projects already using Webpack
- Need maximum configurability
- Require specific loaders/plugins not in Vite
- Need broader legacy browser support

#### Quick Setup Comparison

**Vite:**
```bash
npm create vite@latest my-app -- --template react
cd my-app && npm install && npm run dev  # Starts instantly
```

**Webpack (via Create React App):**
```bash
npx create-react-app my-app
cd my-app && npm start  # Takes time to bundle
```

**Summary:**
- **Vite** = Fast, modern, simple — ideal for new projects
- **Webpack** = Powerful, mature, flexible — better for complex/legacy projects

Most new React projects today start with Vite for its speed and simplicity.

### 43. Build a Clock with Increment/Decrement Buttons for Hours and Minutes

**Scenario:** You are given a page with a clock. Implement the logic for buttons to increment and decrement the hours and minutes.

**Requirements:**
- Display hours and minutes (HH:MM format)
- Buttons to increment/decrement hours (+1/-1)
- Buttons to increment/decrement minutes (+1/-1)
- Hours should wrap: 23 → 0 (increment) and 0 → 23 (decrement)
- Minutes should wrap: 59 → 0 (increment) and 0 → 59 (decrement)

**Solution:**

```jsx
import { useState } from 'react';

function Clock() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  const incrementHours = () => setHours((prev) => (prev + 1) % 24);
  const decrementHours = () => setHours((prev) => (prev - 1 + 24) % 24);
  
  const incrementMinutes = () => setMinutes((prev) => (prev + 1) % 60);
  const decrementMinutes = () => setMinutes((prev) => (prev - 1 + 60) % 60);

  // Format to always show 2 digits (e.g., 09:05)
  const formatTime = (value) => value.toString().padStart(2, '0');

  return (
    <div style={{ textAlign: 'center', fontFamily: 'monospace' }}>
      <h1 style={{ fontSize: '4rem' }}>
        {formatTime(hours)}:{formatTime(minutes)}
      </h1>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        {/* Hours Controls */}
        <div>
          <p>Hours</p>
          <button onClick={incrementHours}>+</button>
          <button onClick={decrementHours}>-</button>
        </div>
        
        {/* Minutes Controls */}
        <div>
          <p>Minutes</p>
          <button onClick={incrementMinutes}>+</button>
          <button onClick={decrementMinutes}>-</button>
        </div>
      </div>
    </div>
  );
}

export default Clock;
```

**Key Concepts:**

1. **State Management:** Two separate `useState` hooks for hours and minutes
2. **Wrapping Logic:** 
   - `(prev + 1) % 24` — wraps 23 → 0 for hours
   - `(prev - 1 + 24) % 24` — wraps 0 → 23 (add 24 to handle negative modulo)
3. **Formatting:** `padStart(2, '0')` ensures two-digit display (e.g., "09" instead of "9")

**Alternative: With Minutes Affecting Hours**

If incrementing minutes past 59 should also increment hours:

```jsx
const incrementMinutes = () => {
  setMinutes((prev) => {
    if (prev === 59) {
      incrementHours();
      return 0;
    }
    return prev + 1;
  });
};

const decrementMinutes = () => {
  setMinutes((prev) => {
    if (prev === 0) {
      decrementHours();
      return 59;
    }
    return prev - 1;
  });
};
```

**Alternative: Initialize with Current Time**

```jsx
const now = new Date();
const [hours, setHours] = useState(now.getHours());
const [minutes, setMinutes] = useState(now.getMinutes());
```

### 44. Build a Dice Component

**Scenario:** Create a dice button that generates a random number from 1 to 6 when clicked.

**Solution:**

```jsx
import { useState } from 'react';

function Dice() {
  const [value, setValue] = useState(1);

  const rollDice = () => {
    const randomNumber = Math.floor(Math.random() * 6) + 1;
    setValue(randomNumber);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ fontSize: '5rem' }}>🎲 {value}</h1>
      <button onClick={rollDice} style={{ padding: '10px 20px', fontSize: '1.2rem' }}>
        Roll Dice
      </button>
    </div>
  );
}

export default Dice;
```

**Key Concept:**
- `Math.random()` returns a number from 0 (inclusive) to 1 (exclusive)
- `Math.random() * 6` gives 0 to 5.999...
- `Math.floor()` rounds down to 0, 1, 2, 3, 4, or 5
- Adding 1 gives final range: 1 to 6

**Formula:** `Math.floor(Math.random() * (max - min + 1)) + min`

---

## Conclusion

These questions cover React fundamentals through advanced concepts and should thoroughly prepare you for a React.js interview! The topics range from basic component structure to advanced patterns like HOCs, custom hooks, design patterns, and performance optimization techniques that are essential for building modern React applications.

## Core Web Vitals (Short Answer)

- **What:** User-centric metrics from Google measuring loading, interactivity, and visual stability.
- **Key metrics:**
  - **LCP (Largest Contentful Paint):** loading — good ≤ 2.5s, needs improvement 2.5–4s, poor > 4s.
  - **INP (Interaction to Next Paint):** responsiveness (replacement for FID) — lower is better; aim ≲200ms.
  - **CLS (Cumulative Layout Shift):** visual stability — good ≤ 0.1, needs improvement 0.1–0.25, poor > 0.25.
- **Why it matters:** Directly correlates with user experience and affects SEO and conversions.
- **How measured:** RUM (Chrome UX Report, web-vitals JS) and lab tools (Lighthouse, PageSpeed Insights, DevTools).
- **Common fixes:**
  - *LCP:* optimize server/critical resources, compress & preload large assets, lazy-load below-the-fold.
  - *INP:* break up long tasks, defer heavy JS, optimize event handlers, use web workers.
  - *CLS:* reserve image/iframe sizes, avoid inserting content above existing content, reserve ad slots.
- **Interview tip:** Define the three metrics, state thresholds, mention tools (`Lighthouse`, `web-vitals`), and give one concrete fix per metric.

## SSE Example

Simple Server-Sent Events example (Node + React):

- **Server**: See [node/sse-server/server.js](node/sse-server/server.js) — minimal Express endpoint `GET /events` that streams a JSON payload every second.
- **React component**: See [react/examples/sse-demo.jsx](react/examples/sse-demo.jsx) — `SSEDemo` component that connects to an SSE endpoint using `EventSource` and renders incoming events.

Notes: This is an example only. To run the server, install `express` and `cors` and start `server.js`. In a real app, set the correct `url` prop for `SSEDemo` (for example `http://localhost:3000/events`).