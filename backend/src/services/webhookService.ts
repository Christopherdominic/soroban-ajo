import * as crypto from 'crypto'

/**
 * Webhook Event Types
 */
export enum WebhookEventType {
  GROUP_CREATED = 'group.created',
  GROUP_UPDATED = 'group.updated',
  GROUP_COMPLETED = 'group.completed',
  MEMBER_JOINED = 'member.joined',
  MEMBER_LEFT = 'member.left',
  CONTRIBUTION_MADE = 'contribution.made',
  CONTRIBUTION_FAILED = 'contribution.failed',
  PAYOUT_COMPLETED = 'payout.completed',
  PAYOUT_FAILED = 'payout.failed',
  CYCLE_STARTED = 'cycle.started',
  CYCLE_ENDED = 'cycle.ended',
}

/**
 * Webhook Payload Structure
 */
export interface WebhookPayload {
  id: string
  event: WebhookEventType
  timestamp: string
  data: Record<string, any>
  metadata?: {
    groupId?: string
    userId?: string
    transactionHash?: string
    network?: string
  }
}

/**
 * Webhook Endpoint Configuration
 */
export interface WebhookEndpoint {
  id: string
  url: string
  secret: string
  events: WebhookEventType[]
  enabled: boolean
  retryConfig?: {
    maxRetries: number
    retryDelay: number
  }
  headers?: Record<string, string>
}

/**
 * Webhook Delivery Result
 */
export interface WebhookDeliveryResult {
  success: boolean
  statusCode?: number
  error?: string
  timestamp: string
  attempts: number
}

/**
 * Webhook Service
 * Handles webhook registration, event dispatching, and delivery
 */
export class WebhookService {
  private endpoints: Map<string, WebhookEndpoint> = new Map()
  private deliveryQueue: WebhookPayload[] = []
  private isProcessing = false

  constructor() {
    // Load webhook endpoints from environment or database
    this.loadEndpoints()
  }

  /**
   * Register a new webhook endpoint
   */
  registerEndpoint(endpoint: Omit<WebhookEndpoint, 'id'>): string {
    const id = crypto.randomUUID()
    const webhookEndpoint: WebhookEndpoint = {
      id,
      ...endpoint,
      retryConfig: endpoint.retryConfig || {
        maxRetries: 3,
        retryDelay: 1000,
      },
    }

    this.endpoints.set(id, webhookEndpoint)
    // Webhook endpoint registered
    return id
  }

  /**
   * Unregister a webhook endpoint
   */
  unregisterEndpoint(id: string): boolean {
    const deleted = this.endpoints.delete(id)
    // Webhook endpoint unregistered
    return deleted
  }

  /**
   * Update webhook endpoint configuration
   */
  updateEndpoint(id: string, updates: Partial<WebhookEndpoint>): boolean {
    const endpoint = this.endpoints.get(id)
    if (!endpoint) return false

    this.endpoints.set(id, { ...endpoint, ...updates })
    // Webhook endpoint updated
    return true
  }

  /**
   * Get all registered endpoints
   */
  getEndpoints(): WebhookEndpoint[] {
    return Array.from(this.endpoints.values())
  }

  /**
   * Get endpoint by ID
   */
  getEndpoint(id: string): WebhookEndpoint | undefined {
    return this.endpoints.get(id)
  }

  /**
   * Trigger a webhook event
   */
  async triggerEvent(
    event: WebhookEventType,
    data: Record<string, any>,
    metadata?: WebhookPayload['metadata']
  ): Promise<void> {
    const payload: WebhookPayload = {
      id: crypto.randomUUID(),
      event,
      timestamp: new Date().toISOString(),
      data,
      metadata,
    }

    // Webhook event triggered
    // Add to delivery queue
    this.deliveryQueue.push(payload)

    // Process queue if not already processing
    if (!this.isProcessing) {
      await this.processQueue()
    }
  }

