# React Query (TanStack Query) Interview Questions and Answers

A comprehensive collection of React Query interview questions covering basic to advanced concepts for server state management in React applications.

## Table of Contents

- [Basic Level](#basic-level)
- [Intermediate Level](#intermediate-level)
- [Advanced Level](#advanced-level)

---

## Basic Level

### 1. What is React Query (TanStack Query)?

React Query (now called TanStack Query) is a powerful data synchronization library for React applications. It provides hooks for fetching, caching, synchronizing, and updating server state in your React applications.

**Key Features:**
- **Automatic Caching**: Intelligently caches and deduplicates requests
- **Background Updates**: Automatically refetches stale data
- **Optimistic Updates**: Update UI before server confirmation
- **Error Handling**: Built-in error states and retry logic
- **DevTools**: Powerful debugging tools

### 2. What are the main benefits of using React Query?

**Performance Benefits:**
- Automatic request deduplication
- Intelligent caching with configurable stale times
- Background refetching to keep data fresh
- Request cancellation to prevent race conditions

**Developer Experience:**
- Declarative data fetching
- Built-in loading and error states
- Optimistic updates
- Powerful DevTools for debugging

**User Experience:**
- Instant data display from cache
- Seamless background updates
- Optimistic UI updates
- Automatic retry on failures

### 3. How do you install and set up React Query?

**Installation:**
```bash
npm install @tanstack/react-query
# or
yarn add @tanstack/react-query
```

**Basic Setup:**
```jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### 4. What is the useQuery hook?

`useQuery` is the primary hook for fetching data in React Query. It returns an object with data, loading state, error state, and various utility functions.

```jsx
import { useQuery } from '@tanstack/react-query';

function UserProfile({ userId }) {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId, // Only run if userId exists
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.email}</p>
    </div>
  );
}
```

### 5. What is the useMutation hook?

`useMutation` is used for creating, updating, or deleting data. It provides optimistic updates, error handling, and success callbacks.

```jsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

function CreateUser() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: (newUser) => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ['users'] });
      console.log('User created:', newUser);
    },
    onError: (error) => {
      console.error('Failed to create user:', error);
    },
  });

  const handleSubmit = (userData) => {
    mutation.mutate(userData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
}
```

### 6. What are query keys?

Query keys are unique identifiers for queries that React Query uses for caching, deduplication, and invalidation. They should be serializable and unique for each query.

```jsx
// Simple query key
const { data } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
});

// Hierarchical query key
const { data } = useQuery({
  queryKey: ['users', userId],
  queryFn: () => fetchUser(userId),
});

// Complex query key with parameters
const { data } = useQuery({
  queryKey: ['users', { status: 'active', page: 1 }],
  queryFn: () => fetchUsers({ status: 'active', page: 1 }),
});

// Array-based query key
const { data } = useQuery({
  queryKey: ['posts', 'list', { authorId, category }],
  queryFn: () => fetchPosts({ authorId, category }),
});
```

### 7. What is the difference between staleTime and cacheTime?

**staleTime**: How long data is considered fresh. During this time, React Query won't refetch the data automatically.

**cacheTime**: How long unused data stays in the cache before being garbage collected.

```jsx
const { data } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh for 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes - data stays in cache for 10 minutes
});
```

**Example:**
- User visits page → data fetched and cached
- User navigates away → data stays in cache for 10 minutes
- User returns within 5 minutes → data served from cache (still fresh)
- User returns after 5 minutes → data refetched (stale but still in cache)

### 8. How do you handle loading and error states?

React Query provides several state properties for handling different scenarios:

```jsx
function UserList() {
  const { 
    data, 
    isLoading,     // Initial loading state
    isFetching,    // Loading state (including background refetch)
    isError,       // Error state
    error,         // Error object
    isSuccess,     // Success state
    isIdle,        // Query is disabled
    status,        // 'pending' | 'error' | 'success'
    fetchStatus    // 'fetching' | 'paused' | 'idle'
  } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  if (isLoading) return <div>Loading users...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  if (isSuccess) {
    return (
      <div>
        {isFetching && <div>Updating...</div>}
        {data.map(user => <div key={user.id}>{user.name}</div>)}
      </div>
    );
  }

  return null;
}
```

### 9. What is query invalidation?

Query invalidation marks queries as stale and triggers a refetch. It's commonly used after mutations to keep data in sync.

```jsx
import { useQueryClient } from '@tanstack/react-query';

