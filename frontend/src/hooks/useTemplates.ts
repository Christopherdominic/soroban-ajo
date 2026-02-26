import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GroupTemplate, defaultTemplates } from '@/data/groupTemplates';

interface TemplateState {
  templates: GroupTemplate[];
  customTemplates: GroupTemplate[];
  addCustomTemplate: (template: Omit<GroupTemplate, 'id' | 'usageCount'>) => void;
  deleteCustomTemplate: (id: string) => void;
  getTemplateById: (id: string) => GroupTemplate | undefined;
  getPopularTemplates: () => GroupTemplate[];
  getTemplatesByCategory: (category: string) => GroupTemplate[];
  incrementUsage: (id: string) => void;
}

export const useTemplates = create<TemplateState>()(
  persist(
    (set, get) => ({
      templates: defaultTemplates,
      customTemplates: [],

      addCustomTemplate: (template) => {
        const newTemplate: GroupTemplate = {
          ...template,
          id: `custom-${Date.now()}`,
          usageCount: 0,
        };
        set((state) => ({
          customTemplates: [...state.customTemplates, newTemplate],
        }));
      },

      deleteCustomTemplate: (id) => {
        set((state) => ({
          customTemplates: state.customTemplates.filter((t) => t.id !== id),
        }));
      },

      getTemplateById: (id) => {
        const state = get();
        return [...state.templates, ...state.customTemplates].find((t) => t.id === id);
      },

      getPopularTemplates: () => {
        const state = get();
        return [...state.templates, ...state.customTemplates]
          .filter((t) => t.isPopular)
          .sort((a, b) => b.usageCount - a.usageCount);
      },

      getTemplatesByCategory: (category) => {
        const state = get();
        return [...state.templates, ...state.customTemplates].filter(
          (t) => t.category === category
        );
      },

      incrementUsage: (id) => {
        set((state) => ({
          templates: state.templates.map((t) =>
            t.id === id ? { ...t, usageCount: t.usageCount + 1 } : t
          ),
          customTemplates: state.customTemplates.map((t) =>
            t.id === id ? { ...t, usageCount: t.usageCount + 1 } : t
          ),
        }));
      },
    }),
    {
      name: 'ajo-templates',
    }
  )
);
