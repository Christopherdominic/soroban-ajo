# API Changelog

All notable changes to the Ajo API will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-24

### Added
- **Email Service**: Complete email notification system
  - Welcome emails
  - Contribution reminders
  - Payout notifications
  - Group invitations
  - Weekly summaries
  - Transaction receipts
  - Email verification
  - Unsubscribe functionality
  - Rate limiting (5 emails/hour, 3 verifications/hour)
  
- **API Documentation**: Comprehensive OpenAPI 3.0 specification
  - Interactive Swagger UI at `/api-docs`
  - Complete endpoint documentation
  - Request/response examples
  - Authentication flow documentation
  - Error response documentation
  - Rate limiting documentation

- **Webhook System**: Event-driven webhook notifications
  - Group created/updated/completed events
  - Member joined/left events
  - Contribution made events
  - Payout completed events
  - Cycle started/ended events
  - Webhook signature verification
  - Retry mechanism with exponential backoff

### Changed
- **Node.js Requirement**: Updated from 18+ to 20+ for Prisma compatibility
- **Error Handling**: Standardized error responses across all endpoints
- **Rate Limiting**: Implemented consistent rate limiting (100 req/15min)

### Fixed
- TypeScript strict mode compliance
- Unused parameter warnings
- Console.log statements in production code
- Import case sensitivity issues

## [0.1.0] - 2026-02-01

### Added
- **Groups API**: CRUD operations for savings groups
  - `POST /api/groups` - Create group
  - `GET /api/groups` - List groups
  - `GET /api/groups/:id` - Get group details
  - `POST /api/groups/:id/join` - Join group
  - `POST /api/groups/:id/contribute` - Make contribution

- **Analytics API**: Group and user analytics
  - `GET /api/analytics/groups/:id` - Group analytics
  - `GET /api/analytics/user/:publicKey` - User analytics

- **Authentication**: JWT-based authentication
  - `POST /api/auth/token` - Generate JWT token
  - Stellar wallet public key validation

- **Health Check**: Service health monitoring
  - `GET /api/health` - Health status

### Security
- JWT authentication with 7-day expiration
- Rate limiting on all endpoints
- Input validation with Zod schemas
- CORS configuration
- Helmet security headers

## API Versioning

### Current Version: v1

The API uses URL versioning. The current version is `v1` and is the default.

### Version Support Policy

- **Current version (v1)**: Fully supported, receives all updates
- **Previous version**: Supported for 6 months after new version release
- **Deprecated versions**: 3-month notice before removal

### Breaking Changes

Breaking changes will result in a new major version. Examples:
- Removing endpoints
- Changing required fields
- Modifying response structure
- Changing authentication method

### Non-Breaking Changes

Non-breaking changes are added to the current version:
- Adding new endpoints
- Adding optional fields
- Adding new response fields
- Bug fixes and performance improvements

## Migration Guides

### Migrating to v1.0.0

No migration needed for existing v0.1.0 users. All endpoints remain backward compatible.

New features available:
- Email notifications (opt-in)
- Webhook integrations (opt-in)
- Enhanced error responses (automatic)

## Deprecation Notices

### None

No endpoints are currently deprecated.

## Rate Limits

### Current Limits (v1.0.0)

| Endpoint Category | Limit | Window |
|------------------|-------|--------|
| General API | 100 requests | 15 minutes |
| Email endpoints | 5 requests | 1 hour |
| Email verification | 3 requests | 1 hour |
| Authentication | 5 requests | 1 hour |

### Rate Limit Headers

All responses include rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1709654400
```

## Support

For API support:
- GitHub Issues: https://github.com/Christopherdominic/soroban-ajo/issues
- Email: support@ajo.app
- Documentation: http://localhost:3001/api-docs

## Feedback

We welcome feedback on the API:
- Feature requests: Create a GitHub issue with the `enhancement` label
- Bug reports: Create a GitHub issue with the `bug` label
- General feedback: Email api-feedback@ajo.app
