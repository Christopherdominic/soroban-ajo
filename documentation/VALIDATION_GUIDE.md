# API Request Validation Guide

This document describes the Zod-based request validation implemented for all API endpoints.

## Overview

All API endpoints now use Zod schemas for request validation, ensuring type safety and providing clear error messages for invalid requests.

## Implementation

### Files Created/Modified

1. **`backend/src/validators/groups.ts`** - Zod validation schemas
2. **`backend/src/middleware/validateRequest.ts`** - Validation middleware
3. **`backend/src/controllers/groupsController.ts`** - Updated with type-safe inputs
4. **`backend/src/routes/groups.ts`** - Added validation middleware to routes

## Validation Schemas

### Create Group
```typescript
POST /api/groups
{
  "name": "string (1-100 chars, required)",
  "contributionAmount": "number (positive, required)",
  "cycleDuration": "number (positive integer, required)",
  "maxMembers": "number (2-100, required)",
  "publicKey": "string (56 chars, starts with G, required)",
  "description": "string (max 500 chars, optional)"
}
```

### Join Group
```typescript
POST /api/groups/:id/join
{
  "publicKey": "string (56 chars, starts with G, required)"
}
```

### Contribute
```typescript
POST /api/groups/:id/contribute
{
  "amount": "string (positive number, required)",
  "publicKey": "string (56 chars, starts with G, required)"
}
```

### Pagination (Query Params)
```typescript
GET /api/groups?page=1&limit=20
- page: number (min: 1, default: 1)
- limit: number (1-100, default: 20)
```

## Error Response Format

When validation fails, the API returns a 400 status with:

```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "name",
      "message": "Group name is required"
    },
    {
      "field": "contributionAmount",
      "message": "Contribution amount must be positive"
    }
  ]
}
```

## Example Validation Errors

### Invalid Public Key
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "publicKey",
      "message": "Public key must be 56 characters"
    }
  ]
}
```

### Invalid Max Members
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "maxMembers",
      "message": "Max members must be at least 2"
    }
  ]
}
```

### Invalid Pagination
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "limit",
      "message": "Limit must be between 1 and 100"
    }
  ]
}
```

## Testing Validation

### Valid Request
```bash
curl -X POST http://localhost:3001/api/groups \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "My Savings Group",
    "contributionAmount": 100,
    "cycleDuration": 30,
    "maxMembers": 10,
    "publicKey": "GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "description": "A group for monthly savings"
  }'
```

### Invalid Request (Missing Required Fields)
```bash
curl -X POST http://localhost:3001/api/groups \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "My Group"
  }'
```

Response:
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "contributionAmount",
      "message": "Required"
    },
    {
      "field": "cycleDuration",
      "message": "Required"
    },
    {
      "field": "maxMembers",
      "message": "Required"
    },
    {
      "field": "publicKey",
      "message": "Required"
    }
  ]
}
```

## Benefits

1. **Type Safety**: TypeScript types are inferred from Zod schemas
2. **Clear Error Messages**: Users get specific feedback on what's wrong
3. **Consistent Validation**: All endpoints use the same validation approach
4. **Runtime Safety**: Validates data at runtime, not just compile time
5. **Easy to Extend**: Add new validation rules by updating schemas

## Adding New Validation

To add validation for a new endpoint:

1. Define the schema in `validators/groups.ts`:
```typescript
export const myNewSchema = z.object({
  field: z.string().min(1, 'Field is required'),
})
```

2. Add validation middleware to the route:
```typescript
router.post('/my-endpoint',
  validateRequest({ body: myNewSchema }),
  controller.myHandler.bind(controller)
)
```

3. Use the inferred type in the controller:
```typescript
type MyNewInput = z.infer<typeof myNewSchema>

async myHandler(req: Request, res: Response, next: NextFunction) {
  const data: MyNewInput = req.body
  // data is now type-safe
}
```
