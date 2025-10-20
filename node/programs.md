# Node.js Real-Time Communication Programs

A comprehensive guide for implementing real-time communication between React frontend and Node.js backend using WebSockets.

## Table of Contents

- [Real-Time Chat Application](#real-time-chat-application)
- [Setup Instructions](#setup-instructions)
- [How It Works](#how-it-works)
- [Common Use Cases](#common-use-cases)
- [Security & Scalability](#security--scalability)

---

## Real-Time Chat Application

Implement real-time communication between a React frontend and a Node.js backend — for example, for chat, notifications, dashboards, etc.

### 🧩 Typical Tech Used: WebSockets via Socket.IO

**Why Socket.IO?**

- Simple abstraction over WebSockets (auto-reconnect, fallback to polling)
- Works well with both React and Node
- Emits/receives real-time events

---

## Setup Instructions

### ⚙️ 1. Setup the Backend (Node.js + Express + Socket.IO)

**Install dependencies:**
```bash
npm install express socket.io
```

**server.js**
```javascript
import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // your React app
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("⚡ New client connected:", socket.id);

  // Example: receive event from frontend
  socket.on("sendMessage", (msg) => {
    console.log("Received message:", msg);

    // Broadcast message to all connected clients
    io.emit("receiveMessage", msg);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

server.listen(4000, () => console.log("Server running on port 4000"));
```

### 💻 2. Frontend Setup (React + Socket.IO Client)

**Install:**
```bash
npm install socket.io-client
```

**Example: ChatApp.jsx**
```jsx
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000"); // connect to backend

export default function ChatApp() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setChat((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = () => {
    socket.emit("sendMessage", message);
    setMessage("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>Real-Time Chat</h3>
      <div>
        {chat.map((c, i) => (
          <p key={i}>{c}</p>
        ))}
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
```

---

## How It Works

### 🧠 3. Real-Time Communication Flow

1. **Client connects** via Socket.IO to the backend
2. **Backend emits and listens** to custom events
3. **Data travels instantly** via WebSocket connection
4. **Any update can be pushed** from backend → frontend without reload or polling

### Connection Flow Diagram

```
React Frontend          Node.js Backend
     │                       │
     │─── connect() ────────▶│
     │                       │
     │◀── connection ────────│
     │                       │
     │─── emit("sendMessage")▶│
     │                       │
     │◀── emit("receiveMessage")│
     │                       │
```

---

## Common Use Cases

### 🧱 4. Real-Time Application Patterns

| Use Case | Backend Emits | Frontend Reacts |
|----------|---------------|-----------------|
| Chat app | `newMessage` | Update chat feed |
| Live stock prices | `priceUpdate` | Update UI instantly |
| Dashboard metrics | `dataUpdate` | Refresh chart |
| Notifications | `notifyUser` | Show toast alert |

### Example: Live Dashboard Updates

**Backend (Node.js):**
```javascript
// Emit dashboard updates every 5 seconds
setInterval(() => {
  const metrics = {
    users: Math.floor(Math.random() * 1000),
    sales: Math.floor(Math.random() * 10000),
    timestamp: new Date().toISOString()
  };
  
  io.emit("dashboardUpdate", metrics);
}, 5000);
```

**Frontend (React):**
```jsx
useEffect(() => {
  socket.on("dashboardUpdate", (metrics) => {
    setDashboardData(metrics);
  });

  return () => socket.off("dashboardUpdate");
}, []);
```

### Example: Real-Time Notifications

**Backend:**
```javascript
// Send notification to specific user
socket.to(userId).emit("notification", {
  type: "info",
  message: "New message received",
  timestamp: new Date()
});
```

**Frontend:**
```jsx
useEffect(() => {
  socket.on("notification", (notification) => {
    showToast(notification.message, notification.type);
  });

  return () => socket.off("notification");
}, []);
```

---

## Security & Scalability

### 🔐 5. Production-Ready Setup

#### Authentication with JWT

**Backend:**
```javascript
import jwt from 'jsonwebtoken';

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

io.on("connection", (socket) => {
  console.log(`User ${socket.userId} connected`);
  
  // Join user to their personal room
  socket.join(`user_${socket.userId}`);
});
```

**Frontend:**
```jsx
const socket = io("http://localhost:4000", {
  auth: {
    token: localStorage.getItem('jwt_token')
  }
});
```

#### Redis Adapter for Scaling

**Install Redis adapter:**
```bash
npm install @socket.io/redis-adapter redis
```

**Backend with Redis:**
```javascript
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

const pubClient = createClient({ url: 'redis://localhost:6379' });
const subClient = pubClient.duplicate();

await Promise.all([pubClient.connect(), subClient.connect()]);

io.adapter(createAdapter(pubClient, subClient));
```

#### Production Security

**HTTPS/WSS Setup:**
```javascript
const server = https.createServer({
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem')
}, app);

const io = new Server(server, {
  cors: {
    origin: "https://yourdomain.com",
    methods: ["GET", "POST"]
  }
});
```

### Best Practices

1. **Rate Limiting**: Implement rate limiting for socket events
2. **Input Validation**: Validate all incoming socket data
3. **Error Handling**: Proper error handling and logging
4. **Room Management**: Use rooms for targeted messaging
5. **Connection Limits**: Set maximum connection limits
6. **Monitoring**: Monitor socket connections and performance

### Example: Advanced Chat with Rooms

**Backend:**
```javascript
io.on("connection", (socket) => {
  // Join a specific room
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit("userJoined", socket.userId);
  });

  // Send message to specific room
  socket.on("sendRoomMessage", ({ roomId, message }) => {
    socket.to(roomId).emit("receiveRoomMessage", {
      userId: socket.userId,
      message,
      timestamp: new Date()
    });
  });

  // Leave room
  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
    socket.to(roomId).emit("userLeft", socket.userId);
  });
});
```

**Frontend:**
```jsx
const joinRoom = (roomId) => {
  socket.emit("joinRoom", roomId);
};

const sendRoomMessage = (roomId, message) => {
  socket.emit("sendRoomMessage", { roomId, message });
};

useEffect(() => {
  socket.on("receiveRoomMessage", (data) => {
    setMessages(prev => [...prev, data]);
  });

  socket.on("userJoined", (userId) => {
    showNotification(`${userId} joined the room`);
  });

  return () => {
    socket.off("receiveRoomMessage");
    socket.off("userJoined");
  };
}, []);
```

---

## Conclusion

This guide provides a comprehensive foundation for implementing real-time communication in Node.js applications. The examples cover basic chat functionality, advanced features like rooms and authentication, and production-ready considerations for security and scalability.

Key takeaways:
- **Socket.IO** provides a robust abstraction over WebSockets
- **Authentication** is crucial for production applications
- **Redis adapter** enables horizontal scaling
- **Room management** allows for targeted messaging
- **Security measures** protect against common vulnerabilities

---

## CRUD Operations with Express and MongoDB

A complete implementation of RESTful CRUD operations for a Todo application using Express.js and native MongoDB driver (without Mongoose).

### 📦 Dependencies Installation

```bash
npm install express mongodb dotenv cors
npm install --save-dev nodemon
```

### 🗂️ Project Structure

```
todo-api/
├── config/
│   └── db.js
├── controllers/
│   └── todoController.js
├── routes/
│   └── todoRoutes.js
├── middleware/
│   └── errorHandler.js
│   └── validator.js
├── .env
└── server.js
```

---

### ⚙️ 1. Environment Configuration

**.env**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/todoapp
# Or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/todoapp
DB_NAME=todoapp
```

---

### 🔌 2. Database Connection

**config/db.js**
```javascript
import { MongoClient } from 'mongodb';

let db;
let client;

export const connectDB = async () => {
  try {
    client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    
    db = client.db(process.env.DB_NAME || 'todoapp');
    
    // Create indexes for better performance
    await db.collection('todos').createIndex({ completed: 1, createdAt: -1 });
    await db.collection('todos').createIndex({ priority: 1 });
    await db.collection('todos').createIndex({ title: 'text', description: 'text' });
    
    console.log(`✅ MongoDB Connected: ${client.s.options.hosts[0]}`);
    
    return db;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return db;
};

export const closeDB = async () => {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
};
```

---

### 🛡️ 3. Validation Middleware

**middleware/validator.js**
```javascript
export const validateTodo = (req, res, next) => {
  const { title, description, priority } = req.body;
  const errors = [];
  
  // Title validation
  if (req.method === 'POST' && !title) {
    errors.push('Title is required');
  }
  
  if (title && title.trim().length === 0) {
    errors.push('Title cannot be empty');
  }
  
  if (title && title.length > 100) {
    errors.push('Title cannot be more than 100 characters');
  }
  
  // Description validation
  if (description && description.length > 500) {
    errors.push('Description cannot be more than 500 characters');
  }
  
  // Priority validation
  if (priority && !['low', 'medium', 'high'].includes(priority)) {
    errors.push('Priority must be low, medium, or high');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors
    });
  }
  
  next();
};

export const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  
  // Check if id is a valid 24-character hex string
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }
  
  next();
};
```

---

### 🎮 4. Todo Controller

**controllers/todoController.js**
```javascript
import { ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';

// @desc    Get all todos
// @route   GET /api/todos
// @access  Public
export const getTodos = async (req, res, next) => {
  try {
    const db = getDB();
    const { completed, priority, search, sortBy, limit, page } = req.query;
    
    // Build query
    const query = {};
    
    if (completed !== undefined) {
      query.completed = completed === 'true';
    }
    
    if (priority) {
      query.priority = priority;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;
    
    // Sorting
    let sort = { createdAt: -1 }; // Default: newest first
    if (sortBy === 'oldest') {
      sort = { createdAt: 1 };
    } else if (sortBy === 'priority') {
      sort = { priority: -1, createdAt: 1 };
    } else if (sortBy === 'dueDate') {
      sort = { dueDate: 1 };
    }
    
    const todos = await db.collection('todos')
      .find(query)
      .sort(sort)
      .limit(limitNum)
      .skip(skip)
      .toArray();
    
    const total = await db.collection('todos').countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: todos.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: todos
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single todo by ID
// @route   GET /api/todos/:id
// @access  Public
export const getTodoById = async (req, res, next) => {
  try {
    const db = getDB();
    const todo = await db.collection('todos').findOne({
      _id: new ObjectId(req.params.id)
    });
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: todo
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new todo
// @route   POST /api/todos
// @access  Public
export const createTodo = async (req, res, next) => {
  try {
    const db = getDB();
    const { title, description, priority, dueDate, tags } = req.body;
    
    const newTodo = {
      title: title.trim(),
      description: description ? description.trim() : '',
      completed: false,
      priority: priority || 'medium',
      dueDate: dueDate ? new Date(dueDate) : null,
      tags: tags || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('todos').insertOne(newTodo);
    const todo = await db.collection('todos').findOne({ _id: result.insertedId });
    
    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: todo
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update todo
// @route   PUT /api/todos/:id
// @access  Public
export const updateTodo = async (req, res, next) => {
  try {
    const db = getDB();
    const { title, description, completed, priority, dueDate, tags } = req.body;
    
    // Check if todo exists
    const existingTodo = await db.collection('todos').findOne({
      _id: new ObjectId(req.params.id)
    });
    
    if (!existingTodo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    
    // Build update object
    const updateFields = {
      updatedAt: new Date()
    };
    
    if (title !== undefined) updateFields.title = title.trim();
    if (description !== undefined) updateFields.description = description.trim();
    if (completed !== undefined) updateFields.completed = completed;
    if (priority !== undefined) updateFields.priority = priority;
    if (dueDate !== undefined) updateFields.dueDate = dueDate ? new Date(dueDate) : null;
    if (tags !== undefined) updateFields.tags = tags;
    
    const result = await db.collection('todos').findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: updateFields },
      { returnDocument: 'after' }
    );
    
    res.status(200).json({
      success: true,
      message: 'Todo updated successfully',
      data: result.value
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete todo
// @route   DELETE /api/todos/:id
// @access  Public
export const deleteTodo = async (req, res, next) => {
  try {
    const db = getDB();
    
    const result = await db.collection('todos').deleteOne({
      _id: new ObjectId(req.params.id)
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle todo completion status
// @route   PATCH /api/todos/:id/toggle
// @access  Public
export const toggleTodoCompletion = async (req, res, next) => {
  try {
    const db = getDB();
    
    const todo = await db.collection('todos').findOne({
      _id: new ObjectId(req.params.id)
    });
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    
    const result = await db.collection('todos').findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      {
        $set: {
          completed: !todo.completed,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    );
    
    res.status(200).json({
      success: true,
      message: `Todo marked as ${result.value.completed ? 'completed' : 'incomplete'}`,
      data: result.value
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete all completed todos
// @route   DELETE /api/todos/completed
// @access  Public
export const deleteCompletedTodos = async (req, res, next) => {
  try {
    const db = getDB();
    
    const result = await db.collection('todos').deleteMany({ completed: true });
    
    res.status(200).json({
      success: true,
      message: `${result.deletedCount} completed todos deleted`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get todo statistics
// @route   GET /api/todos/stats
// @access  Public
export const getTodoStats = async (req, res, next) => {
  try {
    const db = getDB();
    
    const stats = await db.collection('todos').aggregate([
      {
        $facet: {
          byCompletion: [
            { $group: { _id: '$completed', count: { $sum: 1 } } }
          ],
          byPriority: [
            { $group: { _id: '$priority', count: { $sum: 1 } } }
          ],
          total: [
            { $count: 'count' }
          ]
        }
      }
    ]).toArray();
    
    res.status(200).json({
      success: true,
      data: {
        total: stats[0].total[0]?.count || 0,
        byCompletion: stats[0].byCompletion,
        byPriority: stats[0].byPriority
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk update todos
// @route   PATCH /api/todos/bulk
// @access  Public
export const bulkUpdateTodos = async (req, res, next) => {
  try {
    const db = getDB();
    const { ids, updates } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of todo IDs'
      });
    }
    
    const objectIds = ids.map(id => new ObjectId(id));
    
    const result = await db.collection('todos').updateMany(
      { _id: { $in: objectIds } },
      {
        $set: {
          ...updates,
          updatedAt: new Date()
        }
      }
    );
    
    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} todos updated`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    next(error);
  }
};
```

---

### 🛣️ 5. Routes Configuration

**routes/todoRoutes.js**
```javascript
import express from 'express';
import {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodoCompletion,
  deleteCompletedTodos,
  getTodoStats,
  bulkUpdateTodos
} from '../controllers/todoController.js';
import { validateTodo, validateObjectId } from '../middleware/validator.js';

const router = express.Router();

// Stats route (must be before /:id to avoid conflicts)
router.get('/stats', getTodoStats);

// Completed todos routes
router.delete('/completed', deleteCompletedTodos);

// Bulk operations
router.patch('/bulk', bulkUpdateTodos);

// Main CRUD routes
router.route('/')
  .get(getTodos)
  .post(validateTodo, createTodo);

router.route('/:id')
  .get(validateObjectId, getTodoById)
  .put(validateObjectId, validateTodo, updateTodo)
  .delete(validateObjectId, deleteTodo);

// Toggle completion
router.patch('/:id/toggle', validateObjectId, toggleTodoCompletion);

export default router;
```

---

### 🛡️ 6. Error Handler Middleware

**middleware/errorHandler.js**
```javascript
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  
  // Log to console for dev
  console.error(err);
  
  // MongoDB duplicate key error
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }
  
  // MongoDB validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = { message, statusCode: 400 };
  }
  
  // MongoDB connection error
  if (err.name === 'MongoServerError') {
    const message = 'Database operation failed';
    error = { message, statusCode: 500 };
  }
  
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

export default errorHandler;
```

---

### 🚀 7. Main Server File

**server.js**
```javascript
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB, closeDB } from './config/db.js';
import todoRoutes from './routes/todoRoutes.js';
import errorHandler from './middleware/errorHandler.js';

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Routes
app.use('/api/todos', todoRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

let server;

// Start server
const startServer = async () => {
  try {
    // Connect to database first
    await connectDB();
    
    // Start listening
    server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`❌ Error: ${err.message}`);
  if (server) {
    server.close(() => {
      closeDB();
      process.exit(1);
    });
  }
});

// Handle SIGTERM signal (graceful shutdown)
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing server gracefully...');
  if (server) {
    server.close(() => {
      closeDB();
      process.exit(0);
    });
  }
});

// Handle SIGINT signal (Ctrl+C)
process.on('SIGINT', () => {
  console.log('\nSIGINT received. Closing server gracefully...');
  if (server) {
    server.close(() => {
      closeDB();
      process.exit(0);
    });
  }
});

// Start the server
startServer();

export default app;
```

---

### 📝 8. Package.json

**package.json**
```json
{
  "name": "todo-crud-api",
  "version": "1.0.0",
  "description": "CRUD API for Todo application with Express and MongoDB (Native Driver)",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "keywords": ["express", "mongodb", "crud", "todo", "api", "native-driver"],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "mongodb": "^6.3.0",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

---

### 🧪 9. API Testing Examples

#### Create a Todo
```bash
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "priority": "high",
    "dueDate": "2025-10-25",
    "tags": ["work", "documentation"]
  }'
```

#### Get All Todos
```bash
# Basic
curl http://localhost:5000/api/todos

# With filters and pagination
curl "http://localhost:5000/api/todos?completed=false&priority=high&page=1&limit=10"

# Search todos
curl "http://localhost:5000/api/todos?search=project"
```

#### Get Single Todo
```bash
curl http://localhost:5000/api/todos/65abc123def456789
```

#### Update Todo
```bash
curl -X PUT http://localhost:5000/api/todos/65abc123def456789 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated title",
    "completed": true,
    "priority": "medium"
  }'
```

#### Toggle Completion
```bash
curl -X PATCH http://localhost:5000/api/todos/65abc123def456789/toggle
```

#### Delete Todo
```bash
curl -X DELETE http://localhost:5000/api/todos/65abc123def456789
```

#### Get Statistics
```bash
curl http://localhost:5000/api/todos/stats
```

#### Delete All Completed Todos
```bash
curl -X DELETE http://localhost:5000/api/todos/completed
```

#### Bulk Update Todos
```bash
curl -X PATCH http://localhost:5000/api/todos/bulk \
  -H "Content-Type: application/json" \
  -d '{
    "ids": ["65abc123def456789", "65abc123def456790"],
    "updates": {
      "priority": "high",
      "completed": false
    }
  }'
```

---

### 📊 10. Advanced MongoDB Query Examples

#### Aggregation Pipeline for Overdue Todos

```javascript
export const getOverdueTodos = async (req, res, next) => {
  try {
    const db = getDB();
    
    const overdueTodos = await db.collection('todos').aggregate([
      {
        $match: {
          completed: false,
          dueDate: { $lt: new Date(), $ne: null }
        }
      },
      {
        $addFields: {
          daysOverdue: {
            $dateDiff: {
              startDate: '$dueDate',
              endDate: new Date(),
              unit: 'day'
            }
          }
        }
      },
      {
        $sort: { daysOverdue: -1 }
      }
    ]).toArray();
    
    res.status(200).json({
      success: true,
      count: overdueTodos.length,
      data: overdueTodos
    });
  } catch (error) {
    next(error);
  }
};
```

#### Text Search with Indexes

```javascript
export const searchTodos = async (req, res, next) => {
  try {
    const db = getDB();
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    // Using text index for full-text search
    const results = await db.collection('todos')
      .find({ $text: { $search: query } })
      .project({ score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .toArray();
    
    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    next(error);
  }
};
```

#### Complex Aggregation for Analytics

```javascript
export const getTodoAnalytics = async (req, res, next) => {
  try {
    const db = getDB();
    
    const analytics = await db.collection('todos').aggregate([
      {
        $facet: {
          statusBreakdown: [
            { $group: { _id: '$completed', count: { $sum: 1 } } }
          ],
          priorityBreakdown: [
            { $group: { _id: '$priority', count: { $sum: 1 } } }
          ],
          recentActivity: [
            { $sort: { updatedAt: -1 } },
            { $limit: 5 },
            { $project: { title: 1, updatedAt: 1, completed: 1 } }
          ],
          completionRate: [
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                completed: {
                  $sum: { $cond: [{ $eq: ['$completed', true] }, 1, 0] }
                }
              }
            },
            {
              $project: {
                _id: 0,
                total: 1,
                completed: 1,
                rate: {
                  $multiply: [
                    { $divide: ['$completed', '$total'] },
                    100
                  ]
                }
              }
            }
          ]
        }
      }
    ]).toArray();
    
    res.status(200).json({
      success: true,
      data: analytics[0]
    });
  } catch (error) {
    next(error);
  }
};
```

#### Bulk Insert Multiple Todos

```javascript
export const bulkCreateTodos = async (req, res, next) => {
  try {
    const db = getDB();
    const { todos } = req.body;
    
    if (!todos || !Array.isArray(todos) || todos.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of todos'
      });
    }
    
    // Add timestamps to all todos
    const todosWithTimestamps = todos.map(todo => ({
      ...todo,
      completed: false,
      priority: todo.priority || 'medium',
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    const result = await db.collection('todos').insertMany(todosWithTimestamps);
    
    res.status(201).json({
      success: true,
      message: `${result.insertedCount} todos created`,
      insertedCount: result.insertedCount,
      insertedIds: result.insertedIds
    });
  } catch (error) {
    next(error);
  }
};
```

---

### 🎯 11. Key Features Implemented

| Feature | Endpoint | Method | Description |
|---------|----------|--------|-------------|
| List All | `/api/todos` | GET | Get all todos with filtering & pagination |
| Search | `/api/todos?search=term` | GET | Search in title and description |
| Get One | `/api/todos/:id` | GET | Get single todo by ID |
| Create | `/api/todos` | POST | Create new todo |
| Update | `/api/todos/:id` | PUT | Update todo |
| Delete | `/api/todos/:id` | DELETE | Delete todo |
| Toggle | `/api/todos/:id/toggle` | PATCH | Toggle completion status |
| Statistics | `/api/todos/stats` | GET | Get todo statistics |
| Bulk Delete | `/api/todos/completed` | DELETE | Delete all completed |
| Bulk Update | `/api/todos/bulk` | PATCH | Update multiple todos |

### 🔑 MongoDB Query Features Demonstrated

1. **Basic CRUD**: `insertOne()`, `find()`, `findOne()`, `findOneAndUpdate()`, `deleteOne()`
2. **Filtering**: Query by completion status, priority, search text using `$regex`
3. **Pagination**: Skip and limit for large datasets
4. **Sorting**: Multiple sort options (date, priority, due date)
5. **Aggregation**: Statistical queries using `aggregate()` with `$facet`, `$group`, `$sum`
6. **Indexing**: Performance optimization with compound and text indexes
7. **Validation**: Custom validation middleware (no schema required)
8. **Bulk Operations**: `insertMany()`, `deleteMany()`, `updateMany()`
9. **Text Search**: Full-text search using text indexes
10. **Date Operations**: Date comparisons and calculations with `$dateDiff`
11. **Projection**: Field selection and score calculation
12. **Conditional Logic**: Using `$cond` for computed fields

### 🔧 MongoDB Native Driver Benefits

- **Lightweight**: No ORM overhead, direct database access
- **Flexibility**: Full control over queries and operations
- **Performance**: Optimized for MongoDB operations
- **Latest Features**: Access to newest MongoDB features immediately
- **Simple**: Straightforward API without abstraction layers

---

### 🚀 Running the Application

```bash
# Install dependencies
npm install

# Create .env file with your MongoDB URI
echo "PORT=5000" > .env
echo "MONGO_URI=mongodb://localhost:27017" >> .env
echo "DB_NAME=todoapp" >> .env

# Start development server
npm run dev

# Start production server
npm start
```

### 📌 MongoDB Setup

**Local MongoDB:**
```bash
# Start MongoDB service
mongosh

# Create database and verify
use todoapp
db.todos.insertOne({ title: "Test Todo", completed: false })
db.todos.find()
```

**MongoDB Atlas (Cloud):**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update MONGO_URI in `.env` with your Atlas connection string

Your Todo CRUD API is now running at `http://localhost:5000`! 🎉

### 📋 Quick Test

```bash
# Test health endpoint
curl http://localhost:5000/health

# Create a todo
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"My First Todo","priority":"high"}'

# Get all todos
curl http://localhost:5000/api/todos
```
