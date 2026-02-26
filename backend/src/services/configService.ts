import { PrismaClient } from '@prisma/client';
import { auditLog } from './auditService';

const prisma = new PrismaClient();

let configCache: Record<string, unknown> | null = null;
let cacheExpiry = 0;

async function loadConfig(): Promise<Record<string, unknown>> {
  if (configCache && Date.now() < cacheExpiry) return configCache;

  const entries = await prisma.systemConfig.findMany();
  const config: Record<string, unknown> = {};
  for (const e of entries) {
    config[e.key] = JSON.parse(e.value);
  }

  configCache = config;
  cacheExpiry = Date.now() + 60_000;
  return config;
}

export async function getConfig() {
  return loadConfig();
}

export async function getConfigValue<T = unknown>(key: string, fallback?: T): Promise<T> {
  const config = await loadConfig();
  return (config[key] ?? fallback) as T;
}

export async function setConfig(params: {
  adminId: string;
  key: string;
  value: unknown;
  description?: string;
}) {
  const prev = await getConfigValue(params.key);

  await prisma.systemConfig.upsert({
    where: { key: params.key },
    create: {
      key: params.key,
      value: JSON.stringify(params.value),
      description: params.description,
    },
    update: {
      value: JSON.stringify(params.value),
      ...(params.description ? { description: params.description } : {}),
    },
  });

  configCache = null;

  await auditLog({
    adminId: params.adminId,
    action: 'update_config',
    targetType: 'system_config',
    targetId: params.key,
    metadata: { key: params.key, prev, next: params.value },
  });
}

export async function setMaintenanceMode(adminId: string, enabled: boolean, message?: string) {
  await setConfig({ adminId, key: 'maintenance_mode', value: { enabled, message } });
}

export async function setFeatureFlag(adminId: string, flag: string, enabled: boolean) {
  const flags = await getConfigValue<Record<string, boolean>>('feature_flags', {});
  flags[flag] = enabled;
  await setConfig({ adminId, key: 'feature_flags', value: flags });
}

export async function setRateLimits(adminId: string, limits: Record<string, number>) {
  await setConfig({ adminId, key: 'rate_limits', value: limits });
}

export async function setFeeSettings(adminId: string, fees: {
  platformFeePercent?: number;
  minFee?: number;
  maxFee?: number;
  withdrawalFee?: number;
}) {
  const current = await getConfigValue<Record<string, number>>('fee_settings', {});
  await setConfig({ adminId, key: 'fee_settings', value: { ...current, ...fees } });
}

export async function getSystemHealth() {
  const [userCount, groupCount, txCount, pendingFlags] = await Promise.all([
    prisma.user.count({ where: { status: 'active' } }),
    prisma.group.count({ where: { deletedAt: null } }),
    prisma.transaction.count({
      where: { createdAt: { gte: new Date(Date.now() - 86_400_000) } },
    }),
    prisma.moderationFlag.count({ where: { status: 'pending' } }),
  ]);

  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    metrics: {
      activeUsers: userCount,
      activeGroups: groupCount,
      transactionsLast24h: txCount,
      pendingModerationFlags: pendingFlags,
    },
  };
}
