/**
 * Webhook Type Definitions
 */

export interface WebhookEvent {
  id: string
  event: string
  timestamp: string
  data: Record<string, any>
  metadata?: {
    groupId?: string
    userId?: string
    transactionHash?: string
    network?: string
  }
}

export interface WebhookConfig {
  url: string
  secret: string
  events: string[]
  enabled: boolean
  retryConfig?: {
    maxRetries: number
    retryDelay: number
  }
  headers?: Record<string, string>
}

export interface WebhookDelivery {
  id: string
  webhookId: string
  eventId: string
  status: 'pending' | 'delivered' | 'failed'
  attempts: number
  lastAttempt?: string
  nextRetry?: string
  error?: string
}

export interface WebhookLog {
  id: string
  webhookId: string
  eventType: string
  payload: WebhookEvent
  response?: {
    statusCode: number
    body?: string
  }
  error?: string
  timestamp: string
  duration: number
}
