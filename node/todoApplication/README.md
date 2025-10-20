# Todo Application API

A RESTful CRUD API for managing todos built with Express.js and MongoDB Native Driver.

## Features

- ✅ Complete CRUD operations (Create, Read, Update, Delete)
- ✅ Advanced filtering and pagination
- ✅ Text search functionality
- ✅ Priority-based organization
- ✅ Statistics and analytics
- ✅ Overdue todo tracking
- ✅ Comprehensive test coverage

## Installation

```bash
# Install dependencies
npm install

# Create .env file
touch .env

# Add the following to .env:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017
```

## Running the Application

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/todos` | Create a new todo |
| GET | `/api/todos` | Get all todos (with filtering & pagination) |
| GET | `/api/todos/:id` | Get a single todo by ID |
| PUT | `/api/todos/:id` | Update a todo |
| PATCH | `/api/todos/:id/toggle` | Toggle todo completion status |
| DELETE | `/api/todos/:id` | Delete a todo |
| DELETE | `/api/todos/completed/all` | Delete all completed todos |
| GET | `/api/todos/stats/summary` | Get todo statistics |
| GET | `/api/todos/overdue` | Get overdue todos |
| GET | `/health` | Health check |

## API Examples

### Create a Todo
```bash
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Buy groceries",
    "description": "Milk, Bread, Eggs",
    "priority": "high",
    "dueDate": "2025-11-01",
    "tags": ["shopping"]
  }'
```

### Get All Todos with Filters
```bash
# Get all todos
curl http://localhost:5000/api/todos

# Filter by completion status
curl http://localhost:5000/api/todos?completed=false

# Filter by priority
curl http://localhost:5000/api/todos?priority=high

# Search todos
curl http://localhost:5000/api/todos?search=groceries

# Pagination
curl http://localhost:5000/api/todos?page=1&limit=10

# Sort by priority
curl http://localhost:5000/api/todos?sortBy=priority&order=desc
```

### Update a Todo
```bash
curl -X PUT http://localhost:5000/api/todos/<todo-id> \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated title",
    "completed": true
  }'
```

### Toggle Completion
```bash
curl -X PATCH http://localhost:5000/api/todos/<todo-id>/toggle
```

### Delete a Todo
```bash
curl -X DELETE http://localhost:5000/api/todos/<todo-id>
```

### Get Statistics
```bash
curl http://localhost:5000/api/todos/stats/summary
```

## Running Tests

This application includes comprehensive test coverage using Jest and Supertest.

### Prerequisites for Testing

Make sure MongoDB is running locally on port 27017 before running tests.

### Test Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (useful during development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Coverage

The test suite covers:
- ✅ All CRUD operations (Create, Read, Update, Delete)
- ✅ Input validation for all fields
- ✅ Error handling (404, 400, 500)
- ✅ Edge cases (empty strings, null values, etc.)
- ✅ Pagination and filtering
- ✅ Text search functionality
- ✅ Statistics and analytics endpoints
- ✅ Overdue todo detection
- ✅ Toggle completion functionality
- ✅ Bulk delete operations

### Test Structure

```
todoApplication.test.js
├── CREATE Tests
│   ├── Create todo successfully
│   ├── Create with minimal fields
│   ├── Validation errors
│   └── Edge cases
├── READ Tests
│   ├── Get all todos
│   ├── Filtering (by status, priority)
│   ├── Pagination
│   ├── Sorting
│   ├── Search
│   └── Get single todo
├── UPDATE Tests
│   ├── Update todo successfully
│   ├── Partial updates
│   ├── Validation
│   └── Error handling
├── DELETE Tests
│   ├── Delete single todo
│   ├── Delete all completed
│   └── Error handling
├── STATISTICS Tests
│   ├── Get summary statistics
│   └── Get overdue todos
└── UTILITY Tests
    ├── Health check
    ├── 404 handler
    └── Edge cases
```

### Example Test Output

```bash
npm test

PASS  ./todoApplication.test.js
  Todo Application API Tests
    POST /api/todos - Create Todo
      ✓ should create a new todo successfully (123ms)
      ✓ should create todo with minimal required fields (45ms)
      ✓ should fail when title is missing (34ms)
      ✓ should fail when title is too short (28ms)
      ✓ should fail when title exceeds 100 characters (31ms)
    GET /api/todos - Get All Todos
      ✓ should get all todos (67ms)
      ✓ should filter todos by completion status (52ms)
      ✓ should filter todos by priority (48ms)
    ...

Test Suites: 1 passed, 1 total
Tests:       45 passed, 45 total
Coverage:    95%
```

### Coverage Report

After running `npm run test:coverage`, a detailed HTML coverage report will be generated in the `coverage` directory. Open `coverage/index.html` in your browser to view it.

## Data Schema

### Todo Object

```javascript
{
  "_id": ObjectId,              // Auto-generated MongoDB ID
  "title": String,              // Required, 3-100 characters
  "description": String,        // Optional, max 500 characters
  "completed": Boolean,         // Default: false
  "priority": String,           // "low" | "medium" | "high", Default: "medium"
  "dueDate": Date,              // Optional
  "tags": Array<String>,        // Optional
  "createdAt": Date,            // Auto-generated
  "updatedAt": Date             // Auto-updated
}
```

## Validation Rules

- **title**: Required, 3-100 characters, trimmed
- **description**: Optional, max 500 characters, trimmed
- **priority**: Must be "low", "medium", or "high"
- **dueDate**: Optional, valid date
- **tags**: Optional, array of strings

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"]
}
```

## Technologies Used

- **Express.js** - Web framework
- **MongoDB** - Database
- **MongoDB Native Driver** - Database driver (no Mongoose)
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **Jest** - Testing framework
- **Supertest** - HTTP assertions for testing

## Project Structure

```
todoApplication/
├── todoApplication.js          # Main application file
├── todoApplication.test.js     # Test suite
├── package.json                # Dependencies and scripts
├── README.md                   # This file
└── .env                        # Environment variables (not in git)
```

## Development Tips

1. **Use nodemon for development**: `npm run dev` automatically restarts the server on file changes

2. **Run tests during development**: `npm run test:watch` runs tests automatically when files change

3. **Check test coverage**: `npm run test:coverage` shows which parts of code are tested

4. **Environment variables**: Copy `.env.example` to `.env` and adjust as needed

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongosh` or check system services
- Verify connection string in `.env` file
- Check MongoDB port (default: 27017)

### Test Failures
- Ensure test database is accessible
- Clear test database before running tests
- Check for port conflicts

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

## License

MIT

