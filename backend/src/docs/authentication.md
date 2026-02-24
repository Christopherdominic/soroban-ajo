# Authentication

## Overview

The Ajo API uses JWT (JSON Web Tokens) for authentication. Authentication is based on Stellar wallet public keys.

## Authentication Flow

### 1. Obtain JWT Token

**Endpoint**: `POST /api/auth/token`

**Request**:

```json
{
  "publicKey": "GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
}
```

**Response**:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Use Token in Requests

Include the JWT token in the `Authorization` header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Token Details

- **Algorithm**: HS256
- **Expiration**: 7 days (configurable via `JWT_EXPIRES_IN`)
- **Payload**: Contains Stellar public key

## Example Usage

### JavaScript/TypeScript

```typescript
// 1. Get token
const response = await fetch('http://localhost:3001/api/auth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    publicKey: 'GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  }),
})

const { token } = await response.json()

// 2. Use token in subsequent requests
const groupsResponse = await fetch('http://localhost:3001/api/groups', {
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
})
```

### cURL

```bash
# 1. Get authentication token
curl -X POST http://localhost:3001/api/auth/token \
  -H "Content-Type: application/json" \
  -d '{"publicKey":"GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"}' \
  | jq -r '.token' > auth.txt

# 2. Use the token from file
curl http://localhost:3001/api/groups \
  -H "Authorization: Bearer $(cat auth.txt)"
```

## Wallet Integration

### Freighter Wallet

```typescript
import { isConnected, getPublicKey } from '@stellar/freighter-api'

async function authenticate() {
  // Check if Freighter is installed
  const connected = await isConnected()
  if (!connected) {
    throw new Error('Freighter wallet not installed')
  }

  // Get public key
  const publicKey = await getPublicKey()

  // Get JWT token
  const response = await fetch('/api/auth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ publicKey }),
  })

  const { token } = await response.json()

  // Store token
  localStorage.setItem('authToken', token)

  return token
}
```

## Error Responses

### Invalid Public Key

```json
{
  "error": "Invalid public key format"
}
```

**Status Code**: 400

### Token Expired

```json
{
  "success": false,
  "error": "Token expired",
  "code": "UNAUTHORIZED"
}
```

**Status Code**: 401

### Invalid Token

```json
{
  "success": false,
  "error": "Invalid token",
  "code": "UNAUTHORIZED"
}
```

**Status Code**: 401

## Security Best Practices

1. **Store tokens securely**: Use `httpOnly` cookies or secure storage
2. **Never expose tokens**: Don't log or expose tokens in URLs
3. **Refresh tokens**: Implement token refresh before expiration
4. **Validate on server**: Always validate tokens on the server side
5. **Use HTTPS**: Always use HTTPS in production

## Rate Limiting

Authentication endpoints are rate-limited:

- **Token generation**: 5 requests per hour per IP
- **Token verification**: 100 requests per 15 minutes per IP

## Token Refresh

Tokens expire after 7 days. To refresh:

1. Request a new token using the same public key
2. Replace the old token with the new one
3. Update all pending requests with the new token

## Troubleshooting

### "Invalid public key format"

- Ensure the public key starts with 'G'
- Verify the public key is exactly 56 characters
- Check for any whitespace or special characters

### "Token expired"

- Request a new token
- Check system time synchronization

### "Unauthorized"

- Verify the token is included in the Authorization header
- Check the token format: `Bearer <token>`
- Ensure the token hasn't been tampered with
