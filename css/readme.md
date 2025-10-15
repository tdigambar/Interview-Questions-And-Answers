# CSS Interview Questions and Answers

A comprehensive collection of CSS interview questions covering basic to advanced concepts for frontend development interviews.

## Table of Contents

- [Basic Level](#basic-level)
- [Intermediate Level](#intermediate-level)
- [Advanced Level](#advanced-level)

---

## Basic Level

### 1. What is CSS?

CSS (Cascading Style Sheets) is a stylesheet language used to describe the presentation of a document written in HTML or XML. It controls the visual appearance of web pages including layout, colors, fonts, and spacing.

### 2. What are the different ways to include CSS in HTML?

**Inline CSS**:
```html
<p style="color: blue; font-size: 16px;">This is inline CSS</p>
```

**Internal CSS**:
```html
<head>
    <style>
        p {
            color: blue;
            font-size: 16px;
        }
    </style>
</head>
```

**External CSS**:
```html
<head>
    <link rel="stylesheet" href="styles.css">
</head>
```

### 3. What is the CSS box model?

The CSS box model describes how elements are rendered on a web page. It consists of four parts:

```css
.element {
    width: 200px;        /* Content width */
    height: 100px;       /* Content height */
    padding: 20px;       /* Space inside the element */
    border: 2px solid black; /* Border around the element */
    margin: 10px;        /* Space outside the element */
}
```

**Box Model Components**:
- **Content**: The actual content (text, images, etc.)
- **Padding**: Space between content and border
- **Border**: Line around the padding
- **Margin**: Space outside the border

### 4. What is the difference between margin and padding?

- **Margin**: Space outside the element's border (affects spacing between elements)
- **Padding**: Space inside the element's border (affects spacing between content and border)

```css
.box {
    margin: 20px;    /* Space outside the box */
    padding: 15px;   /* Space inside the box */
    border: 1px solid black;
}
```

### 5. What are CSS selectors?

CSS selectors are patterns used to select and style HTML elements:

**Element Selector**:
```css
p {
    color: blue;
}
```

**Class Selector**:
```css
.highlight {
    background-color: yellow;
}
```

**ID Selector**:
```css
#header {
    font-size: 24px;
}
```

**Descendant Selector**:
```css
div p {
    color: red;
}
```

**Child Selector**:
```css
div > p {
    color: green;
}
```

### 6. What is the difference between class and ID selectors?

- **Class (.)**: Can be used multiple times on different elements, lower specificity
- **ID (#)**: Should be unique on a page, higher specificity

```css
/* Class - can be used multiple times */
.error {
    color: red;
}

/* ID - should be unique */
#main-content {
    width: 800px;
}
```

### 7. What is CSS specificity?

CSS specificity determines which CSS rule is applied when multiple rules target the same element. It's calculated based on:

1. Inline styles (1000 points)
2. IDs (100 points)
3. Classes, attributes, pseudo-classes (10 points)
4. Elements and pseudo-elements (1 point)

```css
/* Specificity: 0,0,1,0 (10 points) */
.highlight { color: blue; }

/* Specificity: 0,0,0,1 (1 point) */
p { color: red; }

/* The .highlight rule wins */
```

### 8. What are CSS units?

**Absolute Units**:
- `px` - Pixels
- `pt` - Points
- `in` - Inches
- `cm` - Centimeters

**Relative Units**:
- `em` - Relative to parent's font-size
- `rem` - Relative to root element's font-size
- `%` - Percentage of parent element
- `vw` - Viewport width
- `vh` - Viewport height

```css
.container {
    font-size: 16px;
    width: 80%;
    height: 100vh;
}

.text {
    font-size: 1.2em;  /* 1.2 × 16px = 19.2px */
    margin: 2rem;      /* 2 × 16px = 32px */
}
```

### 9. What is the difference between display: block, inline, and inline-block?

**Block Elements**:
- Take full width of container
- Start on new line
- Can have width, height, margin, padding

**Inline Elements**:
- Take only necessary width
- Stay on same line
- Cannot have width, height, top/bottom margins

**Inline-block Elements**:
- Take only necessary width
- Stay on same line
- Can have width, height, margin, padding

```css
.block {
    display: block;
    width: 200px;
    height: 100px;
    background: blue;
}

.inline {
    display: inline;
    background: red;
    /* width and height won't work */
}

.inline-block {
    display: inline-block;
    width: 150px;
    height: 50px;
    background: green;
}
```

### 10. How do you center an element horizontally and vertically?

**Horizontal Centering**:
```css
/* For block elements */
.center-horizontal {
    margin: 0 auto;
    width: 200px;
}

/* For inline/inline-block elements */
.center-horizontal {
    text-align: center;
}
```

**Vertical Centering**:
```css
/* Using flexbox (modern approach) */
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

/* Using absolute positioning */
.center-absolute {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
```

---

## Intermediate Level

### 11. What is the CSS cascade?

The CSS cascade determines which styles are applied when multiple rules target the same element. The order of importance is:

1. **Importance**: `!important` declarations
2. **Specificity**: More specific selectors win
3. **Source order**: Later rules override earlier ones

```css
/* This will be applied due to higher specificity */
#header .title {
    color: blue;
}

.title {
    color: red;
}
```

### 12. What are CSS pseudo-classes and pseudo-elements?

**Pseudo-classes** (single colon):
```css
/* Link states */
a:link { color: blue; }
a:visited { color: purple; }
a:hover { color: red; }
a:active { color: green; }

/* Form states */
input:focus { border: 2px solid blue; }
input:disabled { opacity: 0.5; }

/* Structural pseudo-classes */
p:first-child { font-weight: bold; }
p:nth-child(2n) { background: lightgray; }
```

**Pseudo-elements** (double colon):
```css
/* Add content before/after elements */
p::before {
    content: "→ ";
    color: blue;
}

p::after {
    content: " ←";
    color: red;
}

/* Style first line/letter */
p::first-line { font-weight: bold; }
p::first-letter { font-size: 2em; }
```

### 13. What is the difference between position: static, relative, absolute, and fixed?

**Static** (default):
- Normal document flow
- Not affected by top, right, bottom, left

**Relative**:
- Positioned relative to its normal position
- Still takes up space in document flow

**Absolute**:
- Positioned relative to nearest positioned ancestor
- Removed from normal document flow

**Fixed**:
- Positioned relative to viewport
- Stays in same position when scrolling

```css
.static {
    position: static;
}

.relative {
    position: relative;
    top: 20px;
    left: 30px;
}

.absolute {
    position: absolute;
    top: 50px;
    right: 20px;
}

.fixed {
    position: fixed;
    bottom: 20px;
    right: 20px;
}
```

### 14. What is CSS Flexbox?

Flexbox is a layout method for arranging items in a container. It provides efficient ways to align, distribute, and resize items.

```css
.container {
    display: flex;
    flex-direction: row;        /* row, column, row-reverse, column-reverse */
    justify-content: center;    /* flex-start, center, flex-end, space-between, space-around */
    align-items: center;        /* flex-start, center, flex-end, stretch, baseline */
    flex-wrap: wrap;           /* nowrap, wrap, wrap-reverse */
}

.item {
    flex: 1;                   /* flex-grow, flex-shrink, flex-basis */
    flex-grow: 1;              /* How much item should grow */
    flex-shrink: 1;            /* How much item should shrink */
    flex-basis: 200px;         /* Initial size before free space is distributed */
}
```

### 15. What is CSS Grid?

CSS Grid is a two-dimensional layout system that allows you to create complex layouts with rows and columns.

```css
.container {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;  /* Three columns */
    grid-template-rows: 100px 200px;     /* Two rows */
    gap: 20px;                           /* Space between grid items */
    grid-template-areas: 
        "header header header"
        "sidebar main aside";
}

.header {
    grid-area: header;
}

.sidebar {
    grid-area: sidebar;
}

.main {
    grid-area: main;
}

.aside {
    grid-area: aside;
}
```

### 16. What are CSS animations and transitions?

**Transitions** (smooth changes between states):
```css
.button {
    background: blue;
    transition: background 0.3s ease, transform 0.2s;
}

.button:hover {
    background: red;
    transform: scale(1.1);
}
```

**Animations** (keyframe-based animations):
```css
@keyframes slideIn {
    0% {
        transform: translateX(-100%);
        opacity: 0;
    }
    100% {
        transform: translateX(0);
        opacity: 1;
    }
}

.slide-in {
    animation: slideIn 1s ease-out;
    animation-delay: 0.5s;
    animation-fill-mode: both;
}
```

### 17. What is the difference between CSS transforms and transitions?

**Transforms**:
- Change the visual appearance of elements
- Don't affect document flow
- Can be combined

**Transitions**:
- Smooth the change between states
- Define duration, timing, and delay
- Work with transforms and other properties

```css
.element {
    transform: rotate(45deg) scale(1.2);
    transition: transform 0.3s ease;
}

.element:hover {
    transform: rotate(90deg) scale(1.5);
}
```

### 18. How do you create responsive designs with CSS?

**Media Queries**:
```css
/* Mobile first approach */
.container {
    width: 100%;
    padding: 10px;
}

/* Tablet */
@media (min-width: 768px) {
    .container {
        width: 750px;
        margin: 0 auto;
        padding: 20px;
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .container {
        width: 1000px;
        padding: 30px;
    }
}
```

**Flexible Units**:
```css
.responsive {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-size: clamp(1rem, 2.5vw, 2rem);
}
```

### 19. What are CSS custom properties (CSS variables)?

CSS custom properties allow you to store values that can be reused throughout your stylesheet.

```css
:root {
    --primary-color: #007bff;
    --secondary-color: #6c757d;
    --font-size-base: 16px;
    --spacing-unit: 8px;
}

.button {
    background-color: var(--primary-color);
    font-size: var(--font-size-base);
    padding: calc(var(--spacing-unit) * 2);
}

.button:hover {
    background-color: color-mix(in srgb, var(--primary-color) 80%, black);
}
```

### 20. What is the difference between CSS reset and normalize?

**CSS Reset**:
- Removes all default browser styling
- Sets everything to zero or a consistent baseline
- More aggressive approach

**Normalize.css**:
- Preserves useful default styles
- Fixes browser inconsistencies
- More gentle approach

```css
/* Reset example */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* Normalize approach */
h1, h2, h3, h4, h5, h6 {
    font-size: 1em;
    font-weight: normal;
}
```

---

## Advanced Level

### 21. What is CSS-in-JS and what are its pros and cons?

CSS-in-JS allows you to write CSS using JavaScript, often with component-scoped styles.

**Pros**:
- Component-scoped styles
- Dynamic styling based on props/state
- Better developer experience
- Automatic vendor prefixing

**Cons**:
- Runtime overhead
- Learning curve
- Bundle size increase
- SEO considerations

```javascript
// Styled-components example
import styled from 'styled-components';

const Button = styled.button`
    background: ${props => props.primary ? 'blue' : 'white'};
    color: ${props => props.primary ? 'white' : 'blue'};
    padding: 10px 20px;
    border: 2px solid blue;
    border-radius: 4px;
    
    &:hover {
        opacity: 0.8;
    }
`;
```

### 22. What are CSS preprocessors and what are their benefits?

CSS preprocessors extend CSS with features like variables, nesting, mixins, and functions.

**Popular Preprocessors**:
- Sass/SCSS
- Less
- Stylus

**Sass Example**:
```scss
// Variables
$primary-color: #007bff;
$font-size-base: 16px;

// Mixins
@mixin button-style($bg-color, $text-color) {
    background-color: $bg-color;
    color: $text-color;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    
    &:hover {
        opacity: 0.8;
    }
}

// Nesting
.button {
    @include button-style($primary-color, white);
    
    &.large {
        padding: 15px 30px;
        font-size: $font-size-base * 1.2;
    }
    
    &.small {
        padding: 5px 10px;
        font-size: $font-size-base * 0.8;
    }
}
```

### 23. What is CSS containment and how does it improve performance?

CSS containment allows you to isolate parts of the DOM tree, improving performance by limiting the scope of style calculations.

```css
.card {
    contain: layout style paint;
    /* 
    - layout: Contains layout changes within this element
    - style: Contains style changes within this element
    - paint: Contains painting within this element
    - size: Element's size is independent of its children
    */
}

.widget {
    contain: strict; /* Equivalent to: layout style paint size */
}
```

### 24. What are CSS logical properties?

CSS logical properties provide direction-agnostic ways to specify layout properties.

```css
/* Physical properties */
.element {
    margin-left: 20px;
    margin-right: 20px;
    border-left: 1px solid black;
    border-right: 1px solid black;
}

/* Logical properties (RTL-friendly) */
.element {
    margin-inline-start: 20px;
    margin-inline-end: 20px;
    border-inline-start: 1px solid black;
    border-inline-end: 1px solid black;
}
```

### 25. What is the CSS cascade layers (@layer) feature?

CSS cascade layers allow you to control the cascade order explicitly.

```css
/* Define layer order */
@layer reset, base, components, utilities;

/* Reset layer (lowest priority) */
@layer reset {
    * {
        margin: 0;
        padding: 0;
    }
}

/* Base layer */
@layer base {
    body {
        font-family: Arial, sans-serif;
    }
}

/* Components layer */
@layer components {
    .button {
        background: blue;
        color: white;
    }
}

/* Utilities layer (highest priority) */
@layer utilities {
    .text-center {
        text-align: center;
    }
}
```

### 26. What are CSS container queries?

Container queries allow you to apply styles based on the size of a containing element rather than the viewport.

```css
.card-container {
    container-type: inline-size;
    container-name: card;
}

.card {
    display: flex;
    flex-direction: column;
}

@container card (min-width: 300px) {
    .card {
        flex-direction: row;
    }
}

@container card (min-width: 500px) {
    .card {
        padding: 2rem;
    }
}
```

### 27. What is CSS subgrid and how does it work?

CSS subgrid allows grid items to participate in their parent's grid layout.

```css
.grid {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    gap: 20px;
}

.grid-item {
    display: grid;
    grid-template-rows: subgrid;
    grid-row: span 3;
}

.grid-item h3 {
    grid-row: 1;
}

.grid-item p {
    grid-row: 2;
}

.grid-item .meta {
    grid-row: 3;
}
```

### 28. What are CSS color functions and how do you use them?

Modern CSS provides various color functions for dynamic color manipulation.

```css
:root {
    --primary: #007bff;
    --secondary: #6c757d;
}

/* Color mixing */
.mixed {
    background: color-mix(in srgb, var(--primary) 70%, white);
}

/* Relative color syntax */
.lighter {
    background: hsl(from var(--primary) h s calc(l + 20%));
}

/* Color contrast */
.high-contrast {
    color: light-dark(black, white);
    background: light-dark(white, black);
}

/* Color interpolation */
.gradient {
    background: linear-gradient(
        to right,
        color-mix(in srgb, var(--primary) 0%, transparent),
        color-mix(in srgb, var(--primary) 100%, transparent)
    );
}
```

### 29. What is CSS scroll-driven animations?

CSS scroll-driven animations allow animations to be controlled by scroll position.

```css
@keyframes slideInFromLeft {
    from {
        transform: translateX(-100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.animate-on-scroll {
    animation: slideInFromLeft linear;
    animation-timeline: view();
    animation-range: entry 0% entry 100%;
}

/* Alternative syntax */
.animate-on-scroll-alt {
    animation: slideInFromLeft linear;
    animation-timeline: scroll();
    animation-range: 0% 50%;
}
```

### 30. What are CSS anchor positioning and how do you implement it?

CSS anchor positioning allows elements to be positioned relative to other elements.

```css
.anchor {
    anchor-name: --my-anchor;
    position: relative;
}

.tooltip {
    position: absolute;
    top: anchor(--my-anchor bottom);
    left: anchor(--my-anchor center);
    transform: translateX(-50%);
    anchor-default: --my-anchor;
}

/* Using anchor() function */
.popup {
    position: fixed;
    top: anchor(--button top);
    left: anchor(--button right);
    margin-left: 10px;
}
```

---

## Conclusion

These CSS interview questions cover fundamental concepts to cutting-edge features, including modern layout systems (Flexbox, Grid), advanced selectors, animations, responsive design, and the latest CSS specifications. Understanding these concepts will help you excel in frontend development interviews and build modern, performant web applications.
