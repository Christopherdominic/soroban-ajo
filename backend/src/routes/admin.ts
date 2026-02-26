import { Router, Request, Response } from 'express';
import { adminAuth, requirePermission } from '../middleware/adminAuth';
import * as moderation from '../services/moderationService';
import * as audit from '../services/auditService';
import * as config from '../services/configService';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.use(adminAuth());

router.get('/health', async (req: Request, res: Response) => {
  const health = await config.getSystemHealth();
  res.json(health);
});

router.get('/dashboard', requirePermission('users:read'), async (req: Request, res: Response) => {
  const [health, recentAudit, pendingFlags] = await Promise.all([
    config.getSystemHealth(),
    audit.getAuditLogs({ limit: 10 }),
    moderation.getPendingFlags(1, 5),
  ]);
  res.json({ health, recentAudit: recentAudit.logs, pendingFlags: pendingFlags.flags });
});

router.get('/users', requirePermission('users:read'), async (req: Request, res: Response) => {
  const { page = 1, limit = 20, status, search } = req.query;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { email: { contains: String(search), mode: 'insensitive' } },
      { name: { contains: String(search), mode: 'insensitive' } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: where as any,
      orderBy: { createdAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      select: {
        id: true, email: true, name: true, status: true,
        createdAt: true, suspendedUntil: true, suspensionReason: true,
        _count: { select: { groups: true, transactions: true } },
      },
    }),
    prisma.user.count({ where: where as any }),
  ]);

  res.json({ users, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

router.get('/users/:id', requirePermission('users:read'), async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
    include: {
      groups: { take: 10, orderBy: { createdAt: 'desc' } },
      transactions: { take: 10, orderBy: { createdAt: 'desc' } },
    },
  });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

router.post('/users/:id/suspend', requirePermission('users:suspend'), async (req, res) => {
  const { reason, durationDays } = req.body;
  if (!reason) return res.status(400).json({ error: 'Reason is required' });
  const user = await moderation.suspendUser({
    adminId: req.admin!.id,
    userId: req.params.id,
    reason,
    durationDays,
  });
  res.json(user);
});

router.post('/users/:id/ban', requirePermission('users:suspend'), async (req, res) => {
  const { reason } = req.body;
  if (!reason) return res.status(400).json({ error: 'Reason is required' });
  const user = await moderation.banUser({ adminId: req.admin!.id, userId: req.params.id, reason });
  res.json(user);
});

router.post('/users/:id/reinstate', requirePermission('users:suspend'), async (req, res) => {
  const user = await moderation.reinstateUser({ adminId: req.admin!.id, userId: req.params.id });
  res.json(user);
});

router.delete('/users/:id', requirePermission('users:delete'), async (req, res) => {
  const { reason } = req.body;
  if (!reason) return res.status(400).json({ error: 'Reason is required' });
  await prisma.user.update({
    where: { id: req.params.id },
    data: { deletedAt: new Date(), deletionReason: reason },
  });
  await audit.auditLog({
    adminId: req.admin!.id,
    action: 'delete_user',
    targetType: 'user',
    targetId: req.params.id,
    metadata: { reason },
  });
  res.json({ success: true });
});

router.get('/groups', requirePermission('groups:read'), async (req, res) => {
  const { page = 1, limit = 20, status, search } = req.query;
  const where: Record<string, unknown> = { deletedAt: null };
  if (status) where.status = status;
  if (search) where.name = { contains: String(search), mode: 'insensitive' };

  const [groups, total] = await Promise.all([
    prisma.group.findMany({
      where: where as any,
      orderBy: { createdAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      include: { _count: { select: { members: true, transactions: true } } },
    }),
    prisma.group.count({ where: where as any }),
  ]);
  res.json({ groups, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

router.post('/groups/:id/cancel', requirePermission('groups:delete'), async (req, res) => {
  const { reason } = req.body;
  if (!reason) return res.status(400).json({ error: 'Reason is required' });
  const group = await moderation.cancelGroup({ adminId: req.admin!.id, groupId: req.params.id, reason });
  res.json(group);
});

router.delete('/groups/:id', requirePermission('groups:delete'), async (req, res) => {
  const { reason } = req.body;
  if (!reason) return res.status(400).json({ error: 'Reason is required' });
  const group = await moderation.deleteGroup({ adminId: req.admin!.id, groupId: req.params.id, reason });
  res.json(group);
});

router.get('/transactions', requirePermission('transactions:read'), async (req, res) => {
  const { page = 1, limit = 20, type, userId, groupId } = req.query;
  const where: Record<string, unknown> = {};
  if (type) where.type = type;
  if (userId) where.userId = userId;
  if (groupId) where.groupId = groupId;

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where: where as any,
      orderBy: { createdAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      include: { user: { select: { id: true, email: true, name: true } } },
    }),
    prisma.transaction.count({ where: where as any }),
  ]);
  res.json({ transactions, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

router.get('/flags', requirePermission('moderation:read'), async (req, res) => {
  const { page = 1 } = req.query;
  const result = await moderation.getPendingFlags(Number(page));
  res.json(result);
});

router.post('/flags', requirePermission('moderation:write'), async (req, res) => {
  const { contentType, contentId, reason, notes } = req.body;
  const flag = await moderation.flagContent({
    adminId: req.admin!.id,
    contentType,
    contentId,
    reason,
    notes,
  });
  res.json(flag);
});

router.put('/flags/:id/resolve', requirePermission('moderation:write'), async (req, res) => {
  const { resolution, notes } = req.body;
  const flag = await moderation.resolveFlag({
    adminId: req.admin!.id,
    flagId: req.params.id,
    resolution,
    notes,
  });
  res.json(flag);
});

router.get('/audit', requirePermission('audit:read'), async (req, res) => {
  const { adminId, action, targetType, startDate, endDate, page = 1, limit = 50 } = req.query;
  const result = await audit.getAuditLogs({
    adminId: adminId as string,
    action: action as string,
    targetType: targetType as string,
    startDate: startDate ? new Date(String(startDate)) : undefined,
    endDate: endDate ? new Date(String(endDate)) : undefined,
    page: Number(page),
    limit: Number(limit),
  });
  res.json(result);
});

router.get('/config', requirePermission('config:read'), async (req, res) => {
  const cfg = await config.getConfig();
  res.json(cfg);
});

router.put('/config/maintenance', requirePermission('config:write'), async (req, res) => {
  const { enabled, message } = req.body;
  await config.setMaintenanceMode(req.admin!.id, enabled, message);
  res.json({ success: true });
});

router.put('/config/feature-flags', requirePermission('config:write'), async (req, res) => {
  const { flag, enabled } = req.body;
  await config.setFeatureFlag(req.admin!.id, flag, enabled);
  res.json({ success: true });
});

router.put('/config/rate-limits', requirePermission('config:write'), async (req, res) => {
  await config.setRateLimits(req.admin!.id, req.body);
  res.json({ success: true });
});

router.put('/config/fees', requirePermission('config:write'), async (req, res) => {
  await config.setFeeSettings(req.admin!.id, req.body);
  res.json({ success: true });
});

router.get('/reports/users', requirePermission('reports:read'), async (req, res) => {
  const { startDate, endDate } = req.query;
  const report = await moderation.getUserReports({
    startDate: new Date(String(startDate || new Date(Date.now() - 30 * 86_400_000))),
    endDate: new Date(String(endDate || new Date())),
  });
  res.json(report);
});

router.get('/reports/financial', requirePermission('reports:read'), async (req, res) => {
  const { startDate, endDate } = req.query;
  const report = await moderation.getFinancialReport({
    startDate: new Date(String(startDate || new Date(Date.now() - 30 * 86_400_000))),
    endDate: new Date(String(endDate || new Date())),
  });
  res.json(report);
});

router.get('/reports/activity', requirePermission('reports:read'), async (req, res) => {
  const { startDate, endDate } = req.query;
  const sd = new Date(String(startDate || new Date(Date.now() - 30 * 86_400_000)));
  const ed = new Date(String(endDate || new Date()));

  const [newUsers, newGroups, transactions, flags] = await Promise.all([
    prisma.user.count({ where: { createdAt: { gte: sd, lte: ed } } }),
    prisma.group.count({ where: { createdAt: { gte: sd, lte: ed } } }),
    prisma.transaction.count({ where: { createdAt: { gte: sd, lte: ed } } }),
    prisma.moderationFlag.count({ where: { createdAt: { gte: sd, lte: ed } } }),
  ]);

  res.json({ period: { startDate: sd, endDate: ed }, newUsers, newGroups, transactions, flags });
});

router.get('/notifications', adminAuth(), async (req, res) => {
  const [pendingFlags, maintenanceMode] = await Promise.all([
    prisma.moderationFlag.count({ where: { status: 'pending' } }),
    config.getConfigValue<{ enabled: boolean }>('maintenance_mode', { enabled: false }),
  ]);

  const notifications = [];
  if (pendingFlags > 0) {
    notifications.push({ type: 'warning', message: `${pendingFlags} pending moderation flags`, link: '/admin/moderation' });
  }
  if (maintenanceMode.enabled) {
    notifications.push({ type: 'info', message: 'Maintenance mode is active', link: '/admin/settings' });
  }
  res.json({ notifications, count: notifications.length });
});

export default router;
