import { useState, useCallback, useMemo, useEffect } from 'react';
import { Group } from '@/types';

export type FilterStatus = 'all' | 'active' | 'completed' | 'paused';
export type SortOption = 'newest' | 'oldest' | 'most_members' | 'highest_contribution';

export interface FilterState {
  searchQuery: string;
  statusFilter: FilterStatus;
  minAmount: number | '';
  maxAmount: number | '';
  cycleLength: number | '';
  hideFullGroups: boolean;
  myGroupsOnly: boolean;
  sortOption: SortOption;
}

const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  statusFilter: 'all',
  minAmount: '',
  maxAmount: '',
  cycleLength: '',
  hideFullGroups: false,
  myGroupsOnly: false,
  sortOption: 'newest',
};

const STORAGE_KEY = 'ajo_group_filters';

export const useGroupFilters = (groups: Group[], userId?: string) => {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFilters({ ...DEFAULT_FILTERS, ...JSON.parse(stored) });
      }
    } catch (e) {
      console.error('Failed to parse stored filters', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when filters change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    }
  }, [filters, isLoaded]);

  const updateFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const filteredAndSortedGroups = useMemo(() => {
    let result = [...groups];

    // 1. Search Query (Name or Description)
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        (g) =>
          g.name.toLowerCase().includes(query) ||
          (g.description && g.description.toLowerCase().includes(query))
      );
    }

    // 2. Status Filter
    if (filters.statusFilter !== 'all') {
      result = result.filter((g) => g.status === filters.statusFilter);
    }

    // 3. Contribution Amount Range
    if (filters.minAmount !== '') {
      result = result.filter((g) => g.contributionAmount >= (filters.minAmount as number));
    }
    if (filters.maxAmount !== '') {
      result = result.filter((g) => g.contributionAmount <= (filters.maxAmount as number));
    }

    // 4. Cycle Length
    if (filters.cycleLength !== '') {
      result = result.filter((g) => g.cycleLength === (filters.cycleLength as number));
    }

    // 5. Available Spots (Hide Full Groups)
    if (filters.hideFullGroups) {
      result = result.filter((g) => g.currentMembers < g.maxMembers);
    }

    // 6. My Groups Only
    // Assuming backend populates `isMember` or we deduce from `userId`
    // Since original groups model might not have members explicitly visible here,
    // If we have a way to match userId with group membership: 
    // This is a placeholder logic based on typical contract data structures.
    if (filters.myGroupsOnly) {
      result = result.filter((g) => (g as any).isMember || (g as any).creator === userId);
    }

    // 7. Sort Options
    result.sort((a, b) => {
      switch (filters.sortOption) {
        case 'newest':
          return new Date(b.nextPayoutDate).getTime() - new Date(a.nextPayoutDate).getTime();
        case 'oldest':
          return new Date(a.nextPayoutDate).getTime() - new Date(b.nextPayoutDate).getTime();
        case 'most_members':
          return b.currentMembers - a.currentMembers;
        case 'highest_contribution':
          return b.contributionAmount - a.contributionAmount;
        default:
          return 0;
      }
    });

    return result;
  }, [groups, filters, userId]);

  return {
    filters,
    updateFilter,
    clearFilters,
    filteredAndSortedGroups,
  };
};
