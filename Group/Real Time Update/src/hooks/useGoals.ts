import { useState, useEffect, useCallback } from 'react';

// Types
export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  targetAmount: string; // BigInt serialized as string
  currentAmount: string; // BigInt serialized as string
  deadline: string;
  category: 'EMERGENCY' | 'VACATION' | 'EDUCATION' | 'HOME' | 'RETIREMENT' | 'CUSTOM';
  isPublic: boolean;
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}

export interface CreateGoalDTO {
  title: string;
  description?: string;
  targetAmount: number | string;
  deadline: Date | string;
  category: string;
  isPublic?: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const useGoals = (userId?: string) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = useCallback(async () => {
    if (!userId) return;
    try {
      // Don't set loading on poll to avoid flicker, only on initial or manual refresh if desired
      // But for simplicity here, we might want to track initial loading separately
      const response = await fetch(`${API_URL}/goals?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch goals');
      const data = await response.json();
      setGoals(data.data);
      setError(null);
    } catch (err) {
      console.error(err);
      // Don't set error state on poll failure to avoid disrupting UI, just log
    }
  }, [userId]);

  // Initial fetch
  useEffect(() => {
    if (userId) {
      setLoading(true);
      fetchGoals().finally(() => setLoading(false));
    }
  }, [userId]); // Removed fetchGoals from dependency to avoid loop if not memoized correctly, but it is useCallback

  // Polling
  useEffect(() => {
    if (!userId) return;
    const interval = setInterval(fetchGoals, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, [userId, fetchGoals]);

  const createGoal = async (goalData: CreateGoalDTO) => {
    if (!userId) throw new Error('User not connected');
    try {
      const response = await fetch(`${API_URL}/goals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...goalData,
            userId
        }),
      });
      if (!response.ok) throw new Error('Failed to create goal');
      const data = await response.json();
      setGoals(prev => [data.data, ...prev]);
      return data.data;
    } catch (err) {
      throw err;
    }
  };

  const updateGoal = async (id: string, updates: Partial<CreateGoalDTO>) => {
    try {
      const response = await fetch(`${API_URL}/goals/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update goal');
      const data = await response.json();
      setGoals(prev => prev.map(g => g.id === id ? data.data : g));
      return data.data;
    } catch (err) {
      throw err;
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/goals/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete goal');
      setGoals(prev => prev.filter(g => g.id !== id));
    } catch (err) {
      throw err;
    }
  };

  return { goals, loading, error, createGoal, updateGoal, deleteGoal, refresh: fetchGoals };
};
