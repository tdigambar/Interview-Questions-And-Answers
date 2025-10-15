# HTML Interview Questions and Answers

A comprehensive collection of HTML interview questions covering basic to advanced concepts for web development interviews.

## Table of Contents

- [Basic Level](#basic-level)
- [Intermediate Level](#intermediate-level)
- [Advanced Level](#advanced-level)

---

## Basic Level

### 1. What is HTML?

HTML (HyperText Markup Language) is the standard markup language used to create and structure content on the World Wide Web. It uses tags to define elements and their content, providing the basic structure for web pages.

### 2. What is the difference between HTML and XHTML?

- **HTML**: More lenient with syntax, allows some tags to be unclosed, case-insensitive
- **XHTML**: Stricter syntax, all tags must be properly closed, case-sensitive, follows XML rules

### 3. What are HTML tags and attributes?

**Tags**: HTML tags are keywords surrounded by angle brackets that define elements.
```html
<p>This is a paragraph</p>
```

**Attributes**: Provide additional information about HTML elements.
```html
<img src="image.jpg" alt="Description" width="300" height="200">
```

### 4. What is the basic structure of an HTML document?

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document Title</title>
</head>
<body>
    <!-- Content goes here -->
</body>
</html>
```

### 5. What is the purpose of the DOCTYPE declaration?

The DOCTYPE declaration tells the browser which version of HTML the document is written in. It ensures the browser renders the page in standards mode rather than quirks mode.

### 6. What are semantic HTML elements?

Semantic elements clearly describe their meaning in a human- and machine-readable way. Examples include:
- `<header>` - Defines a header for a document or section
- `<nav>` - Defines navigation links
- `<main>` - Defines the main content
- `<section>` - Defines a section in a document
- `<article>` - Defines an article
- `<aside>` - Defines content aside from the main content
- `<footer>` - Defines a footer for a document or section

### 7. What is the difference between `<div>` and `<span>`?

- **`<div>`**: Block-level element, used for grouping larger sections of content
- **`<span>`**: Inline element, used for grouping smaller pieces of content within a line

### 8. How do you create links in HTML?

```html
<!-- External link -->
<a href="https://www.example.com">Visit Example</a>

<!-- Internal link -->
<a href="#section1">Go to Section 1</a>

<!-- Email link -->
<a href="mailto:someone@example.com">Send Email</a>

<!-- Download link -->
<a href="document.pdf" download>Download PDF</a>
```

### 9. What are the different types of lists in HTML?

**Ordered List (`<ol>`)**:
```html
<ol>
    <li>First item</li>
    <li>Second item</li>
    <li>Third item</li>
</ol>
```

**Unordered List (`<ul>`)**:
```html
<ul>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
</ul>
```

**Definition List (`<dl>`)**:
```html
<dl>
    <dt>Term</dt>
    <dd>Definition of the term</dd>
</dl>
```

### 10. How do you create tables in HTML?

```html
<table>
    <thead>
        <tr>
            <th>Header 1</th>
            <th>Header 2</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Data 1</td>
            <td>Data 2</td>
        </tr>
    </tbody>
    <tfoot>
        <tr>
            <td>Footer 1</td>
            <td>Footer 2</td>
        </tr>
    </tfoot>
</table>
```

---

## Intermediate Level

### 11. What is the difference between `<strong>` and `<b>` tags?

- **`<strong>`**: Semantic tag indicating strong importance, typically rendered as bold
- **`<b>`**: Presentational tag that makes text bold without semantic meaning

### 12. What are HTML forms and their elements?

HTML forms are used to collect user input. Common form elements include:

```html
<form action="/submit" method="POST">
    <label for="name">Name:</label>
    <input type="text" id="name" name="name" required>
    
    <label for="email">Email:</label>
    <input type="email" id="email" name="email" required>
    
    <label for="password">Password:</label>
    <input type="password" id="password" name="password">
    
    <label for="age">Age:</label>
    <input type="number" id="age" name="age" min="1" max="120">
    
    <label for="country">Country:</label>
    <select id="country" name="country">
        <option value="us">United States</option>
        <option value="uk">United Kingdom</option>
    </select>
    
    <label>
        <input type="checkbox" name="newsletter" value="yes">
        Subscribe to newsletter
    </label>
    
    <label>
        <input type="radio" name="gender" value="male">
        Male
    </label>
    
    <label for="message">Message:</label>
    <textarea id="message" name="message" rows="4" cols="50"></textarea>
    
    <button type="submit">Submit</button>
</form>
```

### 13. What are the different input types in HTML5?

- `text` - Single-line text input
- `email` - Email address input
- `password` - Password input (hidden)
- `number` - Numeric input
- `tel` - Telephone number input
- `url` - URL input
- `date` - Date picker
- `time` - Time picker
- `datetime-local` - Date and time picker
- `month` - Month picker
- `week` - Week picker
- `color` - Color picker
- `range` - Slider control
- `file` - File upload
- `checkbox` - Checkbox
- `radio` - Radio button
- `submit` - Submit button
- `reset` - Reset button
- `button` - Generic button
- `hidden` - Hidden input

### 14. What is the purpose of the `alt` attribute in images?

The `alt` attribute provides alternative text for images, which is important for:
- Accessibility (screen readers)
- SEO (search engine optimization)
- Fallback when images fail to load
- Better user experience

```html
<img src="photo.jpg" alt="A beautiful sunset over the mountains">
```

### 15. What are HTML5 semantic elements and their benefits?

HTML5 introduced semantic elements that improve:
- **Accessibility**: Screen readers can better understand content structure
- **SEO**: Search engines can better index content
- **Maintainability**: Code is more readable and organized

Key semantic elements:
- `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`
- `<figure>`, `<figcaption>`
- `<time>`, `<mark>`, `<progress>`, `<meter>`

### 16. What is the difference between `<iframe>` and `<embed>`?

- **`<iframe>`**: Embeds another HTML document within the current document
- **`<embed>`**: Embeds external content like plugins, media, or applications

```html
<!-- iframe example -->
<iframe src="https://www.example.com" width="800" height="600"></iframe>

<!-- embed example -->
<embed src="video.swf" type="application/x-shockwave-flash">
```

### 17. How do you create responsive images in HTML?

```html
<!-- Using srcset for different screen densities -->
<img src="image-1x.jpg" 
     srcset="image-1x.jpg 1x, image-2x.jpg 2x, image-3x.jpg 3x" 
     alt="Responsive image">

<!-- Using picture element for different screen sizes -->
<picture>
    <source media="(min-width: 800px)" srcset="large.jpg">
    <source media="(min-width: 400px)" srcset="medium.jpg">
    <img src="small.jpg" alt="Responsive image">
</picture>
```

### 18. What are HTML5 data attributes?

Data attributes allow you to store custom data on HTML elements:

```html
<div data-user-id="123" data-role="admin" data-toggle="modal">
    User content
</div>

<script>
    const element = document.querySelector('div');
    console.log(element.dataset.userId); // "123"
    console.log(element.dataset.role);   // "admin"
</script>
```

### 19. How do you create accessible forms?

```html
<form>
    <!-- Proper label association -->
    <label for="username">Username:</label>
    <input type="text" id="username" name="username" required 
           aria-describedby="username-help">
    <div id="username-help">Enter your username</div>
    
    <!-- Fieldset for grouped inputs -->
    <fieldset>
        <legend>Contact Information</legend>
        <label for="phone">Phone:</label>
        <input type="tel" id="phone" name="phone">
    </fieldset>
    
    <!-- Error handling -->
    <label for="email">Email:</label>
    <input type="email" id="email" name="email" 
           aria-invalid="true" aria-describedby="email-error">
    <div id="email-error" role="alert">Please enter a valid email</div>
</form>
```

### 20. What is the purpose of meta tags?

Meta tags provide metadata about the HTML document:

```html
<head>
    <!-- Character encoding -->
    <meta charset="UTF-8">
    
    <!-- Viewport for responsive design -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Page description for SEO -->
    <meta name="description" content="Page description for search engines">
    
    <!-- Keywords (less important now) -->
    <meta name="keywords" content="HTML, CSS, JavaScript">
    
    <!-- Author -->
    <meta name="author" content="John Doe">
    
    <!-- Open Graph for social media -->
    <meta property="og:title" content="Page Title">
    <meta property="og:description" content="Page description">
    <meta property="og:image" content="image.jpg">
</head>
```

---

## Advanced Level

### 21. What is the difference between HTML4 and HTML5?

**HTML4**:
- Limited semantic elements
- Required plugins for multimedia
- Less form validation
- No offline support

**HTML5**:
- Rich semantic elements
- Native multimedia support (`<video>`, `<audio>`)
- Enhanced form validation
- Offline support (localStorage, service workers)
- Canvas and SVG support
- Geolocation API
- Web Workers

### 22. How do you implement HTML5 offline functionality?

```html
<!DOCTYPE html>
<html manifest="app.manifest">
<head>
    <title>Offline App</title>
</head>
<body>
    <!-- App content -->
</body>
</html>
```

**app.manifest**:
```
CACHE MANIFEST
# Version 1.0

CACHE:
index.html
styles.css
script.js
images/logo.png

NETWORK:
*

FALLBACK:
/ offline.html
```

### 23. What are HTML5 APIs and how do you use them?

**Geolocation API**:
```javascript
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        console.log("Latitude: " + position.coords.latitude);
        console.log("Longitude: " + position.coords.longitude);
    });
}
```

**Local Storage**:
```javascript
// Store data
localStorage.setItem('username', 'john');