function UserActions({ userId }) {
  const queryClient = useQueryClient();

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      // Invalidate specific query
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      
      // Invalidate all user queries
      queryClient.invalidateQueries({ queryKey: ['users'] });
      
      // Invalidate queries with partial matching
      queryClient.invalidateQueries({ 
        queryKey: ['users'], 
        exact: false 
      });
    },
  });

  // Manual invalidation
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
  };

  return (
    <div>
      <button onClick={() => updateUserMutation.mutate(userData)}>
        Update User
      </button>
      <button onClick={handleRefresh}>Refresh</button>
    </div>
  );
}
```

### 10. What is the difference between React Query and Redux?

| React Query | Redux |
|-------------|-------|
| Server state management | Client state management |
| Automatic caching and synchronization | Manual state management |
| Built-in loading/error states | Custom state handling |
| Optimistic updates | Manual optimistic updates |
| Background refetching | No automatic updates |
| Request deduplication | No built-in deduplication |
| Focus on data fetching | Focus on state management |
| Less boilerplate | More boilerplate |

---

## Intermediate Level

### 11. What are query options and how do you configure them?

Query options allow you to customize the behavior of queries:

```jsx
const { data } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  
  // Caching options
  staleTime: 5 * 60 * 1000,        // 5 minutes
  cacheTime: 10 * 60 * 1000,       // 10 minutes
  refetchOnWindowFocus: false,     // Don't refetch on window focus
  refetchOnMount: true,            // Refetch when component mounts
  refetchOnReconnect: true,        // Refetch when network reconnects
  
  // Retry options
  retry: 3,                        // Retry 3 times on failure
  retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  
  // Other options
  enabled: !!userId,               // Only run if userId exists
  suspense: true,                  // Enable Suspense mode
  placeholderData: [],             // Placeholder data while loading
  initialData: [],                 // Initial data (considered fresh)
  select: (data) => data.users,    // Transform data
});
```

### 12. What is the useInfiniteQuery hook?

`useInfiniteQuery` is used for implementing infinite scrolling and pagination. It manages a list of pages and provides utilities for loading more data.

```jsx
import { useInfiniteQuery } from '@tanstack/react-query';

function InfiniteUserList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ['users'],
    queryFn: ({ pageParam = 0 }) => fetchUsers({ page: pageParam }),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length : undefined;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data.pages.map((page, i) => (
        <div key={i}>
          {page.users.map(user => (
            <div key={user.id}>{user.name}</div>
          ))}
        </div>
      ))}
      
      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage ? 'Loading more...' : 'Load More'}
      </button>
    </div>
  );
}
```

### 13. How do you implement optimistic updates?

Optimistic updates allow you to update the UI immediately while the mutation is in progress, then rollback if it fails.

```jsx
function TodoItem({ todo }) {
  const queryClient = useQueryClient();

  const updateTodoMutation = useMutation({
    mutationFn: updateTodo,
    onMutate: async (newTodo) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      // Snapshot previous value
      const previousTodos = queryClient.getQueryData(['todos']);

      // Optimistically update
      queryClient.setQueryData(['todos'], (old) =>
        old.map(todo => 
          todo.id === newTodo.id ? { ...todo, ...newTodo } : todo
        )
      );

      // Return context for rollback
      return { previousTodos };
    },
    onError: (err, newTodo, context) => {
      // Rollback on error
      queryClient.setQueryData(['todos'], context.previousTodos);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const handleToggle = () => {
    updateTodoMutation.mutate({
      ...todo,
      completed: !todo.completed,
    });
  };

  return (
    <div>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        disabled={updateTodoMutation.isPending}
      />
      <span>{todo.text}</span>
    </div>
  );
}
```

### 14. What is the select option in useQuery?

The `select` option allows you to transform or select a subset of the data returned by the query function.

```jsx
// Transform data
const { data: userNames } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  select: (data) => data.map(user => user.name),
});

// Select specific fields
const { data: userCount } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  select: (data) => data.length,
});

// Complex transformation
const { data: activeUsers } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  select: (data) => 
    data
      .filter(user => user.status === 'active')
      .sort((a, b) => a.name.localeCompare(b.name)),
});

// Memoized select function
const selectActiveUsers = useCallback((data) => 
  data.filter(user => user.status === 'active'), []
);

