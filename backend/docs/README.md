# Backend Documentation

This directory contains all backend-specific documentation for the Ajo Express API server.

## 📚 Documentation

### Authentication
- [Authentication Guide](AUTH.md) - JWT authentication implementation

### Webhooks
- [Webhook Quick Start](WEBHOOK_QUICK_START.md) - Getting started with webhooks
- [Webhook README](WEBHOOK_README.md) - Comprehensive webhook documentation

## 🚀 Quick Start

For setup instructions, see the main [Backend README](../README.md).

## 📁 Backend Structure

```
backend/
├── src/
│   ├── config/          # Configuration management
│   ├── controllers/     # Request handlers
│   ├── errors/          # Error classes
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── types/           # TypeScript types
│   ├── utils/           # Utility functions
│   └── docs/            # API documentation (OpenAPI)
├── examples/            # Example code
├── tests/               # Test files
├── docs/                # This directory
├── .env.example         # Environment template
├── .env                 # Local environment (gitignored)
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies
```

## 🔌 API Documentation

Interactive API documentation is available at `/api-docs` when the backend server is running.

## 🔗 Related Documentation

- [Main Project README](../../README.md)
- [Frontend Documentation](../../frontend/README.md)
- [Project Documentation](../../documentation/README.md)

---

Last Updated: February 2026
