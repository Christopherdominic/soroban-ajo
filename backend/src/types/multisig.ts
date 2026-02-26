import { z } from 'zod';

export enum ProposalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXECUTED = 'EXECUTED',
  EXPIRED = 'EXPIRED',
}

export enum OperationType {
  PAYOUT = 'PAYOUT',
  CANCEL_GROUP = 'CANCEL_GROUP',
  REMOVE_MEMBER = 'REMOVE_MEMBER',
  CHANGE_SETTINGS = 'CHANGE_SETTINGS',
  ADD_SIGNER = 'ADD_SIGNER',
  REMOVE_SIGNER = 'REMOVE_SIGNER',
}

export interface MultiSigConfigData {
  groupId: string;
  threshold: number;
  signers: SignerData[];
}

export interface SignerData {
  walletAddress: string;
  weight: number;
}

export interface ProposalMetadata {
  amount?: string;
  recipient?: string;
  reason?: string;
  memberToRemove?: string;
  settingKey?: string;
  settingValue?: string;
}

export const multiSigConfigSchema = z.object({
  groupId: z.string().min(1),
  threshold: z.number().int().min(1).max(10),
  signers: z.array(
    z.object({
      walletAddress: z.string().regex(/^G[A-Z0-9]{55}$/, 'Invalid Stellar address'),
      weight: z.number().int().min(1).max(10).default(1),
    })
  ).min(1).max(10),
});

export const createProposalSchema = z.object({
  groupId: z.string().min(1),
  operationType: z.nativeEnum(OperationType),
  transactionXdr: z.string().min(1),
  metadata: z.record(z.unknown()).optional(),
  expiresIn: z.number().int().min(3600).max(604800).default(86400), // 1 hour to 7 days
});

export const signProposalSchema = z.object({
  proposalId: z.string().min(1),
  signature: z.string().min(1),
});

export const CRITICAL_OPERATION_THRESHOLD = {
  LARGE_PAYOUT: 1000000, // 1M stroops
  MEMBER_REMOVAL: true,
  GROUP_CANCELLATION: true,
  SETTINGS_CHANGE: true,
};