const { data: activeUsers } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  select: selectActiveUsers,
});
```

### 15. How do you handle dependent queries?

Dependent queries are queries that depend on the result of another query. You can use the `enabled` option to control when they run.

```jsx
function UserProfile({ userId }) {
  // First query - fetch user
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId,
  });

  // Second query - depends on user data
  const { data: posts } = useQuery({
    queryKey: ['posts', user?.id],
    queryFn: () => fetchUserPosts(user.id),
    enabled: !!user?.id, // Only run if user exists
  });

  // Third query - depends on posts
  const { data: comments } = useQuery({
    queryKey: ['comments', posts?.map(p => p.id)],
    queryFn: () => fetchCommentsForPosts(posts.map(p => p.id)),
    enabled: !!posts?.length,
  });

  if (!user) return <div>Loading user...</div>;
  if (!posts) return <div>Loading posts...</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      {posts.map(post => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}
```

### 16. What is the useQueryClient hook?

`useQueryClient` provides access to the QueryClient instance, allowing you to manually interact with the cache and queries.

```jsx
import { useQueryClient } from '@tanstack/react-query';

function CacheManager() {
  const queryClient = useQueryClient();

  // Get cached data
  const cachedUsers = queryClient.getQueryData(['users']);

  // Set cached data
  const setCachedData = () => {
    queryClient.setQueryData(['users'], mockUsers);
  };

  // Remove cached data
  const clearCache = () => {
    queryClient.removeQueries({ queryKey: ['users'] });
  };

  // Prefetch data
  const prefetchUsers = () => {
    queryClient.prefetchQuery({
      queryKey: ['users'],
      queryFn: fetchUsers,
      staleTime: 5 * 60 * 1000,
    });
  };

  // Get query state
  const queryState = queryClient.getQueryState(['users']);

  return (
    <div>
      <button onClick={setCachedData}>Set Cached Data</button>
      <button onClick={clearCache}>Clear Cache</button>
      <button onClick={prefetchUsers}>Prefetch Users</button>
      <div>Query State: {queryState?.status}</div>
    </div>
  );
}
```

### 17. How do you implement error boundaries with React Query?

React Query provides built-in error handling, but you can also use Error Boundaries for additional error management.

```jsx
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function UserProfile({ userId }) {
  const { data, error, isError } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    retry: false, // Disable retry for Error Boundary
    throwOnError: true, // Throw error to Error Boundary
  });

  return <div>{data.name}</div>;
}

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset query cache on error boundary reset
        queryClient.clear();
      }}
    >
      <UserProfile userId={1} />
    </ErrorBoundary>
  );
}
```

### 18. What is the difference between placeholderData and initialData?

**placeholderData**: Data shown while the query is loading for the first time. It's not cached and doesn't affect the stale time.

**initialData**: Data that's considered as already fetched. It's cached and affects the stale time.

```jsx
// placeholderData - shown while loading, not cached
const { data } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  placeholderData: [], // Empty array while loading
});

