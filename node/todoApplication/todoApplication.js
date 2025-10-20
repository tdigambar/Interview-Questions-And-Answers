// server.js
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'todoapp';
const COLLECTION_NAME = 'todos';

let db;
let todosCollection;

// MongoDB Connection
const connectDB = async () => {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ MongoDB Connected Successfully');
    
    db = client.db(DB_NAME);
    todosCollection = db.collection(COLLECTION_NAME);
    
    // Create indexes for better performance
    await todosCollection.createIndex({ title: 'text', description: 'text' });
    await todosCollection.createIndex({ completed: 1 });
    await todosCollection.createIndex({ priority: 1 });
    await todosCollection.createIndex({ createdAt: -1 });
    
    console.log('✅ Database indexes created');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

connectDB();

// Validation Functions
const validateTodo = (data) => {
  const errors = [];
  
  if (!data.title || data.title.trim().length === 0) {
    errors.push('Title is required');
  }
  
  if (data.title && data.title.trim().length < 3) {
    errors.push('Title must be at least 3 characters');
  }
  
  if (data.title && data.title.trim().length > 100) {
    errors.push('Title cannot exceed 100 characters');
  }
  
  if (data.description && data.description.length > 500) {
    errors.push('Description cannot exceed 500 characters');
  }
  
  if (data.priority && !['low', 'medium', 'high'].includes(data.priority)) {
    errors.push('Priority must be low, medium, or high');
  }
  
  return errors;
};

const isValidObjectId = (id) => {
  return ObjectId.isValid(id) && String(new ObjectId(id)) === id;
};

// ==================== ROUTES ====================

// 1. CREATE - Add new todo
app.post('/api/todos', async (req, res) => {
  try {
    const { title, description, priority, dueDate, tags } = req.body;

    // Validation
    const errors = validateTodo(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed',
        errors 
      });
    }

    const newTodo = {
      title: title.trim(),
      description: description?.trim() || '',
      completed: false,
      priority: priority || 'medium',
      dueDate: dueDate ? new Date(dueDate) : null,
      tags: tags || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await todosCollection.insertOne(newTodo);
    
    const savedTodo = {
      _id: result.insertedId,
      ...newTodo
    };

    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: savedTodo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating todo',
      error: error.message
    });
  }
});

// 2. READ - Get all todos with filtering, pagination, and search
app.get('/api/todos', async (req, res) => {
  try {
    const { 
      completed, 
      priority, 
      search, 
      sortBy = 'createdAt', 
      order = 'desc',
      page = 1,
      limit = 10 
    } = req.query;

    // Build query filter
    const filter = {};
    
    if (completed !== undefined) {
      filter.completed = completed === 'true';
    }
    
    if (priority) {
      filter.priority = priority;
    }
    
    if (search) {
      filter.$text = { $search: search };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Sort order
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions = { [sortBy]: sortOrder };
    
    // Execute query
    const todos = await todosCollection
      .find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();

    const total = await todosCollection.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: todos.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: todos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching todos',
      error: error.message
    });
  }
});

// 3. READ - Get single todo by ID
app.get('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid todo ID format'
      });
    }

    const todo = await todosCollection.findOne({ 
      _id: new ObjectId(id) 
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
    res.status(500).json({
      success: false,
      message: 'Error fetching todo',
      error: error.message
    });
  }
});

// 4. UPDATE - Update todo by ID
app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed, priority, dueDate, tags } = req.body;

    // Validate ObjectId
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid todo ID format'
      });
    }

    // Validation
    const errors = validateTodo(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed',
        errors 
      });
    }

    // Build update object
    const updateData = {
      updatedAt: new Date()
    };

    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (completed !== undefined) updateData.completed = completed;
    if (priority !== undefined) updateData.priority = priority;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (tags !== undefined) updateData.tags = tags;

    const result = await todosCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Todo updated successfully',
      data: result.value
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating todo',
      error: error.message
    });
  }
});

// 5. PATCH - Toggle todo completion status
app.patch('/api/todos/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid todo ID format'
      });
    }

    // First, get the current todo
    const todo = await todosCollection.findOne({ 
      _id: new ObjectId(id) 
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    // Toggle the completed status
    const result = await todosCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
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
      message: 'Todo status toggled successfully',
      data: result.value
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error toggling todo status',
      error: error.message
    });
  }
});

// 6. DELETE - Delete todo by ID
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid todo ID format'
      });
    }

    const result = await todosCollection.findOneAndDelete({ 
      _id: new ObjectId(id) 
    });

    if (!result.value) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully',
      data: result.value
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting todo',
      error: error.message
    });
  }
});

// 7. DELETE - Delete all completed todos
app.delete('/api/todos/completed/all', async (req, res) => {
  try {
    const result = await todosCollection.deleteMany({ 
      completed: true 
    });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} completed todo(s) deleted`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting completed todos',
      error: error.message
    });
  }
});

// 8. GET - Get statistics
app.get('/api/todos/stats/summary', async (req, res) => {
  try {
    const total = await todosCollection.countDocuments({});
    const completed = await todosCollection.countDocuments({ completed: true });
    const pending = await todosCollection.countDocuments({ completed: false });
    
    // Aggregation for priority statistics
    const byPriority = await todosCollection.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    // Convert array to object
    const priorityStats = byPriority.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: {
        total,
        completed,
        pending,
        byPriority: priorityStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

// 9. GET - Get overdue todos
app.get('/api/todos/overdue', async (req, res) => {
  try {
    const now = new Date();
    
    const overdueTodos = await todosCollection.find({
      completed: false,
      dueDate: { $lt: now, $ne: null }
    }).toArray();

    res.status(200).json({
      success: true,
      count: overdueTodos.length,
      data: overdueTodos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching overdue todos',
      error: error.message
    });
  }
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Server is running',
    database: db ? 'Connected' : 'Disconnected',
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 API available at http://localhost:${PORT}/api/todos`);
});

module.exports = app;
