import { OpenAPIV3 } from 'openapi-types';

export const openApiSpec: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    title: 'Ajo API',
    version: '1.0.0',
    description: `
# Ajo - Decentralized Savings Groups API

Backend API for Ajo, a blockchain-based savings group platform built on Stellar/Soroban.

## Features
- Create and manage savings groups (ROSCAs)
- Member onboarding and management
- Scheduled contributions tracking
- Transparent fund distribution
- Transaction history on-chain
- Group analytics and insights
- Email notifications
- Webhook integrations

## Base URL
- Development: \`http://localhost:3001\`
- Production: \`https://api.ajo.app\`

## Rate Limiting
- 100 requests per 15 minutes per IP
- Rate limit headers included in responses
    `,
    contact: {
      name: 'Ajo Team',
      email: 'support@ajo.app',
      url: 'https://github.com/Christopherdominic/soroban-ajo',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Development server',
    },
    {
      url: 'https://api.ajo.app',
      description: 'Production server',
    },
  ],
  tags: [
    { name: 'Health', description: 'Health check endpoints' },
    { name: 'Auth', description: 'Authentication endpoints' },
    { name: 'Groups', description: 'Savings group management' },
    { name: 'Analytics', description: 'Analytics and insights' },
    { name: 'Email', description: 'Email service endpoints' },
    { name: 'Webhooks', description: 'Webhook management' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token obtained from /api/auth/token endpoint',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: { type: 'string', example: 'Error message' },
          code: { type: 'string', example: 'ERROR_CODE' },
          details: { type: 'object' },
        },
      },
      Group: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'group_123' },
          name: { type: 'string', example: 'Monthly Savings Group' },
          description: { type: 'string', example: 'Save together, grow together' },
          contributionAmount: { type: 'string', example: '100' },
          frequency: { type: 'string', enum: ['daily', 'weekly', 'monthly'], example: 'monthly' },
          maxMembers: { type: 'integer', example: 10 },
          currentMembers: { type: 'integer', example: 5 },
          status: { type: 'string', enum: ['active', 'completed', 'cancelled'], example: 'active' },
          createdAt: { type: 'string', format: 'date-time' },
          startDate: { type: 'string', format: 'date-time' },
        },
      },
      CreateGroupRequest: {
        type: 'object',
        required: ['name', 'contributionAmount', 'frequency', 'maxMembers'],
        properties: {
          name: { type: 'string', minLength: 3, maxLength: 100 },
          description: { type: 'string', maxLength: 500 },
          contributionAmount: { type: 'string', pattern: '^[0-9]+(\\.[0-9]+)?$' },
          frequency: { type: 'string', enum: ['daily', 'weekly', 'monthly'] },
          maxMembers: { type: 'integer', minimum: 2, maximum: 100 },
          startDate: { type: 'string', format: 'date-time' },
        },
      },
      HealthResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'ok' },
          timestamp: { type: 'string', format: 'date-time' },
          service: { type: 'string', example: 'ajo-backend' },
          version: { type: 'string', example: '0.1.0' },
        },
      },
      AuthTokenRequest: {
        type: 'object',
        required: ['publicKey'],
        properties: {
          publicKey: {
            type: 'string',
            pattern: '^G[A-Z0-9]{55}$',
            example: 'GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
            description: 'Stellar public key',
          },
        },
      },
      AuthTokenResponse: {
        type: 'object',
        properties: {
          token: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            description: 'JWT token for authentication',
          },
        },
      },
    },
    responses: {
      BadRequest: {
        description: 'Bad Request',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: {
              success: false,
              error: 'Invalid request parameters',
              code: 'BAD_REQUEST',
            },
          },
        },
      },
      Unauthorized: {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: {
              success: false,
              error: 'Authentication required',
              code: 'UNAUTHORIZED',
            },
          },
        },
      },
      NotFound: {
        description: 'Not Found',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: {
              success: false,
              error: 'Resource not found',
              code: 'NOT_FOUND',
            },
          },
        },
      },
      RateLimitExceeded: {
        description: 'Rate Limit Exceeded',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: {
              success: false,
              error: 'Too many requests',
              code: 'RATE_LIMIT_EXCEEDED',
            },
          },
        },
      },
      InternalError: {
        description: 'Internal Server Error',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: {
              success: false,
              error: 'Internal server error',
              code: 'INTERNAL_ERROR',
            },
          },
        },
      },
    },
    parameters: {
      GroupId: {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string' },
        description: 'Group ID',
      },
    },
  },
  paths: {},
};
