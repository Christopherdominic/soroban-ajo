import Queue from 'bull';
import { emailService, EmailOptions } from '../services/emailService';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

export const emailQueue = new Queue('email', REDIS_URL, {
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

// Process email jobs
emailQueue.process(async (job) => {
  const { type, data } = job.data;

  switch (type) {
    case 'welcome':
      return emailService.sendWelcomeEmail(data.to, data.name);

    case 'contribution-reminder':
      return emailService.sendContributionReminder(
        data.to,
        data.groupName,
        data.amount,
        data.dueDate
      );

    case 'payout':
      return emailService.sendPayoutNotification(
        data.to,
        data.groupName,
        data.amount,
        data.txHash
      );

    case 'invitation':
      return emailService.sendGroupInvitation(
        data.to,
        data.groupName,
        data.inviterName,
        data.inviteLink
      );

    case 'weekly-summary':
      return emailService.sendWeeklySummary(data.to, data);

    case 'receipt':
      return emailService.sendTransactionReceipt(data.to, data);

    case 'verification':
      return emailService.sendVerificationEmail(data.to, data.token);

    case 'custom':
      return emailService.sendEmail(data as EmailOptions);

    default:
      throw new Error(`Unknown email type: ${type}`);
  }
});

// Queue event handlers
emailQueue.on('completed', (_job) => {
  // Job completed successfully
});

emailQueue.on('failed', (job, err) => {
  console.error(`Email job ${job?.id} failed:`, err.message);
});

// Helper functions to add jobs
export const queueEmail = {
  welcome: (to: string, name: string) =>
    emailQueue.add({ type: 'welcome', data: { to, name } }),

  contributionReminder: (to: string, groupName: string, amount: string, dueDate: string) =>
    emailQueue.add({ type: 'contribution-reminder', data: { to, groupName, amount, dueDate } }),

  payout: (to: string, groupName: string, amount: string, txHash: string) =>
    emailQueue.add({ type: 'payout', data: { to, groupName, amount, txHash } }),

  invitation: (to: string, groupName: string, inviterName: string, inviteLink: string) =>
    emailQueue.add({ type: 'invitation', data: { to, groupName, inviterName, inviteLink } }),

  weeklySummary: (to: string, data: { groupName: string; contributions: number; balance: string }) =>
    emailQueue.add({ type: 'weekly-summary', data: { to, ...data } }),

  receipt: (to: string, data: { groupName: string; amount: string; txHash: string; date: string }) =>
    emailQueue.add({ type: 'receipt', data: { to, ...data } }),

  verification: (to: string, token: string) =>
    emailQueue.add({ type: 'verification', data: { to, token } }),

  custom: (options: EmailOptions) =>
    emailQueue.add({ type: 'custom', data: options }),
};
