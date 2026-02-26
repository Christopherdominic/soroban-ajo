import * as yaml from 'js-yaml';
import Joi from 'joi';

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export interface RewardDefinition {
  type: 'FEE_DISCOUNT' | 'BONUS_TOKEN' | 'PREMIUM_FEATURE' | 'NFT_BADGE';
  amount?: number | string;
  featureId?: string;
  nftMetadata?: NFTMetadata;
  expirationDays?: number;
}

export interface AchievementCriteria {
  type: 'FIRST_GROUP' | 'CONTRIBUTION_COUNT' | 'PERFECT_ATTENDANCE' | 'REFERRAL_COUNT';
  threshold?: number;
  consecutiveRequired?: boolean;
}

export interface AchievementConfig {
  name: string;
  description: string;
  criteria: AchievementCriteria;
  rewards: RewardDefinition[];
}

export interface FeatureConfig {
  name: string;
  description: string;
}

export interface RewardConfiguration {
  version: number;
  referralRewards: {
    referrer: RewardDefinition[];
    referee: RewardDefinition[];
  };
  achievements: Record<string, AchievementConfig>;
  features: Record<string, FeatureConfig>;
}

/**
 * Parser for reward configuration files (YAML/JSON)
 */
export class RewardConfigParser {
  private static nftMetadataSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().uri().required(),
    attributes: Joi.array().items(
      Joi.object({
        trait_type: Joi.string().required(),
        value: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
      })
    ),
  });

  private static rewardDefinitionSchema = Joi.object({
    type: Joi.string()
      .valid('FEE_DISCOUNT', 'BONUS_TOKEN', 'PREMIUM_FEATURE', 'NFT_BADGE')
      .required(),
    amount: Joi.alternatives().try(Joi.number(), Joi.string()),
    featureId: Joi.string(),
    nftMetadata: this.nftMetadataSchema,
    expirationDays: Joi.number().integer().min(1),
  });

  private static criteriaSchema = Joi.object({
    type: Joi.string()
      .valid('FIRST_GROUP', 'CONTRIBUTION_COUNT', 'PERFECT_ATTENDANCE', 'REFERRAL_COUNT')
      .required(),
    threshold: Joi.number().integer().min(1),
    consecutiveRequired: Joi.boolean(),
  });

  private static achievementSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    criteria: this.criteriaSchema.required(),
    rewards: Joi.array().items(this.rewardDefinitionSchema).required(),
  });

  private static featureSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
  });

  private static schema = Joi.object({
    version: Joi.number().integer().min(1).required(),
    referralRewards: Joi.object({
      referrer: Joi.array().items(this.rewardDefinitionSchema).required(),
      referee: Joi.array().items(this.rewardDefinitionSchema).required(),
    }).required(),
    achievements: Joi.object()
      .pattern(Joi.string(), this.achievementSchema)
      .required(),
    features: Joi.object()
      .pattern(Joi.string(), this.featureSchema)
      .required(),
  });

  /**
   * Parse YAML or JSON configuration string
   * @param content - Configuration file content
   * @returns Parsed and validated configuration
   * @throws Error if configuration is invalid
   */
  static parse(content: string): RewardConfiguration {
    let parsed: any;

    try {
      // Try parsing as YAML (also works for JSON)
      parsed = yaml.load(content);
    } catch (error) {
      throw new Error(`Failed to parse configuration: ${(error as Error).message}`);
    }

    // Validate against schema
    const { error, value } = this.schema.validate(parsed, {
      abortEarly: false,
      allowUnknown: false,
    });

    if (error) {
      const details = error.details.map((d) => d.message).join('; ');
      throw new Error(`Invalid reward configuration: ${details}`);
    }

    return value as RewardConfiguration;
  }

  /**
   * Serialize configuration object to YAML string
   * @param config - Configuration object
   * @returns YAML string
   */
  static serialize(config: RewardConfiguration): string {
    return yaml.dump(config, {
      indent: 2,
      lineWidth: 100,
      noRefs: true,
      sortKeys: false,
    });
  }

  /**
   * Validate configuration object without parsing from string
   * @param config - Configuration object
   * @returns Validation result
   */
  static validate(config: any): { valid: boolean; errors?: string[] } {
    const { error } = this.schema.validate(config, {
      abortEarly: false,
      allowUnknown: false,
    });

    if (error) {
      return {
        valid: false,
        errors: error.details.map((d) => d.message),
      };
    }

    return { valid: true };
  }
}
