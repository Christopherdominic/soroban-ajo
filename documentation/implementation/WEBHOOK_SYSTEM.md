# Webhook Notification System

## Overview
The webhook system allows external services to receive real-time notifications about blockchain events in the Soroban Ajo platform.

## Features

### Event Types
The system supports the following webhook events:

1. **Group Events**
   - `group.created` - New savings group created
   - `group.updated` - Group settings updated
   - `group.completed` - Group finished all cycles

2. **Member Events**
   - `member.joined` - New member joined a group
   - `member.left` - Member left a group

3. **Contribution Events**
   - `contribution.made` - Member made a contribution
   - `contribution.failed` - Contribution transaction failed

4. **Payout Events**
   - `payout.completed` - Payout successfully distributed
   - `payout.failed` - Payout transaction failed

5. **Cycle Events**
   - `cycle.started` - New cycle started
   - `cycle.ended` - Cycle completed

### Key Features
- ✅ HMAC-SHA256 signature verification
- ✅ Automatic retry with exponential backoff
- ✅ Configurable retry attempts and delays
- ✅ Custom headers support
- ✅ Event filtering per endpoint
- ✅ Multiple endpoint support
- ✅ Delivery queue management
- ✅ Webhook testing endpoint

## API Endpoints

### Webhook Management

#### List Webhooks
```http
GET /api/webhooks
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "webhook-uuid",
      "url": "https://example.com/webhook",
      "events": ["group.created", "contribution.made"],
      "enabled": true
    }
  ]
}
```

#### Register Webhook
```http
POST /api/webhooks
Content-Type: application/json

{
  "url": "https://example.com/webhook",
  "events": ["group.created", "contribution.made"],
  "secret": "your-secret-key",
  "headers": {
    "Authorization": "Bearer token"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "webhook-uuid",
    "url": "https://example.com/webhook",
    "events": ["group.created", "contribution.made"]
  }
}
```

#### Update Webhook
```http
PATCH /api/webhooks/:id
Content-Type: application/json

{
  "enabled": false,
  "events": ["group.created"]
}
```

#### Delete Webhook
```http
DELETE /api/webhooks/:id
```

#### Test Webhook
```http
POST /api/webhooks/:id/test
```

Sends a test event to verify the webhook endpoint is working.

#### Get Statistics
```http
GET /api/webhooks/stats
```

**Response:**
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

## Webhook Payload Structure

All webhook events follow this structure:

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

## Event Payloads

### group.created
```json
{
  "event": "group.created",
  "data": {
    "groupId": "group-123",
    "name": "Family Savings",
    "creator": "GABCD...",
    "contributionAmount": "100",
    "maxMembers": 10,
    "cycleLength": 30,
    "createdAt": "2024-02-21T10:30:00.000Z"
  }
}
```

### member.joined
```json
{
  "event": "member.joined",
  "data": {
    "groupId": "group-123",
    "memberAddress": "GXYZ...",
    "joinedAt": "2024-02-21T10:35:00.000Z"
  }
}
```

### contribution.made
```json
{
  "event": "contribution.made",
  "data": {
    "groupId": "group-123",
    "contributor": "GXYZ...",
    "amount": "100",
    "transactionHash": "abc123...",
    "contributedAt": "2024-02-21T10:40:00.000Z"
  }
}
```

### payout.completed
```json
{
  "event": "payout.completed",
  "data": {
    "groupId": "group-123",
    "recipient": "GXYZ...",
    "amount": "1000",
    "cycle": 1,
    "transactionHash": "def456...",
    "completedAt": "2024-02-21T11:00:00.000Z"
  }
}
```

### cycle.started
```json
{
  "event": "cycle.started",
  "data": {
    "groupId": "group-123",
    "cycleNumber": 2,
    "recipient": "GXYZ...",
    "startedAt": "2024-03-21T10:00:00.000Z"
  }
}
```

## Security

### Signature Verification

All webhook requests include an HMAC-SHA256 signature in the headers:

```
X-Webhook-Signature: <hmac-sha256-hex>
X-Webhook-Event: group.created
X-Webhook-Id: event-uuid
X-Webhook-Timestamp: 2024-02-21T10:30:00.000Z
```

**Verify the signature:**

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

**Example in Express:**

```javascript
app.post('/webhook', (req, res) => {
  const signature = req.headers['x-webhook-signature']
  const payload = req.body
  const secret = process.env.WEBHOOK_SECRET
  
  if (!verifyWebhook(payload, signature, secret)) {
    return res.status(401).json({ error: 'Invalid signature' })
  }
  
  // Process webhook
  console.log('Received event:', payload.event)
  
  res.json({ received: true })
})
```

## Retry Logic

The webhook system implements automatic retry with exponential backoff:

