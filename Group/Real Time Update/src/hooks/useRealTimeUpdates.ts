import { useEffect, useRef } from 'react';

interface UseRealTimeUpdatesOptions {
  enabled?: boolean;
  interval?: number; // in milliseconds
  onUpdate?: () => void;
}

export function useRealTimeUpdates({
  enabled = true,
  interval = 30000, // 30 seconds default
  onUpdate,
}: UseRealTimeUpdatesOptions) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onUpdateRef = useRef(onUpdate);

  // Keep the callback ref updated
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Call immediately on mount if enabled
    if (onUpdateRef.current) {
      onUpdateRef.current();
    }

    // Set up polling
    intervalRef.current = setInterval(() => {
      if (onUpdateRef.current) {
        onUpdateRef.current();
      }
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, interval]);

  const triggerUpdate = () => {
    if (onUpdateRef.current) {
      onUpdateRef.current();
    }
  };

  return { triggerUpdate };
}
