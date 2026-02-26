'use client';

import { DashboardMetrics } from '@/hooks/useDashboardAnalytics';

interface FinancialOverviewProps {
  metrics: DashboardMetrics;
}

export default function FinancialOverview({ metrics }: FinancialOverviewProps) {
  const cards = [
    {
      title: 'Total Savings',
      value: `${metrics.totalSavings.toFixed(2)} XLM`,
      change: '+12.5%',
      positive: true,
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      ),
    },
    {
      title: 'Total Contributions',
      value: `${metrics.totalContributions.toFixed(2)} XLM`,
      change: '+8.2%',
      positive: true,
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 11l5-5m0 0l5 5m-5-5v12"
        />
      ),
    },
    {
      title: 'Total Payouts',
      value: `${metrics.totalPayouts.toFixed(2)} XLM`,
      change: '+15.3%',
      positive: true,
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
        />
      ),
    },
    {
      title: 'Expected Payouts',
      value: `${metrics.expectedPayouts.toFixed(2)} XLM`,
      change: 'Next cycle',
      positive: true,
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-600 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {card.icon}
              </svg>
            </div>
            <span
              className={`text-sm font-medium ${
                card.positive
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {card.change}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {card.title}
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
