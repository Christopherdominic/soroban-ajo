import React, { useState } from 'react';
import { FilterState, FilterStatus, SortOption } from '@/hooks/useGroupFilters';

interface FilterPanelProps {
    filters: FilterState;
    updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
    clearFilters: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ filters, updateFilter, clearFilters }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="w-full bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm my-4 overflow-visible">
            <div
                className="px-4 py-3 flex justify-between items-center cursor-pointer border-b border-transparent hover:bg-gray-50 dark:hover:bg-slate-750 transition-colors rounded-t-xl"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    <span className="font-semibold text-gray-700 dark:text-gray-200">Filters & Sort</span>
                    {/* Active filter count logic could go here */}
                </div>
                <div className="flex items-center gap-4">
                    <span onClick={(e) => { e.stopPropagation(); clearFilters(); }} className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                        Clear All
                    </span>
                    <svg className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {isOpen && (
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-gray-50/50 dark:bg-slate-800/50 rounded-b-xl border-t border-gray-200 dark:border-slate-700">

                    {/* Status */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Status</label>
                        <select
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                            value={filters.statusFilter}
                            onChange={(e) => updateFilter('statusFilter', e.target.value as FilterStatus)}
                        >
                            <option value="all">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="paused">Paused</option>
                        </select>
                    </div>

                    {/* Amount Range */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Contribution ($)</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                placeholder="Min"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                value={filters.minAmount}
                                onChange={(e) => updateFilter('minAmount', e.target.value ? Number(e.target.value) : '')}
                            />
                            <span className="text-gray-400">-</span>
                            <input
                                type="number"
                                placeholder="Max"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                value={filters.maxAmount}
                                onChange={(e) => updateFilter('maxAmount', e.target.value ? Number(e.target.value) : '')}
                            />
                        </div>
                    </div>

                    {/* Cycle Length */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Cycle (Days)</label>
                        <input
                            type="number"
                            placeholder="Ex: 30"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                            value={filters.cycleLength}
                            onChange={(e) => updateFilter('cycleLength', e.target.value ? Number(e.target.value) : '')}
                        />
                    </div>

                    {/* Sort & Toggles */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Sort By</label>
                        <select
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white mb-2"
                            value={filters.sortOption}
                            onChange={(e) => updateFilter('sortOption', e.target.value as SortOption)}
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="most_members">Most Members</option>
                            <option value="highest_contribution">Highest Contribution</option>
                        </select>

                        <div className="flex flex-col gap-2 mt-1">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="rounded text-blue-600 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700"
                                    checked={filters.myGroupsOnly}
                                    onChange={(e) => updateFilter('myGroupsOnly', e.target.checked)}
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">My Groups Only</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="rounded text-blue-600 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700"
                                    checked={filters.hideFullGroups}
                                    onChange={(e) => updateFilter('hideFullGroups', e.target.checked)}
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Hide Full Groups</span>
                            </label>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};
