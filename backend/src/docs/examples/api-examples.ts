/**
 * API Request/Response Examples
 * 
 * This file contains comprehensive examples for all API endpoints
 */

export const examples = {
  // ==================== GROUPS ====================
  groups: {
    createGroup: {
      request: {
        name: 'Monthly Savings Circle',
        description: 'Save $100 monthly with friends',
        contributionAmount: '100',
        frequency: 'monthly',
        maxMembers: 10,
        startDate: '2026-03-01T00:00:00Z',
      },
      response: {
        success: true,
        data: {
          groupId: 'group_abc123',
          txHash: '0x1234567890abcdef...',
          status: 'active',
        },
      },
    },
    listGroups: {
      response: {
        success: true,
        data: [
          {
            id: 'group_abc123',
            name: 'Monthly Savings Circle',
            description: 'Save $100 monthly with friends',
            contributionAmount: '100',
            frequency: 'monthly',
            maxMembers: 10,
            currentMembers: 5,
            status: 'active',
            createdAt: '2026-02-24T10:00:00Z',
            startDate: '2026-03-01T00:00:00Z',
          },
        ],
      },
    },
    getGroup: {
      response: {
        success: true,
        data: {
          id: 'group_abc123',
          name: 'Monthly Savings Circle',
          description: 'Save $100 monthly with friends',
          contributionAmount: '100',
          frequency: 'monthly',
          maxMembers: 10,
          currentMembers: 5,
          status: 'active',
          members: [
            {
              publicKey: 'GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
              joinedAt: '2026-02-24T10:00:00Z',
              contributionsMade: 2,
              totalContributed: '200',
            },
          ],
          createdAt: '2026-02-24T10:00:00Z',
          startDate: '2026-03-01T00:00:00Z',
        },
      },
    },
    joinGroup: {
      request: {
        publicKey: 'GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
      },
      response: {
        success: true,
        data: {
          txHash: '0xabcdef1234567890...',
          message: 'Successfully joined group',
        },
      },
    },
    contribute: {
      request: {
        amount: '100',
        publicKey: 'GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
      },
      response: {
        success: true,
        data: {
          txHash: '0x9876543210fedcba...',
          contributionNumber: 3,
          totalContributed: '300',
        },
      },
    },
  },

  // ==================== AUTHENTICATION ====================
  auth: {
    generateToken: {
      request: {
        publicKey: 'GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
      },
      response: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwdWJsaWNLZXkiOiJHWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWCIsImlhdCI6MTcwOTY1NDQwMCwiZXhwIjoxNzEwMjU5MjAwfQ.signature',
      },
    },
  },

  // ==================== ANALYTICS ====================
  analytics: {
    groupAnalytics: {
      response: {
        success: true,
        data: {
          groupId: 'group_abc123',
          totalContributions: 15,
          totalAmount: '1500',
          averageContribution: '100',
          completionRate: 75,
          activeMembers: 8,
          contributionHistory: [
            {
              date: '2026-02-01',
              amount: '800',
              contributors: 8,
            },
            {
              date: '2026-02-15',
              amount: '700',
              contributors: 7,
            },
          ],
        },
      },
    },
    userAnalytics: {
      response: {
        success: true,
        data: {
          publicKey: 'GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
          totalGroups: 3,
          activeGroups: 2,
          completedGroups: 1,
          totalContributions: 12,
          totalContributed: '1200',
          totalReceived: '400',
          contributionRate: 95,
        },
      },
    },
  },

  // ==================== EMAIL ====================
  email: {
    sendTestEmail: {
      request: {
        to: 'user@example.com',
        subject: 'Test Email',
        message: 'This is a test email from Ajo',
      },
      response: {
        success: true,
        message: 'Email queued',
      },
    },
    verifyEmail: {
      request: {
        token: 'verification_token_abc123',
      },
      response: {
        success: true,
        message: 'Email verified',
      },
    },
    unsubscribe: {
      request: {
        email: 'user@example.com',
        token: 'unsubscribe_token_xyz789',
      },
      response: {
        success: true,
        message: 'Unsubscribed successfully',
      },
    },
    getStatus: {
      response: {
        enabled: true,
        provider: 'SendGrid',
        from: 'noreply@ajo.app',
      },
    },
  },

  // ==================== WEBHOOKS ====================
  webhooks: {
    registerWebhook: {
      request: {
        url: 'https://example.com/webhook',
        events: ['group.created', 'contribution.made', 'payout.completed'],
        secret: 'webhook_secret_key',
        headers: {
          'X-Custom-Header': 'value',
        },
      },
      response: {
        success: true,
        data: {
          id: 'webhook_123',
          url: 'https://example.com/webhook',
          events: ['group.created', 'contribution.made', 'payout.completed'],
          active: true,
        },
      },
    },
    webhookPayload: {
      example: {
        event: 'contribution.made',
        timestamp: '2026-02-24T10:00:00Z',
        data: {
          groupId: 'group_abc123',
          contributor: 'GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
          amount: '100',
          txHash: '0x1234567890abcdef...',
        },
        signature: 'sha256=abcdef1234567890...',
      },
    },
  },

  // ==================== ERRORS ====================
  errors: {
    badRequest: {
      success: false,
      error: 'Invalid request parameters',
      code: 'BAD_REQUEST',
      details: {
        field: 'contributionAmount',
        message: 'Must be a positive number',
      },
    },
    unauthorized: {
      success: false,
      error: 'Authentication required',
      code: 'UNAUTHORIZED',
    },
    notFound: {
      success: false,
      error: 'Group not found',
      code: 'NOT_FOUND',
    },
    rateLimitExceeded: {
      success: false,
      error: 'Too many requests',
      code: 'RATE_LIMIT_EXCEEDED',
    },
    internalError: {
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    },
  },
};
