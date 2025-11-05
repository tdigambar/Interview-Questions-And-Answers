# Next.js Interview Questions and Answers

A comprehensive collection of Next.js interview questions covering basic to advanced concepts for full-stack React development interviews.

## Table of Contents

- [Basic Level](#basic-level)
- [Intermediate Level](#intermediate-level)
- [Advanced Level](#advanced-level)

---

## Basic Level

### 1. What is Next.js?

Next.js is a React-based framework developed by Vercel that enables server-side rendering (SSR), static site generation (SSG), and other advanced features for building production-ready web applications. It provides an opinionated structure with built-in routing, optimization, and deployment features.

### 2. What are the main features of Next.js?

- **Server-Side Rendering (SSR)**: Render pages on the server
- **Static Site Generation (SSG)**: Pre-render pages at build time
- **File-based Routing**: Automatic routing based on file structure
- **API Routes**: Built-in API endpoints
- **Image Optimization**: Automatic image optimization
- **Code Splitting**: Automatic code splitting for faster page loads
- **Fast Refresh**: Instant feedback during development
- **TypeScript Support**: Built-in TypeScript support
- **CSS/Sass Support**: Built-in styling options
- **Incremental Static Regeneration (ISR)**: Update static pages after build

### 3. What is the difference between Next.js and React?

| Next.js | React |
|---------|-------|
| Framework | Library |
| Built-in routing | Requires React Router |
| SSR and SSG support | Client-side rendering only |
| API routes included | No backend capabilities |
| File-based routing | Manual route configuration |
| Image optimization built-in | Requires additional setup |
| SEO-friendly by default | Requires additional work for SEO |

### 4. How do you create a new Next.js application?

```bash
# Using create-next-app
npx create-next-app@latest my-app

# With TypeScript
npx create-next-app@latest my-app --typescript

# Navigate to project
cd my-app

# Run development server
npm run dev
```

### 5. What is the folder structure in Next.js?

```
my-app/
├── app/                 # App Router (Next.js 13+)
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── about/
│       └── page.tsx     # About page
├── pages/               # Pages Router (legacy)
│   ├── index.js         # Home page
│   ├── about.js         # About page
│   └── api/
│       └── hello.js     # API route
├── public/              # Static assets
├── styles/              # CSS files
├── components/          # React components
├── next.config.js       # Next.js configuration
└── package.json
```

### 6. What is file-based routing in Next.js?

Next.js automatically creates routes based on the file structure in the `pages` or `app` directory.

**Pages Router:**
```
pages/
├── index.js           → /
├── about.js           → /about
├── blog/
│   ├── index.js       → /blog
│   └── [slug].js      → /blog/:slug
└── products/
    └── [id].js        → /products/:id
```

**App Router (Next.js 13+):**
```
app/
├── page.tsx           → /
├── about/
│   └── page.tsx       → /about
└── blog/
    ├── page.tsx       → /blog
    └── [slug]/
        └── page.tsx   → /blog/:slug
```

### 7. What is the difference between Pages Router and App Router?

| Pages Router (Legacy) | App Router (Next.js 13+) |
|----------------------|--------------------------|
| `pages/` directory | `app/` directory |
| Page components are default exports | `page.tsx/js` files |
| `getServerSideProps`, `getStaticProps` | Server Components by default |
| Client-side by default | Server-side by default |
| `_app.js` for layouts | Nested layouts with `layout.tsx` |
| Less flexibility | More flexible and powerful |

### 8. How do you navigate between pages in Next.js?

```jsx
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // App Router
// import { useRouter } from 'next/router'; // Pages Router

function Navigation() {
  const router = useRouter();
  
  return (
    <div>
      {/* Using Link component (preferred) */}
      <Link href="/about">About</Link>
      <Link href="/blog/post-1">Blog Post</Link>
      
      {/* Programmatic navigation */}
      <button onClick={() => router.push('/contact')}>
        Contact
      </button>
    </div>
  );
}
```

### 9. What are dynamic routes in Next.js?

Dynamic routes use brackets `[]` in the filename to create parameterized routes.

**Pages Router:**
```jsx
// pages/blog/[slug].js
import { useRouter } from 'next/router';

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;
  
  return <h1>Post: {slug}</h1>;
}
```

**App Router:**
```jsx
// app/blog/[slug]/page.tsx
export default function BlogPost({ params }: { params: { slug: string } }) {
  return <h1>Post: {params.slug}</h1>;
}
```

### 10. What is the public folder used for?

The public folder stores static assets that are served from the root URL without processing.

```jsx
// Accessing files from public/
<img src="/logo.png" alt="Logo" />
<link rel="icon" href="/favicon.ico" />
```

---

## Intermediate Level

### 11. What is getStaticProps?

`getStaticProps` runs at build time and generates static pages with pre-fetched data.

```jsx
// pages/blog.js
export default function Blog({ posts }) {
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}

export async function getStaticProps() {
  const res = await fetch('https://api.example.com/posts');
  const posts = await res.json();
  
  return {
    props: { posts },
    revalidate: 60, // ISR: Revalidate every 60 seconds
  };
}
```

### 12. What is getServerSideProps?

`getServerSideProps` runs on every request and renders pages on the server.

```jsx
// pages/profile.js
export default function Profile({ user }) {
  return <div>Welcome, {user.name}</div>;
}

export async function getServerSideProps(context) {
  const { req, res, query, params } = context;
  
  const response = await fetch('https://api.example.com/user');
  const user = await response.json();
  
  return {
    props: { user },
  };
}
```

### 13. What is getStaticPaths?

`getStaticPaths` specifies which dynamic routes to pre-render at build time.

```jsx
// pages/posts/[id].js
export default function Post({ post }) {
  return <h1>{post.title}</h1>;
}

export async function getStaticPaths() {
  const res = await fetch('https://api.example.com/posts');
  const posts = await res.json();
  
  const paths = posts.map(post => ({
    params: { id: post.id.toString() },
  }));
  
  return {
    paths,
    fallback: false, // false, true, or 'blocking'
  };
}

export async function getStaticProps({ params }) {
  const res = await fetch(`https://api.example.com/posts/${params.id}`);
  const post = await res.json();
  
  return {
    props: { post },
  };
}
```

### 14. What is the difference between fallback: false, true, and 'blocking' in getStaticPaths?

- **fallback: false**: Returns 404 for paths not returned by getStaticPaths
- **fallback: true**: Shows fallback version while generating page in background
- **fallback: 'blocking'**: Server-side renders page on first request (no fallback UI)

```jsx
export async function getStaticPaths() {
  return {
    paths: [{ params: { id: '1' } }],
    fallback: 'blocking',
  };
}
```

### 15. What is Incremental Static Regeneration (ISR)?

ISR allows you to update static pages after build time without rebuilding the entire site.

```jsx
export async function getStaticProps() {
  const data = await fetchData();
  
  return {
    props: { data },
    revalidate: 10, // Regenerate page every 10 seconds
  };
}
```

### 16. How do you create API routes in Next.js?

API routes provide backend functionality within Next.js applications.

**Pages Router:**
```js
// pages/api/hello.js
export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ message: 'Hello World' });
  } else if (req.method === 'POST') {
    const { name } = req.body;
    res.status(200).json({ message: `Hello ${name}` });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
```

**App Router:**
```ts
// app/api/hello/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  return NextResponse.json({ message: 'Hello World' });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ message: `Hello ${body.name}` });
}
```

### 17. What is the Image component in Next.js?

The `next/image` component provides automatic image optimization.

```jsx
import Image from 'next/image';

