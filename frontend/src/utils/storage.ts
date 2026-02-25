// frontend/src/utils/storage.ts

export const saveDraft = (key: string, data: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  };
  
  export const getDraft = <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      console.error('Failed to load draft:', error);
      return null;
    }
  };
  
  export const clearDraft = (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to clear draft:', error);
    }
  };