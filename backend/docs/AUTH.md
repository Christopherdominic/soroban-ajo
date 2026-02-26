# JWT Authentication Implementation

## Overview
JWT-based authentication protecting write endpoints (create, join, contribute).

## Setup

1. **Required**: Add to `.env`:
```env
JWT_SECRET=<generate-strong-random-secret>
JWT_EXPIRES_IN=7d
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

2. Dependencies (already installed):
```bash
npm install jsonwebtoken @types/jsonwebtoken
```

## Usage

### 1. Get Token
```bash
POST /api/auth/token
Content-Type: application/json

{
  "publicKey": "GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Note**: Public key must be a valid Stellar address (56 chars, starts with 'G')

### 2. Use Token for Protected Endpoints
```bash
POST /api/groups
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My Group",
  ...
}
```

## Protected Endpoints
- `POST /api/groups` - Create group
- `POST /api/groups/:id/join` - Join group
- `POST /api/groups/:id/contribute` - Make contribution

## Public Endpoints
- `GET /api/groups` - List groups
- `GET /api/groups/:id` - Get group details
- `GET /api/groups/:id/members` - Get members
- `GET /api/groups/:id/transactions` - Get transactions

## Error Responses
- `401 Unauthorized` - Missing, invalid, or expired token
- `400 Bad Request` - Invalid public key format

## Security Features
- ✅ JWT_SECRET required (fails if not set)
- ✅ Stellar public key validation
- ✅ Token expiration (default 7 days)
- ✅ Bearer token authentication
- ✅ No sensitive error details exposed

## Implementation Files
- `backend/src/services/authService.ts` - JWT generation/verification
- `backend/src/middleware/auth.ts` - Auth middleware
- `backend/src/routes/auth.ts` - Token endpoint
- `backend/src/index.ts` - Auth router registration
- `backend/src/routes/groups.ts` - Protected routes
