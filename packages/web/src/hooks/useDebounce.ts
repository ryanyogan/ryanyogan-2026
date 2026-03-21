import { useEffect, useState } from "react";

/**
 * Debounce a value by a specified delay.
 * Useful for search inputs, form validation, etc.
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns The debounced value
 *
 * @example
 * const [searchTerm, setSearchTerm] = useState("");
 * const debouncedSearch = useDebounce(searchTerm, 200);
 *
 * useEffect(() => {
 *   // This runs 200ms after searchTerm stops changing
 *   fetchResults(debouncedSearch);
 * }, [debouncedSearch]);
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
