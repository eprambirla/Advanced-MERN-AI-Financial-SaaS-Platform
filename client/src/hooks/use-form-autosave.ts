import { useEffect, useRef, useCallback } from "react";
import { UseFormReturn, FieldValues } from "react-hook-form";

interface UseFormAutosaveOptions<T extends FieldValues> {
  form: UseFormReturn<T>;
  storageKey: string;
  debounceMs?: number;
}

export function useFormAutosave<T extends FieldValues>({
  form,
  storageKey,
  debounceMs = 1000,
}: UseFormAutosaveOptions<T>) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isRestoringRef = useRef(false);

  const saveToStorage = useCallback((data: Partial<T>) => {
    try {
      const serialized = JSON.stringify(data);
      sessionStorage.setItem(storageKey, serialized);
    } catch {
      // Storage full or unavailable
    }
  }, [storageKey]);

  const loadFromStorage = useCallback((): Partial<T> | null => {
    try {
      const serialized = sessionStorage.getItem(storageKey);
      if (!serialized) return null;
      return JSON.parse(serialized);
    } catch {
      return null;
    }
  }, [storageKey]);

  const clearStorage = useCallback(() => {
    sessionStorage.removeItem(storageKey);
  }, [storageKey]);

  useEffect(() => {
    isRestoringRef.current = true;
    const savedData = loadFromStorage();
    if (savedData && Object.keys(savedData).length > 0) {
      form.reset(savedData as T, {
        keepDirty: false,
        keepTouched: false,
      });
    }
    isRestoringRef.current = false;
  }, [form, loadFromStorage]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (isRestoringRef.current) return;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        const { ...formData } = value;
        saveToStorage(formData as Partial<T>);
      }, debounceMs);
    });

    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [form, saveToStorage, debounceMs]);

  return { clearStorage };
}
