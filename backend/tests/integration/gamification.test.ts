import request from 'supertest';
import app from '../../src/index';
import { prisma } from '../../src/config/database';

// Mock authentication middleware
jest.mock('../../src/middleware/auth', () => ({
  authenticate: (req: any, res: any, next: any) => {
    req.user = { walletAddress: 'GABC123456789' };
    next();
  },
}));

describe('Gamification API Integration Tests', () => {
  beforeAll(async () => {
    // Setup test database
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/gamification/stats', () => {
    it('should return user stats', async () => {
      const response = await request(app)
        .get('/api/gamification/stats')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('gamification');
      expect(response.body.data).toHaveProperty('achievements');
      expect(response.body.data).toHaveProperty('challenges');
    });

    it('should return 401 without authentication', async () => {
      // Temporarily remove mock
      jest.unmock('../../src/middleware/auth');

      const response = await request(app)
        .get('/api/gamification/stats')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/gamification/leaderboard', () => {
    it('should return leaderboard', async () => {
      const response = await request(app)
        .get('/api/gamification/leaderboard')
        .query({ limit: 10, offset: 0 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should validate pagination parameters', async () => {
      const response = await request(app)
        .get('/api/gamification/leaderboard')
        .query({ limit: 'invalid' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should enforce max limit', async () => {
      const response = await request(app)
        .get('/api/gamification/leaderboard')
        .query({ limit: 200 })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/gamification/follow/:walletAddress', () => {
    it('should follow user successfully', async () => {
      const response = await request(app)
        .post('/api/gamification/follow/GDEF456789012')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('followed');
    });

    it('should validate wallet address format', async () => {
      const response = await request(app)
        .post('/api/gamification/follow/invalid-address')
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should prevent following self', async () => {
      const response = await request(app)
        .post('/api/gamification/follow/GABC123456789')
        .expect(500);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/gamification/follow/:walletAddress', () => {
    it('should unfollow user successfully', async () => {
      // First follow
      await request(app)
        .post('/api/gamification/follow/GDEF456789012')
        .expect(200);

      // Then unfollow
      const response = await request(app)
        .delete('/api/gamification/follow/GDEF456789012')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('unfollowed');
    });
  });

  describe('GET /api/gamification/followers', () => {
    it('should return followers list', async () => {
      const response = await request(app)
        .get('/api/gamification/followers')
        .query({ limit: 50, offset: 0 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/gamification/following', () => {
    it('should return following list', async () => {
      const response = await request(app)
        .get('/api/gamification/following')
        .query({ limit: 50, offset: 0 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/gamification/activity', () => {
    it('should return activity feed', async () => {
      const response = await request(app)
        .get('/api/gamification/activity')
        .query({ limit: 50, offset: 0 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('POST /api/gamification/login', () => {
    it('should track login successfully', async () => {
      const response = await request(app)
        .post('/api/gamification/login')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('points');
      expect(response.body.data).toHaveProperty('streak');
    });
  });

  describe('GET /api/gamification/challenges', () => {
    it('should return active challenges', async () => {
      const response = await request(app)
        .get('/api/gamification/challenges')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/gamification/challenges/user', () => {
    it('should return user challenges', async () => {
      const response = await request(app)
        .get('/api/gamification/challenges/user')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limit on follow actions', async () => {
      // Attempt to follow 21 users rapidly
      const promises = [];
      for (let i = 0; i < 21; i++) {
        promises.push(
          request(app)
            .post(`/api/gamification/follow/GTEST${i.toString().padStart(10, '0')}`)
        );
      }

      const responses = await Promise.all(promises);
      const rateLimited = responses.some(r => r.status === 429);

      expect(rateLimited).toBe(true);
    });
  });
});
