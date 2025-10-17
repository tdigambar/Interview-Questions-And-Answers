# Microservices Interview Questions and Answers

A comprehensive collection of Microservices interview questions covering basic to advanced concepts for distributed system architecture and design.

## Table of Contents

- [Basic Level](#basic-level)
- [Intermediate Level](#intermediate-level)
- [Advanced Level](#advanced-level)

---

## Basic Level

### 1. What are Microservices?

Microservices is an architectural style where an application is built as a collection of small, independent services that communicate over well-defined APIs. Each service is:

**Characteristics:**
- **Independent**: Can be developed, deployed, and scaled independently
- **Business-focused**: Organized around business capabilities
- **Decentralized**: Own their own data and logic
- **Polyglot**: Can use different technologies and languages
- **Resilient**: Failure in one service doesn't bring down the entire system

**Example Architecture:**
```
┌─────────────────────────────────────────────┐
│           API Gateway / Load Balancer        │
└─────────────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
┌───────▼──────┐ ┌───▼──────┐ ┌───▼──────┐
│   User       │ │  Product  │ │  Order   │
│   Service    │ │  Service  │ │  Service │
└──────┬───────┘ └────┬──────┘ └────┬─────┘
       │              │              │
┌──────▼───────┐ ┌───▼──────┐ ┌────▼─────┐
│   User DB    │ │Product DB│ │ Order DB │
└──────────────┘ └──────────┘ └──────────┘
```

### 2. What is the difference between Monolithic and Microservices architecture?

| Monolithic | Microservices |
|------------|---------------|
| Single deployable unit | Multiple independent services |
| Shared database | Database per service |
| Single technology stack | Polyglot architecture |
| Tight coupling | Loose coupling |
| Scale entire application | Scale individual services |
| Simple deployment | Complex deployment |
| Single point of failure | Distributed failure handling |
| Easier to develop initially | Complex initial setup |

**Monolithic Example:**
```javascript
// Single application with all modules
const express = require('express');
const app = express();

// All routes in one application
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.listen(3000);
```

**Microservices Example:**
```javascript
// User Service (Port 3001)
const express = require('express');
const app = express();
app.use('/users', userRoutes);
app.listen(3001);

// Product Service (Port 3002)
const express = require('express');
const app = express();
app.use('/products', productRoutes);
app.listen(3002);

// Order Service (Port 3003)
const express = require('express');
const app = express();
app.use('/orders', orderRoutes);
app.listen(3003);
```

### 3. What are the advantages of Microservices?

**Advantages:**

**1. Independent Deployment:**
- Deploy services without affecting others
- Faster release cycles
- Reduced deployment risks

**2. Technology Diversity:**
- Use best technology for each service
- Easy to adopt new technologies
- Team autonomy in technology choices

**3. Scalability:**
- Scale only the services that need it
- Cost-effective scaling
- Better resource utilization

**4. Fault Isolation:**
- Failure in one service doesn't crash entire system
- Better resilience
- Easier to implement fallback strategies

**5. Team Organization:**
- Small, focused teams
- Clear ownership
- Faster development

### 4. What are the challenges of Microservices?

**Challenges:**

**1. Complexity:**
```javascript
// Distributed transaction complexity
async function createOrder(orderData) {
  try {
    // Call multiple services
    const user = await userService.validateUser(orderData.userId);
    const product = await productService.checkInventory(orderData.productId);
    const payment = await paymentService.processPayment(orderData.payment);
    const order = await orderService.createOrder(orderData);
    
    return order;
  } catch (error) {
    // Complex error handling and rollback
    await handleDistributedRollback(error);
    throw error;
  }
}
```

**2. Data Management:**
- No shared database
- Data consistency challenges
- Complex queries across services

**3. Network Latency:**
- Inter-service communication overhead
- Performance considerations
- Timeout and retry logic needed

**4. Testing:**
- Integration testing is complex
- End-to-end testing requires all services
- Mock services for unit testing

**5. Operational Overhead:**
- More services to monitor
- Complex deployment pipelines
- Need for service discovery and orchestration

### 5. What is Service Discovery?

Service Discovery is the mechanism that allows services to find and communicate with each other without hardcoding network locations.

**Types:**

**1. Client-Side Discovery:**
```javascript
// Client-side discovery with Consul
const Consul = require('consul');
const consul = new Consul();

async function getServiceUrl(serviceName) {
  const services = await consul.catalog.service.nodes(serviceName);
  const service = services[0]; // Simple selection
  return `http://${service.ServiceAddress}:${service.ServicePort}`;
}

// Use the service
const productServiceUrl = await getServiceUrl('product-service');
const response = await axios.get(`${productServiceUrl}/products`);
```

**2. Server-Side Discovery:**
```javascript
// Server-side discovery with load balancer
// Services register with load balancer
// Clients call load balancer
const response = await axios.get('http://load-balancer/product-service/products');
```

**Popular Tools:**
- **Consul**: Distributed service mesh
- **Eureka**: Netflix service registry
- **etcd**: Distributed key-value store
- **Kubernetes**: Built-in service discovery

### 6. What is an API Gateway?

An API Gateway is a single entry point for all client requests. It routes requests to appropriate microservices and handles cross-cutting concerns.

**Responsibilities:**
- **Routing**: Forward requests to appropriate services
- **Authentication**: Verify user credentials
- **Rate Limiting**: Prevent abuse
- **Load Balancing**: Distribute traffic
- **Response Transformation**: Aggregate responses
- **Monitoring**: Collect metrics and logs

**Example with Express:**
```javascript
// API Gateway implementation
const express = require('express');
const axios = require('axios');
const app = express();

// Authentication middleware
app.use(async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // Verify token
  next();
});

// Route to User Service
app.use('/api/users', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `http://user-service:3001${req.path}`,
      data: req.body,
      headers: req.headers
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Route to Product Service
app.use('/api/products', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `http://product-service:3002${req.path}`,
      data: req.body,
      headers: req.headers
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('API Gateway running on port 3000');
});
```

### 7. What is Inter-Service Communication?

Inter-Service Communication is how microservices communicate with each other. There are two main patterns:

**1. Synchronous Communication (HTTP/REST):**
```javascript
// User Service calling Order Service
const axios = require('axios');

async function getUserOrders(userId) {
  try {
    const response = await axios.get(
      `http://order-service:3003/orders/user/${userId}`,
      { timeout: 5000 }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch orders:', error.message);
    return []; // Fallback
  }
}
```

**2. Asynchronous Communication (Message Queue):**
```javascript
// User Service publishing event
const amqp = require('amqplib');

async function publishUserCreatedEvent(user) {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  
  const exchange = 'user-events';
  await channel.assertExchange(exchange, 'fanout', { durable: true });
  
  channel.publish(
    exchange,
    '',
    Buffer.from(JSON.stringify({
      event: 'user.created',
      data: user
    }))
  );
  
  console.log('User created event published');
}

// Email Service subscribing to event
async function subscribeToUserEvents() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  
  const exchange = 'user-events';
  await channel.assertExchange(exchange, 'fanout', { durable: true });
  
  const queue = await channel.assertQueue('', { exclusive: true });
  await channel.bindQueue(queue.queue, exchange, '');
  
  channel.consume(queue.queue, (msg) => {
    const event = JSON.parse(msg.content.toString());
    if (event.event === 'user.created') {
      sendWelcomeEmail(event.data);
    }
    channel.ack(msg);
  });
}
```

### 8. What is Database per Service pattern?

Database per Service means each microservice has its own database, ensuring loose coupling and independent scalability.

**Benefits:**
- **Loose coupling**: Services don't depend on others' data
- **Technology choice**: Each service can use different database
- **Independent scaling**: Scale databases independently
- **Clear ownership**: Each team owns their data

**Challenges:**
- **Data duplication**: Same data may exist in multiple services
- **Distributed transactions**: Complex to maintain consistency
- **Cross-service queries**: Need API calls or event sourcing

**Example:**
```javascript
// User Service - PostgreSQL
const { Pool } = require('pg');
const userDb = new Pool({
  host: 'user-db',
  database: 'users',
  user: 'user_service',
  password: 'password'
});

// Product Service - MongoDB
const mongoose = require('mongoose');
mongoose.connect('mongodb://product-db:27017/products');

// Order Service - MySQL
const mysql = require('mysql2/promise');
const orderDb = await mysql.createConnection({
  host: 'order-db',
  database: 'orders',
  user: 'order_service',
  password: 'password'
});
```

### 9. What is a Circuit Breaker pattern?

Circuit Breaker prevents cascading failures by stopping requests to a failing service and providing fallback responses.

**States:**
- **Closed**: Normal operation, requests pass through
- **Open**: Service is failing, requests fail immediately
- **Half-Open**: Testing if service recovered

**Example with opossum:**
```javascript
const CircuitBreaker = require('opossum');
const axios = require('axios');

// Function to call external service
async function callProductService(productId) {
  const response = await axios.get(
    `http://product-service:3002/products/${productId}`
  );
  return response.data;
}

// Create circuit breaker
const breaker = new CircuitBreaker(callProductService, {
  timeout: 3000, // 3 seconds
  errorThresholdPercentage: 50, // Open after 50% failures
  resetTimeout: 30000 // Try again after 30 seconds
});

// Fallback function
breaker.fallback(() => {
  return {
    id: null,
    name: 'Product Unavailable',
    price: 0
  };
});

// Events
breaker.on('open', () => console.log('Circuit breaker opened'));
breaker.on('halfOpen', () => console.log('Circuit breaker half-open'));
breaker.on('close', () => console.log('Circuit breaker closed'));

// Use the circuit breaker
async function getProduct(productId) {
  try {
    return await breaker.fire(productId);
  } catch (error) {
    console.error('Circuit breaker error:', error.message);
    throw error;
  }
}
```

### 10. What is Container Orchestration?

Container Orchestration automates deployment, scaling, and management of containerized applications.

**Popular Tools:**
- **Kubernetes**: Most popular orchestration platform
- **Docker Swarm**: Docker's native orchestration
- **Amazon ECS**: AWS container service
- **Apache Mesos**: Distributed systems kernel

**Kubernetes Example:**
```yaml
# user-service-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
      - name: user-service
        image: user-service:1.0
        ports:
        - containerPort: 3001
        env:
        - name: DB_HOST
          value: user-db
        resources:
          limits:
            memory: "256Mi"
            cpu: "500m"

---
apiVersion: v1
kind: Service
metadata:
  name: user-service
spec:
  selector:
    app: user-service
  ports:
  - port: 3001
    targetPort: 3001
  type: ClusterIP
```

---

## Intermediate Level

### 11. What is the Saga pattern?

The Saga pattern manages distributed transactions by breaking them into a sequence of local transactions, each with a compensating transaction for rollback.

**Types:**

**1. Choreography-based Saga:**
```javascript
// Order Service - Initiates saga
async function createOrder(orderData) {
  // Step 1: Create order
  const order = await OrderModel.create({
    ...orderData,
    status: 'PENDING'
  });
  
  // Publish event
  await publishEvent('order.created', order);
  
  return order;
}

// Inventory Service - Listens and responds
async function handleOrderCreated(order) {
  try {
    // Step 2: Reserve inventory
    await reserveInventory(order.productId, order.quantity);
    await publishEvent('inventory.reserved', { orderId: order.id });
  } catch (error) {
    // Compensation: Publish failure event
    await publishEvent('inventory.reservation.failed', { orderId: order.id });
  }
}

// Payment Service - Listens and responds
async function handleInventoryReserved(data) {
  try {
    // Step 3: Process payment
    await processPayment(data.orderId);
    await publishEvent('payment.processed', { orderId: data.orderId });
  } catch (error) {
    // Compensation: Release inventory
    await publishEvent('payment.failed', { orderId: data.orderId });
  }
}

// Order Service - Handles completion or failure
async function handlePaymentProcessed(data) {
  await OrderModel.update(
    { id: data.orderId },
    { status: 'COMPLETED' }
  );
}

async function handlePaymentFailed(data) {
  // Compensation: Cancel order
  await OrderModel.update(
    { id: data.orderId },
    { status: 'CANCELLED' }
  );
  await publishEvent('order.cancelled', { orderId: data.orderId });
}
```

**2. Orchestration-based Saga:**
```javascript
// Saga Orchestrator
class OrderSaga {
  constructor(orderId) {
    this.orderId = orderId;
    this.steps = [];
  }
  
  async execute() {
    try {
      // Step 1: Create order
      const order = await this.createOrder();
      this.steps.push('order.created');
      
      // Step 2: Reserve inventory
      await this.reserveInventory(order);
      this.steps.push('inventory.reserved');
      
      // Step 3: Process payment
      await this.processPayment(order);
      this.steps.push('payment.processed');
      
      // Step 4: Complete order
      await this.completeOrder(order);
      
      return { success: true, orderId: this.orderId };
    } catch (error) {
      // Compensate in reverse order
      await this.compensate();
      throw error;
    }
  }
  
  async compensate() {
    console.log('Starting compensation...');
    
    // Reverse the steps
    for (let i = this.steps.length - 1; i >= 0; i--) {
      const step = this.steps[i];
      
      switch (step) {
        case 'payment.processed':
          await this.refundPayment();
          break;
        case 'inventory.reserved':
          await this.releaseInventory();
          break;
        case 'order.created':
          await this.cancelOrder();
          break;
      }
    }
  }
  
  async createOrder() {
    return await orderService.create(this.orderId);
  }
  
  async reserveInventory(order) {
    return await inventoryService.reserve(order.productId, order.quantity);
  }
  
  async processPayment(order) {
    return await paymentService.process(order.id, order.amount);
  }
  
  async completeOrder(order) {
    return await orderService.complete(order.id);
  }
  
  async refundPayment() {
    return await paymentService.refund(this.orderId);
  }
  
  async releaseInventory() {
    return await inventoryService.release(this.orderId);
  }
  
  async cancelOrder() {
    return await orderService.cancel(this.orderId);
  }
}

// Usage
async function createOrderWithSaga(orderData) {
  const saga = new OrderSaga(orderData);
  return await saga.execute();
}
```

### 12. What is Event Sourcing?

Event Sourcing stores the state of an entity as a sequence of events rather than just the current state.

**Benefits:**
- **Complete audit log**: Every change is recorded
- **Time travel**: Reconstruct state at any point in time
- **Event replay**: Rebuild state from events
- **Multiple views**: Create different projections from same events

**Example:**
```javascript
// Event Store
class EventStore {
  constructor() {
    this.events = [];
  }
  
  async saveEvent(event) {
    event.timestamp = new Date();
    event.version = this.events.length + 1;
    this.events.push(event);
    await this.persistEvent(event);
  }
  
  async getEvents(aggregateId) {
    return this.events.filter(e => e.aggregateId === aggregateId);
  }
  
  async persistEvent(event) {
    // Save to database
    await EventModel.create(event);
  }
}

// Account Aggregate
class Account {
  constructor(id) {
    this.id = id;
    this.balance = 0;
    this.version = 0;
  }
  
  // Command: Create account
  create(initialBalance) {
    const event = {
      type: 'AccountCreated',
      aggregateId: this.id,
      data: { initialBalance }
    };
    this.apply(event);
    return event;
  }
  
  // Command: Deposit money
  deposit(amount) {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }
    
    const event = {
      type: 'MoneyDeposited',
      aggregateId: this.id,
      data: { amount }
    };
    this.apply(event);
    return event;
  }
  
  // Command: Withdraw money
  withdraw(amount) {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }
    
    if (this.balance < amount) {
      throw new Error('Insufficient funds');
    }
    
    const event = {
      type: 'MoneyWithdrawn',
      aggregateId: this.id,
      data: { amount }
    };
    this.apply(event);
    return event;
  }
  
  // Apply event to update state
  apply(event) {
    switch (event.type) {
      case 'AccountCreated':
        this.balance = event.data.initialBalance;
        break;
      case 'MoneyDeposited':
        this.balance += event.data.amount;
        break;
      case 'MoneyWithdrawn':
        this.balance -= event.data.amount;
        break;
    }
    this.version++;
  }
  
  // Reconstruct state from events
  static async loadFromHistory(id, eventStore) {
    const account = new Account(id);
    const events = await eventStore.getEvents(id);
    
    events.forEach(event => account.apply(event));
    
    return account;
  }
}