// Retrieve data
const username = localStorage.getItem('username');

// Remove data
localStorage.removeItem('username');
```

**Canvas API**:
```html
<canvas id="myCanvas" width="200" height="100"></canvas>
<script>
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'red';
    ctx.fillRect(10, 10, 50, 50);
</script>
```

### 24. How do you implement HTML5 drag and drop?

```html
<div id="dropZone" ondrop="drop(event)" ondragover="allowDrop(event)">
    Drop files here
</div>

<script>
function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev) {
    ev.preventDefault();
    const files = ev.dataTransfer.files;
    // Handle dropped files
}
</script>
```

### 25. What is the difference between `<canvas>` and `<svg>`?

**Canvas**:
- Raster-based (pixel-based)
- JavaScript-driven
- Better for games and animations
- No DOM elements
- Performance degrades with many objects

**SVG**:
- Vector-based
- XML-based
- Better for scalable graphics
- DOM elements (accessible)
- Better for simple graphics and icons

### 26. How do you implement HTML5 video and audio?

```html
<!-- Video with multiple sources -->
<video controls width="640" height="360">
    <source src="video.mp4" type="video/mp4">
    <source src="video.webm" type="video/webm">
    <p>Your browser doesn't support HTML5 video.</p>
</video>

<!-- Audio with multiple sources -->
<audio controls>
    <source src="audio.mp3" type="audio/mpeg">
    <source src="audio.ogg" type="audio/ogg">
    <p>Your browser doesn't support HTML5 audio.</p>
