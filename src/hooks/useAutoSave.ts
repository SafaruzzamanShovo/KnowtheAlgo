import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash'; // We might need to implement a simple debounce if lodash isn't available, but usually it's better to use a custom one to avoid deps.

// Simple debounce implementation
function useDebounce(callback: any, delay: number) {
  const [timer, setTimer] = useState<any>(null);

  return useCallback((...args: any[]) => {
    if (timer) clearTimeout(timer);
    const newTimer = setTimeout(() => {
      callback(...args);
    }, delay);
    setTimer(newTimer);
  }, [callback, delay, timer]);
}

export type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error';

export const useAutoSave = <T>(
  data: T,
  onSave: (data: T) => Promise<void>,
  delay: number = 2000
) => {
  const [status, setStatus] = useState<SaveStatus>('saved');
  const [lastSavedData, setLastSavedData] = useState<T>(data);

  // Debounced save function
  const debouncedSave = useCallback(
    (newData: T) => {
      setStatus('saving');
      onSave(newData)
        .then(() => {
          setStatus('saved');
          setLastSavedData(newData);
        })
        .catch((err) => {
          console.error("Auto-save failed:", err);
          setStatus('error');
        });
    },
    [onSave]
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      // Deep comparison is expensive, so we might just rely on reference or simple JSON stringify for small objects
      // For rich text content (string), simple comparison works.
      if (JSON.stringify(data) !== JSON.stringify(lastSavedData)) {
        debouncedSave(data);
      }
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [data, delay, debouncedSave, lastSavedData]);

  // Immediate update to "unsaved" when data changes
  useEffect(() => {
    if (JSON.stringify(data) !== JSON.stringify(lastSavedData)) {
      setStatus('unsaved');
    }
  }, [data, lastSavedData]);

  return status;
};
