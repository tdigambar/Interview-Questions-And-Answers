# Express.js Interview Questions and Answers

A comprehensive collection of Express.js interview questions covering basic to advanced concepts.

## Table of Contents

- [Basic Level](#basic-level)
- [Intermediate Level](#intermediate-level)
- [Advanced Level](#advanced-level)

---

## Basic Level

### 1. What is Express.js?

Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for building web and mobile applications. It's designed for building single-page, multi-page, and hybrid web applications and provides a thin layer of fundamental web application features.

### 2. What are the main features of Express.js?

- Fast and minimalist web framework
- Robust routing system
- Middleware support
- Template engine integration
- HTTP utility methods and middleware
- Content negotiation
- Easy integration with databases
- High performance

### 3. How do you install Express.js?

```bash
npm install express
```

### 4. What is middleware in Express.js?

Middleware functions are functions that have access to the request object (req), response object (res), and the next middleware function in the application's request-response cycle. They can execute code, modify req/res objects, end the request-response cycle, or call the next middleware.

### 5. What are the different types of middleware?

- Application-level middleware
- Router-level middleware
- Error-handling middleware
- Built-in middleware (express.static, express.json, express.urlencoded)
- Third-party middleware

---

## Intermediate Level

### 6. How do you create a basic Express server?

```javascript
const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 7. What is the difference between app.get() and app.use()?

- **app.get()** is used for handling GET requests to a specific route
- **app.use()** is used for mounting middleware functions and can handle all HTTP methods. It's typically used for middleware that should run for all routes or a specific path prefix.

### 8. How do you handle different HTTP methods in Express?

```javascript
app.get('/users', (req, res) => { /* GET */ });
app.post('/users', (req, res) => { /* POST */ });
app.put('/users/:id', (req, res) => { /* PUT */ });
app.delete('/users/:id', (req, res) => { /* DELETE */ });
app.patch('/users/:id', (req, res) => { /* PATCH */ });
```

### 9. What are route parameters and how do you access them?

Route parameters are named URL segments used to capture values. They're accessed via `req.params`.

```javascript
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  res.send(`User ID: ${userId}`);
});
```

### 10. How do you access query parameters?

Query parameters are accessed via `req.query`.

```javascript
// URL: /search?name=John&age=30
app.get('/search', (req, res) => {
  const { name, age } = req.query;
  res.send(`Name: ${name}, Age: ${age}`);
});
```

### 11. How do you parse JSON request bodies?

```javascript
app.use(express.json()); // Built-in middleware

app.post('/data', (req, res) => {
  console.log(req.body);
  res.json({ received: req.body });
});
```

### 12. What is the difference between res.send() and res.json()?

- **res.send()** can send various types of responses (string, object, buffer, etc.)
- **res.json()** explicitly sends a JSON response and sets the Content-Type header to application/json

### 13. How do you create custom middleware?

```javascript
const myMiddleware = (req, res, next) => {
  console.log('Middleware executed');
  req.customData = 'Some data';
  next(); // Pass control to next middleware
};

app.use(myMiddleware);
```

### 14. What is Express Router and why use it?

Express Router is a mini-application that provides routing functionality. It helps organize routes into separate modules for better code organization.

```javascript
const router = express.Router();

router.get('/profile', (req, res) => {
  res.send('User profile');
});

app.use('/user', router); // Mounts at /user/profile
```

---

## Advanced Level

### 15. How do you handle errors in Express?

```javascript
// Error-handling middleware (must have 4 parameters)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: err.message
  });
});

// Triggering errors
app.get('/error', (req, res, next) => {
  const error = new Error('Something went wrong');
  next(error); // Pass to error handler
});
```

### 16. What is the difference between app.use() and app.all()?

- **app.use()** works with any path that begins with the specified path
- **app.all()** matches the exact path for all HTTP methods

### 17. How do you serve static files?

```javascript
app.use(express.static('public'));
// Files in 'public' folder are now accessible
// e.g., public/images/logo.png -> http://localhost:3000/images/logo.png
```

### 18. What are some security best practices for Express applications?

- Use helmet.js for setting security headers
- Implement rate limiting
- Validate and sanitize input
- Use HTTPS
- Keep dependencies updated
- Implement proper authentication/authorization
- Use environment variables for sensitive data
- Implement CORS properly
- Prevent SQL injection and XSS attacks

### 19. How do you implement authentication middleware?

```javascript
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  // Verify token (simplified)
  if (token === 'valid-token') {
    req.user = { id: 1, name: 'John' };
    next();
  } else {
    res.status(403).json({ error: 'Invalid token' });
  }
};

app.get('/protected', authenticate, (req, res) => {
  res.json({ message: 'Protected data', user: req.user });
});
```

### 20. How do you handle async/await in Express routes?

```javascript
// Wrap async functions to catch errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.get('/users', asyncHandler(async (req, res) => {
  const users = await getUsersFromDB();
  res.json(users);
}));
```

### 21. What is the purpose of next() in middleware?

`next()` passes control to the next middleware function. If not called, the request will hang. You can also pass an error to `next()` to trigger error-handling middleware: `next(error)`.

### 22. How do you implement CORS in Express?

```javascript
const cors = require('cors');

// Enable all CORS requests
app.use(cors());

// Or configure specific origins
app.use(cors({
  origin: 'https://example.com',
  methods: ['GET', 'POST'],
  credentials: true
}));
```

### 23. What is the difference between res.redirect() and res.render()?

- **res.redirect()** sends an HTTP redirect response to a different URL
- **res.render()** renders a view template and sends the rendered HTML

### 24. How do you handle file uploads in Express?

```javascript
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), (req, res) => {
  console.log(req.file);
  res.send('File uploaded successfully');
});
```

### 25. What are some popular Express middleware packages?

- **body-parser** (now built-in)
- **cors**
- **helmet**
- **morgan** (logging)
- **express-validator**
- **multer** (file uploads)
- **compression**
- **cookie-parser**
- **express-session**

---

## Conclusion

These questions cover the fundamentals to advanced concepts and should help you prepare for an Express.js interview! The topics range from basic server setup to advanced middleware patterns, security considerations, and best practices for building robust Express.js applications.