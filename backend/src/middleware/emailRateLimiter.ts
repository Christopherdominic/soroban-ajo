import rateLimit from 'express-rate-limit';

// Email rate limiter - 5 emails per hour per IP
export const emailRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: 'Too many email requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Verification rate limiter - 3 attempts per hour
export const verificationRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: 'Too many verification attempts, please try again later',
});
