import { prisma } from '../src/config/database';
import { AchievementCategory, ChallengeType } from '../src/types/gamification';

const achievements = [
  {
    name: 'First Contribution',
    description: 'Make your first contribution to any group',
    icon: '🎯',
    category: AchievementCategory.CONTRIBUTION,
    points: 100,
    requirement: JSON.stringify({ type: 'first' }),
    isActive: true,
  },
  {
    name: 'Perfect Attendance',
    description: 'Maintain a 30-day contribution streak',
    icon: '⭐',
    category: AchievementCategory.CONTRIBUTION,
    points: 500,
    requirement: JSON.stringify({ type: 'streak', days: 30 }),
    isActive: true,
  },
  {
    name: 'Group Creator',
    description: 'Create your first savings group',
    icon: '👥',
    category: AchievementCategory.MILESTONE,
    points: 200,
    requirement: JSON.stringify({ type: 'groups', count: 1 }),
    isActive: true,
  },
  {
    name: 'Community Builder',
    description: 'Invite 10 friends to join the platform',
    icon: '🤝',
    category: AchievementCategory.SOCIAL,
    points: 300,
    requirement: JSON.stringify({ type: 'invites', count: 10 }),
    isActive: true,
  },
  {
    name: 'Savings Champion',
    description: 'Complete 5 savings groups',
    icon: '🏆',
    category: AchievementCategory.MILESTONE,
    points: 1000,
    requirement: JSON.stringify({ type: 'groups', count: 5 }),
    isActive: true,
  },
  {
    name: 'Consistent Saver',
    description: 'Make 50 contributions',
    icon: '💰',
    category: AchievementCategory.CONTRIBUTION,
    points: 750,
    requirement: JSON.stringify({ type: 'count', count: 50 }),
    isActive: true,
  },
  {
    name: 'Social Butterfly',
    description: 'Follow 20 other users',
    icon: '🦋',
    category: AchievementCategory.SOCIAL,
    points: 150,
    requirement: JSON.stringify({ type: 'follows', count: 20 }),
    isActive: true,
  },
  {
    name: 'Early Adopter',
    description: 'Join during the first month of launch',
    icon: '🚀',
    category: AchievementCategory.SPECIAL,
    points: 500,
    requirement: JSON.stringify({ type: 'special', code: 'EARLY_ADOPTER' }),
    isActive: true,
  },
];

const challenges = [
  {
    name: 'Weekly Warrior',
    description: 'Make 3 contributions this week',
    type: ChallengeType.WEEKLY,
    category: 'CONTRIBUTION',
    requirement: JSON.stringify({ actionType: 'CONTRIBUTION', target: 3 }),
    points: 150,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    isActive: true,
  },
  {
    name: 'Social Connector',
    description: 'Invite 2 friends this week',
    type: ChallengeType.WEEKLY,
    category: 'SOCIAL',
    requirement: JSON.stringify({ actionType: 'INVITE', target: 2 }),
    points: 200,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    isActive: true,
  },
  {
    name: 'Daily Dedication',
    description: 'Login for 7 consecutive days',
    type: ChallengeType.DAILY,
    category: 'ENGAGEMENT',
    requirement: JSON.stringify({ actionType: 'LOGIN', target: 7 }),
    points: 100,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    isActive: true,
  },
  {
    name: 'Profile Perfectionist',
    description: 'Complete your profile with all details',
    type: ChallengeType.WEEKLY,
    category: 'ENGAGEMENT',
    requirement: JSON.stringify({ actionType: 'PROFILE_COMPLETE', target: 1 }),
    points: 50,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    isActive: true,
  },
  {
    name: 'Group Finisher',
    description: 'Complete 2 groups this month',
    type: ChallengeType.WEEKLY,
    category: 'CONTRIBUTION',
    requirement: JSON.stringify({ actionType: 'GROUP_COMPLETE', target: 2 }),
    points: 500,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isActive: true,
  },
];

const seasonalEvents = [
  {
    name: 'Launch Season',
    description: 'Celebrate our platform launch with exclusive rewards!',
    startDate: new Date(),
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    rewards: JSON.stringify({
      bonusPoints: 1.5,
      exclusiveBadge: 'LAUNCH_PARTICIPANT',
      specialAchievements: ['EARLY_ADOPTER'],
    }),
    isActive: true,
  },
];

async function seedGamification(): Promise<void> {
  try {
    console.log('🌱 Seeding gamification data...');

    // Seed achievements
    console.log('📊 Seeding achievements...');
    for (const achievement of achievements) {
      await prisma.achievement.upsert({
        where: { name: achievement.name },
        update: achievement,
        create: achievement,
      });
    }
    console.log(`✅ Seeded ${achievements.length} achievements`);

    // Seed challenges
    console.log('🎯 Seeding challenges...');
    let challengeCount = 0;
    for (const challenge of challenges) {
      try {
        await prisma.challenge.create({
          data: challenge,
        });
        challengeCount++;
      } catch (error) {
        // Skip if already exists
        console.log(`⚠️  Challenge "${challenge.name}" already exists, skipping...`);
      }
    }
    console.log(`✅ Seeded ${challengeCount} new challenges`);

    // Seed seasonal events
    console.log('🎉 Seeding seasonal events...');
    for (const event of seasonalEvents) {
      await prisma.seasonalEvent.upsert({
        where: { name: event.name },
        update: event,
        create: event,
      });
    }
    console.log(`✅ Seeded ${seasonalEvents.length} seasonal events`);

    console.log('✨ Gamification data seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding gamification data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  seedGamification()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { seedGamification };
