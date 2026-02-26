'use client';

import React from 'react';
import { GroupTemplate, categoryInfo } from '@/data/groupTemplates';
import { X, Users, Clock, DollarSign, Calendar, Tag } from 'lucide-react';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useEscapeKey } from '@/hooks/useKeyboardNavigation';

interface TemplatePreviewProps {
  template: GroupTemplate;
  onClose: () => void;
  onUse: (template: GroupTemplate) => void;
}

export default function TemplatePreview({ template, onClose, onUse }: TemplatePreviewProps) {
  const modalRef = useFocusTrap(true);
  useEscapeKey(onClose, true);

  const categoryColor = categoryInfo[template.category].color;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="template-preview-title"
    >
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div
        ref={modalRef as React.RefObject<HTMLDivElement>}
        className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800"
      >
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-6 flex items-start justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="text-5xl">{template.icon}</div>
            <div>
              <h2 id="template-preview-title" className="text-2xl font-bold text-gray-900 dark:text-white">
                {template.name}
              </h2>
              <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 bg-${categoryColor}-100 text-${categoryColor}-700 dark:bg-${categoryColor}-900/30 dark:text-${categoryColor}-400`}>
                {categoryInfo[template.category].name}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Description
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {template.description}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Template Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Contribution</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {template.contributionAmount} XLM
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Frequency</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                    {template.frequency}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Members</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {template.minMembers}-{template.maxMembers}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {template.cycleDuration} cycles
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {template.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {template.usageCount > 0 && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-900 dark:text-blue-300">
                ✨ This template has been used by <strong>{template.usageCount.toLocaleString()}</strong> groups
              </p>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-6 flex gap-3">
          <button
            onClick={() => onUse(template)}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Use This Template
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
