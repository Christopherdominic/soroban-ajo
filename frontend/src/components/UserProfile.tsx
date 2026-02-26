'use client';

import React, { useState, useEffect } from 'react';
import { UserGamification, LEVEL_CONFIGS, UserLevel } from '@/types/gamification';

interface UserProfileProps {
  walletAddress: string;
  isOwnProfile?: boolean;
}

interface UserFollow {
  id: string;
  followerId: string;
  followingId: string;
  follower?: {
    walletAddress: string;
    gamification: UserGamification;
  };
  following?: {
    walletAddress: string;
    gamification: UserGamification;
  };
}

export default function UserProfile({ walletAddress, isOwnProfile = false }: UserProfileProps) {
  const [followers, setFollowers] = useState<UserFollow[]>([]);
  const [following, setFollowing] = useState<UserFollow[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSocialData();
  }, [walletAddress]);

  const fetchSocialData = async () => {
    try {
      const [followersRes, followingRes] = await Promise.all([
        fetch('/api/achievements/followers', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        fetch('/api/achievements/following', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
      ]);

      const followersData = await followersRes.json();
      const followingData = await followingRes.json();

      if (followersData.success) setFollowers(followersData.data);
      if (followingData.success) {
        setFollowing(followingData.data);
        setIsFollowing(followingData.data.some((f: UserFollow) => f.followingId === walletAddress));
      }
    } catch (error) {
      console.error('Failed to fetch social data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      const method = isFollowing ? 'DELETE' : 'POST';
      const response = await fetch(`/api/achievements/follow/${walletAddress}`, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setIsFollowing(!isFollowing);
        fetchSocialData();
      }
    } catch (error) {
      console.error('Failed to follow/unfollow:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {walletAddress.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {formatAddress(walletAddress)}
              </h2>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-sm text-gray-600">
                  {followers.length} followers
                </span>
                <span className="text-sm text-gray-600">
                  {following.length} following
                </span>
              </div>
            </div>
          </div>

          {!isOwnProfile && (
            <button
              onClick={handleFollow}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                isFollowing
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>
      </div>

      {/* Social Lists */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Followers */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Followers</h3>
          </div>
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {followers.map((follow) => (
              <UserListItem
                key={follow.id}
                walletAddress={follow.follower!.walletAddress}
                gamification={follow.follower!.gamification}
              />
            ))}
            {followers.length === 0 && (
              <p className="p-4 text-center text-gray-500 text-sm">No followers yet</p>
            )}
          </div>
        </div>

        {/* Following */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Following</h3>
          </div>
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {following.map((follow) => (
              <UserListItem
                key={follow.id}
                walletAddress={follow.following!.walletAddress}
                gamification={follow.following!.gamification}
              />
            ))}
            {following.length === 0 && (
              <p className="p-4 text-center text-gray-500 text-sm">Not following anyone yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function UserListItem({
  walletAddress,
  gamification,
}: {
  walletAddress: string;
  gamification: UserGamification;
}) {
  const levelConfig = LEVEL_CONFIGS[gamification.level as UserLevel];

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {walletAddress.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-900">{formatAddress(walletAddress)}</p>
            <p className={`text-xs ${levelConfig.color}`}>
              {levelConfig.icon} {gamification.level}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-primary-600">
            {gamification.points.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">points</p>
        </div>
      </div>
    </div>
  );
}

function formatAddress(address: string): string {
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
