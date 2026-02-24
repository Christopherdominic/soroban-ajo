import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ajo API',
      version: '1.0.0',
      description: `
# Ajo - Decentralized Savings Groups API

Backend API for Ajo, a blockchain-based savings group platform built on Stellar/Soroban.

## Features
- 🏦 Create and manage savings groups (ROSCAs)
- 👥 Member onboarding and management
- 💰 Scheduled contributions tracking
- 📊 Transparent fund distribution
- 🔗 Transaction history on-chain
- 📈 Group analytics and insights
- 📧 Email notifications
- 🔔 Webhook integrations

## Authentication
All protected endpoints require a JWT token. Obtain a token from \`POST /api/auth/token\` and include it in the \`Authorization\` header:
\`\`\`
Authorization: Bearer <your-jwt-token>
\`\`\`

## Rate Limiting
- **General API**: 100 requests per 15 minutes
- **Email endpoints**: 5 requests per hour
- **Auth endpoints**: 5 requests per hour

Rate limit headers are included in all responses:
- \`X-RateLimit-Limit\`: Maximum requests allowed
- \`X-RateLimit-Remaining\`: Requests remaining
- \`X-RateLimit-Reset\`: Unix timestamp when limit resets

## Error Handling
All errors follow a consistent format:
\`\`\`json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
\`\`\`

## Versioning
Current API version: **v1.0.0**

## Support
- 📖 Documentation: [GitHub](https://github.com/Christopherdominic/soroban-ajo)
- 🐛 Issues: [GitHub Issues](https://github.com/Christopherdominic/soroban-ajo/issues)
- 📧 Email: support@ajo.app
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
      {
        name: 'Health',
        description: 'Health check and service status endpoints',
      },
      {
        name: 'Auth',
        description: 'Authentication and authorization endpoints',
      },
      {
        name: 'Groups',
        description: 'Savings group management - create, join, contribute',
      },
      {
        name: 'Analytics',
        description: 'Analytics and insights for groups and users',
      },
      {
        name: 'Email',
        description: 'Email notification service endpoints',
      },
      {
        name: 'Webhooks',
        description: 'Webhook management and event notifications',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token obtained from POST /api/auth/token',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string', example: 'Error message' },
            code: { type: 'string', example: 'ERROR_CODE' },
            details: { type: 'object', nullable: true },
          },
        },
      },
      responses: {
        BadRequest: {
          description: 'Bad Request - Invalid input parameters',
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
          description: 'Unauthorized - Authentication required or invalid token',
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
          description: 'Not Found - Resource does not exist',
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
          description: 'Rate Limit Exceeded - Too many requests',
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
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts', './src/docs/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerUiOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Ajo API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    tryItOutEnabled: true,
  },
};

export const setupSwagger = (app: Express): void => {
  // Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));
  
  // OpenAPI JSON spec
  app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // API documentation landing page
  app.get('/api-docs/info', (_req, res) => {
    res.json({
      title: 'Ajo API Documentation',
      version: '1.0.0',
      description: 'Decentralized Savings Groups API',
      endpoints: {
        interactive: '/api-docs',
        openapi: '/api-docs.json',
        authentication: '/api-docs/authentication',
        changelog: '/api-docs/changelog',
      },
      resources: {
        github: 'https://github.com/Christopherdominic/soroban-ajo',
        support: 'support@ajo.app',
      },
    });
  });
};