</audio>
```

### 27. What are Web Components and how do you create them?

Web Components allow you to create reusable custom elements:

```html
<!-- Define custom element -->
<script>
class MyComponent extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = '<p>Hello from custom element!</p>';
    }
}

customElements.define('my-component', MyComponent);
</script>

<!-- Use custom element -->
<my-component></my-component>
```

### 28. How do you implement HTML5 form validation?

```html
<form>
    <!-- Required field -->
    <input type="text" required>
    
    <!-- Pattern validation -->
    <input type="text" pattern="[A-Za-z]{3}" title="Three letters only">
    
    <!-- Length validation -->
    <input type="text" minlength="3" maxlength="10">
    
    <!-- Range validation -->
    <input type="number" min="1" max="100">
    
    <!-- Email validation -->
    <input type="email" required>
    
    <!-- URL validation -->
    <input type="url">
    
    <!-- Custom validation -->
    <input type="text" id="username" oninput="validateUsername(this)">
    
    <button type="submit">Submit</button>
</form>

<script>
function validateUsername(input) {
    if (input.value.length < 3) {
        input.setCustomValidity('Username must be at least 3 characters');
    } else {
        input.setCustomValidity('');
    }
}
</script>
```

### 29. What is the difference between `<script>`, `<script async>`, and `<script defer>`?

- **`<script>`**: Blocks HTML parsing, executes immediately
- **`<script async>`**: Downloads in parallel, executes as soon as downloaded
- **`<script defer>`**: Downloads in parallel, executes after HTML parsing is complete

```html
<!-- Blocking -->
<script src="script1.js"></script>

<!-- Async -->
<script src="script2.js" async></script>

<!-- Defer -->
<script src="script3.js" defer></script>
```

### 30. How do you implement HTML5 microdata?

Microdata provides a way to embed machine-readable data in HTML:

```html
<div itemscope itemtype="https://schema.org/Person">
    <h1 itemprop="name">John Doe</h1>
    <p itemprop="jobTitle">Software Developer</p>
    <p itemprop="email">john@example.com</p>
    <div itemprop="address" itemscope itemtype="https://schema.org/PostalAddress">
        <span itemprop="streetAddress">123 Main St</span>
        <span itemprop="addressLocality">Anytown</span>
        <span itemprop="postalCode">12345</span>
    </div>
</div>
```

---

## Conclusion

These HTML interview questions cover fundamental concepts to advanced features, including HTML5 APIs, semantic elements, accessibility, and modern web development practices. Understanding these concepts will help you excel in web development interviews and build better, more accessible websites.
