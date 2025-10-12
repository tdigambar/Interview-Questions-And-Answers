/**
 * Asynchronous Operations in TypeScript
 * Comprehensive examples of handling async code with type safety
 */

// Sample interfaces
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

interface Post {
  id: number;
  title: string;
  content: string;
  userId: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

// ============================================================================
// 1. Basic Promises with Type Annotations
// ============================================================================

function fetchUser(id: number): Promise<User> {
  return fetch(`/api/users/${id}`)
    .then((response) => response.json())
    .then((data) => data as User);
}

// Using the promise
fetchUser(1)
  .then((user: User) => {
    console.log(`User: ${user.name}`);
  })
  .catch((error: Error) => {
    console.error(`Error: ${error.message}`);
  });

// ============================================================================
// 2. Async/Await (Recommended)
// ============================================================================

async function getUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const user: User = await response.json();
  return user;
}

async function displayUser(id: number): Promise<void> {
  try {
    const user = await getUser(id);
    console.log(`User: ${user.name}, Email: ${user.email}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to fetch user: ${error.message}`);
    } else {
      console.error("An unknown error occurred");
    }
  }
}

// ============================================================================
// 3. Generic Async Functions
// ============================================================================

async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return (await response.json()) as T;
}

// Usage with type inference
async function getUserData() {
  const user = await fetchData<User>("/api/users/1");
  const products = await fetchData<Product[]>("/api/products");

  console.log(user.name); // TypeScript knows user is User
  console.log(products[0].price); // TypeScript knows products is Product[]
}

// ============================================================================
// 4. Result Type Pattern (Type-Safe Error Handling)
// ============================================================================

type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

async function safeFetchUser(id: number): Promise<Result<User>> {
  try {
    const response = await fetch(`/api/users/${id}`);

    if (!response.ok) {
      return {
        success: false,
        error: new Error(`HTTP ${response.status}: ${response.statusText}`),
      };
    }

    const user = await response.json();
    return { success: true, data: user };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
}

// Usage - forces error checking
async function displayUserSafely(id: number): Promise<void> {
  const result = await safeFetchUser(id);

  if (result.success) {
    console.log(`User: ${result.data.name}`); // TypeScript knows data exists
  } else {
    console.error(`Error: ${result.error.message}`); // TypeScript knows error exists
  }
}

// ============================================================================
// 5. Custom Error Types with Type Guards
// ============================================================================

class NetworkError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = "NetworkError";
  }
}

class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = "ValidationError";
  }
}

class NotFoundError extends Error {
  constructor(message: string, public resourceId: number) {
    super(message);
    this.name = "NotFoundError";
  }
}

// Type guards
function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}

function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

function isNotFoundError(error: unknown): error is NotFoundError {
  return error instanceof NotFoundError;
}

async function createUser(data: Omit<User, "id">): Promise<User> {
  try {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.status === 400) {
      throw new ValidationError("Invalid user data", "email");
    }

    if (!response.ok) {
      throw new NetworkError("Failed to create user", response.status);
    }

    return await response.json();
  } catch (error) {
    if (isNetworkError(error)) {
      console.error(`Network error (${error.statusCode}): ${error.message}`);
    } else if (isValidationError(error)) {
      console.error(`Validation error on ${error.field}: ${error.message}`);
    } else {
      console.error("Unknown error:", error);
    }
    throw error;
  }
}

// ============================================================================
// 6. Promise.all - Parallel Operations
// ============================================================================

async function fetchUserAndPosts(userId: number): Promise<{
  user: User;
  posts: Post[];
}> {
  const [user, posts] = await Promise.all([
    fetchData<User>(`/api/users/${userId}`),
    fetchData<Post[]>(`/api/posts?userId=${userId}`),
  ]);

  return { user, posts };
}

// Multiple different types
async function fetchDashboardData() {
  const [users, products, posts] = await Promise.all([
    fetchData<User[]>("/api/users"),
    fetchData<Product[]>("/api/products"),
    fetchData<Post[]>("/api/posts"),
  ]);

  return { users, products, posts };
}

// ============================================================================
// 7. Promise.allSettled - Handling Partial Failures
// ============================================================================

async function fetchMultipleUsers(ids: number[]): Promise<{
  successful: User[];
  failed: Array<{ id: number; error: string }>;
}> {
  const promises = ids.map((id) =>
    fetchData<User>(`/api/users/${id}`).catch((error) => ({
      error: true,
      id,
      message: error.message,
    }))
  );

  const results = await Promise.allSettled(promises);

  const successful: User[] = [];
  const failed: Array<{ id: number; error: string }> = [];

  results.forEach((result, index) => {
    if (result.status === "fulfilled" && !("error" in result.value)) {
      successful.push(result.value);
    } else if (result.status === "rejected") {
      failed.push({ id: ids[index], error: result.reason.message });
    } else if (result.status === "fulfilled" && "error" in result.value) {
      failed.push({ id: ids[index], error: result.value.message });
    }
  });

  return { successful, failed };
}

// ============================================================================
// 8. Promise.race - Timeout Pattern
// ============================================================================

async function fetchWithTimeout<T>(
  url: string,
  timeoutMs: number = 5000
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("Request timeout")), timeoutMs);
  });

  const fetchPromise = fetch(url).then((res) => res.json());

  return (await Promise.race([fetchPromise, timeoutPromise])) as T;
}

// Usage
async function getUserWithTimeout(id: number): Promise<User> {
  try {
    return await fetchWithTimeout<User>(`/api/users/${id}`, 3000);
  } catch (error) {
    if (error instanceof Error && error.message === "Request timeout") {
      console.error("Request timed out after 3 seconds");
    }
    throw error;
  }
}

