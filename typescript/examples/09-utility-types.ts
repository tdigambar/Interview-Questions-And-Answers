/**
 * TypeScript Utility Types
 * Comprehensive examples of built-in utility types
 */

// Sample interfaces for demonstrations
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

// ============================================================================
// 1. Partial<T> - Makes all properties optional
// ============================================================================

type PartialUser = Partial<User>;
// All properties are now optional

function updateUser(id: number, updates: Partial<User>): User {
  // Can update just the fields you want
  const existingUser: User = {
    id: 1,
    name: "Alice",
    email: "alice@example.com",
    age: 30,
    password: "hash",
    createdAt: new Date(),
    updatedAt: new Date()
  };

  return { ...existingUser, ...updates, updatedAt: new Date() };
}

// Usage
updateUser(1, { name: "Bob" }); // ✓ OK
updateUser(1, { email: "bob@example.com", age: 25 }); // ✓ OK

// ============================================================================
// 2. Required<T> - Makes all properties required
// ============================================================================

interface Config {
  host?: string;
  port?: number;
  timeout?: number;
  retries?: number;
}

type RequiredConfig = Required<Config>;
// All properties are now required: { host: string; port: number; timeout: number; retries: number; }

const config: RequiredConfig = {
  host: "localhost",
  port: 3000,
  timeout: 5000,
  retries: 3
};

// ============================================================================
// 3. Readonly<T> - Makes all properties readonly
// ============================================================================

type ReadonlyUser = Readonly<User>;

const immutableUser: ReadonlyUser = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  age: 30,
  password: "hash",
  createdAt: new Date(),
  updatedAt: new Date()
};

// immutableUser.name = "Bob"; // ✗ Error: Cannot assign to 'name' because it is a read-only property

// ============================================================================
// 4. Pick<T, K> - Creates a type with only selected properties
// ============================================================================

type UserPreview = Pick<User, "id" | "name" | "email">;
// { id: number; name: string; email: string; }

const preview: UserPreview = {
  id: 1,
  name: "Alice",
  email: "alice@example.com"
  // password, createdAt, etc. are not included
};

type ProductSummary = Pick<Product, "id" | "name" | "price">;

// ============================================================================
// 5. Omit<T, K> - Creates a type excluding selected properties
// ============================================================================

type PublicUser = Omit<User, "password">;
// All properties except password

type UserCreate = Omit<User, "id" | "createdAt" | "updatedAt">;
// For creating new users without auto-generated fields

