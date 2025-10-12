/**
 * Decorators in TypeScript
 * Demonstrates class, method, property, and parameter decorators
 * Note: Requires "experimentalDecorators": true in tsconfig.json
 */

// Class Decorator
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class SealedClass {
  constructor(public value: string) {}
}

// Class Decorator with Factory
function component(name: string) {
  return function (constructor: Function) {
    console.log(`Registering component: ${name}`);
    constructor.prototype.componentName = name;
  };
}

@component("MyComponent")
class MyComponent {}

// Method Decorator
function log(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    console.log(`Calling ${propertyKey} with args:`, args);
    const result = originalMethod.apply(this, args);
    console.log(`Result:`, result);
    return result;
  };

  return descriptor;
}

class Calculator {
  @log
  add(a: number, b: number): number {
    return a + b;
  }
}

// Method Decorator with Parameters
function retry(maxRetries: number = 3) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      let lastError: any;

      for (let i = 0; i < maxRetries; i++) {
        try {
          return await originalMethod.apply(this, args);
        } catch (error) {
          lastError = error;
          console.log(`Retry ${i + 1}/${maxRetries}`);
        }
      }

      throw lastError;
    };

    return descriptor;
  };
}

class ApiService {
  @retry(3)
  async fetchData(url: string): Promise<any> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
}

// Property Decorator
function readonly(target: any, propertyKey: string) {
  Object.defineProperty(target, propertyKey, {
    writable: false,
    configurable: false
  });
}

function format(formatString: string) {
  return function (target: any, propertyKey: string) {
    let value: string;

    const getter = function () {
      return value;
    };

    const setter = function (newVal: string) {
      value = formatString.replace("{0}", newVal);
    };

    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true
    });
  };
}

class Person {
  @format("Hello, {0}!")
  greeting: string;

  constructor(name: string) {
    this.greeting = name;
  }
}

// Parameter Decorator
function required(
  target: Object,
  propertyKey: string | symbol,
  parameterIndex: number
) {
  const existingRequiredParameters: number[] =
    Reflect.getOwnMetadata("required", target, propertyKey) || [];
  existingRequiredParameters.push(parameterIndex);
  Reflect.defineMetadata(
    "required",
    existingRequiredParameters,
    target,
    propertyKey
  );
}

function validate(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<Function>
) {
  const method = descriptor.value!;

  descriptor.value = function (...args: any[]) {
    const requiredParameters: number[] = Reflect.getOwnMetadata(
      "required",
      target,
      propertyName
    );

    if (requiredParameters) {
      for (const parameterIndex of requiredParameters) {
        if (
          parameterIndex >= args.length ||
          args[parameterIndex] === undefined
        ) {
          throw new Error(`Missing required argument at position ${parameterIndex}`);
        }
      }
    }

    return method.apply(this, args);
  };
}

class UserService {
  @validate
  createUser(@required name: string, @required email: string, age?: number) {
    console.log(`Creating user: ${name}, ${email}, ${age}`);
  }
}

// Accessor Decorator
function configurable(value: boolean) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.configurable = value;
  };
}

class Point {
  private _x: number;
  private _y: number;

  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  @configurable(false)
  get x() {
    return this._x;
  }

  @configurable(false)
  get y() {
    return this._y;
  }
}

// Measure Performance Decorator
function measurePerformance(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    const start = performance.now();
    const result = originalMethod.apply(this, args);
    const end = performance.now();
    console.log(`${propertyKey} took ${end - start}ms`);
    return result;
  };

  return descriptor;
}

class DataProcessor {
  @measurePerformance
  processData(data: number[]): number {
    return data.reduce((sum, num) => sum + num, 0);
  }
}

// Debounce Decorator
function debounce(delay: number) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    let timeout: NodeJS.Timeout;
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        originalMethod.apply(this, args);
      }, delay);
    };

    return descriptor;
  };
}

class SearchComponent {
  @debounce(300)
  search(query: string) {
    console.log(`Searching for: ${query}`);
  }
}

// Memoize Decorator
function memoize(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  const cache = new Map<string, any>();

  descriptor.value = function (...args: any[]) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      console.log("Returning cached result");
      return cache.get(key);
    }

    const result = originalMethod.apply(this, args);
    cache.set(key, result);
    return result;
  };

  return descriptor;
}

class MathService {
  @memoize
  fibonacci(n: number): number {
    if (n <= 1) return n;
    return this.fibonacci(n - 1) + this.fibonacci(n - 2);
  }
}

// Authorization Decorator
function authorize(roles: string[]) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const userRole = "admin"; // This would come from auth context

      if (!roles.includes(userRole)) {
        throw new Error("Unauthorized");
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

class AdminService {
  @authorize(["admin"])
  deleteUser(userId: number) {
    console.log(`Deleting user: ${userId}`);
  }

  @authorize(["admin", "moderator"])
  banUser(userId: number) {
    console.log(`Banning user: ${userId}`);
  }
}

// Multiple Decorators
function first() {
  console.log("first(): factory evaluated");
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log("first(): called");
  };
}

function second() {
  console.log("second(): factory evaluated");
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log("second(): called");
  };
}

class Example {
  @first()
  @second()
  method() {
    console.log("method called");
  }
}

// Decorator Composition
function deprecated(message?: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      console.warn(
        `Warning: ${propertyKey} is deprecated. ${message || ""}`
      );
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

class LegacyService {
  @deprecated("Use newMethod() instead")
  oldMethod() {
    console.log("Old method called");
  }

  newMethod() {
    console.log("New method called");
  }
}

// Metadata Reflection (requires reflect-metadata)
// import "reflect-metadata";

function Injectable() {
  return function (target: Function) {
    Reflect.defineMetadata("injectable", true, target);
  };
}

function Route(path: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    Reflect.defineMetadata("path", path, target, propertyKey);
  };
}

@Injectable()
class Controller {
  @Route("/users")
  getUsers() {
    return ["user1", "user2"];
  }

  @Route("/users/:id")
  getUser(id: string) {
    return { id, name: "User" };
  }
}

export {};

