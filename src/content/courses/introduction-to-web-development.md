---
title: "Introduction to Web Development"
author: "Dzaleka Online Services"
authorEmail: "info@mail.dzaleka.com"
description: "A comprehensive guide to modern web development covering HTML5, CSS3, JavaScript (ES6+), and essential tools. Build real-world projects from scratch."
category: "technology"
duration: "10 weeks"
level: "beginner"
tags:
  - web development
  - html5
  - css3
  - javascript
  - responsive design
  - git
thumbnail: "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
featured: true
status: "published"
datePublished: 2025-11-20
---

## Course Overview

Welcome to **Introduction to Web Development**! This course is designed to take you from a complete beginner to a confident web developer capable of building modern, responsive websites. We focus on the core technologies of the web—**HTML**, **CSS**, and **JavaScript**—along with the tools used by professionals in 2025.

**By the end of this course, you will:**
- Build professional, responsive websites that look great on any device.
- Write clean, semantic HTML and modern CSS.
- Create interactive experiences using JavaScript (ES6+).
- Use professional tools like Git, GitHub, and VS Code.
- Deploy your projects to the live web.
- Have a portfolio of 3 real-world projects to showcase.

---

## Table of Contents

| Module | Topic | Duration |
|--------|-------|----------|
| [Module 1](#module-1-getting-started) | The Web & Environment Setup | 1 hour |
| [Module 2](#module-2-html-fundamentals) | HTML5 & Accessibility | 3 hours |
| [Module 3](#module-3-modern-css) | CSS3, Flexbox & Grid | 5 hours |
| [Module 4](#module-4-javascript-essentials) | JavaScript Essentials (ES6+) | 6 hours |
| [Module 5](#module-5-advanced-javascript) | DOM, Async & APIs | 5 hours |
| [Module 6](#module-6-professional-tools) | Git, GitHub & Deployment | 2 hours |
| [Module 7](#module-7-building-projects) | Capstone Projects | 10 hours |
| [Module 8](#module-8-next-steps) | Frameworks & Career Path | 1 hour |

---

## Module 1: Getting Started

### 1.1 How the Web Works
Before writing code, it's crucial to understand the ecosystem:
- **Clients & Servers**: Browsers (Chrome, Firefox) request data; Servers send it back.
- **HTTP/HTTPS**: The language browsers and servers use to talk.
- **DNS**: The phonebook of the internet (mapping `dzaleka.com` to an IP address).

### 1.2 Setting Up Your Developer Environment
Professional developers use professional tools. Let's get set up.

1.  **Code Editor: Visual Studio Code (VS Code)**
    -   The industry standard. Free and powerful.
    -   [Download VS Code](https://code.visualstudio.com/)
    -   **Recommended Extensions**:
        -   *Live Server* (for real-time previews)
        -   *Prettier* (for code formatting)
        -   *ESLint* (for catching errors)

2.  **Web Browser: Google Chrome or Firefox Developer Edition**
    -   Learn to use the **DevTools** (F12 or Right-click > Inspect). This is your superpower for debugging.

3.  **Terminal / Command Line**
    -   Don't fear the black box! You'll need it for Git and modern tools.
    -   Windows: Use *Git Bash* or *PowerShell*. Mac/Linux: Use *Terminal*.

---

## Module 2: HTML Fundamentals

### 2.1 Semantic HTML5
HTML is not just about putting things on the screen; it's about meaning. Semantic HTML improves **Accessibility** (for screen readers) and **SEO** (Search Engine Optimization).

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Semantic Structure</title>
</head>
<body>
    <header>
        <nav>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <article>
            <h1>The Future of Web Dev</h1>
            <p>Content goes here...</p>
        </article>
        
        <aside>
            <h3>Related Articles</h3>
        </aside>
    </main>

    <footer>
        <p>&copy; 2025 Dzaleka Tech Hub</p>
    </footer>
</body>
</html>
```

### 2.2 Modern Forms & Inputs
Forms are how users interact with your app. HTML5 gives us powerful validation out of the box.

```html
<form action="/submit" method="POST">
    <label for="email">Email:</label>
    <input type="email" id="email" name="email" required placeholder="you@example.com">

    <label for="password">Password:</label>
    <input type="password" id="password" name="password" minlength="8" required>

    <!-- Native Date Picker -->
    <label for="birthday">Birthday:</label>
    <input type="date" id="birthday" name="birthday">

    <button type="submit">Sign Up</button>
</form>
```

### 2.3 Accessibility (a11y) Essentials
-   Always use `alt` text for images: `<img src="cat.jpg" alt="A fluffy orange cat sitting on a fence">`.
-   Use correct heading hierarchy (`h1` -> `h2` -> `h3`).
-   Interactive elements must be keyboard accessible.

---

## Module 3: Modern CSS

### 3.1 CSS Variables (Custom Properties)
Stop repeating hex codes! Use variables for consistent theming.

```css
:root {
    --primary-color: #2563eb;
    --text-dark: #1f2937;
    --spacing-md: 1rem;
}

body {
    color: var(--text-dark);
}

button {
    background-color: var(--primary-color);
    padding: var(--spacing-md);
}
```

### 3.2 Flexbox Layout
The standard for 1-dimensional layouts (rows or columns).

```css
.navbar {
    display: flex;
    justify-content: space-between; /* Spacing */
    align-items: center; /* Vertical alignment */
    gap: 1rem; /* Space between items */
}
```

### 3.3 CSS Grid Layout
The standard for 2-dimensional layouts (rows AND columns).

```css
.gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Responsive columns */
    gap: 20px;
}
```

### 3.4 Responsive Design
Make your site look good on phones, tablets, and desktops.

```css
/* Mobile First Approach */
.container {
    width: 100%;
    padding: 1rem;
}

/* Tablet and up */
@media (min-width: 768px) {
    .container {
        max-width: 720px;
        margin: 0 auto;
    }
}
```

---

## Module 4: JavaScript Essentials (ES6+)

### 4.1 Modern Variables
Forget `var`. Use `const` by default, and `let` if the value changes.

```javascript
const PI = 3.14159; // Cannot be reassigned
let score = 0;      // Can change
score += 10;
```

### 4.2 Arrow Functions
Cleaner syntax for functions.

```javascript
// Traditional
function add(a, b) {
    return a + b;
}

// Arrow Function
const add = (a, b) => a + b;

// With array methods
const numbers = [1, 2, 3];
const doubled = numbers.map(n => n * 2); // [2, 4, 6]
```

### 4.3 Template Literals
Easy string interpolation.

```javascript
const name = "Bakari";
const greeting = `Hello, ${name}! Welcome to the course.`;
```

### 4.4 Destructuring & Spread Operator
Working with objects and arrays made easy.

```javascript
const user = { name: "Alice", age: 25, country: "Malawi" };
const { name, country } = user; // Extract properties

const fruits = ["Apple", "Banana"];
const moreFruits = [...fruits, "Mango", "Orange"]; // Combine arrays
```

---

## Module 5: Advanced JavaScript

### 5.1 DOM Manipulation
Interacting with the page.

```javascript
const button = document.querySelector('#myBtn');
const output = document.querySelector('.output');

button.addEventListener('click', () => {
    output.textContent = "Button was clicked!";
    output.classList.toggle('highlight');
});
```

### 5.2 Async/Await & Fetch API
Getting data from the internet (APIs). This is how modern apps work.

```javascript
async function getWeather(city) {
    try {
        const response = await fetch(`https://api.weather.com/v1/${city}`);
        const data = await response.json();
        console.log(`Temperature in ${city}: ${data.temp}°C`);
    } catch (error) {
        console.error("Failed to fetch weather:", error);
    }
}

getWeather("Lilongwe");
```

### 5.3 ES Modules
Organizing code into multiple files.

```javascript
// math.js
export const add = (a, b) => a + b;

// main.js
import { add } from './math.js';
console.log(add(5, 3));
```

---

## Module 6: Professional Tools

### 6.1 Git & GitHub
Version control is a safety net for your code and a requirement for jobs.

-   **Git**: Tracks changes on your computer.
-   **GitHub**: Stores your code in the cloud.

**Basic Commands:**
```bash
git init                # Start a repo
git add .               # Stage changes
git commit -m "Message" # Save changes
git push origin main    # Upload to GitHub
```

### 6.2 Package Managers (npm)
`npm` (Node Package Manager) lets you use code written by others (libraries).

```bash
npm init -y             # Create package.json
npm install date-fns    # Install a library
```

---

## Module 7: Building Projects

### 7.1 Project 1: Personal Portfolio
**Goal**: Build a responsive, multi-page portfolio to showcase your work.
**Tech**: HTML5, CSS3 (Flexbox/Grid), Responsive Design.
**Features**:
-   Hero section with photo and bio.
-   Project gallery using CSS Grid.
-   Contact form.

### 7.2 Project 2: Interactive Todo App
**Goal**: Create a dynamic task manager.
**Tech**: HTML, CSS, JavaScript, LocalStorage.
**Features**:
-   Add, delete, and mark tasks as done.
-   Filter tasks (All/Active/Completed).
-   **LocalStorage**: Save data so it persists after refresh.

### 7.3 Project 3: Weather Dashboard
**Goal**: Build a live weather app using a real API.
**Tech**: JavaScript (Async/Await, Fetch), External API.
**Features**:
-   Search for any city.
-   Display current temp, humidity, and wind speed.
-   Dynamic background based on weather (sunny/rainy).

---

## Module 8: Next Steps

### 8.1 CSS Frameworks
Once you know CSS, speed up with frameworks:
-   **Tailwind CSS**: Utility-first (used in this website!).
-   **Bootstrap**: Component-based (classic).

### 8.2 JavaScript Frameworks
The industry moves to component-based architectures:
-   **React**: The most popular library.
-   **Vue.js**: Beginner-friendly and powerful.
-   **Astro**: Great for content-focused sites (like this one!).

### 8.3 Continuous Learning
-   **MDN Web Docs**: The bible of web development.
-   **Frontend Mentor**: Practice with real designs.
-   **Codewars**: Sharpen your JS logic.

---

## Conclusion

You have now laid a solid foundation in web development. The journey doesn't end here—technology is always evolving. The best way to grow is to **build things**. Don't just watch tutorials; write code, break things, and fix them.

**Happy Coding!**

---

## Resources

### Comprehensive Learning Platforms (Free)
- [freeCodeCamp](https://www.freecodecamp.org/) - Full certifications in Responsive Web Design, JavaScript, and more.
- [The Odin Project](https://www.theodinproject.com/) - A complete full-stack open source curriculum.
- [Scrimba](https://scrimba.com/) - Interactive video tutorials where you can edit the code inside the video.

### Essential Documentation
- [MDN Web Docs](https://developer.mozilla.org/) - The official standard documentation for web technologies.
- [W3Schools](https://www.w3schools.com/) - Beginner-friendly tutorials and references.
- [Can I Use](https://caniuse.com/) - Check browser support for modern CSS and JS features.

### Practice & Challenges
- [Frontend Mentor](https://www.frontendmentor.io/) - Build real projects from professional designs.
- [JavaScript30](https://javascript30.com/) - 30 Day Vanilla JS Coding Challenge.
- [Codewars](https://www.codewars.com/) - Improve your logic with code challenges.

### Top YouTube Channels
- [Traversy Media](https://www.youtube.com/c/TraversyMedia) - In-depth tutorials and crash courses.
- [The Net Ninja](https://www.youtube.com/c/TheNetNinja) - Structured playlists on modern frameworks.
- [Web Dev Simplified](https://www.youtube.com/c/WebDevSimplified) - Concepts explained simply and clearly.

### Community
- [Stack Overflow](https://stackoverflow.com/) - Ask questions and find answers.
- [Dev.to](https://dev.to/) - Articles and tutorials written by developers.
- [Reddit r/webdev](https://reddit.com/r/webdev) - Discuss trends and get career advice.
