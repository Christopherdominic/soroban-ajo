import { z } from 'zod'

// Environment variable schema with validation
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3001'),
  
  // Frontend
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),
  
  // Soroban/Stellar Configuration
  SOROBAN_RPC_URL: z.string().url(),
  SOROBAN_NETWORK_PASSPHRASE: z.string(),
  SOROBAN_CONTRACT_ID: z.string().min(1),
  SOROBAN_NETWORK: z.enum(['testnet', 'mainnet', 'futurenet']).default('testnet'),
  SOROBAN_SIMULATION_ACCOUNT: z.string().optional(),
  
  // JWT Authentication
  JWT_SECRET: z.string().min(32).optional(),
  JWT_EXPIRES_IN: z.string().default('7d'),
  
  // Webhook Configuration
  WEBHOOK_URLS: z.string().optional(),
  WEBHOOK_SECRETS: z.string().optional(),
})

export type Config = z.infer<typeof envSchema>

// Validate and export configuration
function loadConfig(): Config {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment configuration:')
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`)
      })
      process.exit(1)
    }
    throw error
  }
}

export const config = loadConfig()

// Export specific config sections for easier access
export const sorobanConfig = {
  rpcUrl: config.SOROBAN_RPC_URL,
  networkPassphrase: config.SOROBAN_NETWORK_PASSPHRASE,
  contractId: config.SOROBAN_CONTRACT_ID,
  network: config.SOROBAN_NETWORK,
  simulationAccount: config.SOROBAN_SIMULATION_ACCOUNT,
} as const

export const serverConfig = {
  port: config.PORT,
  nodeEnv: config.NODE_ENV,
  frontendUrl: config.FRONTEND_URL,
  isDevelopment: config.NODE_ENV === 'development',
  isProduction: config.NODE_ENV === 'production',
  isTest: config.NODE_ENV === 'test',
} as const

export const authConfig = {
  jwtSecret: config.JWT_SECRET,
  jwtExpiresIn: config.JWT_EXPIRES_IN,
} as const

export const webhookConfig = {
  urls: config.WEBHOOK_URLS?.split(',').filter(Boolean) || [],
  secrets: config.WEBHOOK_SECRETS?.split(',').filter(Boolean) || [],
} as const
