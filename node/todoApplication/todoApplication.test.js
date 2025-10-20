// todoApplication.test.js
const request = require('supertest');
const { MongoClient, ObjectId } = require('mongodb');
const app = require('./todoApplication');

// Test database configuration
const TEST_MONGODB_URI = process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017';
const TEST_DB_NAME = 'todoapp_test';

let connection;
let db;
let todosCollection;

// Setup: Connect to test database before all tests
beforeAll(async () => {
  connection = await MongoClient.connect(TEST_MONGODB_URI);
  db = connection.db(TEST_DB_NAME);
  todosCollection = db.collection('todos');
});

// Cleanup: Clear collection before each test
beforeEach(async () => {
  await todosCollection.deleteMany({});
});

// Teardown: Close connection after all tests
afterAll(async () => {
  await todosCollection.deleteMany({});
  await connection.close();
});

// Helper function to create a sample todo
const createSampleTodo = async (overrides = {}) => {
  const todo = {
    title: 'Test Todo',
    description: 'Test Description',
    completed: false,
    priority: 'medium',
    dueDate: new Date('2025-12-31'),
    tags: ['test'],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  };
  
  const result = await todosCollection.insertOne(todo);
  return { ...todo, _id: result.insertedId };
};

describe('Todo Application API Tests', () => {
  
  // ==================== CREATE TESTS ====================
  describe('POST /api/todos - Create Todo', () => {
    
    test('should create a new todo successfully', async () => {
      const todoData = {
        title: 'Buy groceries',
        description: 'Milk, Bread, Eggs',
        priority: 'high',
        dueDate: '2025-11-01',
        tags: ['shopping', 'personal']
      };
      
      const response = await request(app)
        .post('/api/todos')
        .send(todoData)
        .expect('Content-Type', /json/)
        .expect(201);
      
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Todo created successfully');
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data.title).toBe(todoData.title);
      expect(response.body.data.description).toBe(todoData.description);
      expect(response.body.data.completed).toBe(false);
      expect(response.body.data.priority).toBe('high');
    });
    
    test('should create todo with minimal required fields', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ title: 'Simple Todo' })
        .expect(201);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Simple Todo');
      expect(response.body.data.priority).toBe('medium'); // default
      expect(response.body.data.completed).toBe(false);
    });
    
    test('should fail when title is missing', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ description: 'No title' })
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
      expect(response.body.errors).toContain('Title is required');
    });
    
    test('should fail when title is too short', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ title: 'ab' })
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toContain('Title must be at least 3 characters');
    });
    
    test('should fail when title exceeds 100 characters', async () => {
      const longTitle = 'a'.repeat(101);
      const response = await request(app)
        .post('/api/todos')
        .send({ title: longTitle })
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toContain('Title cannot exceed 100 characters');
    });
    
    test('should fail when description exceeds 500 characters', async () => {
      const longDescription = 'a'.repeat(501);
      const response = await request(app)
        .post('/api/todos')
        .send({ 
          title: 'Valid Title',
          description: longDescription 
        })
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toContain('Description cannot exceed 500 characters');
    });
    
    test('should fail with invalid priority', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ 
          title: 'Valid Title',
          priority: 'urgent' // invalid
        })
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toContain('Priority must be low, medium, or high');
    });
    
  });
  
  // ==================== READ TESTS ====================
  describe('GET /api/todos - Get All Todos', () => {
    
    beforeEach(async () => {
      // Create sample todos
      await createSampleTodo({ title: 'Todo 1', priority: 'high', completed: false });
      await createSampleTodo({ title: 'Todo 2', priority: 'low', completed: true });
      await createSampleTodo({ title: 'Todo 3', priority: 'medium', completed: false });
    });
    
    test('should get all todos', async () => {
      const response = await request(app)
        .get('/api/todos')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(3);
      expect(response.body.total).toBe(3);
      expect(response.body.data).toHaveLength(3);
    });
    
    test('should filter todos by completion status', async () => {
      const response = await request(app)
        .get('/api/todos?completed=true')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(1);
      expect(response.body.data[0].completed).toBe(true);
    });
    
    test('should filter todos by priority', async () => {
      const response = await request(app)
        .get('/api/todos?priority=high')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(1);
      expect(response.body.data[0].priority).toBe('high');
    });
    
    test('should support pagination', async () => {
      const response = await request(app)
        .get('/api/todos?page=1&limit=2')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(response.body.page).toBe(1);
      expect(response.body.totalPages).toBe(2);
    });
    
    test('should support sorting', async () => {
      const response = await request(app)
        .get('/api/todos?sortBy=priority&order=asc')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(3);
    });
    
    test('should search todos by text', async () => {
      await createSampleTodo({ title: 'Buy groceries', description: 'milk and bread' });
      
      const response = await request(app)
        .get('/api/todos?search=groceries')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBeGreaterThanOrEqual(1);
    });
    
  });
  
  describe('GET /api/todos/:id - Get Single Todo', () => {
    
    test('should get a todo by valid ID', async () => {
      const todo = await createSampleTodo({ title: 'Specific Todo' });
      
      const response = await request(app)
        .get(`/api/todos/${todo._id}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Specific Todo');
      expect(response.body.data._id).toBeDefined();
    });
    
    test('should return 404 for non-existent todo', async () => {
      const fakeId = new ObjectId();
      const response = await request(app)
        .get(`/api/todos/${fakeId}`)
        .expect(404);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Todo not found');
    });
    
    test('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .get('/api/todos/invalid-id')
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid todo ID format');
    });
    
  });
  
  // ==================== UPDATE TESTS ====================
  describe('PUT /api/todos/:id - Update Todo', () => {
    
    test('should update a todo successfully', async () => {
      const todo = await createSampleTodo({ title: 'Original Title' });
      
      const updateData = {
        title: 'Updated Title',
        description: 'Updated Description',
        completed: true,
        priority: 'high'
      };
      
      const response = await request(app)
        .put(`/api/todos/${todo._id}`)
        .send(updateData)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Todo updated successfully');
      expect(response.body.data.title).toBe('Updated Title');
      expect(response.body.data.completed).toBe(true);
      expect(response.body.data.priority).toBe('high');
    });
    
    test('should update only specified fields', async () => {
      const todo = await createSampleTodo({ 
        title: 'Original Title',
        priority: 'low' 
      });
      
      const response = await request(app)
        .put(`/api/todos/${todo._id}`)
        .send({ title: 'Only Title Updated' })
        .expect(200);
      
      expect(response.body.data.title).toBe('Only Title Updated');
    });
    
    test('should return 404 for non-existent todo', async () => {
      const fakeId = new ObjectId();
      const response = await request(app)
        .put(`/api/todos/${fakeId}`)
        .send({ title: 'Updated Title' })
        .expect(404);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Todo not found');
    });
    
    test('should validate updated data', async () => {
      const todo = await createSampleTodo();
      
      const response = await request(app)
        .put(`/api/todos/${todo._id}`)
        .send({ title: 'ab' }) // too short
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });
    
  });
  
  describe('PATCH /api/todos/:id/toggle - Toggle Completion', () => {
    
    test('should toggle todo completion from false to true', async () => {
      const todo = await createSampleTodo({ completed: false });
      
      const response = await request(app)
        .patch(`/api/todos/${todo._id}/toggle`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Todo status toggled successfully');
      expect(response.body.data.completed).toBe(true);
    });
    
    test('should toggle todo completion from true to false', async () => {
      const todo = await createSampleTodo({ completed: true });
      
      const response = await request(app)
        .patch(`/api/todos/${todo._id}/toggle`)
        .expect(200);
      
      expect(response.body.data.completed).toBe(false);
    });
    
    test('should return 404 for non-existent todo', async () => {
      const fakeId = new ObjectId();
      const response = await request(app)
        .patch(`/api/todos/${fakeId}/toggle`)
        .expect(404);
      
      expect(response.body.success).toBe(false);
    });
    
  });
  
  // ==================== DELETE TESTS ====================
  describe('DELETE /api/todos/:id - Delete Todo', () => {
    
    test('should delete a todo successfully', async () => {
      const todo = await createSampleTodo({ title: 'To Be Deleted' });
      
      const response = await request(app)
        .delete(`/api/todos/${todo._id}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Todo deleted successfully');
      
      // Verify it's actually deleted
      const deleted = await todosCollection.findOne({ _id: todo._id });
      expect(deleted).toBeNull();
    });
    
    test('should return 404 for non-existent todo', async () => {
      const fakeId = new ObjectId();
      const response = await request(app)
        .delete(`/api/todos/${fakeId}`)
        .expect(404);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Todo not found');
    });
    
    test('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .delete('/api/todos/invalid-id')
        .expect(400);
      
      expect(response.body.success).toBe(false);
    });
    
  });
  
  describe('DELETE /api/todos/completed/all - Delete All Completed', () => {
    
    test('should delete all completed todos', async () => {
      await createSampleTodo({ completed: true });
      await createSampleTodo({ completed: true });
      await createSampleTodo({ completed: false });
      
      const response = await request(app)
        .delete('/api/todos/completed/all')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.deletedCount).toBe(2);
      
      // Verify only incomplete todos remain
      const remaining = await todosCollection.find({}).toArray();
      expect(remaining).toHaveLength(1);
      expect(remaining[0].completed).toBe(false);
    });
    
    test('should return 0 when no completed todos exist', async () => {
      await createSampleTodo({ completed: false });
      
      const response = await request(app)
        .delete('/api/todos/completed/all')
        .expect(200);
      
      expect(response.body.deletedCount).toBe(0);
    });
    
  });
  
  // ==================== STATISTICS TESTS ====================
  describe('GET /api/todos/stats/summary - Get Statistics', () => {
    
    test('should return correct statistics', async () => {
      await createSampleTodo({ completed: true, priority: 'high' });
      await createSampleTodo({ completed: false, priority: 'low' });
      await createSampleTodo({ completed: false, priority: 'high' });
      
      const response = await request(app)
        .get('/api/todos/stats/summary')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.total).toBe(3);
      expect(response.body.data.completed).toBe(1);
      expect(response.body.data.pending).toBe(2);
      expect(response.body.data.byPriority).toHaveProperty('high');
      expect(response.body.data.byPriority).toHaveProperty('low');
    });
    
    test('should return zero statistics for empty database', async () => {
      const response = await request(app)
        .get('/api/todos/stats/summary')
        .expect(200);
      
      expect(response.body.data.total).toBe(0);
      expect(response.body.data.completed).toBe(0);
      expect(response.body.data.pending).toBe(0);
    });
    
  });
  
  describe('GET /api/todos/overdue - Get Overdue Todos', () => {
    
    test('should return overdue incomplete todos', async () => {
      const pastDate = new Date('2020-01-01');
      const futureDate = new Date('2030-01-01');
      
      await createSampleTodo({ 
        title: 'Overdue Todo',
        completed: false, 
        dueDate: pastDate 
      });
      await createSampleTodo({ 
        title: 'Future Todo',
        completed: false, 
        dueDate: futureDate 
      });
      await createSampleTodo({ 
        title: 'Completed Overdue',
        completed: true, 
        dueDate: pastDate 
      });
      
      const response = await request(app)
        .get('/api/todos/overdue')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(1);
      expect(response.body.data[0].title).toBe('Overdue Todo');
    });
    
    test('should return empty array when no overdue todos', async () => {
      const futureDate = new Date('2030-01-01');
      await createSampleTodo({ dueDate: futureDate });
      
      const response = await request(app)
        .get('/api/todos/overdue')
        .expect(200);
      
      expect(response.body.count).toBe(0);
      expect(response.body.data).toHaveLength(0);
    });
    
  });
  
  // ==================== HEALTH CHECK TEST ====================
  describe('GET /health - Health Check', () => {
    
    test('should return server health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Server is running');
      expect(response.body).toHaveProperty('timestamp');
    });
    
  });
  
  // ==================== 404 TESTS ====================
  describe('404 Handler', () => {
    
    test('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/api/unknown-route')
        .expect(404);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Route not found');
    });
    
  });
  
  // ==================== EDGE CASES ====================
  describe('Edge Cases', () => {
    
    test('should handle empty string title after trim', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ title: '   ' })
        .expect(400);
      
      expect(response.body.success).toBe(false);
    });
    
    test('should trim whitespace from title and description', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ 
          title: '  Todo with spaces  ',
          description: '  Description with spaces  '
        })
        .expect(201);
      
      expect(response.body.data.title).toBe('Todo with spaces');
      expect(response.body.data.description).toBe('Description with spaces');
    });
    
    test('should handle null dueDate', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ 
          title: 'Todo without due date',
          dueDate: null
        })
        .expect(201);
      
      expect(response.body.data.dueDate).toBeNull();
    });
    
    test('should handle empty tags array', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ 
          title: 'Todo with empty tags',
          tags: []
        })
        .expect(201);
      
      expect(response.body.data.tags).toEqual([]);
    });
    
  });
  
});

