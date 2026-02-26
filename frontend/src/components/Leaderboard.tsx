'use client';

import React, { useState, useEffect } from 'react';
import { LeaderboardEntry, LEVEL_CONFIGS, UserLevel } from '@/types/gamification';

interface LeaderboardProps {
  limit?: number;
  currentUserAddress?: string;
}

export default function Leaderboard({ limit = 100, currentUserAddress }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'week' | 'month'>('all');

  useEffect(() => {
    fetchLeaderboard();
  }, [limit]);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`/api/achievements/leaderboard?limit=${limit}`);
      const data = await response.json();
      if (data.success) {
        setLeaderboard(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
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

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Leaderboard</h2>
            <p className="text-gray-600 mt-1">Top savers in the community</p>
          </div>
          <div className="text-4xl">🏆</div>
        </div>

        {/* Filters */}
        <div className="flex space-x-2 mt-4">
          <FilterButton
            active={filter === 'all'}
            onClick={() => setFilter('all')}
            label="All Time"
          />
          <FilterButton
            active={filter === 'week'}
            onClick={() => setFilter('week')}
            label="This Week"
          />
          <FilterButton
            active={filter === 'month'}
            onClick={() => setFilter('month')}
            label="This Month"
          />
        </div>
      </div>

      {/* Top 3 */}
      {leaderboard.length >= 3 && (
        <div className="p-6 bg-gradient-to-b from-yellow-50 to-white">
          <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
            {/* 2nd Place */}
            <div className="flex flex-col items-center pt-8">
              <div className="text-4xl mb-2">🥈</div>
              <LeaderCard entry={leaderboard[1]} rank={2} isCurrentUser={leaderboard[1].user.walletAddress === currentUserAddress} />
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center">
              <div className="text-5xl mb-2">🥇</div>
              <LeaderCard entry={leaderboard[0]} rank={1} isCurrentUser={leaderboard[0].user.walletAddress === currentUserAddress} />
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center pt-12">
              <div className="text-3xl mb-2">🥉</div>
              <LeaderCard entry={leaderboard[2]} rank={3} isCurrentUser={leaderboard[2].user.walletAddress === currentUserAddress} />
            </div>
          </div>
        </div>
      )}

      {/* Rest of Leaderboard */}
      <div className="divide-y divide-gray-200">
        {leaderboard.slice(3).map((entry, index) => (
          <LeaderboardRow
            key={entry.id}
            entry={entry}
            rank={index + 4}
            isCurrentUser={entry.user.walletAddress === currentUserAddress}
          />
        ))}
      </div>

      {leaderboard.length === 0 && (
        <div className="p-12 text-center text-gray-500">
          <p>No leaderboard data available yet</p>
        </div>
      )}
    </div>
  );
}

function FilterButton({
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
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-primary-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );
}

function LeaderCard({
  entry,
  rank,
  isCurrentUser,
}: {
  entry: LeaderboardEntry;
  rank: number;
  isCurrentUser: boolean;
}) {
  const levelConfig = LEVEL_CONFIGS[entry.level as UserLevel];

  return (
    <div
      className={`bg-white rounded-lg shadow-lg p-4 w-full ${
        isCurrentUser ? 'ring-2 ring-primary-600' : ''
      }`}
    >
      <div className="text-center">
        <div className="text-2xl mb-2">{levelConfig.icon}</div>
        <p className="font-semibold text-gray-900 truncate">
          {formatAddress(entry.user.walletAddress)}
        </p>
        <p className={`text-sm font-medium ${levelConfig.color}`}>{entry.level}</p>
        <p className="text-2xl font-bold text-primary-600 mt-2">
          {entry.points.toLocaleString()}
        </p>
        <p className="text-xs text-gray-500">points</p>
        {entry.contributionStreak > 0 && (
          <div className="mt-2 inline-flex items-center text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
            🔥 {entry.contributionStreak} day streak
          </div>
        )}
      </div>
    </div>
  );
}

function LeaderboardRow({
  entry,
  rank,
  isCurrentUser,
}: {
  entry: LeaderboardEntry;
  rank: number;
  isCurrentUser: boolean;
}) {
  const levelConfig = LEVEL_CONFIGS[entry.level as UserLevel];

  return (
    <div
      className={`p-4 hover:bg-gray-50 transition-colors ${
        isCurrentUser ? 'bg-primary-50' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          {/* Rank */}
          <div className="w-12 text-center">
            <span className="text-lg font-bold text-gray-600">#{rank}</span>
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-3 flex-1">
            <div className="text-2xl">{levelConfig.icon}</div>
            <div>
              <p className="font-semibold text-gray-900">
                {formatAddress(entry.user.walletAddress)}
                {isCurrentUser && (
                  <span className="ml-2 text-xs font-medium text-primary-600 bg-primary-100 px-2 py-1 rounded">
                    You
                  </span>
                )}
              </p>
              <p className={`text-sm ${levelConfig.color}`}>{entry.level}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="hidden md:flex items-center space-x-6">
            {entry.contributionStreak > 0 && (
              <div className="text-center">
                <p className="text-sm text-gray-500">Streak</p>
                <p className="font-semibold text-orange-600">🔥 {entry.contributionStreak}</p>
              </div>
            )}
          </div>

          {/* Points */}
          <div className="text-right">
            <p className="text-2xl font-bold text-primary-600">
              {entry.points.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">points</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatAddress(address: string): string {
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