export default function Home() {
  return (
    <div>
      {/* Local image */}
      <Image
        src="/profile.jpg"
        alt="Profile"
        width={500}
        height={500}
        priority
      />
      
      {/* Remote image */}
      <Image
        src="https://example.com/image.jpg"
        alt="Remote"
        width={800}
        height={600}
        loading="lazy"
      />
    </div>
  );
}
```

**Features:**

- Automatic optimization
- Lazy loading
- Responsive images
- Prevents layout shift

### 18. How do you add metadata and SEO in Next.js?

**Pages Router:**
```jsx
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>My Page Title</title>
        <meta name="description" content="Page description" />
        <meta property="og:title" content="Page Title" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>Content</main>
    </>
  );
}
```

**App Router:**
```tsx
// app/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Page Title',
  description: 'Page description',
  openGraph: {
    title: 'Page Title',
    description: 'Page description',
  },
};

export default function Home() {
  return <main>Content</main>;
}
```

### 19. What is the _app.js file?

`_app.js` is a custom App component that wraps all page components (Pages Router only).

```jsx
// pages/_app.js
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <header>Global Header</header>
      <Component {...pageProps} />
      <footer>Global Footer</footer>
    </>
  );
}
```

### 20. What is the _document.js file?

`_document.js` customizes the HTML document structure (Pages Router only).

```jsx
// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

