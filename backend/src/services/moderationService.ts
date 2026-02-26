import { PrismaClient } from '@prisma/client';
import { auditLog } from './auditService';

const prisma = new PrismaClient();

export type ReportReason =
  | 'spam'
  | 'fraud'
  | 'harassment'
  | 'inappropriate_content'
  | 'suspicious_activity'
  | 'other';

export type ContentType = 'user' | 'group' | 'transaction' | 'message';

export async function flagContent(params: {
  adminId: string;
  contentType: ContentType;
  contentId: string;
  reason: ReportReason;
  notes?: string;
}) {
  const flag = await prisma.moderationFlag.create({
    data: {
      contentType: params.contentType,
      contentId: params.contentId,
      reason: params.reason,
      notes: params.notes,
      flaggedBy: params.adminId,
      status: 'pending',
    },
  });

  await auditLog({
    adminId: params.adminId,
    action: 'flag_content',
    targetType: params.contentType,
    targetId: params.contentId,
    metadata: { reason: params.reason, flagId: flag.id },
  });

  return flag;
}

export async function getPendingFlags(page = 1, limit = 20) {
  const [flags, total] = await Promise.all([
    prisma.moderationFlag.findMany({
      where: { status: 'pending' },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.moderationFlag.count({ where: { status: 'pending' } }),
  ]);

  return { flags, total, page, pages: Math.ceil(total / limit) };
}

export async function resolveFlag(params: {
  adminId: string;
  flagId: string;
  resolution: 'dismissed' | 'actioned';
  notes?: string;
}) {
  const flag = await prisma.moderationFlag.update({
    where: { id: params.flagId },
    data: {
      status: params.resolution,
      resolvedBy: params.adminId,
      resolvedAt: new Date(),
      resolutionNotes: params.notes,
    },
  });

  await auditLog({
    adminId: params.adminId,
    action: 'resolve_flag',
    targetType: 'moderation_flag',
    targetId: params.flagId,
    metadata: { resolution: params.resolution },
  });

  return flag;
}

export async function suspendUser(params: {
  adminId: string;
  userId: string;
  reason: string;
  durationDays?: number;
}) {
  const suspendedUntil = params.durationDays
    ? new Date(Date.now() + params.durationDays * 86_400_000)
    : null;

  const user = await prisma.user.update({
    where: { id: params.userId },
    data: {
      status: 'suspended',
      suspendedUntil,
      suspensionReason: params.reason,
    },
  });

  await auditLog({
    adminId: params.adminId,
    action: 'suspend_user',
    targetType: 'user',
    targetId: params.userId,
    metadata: { reason: params.reason, durationDays: params.durationDays },
  });

  return user;
}

export async function banUser(params: {
  adminId: string;
  userId: string;
  reason: string;
}) {
  const user = await prisma.user.update({
    where: { id: params.userId },
    data: { status: 'banned', banReason: params.reason, bannedAt: new Date() },
  });

  await auditLog({
    adminId: params.adminId,
    action: 'ban_user',
    targetType: 'user',
    targetId: params.userId,
    metadata: { reason: params.reason },
  });

  return user;
}

export async function reinstateUser(params: { adminId: string; userId: string }) {
  const user = await prisma.user.update({
    where: { id: params.userId },
    data: {
      status: 'active',
      suspendedUntil: null,
      suspensionReason: null,
      banReason: null,
      bannedAt: null,
    },
  });

  await auditLog({
    adminId: params.adminId,
    action: 'reinstate_user',
    targetType: 'user',
    targetId: params.userId,
    metadata: {},
  });

  return user;
}

export async function cancelGroup(params: {
  adminId: string;
  groupId: string;
  reason: string;
}) {
  const group = await prisma.group.update({
    where: { id: params.groupId },
    data: { status: 'cancelled', cancellationReason: params.reason },
  });

  await auditLog({
    adminId: params.adminId,
    action: 'cancel_group',
    targetType: 'group',
    targetId: params.groupId,
    metadata: { reason: params.reason },
  });

  return group;
}

export async function deleteGroup(params: {
  adminId: string;
  groupId: string;
  reason: string;
}) {
  const group = await prisma.group.update({
    where: { id: params.groupId },
    data: { deletedAt: new Date(), deletionReason: params.reason },
  });

  await auditLog({
    adminId: params.adminId,
    action: 'delete_group',
    targetType: 'group',
    targetId: params.groupId,
    metadata: { reason: params.reason },
  });

  return group;
}

export async function getUserReports(params: {
  startDate: Date;
  endDate: Date;
}) {
  const [total, newUsers, suspended, banned, active] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: params.startDate, lte: params.endDate } } }),
    prisma.user.count({ where: { status: 'suspended' } }),
    prisma.user.count({ where: { status: 'banned' } }),
    prisma.user.count({ where: { status: 'active' } }),
  ]);

  return { total, newUsers, suspended, banned, active };
}

export async function getFinancialReport(params: {
  startDate: Date;
  endDate: Date;
}) {
  const transactions = await prisma.transaction.aggregate({
    where: { createdAt: { gte: params.startDate, lte: params.endDate } },
    _sum: { amount: true },
    _count: true,
    _avg: { amount: true },
  });

  const byType = await prisma.transaction.groupBy({
    by: ['type'],
    where: { createdAt: { gte: params.startDate, lte: params.endDate } },
    _sum: { amount: true },
    _count: true,
  });

  return {
    totalVolume: transactions._sum.amount ?? 0,
    transactionCount: transactions._count,
    averageAmount: transactions._avg.amount ?? 0,
    byType,
  };
}