function createUser(data: UserCreate): User {
  return {
    ...data,
    id: Date.now(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

// ============================================================================
// 6. Record<K, T> - Creates an object type with keys K and values T
// ============================================================================

type UserRole = "admin" | "user" | "guest";

const rolePermissions: Record<UserRole, string[]> = {
  admin: ["read", "write", "delete", "manage"],
  user: ["read", "write"],
  guest: ["read"]
};

type PageInfo = Record<string, { title: string; url: string; protected: boolean }>;

const pages: PageInfo = {
  home: { title: "Home", url: "/", protected: false },
  dashboard: { title: "Dashboard", url: "/dashboard", protected: true },
  profile: { title: "Profile", url: "/profile", protected: true }
};

// ============================================================================
// 7. Exclude<T, U> - Removes types from union
// ============================================================================

type Status = "pending" | "approved" | "rejected" | "cancelled";

type ActiveStatus = Exclude<Status, "cancelled" | "rejected">;
// "pending" | "approved"

type AllPrimitives = string | number | boolean | null | undefined;
type NonNullPrimitives = Exclude<AllPrimitives, null | undefined>;
// string | number | boolean

// ============================================================================
// 8. Extract<T, U> - Extracts types from union that match U
// ============================================================================

type CompletedStatus = Extract<Status, "approved" | "rejected">;
// "approved" | "rejected"

type StringOrNumber = Extract<AllPrimitives, string | number>;
// string | number

// ============================================================================
// 9. NonNullable<T> - Removes null and undefined
// ============================================================================

type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>;
// string

type MaybeUser = User | null | undefined;
type DefiniteUser = NonNullable<MaybeUser>;
// User

// ============================================================================
// 10. ReturnType<T> - Extracts return type of function
// ============================================================================

function getUserById(id: number) {
  return {
    id,
    name: "Alice",
    email: "alice@example.com",
    isActive: true
  };
}

type GetUserReturn = ReturnType<typeof getUserById>;
// { id: number; name: string; email: string; isActive: boolean; }

async function fetchData() {
  return { data: [1, 2, 3], status: 200 };
}

type FetchDataReturn = ReturnType<typeof fetchData>;
// Promise<{ data: number[]; status: number; }>

// ============================================================================
// 11. Parameters<T> - Extracts function parameter types as tuple
// ============================================================================

function createProduct(name: string, price: number, category: string, inStock: boolean) {
  return { id: 1, name, price, category, inStock };
}

type CreateProductParams = Parameters<typeof createProduct>;
// [name: string, price: number, category: string, inStock: boolean]

// Use to create wrapper functions
function logAndCreateProduct(...args: CreateProductParams) {
  console.log("Creating product with:", args);
  return createProduct(...args);
}

// ============================================================================
// 12. ConstructorParameters<T> - Extracts constructor parameter types
// ============================================================================

class DatabaseConnection {
  constructor(public host: string, public port: number, public username: string) {}
}

type DbConnectionParams = ConstructorParameters<typeof DatabaseConnection>;
// [host: string, port: number, username: string]

function createConnection(...args: DbConnectionParams) {
  return new DatabaseConnection(...args);
}

// ============================================================================
// 13. InstanceType<T> - Extracts instance type of constructor
// ============================================================================

class UserModel {
  constructor(public name: string, public email: string) {}

  save() {
    console.log("Saving user...");
  }
}

type UserInstance = InstanceType<typeof UserModel>;
// UserModel

function processUser(user: UserInstance) {
  user.save();
}

// ============================================================================
// 14. Awaited<T> - Unwraps Promise type
// ============================================================================

type AsyncUser = Promise<User>;
type SyncUser = Awaited<AsyncUser>;
// User

type NestedPromise = Promise<Promise<string>>;
type UnwrappedNested = Awaited<NestedPromise>;
// string

async function getProducts(): Promise<Product[]> {
  return [];
}

type Products = Awaited<ReturnType<typeof getProducts>>;
// Product[]

// ============================================================================
// 15. ThisParameterType<T> - Extracts 'this' parameter type
// ============================================================================

function toHex(this: Number) {
  return this.toString(16);
}

type ToHexThis = ThisParameterType<typeof toHex>;
// Number

// ============================================================================
// 16. OmitThisParameter<T> - Removes 'this' parameter from function
// ============================================================================

type ToHexWithoutThis = OmitThisParameter<typeof toHex>;
// () => string

// ============================================================================
// 17. String Manipulation Utilities
// ============================================================================

type Greeting = "hello world";

type UppercaseGreeting = Uppercase<Greeting>;
// "HELLO WORLD"

type LowercaseGreeting = Lowercase<"HELLO WORLD">;
// "hello world"

type CapitalizedGreeting = Capitalize<"hello world">;
// "Hello world"

type UncapitalizedGreeting = Uncapitalize<"Hello World">;
// "hello World"

// Practical example
type HTTPMethod = "get" | "post" | "put" | "delete";
type UpperHTTPMethod = Uppercase<HTTPMethod>;
// "GET" | "POST" | "PUT" | "DELETE"

// ============================================================================
// Real-World Combinations
// ============================================================================

// API Response Types
type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
};

type UserListResponse = ApiResponse<User[]>;
type UserDetailResponse = ApiResponse<User>;

// Form handling
type UserForm = Omit<User, "id" | "createdAt" | "updatedAt">;
type UserFormPartial = Partial<UserForm>;

// Database operations
type UserInsert = Omit<User, "id" | "createdAt" | "updatedAt">;
type UserUpdate = Partial<Omit<User, "id">> & Pick<User, "id">;
type UserRead = Readonly<User>;

// API endpoints type safety
interface ApiEndpoints {
  "/users": {
    GET: { response: User[] };
    POST: { body: UserCreate; response: User };
  };
  "/users/:id": {
    GET: { response: User };
    PUT: { body: Partial<User>; response: User };
    DELETE: { response: void };
  };
  "/products": {
    GET: { response: Product[] };
    POST: { body: Omit<Product, "id">; response: Product };
  };
}

// Article management system
interface Article {
  id: number;
  title: string;
  content: string;
  author: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  published: boolean;
}

// Different views/operations
type ArticleCreate = Omit<Article, "id" | "createdAt" | "updatedAt" | "publishedAt" | "published">;
type ArticleUpdate = Partial<Omit<Article, "id" | "createdAt">> & Pick<Article, "id">;
type ArticleListItem = Pick<Article, "id" | "title" | "author" | "tags" | "published">;
type ArticleDetail = Readonly<Article>;

// State management
type LoadingState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };

type UserState = LoadingState<User>;
type ProductListState = LoadingState<Product[]>;

// Form validation
type ValidationResult<T> = Record<keyof T, string | null>;
type UserValidation = ValidationResult<UserCreate>;

const validation: UserValidation = {
  name: null,
  email: "Invalid email format",
  age: null,
  password: "Password too short"
};

// Permissions system
type Permission = "read" | "write" | "delete" | "admin";
type ResourceType = "user" | "product" | "order" | "report";
type PermissionMatrix = Record<ResourceType, Permission[]>;

const permissions: PermissionMatrix = {
  user: ["read", "write"],
  product: ["read"],
  order: ["read", "write"],
  report: ["read"]
};

console.log("✅ All utility type examples compiled successfully!");

export {};

