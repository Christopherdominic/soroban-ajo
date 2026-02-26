'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { SavingsGrowth } from '@/hooks/useDashboardAnalytics';

interface ContributionChartProps {
  data: SavingsGrowth[];
}

export default function ContributionChart({ data }: ContributionChartProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Savings Growth
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Track your savings over time
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
          <XAxis
            dataKey="month"
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="savings"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ fill: '#3B82F6', r: 4 }}
            name="Total Savings"
          />
          <Line
            type="monotone"
            dataKey="contributions"
            stroke="#10B981"
            strokeWidth={2}
            dot={{ fill: '#10B981', r: 4 }}
            name="Contributions"
          />
          <Line
            type="monotone"
            dataKey="payouts"
            stroke="#F59E0B"
            strokeWidth={2}
            dot={{ fill: '#F59E0B', r: 4 }}
            name="Payouts"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
