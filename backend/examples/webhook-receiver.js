/**
 * Example Webhook Receiver (Node.js/Express)
 * 
 * This is a sample implementation showing how to receive and verify
 * webhooks from the Soroban Ajo platform.
 * 
 * Note: This is an example file. In production, replace console.log
 * with proper logging (winston, pino, etc.)
 */

const express = require('express')
const crypto = require('crypto')

const app = express()
app.use(express.json())

// Your webhook secret (from webhook registration)
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'your-secret-key'

/**
 * Verify webhook signature
 */
function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex')
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

/**
 * Main webhook endpoint
 */
app.post('/webhook', async (req, res) => {
  try {
    // Extract headers
    const signature = req.headers['x-webhook-signature']
    const eventType = req.headers['x-webhook-event']
    const eventId = req.headers['x-webhook-id']
    const timestamp = req.headers['x-webhook-timestamp']

    // Verify signature
    if (!signature || !verifyWebhookSignature(req.body, signature, WEBHOOK_SECRET)) {
      console.error('❌ Invalid webhook signature')
      return res.status(401).json({ error: 'Invalid signature' })
    }

    // Extract payload
    const { id, event, data, metadata } = req.body

    console.log('✅ Webhook received:', {
      id,
      event,
      timestamp,
      groupId: metadata?.groupId,
    })

    // Handle different event types
    switch (event) {
      case 'group.created':
        await handleGroupCreated(data, metadata)
        break

      case 'member.joined':
        await handleMemberJoined(data, metadata)
        break

      case 'contribution.made':
        await handleContribution(data, metadata)
        break

      case 'payout.completed':
        await handlePayout(data, metadata)
        break

      case 'cycle.started':
        await handleCycleStarted(data, metadata)
        break

      case 'cycle.ended':
        await handleCycleEnded(data, metadata)
        break

      case 'group.completed':
        await handleGroupCompleted(data, metadata)
        break

      default:
        console.log('⚠️  Unknown event type:', event)
    }

    // Respond immediately (process async)
    res.json({ received: true, eventId: id })

  } catch (error) {
    console.error('❌ Webhook processing error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * Event Handlers
 */

async function handleGroupCreated(data, metadata) {
  console.log('🎉 New group created:', {
    groupId: data.groupId,
    name: data.name,
    creator: data.creator,
    maxMembers: data.maxMembers,
  })

  // Your business logic here
  // - Send notification to creator
  // - Update analytics
  // - Trigger other workflows
}

async function handleMemberJoined(data, metadata) {
  console.log('👥 Member joined group:', {
    groupId: data.groupId,
    member: data.memberAddress,
  })

  // Your business logic here
  // - Send welcome notification
  // - Update group stats
  // - Notify other members
}

async function handleContribution(data, metadata) {
  console.log('💰 Contribution made:', {
    groupId: data.groupId,
    contributor: data.contributor,
    amount: data.amount,
    txHash: data.transactionHash,
  })

  // Your business logic here
  // - Update contribution tracking
  // - Send confirmation notification
  // - Check if cycle is complete
}

async function handlePayout(data, metadata) {
  console.log('💸 Payout completed:', {
    groupId: data.groupId,
    recipient: data.recipient,
    amount: data.amount,
    cycle: data.cycle,
  })

  // Your business logic here
  // - Send payout notification
  // - Update financial records
  // - Trigger next cycle
}

async function handleCycleStarted(data, metadata) {
  console.log('🔄 Cycle started:', {
    groupId: data.groupId,
    cycleNumber: data.cycleNumber,
    recipient: data.recipient,
  })

  // Your business logic here
  // - Notify members
  // - Reset contribution tracking
  // - Update UI
}

async function handleCycleEnded(data, metadata) {
  console.log('✅ Cycle ended:', {
    groupId: data.groupId,
    cycleNumber: data.cycleNumber,
    totalContributions: data.totalContributions,
  })

  // Your business logic here
  // - Calculate statistics
  // - Prepare for next cycle
  // - Send summary notifications
}

async function handleGroupCompleted(data, metadata) {
  console.log('🎊 Group completed:', {
    groupId: data.groupId,
    name: data.name,
    totalCycles: data.totalCycles,
  })

  // Your business logic here
  // - Send completion notifications
  // - Archive group data
  // - Generate final reports
}

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

/**
 * Start server
 */
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 Webhook receiver running on port ${PORT}`)
  console.log(`📡 Endpoint: http://localhost:${PORT}/webhook`)
  console.log(`🔐 Secret configured: ${WEBHOOK_SECRET ? 'Yes' : 'No'}`)
})
