import { Options } from 'swagger-jsdoc';

export const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Drips API - Decentralized Savings Groups',
      version: '1.0.0',
      description: 'API for managing Ajo/ROSCA savings groups on Stellar/Soroban blockchain',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Group: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            contribution_amount: { type: 'string' },
            frequency: { type: 'string', enum: ['daily', 'weekly', 'monthly'] },
            max_members: { type: 'number' },
            current_members: { type: 'number' },
            status: { type: 'string', enum: ['active', 'inactive', 'completed'] },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Member: {
          type: 'object',
          properties: {
            address: { type: 'string' },
            joined_at: { type: 'string', format: 'date-time' },
            contributions_made: { type: 'number' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};
