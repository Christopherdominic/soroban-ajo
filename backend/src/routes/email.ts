import { Router } from 'express';
import { emailController } from '../controllers/emailController';
import { emailRateLimiter, verificationRateLimiter } from '../middleware/emailRateLimiter';

export const emailRouter = Router();

/**
 * @swagger
 * /api/email/test:
 *   post:
 *     summary: Send test email
 *     tags: [Email]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to
 *               - subject
 *               - message
 *             properties:
 *               to:
 *                 type: string
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email queued successfully
 */
emailRouter.post('/test', emailRateLimiter, emailController.sendTestEmail);

/**
 * @swagger
 * /api/email/verify:
 *   post:
 *     summary: Verify email address
 *     tags: [Email]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email verified
 */
emailRouter.post('/verify', verificationRateLimiter, emailController.verifyEmail);

/**
 * @swagger
 * /api/email/unsubscribe:
 *   post:
 *     summary: Unsubscribe from emails
 *     tags: [Email]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Unsubscribed successfully
 */
emailRouter.post('/unsubscribe', emailController.unsubscribe);

/**
 * @swagger
 * /api/email/status:
 *   get:
 *     summary: Get email service status
 *     tags: [Email]
 *     responses:
 *       200:
 *         description: Email service status
 */
emailRouter.get('/status', emailController.getEmailStatus);

/**
 * @swagger
 * /api/email/welcome:
 *   post:
 *     summary: Send welcome email
 *     tags: [Email]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Welcome email queued
 */
emailRouter.post('/welcome', emailRateLimiter, emailController.sendWelcome);
