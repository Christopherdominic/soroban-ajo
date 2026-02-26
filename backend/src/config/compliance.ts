import { z } from 'zod'

// Compliance related configuration schema
const complianceSchema = z.object({
  // provider options: onfido, jumio, sumsub
  KYC_PROVIDER: z.enum(['onfido', 'jumio', 'sumsub']).optional(),

  // transaction limits per KYC level
  TX_LIMIT_LEVEL_0: z.string().transform(Number).default('1000'),
  TX_LIMIT_LEVEL_1: z.string().transform(Number).default('5000'),
  TX_LIMIT_LEVEL_2: z.string().transform(Number).default('20000'),
  TX_LIMIT_LEVEL_3: z.string().transform(Number).default('100000'),

  // AML screening lists (comma separated addresses)
  AML_BLACKLISTED_ADDRESSES: z.string().optional(),
})

type ComplianceConfig = z.infer<typeof complianceSchema>

function loadComplianceConfig(): ComplianceConfig {
  try {
    return complianceSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid compliance configuration:')
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`)
      })
      process.exit(1)
    }
    throw error
  }
}

const config = loadComplianceConfig()

export const complianceConfig = {
  provider: config.KYC_PROVIDER,
  transactionLimits: {
    0: config.TX_LIMIT_LEVEL_0,
    1: config.TX_LIMIT_LEVEL_1,
    2: config.TX_LIMIT_LEVEL_2,
    3: config.TX_LIMIT_LEVEL_3,
  } as Record<number, number>,
  amlBlacklist: config.AML_BLACKLISTED_ADDRESSES
    ? config.AML_BLACKLISTED_ADDRESSES.split(',').map((a) => a.trim()).filter(Boolean)
    : [],
} as const

export type TransactionLimits = typeof complianceConfig.transactionLimits