// Usage
const eventStore = new EventStore();
const account = new Account('acc-123');

// Execute commands
const event1 = account.create(1000);
await eventStore.saveEvent(event1);

const event2 = account.deposit(500);
await eventStore.saveEvent(event2);

const event3 = account.withdraw(200);
await eventStore.saveEvent(event3);

console.log('Current balance:', account.balance); // 1300

// Reconstruct from history
const reconstructed = await Account.loadFromHistory('acc-123', eventStore);
console.log('Reconstructed balance:', reconstructed.balance); // 1300
```

### 13. What is CQRS (Command Query Responsibility Segregation)?

CQRS separates read operations (queries) from write operations (commands) to optimize performance and scalability.

**Benefits:**
- **Performance**: Optimize read and write models separately
- **Scalability**: Scale read and write sides independently
- **Flexibility**: Use different databases for reads and writes
- **Simplicity**: Simpler models for specific use cases

**Example:**
```javascript
// Command Side (Write Model)
class CreateUserCommand {
  constructor(userData) {
    this.userData = userData;
  }
}

class UserCommandHandler {
  async handle(command) {
    if (command instanceof CreateUserCommand) {
      return await this.handleCreateUser(command);
    }
  }
  
  async handleCreateUser(command) {
    // Validate
    if (!command.userData.email) {
      throw new Error('Email is required');
    }
    
    // Create user in write database
    const user = await UserWriteModel.create({
      id: generateId(),
      ...command.userData,
      createdAt: new Date()
    });
    
    // Publish event for read model
    await publishEvent('user.created', user);
    
    return user;
  }
}

