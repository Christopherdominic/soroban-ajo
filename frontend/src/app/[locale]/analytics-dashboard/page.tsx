'use client';

import { useState } from 'react';
import { useDashboardAnalytics } from '@/hooks/useDashboardAnalytics';
import FinancialOverview from '@/components/FinancialOverview';
import ContributionChart from '@/components/ContributionChart';
import GroupDistributionChart from '@/components/GroupDistributionChart';
import InsightsPanel from '@/components/InsightsPanel';
import SavingsGoals from '@/components/SavingsGoals';
import { exportToCSV, exportToPDF } from '@/utils/exportData';
import toast from 'react-hot-toast';

export default function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year'>('month');
  const [showComparison, setShowComparison] = useState(false);

  // Mock groups data - replace with real data from API
  const groups = [
    { id: '1', name: 'Group A', totalContributed: 500, isActive: true },
    { id: '2', name: 'Group B', totalContributed: 300, isActive: true },
    { id: '3', name: 'Group C', totalContributed: 200, isActive: false, isComplete: true },
  ];

  const {
    metrics,
    groupDistribution,
    savingsGrowth,
    insights,
  } = useDashboardAnalytics(groups);

  const handleExportCSV = () => {
    const data = {
      headers: ['Month', 'Savings', 'Contributions', 'Payouts'],
      rows: savingsGrowth.map((item) => [
        item.month,
        item.savings,
        item.contributions,
        item.payouts,
      ]),
      title: 'Savings Report',
      filename: `savings-report-${Date.now()}.csv`,
    };
    exportToCSV(data);
    toast.success('Exported to CSV');
  };

  const handleExportPDF = () => {
    const data = {
      headers: ['Month', 'Savings', 'Contributions', 'Payouts'],
      rows: savingsGrowth.map((item) => [
        item.month,
        item.savings.toFixed(2),
        item.contributions.toFixed(2),
        item.payouts.toFixed(2),
      ]),
      title: 'Ajo Savings Report',
      filename: `savings-report-${Date.now()}.pdf`,
    };
    exportToPDF(data);
    toast.success('Exported to PDF');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Track your savings and financial progress
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Date Range Filter */}
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="year">Last Year</option>
              </select>

              {/* Export Dropdown */}
              <div className="relative group">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Export
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  <button
                    onClick={handleExportCSV}
                    className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
                  >
                    Export as CSV
                  </button>
                  <button
                    onClick={handleExportPDF}
                    className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg"
                  >
                    Export as PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Financial Overview */}
          <FinancialOverview metrics={metrics} />

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ContributionChart data={savingsGrowth} />
            <GroupDistributionChart data={groupDistribution} />
          </div>

          {/* Insights and Goals Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InsightsPanel insights={insights} />
            <SavingsGoals currentSavings={metrics.totalSavings} />
          </div>

          {/* Comparison Toggle */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Comparison View
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Compare performance across time periods
                </p>
              </div>
              <button
                onClick={() => setShowComparison(!showComparison)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  showComparison
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {showComparison ? 'Hide' : 'Show'} Comparison
              </button>
            </div>

            {showComparison && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    vs Last Month
                  </p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    +12.5%
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    vs Last Quarter
                  </p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    +28.3%
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    vs Last Year
                  </p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    +45.7%
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
