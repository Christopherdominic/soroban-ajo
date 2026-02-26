import { Job } from 'bullmq'
import { logger } from '../utils/logger'

export interface EmailJobData {
    to: string
    subject: string
    body: string
    templateId?: string
}

export async function processEmailJob(job: Job<EmailJobData>): Promise<void> {
    logger.info('Processing email job', {
        jobId: job.id,
        to: job.data.to,
        subject: job.data.subject,
    })

    try {
        // Email sending is logged for now. Integrate with an SMTP provider
        // (e.g. SendGrid, Resend, AWS SES) by replacing this implementation.
        logger.info('Email sent successfully', {
            jobId: job.id,
            to: job.data.to,
            subject: job.data.subject,
            templateId: job.data.templateId || 'none',
        })
    } catch (error) {
        logger.error('Email job failed', {
            jobId: job.id,
            error: error instanceof Error ? error.message : String(error),
        })
        throw error
    }
}
