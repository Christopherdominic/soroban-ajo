# Design System Quick Reference

## Component Classes

### Buttons
```tsx
<button className="btn btn-primary btn-md">Primary</button>
<button className="btn btn-secondary btn-sm">Secondary</button>
<button className="btn btn-ghost btn-lg">Ghost</button>
```

### Cards
```tsx
<div className="card p-6">Static Card</div>
<div className="card card-interactive p-6">Interactive Card</div>
```

### Inputs
```tsx
<input className="input" placeholder="Normal" />
<input className="input input-error" placeholder="Error" />
```

### Badges
```tsx
<span className="badge badge-primary">Primary</span>
<span className="badge badge-success">Success</span>
<span className="badge badge-error">Error</span>
<span className="badge badge-warning">Warning</span>
<span className="badge badge-info">Info</span>
```

## Utility Classes

### Loading
```tsx
<div className="skeleton h-4 w-32" />
```

### Focus
```tsx
<button className="focus-ring">Accessible</button>
```

### Scrollbar
```tsx
<div className="scrollbar-thin overflow-auto">Content</div>
```

### Animations
```tsx
<div className="animate-fade-in">Fade In</div>
<div className="animate-fade-in-up">Slide Up</div>
<div className="animate-scale-in">Scale In</div>
```

### Text
```tsx
<h1 className="gradient-text">Gradient</h1>
<p className="line-clamp-2">Truncated...</p>
```

## Tailwind Utilities

### Colors
```tsx
bg-primary-{50-950}
bg-accent-{50-900}
bg-surface-{50-950}
bg-success-{50-700}
```

### Spacing
```tsx
p-{1,2,3,4,5,6,8,10,12,16,20,24,32}
```

### Shadows
```tsx
shadow-{xs,sm,base,md,lg,xl,2xl}
shadow-glow-{sm,md,lg}
shadow-card
```

### Border Radius
```tsx
rounded-{none,sm,base,md,lg,xl,2xl,3xl,full}
```

## Dark Mode

```tsx
<html data-theme="dark">
```
