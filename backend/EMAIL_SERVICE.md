# Email Service Implementation

## ✅ Status: FULLY IMPLEMENTED

Complete email service with SendGrid, Bull queue, and rate limiting.

## Features Implemented

### ✅ Email Service
- SendGrid integration
- 7 email templates (inline HTML)
- Graceful fallback when disabled
- Error handling and logging

### ✅ Email Templates
1. **Welcome Email** - New user onboarding
2. **Contribution Reminder** - Payment due notifications
3. **Payout Notification** - Successful payout alerts
4. **Group Invitation** - Invite users to groups
5. **Weekly Summary** - Activity digest
6. **Transaction Receipt** - Contribution confirmation
7. **Email Verification** - Account verification

### ✅ Email Queue (Bull)
- Redis-backed job queue
- Automatic retries (3 attempts)
- Exponential backoff
- Job completion tracking
- Failed job logging

### ✅ Rate Limiting
- Email endpoints: 5 per hour per IP
- Verification: 3 attempts per hour
- Prevents abuse and spam

### ✅ API Endpoints
- `POST /api/email/test` - Send test email
- `POST /api/email/verify` - Verify email address
- `POST /api/email/unsubscribe` - Unsubscribe from emails
- `GET /api/email/status` - Check service status
- `POST /api/email/welcome` - Send welcome email

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

Dependencies added:
- `@sendgrid/mail` - SendGrid SDK
- `bull` - Job queue
- `ioredis` - Redis client
- `mjml` - Email templates (optional)

### 2. Set Up Environment Variables
```env
# SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key_here
EMAIL_FROM=noreply@ajo.app

# Redis (for queue)
REDIS_URL=redis://localhost:6379

# Frontend URL (for links)
FRONTEND_URL=http://localhost:3000
```

### 3. Start Redis (Required for Queue)
```bash
# Using Docker
docker run -d -p 6379:6379 redis:alpine

# Or install locally
# macOS: brew install redis && redis-server
# Ubuntu: sudo apt install redis-server && redis-server
```

### 4. Test the Service
```bash
# Start backend
npm run dev

# Test email status
curl http://localhost:3001/api/email/status

# Send test email (requires SendGrid key)
curl -X POST http://localhost:3001/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"to":"test@example.com","subject":"Test","message":"Hello!"}'
```

## Usage Examples

### Send Welcome Email
```typescript
import { queueEmail } from './queues/emailQueue';

await queueEmail.welcome('user@example.com', 'John Doe');
```

### Send Contribution Reminder
```typescript
await queueEmail.contributionReminder(
  'user@example.com',
  'Savings Group A',
  '100 XLM',
  '2026-03-01'
);
```

### Send Payout Notification
```typescript
await queueEmail.payout(
  'user@example.com',
  'Savings Group A',
  '1000 XLM',
  'abc123...xyz'
);
```

### Send Group Invitation
```typescript
await queueEmail.invitation(
  'newuser@example.com',
  'Savings Group A',
  'John Doe',
  'https://ajo.app/invite/abc123'
);
```

