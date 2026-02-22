# Webhook System Implementation

## Overview
Complete webhook notification system for Soroban Ajo blockchain events.

## Files Created

### Core Implementation
1. **`src/services/webhookService.ts`** - Main webhook service (350+ lines)
   - Event triggering and delivery
   - Endpoint management
   - Signature generation/verification
   - Retry logic with exponential backoff
   - Queue management

2. **`src/middleware/webhook.ts`** - Webhook middleware (400+ lines)
   - Event-specific middleware functions
   - Webhook management controllers
   - Signature verification middleware

3. **`src/routes/webhooks.ts`** - Webhook API routes
   - CRUD operations for webhook endpoints
   - Testing and statistics endpoints

4. **`src/types/webhook.ts`** - TypeScript type definitions
   - WebhookEvent, WebhookConfig, WebhookDelivery, WebhookLog

### Documentation & Examples
5. **`documentation/WEBHOOK_SYSTEM.md`** - Complete documentation (500+ lines)
6. **`examples/webhook-receiver.js`** - Example webhook receiver implementation

### Configuration
7. **`.env.example`** - Updated with webhook configuration

## Features Implemented

### ✅ Core Features
- Event-driven webhook system
- HMAC-SHA256 signature verification
- Automatic retry with exponential backoff
- Multiple endpoint support
- Event filtering per endpoint
- Custom headers support
- Delivery queue management
- Webhook testing endpoint

### ✅ Supported Events
- `group.created` - New group created
- `group.updated` - Group settings updated
- `group.completed` - Group finished
- `member.joined` - Member joined group
- `member.left` - Member left group
- `contribution.made` - Contribution successful
- `contribution.failed` - Contribution failed
- `payout.completed` - Payout distributed
- `payout.failed` - Payout failed
- `cycle.started` - New cycle started
- `cycle.ended` - Cycle completed

### ✅ API Endpoints
- `GET /api/webhooks` - List all webhooks
- `POST /api/webhooks` - Register webhook
- `PATCH /api/webhooks/:id` - Update webhook
- `DELETE /api/webhooks/:id` - Delete webhook
- `GET /api/webhooks/stats` - Get statistics
- `POST /api/webhooks/:id/test` - Test webhook

## Integration

### Automatic Webhook Triggers

Webhooks are automatically triggered after successful operations:

```typescript
// Group creation
router.post('/', controller.createGroup, webhookMiddleware.afterGroupCreated)

// Member joins
router.post('/:id/join', controller.joinGroup, webhookMiddleware.afterMemberJoined)

// Contribution
router.post('/:id/contribute', controller.contribute, webhookMiddleware.afterContribution)
```

### Manual Webhook Triggers

```typescript
import { webhookService, WebhookEventType } from './services/webhookService'

await webhookService.triggerEvent(
  WebhookEventType.GROUP_CREATED,
  {
    groupId: 'group-123',
    name: 'Family Savings',
    creator: 'GABCD...',
  },
  {
    groupId: 'group-123',
    userId: 'GABCD...',
    network: 'testnet',
  }
)
```

## Configuration

### Environment Variables

```bash
# Webhook URLs (comma-separated)
WEBHOOK_URLS=https://example.com/webhook1,https://example.com/webhook2

# Webhook Secrets (comma-separated)
WEBHOOK_SECRETS=secret1,secret2

# Network identifier
SOROBAN_NETWORK=testnet
```

### Programmatic Registration

```typescript
import { webhookService, WebhookEventType } from './services/webhookService'

const webhookId = webhookService.registerEndpoint({
  url: 'https://example.com/webhook',
  secret: 'your-secret-key',
  events: [
    WebhookEventType.GROUP_CREATED,
    WebhookEventType.CONTRIBUTION_MADE,
  ],
  enabled: true,
  retryConfig: {
    maxRetries: 3,
    retryDelay: 1000,
  },
  headers: {
    'Authorization': 'Bearer token',
  },
})
```

## Security

### Signature Verification

All webhooks include HMAC-SHA256 signatures:

```javascript
const crypto = require('crypto')

function verifyWebhook(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex')
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}
```

### Headers

```
X-Webhook-Signature: <hmac-sha256-hex>
X-Webhook-Event: group.created
X-Webhook-Id: event-uuid
X-Webhook-Timestamp: 2024-02-21T10:30:00.000Z
User-Agent: Soroban-Ajo-Webhook/1.0
```

## Testing

### Test Webhook Endpoint

```bash
# Register a webhook
curl -X POST http://localhost:3001/api/webhooks \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/webhook",
    "events": ["group.created"],
    "secret": "test-secret"
  }'

# Test the webhook
curl -X POST http://localhost:3001/api/webhooks/{id}/test
```

### Run Example Receiver

```bash
cd backend/examples
node webhook-receiver.js
```

## Retry Logic

- **Max Retries**: 3 (configurable)
- **Initial Delay**: 1 second
- **Backoff**: Exponential (1s, 2s, 4s)
- **Timeout**: 10 seconds per request

## Monitoring

### Get Statistics

```bash
curl http://localhost:3001/api/webhooks/stats
```

Response:
```json
{
  "success": true,
  "data": {
    "totalEndpoints": 5,
    "activeEndpoints": 4,
    "queuedEvents": 2
  }
}
```

### Logs

The service logs all webhook activities:
- ✅ Successful deliveries
- ❌ Failed deliveries
- 🔄 Retry attempts
- 📤 Event triggers

## Example Payload

```json
{
  "id": "event-uuid",
  "event": "group.created",
  "timestamp": "2024-02-21T10:30:00.000Z",
  "data": {
    "groupId": "group-123",
    "name": "Family Savings",
    "creator": "GABCD...",
    "contributionAmount": "100",
    "maxMembers": 10,
    "cycleLength": 30,
    "createdAt": "2024-02-21T10:30:00.000Z"
  },
  "metadata": {
    "groupId": "group-123",
    "userId": "GABCD...",
    "network": "testnet"
  }
}
```

## Best Practices

1. ✅ Always verify signatures
2. ✅ Use HTTPS in production
3. ✅ Respond quickly (< 10s)
4. ✅ Handle duplicates with event IDs
5. ✅ Log all webhook deliveries
6. ✅ Monitor for failures
7. ✅ Test before going live

## Troubleshooting

### Webhook not receiving events
1. Check endpoint is registered: `GET /api/webhooks`
2. Verify endpoint is enabled
3. Check event types are subscribed
4. Test endpoint: `POST /api/webhooks/:id/test`

### Signature verification failing
1. Ensure secret matches registration
2. Verify payload is not modified
3. Check JSON serialization
4. Use timing-safe comparison

### Retries exhausted
1. Check endpoint is accessible
2. Verify endpoint returns 2xx
3. Check timeout settings
4. Review server logs

## Future Enhancements

- [ ] Webhook delivery history/logs
- [ ] Webhook replay functionality
- [ ] Batch event delivery
- [ ] Custom retry strategies
- [ ] Webhook templates
- [ ] Event filtering by conditions
- [ ] Analytics dashboard
- [ ] Dead letter queue

## Dependencies

No additional dependencies required! Uses built-in Node.js modules:
- `crypto` - For HMAC signature generation
- `fetch` - For HTTP requests (Node 18+)

## Status

✅ **Fully Implemented and Production Ready**

All webhook functionality is complete and tested. The system is ready for production use with proper security, retry logic, and monitoring.

---

For detailed documentation, see `documentation/WEBHOOK_SYSTEM.md`
