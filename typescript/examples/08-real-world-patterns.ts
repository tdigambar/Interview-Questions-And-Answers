/**
 * Real-World TypeScript Patterns
 * Demonstrates practical patterns and best practices
 */

// 1. Repository Pattern
interface Entity {
  id: number;
}

interface Repository<T extends Entity> {
  findById(id: number): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(entity: Omit<T, "id">): Promise<T>;
  update(id: number, entity: Partial<T>): Promise<T>;
  delete(id: number): Promise<void>;
}

interface User extends Entity {
  name: string;
  email: string;
}

class UserRepository implements Repository<User> {
  private users: User[] = [];
  private nextId = 1;

  async findById(id: number): Promise<User | null> {
    return this.users.find((u) => u.id === id) || null;
  }

  async findAll(): Promise<User[]> {
    return [...this.users];
  }

  async create(user: Omit<User, "id">): Promise<User> {
    const newUser: User = { ...user, id: this.nextId++ };
    this.users.push(newUser);
    return newUser;
  }

  async update(id: number, updates: Partial<User>): Promise<User> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error("User not found");

    this.users[index] = { ...this.users[index], ...updates };
    return this.users[index];
  }

  async delete(id: number): Promise<void> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error("User not found");
    this.users.splice(index, 1);
  }
}

// 2. Service Layer Pattern
class UserService {
  constructor(private repository: UserRepository) {}

  async getUserById(id: number): Promise<User | null> {
    return this.repository.findById(id);
  }

  async getAllUsers(): Promise<User[]> {
    return this.repository.findAll();
  }

  async createUser(data: Omit<User, "id">): Promise<User> {
    // Add business logic here
    if (!data.email.includes("@")) {
      throw new Error("Invalid email");
    }
    return this.repository.create(data);
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const user = await this.repository.findById(id);
    if (!user) throw new Error("User not found");

    return this.repository.update(id, updates);
  }

  async deleteUser(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}

// 3. Builder Pattern
class QueryBuilder<T> {
  private filters: Array<(item: T) => boolean> = [];
  private sortFn?: (a: T, b: T) => number;
  private limitValue?: number;
  private skipValue: number = 0;

  where(predicate: (item: T) => boolean): this {
    this.filters.push(predicate);
    return this;
  }

  orderBy(compareFn: (a: T, b: T) => number): this {
    this.sortFn = compareFn;
    return this;
  }

  limit(count: number): this {
    this.limitValue = count;
    return this;
  }

  skip(count: number): this {
    this.skipValue = count;
    return this;
  }

  execute(data: T[]): T[] {
    let result = [...data];

    // Apply filters
    for (const filter of this.filters) {
      result = result.filter(filter);
    }

    // Apply sorting
    if (this.sortFn) {
      result = result.sort(this.sortFn);
    }

    // Apply skip
    result = result.slice(this.skipValue);

    // Apply limit
    if (this.limitValue !== undefined) {
      result = result.slice(0, this.limitValue);
    }

    return result;
  }
}

// 4. Factory Pattern
interface Product {
  name: string;
  price: number;
  category: string;
}

interface ProductFactory {
  createProduct(data: Omit<Product, "category">): Product;
}

class ElectronicsFactory implements ProductFactory {
  createProduct(data: Omit<Product, "category">): Product {
    return { ...data, category: "Electronics" };
  }
}

class FurnitureFactory implements ProductFactory {
  createProduct(data: Omit<Product, "category">): Product {
    return { ...data, category: "Furniture" };
  }
}

// 5. Observer Pattern
interface Observer<T> {
  update(data: T): void;
}

interface Subject<T> {
  attach(observer: Observer<T>): void;
  detach(observer: Observer<T>): void;
  notify(data: T): void;
}

class EventEmitter<T> implements Subject<T> {
  private observers: Observer<T>[] = [];

  attach(observer: Observer<T>): void {
    this.observers.push(observer);
  }

  detach(observer: Observer<T>): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  notify(data: T): void {
    for (const observer of this.observers) {
      observer.update(data);
    }
  }
}

class Logger implements Observer<string> {
  update(data: string): void {
    console.log(`[LOG]: ${data}`);
  }
}

// 6. Strategy Pattern
interface SortStrategy<T> {
  sort(data: T[]): T[];
}

class BubbleSort<T> implements SortStrategy<T> {
  sort(data: T[]): T[] {
    const arr = [...data];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }
    return arr;
  }
}

class QuickSort<T> implements SortStrategy<T> {
  sort(data: T[]): T[] {
    if (data.length <= 1) return data;

    const pivot = data[Math.floor(data.length / 2)];
    const left = data.filter((x) => x < pivot);
    const middle = data.filter((x) => x === pivot);
    const right = data.filter((x) => x > pivot);

    return [...this.sort(left), ...middle, ...this.sort(right)];
  }
}

class Sorter<T> {
  constructor(private strategy: SortStrategy<T>) {}

  setStrategy(strategy: SortStrategy<T>): void {
    this.strategy = strategy;
  }

  sort(data: T[]): T[] {
    return this.strategy.sort(data);
  }
}

