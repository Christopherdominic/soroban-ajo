# Drips Documentation Site

Interactive documentation for the Drips platform, built with Nextra.

## Features

- 📚 **Comprehensive Guides** - Setup, development, and deployment
- 🔌 **API Reference** - Interactive Swagger documentation
- 🔧 **Smart Contract Docs** - Rust/Soroban contract documentation
- 🎨 **User Guides** - Wallet integration, caching, accessibility
- 🔍 **Full-Text Search** - Find what you need quickly
- 📱 **Mobile Friendly** - Responsive design

## Quick Start

### Development

```bash
# From root directory
npm run dev:docs

# Or from frontend directory
cd frontend
npm run dev
```

Visit http://localhost:3000

### Production Build

```bash
npm run build:docs
```

## Structure

```
frontend/
├── pages/
│   ├── index.mdx              # Homepage
│   └── docs/
│       ├── _meta.json         # Navigation structure
│       ├── getting-started.mdx
│       ├── architecture.mdx
│       ├── api.mdx
│       ├── contracts.mdx
│       ├── contributing.mdx
│       └── guides/
│           ├── _meta.json
│           ├── environment-setup.mdx
│           ├── wallet-integration.mdx
│           ├── caching.mdx
│           ├── accessibility.mdx
│           └── error-handling.mdx
└── theme.config.tsx           # Nextra theme config
```

## API Documentation

Interactive API documentation is available at:
- **Development**: http://localhost:3001/api-docs
- **Swagger UI**: Full interactive API explorer
- **OpenAPI JSON**: http://localhost:3001/api-docs.json

## Adding New Pages

### 1. Create MDX File

```bash
# Create new guide
touch frontend/pages/docs/guides/my-guide.mdx
```

### 2. Add Content

```mdx
# My Guide

Content goes here...

## Section

More content...
```

### 3. Update Navigation

Edit `_meta.json` in the same directory:

```json
{
  "my-guide": "My Guide Title"
}
```

## Markdown Features

### Code Blocks

\`\`\`typescript
const example = "with syntax highlighting";
\`\`\`

### Callouts

> **Note**: Important information

> **Warning**: Be careful here

### Links

- Internal: `[Getting Started](/docs/getting-started)`
- External: `[Stellar Docs](https://stellar.org)`

### Images

```mdx
![Alt text](/images/screenshot.png)
```

## Search

Nextra includes built-in search. Press `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux) to search.

## Deployment

### Vercel (Recommended)

1. Connect GitHub repository
2. Set framework preset to "Next.js"
3. Deploy

### Manual

```bash
npm run build:docs
cd frontend
npm start
```

## Contributing

To improve documentation:

1. Edit MDX files in `frontend/pages/docs/`
2. Test locally with `npm run dev:docs`
3. Submit pull request

## Resources

- [Nextra Documentation](https://nextra.site/)
- [MDX Documentation](https://mdxjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
