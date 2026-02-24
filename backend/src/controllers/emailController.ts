import { Request, Response } from 'express';
import { queueEmail } from '../queues/emailQueue';

export const emailController = {
  async sendTestEmail(req: Request, res: Response): Promise<Response> {
    try {
      const { to, subject, message } = req.body;

      if (!to || !subject || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      await queueEmail.custom({
        to,
        subject,
        html: `<p>${message}</p>`,
      });

      return res.json({ success: true, message: 'Email queued' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to queue email' });
    }
  },

  async verifyEmail(req: Request, res: Response): Promise<Response> {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({ error: 'Token required' });
      }

      return res.json({ success: true, message: 'Email verified' });
    } catch (error) {
      return res.status(500).json({ error: 'Verification failed' });
    }
  },

  async unsubscribe(req: Request, res: Response): Promise<Response> {
    try {
      const { email, token } = req.body;

      if (!email && !token) {
        return res.status(400).json({ error: 'Email or token required' });
      }

      return res.json({ success: true, message: 'Unsubscribed successfully' });
    } catch (error) {
      return res.status(500).json({ error: 'Unsubscribe failed' });
    }
  },

  async getEmailStatus(_req: Request, res: Response): Promise<Response> {
    try {
      const isEnabled = !!process.env.SENDGRID_API_KEY;
      
      return res.json({
        enabled: isEnabled,
        provider: 'SendGrid',
        from: process.env.EMAIL_FROM || 'noreply@ajo.app',
      });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to get status' });
    }
  },

  async sendWelcome(req: Request, res: Response): Promise<Response> {
    try {
      const { email, name } = req.body;

      if (!email || !name) {
        return res.status(400).json({ error: 'Email and name required' });
      }

      await queueEmail.welcome(email, name);

      return res.json({ success: true, message: 'Welcome email queued' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to send welcome email' });
    }
  },
};
