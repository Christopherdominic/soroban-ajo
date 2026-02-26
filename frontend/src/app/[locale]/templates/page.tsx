'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTemplates } from '@/hooks/useTemplates';
import TemplateCard from '@/components/TemplateCard';
import TemplatePreview from '@/components/TemplatePreview';
import { GroupTemplate } from '@/data/groupTemplates';
import { Sparkles, Plus } from 'lucide-react';

export default function TemplatesPage() {
  const router = useRouter();
  const { getPopularTemplates, incrementUsage } = useTemplates();
  const [previewTemplate, setPreviewTemplate] = useState<GroupTemplate | null>(null);

  const popularTemplates = getPopularTemplates();

  const handleSelectTemplate = (template: GroupTemplate) => {
    incrementUsage(template.id);
    router.push(`/groups/create?template=${template.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Group Templates
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Start quickly with pre-configured templates for common savings goals
          </p>
        </div>

        {/* Popular Templates */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              ⭐ Popular Templates
            </h2>
            <button
              onClick={() => router.push('/groups/create')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Custom Group
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={handleSelectTemplate}
                onPreview={setPreviewTemplate}
              />
            ))}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Quick Start
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Get started in seconds with pre-configured settings optimized for your use case
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Fully Customizable
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Adjust any template parameter to match your specific needs and preferences
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="text-3xl mb-3">💾</div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Save Your Own
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Create custom templates from your groups and reuse them for future savings
            </p>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <TemplatePreview
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onUse={handleSelectTemplate}
        />
      )}
    </div>
  );
}
