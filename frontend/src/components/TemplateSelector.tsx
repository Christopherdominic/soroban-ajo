'use client';

import React, { useState } from 'react';
import { GroupTemplate, categoryInfo } from '@/data/groupTemplates';
import { useTemplates } from '@/hooks/useTemplates';
import TemplateCard from './TemplateCard';
import TemplatePreview from './TemplatePreview';
import { Sparkles } from 'lucide-react';

interface TemplateSelectorProps {
  onSelectTemplate: (template: GroupTemplate) => void;
}

export default function TemplateSelector({ onSelectTemplate }: TemplateSelectorProps) {
  const { templates, customTemplates, getPopularTemplates, getTemplatesByCategory, incrementUsage } = useTemplates();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewTemplate, setPreviewTemplate] = useState<GroupTemplate | null>(null);

  const allTemplates = [...templates, ...customTemplates];
  const popularTemplates = getPopularTemplates();

  const filteredTemplates =
    selectedCategory === 'all'
      ? allTemplates
      : selectedCategory === 'popular'
      ? popularTemplates
      : getTemplatesByCategory(selectedCategory);

  const handleSelectTemplate = (template: GroupTemplate) => {
    incrementUsage(template.id);
    onSelectTemplate(template);
  };

  const categories = [
    { id: 'all', name: 'All Templates', icon: '📋' },
    { id: 'popular', name: 'Popular', icon: '⭐' },
    ...Object.entries(categoryInfo).map(([id, info]) => ({
      id,
      name: info.name,
      icon: templates.find((t) => t.category === id)?.icon || '📁',
    })),
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
        <Sparkles className="w-5 h-5" />
        <h3 className="text-lg font-bold">Quick Start with Templates</h3>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <span>{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onSelect={handleSelectTemplate}
            onPreview={setPreviewTemplate}
          />
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No templates found in this category
          </p>
        </div>
      )}

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
