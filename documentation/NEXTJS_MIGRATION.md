# Next.js Migration Guide

## What Changed

The frontend has been migrated from Vite to Next.js 14 with the App Router for better:
- Server-side rendering (SSR)
- Static site generation (SSG)
- API routes
- Built-in optimizations
- Better SEO
- Production-ready defaults

## Key Differences from Vite

### 1. File Structure

**Vite:**
```
src/
  main.tsx        # Entry point
  App.tsx         # Root component
  pages/          # Components
```

**Next.js:**
```
src/app/
  layout.tsx      # Root layout (replaces main.tsx)
  page.tsx        # Home page (replaces App.tsx)
  dashboard/
    page.tsx      # /dashboard route
  groups/
    page.tsx      # /groups route
    [id]/
      page.tsx    # /groups/[id] dynamic route
```

### 2. Routing

**Vite:** Required React Router
```tsx
<BrowserRouter>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
  </Routes>
</BrowserRouter>
```

**Next.js:** File-based routing (automatic)
```
app/dashboard/page.tsx → /dashboard
app/groups/[id]/page.tsx → /groups/:id
```

### 3. Client vs Server Components

Next.js components are **Server Components by default**.

Add `'use client'` directive for:
- useState, useEffect, useContext
- Event handlers (onClick, onChange)
- Browser APIs (window, localStorage)
- Third-party libraries that use hooks

```tsx
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

### 4. Environment Variables

**Vite:** `VITE_` prefix
```env
VITE_API_URL=...
```

**Next.js:** `NEXT_PUBLIC_` prefix
```env
NEXT_PUBLIC_API_URL=...
```

Access: `process.env.NEXT_PUBLIC_API_URL`

### 5. Import Aliases

Both use `@/` for `src/`:
```tsx
import { Button } from '@/components/Button'
```

### 6. Static Assets

**Vite:** Assets in `public/`, referenced with `/`
**Next.js:** Same! Assets in `public/`, referenced with `/`

```tsx
<img src="/logo.png" alt="Logo" />
```

### 7. Development Server

**Vite:** `npm run dev` → http://localhost:5173
**Next.js:** `npm run dev` → http://localhost:3000

### 8. Build Output

**Vite:** Static files in `dist/`
**Next.js:** Optimized build in `.next/`

## Component Migration Checklist

When updating components for Next.js:

- [ ] Add `'use client'` if component uses hooks or interactivity
- [ ] Update `VITE_` env vars to `NEXT_PUBLIC_`
- [ ] Replace `import.meta.env` with `process.env`
- [ ] Use Next.js `<Link>` for internal navigation
- [ ] Use Next.js `<Image>` for optimized images
- [ ] Move API calls to Server Components when possible

## API Routes (New Feature)

Next.js allows backend API routes:

```typescript
// app/api/groups/route.ts
export async function GET() {
  const groups = await fetchGroups()
  return Response.json(groups)
}
```

Access at: `/api/groups`

## Data Fetching Patterns

### Client-Side (React Query)
```tsx
'use client'

import { useQuery } from '@tanstack/react-query'

export function GroupsList() {
  const { data } = useQuery({
    queryKey: ['groups'],
    queryFn: fetchGroups
  })
  // ...
}
```

### Server-Side (New!)
```tsx
// No 'use client' directive

async function GroupsList() {
  const groups = await fetchGroups() // Server-side fetch
  return <div>{groups.map(...)}</div>
}
```

## Image Optimization

Replace `<img>` with Next.js `<Image>`:

```tsx
import Image from 'next/image'

<Image 
  src="/logo.png" 
  alt="Logo" 
  width={200} 
  height={100}
  priority // For above-the-fold images
/>
```

## Navigation

Replace React Router with Next.js navigation:

```tsx
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Links
<Link href="/dashboard">Dashboard</Link>

// Programmatic navigation
function MyComponent() {
  const router = useRouter()
  router.push('/groups')
}
```

## Metadata & SEO

Add metadata to any page:

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your savings groups dashboard',
}

export default function DashboardPage() {
  // ...
}
```

## Benefits of Next.js

1. **Performance**: Automatic code splitting, image optimization
2. **SEO**: Server-side rendering, metadata management
3. **Developer Experience**: File-based routing, fast refresh
4. **Production Ready**: Built-in optimizations, caching
5. **Scalability**: API routes, middleware, edge functions
6. **TypeScript**: First-class TypeScript support

## Migration Status

✅ **Completed:**
- Next.js 14 setup with App Router
- All pages migrated to app directory
- Components work with Next.js
- Tailwind CSS configured
- Environment variables updated
- TypeScript configuration
- ESLint with Next.js rules

📝 **TODO (if needed):**
- Add metadata to all pages
- Optimize images with next/image
- Consider moving data fetching to server components
- Add API routes if backend needed
- Set up middleware for auth

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
