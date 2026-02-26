'use client';

import React, { useState, useEffect } from 'react';
import { UserStats, LEVEL_CONFIGS, UserLevel } from '@/types/gamification';

interface GamificationProps {
  walletAddress?: string;
}

export default function Gamification({ walletAddress }: GamificationProps) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'challenges'>('overview');

  useEffect(() => {
    if (walletAddress) {
      fetchStats();
    }
  }, [walletAddress]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/achievements/stats', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!stats?.gamification) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">No gamification data available</p>
      </div>
    );
  }

  const { gamification, achievements, challenges } = stats;
  const levelConfig = LEVEL_CONFIGS[gamification.level as UserLevel];
  const nextLevel = getNextLevel(gamification.level as UserLevel);
  const nextLevelConfig = nextLevel ? LEVEL_CONFIGS[nextLevel] : null;
  const progressToNextLevel = nextLevelConfig
    ? ((gamification.points - levelConfig.minPoints) / (nextLevelConfig.minPoints - levelConfig.minPoints)) * 100
    : 100;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">Your Progress</h2>
            <p className="text-primary-100">Keep up the great work!</p>
          </div>
          <div className="text-5xl">{levelConfig.icon}</div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Points" value={gamification.points.toLocaleString()} />
          <StatCard label="Level" value={gamification.level} />
          <StatCard label="Contribution Streak" value={`${gamification.contributionStreak} days`} />
          <StatCard label="Login Streak" value={`${gamification.loginStreak} days`} />
        </div>

        {/* Level Progress */}
        {nextLevelConfig && (
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>{levelConfig.name}</span>
              <span>{nextLevelConfig.name}</span>
            </div>
            <div className="w-full bg-primary-900 rounded-full h-3">
              <div
                className="bg-white rounded-full h-3 transition-all duration-500"
                style={{ width: `${Math.min(progressToNextLevel, 100)}%` }}
              />
            </div>
            <p className="text-sm text-primary-100 mt-2">
              {nextLevelConfig.minPoints - gamification.points} points to {nextLevelConfig.name}
            </p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <TabButton
            active={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
            label="Overview"
          />
          <TabButton
            active={activeTab === 'achievements'}
            onClick={() => setActiveTab('achievements')}
            label={`Achievements (${achievements.length})`}
          />
          <TabButton
            active={activeTab === 'challenges'}
            onClick={() => setActiveTab('challenges')}
            label={`Challenges (${challenges.filter((c) => !c.completed).length})`}
          />
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && (
          <OverviewTab gamification={gamification} levelConfig={levelConfig} />
        )}
        {activeTab === 'achievements' && <AchievementsTab achievements={achievements} />}
        {activeTab === 'challenges' && <ChallengesTab challenges={challenges} />}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white/10 rounded-lg p-3">
      <p className="text-primary-100 text-sm">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
        active
          ? 'border-primary-600 text-primary-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
    >
      {label}
    </button>
  );
}

function OverviewTab({ gamification, levelConfig }: any) {
  return (
    <div className="space-y-6">
      {/* Level Benefits */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Your Level Benefits</h3>
        <ul className="space-y-2">
          {levelConfig.benefits.map((benefit: string, index: number) => (
            <li key={index} className="flex items-center text-gray-700">
              <span className="text-green-500 mr-2">✓</span>
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl mb-2">🎯</div>
          <h4 className="font-semibold text-gray-900">Total Invites</h4>
          <p className="text-3xl font-bold text-primary-600 mt-2">{gamification.totalInvites}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl mb-2">🏆</div>
          <h4 className="font-semibold text-gray-900">Groups Completed</h4>
          <p className="text-3xl font-bold text-primary-600 mt-2">{gamification.groupsCompleted}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl mb-2">🔥</div>
          <h4 className="font-semibold text-gray-900">Best Streak</h4>
          <p className="text-3xl font-bold text-primary-600 mt-2">
            {Math.max(gamification.contributionStreak, gamification.loginStreak)} days
          </p>
        </div>
      </div>
    </div>
  );
}

function AchievementsTab({ achievements }: any) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {achievements.map((userAchievement: any) => (
        <div
          key={userAchievement.id}
          className="bg-white rounded-lg shadow p-6 border-2 border-green-200"
        >
          <div className="text-4xl mb-3">{userAchievement.achievement.icon}</div>
          <h4 className="font-semibold text-gray-900 mb-1">{userAchievement.achievement.name}</h4>
          <p className="text-sm text-gray-600 mb-3">{userAchievement.achievement.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
              +{userAchievement.achievement.points} pts
            </span>
            <span className="text-xs text-gray-500">
              {new Date(userAchievement.unlockedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
      {achievements.length === 0 && (
        <div className="col-span-full text-center py-12 text-gray-500">
          <p>No achievements unlocked yet. Keep contributing to earn your first achievement!</p>
        </div>
      )}
    </div>
  );
}

function ChallengesTab({ challenges }: any) {
  const activeChallenges = challenges.filter((c: any) => !c.completed);
  const completedChallenges = challenges.filter((c: any) => c.completed);

  return (
    <div className="space-y-6">
      {/* Active Challenges */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Active Challenges</h3>
        <div className="space-y-4">
          {activeChallenges.map((userChallenge: any) => {
            const requirement = JSON.parse(userChallenge.challenge.requirement);
            const progress = (userChallenge.progress / requirement.target) * 100;

            return (
              <div key={userChallenge.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{userChallenge.challenge.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {userChallenge.challenge.description}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-primary-600 bg-primary-100 px-2 py-1 rounded">
                    {userChallenge.challenge.type}
                  </span>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">
                      {userChallenge.progress} / {requirement.target}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 rounded-full h-2 transition-all duration-500"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Ends {new Date(userChallenge.challenge.endDate).toLocaleDateString()}
                  </span>
                  <span className="font-medium text-primary-600">
                    +{userChallenge.challenge.points} pts
                  </span>
                </div>
              </div>
            );
          })}
          {activeChallenges.length === 0 && (
            <p className="text-center py-8 text-gray-500">No active challenges at the moment</p>
          )}
        </div>
      </div>

      {/* Completed Challenges */}
      {completedChallenges.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Completed Challenges</h3>
          <div className="space-y-4">
            {completedChallenges.map((userChallenge: any) => (
              <div
                key={userChallenge.id}
                className="bg-gray-50 rounded-lg p-6 border-2 border-green-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">{userChallenge.challenge.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Completed {new Date(userChallenge.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-3xl">✅</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function getNextLevel(currentLevel: UserLevel): UserLevel | null {
  const levels = [UserLevel.BRONZE, UserLevel.SILVER, UserLevel.GOLD, UserLevel.PLATINUM];
  const currentIndex = levels.indexOf(currentLevel);
  return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null;
}