// 7. Dependency Injection
interface Logger {
  log(message: string): void;
}

class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(message);
  }
}

class FileLogger implements Logger {
  log(message: string): void {
    // Write to file
    console.log(`[FILE]: ${message}`);
  }
}

class Application {
  constructor(private logger: Logger) {}

  run(): void {
    this.logger.log("Application started");
  }
}

// Usage with DI
const app = new Application(new ConsoleLogger());
app.run();

// 8. Result Type for Error Handling
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = "ValidationError";
  }
}

function validateEmail(email: string): Result<string, ValidationError> {
  if (!email.includes("@")) {
    return {
      success: false,
      error: new ValidationError("Invalid email format", "email")
    };
  }
  return { success: true, data: email };
}

function processUserRegistration(email: string): Result<User, ValidationError> {
  const emailResult = validateEmail(email);

  if (!emailResult.success) {
    return emailResult;
  }

  const user: User = {
    id: 1,
    name: "User",
    email: emailResult.data
  };

  return { success: true, data: user };
}

// 9. Type-Safe API Client
type ApiEndpoints = {
  "/users": {
    GET: { response: User[] };
    POST: { body: Omit<User, "id">; response: User };
  };
  "/users/:id": {
    GET: { response: User };
    PUT: { body: Partial<User>; response: User };
    DELETE: { response: void };
  };
};

class ApiClient {
  constructor(private baseUrl: string) {}

  async get<T extends keyof ApiEndpoints>(
    endpoint: T
  ): Promise<ApiEndpoints[T]["GET"]["response"]> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    return response.json();
  }

  async post<T extends keyof ApiEndpoints>(
    endpoint: T,
    body: ApiEndpoints[T]["POST"]["body"]
  ): Promise<ApiEndpoints[T]["POST"]["response"]> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    return response.json();
  }
}

// 10. State Machine Pattern
type State = "idle" | "loading" | "success" | "error";

type Event =
  | { type: "FETCH" }
  | { type: "SUCCESS"; data: any }
  | { type: "ERROR"; error: Error }
  | { type: "RESET" };

interface Context {
  data: any;
  error: Error | null;
}

class StateMachine {
  private state: State = "idle";
  private context: Context = { data: null, error: null };

  transition(event: Event): void {
    switch (this.state) {
      case "idle":
        if (event.type === "FETCH") {
          this.state = "loading";
        }
        break;

      case "loading":
        if (event.type === "SUCCESS") {
          this.state = "success";
          this.context.data = event.data;
        } else if (event.type === "ERROR") {
          this.state = "error";
          this.context.error = event.error;
        }
        break;

      case "success":
      case "error":
        if (event.type === "RESET") {
          this.state = "idle";
          this.context = { data: null, error: null };
        } else if (event.type === "FETCH") {
          this.state = "loading";
        }
        break;
    }
  }

  getState(): State {
    return this.state;
  }

  getContext(): Context {
    return this.context;
  }
}

// 11. Middleware Pattern
type Middleware<T> = (context: T, next: () => Promise<void>) => Promise<void>;

class MiddlewareStack<T> {
  private middlewares: Middleware<T>[] = [];

  use(middleware: Middleware<T>): this {
    this.middlewares.push(middleware);
    return this;
  }

  async execute(context: T): Promise<void> {
    let index = 0;

    const next = async (): Promise<void> => {
      if (index < this.middlewares.length) {
        const middleware = this.middlewares[index++];
        await middleware(context, next);
      }
    };

    await next();
  }
}

// Usage
interface RequestContext {
  url: string;
  method: string;
  body?: any;
}

const stack = new MiddlewareStack<RequestContext>();

stack
  .use(async (ctx, next) => {
    console.log(`Logging: ${ctx.method} ${ctx.url}`);
    await next();
  })
  .use(async (ctx, next) => {
    const start = Date.now();
    await next();
    console.log(`Duration: ${Date.now() - start}ms`);
  })
  .use(async (ctx, next) => {
    console.log("Authenticating...");
    await next();
  });

// 12. Command Pattern
interface Command {
  execute(): void;
  undo(): void;
}

class AddUserCommand implements Command {
  constructor(
    private repository: UserRepository,
    private user: Omit<User, "id">,
    private createdUser?: User
  ) {}

  async execute(): Promise<void> {
    this.createdUser = await this.repository.create(this.user);
  }

  async undo(): Promise<void> {
    if (this.createdUser) {
      await this.repository.delete(this.createdUser.id);
    }
  }
}

class CommandManager {
  private history: Command[] = [];
  private currentIndex = -1;

  async executeCommand(command: Command): Promise<void> {
    await command.execute();
    this.history = this.history.slice(0, this.currentIndex + 1);
    this.history.push(command);
    this.currentIndex++;
  }

  async undo(): Promise<void> {
    if (this.currentIndex >= 0) {
      await this.history[this.currentIndex].undo();
      this.currentIndex--;
    }
  }

  async redo(): Promise<void> {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      await this.history[this.currentIndex].execute();
    }
  }
}

export {};