  /**
   * Process webhook delivery queue
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.deliveryQueue.length === 0) {
      return
    }

    this.isProcessing = true

    while (this.deliveryQueue.length > 0) {
      const payload = this.deliveryQueue.shift()
      if (!payload) continue

      await this.deliverPayload(payload)
    }

    this.isProcessing = false
  }

  /**
   * Deliver webhook payload to all subscribed endpoints
   */
  private async deliverPayload(payload: WebhookPayload): Promise<void> {
    const subscribedEndpoints = Array.from(this.endpoints.values()).filter(
      (endpoint) =>
        endpoint.enabled && endpoint.events.includes(payload.event)
    )

    if (subscribedEndpoints.length === 0) {
      // No endpoints subscribed to event
      return
    }

    const deliveryPromises = subscribedEndpoints.map((endpoint) =>
      this.deliverToEndpoint(endpoint, payload)
    )

    await Promise.allSettled(deliveryPromises)
  }

  /**
   * Deliver payload to a specific endpoint with retry logic
   */
  private async deliverToEndpoint(
    endpoint: WebhookEndpoint,
    payload: WebhookPayload,
    attempt: number = 1
  ): Promise<WebhookDeliveryResult> {
    const maxRetries = endpoint.retryConfig?.maxRetries || 3
    const retryDelay = endpoint.retryConfig?.retryDelay || 1000

    try {
      // Generate signature for payload verification
      const signature = this.generateSignature(payload, endpoint.secret)

      // Prepare headers
      const headers = {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
        'X-Webhook-Event': payload.event,
        'X-Webhook-Id': payload.id,
        'X-Webhook-Timestamp': payload.timestamp,
        'User-Agent': 'Soroban-Ajo-Webhook/1.0',
        ...endpoint.headers,
      }

      // Send webhook
      const response = await fetch(endpoint.url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000), // 10 second timeout
      })

      if (response.ok) {
        // Webhook delivered successfully
        return {
          success: true,
          statusCode: response.status,
          timestamp: new Date().toISOString(),
          attempts: attempt,
        }
      }

      // Non-2xx response
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'

      console.error(
        `❌ Webhook delivery failed: ${endpoint.id} (attempt ${attempt}/${maxRetries})`,
        errorMessage
      )

      // Retry logic
      if (attempt < maxRetries) {
        // Retrying webhook delivery
        await this.sleep(retryDelay * attempt) // Exponential backoff
        return this.deliverToEndpoint(endpoint, payload, attempt + 1)
      }

      return {
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
        attempts: attempt,
      }
    }
  }

  /**
   * Generate HMAC signature for webhook payload
   */
  private generateSignature(payload: WebhookPayload, secret: string): string {
    const payloadString = JSON.stringify(payload)
    return crypto
      .createHmac('sha256', secret)
      .update(payloadString)
      .digest('hex')
  }

  /**
   * Verify webhook signature
   */
  verifySignature(
    payload: WebhookPayload,
    signature: string,
    secret: string
  ): boolean {
    const expectedSignature = this.generateSignature(payload, secret)
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  }

  /**
   * Load webhook endpoints from configuration
   */
  private loadEndpoints(): void {
    // Load from environment variables
    const webhookUrls = process.env.WEBHOOK_URLS?.split(',') || []
    const webhookSecrets = process.env.WEBHOOK_SECRETS?.split(',') || []

    webhookUrls.forEach((url, index) => {
      if (url.trim()) {
        this.registerEndpoint({
          url: url.trim(),
          secret: webhookSecrets[index]?.trim() || this.generateSecret(),
          events: Object.values(WebhookEventType),
          enabled: true,
        })
      }
    })

    // Webhook endpoints loaded
  }

  /**
   * Generate a secure webhook secret
   */
  private generateSecret(): string {
    return crypto.randomBytes(32).toString('hex')
  }

  /**
   * Sleep utility for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * Get webhook statistics
   */
  getStats(): {
    totalEndpoints: number
    activeEndpoints: number
    queuedEvents: number
  } {
    return {
      totalEndpoints: this.endpoints.size,
      activeEndpoints: Array.from(this.endpoints.values()).filter(
        (e) => e.enabled
      ).length,
      queuedEvents: this.deliveryQueue.length,
    }
  }
}

// Singleton instance
export const webhookService = new WebhookService()