// Query Side (Read Model)
class GetUserQuery {
  constructor(userId) {
    this.userId = userId;
  }
}

class GetUsersQuery {
  constructor(filters) {
    this.filters = filters;
  }
}

class UserQueryHandler {
  async handle(query) {
    if (query instanceof GetUserQuery) {
      return await this.handleGetUser(query);
    } else if (query instanceof GetUsersQuery) {
      return await this.handleGetUsers(query);
    }
  }
  
  async handleGetUser(query) {
    // Read from optimized read database
    return await UserReadModel.findById(query.userId);
  }
  
  async handleGetUsers(query) {
    // Read from optimized read database with filters
    return await UserReadModel.find(query.filters);
  }
}

// Event Handler (Updates Read Model)
class UserEventHandler {
  async handleUserCreated(event) {
    // Update read model
    await UserReadModel.create({
      id: event.data.id,
      name: event.data.name,
      email: event.data.email,
      // Denormalized data for faster reads
      orderCount: 0,
      totalSpent: 0,
      lastOrderDate: null
    });
  }
  
  async handleOrderCreated(event) {
    // Update denormalized data
    await UserReadModel.update(
      { id: event.data.userId },
      {
        $inc: { orderCount: 1, totalSpent: event.data.amount },
        $set: { lastOrderDate: new Date() }
      }
    );
  }
}

// API Layer
const commandHandler = new UserCommandHandler();
const queryHandler = new UserQueryHandler();

app.post('/users', async (req, res) => {
  const command = new CreateUserCommand(req.body);
  const user = await commandHandler.handle(command);
  res.json(user);
});

app.get('/users/:id', async (req, res) => {
  const query = new GetUserQuery(req.params.id);
  const user = await queryHandler.handle(query);
  res.json(user);
});

app.get('/users', async (req, res) => {
  const query = new GetUsersQuery(req.query);
  const users = await queryHandler.handle(query);
  res.json(users);
});
```

### 14. What is Service Mesh?

Service Mesh is a dedicated infrastructure layer that handles service-to-service communication, providing features like load balancing, service discovery, and security.

**Popular Service Meshes:**
- **Istio**: Full-featured service mesh
- **Linkerd**: Lightweight service mesh
- **Consul Connect**: HashiCorp's service mesh
- **AWS App Mesh**: AWS managed service mesh

**Features:**
- **Traffic management**: Load balancing, routing, retries
- **Security**: mTLS, authentication, authorization
- **Observability**: Metrics, logs, distributed tracing
- **Resilience**: Circuit breakers, timeouts, retries

**Istio Example:**
```yaml
# Virtual Service for routing
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: product-service
spec:
  hosts:
  - product-service
  http:
  - match:
    - headers:
        version:
          exact: "v2"
    route:
    - destination:
        host: product-service
        subset: v2
  - route:
    - destination:
        host: product-service
        subset: v1

---
# Destination Rule for load balancing
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: product-service
spec:
  host: product-service
  trafficPolicy:
    loadBalancer:
      simple: ROUND_ROBIN
    connectionPool:
      tcp:
        maxConnections: 100
      http:
        http1MaxPendingRequests: 50
        http2MaxRequests: 100
    outlierDetection:
      consecutiveErrors: 5
      interval: 30s
      baseEjectionTime: 30s
  subsets:
  - name: v1
    labels:
      version: v1
  - name: v2
    labels:
      version: v2

---
# Retry policy
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: order-service
spec:
  hosts:
  - order-service
  http:
  - route:
    - destination:
        host: order-service
    retries:
      attempts: 3
      perTryTimeout: 2s
      retryOn: 5xx,retriable-4xx,gateway-error
```

### 15. What is Distributed Tracing?

Distributed Tracing tracks requests across multiple microservices to understand system behavior and diagnose issues.

**Popular Tools:**
- **Jaeger**: Open-source distributed tracing
- **Zipkin**: Distributed tracing system
- **AWS X-Ray**: AWS distributed tracing
- **OpenTelemetry**: Unified observability framework

**Example with Jaeger:**
```javascript
const { initTracer } = require('jaeger-client');

// Initialize tracer
const config = {
  serviceName: 'user-service',
  sampler: {
    type: 'const',
    param: 1,
  },
  reporter: {
    logSpans: true,
    agentHost: 'jaeger-agent',
    agentPort: 6832,
  },
};

const tracer = initTracer(config);

// Express middleware for tracing
function tracingMiddleware(req, res, next) {
  const span = tracer.startSpan(`${req.method} ${req.path}`);
  
  span.setTag('http.method', req.method);
  span.setTag('http.url', req.url);
  
  req.span = span;
  
  res.on('finish', () => {
    span.setTag('http.status_code', res.statusCode);
    span.finish();
  });
  
  next();
}

app.use(tracingMiddleware);

// Trace function calls
async function getUserOrders(userId, parentSpan) {
  const span = tracer.startSpan('getUserOrders', {
    childOf: parentSpan
  });
  
  span.setTag('user.id', userId);
  
  try {
    // Call order service with trace context
    const response = await axios.get(
      `http://order-service:3003/orders/user/${userId}`,
      {
        headers: {
          'uber-trace-id': span.context().toString()
        }
      }
    );
    
    span.log({ event: 'orders_fetched', count: response.data.length });
    
    return response.data;
  } catch (error) {
    span.setTag('error', true);
    span.log({ event: 'error', message: error.message });
    throw error;
  } finally {
    span.finish();
  }
}

