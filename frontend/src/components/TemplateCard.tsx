'use client';

import React from 'react';
import { GroupTemplate, categoryInfo } from '@/data/groupTemplates';
import { Users, Clock, DollarSign, TrendingUp } from 'lucide-react';

interface TemplateCardProps {
  template: GroupTemplate;
  onSelect: (template: GroupTemplate) => void;
  onPreview: (template: GroupTemplate) => void;
}

export default function TemplateCard({ template, onSelect, onPreview }: TemplateCardProps) {
  const categoryColor = categoryInfo[template.category].color;

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{template.icon}</div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {template.name}
            </h3>
            <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${colorClasses[categoryColor]}`}>
              {categoryInfo[template.category].name}
            </span>
          </div>
        </div>
        {template.isPopular && (
          <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded text-xs font-medium">
            <TrendingUp className="w-3 h-3" />
            Popular
          </span>
        )}
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
        {template.description}
      </p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <span className="text-gray-700 dark:text-gray-300">
            {template.contributionAmount} XLM
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-gray-700 dark:text-gray-300 capitalize">
            {template.frequency}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-gray-700 dark:text-gray-300">
            {template.minMembers}-{template.maxMembers} members
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">📅</span>
          <span className="text-gray-700 dark:text-gray-300">
            {template.cycleDuration} cycles
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onSelect(template)}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Use Template
        </button>
        <button
          onClick={() => onPreview(template)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
        >
          Preview
        </button>
      </div>

      {template.usageCount > 0 && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
          Used by {template.usageCount.toLocaleString()} groups
        </p>
      )}
    </div>
  );
}
