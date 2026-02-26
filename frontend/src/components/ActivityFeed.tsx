'use client';

import React, { useState, useEffect } from 'react';
import { ActivityFeedItem, ActivityType } from '@/types/gamification';

interface ActivityFeedProps {
  walletAddress?: string;
  limit?: number;
}

export default function ActivityFeed({ walletAddress, limit = 50 }: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityFeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (walletAddress) {
      fetchActivities();
    }
  }, [walletAddress, limit]);

  const fetchActivities = async () => {
    try {
      const response = await fetch(`/api/achievements/activity?limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setActivities(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
      </div>

      <div className="divide-y divide-gray-200">
        {activities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>

      {activities.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <p>No recent activity</p>
        </div>
      )}
    </div>
  );
}

function ActivityItem({ activity }: { activity: ActivityFeedItem }) {
  const icon = getActivityIcon(activity.type as ActivityType);
  const color = getActivityColor(activity.type as ActivityType);

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start space-x-3">
        <div className={`flex-shrink-0 w-10 h-10 rounded-full ${color} flex items-center justify-center text-xl`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900">{activity.title}</p>
          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
          <p className="text-xs text-gray-500 mt-2">
            {formatTimeAgo(new Date(activity.createdAt))}
          </p>
        </div>
      </div>
    </div>
  );
}

function getActivityIcon(type: ActivityType): string {
  switch (type) {
    case ActivityType.CONTRIBUTION:
      return '💰';
    case ActivityType.ACHIEVEMENT:
      return '🏆';
    case ActivityType.CHALLENGE:
      return '🎯';
    case ActivityType.LEVEL_UP:
      return '⬆️';
    case ActivityType.GROUP_COMPLETE:
      return '✅';
    default:
      return '📌';
  }
}

function getActivityColor(type: ActivityType): string {
  switch (type) {
    case ActivityType.CONTRIBUTION:
      return 'bg-green-100';
    case ActivityType.ACHIEVEMENT:
      return 'bg-yellow-100';
    case ActivityType.CHALLENGE:
      return 'bg-blue-100';
    case ActivityType.LEVEL_UP:
      return 'bg-purple-100';
    case ActivityType.GROUP_COMPLETE:
      return 'bg-indigo-100';
    default:
      return 'bg-gray-100';
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  return date.toLocaleDateString();
}
