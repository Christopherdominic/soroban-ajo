# Webhook System - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Configure Environment

Add to your `.env` file:

```bash
# Webhook Configuration
WEBHOOK_URLS=https://your-domain.com/webhook
WEBHOOK_SECRETS=your-secret-key-here
SOROBAN_NETWORK=testnet
```

### Step 2: Start the Server

```bash
cd backend
npm run dev
```

You should see:
```
🚀 Backend server running on port 3001
📡 Environment: development
🔔 Webhook system initialized
📋 Loaded 1 webhook endpoint(s)
```

### Step 3: Test Your Webhook

#### Option A: Use the Test Endpoint

```bash
# List webhooks
curl http://localhost:3001/api/webhooks

# Test a webhook
curl -X POST http://localhost:3001/api/webhooks/{id}/test
```

#### Option B: Trigger a Real Event

```bash
# Create a group (triggers group.created webhook)
curl -X POST http://localhost:3001/api/groups \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Group",
    "creator": "GABCD...",
    "contributionAmount": "100",
    "maxMembers": 10
  }'
```

### Step 4: Receive Webhooks

Create a simple receiver (or use the example):

```javascript
// webhook-receiver.js
const express = require('express')
const crypto = require('crypto')

const app = express()
app.use(express.json())

app.post('/webhook', (req, res) => {
  // Verify signature
  const signature = req.headers['x-webhook-signature']
  const secret = 'your-secret-key-here'
  
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(req.body))
    .digest('hex')
  
  if (signature !== expectedSignature) {
    return res.status(401).json({ error: 'Invalid signature' })
  }
  
  // Handle event
  console.log('Received webhook:', req.body.event)
  console.log('Data:', req.body.data)
  
  res.json({ received: true })
})

app.listen(3000, () => {
  console.log('Webhook receiver running on port 3000')
})
```

Run it:
```bash
node webhook-receiver.js
```

## 📝 Register Additional Webhooks

### Via API

```bash
curl -X POST http://localhost:3001/api/webhooks \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-domain.com/webhook",
    "events": [
      "group.created",
      "contribution.made",
      "payout.completed"
    ],
    "secret": "your-secret-key",
    "headers": {
      "Authorization": "Bearer your-token"
    }
  }'
```

### Via Code

```typescript
import { webhookService, WebhookEventType } from './services/webhookService'

const webhookId = webhookService.registerEndpoint({
  url: 'https://your-domain.com/webhook',
  secret: 'your-secret-key',
  events: [
    WebhookEventType.GROUP_CREATED,
    WebhookEventType.CONTRIBUTION_MADE,
    WebhookEventType.PAYOUT_COMPLETED,
  ],
  enabled: true,
})

console.log('Webhook registered:', webhookId)
```

## 🔍 Monitor Webhooks

### Get Statistics

```bash
curl http://localhost:3001/api/webhooks/stats
```

### List All Webhooks

```bash
curl http://localhost:3001/api/webhooks
```

### Check Logs

Watch the console for webhook activity:
```
📤 Webhook event triggered: group.created
✅ Webhook delivered successfully: webhook-id (group.created)
```

## 🎯 Common Use Cases

### 1. Send Email Notifications

```javascript
app.post('/webhook', async (req, res) => {
  const { event, data } = req.body
  
  if (event === 'contribution.made') {
    await sendEmail({
      to: data.contributor,
      subject: 'Contribution Received',
      body: `Your contribution of ${data.amount} was received!`
    })
  }
  
  res.json({ received: true })
})
```

### 2. Update Analytics

```javascript
app.post('/webhook', async (req, res) => {
  const { event, data } = req.body
  
  if (event === 'group.created') {
    await analytics.track('Group Created', {
      groupId: data.groupId,
      creator: data.creator,
      maxMembers: data.maxMembers,
    })
  }
  
  res.json({ received: true })
})
```

### 3. Sync with Database

```javascript
app.post('/webhook', async (req, res) => {
  const { event, data } = req.body
  
  if (event === 'payout.completed') {
    await db.payouts.create({
      groupId: data.groupId,
      recipient: data.recipient,
      amount: data.amount,
      transactionHash: data.transactionHash,
    })
  }
  
  res.json({ received: true })
})
```

## 🔐 Security Checklist

- ✅ Always verify webhook signatures
- ✅ Use HTTPS in production
- ✅ Keep secrets secure (environment variables)
- ✅ Validate all incoming data
- ✅ Respond quickly (< 10 seconds)
- ✅ Log all webhook activity
- ✅ Monitor for failures

## 🐛 Troubleshooting

### Webhook not receiving events

1. Check webhook is registered:
   ```bash
   curl http://localhost:3001/api/webhooks
   ```

2. Verify webhook is enabled:
   ```json
   { "enabled": true }
   ```

3. Check subscribed events:
   ```json
   { "events": ["group.created", "contribution.made"] }
   ```

4. Test the endpoint:
   ```bash
   curl -X POST http://localhost:3001/api/webhooks/{id}/test
   ```

### Signature verification failing

1. Ensure secret matches:
   ```javascript
   const secret = process.env.WEBHOOK_SECRET
   ```

2. Don't modify the payload:
   ```javascript
   // Use raw body
   const payload = JSON.stringify(req.body)
   ```

3. Use timing-safe comparison:
   ```javascript
   crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b))
   ```

### Webhook timing out

1. Respond immediately:
   ```javascript
   res.json({ received: true })
   // Then process async
   processWebhook(req.body).catch(console.error)
   ```

2. Check endpoint is accessible:
   ```bash
   curl https://your-domain.com/webhook
   ```

3. Verify timeout settings (< 10s)

## 📚 Next Steps

1. Read the full documentation: `documentation/WEBHOOK_SYSTEM.md`
2. Review the example receiver: `examples/webhook-receiver.js`
3. Check the implementation guide: `WEBHOOK_README.md`
4. Test all event types
5. Set up monitoring and alerts
6. Deploy to production

## 🆘 Need Help?

- Check the logs for error messages
- Review the documentation
- Test with the example receiver
- Verify your configuration

---

**Happy Webhooking!** 🎉
