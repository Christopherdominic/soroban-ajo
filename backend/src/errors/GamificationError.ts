export class GamificationError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'GamificationError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class DuplicateRewardError extends GamificationError {
  constructor(message: string = 'Reward already claimed') {
    super(message, 'DUPLICATE_REWARD', 409);
  }
}

export class InvalidStreakError extends GamificationError {
  constructor(message: string = 'Invalid streak operation') {
    super(message, 'INVALID_STREAK', 400);
  }
}

export class AchievementNotFoundError extends GamificationError {
  constructor(achievementId: string) {
    super(`Achievement not found: ${achievementId}`, 'ACHIEVEMENT_NOT_FOUND', 404);
  }
}

export class ChallengeNotFoundError extends GamificationError {
  constructor(challengeId: string) {
    super(`Challenge not found: ${challengeId}`, 'CHALLENGE_NOT_FOUND', 404);
  }
}

export class ChallengeExpiredError extends GamificationError {
  constructor(challengeId: string) {
    super(`Challenge expired: ${challengeId}`, 'CHALLENGE_EXPIRED', 410);
  }
}

export class InsufficientPointsError extends GamificationError {
  constructor(required: number, available: number) {
    super(
      `Insufficient points: required ${required}, available ${available}`,
      'INSUFFICIENT_POINTS',
      400
    );
  }
}

export class RateLimitExceededError extends GamificationError {
  constructor(action: string, retryAfter: number) {
    super(
      `Rate limit exceeded for ${action}. Retry after ${retryAfter} seconds`,
      'RATE_LIMIT_EXCEEDED',
      429
    );
  }
}
