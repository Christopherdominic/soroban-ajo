import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuditLogEntry {
  adminId: string;
  action: string;
  targetType: string;
  targetId: string;
  metadata: Record<string, unknown>;
  ipAddress?: string;
}

export async function auditLog(entry: AuditLogEntry) {
  return prisma.adminAuditLog.create({
    data: {
      adminId: entry.adminId,
      action: entry.action,
      targetType: entry.targetType,
      targetId: entry.targetId,
      metadata: entry.metadata as any,
      ipAddress: entry.ipAddress,
    },
  });
}

export async function getAuditLogs(params: {
  adminId?: string;
  action?: string;
  targetType?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}) {
  const { page = 1, limit = 50 } = params;

  const where: Record<string, unknown> = {};
  if (params.adminId) where.adminId = params.adminId;
  if (params.action) where.action = params.action;
  if (params.targetType) where.targetType = params.targetType;
  if (params.startDate || params.endDate) {
    where.createdAt = {
      ...(params.startDate ? { gte: params.startDate } : {}),
      ...(params.endDate ? { lte: params.endDate } : {}),
    };
  }

  const [logs, total] = await Promise.all([
    prisma.adminAuditLog.findMany({
      where: where as any,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: { admin: { select: { email: true, role: true } } },
    }),
    prisma.adminAuditLog.count({ where: where as any }),
  ]);

  return { logs, total, page, pages: Math.ceil(total / limit) };
}
