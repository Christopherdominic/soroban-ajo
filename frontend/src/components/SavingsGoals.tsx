'use client';

import { useState } from 'react';

interface SavingsGoalsProps {
  currentSavings: number;
  monthlyGoal?: number;
}

export default function SavingsGoals({
  currentSavings,
  monthlyGoal = 1000,
}: SavingsGoalsProps) {
  const [goal, setGoal] = useState(monthlyGoal);
  const progress = (currentSavings / goal) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Savings Goals
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Track your progress towards your goals
        </p>
      </div>

      <div className="space-y-6">
        {/* Monthly Goal */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Monthly Savings Goal
            </span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {currentSavings.toFixed(2)} / {goal.toFixed(2)} XLM
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {progress.toFixed(1)}% complete
          </p>
        </div>

        {/* Goal Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Adjust Monthly Goal
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={goal}
              onChange={(e) => setGoal(Number(e.target.value))}
              className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              step="10"
            />
            <span className="flex items-center px-3 text-gray-600 dark:text-gray-400">
              XLM
            </span>
          </div>
        </div>

        {/* Milestones */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Milestones
          </h4>
          <div className="space-y-2">
            {[
              { label: '25% Goal', value: goal * 0.25, achieved: progress >= 25 },
              { label: '50% Goal', value: goal * 0.5, achieved: progress >= 50 },
              { label: '75% Goal', value: goal * 0.75, achieved: progress >= 75 },
              { label: '100% Goal', value: goal, achieved: progress >= 100 },
            ].map((milestone, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      milestone.achieved
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {milestone.achieved && (
                      <svg
                        className="w-full h-full text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    className={
                      milestone.achieved
                        ? 'text-gray-900 dark:text-white font-medium'
                        : 'text-gray-600 dark:text-gray-400'
                    }
                  >
                    {milestone.label}
                  </span>
                </div>
                <span className="text-gray-600 dark:text-gray-400">
                  {milestone.value.toFixed(2)} XLM
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