### Send Email Verification
```typescript
await queueEmail.verification('user@example.com', 'verification_token_123');
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Email Service Flow                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Application calls queueEmail.welcome()                   │
│     │                                                        │
│     ▼                                                        │
│  2. Job added to Bull Queue (Redis)                         │
│     │                                                        │
│     ▼                                                        │
│  3. Queue worker processes job                              │
│     │                                                        │
│     ▼                                                        │
│  4. EmailService.sendWelcomeEmail()                         │
│     │                                                        │
│     ▼                                                        │
│  5. SendGrid API sends email                                │
│     │                                                        │
│     ▼                                                        │
│  6. Success/Failure logged                                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## File Structure

```
backend/
├── src/
│   ├── services/
│   │   └── emailService.ts          # Email service with templates
│   ├── queues/
│   │   └── emailQueue.ts            # Bull queue configuration
│   ├── controllers/
│   │   └── emailController.ts       # Email endpoints
│   ├── routes/
│   │   └── email.ts                 # Email routes
│   └── middleware/
│       └── emailRateLimiter.ts      # Rate limiting
└── .env.example                     # Environment variables
```

## Email Templates

All templates include:
- Responsive HTML design
- Inline CSS for email client compatibility
- Unsubscribe links
- Brand colors (Indigo #4F46E5)
- Call-to-action buttons

### Template Customization

Edit templates in `emailService.ts`:
```typescript
private getWelcomeTemplate(name: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h1>Welcome ${name}!</h1>
      <!-- Your custom HTML -->
    </div>
  `;
}
```

## Configuration

### SendGrid Setup
1. Sign up at https://sendgrid.com
2. Create API key with "Mail Send" permissions
3. Add to `.env`: `SENDGRID_API_KEY=SG.xxx`
4. Verify sender email in SendGrid dashboard

### Redis Setup
- **Local**: Install Redis and run `redis-server`
- **Docker**: `docker run -d -p 6379:6379 redis:alpine`
- **Cloud**: Use Redis Cloud, AWS ElastiCache, or Upstash

### Rate Limiting
Adjust limits in `emailRateLimiter.ts`:
```typescript
export const emailRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 emails per hour
});
```

## Testing

### Without SendGrid (Development)
Service works without API key - logs emails instead of sending:
```
Email service disabled. Would send: Welcome to Ajo!
```

### With SendGrid (Production)
Set `SENDGRID_API_KEY` and emails will be sent.

### Test Endpoints
```bash
# Check status
curl http://localhost:3001/api/email/status

# Send test email
curl -X POST http://localhost:3001/api/email/test \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "message": "This is a test"
  }'

# Send welcome email
curl -X POST http://localhost:3001/api/email/welcome \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "John Doe"
  }'
```

## Queue Management

### Monitor Queue
```typescript
import { emailQueue } from './queues/emailQueue';

// Get queue stats
const jobCounts = await emailQueue.getJobCounts();
console.log(jobCounts); // { waiting, active, completed, failed }

// Get failed jobs
const failed = await emailQueue.getFailed();
```

### Retry Failed Jobs
```typescript
const failed = await emailQueue.getFailed();
for (const job of failed) {
  await job.retry();
}
```

### Clear Queue
```typescript
await emailQueue.empty(); // Remove all jobs
await emailQueue.clean(1000); // Remove completed jobs older than 1s
```

## Production Deployment

### Environment Variables
```env
SENDGRID_API_KEY=SG.production_key_here
EMAIL_FROM=noreply@yourdomain.com
REDIS_URL=redis://your-redis-host:6379
FRONTEND_URL=https://yourdomain.com
```

### Redis Hosting
- **Upstash**: Serverless Redis (free tier)
- **Redis Cloud**: Managed Redis
- **AWS ElastiCache**: Enterprise Redis
- **Railway**: Simple deployment

### Monitoring
- SendGrid dashboard for delivery stats
- Bull Board for queue monitoring
- Application logs for errors

## Troubleshooting

### Emails Not Sending
1. Check `SENDGRID_API_KEY` is set
2. Verify sender email in SendGrid
3. Check Redis is running
4. Review application logs

### Queue Not Processing
1. Ensure Redis is accessible
2. Check `REDIS_URL` is correct
3. Verify queue worker is running
4. Check for connection errors

### Rate Limit Errors
- Wait for rate limit window to reset
- Adjust limits in `emailRateLimiter.ts`
- Use different IP or authentication

## Future Enhancements

- [ ] Email delivery tracking
- [ ] Bounce handling
- [ ] Email analytics dashboard
- [ ] A/B testing for templates
- [ ] Multi-language support
- [ ] Rich text editor for custom emails
- [ ] Email scheduling
- [ ] Batch sending

## API Documentation

Full API docs available at: http://localhost:3001/api-docs

## Support

For issues or questions:
1. Check logs: `npm run dev`
2. Test endpoints with curl
3. Verify environment variables
4. Check Redis connection

## License

Part of the Ajo project.