- **Max Retries**: 3 (configurable)
- **Initial Delay**: 1 second
- **Backoff**: Exponential (1s, 2s, 4s)
- **Timeout**: 10 seconds per request

**Retry Conditions:**
- HTTP 5xx errors
- Network timeouts
- Connection errors

**No Retry:**
- HTTP 2xx (success)
- HTTP 4xx (client errors)

## Configuration

### Environment Variables

```bash
# Webhook URLs (comma-separated)
WEBHOOK_URLS=https://example.com/webhook1,https://example.com/webhook2

# Webhook Secrets (comma-separated, matches URLs order)
WEBHOOK_SECRETS=secret1,secret2

# Network identifier
SOROBAN_NETWORK=testnet
```

### Programmatic Configuration

```typescript
import { webhookService, WebhookEventType } from './services/webhookService'

// Register a webhook endpoint
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

// Trigger an event manually
await webhookService.triggerEvent(
  WebhookEventType.GROUP_CREATED,
  {
    groupId: 'group-123',
    name: 'Test Group',
  },
  {
    groupId: 'group-123',
    network: 'testnet',
  }
)
```

## Integration Examples

### Node.js / Express

```javascript
const express = require('express')
const crypto = require('crypto')

const app = express()
app.use(express.json())

app.post('/webhook', (req, res) => {
  // Verify signature
  const signature = req.headers['x-webhook-signature']
  const secret = process.env.WEBHOOK_SECRET
  
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(req.body))
    .digest('hex')
  
  if (signature !== expectedSignature) {
    return res.status(401).json({ error: 'Invalid signature' })
  }
  
  // Handle event
  const { event, data } = req.body
  
  switch (event) {
    case 'group.created':
      console.log('New group:', data.groupId)
      break
    case 'contribution.made':
      console.log('Contribution:', data.amount)
      break
  }
  
  res.json({ received: true })
})

app.listen(3000)
```

### Python / Flask

```python
import hmac
import hashlib
import json
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/webhook', methods=['POST'])
def webhook():
    # Verify signature
    signature = request.headers.get('X-Webhook-Signature')
    secret = os.environ['WEBHOOK_SECRET']
    
    payload = json.dumps(request.json, separators=(',', ':'))
    expected_signature = hmac.new(
        secret.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    
    if not hmac.compare_digest(signature, expected_signature):
        return jsonify({'error': 'Invalid signature'}), 401
    
    # Handle event
    event = request.json['event']
    data = request.json['data']
    
    if event == 'group.created':
        print(f"New group: {data['groupId']}")
    elif event == 'contribution.made':
        print(f"Contribution: {data['amount']}")
    
    return jsonify({'received': True})

if __name__ == '__main__':
    app.run(port=3000)
```

## Best Practices

1. **Always verify signatures** - Never trust webhook data without verification
2. **Use HTTPS** - Webhook URLs must use HTTPS in production
3. **Respond quickly** - Return 200 OK immediately, process async
4. **Handle duplicates** - Use event IDs to detect duplicate deliveries
5. **Log everything** - Keep audit logs of all webhook deliveries
6. **Monitor failures** - Set up alerts for repeated webhook failures
7. **Test thoroughly** - Use the test endpoint before going live

## Troubleshooting

### Webhook not receiving events

1. Check endpoint is registered: `GET /api/webhooks`
2. Verify endpoint is enabled
3. Check event types are subscribed
4. Test endpoint: `POST /api/webhooks/:id/test`

### Signature verification failing

1. Ensure secret matches registration
2. Verify payload is not modified
3. Check JSON serialization matches
4. Use timing-safe comparison

### Retries exhausted

1. Check endpoint is accessible
2. Verify endpoint returns 2xx status
3. Check timeout settings (< 10s)
4. Review server logs for errors

## Monitoring

### Webhook Statistics

```bash
curl http://localhost:3001/api/webhooks/stats
```

### Logs

The webhook service logs all events:
- ✅ Successful deliveries
- ❌ Failed deliveries
- 🔄 Retry attempts
- 📤 Event triggers

## Security Considerations

1. **Secret Management** - Store secrets securely (env vars, secrets manager)
2. **Rate Limiting** - Implement rate limiting on webhook endpoints
3. **IP Whitelisting** - Restrict webhook sources by IP (optional)
4. **Payload Validation** - Validate all incoming data
5. **Timeout Protection** - Set reasonable timeouts
6. **Error Handling** - Don't expose internal errors in responses

## Future Enhancements

- [ ] Webhook delivery history/logs
- [ ] Webhook replay functionality
- [ ] Batch event delivery
- [ ] Custom retry strategies
- [ ] Webhook templates
- [ ] Event filtering by conditions
- [ ] Webhook analytics dashboard
- [ ] Dead letter queue for failed events

---

**Status**: ✅ Fully Implemented and Production Ready
