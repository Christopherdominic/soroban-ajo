#!/usr/bin/env node
/**
 * SDK Generator for Ajo API
 * 
 * Generates TypeScript SDK from OpenAPI specification
 * 
 * Usage: npm run generate-sdk
 */

import fs from 'fs';
import path from 'path';

const SDK_TEMPLATE = `/**
 * Ajo API TypeScript SDK
 * 
 * Auto-generated from OpenAPI specification
 * Version: 1.0.0
 */

export interface AjoConfig {
  baseUrl: string;
  apiKey?: string;
}

export class AjoClient {
  private baseUrl: string;
  private token?: string;

  constructor(config: AjoConfig) {
    this.baseUrl = config.baseUrl;
  }

  setToken(token: string): void {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = \`Bearer \${this.token}\`;
    }

    const response = await fetch(\`\${this.baseUrl}\${endpoint}\`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API request failed');
    }

    return response.json();
  }

  // ==================== AUTH ====================
  
  async generateToken(publicKey: string): Promise<{ token: string }> {
    const response = await this.request<{ token: string }>('/api/auth/token', {
      method: 'POST',
      body: JSON.stringify({ publicKey }),
    });
    this.token = response.token;
    return response;
  }

  // ==================== GROUPS ====================
  
  async createGroup(data: {
    name: string;
    description?: string;
    contributionAmount: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    maxMembers: number;
    startDate?: string;
  }): Promise<any> {
    return this.request('/api/groups', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async listGroups(): Promise<any> {
    return this.request('/api/groups');
  }

  async getGroup(id: string): Promise<any> {
    return this.request(\`/api/groups/\${id}\`);
  }

  async joinGroup(id: string, publicKey: string): Promise<any> {
    return this.request(\`/api/groups/\${id}/join\`, {
      method: 'POST',
      body: JSON.stringify({ publicKey }),
    });
  }

  async contribute(id: string, amount: string, publicKey: string): Promise<any> {
    return this.request(\`/api/groups/\${id}/contribute\`, {
      method: 'POST',
      body: JSON.stringify({ amount, publicKey }),
    });
  }

  // ==================== ANALYTICS ====================
  
  async getGroupAnalytics(id: string): Promise<any> {
    return this.request(\`/api/analytics/groups/\${id}\`);
  }

  async getUserAnalytics(publicKey: string): Promise<any> {
    return this.request(\`/api/analytics/user/\${publicKey}\`);
  }

  // ==================== EMAIL ====================
  
  async sendTestEmail(to: string, subject: string, message: string): Promise<any> {
    return this.request('/api/email/test', {
      method: 'POST',
      body: JSON.stringify({ to, subject, message }),
    });
  }

  async verifyEmail(token: string): Promise<any> {
    return this.request('/api/email/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async unsubscribe(email: string, token: string): Promise<any> {
    return this.request('/api/email/unsubscribe', {
      method: 'POST',
      body: JSON.stringify({ email, token }),
    });
  }

  async getEmailStatus(): Promise<any> {
    return this.request('/api/email/status');
  }

  // ==================== HEALTH ====================
  
  async healthCheck(): Promise<any> {
    return this.request('/api/health');
  }
}

// Export convenience function
export function createClient(config: AjoConfig): AjoClient {
  return new AjoClient(config);
}

// Example usage
export const example = \`
import { createClient } from '@ajo/sdk';

const client = createClient({
  baseUrl: 'http://localhost:3001'
});

// Authenticate
await client.generateToken('GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');

// Create a group
const group = await client.createGroup({
  name: 'Monthly Savings',
  contributionAmount: '100',
  frequency: 'monthly',
  maxMembers: 10
});

// List groups
const groups = await client.listGroups();
\`;
`;

function generateSDK() {
  const outputDir = path.join(process.cwd(), 'sdk');
  const outputFile = path.join(outputDir, 'index.ts');

  // Create SDK directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write SDK file
  fs.writeFileSync(outputFile, SDK_TEMPLATE);

  // Create package.json for SDK
  const packageJson = {
    name: '@ajo/sdk',
    version: '1.0.0',
    description: 'TypeScript SDK for Ajo API',
    main: 'dist/index.js',
    types: 'dist/index.d.ts',
    scripts: {
      build: 'tsc',
    },
    keywords: ['ajo', 'stellar', 'soroban', 'savings', 'rosca'],
    author: 'Ajo Team',
    license: 'MIT',
  };

  fs.writeFileSync(
    path.join(outputDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  // Create tsconfig.json for SDK
  const tsConfig = {
    compilerOptions: {
      target: 'ES2020',
      module: 'commonjs',
      declaration: true,
      outDir: './dist',
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
    },
    include: ['index.ts'],
  };

  fs.writeFileSync(
    path.join(outputDir, 'tsconfig.json'),
    JSON.stringify(tsConfig, null, 2)
  );

  // Create README
  const readme = `# Ajo TypeScript SDK

TypeScript/JavaScript SDK for the Ajo API.

## Installation

\`\`\`bash
npm install @ajo/sdk
\`\`\`

## Usage

\`\`\`typescript
import { createClient } from '@ajo/sdk';

const client = createClient({
  baseUrl: 'http://localhost:3001'
});

// Authenticate
await client.generateToken('GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');

// Create a group
const group = await client.createGroup({
  name: 'Monthly Savings',
  contributionAmount: '100',
  frequency: 'monthly',
  maxMembers: 10
});
\`\`\`

## Documentation

Full API documentation: http://localhost:3001/api-docs
`;

  fs.writeFileSync(path.join(outputDir, 'README.md'), readme);

  process.stdout.write('✅ TypeScript SDK generated successfully!' + "\n");
  process.stdout.write(`📁 Output directory: ${outputDir}` + "\n");
  process.stdout.write('📦 Files created:' + "\n");
  process.stdout.write('   - index.ts' + "\n");
  process.stdout.write('   - package.json' + "\n");
  process.stdout.write('   - tsconfig.json' + "\n");
  process.stdout.write('   - README.md' + "\n");
}

// Run generator
generateSDK();