---

## Advanced Level

### 21. What are Server Components in Next.js 13+?

Server Components render on the server by default in the App Router, reducing client-side JavaScript.

```tsx
// app/page.tsx (Server Component by default)
async function getData() {
  const res = await fetch('https://api.example.com/data');
  return res.json();
}

export default async function Page() {
  const data = await getData();
  
  return <div>{data.title}</div>;
}
```

### 22. What are Client Components?

Client Components use the "use client" directive for interactive features requiring browser APIs.

```tsx
// components/Counter.tsx
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### 23. What is the difference between Server and Client Components?

| Server Components | Client Components |
|------------------|------------------|
| Default in App Router | Require "use client" |
| Run on server | Run on client |
| Can't use hooks/browser APIs | Can use hooks and browser APIs |
| Can directly access backend | Need API calls |
| Better performance | Interactive features |
| No JavaScript sent to client | JavaScript sent to client |

### 24. What are layouts in the App Router?

Layouts are UI that wraps multiple pages and persists across navigation.

```tsx
// app/layout.tsx (Root layout)
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header>Global Header</header>
        <main>{children}</main>
        <footer>Global Footer</footer>
      </body>
    </html>
  );
}

// app/dashboard/layout.tsx (Nested layout)
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <aside>Dashboard Sidebar</aside>
      <section>{children}</section>
    </div>
  );
}
```

### 25. What are loading and error states in App Router?

**Loading UI:**
```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <div>Loading dashboard...</div>;
}
```

**Error UI:**
```tsx
// app/dashboard/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### 26. What is middleware in Next.js?

Middleware runs before a request is completed, allowing you to modify responses.

```ts
// middleware.ts (root level)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check authentication
  const token = request.cookies.get('token');
  
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Add custom header
  const response = NextResponse.next();
  response.headers.set('x-custom-header', 'value');
  
  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};
```

### 27. What are Route Handlers in App Router?

Route Handlers are the App Router equivalent of API routes.

```ts
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');
  
  const users = await fetchUsers(query);
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const user = await createUser(body);
  
  return NextResponse.json(user, { status: 201 });
}

// Dynamic route: app/api/users/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await fetchUser(params.id);
  return NextResponse.json(user);
}
```

### 28. How do you implement authentication in Next.js?

```tsx
// Using middleware for protected routes
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'],
};

// Login API route
// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  
  // Verify credentials
  const token = await authenticateUser(email, password);
  
  const response = NextResponse.json({ success: true });
  response.cookies.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
  
  return response;
}
```

### 29. What is next.config.js and what can you configure?

`next.config.js` is the configuration file for customizing Next.js behavior.

```js
// next.config.js
module.exports = {
  // Environment variables
  env: {
    CUSTOM_KEY: 'value',
  },
  
  // Image domains
  images: {
    domains: ['example.com', 'cdn.example.com'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/old-path',
        destination: '/new-path',
        permanent: true,
      },
    ];
  },
  
  // Rewrites
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.example.com/:path*',
      },
    ];
  },
  
  // Headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Custom-Header',
            value: 'custom-value',
          },
        ],
      },
    ];
  },
  
  // Webpack customization
  webpack: (config, { isServer }) => {
    // Modify webpack config
    return config;
  },
  
  // Experimental features
  experimental: {
    appDir: true,
  },
};
```

### 30. How do you implement caching strategies in Next.js?

```tsx
// Static caching (getStaticProps with revalidate)
export async function getStaticProps() {
  return {
    props: { data },
    revalidate: 60, // Revalidate every 60 seconds
  };
}

// Route Handler caching (App Router)
// app/api/data/route.ts
export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  const data = await fetchData();
  return Response.json(data);
}

// Dynamic caching with fetch
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });
  return res.json();
}

// No caching
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    cache: 'no-store', // Always fetch fresh data
  });
  return res.json();
}
```