// ============================================================================
// 9. Retry Logic
// ============================================================================

async function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown error");
      console.log(`Attempt ${attempt}/${maxRetries} failed: ${lastError.message}`);

      if (attempt < maxRetries) {
        console.log(`Retrying in ${delayMs}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  throw lastError!;
}

// Usage
async function fetchUserWithRetry(id: number): Promise<User> {
  return retry(() => fetchData<User>(`/api/users/${id}`), 3, 2000);
}

// ============================================================================
// 10. Async State Management
// ============================================================================

type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };

class AsyncDataManager<T> {
  private state: AsyncState<T> = { status: "idle" };
  private listeners: Array<(state: AsyncState<T>) => void> = [];

  subscribe(listener: (state: AsyncState<T>) => void): () => void {
    this.listeners.push(listener);
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private setState(newState: AsyncState<T>): void {
    this.state = newState;
    this.listeners.forEach((listener) => listener(newState));
  }

  async execute(fn: () => Promise<T>): Promise<void> {
    this.setState({ status: "loading" });

    try {
      const data = await fn();
      this.setState({ status: "success", data });
    } catch (error) {
      this.setState({
        status: "error",
        error: error instanceof Error ? error : new Error("Unknown error"),
      });
    }
  }

  getState(): AsyncState<T> {
    return this.state;
  }

  isLoading(): boolean {
    return this.state.status === "loading";
  }

  getData(): T | null {
    return this.state.status === "success" ? this.state.data : null;
  }

  getError(): Error | null {
    return this.state.status === "error" ? this.state.error : null;
  }
}

// Usage
const userManager = new AsyncDataManager<User>();

userManager.subscribe((state) => {
  if (state.status === "loading") {
    console.log("Loading user...");
  } else if (state.status === "success") {
    console.log("User loaded:", state.data.name);
  } else if (state.status === "error") {
    console.error("Error loading user:", state.error.message);
  }
});

// Execute async operation
// await userManager.execute(() => fetchUser(1));

// ============================================================================
// 11. Async Service Class Pattern
// ============================================================================

class UserService {
  private baseUrl = "/api/users";

  async getUser(id: number): Promise<User> {
    return fetchData<User>(`${this.baseUrl}/${id}`);
  }

  async getAllUsers(): Promise<User[]> {
    return fetchData<User[]>(this.baseUrl);
  }

  async createUser(data: Omit<User, "id">): Promise<User> {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create user: ${response.statusText}`);
    }

    return response.json();
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update user: ${response.statusText}`);
    }

    return response.json();
  }

  async deleteUser(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete user: ${response.statusText}`);
    }
  }

  async searchUsers(query: string): Promise<User[]> {
    return fetchData<User[]>(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`);
  }
}

// ============================================================================
// 12. Async Generators and Pagination
// ============================================================================

interface PaginatedResponse<T> {
  items: T[];
  hasMore: boolean;
  nextPage: number | null;
}

async function* fetchPaginatedData<T>(
  baseUrl: string,
  pageSize: number = 10
): AsyncGenerator<T[], void, undefined> {
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await fetchData<PaginatedResponse<T>>(
      `${baseUrl}?page=${page}&size=${pageSize}`
    );

    yield response.items;
    hasMore = response.hasMore;
    page++;

    if (!hasMore) break;
  }
}

// Usage
async function processAllProducts(): Promise<void> {
  for await (const products of fetchPaginatedData<Product>("/api/products", 20)) {
    console.log(`Processing ${products.length} products`);
    // Process each page
    products.forEach((product) => {
      console.log(`- ${product.name}: $${product.price}`);
    });
  }
}

// ============================================================================
// 13. Debouncing Async Operations
// ============================================================================

function debounceAsync<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  delayMs: number
): (...args: T) => Promise<R> {
  let timeoutId: NodeJS.Timeout;
  let latestResolve: (value: R) => void;
  let latestReject: (reason: any) => void;

  return (...args: T): Promise<R> => {
    clearTimeout(timeoutId);

    return new Promise<R>((resolve, reject) => {
      latestResolve = resolve;
      latestReject = reject;

      timeoutId = setTimeout(async () => {
        try {
          const result = await fn(...args);
          latestResolve(result);
        } catch (error) {
          latestReject(error);
        }
      }, delayMs);
    });
  };
}

// Usage
const debouncedSearch = debounceAsync(async (query: string): Promise<User[]> => {
  return await fetchData<User[]>(`/api/search?q=${query}`);
}, 300);

// ============================================================================
// 14. Async Queue with Concurrency Control
// ============================================================================

class AsyncQueue<T> {
  private queue: Array<() => Promise<T>> = [];
  private running = 0;

  constructor(private concurrency: number = 3) {}

  async add(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await task();
          resolve(result);
          return result;
        } catch (error) {
          reject(error);
          throw error;
        }
      });

      this.process();
    });
  }

  private async process(): Promise<void> {
    if (this.running >= this.concurrency || this.queue.length === 0) {
      return;
    }

    this.running++;
    const task = this.queue.shift();

    if (task) {
      try {
        await task();
      } finally {
        this.running--;
        this.process();
      }
    }
  }
}

// Usage
async function batchFetchUsers(ids: number[]): Promise<User[]> {
  const queue = new AsyncQueue<User>(3); // Max 3 concurrent requests
  const promises = ids.map((id) => queue.add(() => fetchUser(id)));
  return Promise.all(promises);
}

console.log("✅ All async operation examples compiled successfully!");

export {};