// Route handler
app.get('/users/:id/orders', async (req, res) => {
  try {
    const orders = await getUserOrders(req.params.id, req.span);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 16. What is API Versioning in Microservices?

API Versioning allows you to evolve APIs without breaking existing clients.

**Strategies:**

**1. URI Versioning:**
```javascript
// Version 1
app.get('/api/v1/users', async (req, res) => {
  const users = await User.find();
  res.json(users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email
  })));
});

// Version 2 - Added phone field
app.get('/api/v2/users', async (req, res) => {
  const users = await User.find();
  res.json(users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone
  })));
});
```

**2. Header Versioning:**
```javascript
app.get('/api/users', async (req, res) => {
  const version = req.headers['api-version'] || '1';
  
  const users = await User.find();
  
  if (version === '1') {
    res.json(users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email
    })));
  } else if (version === '2') {
    res.json(users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone
    })));
  }
});
```

**3. Content Negotiation:**
```javascript
app.get('/api/users', async (req, res) => {
  const acceptHeader = req.headers['accept'];
  
  const users = await User.find();
  
  if (acceptHeader.includes('application/vnd.api.v1+json')) {
    res.json(users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email
    })));
  } else if (acceptHeader.includes('application/vnd.api.v2+json')) {
    res.json(users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone
    })));
  }
});
```

### 17. What is Health Check in Microservices?

Health Checks allow monitoring systems to determine if a service is healthy and ready to handle requests.

**Types:**

**1. Liveness Probe:**
```javascript
// Checks if service is alive
app.get('/health/live', (req, res) => {
  res.status(200).json({ status: 'UP' });
});
```

**2. Readiness Probe:**
```javascript
// Checks if service is ready to handle requests
app.get('/health/ready', async (req, res) => {
  try {
    // Check database connection
    await db.ping();
    
    // Check message queue connection
    await messageQueue.ping();
    
    // Check external dependencies
    await axios.get('http://external-service/health');
    
    res.status(200).json({
      status: 'UP',
      checks: {
        database: 'UP',
        messageQueue: 'UP',
        externalService: 'UP'
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'DOWN',
      error: error.message
    });
  }
});
```

**Kubernetes Health Check:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
spec:
  template:
    spec:
      containers:
      - name: user-service
        image: user-service:1.0
        livenessProbe:
          httpGet:
            path: /health/live
            port: 3001
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 3001
          initialDelaySeconds: 10
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
```

### 18. What is the Strangler Fig pattern?

The Strangler Fig pattern gradually migrates a monolithic application to microservices by incrementally replacing functionality.

**Steps:**
1. Identify a feature to extract
2. Create new microservice
3. Route traffic to new service
4. Remove old code from monolith
5. Repeat

**Example:**
```javascript
// API Gateway routing
const express = require('express');
const httpProxy = require('http-proxy-middleware');
const app = express();

// Feature flags for gradual migration
const featureFlags = {
  useNewUserService: true,
  useNewProductService: false
};

// Route to new User Service
if (featureFlags.useNewUserService) {
  app.use('/api/users', httpProxy.createProxyMiddleware({
    target: 'http://user-service:3001',
    changeOrigin: true
  }));
} else {
  // Route to monolith
  app.use('/api/users', httpProxy.createProxyMiddleware({
    target: 'http://monolith:8080',
    changeOrigin: true
  }));
}

// Route to Product Service (still in monolith)
if (featureFlags.useNewProductService) {
  app.use('/api/products', httpProxy.createProxyMiddleware({
    target: 'http://product-service:3002',
    changeOrigin: true
  }));
} else {
  app.use('/api/products', httpProxy.createProxyMiddleware({
    target: 'http://monolith:8080',
    changeOrigin: true
  }));
}

// All other routes go to monolith
app.use('*', httpProxy.createProxyMiddleware({
  target: 'http://monolith:8080',
  changeOrigin: true
}));

app.listen(3000);
```

### 19. What is the Backend for Frontend (BFF) pattern?

BFF creates separate backend services for different frontend applications (web, mobile, desktop).

**Benefits:**
- **Optimized APIs**: Each frontend gets exactly what it needs
- **Independent evolution**: Frontends can evolve independently
- **Reduced coupling**: No shared backend logic
- **Better performance**: Fewer round trips

**Example:**
```javascript
// Web BFF
const express = require('express');
const app = express();

app.get('/api/dashboard', async (req, res) => {
  try {
    // Aggregate data for web dashboard
    const [user, orders, analytics] = await Promise.all([
      userService.getUser(req.user.id),
      orderService.getUserOrders(req.user.id),
      analyticsService.getUserAnalytics(req.user.id)
    ]);
    
    res.json({
      user: {
        name: user.name,
        email: user.email,
        avatar: user.avatar
      },
      orders: orders.map(o => ({
        id: o.id,
        date: o.date,
        total: o.total,
        status: o.status,
        items: o.items
      })),
      analytics: {
        totalSpent: analytics.totalSpent,
        orderCount: analytics.orderCount,
        averageOrderValue: analytics.averageOrderValue
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mobile BFF
const mobileApp = express();

mobileApp.get('/api/dashboard', async (req, res) => {
  try {
    // Optimized for mobile - less data
    const [user, recentOrders] = await Promise.all([
      userService.getUser(req.user.id),
      orderService.getRecentOrders(req.user.id, 5)
    ]);
    
    res.json({
      user: {
        name: user.name,
        avatar: user.avatar
      },
      recentOrders: recentOrders.map(o => ({
        id: o.id,
        date: o.date,
        total: o.total,
        status: o.status
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 20. What is the Bulkhead pattern?

The Bulkhead pattern isolates resources to prevent cascading failures, similar to watertight compartments in a ship.

**Example:**
```javascript
const pLimit = require('p-limit');

// Create separate resource pools for different services
const userServiceLimit = pLimit(10);  // Max 10 concurrent calls
const orderServiceLimit = pLimit(20); // Max 20 concurrent calls
const paymentServiceLimit = pLimit(5); // Max 5 concurrent calls

// User service calls
async function getUserData(userId) {
  return userServiceLimit(() => {
    return axios.get(`http://user-service:3001/users/${userId}`);
  });
}

// Order service calls
async function getOrderData(orderId) {
  return orderServiceLimit(() => {
    return axios.get(`http://order-service:3003/orders/${orderId}`);
  });
}

// Payment service calls
async function processPayment(paymentData) {
  return paymentServiceLimit(() => {
    return axios.post('http://payment-service:3004/payments', paymentData);
  });
}

// If payment service is slow/failing, it won't affect user or order services
app.get('/dashboard', async (req, res) => {
  try {
    const [user, orders] = await Promise.all([
      getUserData(req.user.id),
      getOrderData(req.user.id)
    ]);
    
    // Even if payment service is down, we can still show dashboard
    let payments = null;
    try {
      payments = await getPaymentHistory(req.user.id);
    } catch (error) {
      console.error('Payment service unavailable:', error.message);
    }
    
    res.json({
      user: user.data,
      orders: orders.data,
      payments: payments?.data || []
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## Advanced Level

### 21. What is Domain-Driven Design (DDD) in Microservices?

Domain-Driven Design is an approach to software development that focuses on modeling the business domain and organizing code around business concepts.

**Key Concepts:**

**1. Bounded Context:**
```javascript
// User Context
// user-service/domain/user.js
class User {
  constructor(id, name, email, password) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
  }
  
  changeEmail(newEmail) {
    // Business logic for changing email
    if (!this.isValidEmail(newEmail)) {
      throw new Error('Invalid email');
    }
    this.email = newEmail;
    return new UserEmailChanged(this.id, newEmail);
  }
  
  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

// Order Context
// order-service/domain/order.js
class Order {
  constructor(id, customerId, items) {
    this.id = id;
    this.customerId = customerId; // Reference to user in different context
    this.items = items;
    this.status = 'PENDING';
  }
  
  addItem(item) {
    this.items.push(item);
    return new ItemAddedToOrder(this.id, item);
  }
  
  calculateTotal() {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
  
  confirm() {
    if (this.items.length === 0) {
      throw new Error('Cannot confirm empty order');
    }
    this.status = 'CONFIRMED';
    return new OrderConfirmed(this.id);
  }
}
```

**2. Aggregates:**
```javascript
// Order Aggregate Root
class Order {
  constructor(id, customerId) {
    this.id = id;
    this.customerId = customerId;
    this.items = [];
    this.payment = null;
    this.shipping = null;
    this.status = 'DRAFT';
  }
  
  // Aggregate ensures consistency
  addItem(productId, quantity, price) {
    const item = new OrderItem(productId, quantity, price);
    this.items.push(item);
    return new ItemAdded(this.id, item);
  }
  
  removeItem(productId) {
    const index = this.items.findIndex(i => i.productId === productId);
    if (index === -1) {
      throw new Error('Item not found');
    }
    this.items.splice(index, 1);
    return new ItemRemoved(this.id, productId);
  }
  
  setPayment(paymentMethod, amount) {
    const total = this.calculateTotal();
    if (amount !== total) {
      throw new Error('Payment amount does not match order total');
    }
    this.payment = new Payment(paymentMethod, amount);
    return new PaymentSet(this.id, this.payment);
  }
  
  setShipping(address) {
    this.shipping = new Shipping(address);
    return new ShippingSet(this.id, this.shipping);
  }
  
  confirm() {
    if (this.items.length === 0) {
      throw new Error('Cannot confirm empty order');
    }
    if (!this.payment) {
      throw new Error('Payment not set');
    }
    if (!this.shipping) {
      throw new Error('Shipping not set');
    }
    
    this.status = 'CONFIRMED';
    return new OrderConfirmed(this.id);
  }
  
  calculateTotal() {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}

// Value Objects (no identity, compared by value)
class OrderItem {
  constructor(productId, quantity, price) {
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }
    if (price < 0) {
      throw new Error('Price cannot be negative');
    }
    
    this.productId = productId;
    this.quantity = quantity;
    this.price = price;
  }
  
  equals(other) {
    return this.productId === other.productId &&
           this.quantity === other.quantity &&
           this.price === other.price;
  }
}

class Payment {
  constructor(method, amount) {
    this.method = method;
    this.amount = amount;
  }
}

class Shipping {
  constructor(address) {
    this.address = address;
  }
}
```

**3. Domain Events:**
```javascript
// Domain Events
class DomainEvent {
  constructor(aggregateId) {
    this.aggregateId = aggregateId;
    this.occurredAt = new Date();
  }
}

class OrderConfirmed extends DomainEvent {
  constructor(orderId) {
    super(orderId);
    this.eventType = 'OrderConfirmed';
  }
}

class ItemAdded extends DomainEvent {
  constructor(orderId, item) {
    super(orderId);
    this.eventType = 'ItemAdded';
    this.item = item;
  }
}

// Domain Event Handler
class OrderEventHandler {
  async handleOrderConfirmed(event) {
    // Update inventory
    await inventoryService.reserveItems(event.aggregateId);
    
    // Send notification
    await notificationService.sendOrderConfirmation(event.aggregateId);
    
    // Update analytics
    await analyticsService.recordOrderConfirmed(event.aggregateId);
  }
}
```

**4. Repositories:**
```javascript
// Repository Interface
class OrderRepository {
  async save(order) {
    throw new Error('Not implemented');
  }
  
  async findById(id) {
    throw new Error('Not implemented');
  }
  
  async findByCustomerId(customerId) {
    throw new Error('Not implemented');
  }
}

// Repository Implementation
class MongoOrderRepository extends OrderRepository {
  constructor(db) {
    super();
    this.collection = db.collection('orders');
  }
  
  async save(order) {
    await this.collection.updateOne(
      { _id: order.id },
      { $set: this.toDocument(order) },
      { upsert: true }
    );
  }
  
  async findById(id) {
    const doc = await this.collection.findOne({ _id: id });
    return doc ? this.toDomain(doc) : null;
  }
  
  async findByCustomerId(customerId) {
    const docs = await this.collection.find({ customerId }).toArray();
    return docs.map(doc => this.toDomain(doc));
  }
  
  toDocument(order) {
    return {
      _id: order.id,
      customerId: order.customerId,
      items: order.items,
      payment: order.payment,
      shipping: order.shipping,
      status: order.status
    };
  }
  
  toDomain(doc) {
    const order = new Order(doc._id, doc.customerId);
    order.items = doc.items;
    order.payment = doc.payment;
    order.shipping = doc.shipping;
    order.status = doc.status;
    return order;
  }
}
```

### 22. What is the Sidecar pattern?

The Sidecar pattern deploys additional functionality alongside the main service in a separate container.

**Use Cases:**
- **Logging**: Collect and forward logs
- **Monitoring**: Collect metrics
- **Configuration**: Manage configuration
- **Service mesh**: Handle network communication

**Kubernetes Sidecar Example:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
spec:
  template:
    spec:
      containers:
      # Main application container
      - name: user-service
        image: user-service:1.0
        ports:
        - containerPort: 3001
        volumeMounts:
        - name: logs
          mountPath: /var/log/app
      
      # Sidecar container for log forwarding
      - name: log-forwarder
        image: fluentd:latest
        volumeMounts:
        - name: logs
          mountPath: /var/log/app
        env:
        - name: FLUENT_ELASTICSEARCH_HOST
          value: "elasticsearch"
        - name: FLUENT_ELASTICSEARCH_PORT
          value: "9200"
      
      # Sidecar container for metrics
      - name: metrics-exporter
        image: prom/node-exporter:latest
        ports:
        - containerPort: 9100
      
      volumes:
      - name: logs
        emptyDir: {}
```

**Envoy Sidecar Proxy:**
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: envoy-config
data:
  envoy.yaml: |
    static_resources:
      listeners:
      - name: listener_0
        address:
          socket_address:
            address: 0.0.0.0
            port_value: 8080
        filter_chains:
        - filters:
          - name: envoy.filters.network.http_connection_manager
            typed_config:
              "@type": type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager
              stat_prefix: ingress_http
              route_config:
                name: local_route
                virtual_hosts:
                - name: local_service
                  domains: ["*"]
                  routes:
                  - match:
                      prefix: "/"
                    route:
                      cluster: local_service
              http_filters:
              - name: envoy.filters.http.router
      clusters:
      - name: local_service
        connect_timeout: 0.25s
        type: STRICT_DNS
        lb_policy: ROUND_ROBIN
        load_assignment:
          cluster_name: local_service
          endpoints:
          - lb_endpoints:
            - endpoint:
                address:
                  socket_address:
                    address: 127.0.0.1
                    port_value: 3001

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
spec:
  template:
    spec:
      containers:
      - name: user-service
        image: user-service:1.0
        ports:
        - containerPort: 3001
      
      - name: envoy-proxy
        image: envoyproxy/envoy:latest
        ports:
        - containerPort: 8080
        volumeMounts:
        - name: envoy-config
          mountPath: /etc/envoy
      
      volumes:
      - name: envoy-config
        configMap:
          name: envoy-config
```

### 23. What is the Anti-Corruption Layer (ACL)?

The Anti-Corruption Layer pattern isolates your domain model from external systems by creating a translation layer.

**Example:**
```javascript
// External payment gateway with complex API
class LegacyPaymentGateway {
  async processPayment(request) {
    // Complex legacy API
    return {
      transaction_id: '123',
      status_code: 200,
      response_message: 'SUCCESS',
      transaction_date: '2024-01-15T10:30:00Z',
      amount_charged: 10000, // cents
      // ... many other fields
    };
  }
}

// Anti-Corruption Layer
class PaymentGatewayAdapter {
  constructor(legacyGateway) {
    this.legacyGateway = legacyGateway;
  }
  
  async processPayment(payment) {
    // Translate domain model to legacy format
    const legacyRequest = this.toLegacyFormat(payment);
    
    // Call legacy system
    const legacyResponse = await this.legacyGateway.processPayment(legacyRequest);
    
    // Translate legacy response to domain model
    return this.toDomainModel(legacyResponse);
  }
  
  toLegacyFormat(payment) {
    return {
      card_number: payment.cardNumber,
      expiry_month: payment.expiryDate.getMonth() + 1,
      expiry_year: payment.expiryDate.getFullYear(),
      cvv: payment.cvv,
      amount_cents: payment.amount * 100,
      currency_code: payment.currency,
      // ... other mappings
    };
  }
  
  toDomainModel(legacyResponse) {
    return {
      id: legacyResponse.transaction_id,
      status: this.mapStatus(legacyResponse.status_code),
      amount: legacyResponse.amount_charged / 100,
      processedAt: new Date(legacyResponse.transaction_date),
      message: legacyResponse.response_message
    };
  }
  
  mapStatus(statusCode) {
    switch (statusCode) {
      case 200: return 'SUCCESS';
      case 400: return 'FAILED';
      case 500: return 'ERROR';
      default: return 'UNKNOWN';
    }
  }
}

// Domain Service uses clean interface
class PaymentService {
  constructor(paymentGateway) {
    this.paymentGateway = paymentGateway;
  }
  
  async processPayment(payment) {
    // Uses domain model, isolated from legacy system
    return await this.paymentGateway.processPayment(payment);
  }
}

// Usage
const legacyGateway = new LegacyPaymentGateway();
const adapter = new PaymentGatewayAdapter(legacyGateway);
const paymentService = new PaymentService(adapter);

const payment = {
  cardNumber: '4111111111111111',
  expiryDate: new Date('2025-12-31'),
  cvv: '123',
  amount: 100.00,
  currency: 'USD'
};

const result = await paymentService.processPayment(payment);
console.log(result); // Clean domain model
```

### 24. What is the Two-Phase Commit (2PC) protocol?

Two-Phase Commit is a distributed transaction protocol that ensures all participants commit or rollback a transaction.

**Phases:**

**Phase 1: Prepare Phase**
- Coordinator asks all participants to prepare
- Participants execute transaction but don't commit
- Participants respond with vote (yes/no)

**Phase 2: Commit Phase**
- If all voted yes, coordinator asks all to commit
- If any voted no, coordinator asks all to rollback

**Example:**
```javascript
// Two-Phase Commit Coordinator
class TwoPhaseCommitCoordinator {
  constructor(participants) {
    this.participants = participants;
  }
  
  async execute(transaction) {
    const transactionId = generateId();
    
    try {
      // Phase 1: Prepare
      console.log('Phase 1: Prepare');
      const prepareResults = await this.prepare(transactionId, transaction);
      
      // Check if all participants voted yes
      const allPrepared = prepareResults.every(r => r.vote === 'YES');
      
      if (!allPrepared) {
        console.log('Some participants voted NO, rolling back');
        await this.rollback(transactionId);
        return { success: false, reason: 'Prepare failed' };
      }
      
      // Phase 2: Commit
      console.log('Phase 2: Commit');
      await this.commit(transactionId);
      
      return { success: true, transactionId };
    } catch (error) {
      console.error('Transaction failed:', error);
      await this.rollback(transactionId);
      return { success: false, reason: error.message };
    }
  }
  
  async prepare(transactionId, transaction) {
    const promises = this.participants.map(participant =>
      participant.prepare(transactionId, transaction)
    );
    
    return await Promise.all(promises);
  }
  
  async commit(transactionId) {
    const promises = this.participants.map(participant =>
      participant.commit(transactionId)
    );
    
    await Promise.all(promises);
  }
  
  async rollback(transactionId) {
    const promises = this.participants.map(participant =>
      participant.rollback(transactionId)
        .catch(err => console.error('Rollback failed:', err))
    );
    
    await Promise.all(promises);
  }
}

// Participant (e.g., Inventory Service)
class InventoryServiceParticipant {
  constructor() {
    this.preparedTransactions = new Map();
  }
  
  async prepare(transactionId, transaction) {
    try {
      // Check if inventory is available
      const available = await this.checkInventory(
        transaction.productId,
        transaction.quantity
      );
      
      if (!available) {
        return { vote: 'NO', reason: 'Insufficient inventory' };
      }
      
      // Reserve inventory (don't commit yet)
      await this.reserveInventory(transactionId, transaction);
      
      // Store transaction for later commit/rollback
      this.preparedTransactions.set(transactionId, transaction);
      
      return { vote: 'YES' };
    } catch (error) {
      return { vote: 'NO', reason: error.message };
    }
  }
  
  async commit(transactionId) {
    const transaction = this.preparedTransactions.get(transactionId);
    
    if (!transaction) {
      throw new Error('Transaction not prepared');
    }
    
    // Actually deduct inventory
    await this.deductInventory(transaction.productId, transaction.quantity);
    
    this.preparedTransactions.delete(transactionId);
  }
  
  async rollback(transactionId) {
    const transaction = this.preparedTransactions.get(transactionId);
    
    if (transaction) {
      // Release reserved inventory
      await this.releaseReservation(transactionId);
      this.preparedTransactions.delete(transactionId);
    }
  }
  
  async checkInventory(productId, quantity) {
    // Check database
    const product = await ProductModel.findById(productId);
    return product && product.quantity >= quantity;
  }
  
  async reserveInventory(transactionId, transaction) {
    // Create reservation record
    await ReservationModel.create({
      transactionId,
      productId: transaction.productId,
      quantity: transaction.quantity,
      status: 'RESERVED'
    });
  }
  
  async deductInventory(productId, quantity) {
    await ProductModel.updateOne(
      { _id: productId },
      { $inc: { quantity: -quantity } }
    );
  }
  
  async releaseReservation(transactionId) {
    await ReservationModel.deleteOne({ transactionId });
  }
}

// Usage
const coordinator = new TwoPhaseCommitCoordinator([
  new InventoryServiceParticipant(),
  new PaymentServiceParticipant(),
  new ShippingServiceParticipant()
]);

const transaction = {
  productId: 'prod-123',
  quantity: 2,
  amount: 100.00,
  shippingAddress: '123 Main St'
};

const result = await coordinator.execute(transaction);
console.log(result);
```

**Note:** 2PC has limitations:
- Blocking protocol (participants wait for coordinator)
- Single point of failure (coordinator)
- Not suitable for high-latency networks
- Better alternatives: Saga pattern, Event Sourcing

### 25. What is the Database Sharding strategy?

Database Sharding distributes data across multiple database instances to improve scalability and performance.

**Sharding Strategies:**

**1. Hash-based Sharding:**
```javascript
class HashBasedSharding {
  constructor(shards) {
    this.shards = shards; // Array of database connections
  }
  
  getShardIndex(key) {
    // Simple hash function
    const hash = this.hashCode(key);
    return Math.abs(hash) % this.shards.length;
  }
  
  hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash;
  }
  
  async save(key, data) {
    const shardIndex = this.getShardIndex(key);
    const shard = this.shards[shardIndex];
    return await shard.collection('users').insertOne({ _id: key, ...data });
  }
  
  async findById(key) {
    const shardIndex = this.getShardIndex(key);
    const shard = this.shards[shardIndex];
    return await shard.collection('users').findOne({ _id: key });
  }
}

// Usage
const sharding = new HashBasedSharding([
  mongoClient1.db('shard1'),
  mongoClient2.db('shard2'),
  mongoClient3.db('shard3')
]);

await sharding.save('user-123', { name: 'John', email: 'john@example.com' });
const user = await sharding.findById('user-123');
```

**2. Range-based Sharding:**
```javascript
class RangeBasedSharding {
  constructor(shards) {
    this.shardRanges = [
      { min: 'A', max: 'H', shard: shards[0] },
      { min: 'I', max: 'P', shard: shards[1] },
      { min: 'Q', max: 'Z', shard: shards[2] }
    ];
  }
  
  getShard(key) {
    const firstChar = key[0].toUpperCase();
    
    for (const range of this.shardRanges) {
      if (firstChar >= range.min && firstChar <= range.max) {
        return range.shard;
      }
    }
    
    throw new Error('Shard not found for key');
  }
  
  async save(key, data) {
    const shard = this.getShard(key);
    return await shard.collection('users').insertOne({ _id: key, ...data });
  }
  
  async findById(key) {
    const shard = this.getShard(key);
    return await shard.collection('users').findOne({ _id: key });
  }
  
  async findByRange(minKey, maxKey) {
    // Query multiple shards if range spans across them
    const results = [];
    
    for (const range of this.shardRanges) {
      if (this.rangesOverlap(minKey, maxKey, range.min, range.max)) {
        const shardResults = await range.shard.collection('users')
          .find({
            _id: {
              $gte: Math.max(minKey, range.min),
              $lte: Math.min(maxKey, range.max)
            }
          })
          .toArray();
        
        results.push(...shardResults);
      }
    }
    
    return results;
  }
  
  rangesOverlap(min1, max1, min2, max2) {
    return min1 <= max2 && min2 <= max1;
  }
}
```

**3. Geographic Sharding:**
```javascript
class GeographicSharding {
  constructor(shards) {
    this.regionShards = {
      'US': shards[0],
      'EU': shards[1],
      'ASIA': shards[2]
    };
  }
  
  getShard(region) {
    const shard = this.regionShards[region];
    if (!shard) {
      throw new Error(`No shard for region: ${region}`);
    }
    return shard;
  }
  
  async save(userId, region, data) {
    const shard = this.getShard(region);
    return await shard.collection('users').insertOne({
      _id: userId,
      region,
      ...data
    });
  }
  
  async findById(userId, region) {
    const shard = this.getShard(region);
    return await shard.collection('users').findOne({ _id: userId });
  }
  
  async findByRegion(region) {
    const shard = this.getShard(region);
    return await shard.collection('users').find({ region }).toArray();
  }
}
```

### 26. What is the Outbox pattern?

The Outbox pattern ensures reliable message publishing by storing events in the database alongside business data, then publishing them in a separate process.

**Implementation:**
```javascript
// Order Service
class OrderService {
  constructor(db, eventPublisher) {
    this.db = db;
    this.eventPublisher = eventPublisher;
  }
  
  async createOrder(orderData) {
    const session = await this.db.startSession();
    
    try {
      await session.withTransaction(async () => {
        // Step 1: Create order in database
        const order = await OrderModel.create([{
          ...orderData,
          status: 'PENDING',
          createdAt: new Date()
        }], { session });
        
        // Step 2: Store event in outbox table (same transaction)
        await OutboxModel.create([{
          aggregateType: 'Order',
          aggregateId: order[0]._id,
          eventType: 'OrderCreated',
          payload: JSON.stringify(order[0]),
          createdAt: new Date(),
          processed: false
        }], { session });
      });
      
      console.log('Order and event saved atomically');
    } finally {
      await session.endSession();
    }
  }
}

// Outbox Publisher (separate process)
class OutboxPublisher {
  constructor(db, messageQueue) {
    this.db = db;
    this.messageQueue = messageQueue;
  }
  
  async start() {
    // Poll outbox table every second
    setInterval(() => this.publishPendingEvents(), 1000);
  }
  
  async publishPendingEvents() {
    const events = await OutboxModel.find({
      processed: false
    }).limit(100);
    
    for (const event of events) {
      try {
        // Publish to message queue
        await this.messageQueue.publish(event.eventType, {
          aggregateType: event.aggregateType,
          aggregateId: event.aggregateId,
          payload: JSON.parse(event.payload),
          occurredAt: event.createdAt
        });
        
        // Mark as processed
        await OutboxModel.updateOne(
          { _id: event._id },
          {
            processed: true,
            processedAt: new Date()
          }
        );
        
        console.log(`Published event: ${event.eventType}`);
      } catch (error) {
        console.error(`Failed to publish event ${event._id}:`, error);
        
        // Update retry count
        await OutboxModel.updateOne(
          { _id: event._id },
          {
            $inc: { retryCount: 1 },
            lastError: error.message
          }
        );
      }
    }
  }
}

// Outbox Model
const outboxSchema = new mongoose.Schema({
  aggregateType: String,
  aggregateId: String,
  eventType: String,
  payload: String,
  createdAt: Date,
  processed: Boolean,
  processedAt: Date,
  retryCount: { type: Number, default: 0 },
  lastError: String
});

const OutboxModel = mongoose.model('Outbox', outboxSchema);

// Usage
const orderService = new OrderService(db, eventPublisher);
await orderService.createOrder({
  customerId: 'cust-123',
  items: [{ productId: 'prod-456', quantity: 2 }]
});

// Start outbox publisher
const publisher = new OutboxPublisher(db, messageQueue);
publisher.start();
```

### 27. What is the Retry and Exponential Backoff strategy?

Retry with Exponential Backoff is a strategy to handle transient failures by retrying with increasing delays.

**Implementation:**
```javascript
// Retry utility
class RetryHandler {
  constructor(options = {}) {
    this.maxRetries = options.maxRetries || 3;
    this.initialDelay = options.initialDelay || 1000;
    this.maxDelay = options.maxDelay || 30000;
    this.factor = options.factor || 2;
    this.jitter = options.jitter !== false;
  }
  
  async execute(fn, context = {}) {
    let lastError;
    
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        
        if (attempt === this.maxRetries) {
          throw error;
        }
        
        // Check if error is retryable
        if (!this.isRetryable(error)) {
          throw error;
        }
        
        // Calculate delay
        const delay = this.calculateDelay(attempt);
        
        console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
        
        // Wait before retrying
        await this.sleep(delay);
      }
    }
    
    throw lastError;
  }
  
  calculateDelay(attempt) {
    // Exponential backoff: delay = initialDelay * (factor ^ attempt)
    let delay = this.initialDelay * Math.pow(this.factor, attempt);
    
    // Cap at max delay
    delay = Math.min(delay, this.maxDelay);
    
    // Add jitter to prevent thundering herd
    if (this.jitter) {
      delay = delay * (0.5 + Math.random() * 0.5);
    }
    
    return Math.floor(delay);
  }
  
  isRetryable(error) {
    // Retry on network errors and 5xx errors
    if (error.code === 'ECONNREFUSED' ||
        error.code === 'ETIMEDOUT' ||
        error.code === 'ENOTFOUND') {
      return true;
    }
    
    if (error.response) {
      const status = error.response.status;
      return status >= 500 || status === 429; // 429 = Too Many Requests
    }
    
    return false;
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Usage with Axios
const axios = require('axios');

const retryHandler = new RetryHandler({
  maxRetries: 5,
  initialDelay: 1000,
  maxDelay: 30000,
  factor: 2,
  jitter: true
});

async function callExternalService(userId) {
  return await retryHandler.execute(async () => {
    const response = await axios.get(
      `http://external-service/users/${userId}`,
      { timeout: 5000 }
    );
    return response.data;
  });
}

// Usage with custom function
async function processOrder(orderId) {
  return await retryHandler.execute(async () => {
    // Your business logic
    const order = await Order.findById(orderId);
    
    if (!order) {
      // Non-retryable error
      throw new Error('Order not found');
    }
    
    // Process order
    await paymentService.process(order.paymentId);
    await inventoryService.reserve(order.items);
    
    return order;
  });
}

// Try the call
try {
  const user = await callExternalService('user-123');
  console.log('User:', user);
} catch (error) {
  console.error('All retries failed:', error.message);
}
```

**Axios Interceptor for Automatic Retry:**
```javascript
const axiosRetry = require('axios-retry');

// Configure axios with retry
axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
           error.response?.status >= 500;
  },
  onRetry: (retryCount, error, requestConfig) => {
    console.log(`Retry attempt ${retryCount} for ${requestConfig.url}`);
  }
});

// Use axios normally, retries are automatic
const response = await axios.get('http://external-service/data');
```

### 28. What is the Rate Limiting pattern?

Rate Limiting controls the number of requests a client can make to prevent abuse and ensure fair resource allocation.

**Algorithms:**

**1. Token Bucket:**
```javascript
class TokenBucket {
  constructor(capacity, refillRate) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.refillRate = refillRate; // tokens per second
    this.lastRefill = Date.now();
  }
  
  refill() {
    const now = Date.now();
    const timePassed = (now - this.lastRefill) / 1000; // seconds
    const tokensToAdd = timePassed * this.refillRate;
    
    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }
  
  tryConsume(tokens = 1) {
    this.refill();
    
    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    }
    
    return false;
  }
}

// Express middleware
function rateLimitMiddleware(limiter) {
  const buckets = new Map();
  
  return (req, res, next) => {
    const clientId = req.ip || req.headers['x-forwarded-for'];
    
    if (!buckets.has(clientId)) {
      buckets.set(clientId, new TokenBucket(100, 10)); // 100 tokens, refill 10/sec
    }
    
    const bucket = buckets.get(clientId);
    
    if (bucket.tryConsume()) {
      res.setHeader('X-RateLimit-Remaining', Math.floor(bucket.tokens));
      next();
    } else {
      res.status(429).json({
        error: 'Too Many Requests',
        retryAfter: 1
      });
    }
  };
}

app.use(rateLimitMiddleware());
```

**2. Sliding Window:**
```javascript
class SlidingWindowRateLimiter {
  constructor(redis, windowSize, maxRequests) {
    this.redis = redis;
    this.windowSize = windowSize; // in seconds
    this.maxRequests = maxRequests;
  }
  
  async tryAcquire(clientId) {
    const now = Date.now();
    const windowStart = now - (this.windowSize * 1000);
    
    const key = `rate_limit:${clientId}`;
    
    // Remove old entries
    await this.redis.zremrangebyscore(key, '-inf', windowStart);
    
    // Count requests in current window
    const requestCount = await this.redis.zcard(key);
    
    if (requestCount < this.maxRequests) {
      // Add current request
      await this.redis.zadd(key, now, `${now}-${Math.random()}`);
      
      // Set expiry
      await this.redis.expire(key, this.windowSize);
      
      return {
        allowed: true,
        remaining: this.maxRequests - requestCount - 1
      };
    }
    
    return {
      allowed: false,
      remaining: 0,
      retryAfter: await this.getRetryAfter(key, windowStart)
    };
  }
  
  async getRetryAfter(key, windowStart) {
    const oldestRequest = await this.redis.zrange(key, 0, 0);
    if (oldestRequest.length > 0) {
      const oldestTime = parseInt(oldestRequest[0].split('-')[0]);
      const retryAfter = Math.ceil((windowStart - oldestTime) / 1000);
      return Math.max(1, retryAfter);
    }
    return 1;
  }
}

// Express middleware
function slidingWindowMiddleware(limiter) {
  return async (req, res, next) => {
    const clientId = req.ip || req.headers['x-forwarded-for'];
    
    const result = await limiter.tryAcquire(clientId);
    
    res.setHeader('X-RateLimit-Limit', limiter.maxRequests);
    res.setHeader('X-RateLimit-Remaining', result.remaining);
    
    if (result.allowed) {
      next();
    } else {
      res.setHeader('Retry-After', result.retryAfter);
      res.status(429).json({
        error: 'Too Many Requests',
        retryAfter: result.retryAfter
      });
    }
  };
}

// Usage
const limiter = new SlidingWindowRateLimiter(
  redisClient,
  60,   // 60 seconds window
  100   // 100 requests per window
);

app.use(slidingWindowMiddleware(limiter));
```

### 29. What is the API Composition pattern?

API Composition aggregates data from multiple services to provide a unified response to clients.

**Example:**
```javascript
// API Composition Service
class OrderCompositionService {
  constructor(userService, orderService, productService) {
    this.userService = userService;
    this.orderService = orderService;
    this.productService = productService;
  }
  
  async getOrderDetails(orderId) {
    try {
      // Fetch order data
      const order = await this.orderService.getOrder(orderId);
      
      if (!order) {
        throw new Error('Order not found');
      }
      
      // Fetch related data in parallel
      const [user, products] = await Promise.all([
        this.userService.getUser(order.userId),
        this.getProductDetails(order.items)
      ]);
      
      // Compose response
      return {
        order: {
          id: order.id,
          status: order.status,
          total: order.total,
          createdAt: order.createdAt
        },
        customer: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        items: products.map((product, index) => ({
          product: {
            id: product.id,
            name: product.name,
            image: product.image
          },
          quantity: order.items[index].quantity,
          price: order.items[index].price,
          subtotal: order.items[index].quantity * order.items[index].price
        }))
      };
    } catch (error) {
      console.error('Failed to compose order details:', error);
      throw error;
    }
  }
  
  async getProductDetails(items) {
    const productIds = items.map(item => item.productId);
    
    // Fetch products in parallel
    const productPromises = productIds.map(id =>
      this.productService.getProduct(id)
    );
    
    return await Promise.all(productPromises);
  }
  
  async getUserOrders(userId) {
    try {
      // Fetch user and orders in parallel
      const [user, orders] = await Promise.all([
        this.userService.getUser(userId),
        this.orderService.getUserOrders(userId)
      ]);
      
      // Compose response
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        orders: orders.map(order => ({
          id: order.id,
          status: order.status,
          total: order.total,
          itemCount: order.items.length,
          createdAt: order.createdAt
        })),
        summary: {
          totalOrders: orders.length,
          totalSpent: orders.reduce((sum, o) => sum + o.total, 0)
        }
      };
    } catch (error) {
      console.error('Failed to compose user orders:', error);
      throw error;
    }
  }
}

// API Routes
app.get('/api/orders/:id', async (req, res) => {
  try {
    const compositionService = new OrderCompositionService(
      userService,
      orderService,
      productService
    );
    
    const orderDetails = await compositionService.getOrderDetails(req.params.id);
    
    res.json(orderDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users/:id/orders', async (req, res) => {
  try {
    const compositionService = new OrderCompositionService(
      userService,
      orderService,
      productService
    );
    
    const userOrders = await compositionService.getUserOrders(req.params.id);
    
    res.json(userOrders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 30. What are Microservices monitoring and observability best practices?

**1. The Three Pillars of Observability:**

**Metrics:**
```javascript
const promClient = require('prom-client');

// Create metrics
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

const httpRequestTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const activeConnections = new promClient.Gauge({
  name: 'active_connections',
  help: 'Number of active connections'
});

// Middleware to collect metrics
app.use((req, res, next) => {
  const start = Date.now();
  
  activeConnections.inc();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    
    httpRequestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration);
    
    httpRequestTotal
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .inc();
    
    activeConnections.dec();
  });
  
  next();
});

// Expose metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});
```

**Logs:**
```javascript
const winston = require('winston');

// Structured logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'user-service',
    version: '1.0.0'
  },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Request logging middleware
app.use((req, res, next) => {
  const requestId = req.headers['x-request-id'] || generateId();
  req.requestId = requestId;
  
  logger.info('Incoming request', {
    requestId,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.headers['user-agent']
  });
  
  res.on('finish', () => {
    logger.info('Request completed', {
      requestId,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: Date.now() - req.startTime
    });
  });
  
  next();
});

// Error logging
app.use((err, req, res, next) => {
  logger.error('Request failed', {
    requestId: req.requestId,
    error: {
      message: err.message,
      stack: err.stack,
      code: err.code
    },
    method: req.method,
    url: req.url
  });
  
  res.status(500).json({ error: 'Internal Server Error' });
});
```

**Traces:**
```javascript
const opentelemetry = require('@opentelemetry/sdk-node');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');

// Initialize OpenTelemetry
const sdk = new opentelemetry.NodeSDK({
  traceExporter: new JaegerExporter({
    serviceName: 'user-service',
    endpoint: 'http://jaeger:14268/api/traces'
  }),
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation()
  ]
});

sdk.start();

// Custom span
const tracer = opentelemetry.trace.getTracer('user-service');

async function processUser(userId) {
  const span = tracer.startSpan('processUser');
  
  try {
    span.setAttribute('user.id', userId);
    
    // Business logic
    const user = await getUser(userId);
    span.addEvent('user_fetched', { userId });
    
    await updateUser(user);
    span.addEvent('user_updated', { userId });
    
    return user;
  } catch (error) {
    span.recordException(error);
    span.setStatus({ code: SpanStatusCode.ERROR });
    throw error;
  } finally {
    span.end();
  }
}
```

**2. Health Dashboards:**
```yaml
# Grafana Dashboard Configuration
apiVersion: v1
kind: ConfigMap
metadata:
  name: grafana-dashboards
data:
  microservices-overview.json: |
    {
      "dashboard": {
        "title": "Microservices Overview",
        "panels": [
          {
            "title": "Request Rate",
            "targets": [
              {
                "expr": "rate(http_requests_total[5m])"
              }
            ]
          },
          {
            "title": "Error Rate",
            "targets": [
              {
                "expr": "rate(http_requests_total{status_code=~\"5..\"}[5m])"
              }
            ]
          },
          {
            "title": "Latency",
            "targets": [
              {
                "expr": "histogram_quantile(0.95, http_request_duration_seconds_bucket)"
              }
            ]
          }
        ]
      }
    }
```

---

## Conclusion

These questions cover Microservices fundamentals through advanced concepts and should thoroughly prepare you for a Microservices architecture interview! The topics range from basic service communication to advanced patterns like Saga, CQRS, and Event Sourcing that are essential for building scalable distributed systems with Microservices.

Key areas covered include:
- **Core Concepts**: Microservices architecture, API Gateway, Service Discovery
- **Communication**: Synchronous/asynchronous, REST, message queues
- **Data Management**: Database per service, distributed transactions, sharding
- **Resilience**: Circuit breaker, retry, bulkhead, rate limiting
- **Patterns**: Saga, CQRS, Event Sourcing, DDD, BFF, Strangler Fig
- **Infrastructure**: Container orchestration, service mesh, distributed tracing
- **Best Practices**: Monitoring, observability, testing, deployment strategies