### 31. What are Parallel Routes in Next.js?

Parallel Routes allow rendering multiple pages simultaneously in the same layout.

```
app/
├── layout.tsx
├── @team/
│   └── page.tsx
├── @analytics/
│   └── page.tsx
└── page.tsx
```

```tsx
// app/layout.tsx
export default function Layout({
  children,
  team,
  analytics,
}: {
  children: React.ReactNode;
  team: React.ReactNode;
  analytics: React.ReactNode;
}) {
  return (
    <div>
      {children}
      <div className="grid">
        {team}
        {analytics}
      </div>
    </div>
  );
}
```

### 32. What are Intercepting Routes?

Intercepting Routes allow loading a route within the current layout while keeping the URL.

```
app/
├── feed/
│   └── page.tsx
├── (..)photo/
│   └── [id]/
│       └── page.tsx
└── photo/
    └── [id]/
        └── page.tsx
```

### 33. How do you optimize performance in Next.js?

- Use Image component for automatic optimization
- Implement code splitting with dynamic imports
- Use ISR for static content that changes
- Leverage Server Components to reduce client JavaScript
- Implement lazy loading
- Use next/font for font optimization
- Enable compression
- Use CDN for static assets
- Implement proper caching strategies
- Minimize client-side JavaScript
- Use React Server Components
- Implement proper error boundaries

### 34. What is the difference between static and dynamic rendering?

- **Static Rendering**: Pages generated at build time (getStaticProps, default Server Components)
- **Dynamic Rendering**: Pages generated on each request (getServerSideProps, dynamic functions)

```tsx
// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Force static rendering
export const dynamic = 'force-static';
```

### 35. What are the design patterns used in Next.js?

Next.js uses several design patterns to build scalable and maintainable full-stack applications.

**1. Server Components Pattern:**

**Definition:** Server Components render on the server by default, reducing client-side JavaScript bundle size. They can directly access databases and APIs without exposing API routes, improving security and performance.

**Benefits:** Reduced bundle size, better security, faster initial load, direct database access.

```tsx
// app/products/page.tsx (Server Component)
async function getProducts() {
  const res = await db.query('SELECT * FROM products');
  return res.rows;
}

export default async function ProductsPage() {
  const products = await getProducts(); // Direct DB access
  
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

**2. Client Component Pattern:**

**Definition:** Components marked with "use client" directive that run in the browser. Used for interactive features requiring browser APIs, event handlers, or React hooks.

**Benefits:** Browser API access, interactivity, hooks support, real-time updates.

```tsx
// components/Counter.tsx
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

**3. Layout Pattern:**

**Definition:** Layouts are shared UI components that wrap pages and persist across navigation. They enable code reuse for common UI elements like headers, footers, and sidebars.

