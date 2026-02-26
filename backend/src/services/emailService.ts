import sgMail from '@sendgrid/mail';

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private fromEmail: string;
  private isEnabled: boolean;

  constructor() {
    this.fromEmail = process.env.EMAIL_FROM || 'noreply@ajo.app';
    this.isEnabled = !!process.env.SENDGRID_API_KEY;
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.isEnabled) {
      // Service disabled - no API key configured
      return false;
    }

    try {
      await sgMail.send({
        to: options.to,
        from: this.fromEmail,
        subject: options.subject,
        html: options.html,
        text: options.text || options.html.replace(/<[^>]*>/g, ''),
      });
      return true;
    } catch (error) {
      console.error('Email send error:', error);
      return false;
    }
  }

  async sendWelcomeEmail(to: string, name: string): Promise<boolean> {
    return this.sendEmail({
      to,
      subject: 'Welcome to Ajo!',
      html: this.getWelcomeTemplate(name),
    });
  }

  async sendContributionReminder(to: string, groupName: string, amount: string, dueDate: string): Promise<boolean> {
    return this.sendEmail({
      to,
      subject: `Contribution Reminder: ${groupName}`,
      html: this.getContributionReminderTemplate(groupName, amount, dueDate),
    });
  }

  async sendPayoutNotification(to: string, groupName: string, amount: string, txHash: string): Promise<boolean> {
    return this.sendEmail({
      to,
      subject: `Payout Received: ${groupName}`,
      html: this.getPayoutTemplate(groupName, amount, txHash),
    });
  }

  async sendGroupInvitation(to: string, groupName: string, inviterName: string, inviteLink: string): Promise<boolean> {
    return this.sendEmail({
      to,
      subject: `You're invited to join ${groupName}`,
      html: this.getInvitationTemplate(groupName, inviterName, inviteLink),
    });
  }

  async sendWeeklySummary(to: string, data: { groupName: string; contributions: number; balance: string }): Promise<boolean> {
    return this.sendEmail({
      to,
      subject: 'Your Weekly Ajo Summary',
      html: this.getWeeklySummaryTemplate(data),
    });
  }

  async sendTransactionReceipt(to: string, data: { groupName: string; amount: string; txHash: string; date: string }): Promise<boolean> {
    return this.sendEmail({
      to,
      subject: 'Transaction Receipt',
      html: this.getReceiptTemplate(data),
    });
  }

  async sendVerificationEmail(to: string, token: string): Promise<boolean> {
    const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    return this.sendEmail({
      to,
      subject: 'Verify Your Email',
      html: this.getVerificationTemplate(verifyLink),
    });
  }

  // Email Templates
  private getWelcomeTemplate(name: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">Welcome to Ajo!</h1>
        <p>Hi ${name},</p>
        <p>Thank you for joining Ajo, the decentralized savings platform.</p>
        <p>Get started by creating or joining a savings group.</p>
        <a href="${process.env.FRONTEND_URL}/dashboard" style="display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">Go to Dashboard</a>
        <p style="color: #666; font-size: 12px; margin-top: 40px;">
          <a href="${process.env.FRONTEND_URL}/unsubscribe">Unsubscribe</a>
        </p>
      </div>
    `;
  }

  private getContributionReminderTemplate(groupName: string, amount: string, dueDate: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Contribution Reminder</h2>
        <p>Your contribution for <strong>${groupName}</strong> is due soon.</p>
        <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Amount:</strong> ${amount}</p>
          <p><strong>Due Date:</strong> ${dueDate}</p>
        </div>
        <a href="${process.env.FRONTEND_URL}/groups" style="display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 6px;">Make Contribution</a>
        <p style="color: #666; font-size: 12px; margin-top: 40px;">
          <a href="${process.env.FRONTEND_URL}/unsubscribe">Unsubscribe</a>
        </p>
      </div>
    `;
  }

  private getPayoutTemplate(groupName: string, amount: string, txHash: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10B981;">Payout Received!</h2>
        <p>You've received a payout from <strong>${groupName}</strong>.</p>
        <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Amount:</strong> ${amount}</p>
          <p><strong>Transaction:</strong> <code style="font-size: 11px;">${txHash}</code></p>
        </div>
        <a href="${process.env.FRONTEND_URL}/transactions/${txHash}" style="display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 6px;">View Transaction</a>
        <p style="color: #666; font-size: 12px; margin-top: 40px;">
          <a href="${process.env.FRONTEND_URL}/unsubscribe">Unsubscribe</a>
        </p>
      </div>
    `;
  }

  private getInvitationTemplate(groupName: string, inviterName: string, inviteLink: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">You're Invited!</h2>
        <p><strong>${inviterName}</strong> has invited you to join <strong>${groupName}</strong>.</p>
        <p>Join this savings group to start building wealth together.</p>
        <a href="${inviteLink}" style="display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">Accept Invitation</a>
        <p style="color: #666; font-size: 12px; margin-top: 40px;">
          <a href="${process.env.FRONTEND_URL}/unsubscribe">Unsubscribe</a>
        </p>
      </div>
    `;
  }

  private getWeeklySummaryTemplate(data: { groupName: string; contributions: number; balance: string }): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Your Weekly Summary</h2>
        <p>Here's your activity for <strong>${data.groupName}</strong> this week.</p>
        <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Contributions:</strong> ${data.contributions}</p>
          <p><strong>Balance:</strong> ${data.balance}</p>
        </div>
        <a href="${process.env.FRONTEND_URL}/dashboard" style="display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 6px;">View Dashboard</a>
        <p style="color: #666; font-size: 12px; margin-top: 40px;">
          <a href="${process.env.FRONTEND_URL}/unsubscribe">Unsubscribe</a>
        </p>
      </div>
    `;
  }

  private getReceiptTemplate(data: { groupName: string; amount: string; txHash: string; date: string }): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Transaction Receipt</h2>
        <p>Your contribution has been recorded.</p>
        <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Group:</strong> ${data.groupName}</p>
          <p><strong>Amount:</strong> ${data.amount}</p>
          <p><strong>Date:</strong> ${data.date}</p>
          <p><strong>Transaction:</strong> <code style="font-size: 11px;">${data.txHash}</code></p>
        </div>
        <a href="${process.env.FRONTEND_URL}/transactions/${data.txHash}" style="display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 6px;">View Transaction</a>
        <p style="color: #666; font-size: 12px; margin-top: 40px;">
          <a href="${process.env.FRONTEND_URL}/unsubscribe">Unsubscribe</a>
        </p>
      </div>
    `;
  }

  private getVerificationTemplate(verifyLink: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Verify Your Email</h2>
        <p>Please verify your email address to complete your registration.</p>
        <a href="${verifyLink}" style="display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">Verify Email</a>
        <p style="color: #666; font-size: 12px;">This link expires in 24 hours.</p>
        <p style="color: #666; font-size: 12px; margin-top: 40px;">
          If you didn't request this, please ignore this email.
        </p>
      </div>
    `;
  }
}

export const emailService = new EmailService();
