import { prisma } from '../config/database';

export class DatabaseService {
  // User operations
  async upsertUser(walletAddress: string) {
    return prisma.user.upsert({
      where: { walletAddress },
      update: { updatedAt: new Date() },
      create: { walletAddress },
    });
  }

  async getUser(walletAddress: string) {
    return prisma.user.findUnique({
      where: { walletAddress },
    });
  }

  // Group operations
  async upsertGroup(groupId: string, data: {
    name: string;
    contributionAmount: bigint;
    frequency: number;
    maxMembers: number;
    currentRound?: number;
    isActive?: boolean;
  }) {
    return prisma.group.upsert({
      where: { id: groupId },
      update: {
        ...data,
        updatedAt: new Date(),
      },
      create: {
        id: groupId,
        ...data,
      },
    });
  }

  async getGroup(groupId: string) {
    return prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: { include: { user: true } },
        contributions: { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });
  }

  async getAllGroups() {
    return prisma.group.findMany({
      where: { isActive: true },
      include: {
        members: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Member operations
  async addGroupMember(groupId: string, walletAddress: string) {
    await this.upsertUser(walletAddress);
    return prisma.groupMember.upsert({
      where: {
        groupId_userId: {
          groupId,
          userId: walletAddress,
        },
      },
      update: {},
      create: {
        groupId,
        userId: walletAddress,
      },
    });
  }

  async getGroupMembers(groupId: string) {
    return prisma.groupMember.findMany({
      where: { groupId },
      include: { user: true },
    });
  }

  // Contribution operations
  async addContribution(data: {
    groupId: string;
    walletAddress: string;
    amount: bigint;
    round: number;
    txHash: string;
  }) {
    await this.upsertUser(data.walletAddress);
    return prisma.contribution.create({
      data: {
        groupId: data.groupId,
        userId: data.walletAddress,
        amount: data.amount,
        round: data.round,
        txHash: data.txHash,
      },
    });
  }

  async getContributions(groupId: string, round?: number) {
    return prisma.contribution.findMany({
      where: {
        groupId,
        ...(round !== undefined && { round }),
      },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getContributionByTxHash(txHash: string) {
    return prisma.contribution.findUnique({
      where: { txHash },
    });
  }
}

export const dbService = new DatabaseService();
