'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTemplates } from '@/hooks/useTemplates';
import TemplateSelector from '@/components/TemplateSelector';
import { GroupTemplate } from '@/data/groupTemplates';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateGroupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getTemplateById, addCustomTemplate } = useTemplates();
  
  const [showTemplates, setShowTemplates] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<GroupTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    contributionAmount: 100,
    frequency: 'monthly' as 'weekly' | 'monthly' | 'quarterly',
    maxMembers: 10,
    cycleDuration: 12,
    cycleLength: 30,
  });
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');

  useEffect(() => {
    const templateId = searchParams.get('template');
    if (templateId) {
      const template = getTemplateById(templateId);
      if (template) {
        setSelectedTemplate(template);
        setFormData({
          name: '',
          description: template.description,
          contributionAmount: template.contributionAmount,
          frequency: template.frequency,
          maxMembers: template.maxMembers,
          cycleDuration: template.cycleDuration,
          cycleLength: template.cycleLength,
        });
        setShowTemplates(false);
      }
    }
  }, [searchParams, getTemplateById]);

  const handleTemplateSelect = (template: GroupTemplate) => {
    setSelectedTemplate(template);
    setFormData({
      name: '',
      description: template.description,
      contributionAmount: template.contributionAmount,
      frequency: template.frequency,
      maxMembers: template.maxMembers,
      cycleDuration: template.cycleDuration,
      cycleLength: template.cycleLength,
    });
    setShowTemplates(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (saveAsTemplate && templateName) {
      addCustomTemplate({
        name: templateName,
        description: formData.description,
        category: 'family',
        icon: '💰',
        contributionAmount: formData.contributionAmount,
        frequency: formData.frequency,
        minMembers: 2,
        maxMembers: formData.maxMembers,
        cycleDuration: formData.cycleDuration,
        cycleLength: formData.cycleLength,
        isPublic: false,
        isPopular: false,
        tags: ['custom'],
      });
      toast.success('Template saved successfully!');
    }

    toast.success('Group created successfully!');
    router.push('/groups');
  };

  if (showTemplates) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Create New Group
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Choose a template to get started quickly, or skip to create from scratch
            </p>
          </div>

          <TemplateSelector onSelectTemplate={handleTemplateSelect} />

          <div className="mt-8 text-center">
            <button
              onClick={() => setShowTemplates(false)}
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
            >
              Skip templates and create from scratch →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => setShowTemplates(true)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to templates
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {selectedTemplate ? `Using: ${selectedTemplate.name}` : 'Create Custom Group'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Group Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contribution Amount (XLM)
                </label>
                <input
                  type="number"
                  value={formData.contributionAmount}
                  onChange={(e) => setFormData({ ...formData, contributionAmount: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Frequency
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Members
                </label>
                <input
                  type="number"
                  value={formData.maxMembers}
                  onChange={(e) => setFormData({ ...formData, maxMembers: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  min="2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cycle Duration
                </label>
                <input
                  type="number"
                  value={formData.cycleDuration}
                  onChange={(e) => setFormData({ ...formData, cycleDuration: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveAsTemplate}
                  onChange={(e) => setSaveAsTemplate(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Save as template
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Reuse these settings for future groups
                  </p>
                </div>
              </label>

              {saveAsTemplate && (
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Template name"
                  className="mt-3 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <Save className="w-5 h-5" />
                Create Group
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