**Benefits:** Code reuse, consistent UI, better performance (layouts don't re-render), nested layouts support.

```tsx
// app/layout.tsx (Root layout)
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <header>Global Header</header>
        <main>{children}</main>
        <footer>Global Footer</footer>
      </body>
    </html>
  );
}

// app/dashboard/layout.tsx (Nested layout)
export default function DashboardLayout({ children }) {
  return (
    <div>
      <aside>Dashboard Sidebar</aside>
      <section>{children}</section>
    </div>
  );
}
```

**4. Route Handler Pattern (API Routes):**

**Definition:** Route handlers provide backend API functionality within Next.js applications. They handle HTTP methods (GET, POST, etc.) and can perform server-side operations like database queries, authentication, and file operations.

**Benefits:** Full-stack in one framework, type-safe APIs, no separate backend needed, easy deployment.

```ts
// app/api/users/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const users = await db.query('SELECT * FROM users');
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const body = await request.json();
  const user = await createUser(body);
  return NextResponse.json(user, { status: 201 });
}
```

**5. Middleware Pattern:**

**Definition:** Middleware runs before a request is completed, allowing you to modify requests/responses, implement authentication, redirects, and add custom headers at the edge.

**Benefits:** Edge execution, request modification, authentication, performance optimization, A/B testing.

```ts
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Authentication check
  const token = request.cookies.get('token');
  
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Add custom header
  const response = NextResponse.next();
  response.headers.set('x-custom-header', 'value');
  return response;
}
```

**6. Static Site Generation (SSG) Pattern:**

**Definition:** Pages are pre-rendered at build time, generating static HTML files. This pattern is ideal for content that doesn't change frequently, providing fast page loads and excellent SEO.

**Benefits:** Fastest performance, great SEO, CDN-friendly, cost-effective hosting.

```jsx
// pages/blog.js
export async function getStaticProps() {
  const posts = await fetchPosts();
  
  return {
    props: { posts },
    revalidate: 3600, // ISR: Regenerate every hour
  };
}

export default function Blog({ posts }) {
  return <div>{/* Render posts */}</div>;
}
```

**7. Server-Side Rendering (SSR) Pattern:**

**Definition:** Pages are rendered on the server for each request, providing fresh data on every page load. Ideal for dynamic content that changes frequently or user-specific data.

**Benefits:** Fresh data, SEO-friendly, personalized content, secure server-side operations.

```jsx
// pages/profile.js
export async function getServerSideProps(context) {
  const user = await getUser(context.req);
  
  return {
    props: { user },
  };
}

export default function Profile({ user }) {
  return <div>Welcome, {user.name}</div>;
}
```

**8. Incremental Static Regeneration (ISR) Pattern:**

**Definition:** Combines static generation with dynamic updates. Pages are generated at build time but can be regenerated in the background after a specified time interval, keeping content fresh while maintaining performance.

**Benefits:** Best of both worlds (static + dynamic), automatic updates, scalable, cost-effective.

```jsx
export async function getStaticProps() {
  const data = await fetchData();
  
  return {
    props: { data },
    revalidate: 60, // Regenerate every 60 seconds
  };
}
```

**9. Parallel Routes Pattern:**

**Definition:** Allows rendering multiple pages simultaneously in the same layout using slots. Each slot can have its own loading and error states, enabling complex dashboard layouts.

**Benefits:** Independent loading states, flexible layouts, better UX, modular design.

```tsx
// app/layout.tsx
export default function Layout({
  children,
  team,
  analytics,
}: {
  children: React.ReactNode;
  team: React.ReactNode;
  analytics: React.ReactNode;
}) {
  return (
    <div>
      {children}
      <div className="grid">
        {team}
        {analytics}
      </div>
    </div>
  );
}
```

**10. Intercepting Routes Pattern:**

**Definition:** Allows loading a route within the current layout while maintaining the URL. Used for modals, sidebars, and other overlay UI that should appear without changing the URL.

**Benefits:** Modal-like UI, better UX, no URL changes, smooth transitions.

```tsx
// app/(.)photo/[id]/page.tsx (Intercepting route)
export default function PhotoModal({ params }) {
  return <Modal><Photo id={params.id} /></Modal>;
}
```

**Key Takeaways:**
- **Server Components**: Default rendering on server for better performance
- **Client Components**: For interactivity and browser APIs
- **Layouts**: Reusable UI structure across pages
- **Route Handlers**: Backend API functionality
- **Middleware**: Edge-level request/response manipulation
- **SSG/SSR/ISR**: Different rendering strategies for different needs
- **Parallel Routes**: Multiple simultaneous page renders
- **Intercepting Routes**: Modal/overlay UI patterns

### 36. What are some best practices for Next.js?

- Use Server Components by default, Client Components when needed
- Implement proper error handling with error.tsx
- Use loading.tsx for loading states
- Optimize images with next/image
- Use environment variables for configuration
- Implement proper SEO with metadata
- Use TypeScript for type safety
- Follow folder structure conventions
- Implement proper caching strategies
- Use middleware for authentication
- Keep components small and reusable
- Use layouts for shared UI
- Implement proper error boundaries
- Test your application thoroughly
- Monitor performance with analytics

---

## Conclusion

These questions cover Next.js fundamentals through advanced concepts and should thoroughly prepare you for a Next.js interview! The topics range from basic routing and rendering to advanced features like Server Components, middleware, and performance optimization techniques that are essential for building modern full-stack React applications.