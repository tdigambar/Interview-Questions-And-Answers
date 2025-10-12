# Interview Questions and Answers

This repository contains various technical interview questions, answers, and sample implementations.

## Node.js Topics

### Libuv Samples

The `node/libuv-samples/` directory contains comprehensive examples and demonstrations of how libuv works in Node.js. Libuv is the C library that provides the event loop and asynchronous I/O capabilities that make Node.js so powerful.

### What is Libuv?

Libuv is a multi-platform C library that provides support for asynchronous I/O operations. It was originally written for Node.js but is now used by other projects as well. Libuv provides:

- **Event Loop**: The core of Node.js's asynchronous behavior
- **Thread Pool**: For CPU-intensive operations
- **File System Operations**: Asynchronous file I/O
- **Network Operations**: TCP/UDP sockets, HTTP, etc.
- **Timers**: setTimeout, setInterval, setImmediate
- **Process Management**: Child processes, signals

### Getting Started

1. Navigate to the `node/libuv-samples/` directory
2. Install dependencies: `npm install`
3. Run the examples to understand libuv concepts

### Examples Available

- **Basic Event Loop**: Understanding the fundamental event loop phases
- **Async I/O Demo**: File system operations using libuv
- **Event Loop Phases**: Detailed demonstration of all event loop phases
- **Thread Pool Demo**: How libuv uses thread pools for certain operations
- **Performance Monitoring**: Tools to monitor libuv performance

### Key Concepts

- Event Loop Phases
- Microtask vs Macrotask Queues
- Thread Pool Usage
- Non-blocking I/O
- Performance Monitoring

## TypeScript Topics

### TypeScript Interview Questions

The `typescript/` directory contains comprehensive interview questions and answers covering TypeScript fundamentals to advanced concepts. This is an essential resource for developers preparing for TypeScript interviews or looking to deepen their understanding of the language.

### What You'll Learn

- **Type System**: Basic and advanced types, type inference, type guards
- **Generics**: Generic functions, classes, constraints, and utility types
- **Advanced Types**: Mapped types, conditional types, template literal types
- **Utility Types**: Partial, Required, Readonly, Pick, Omit, Record, and more
- **OOP in TypeScript**: Classes, interfaces, inheritance, access modifiers
- **Async Operations**: Promises, async/await, error handling, state management
- **Real-World Patterns**: Repository pattern, factory pattern, dependency injection
- **Best Practices**: Error handling, type-safe APIs, and production patterns

### Getting Started

1. Navigate to the `typescript/` directory
2. Read through the `README.md` for interview questions and answers
3. Install dependencies: `npm install`
4. Run examples to see concepts in action

### Examples Available

- **Basic Types**: Primitive types, arrays, tuples, enums, type inference
- **Functions**: Function types, overloads, generics, async functions
- **Interfaces & Types**: Differences, when to use each, declaration merging
- **Generics**: Generic functions, classes, constraints, real-world examples
- **Classes & OOP**: Inheritance, access modifiers, abstract classes, patterns
- **Advanced Types**: Mapped types, conditional types, utility types
- **Decorators**: Class, method, property, and parameter decorators
- **Utility Types**: All built-in TypeScript utility types with examples
- **Async Operations**: Comprehensive async/await patterns and error handling
- **Real-World Patterns**: Design patterns and best practices

### Key Concepts

- Type Safety and Type Checking
- Generic Programming
- Object-Oriented Programming
- Advanced Type Manipulation
- Design Patterns in TypeScript
- Error Handling Strategies

## Repository Structure

```
Interview-Questions-And-Answers/
├── node/
│   └── libuv-samples/          # Node.js libuv examples and demonstrations
│       ├── examples/           # Individual example files
│       ├── package.json        # Dependencies and scripts
│       ├── README.md          # Detailed documentation
│       └── index.js           # Main entry point
├── typescript/                 # TypeScript interview questions and examples
│   ├── examples/              # Practical TypeScript code examples
│   │   ├── 01-basic-types.ts
│   │   ├── 02-functions.ts
│   │   ├── 03-interfaces-types.ts
│   │   ├── 04-generics.ts
│   │   ├── 05-classes-oop.ts
│   │   ├── 06-advanced-types.ts
│   │   ├── 07-decorators.ts
│   │   ├── 08-real-world-patterns.ts
│   │   ├── 09-utility-types.ts
│   │   └── 10-async-operations.ts
│   ├── package.json           # Dependencies and scripts
│   ├── tsconfig.json          # TypeScript configuration
│   └── README.md             # Comprehensive Q&A guide (32 questions)
└── README.md                  # This file
```

## Other Topics

This repository will be expanded with more interview questions and technical examples covering various programming concepts, algorithms, and system design topics.