// initialData - considered as fetched data, cached
const { data } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  initialData: { id: userId, name: 'Loading...', email: '' },
  initialDataUpdatedAt: Date.now(), // When initial data was created
});
```

### 19. How do you implement real-time updates with React Query?

You can combine React Query with WebSockets or Server-Sent Events for real-time updates.

```jsx
function RealTimeUserList() {
  const queryClient = useQueryClient();

  // Initial data fetch
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  // WebSocket connection for real-time updates
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080/users');

    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      
      // Update cache based on WebSocket message
      queryClient.setQueryData(['users'], (old) => {
        switch (update.type) {
          case 'USER_ADDED':
            return [...old, update.user];
          case 'USER_UPDATED':
            return old.map(user => 
              user.id === update.user.id ? update.user : user
            );
          case 'USER_DELETED':
            return old.filter(user => user.id !== update.userId);
          default:
            return old;
        }
      });
    };

    return () => ws.close();
  }, [queryClient]);

  return (
    <div>
      {users?.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### 20. How do you test React Query hooks?

Testing React Query requires wrapping your components with QueryClientProvider.

```jsx
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProfile } from './UserProfile';

// Mock the API function
jest.mock('./api', () => ({
  fetchUser: jest.fn(),
}));

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithQueryClient = (component) => {
  const testQueryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={testQueryClient}>
      {component}
    </QueryClientProvider>
  );
};

test('renders user profile', async () => {
  const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com' };
  fetchUser.mockResolvedValue(mockUser);

  renderWithQueryClient(<UserProfile userId={1} />);

  expect(screen.getByText('Loading...')).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });
});
```

---

## Advanced Level

### 21. What is React Query DevTools and how do you use it?

React Query DevTools provides powerful debugging capabilities for your queries and mutations.

```jsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      <ReactQueryDevtools 
        initialIsOpen={false}
        position="bottom-right"
        toggleButtonProps={{
          style: {
            marginLeft: '5px',
            transform: 'none',
          },
        }}
      />
    </QueryClientProvider>
  );
}
```

**DevTools Features:**
- View all queries and their states
- Inspect query data and metadata
- Manually trigger refetches
- View query timeline and performance
- Debug mutations and their states

### 22. How do you implement custom hooks with React Query?

Custom hooks encapsulate query logic and make it reusable across components.

```jsx
// Custom hook for user data
function useUser(userId) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

// Custom hook for user mutations
function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (data, variables) => {
      // Update specific user in cache
      queryClient.setQueryData(['user', variables.id], data);
      
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// Custom hook with multiple queries
function useUserDashboard(userId) {
  const userQuery = useUser(userId);
  const postsQuery = useQuery({
    queryKey: ['posts', userId],
    queryFn: () => fetchUserPosts(userId),
    enabled: !!userId,
  });
  const commentsQuery = useQuery({
    queryKey: ['comments', userId],
    queryFn: () => fetchUserComments(userId),
    enabled: !!userId,
  });

  return {
    user: userQuery.data,
    posts: postsQuery.data,
    comments: commentsQuery.data,
    isLoading: userQuery.isLoading || postsQuery.isLoading || commentsQuery.isLoading,
    isError: userQuery.isError || postsQuery.isError || commentsQuery.isError,
    error: userQuery.error || postsQuery.error || commentsQuery.error,
  };
}
```

### 23. What is the useQueries hook?

`useQueries` allows you to run multiple queries in parallel with dynamic query keys.

```jsx
import { useQueries } from '@tanstack/react-query';

function UserList({ userIds }) {
  const userQueries = useQueries({
    queries: userIds.map((id) => ({
      queryKey: ['user', id],
      queryFn: () => fetchUser(id),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const isLoading = userQueries.some(query => query.isLoading);
  const isError = userQueries.some(query => query.isError);

  if (isLoading) return <div>Loading users...</div>;
  if (isError) return <div>Error loading users</div>;

  return (
    <div>
      {userQueries.map((query, index) => (
        <div key={userIds[index]}>
          {query.data ? query.data.name : 'Loading...'}
        </div>
      ))}
    </div>
  );
}
```

### 24. How do you implement offline support with React Query?

React Query provides built-in offline support through the `networkMode` option and network status detection.

```jsx
import { useQuery, useMutation } from '@tanstack/react-query';

// Query with offline support
const { data } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  networkMode: 'offlineFirst', // Try cache first, then network
  staleTime: Infinity, // Data never goes stale when offline
});

// Mutation with offline support
const mutation = useMutation({
  mutationFn: createUser,
  networkMode: 'offlineFirst',
  onMutate: async (newUser) => {
    // Optimistically update cache
    queryClient.setQueryData(['users'], (old) => [...old, newUser]);
  },
  onError: (error, newUser, context) => {
    // Rollback on error
    queryClient.setQueryData(['users'], context.previousUsers);
  },
});

// Network status hook
function useNetworkStatus() {
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

### 25. What is the difference between React Query and SWR?

| React Query | SWR |
|-------------|-----|
| More features and options | Simpler API |
| Better TypeScript support | Good TypeScript support |
| More powerful DevTools | Basic DevTools |
| Better mutation handling | Limited mutation support |
| More configuration options | Less configuration |
| Larger bundle size | Smaller bundle size |
| More learning curve | Easier to learn |
| Better for complex apps | Good for simple apps |

### 26. How do you implement pagination with React Query?

There are several ways to implement pagination with React Query:

**1. Simple Pagination:**
```jsx
function UserList({ page }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['users', page],
    queryFn: () => fetchUsers({ page, limit: 10 }),
    keepPreviousData: true, // Keep previous page data while loading
  });

  return (
    <div>
      {data?.users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
      <Pagination 
        currentPage={page}
        totalPages={data?.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
```

**2. Cursor-based Pagination:**
```jsx
function CursorUserList() {
  const [cursor, setCursor] = useState(null);
  
  const { data, isLoading } = useQuery({
    queryKey: ['users', cursor],
    queryFn: () => fetchUsers({ cursor, limit: 10 }),
    keepPreviousData: true,
  });

  return (
    <div>
      {data?.users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
      <button
        onClick={() => setCursor(data?.nextCursor)}
        disabled={!data?.hasNextPage}
      >
        Load More
      </button>
    </div>
  );
}
```

### 27. How do you implement search with React Query?

Implementing search with debouncing and caching:

```jsx
import { useDebounce } from 'use-debounce';

function SearchUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const { data: users, isLoading } = useQuery({
    queryKey: ['users', 'search', debouncedSearchTerm],
    queryFn: () => searchUsers(debouncedSearchTerm),
    enabled: debouncedSearchTerm.length > 2,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search users..."
      />
      
      {isLoading && <div>Searching...</div>}
      
      {users && (
        <div>
          {users.map(user => (
            <div key={user.id}>{user.name}</div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### 28. How do you implement optimistic updates with rollback?

Advanced optimistic updates with proper rollback handling:

```jsx
function OptimisticTodoList() {
  const queryClient = useQueryClient();

  const addTodoMutation = useMutation({
    mutationFn: addTodo,
    onMutate: async (newTodo) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      // Snapshot previous value
      const previousTodos = queryClient.getQueryData(['todos']);

      // Create optimistic todo
      const optimisticTodo = {
        id: Date.now(), // Temporary ID
        ...newTodo,
        completed: false,
        isOptimistic: true, // Flag for UI
      };

      // Optimistically update
      queryClient.setQueryData(['todos'], (old) => [optimisticTodo, ...old]);

      return { previousTodos, optimisticTodo };
    },
    onError: (error, newTodo, context) => {
      // Rollback on error
      queryClient.setQueryData(['todos'], context.previousTodos);
      
      // Show error notification
      toast.error('Failed to add todo');
    },
    onSuccess: (data, variables, context) => {
      // Replace optimistic todo with real data
      queryClient.setQueryData(['todos'], (old) =>
        old.map(todo =>
          todo.id === context.optimisticTodo.id ? data : todo
        )
      );
    },
  });

  return (
    <div>
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        addTodoMutation.mutate({
          text: formData.get('text'),
        });
        e.target.reset();
      }}>
        <input name="text" placeholder="Add todo..." />
        <button type="submit" disabled={addTodoMutation.isPending}>
          {addTodoMutation.isPending ? 'Adding...' : 'Add Todo'}
        </button>
      </form>
    </div>
  );
}
```

### 29. How do you implement React Query with Next.js?

Integration with Next.js for SSR and SSG:

```jsx
// pages/_app.js
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

function MyApp({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}

// pages/users.js - SSR with React Query
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query';

export async function getServerSideProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default function UsersPage() {
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  return (
    <div>
      {users?.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### 30. What are React Query best practices?

1. **Use meaningful query keys**: Make them hierarchical and descriptive
2. **Set appropriate stale times**: Balance freshness with performance
3. **Use select for data transformation**: Keep components clean
4. **Implement proper error handling**: Use Error Boundaries and retry logic
5. **Use optimistic updates**: Improve user experience
6. **Prefetch data**: Load data before users need it
7. **Use custom hooks**: Encapsulate query logic
8. **Handle loading states**: Provide good UX during data fetching
9. **Use DevTools**: Debug and optimize your queries
10. **Test your queries**: Write tests for your data fetching logic

```jsx
// Best practices example
function useUserProfile(userId) {
  return useQuery({
    queryKey: ['user', 'profile', userId], // Hierarchical key
    queryFn: () => fetchUserProfile(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    select: (data) => ({
      name: data.name,
      email: data.email,
      avatar: data.avatar,
    }), // Transform data
    enabled: !!userId, // Only run if userId exists
    onError: (error) => {
      console.error('Failed to fetch user profile:', error);
    },
  });
}
```

---

## Conclusion

These questions cover React Query fundamentals through advanced concepts and should thoroughly prepare you for a React Query interview! The topics range from basic data fetching to advanced patterns like optimistic updates, offline support, and testing strategies that are essential for building modern React applications with efficient server state management.

Key areas covered include:
- **Core Concepts**: useQuery, useMutation, query keys, caching
- **Advanced Features**: Infinite queries, optimistic updates, real-time updates
- **Performance**: Caching strategies, prefetching, background updates
- **Testing**: Unit testing, integration testing, mocking
- **Best Practices**: Error handling, custom hooks, performance optimization
