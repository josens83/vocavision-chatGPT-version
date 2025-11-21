// Phase 3-4: Stale-While-Revalidate Hook
// Client-side caching strategy inspired by Vercel SWR

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { cacheGet, cacheSet } from '@/lib/utils/indexedDB';

interface SWRConfig {
  revalidateOnFocus?: boolean;
  revalidateOnReconnect?: boolean;
  refreshInterval?: number; // ms
  dedupingInterval?: number; // ms
  errorRetryCount?: number;
  errorRetryInterval?: number; // ms
  fallbackData?: any;
}

const DEFAULT_CONFIG: SWRConfig = {
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  refreshInterval: 0,
  dedupingInterval: 2000,
  errorRetryCount: 3,
  errorRetryInterval: 5000,
};

interface SWRReturn<T> {
  data: T | undefined;
  error: Error | undefined;
  isLoading: boolean;
  isValidating: boolean;
  mutate: (data?: T | Promise<T>, revalidate?: boolean) => Promise<T | undefined>;
}

// Global cache for request deduplication
const pendingRequests = new Map<string, Promise<any>>();

/**
 * useSWR Hook
 * Stale-While-Revalidate data fetching with caching
 */
export function useSWR<T>(
  key: string | null,
  fetcher: () => Promise<T>,
  config: SWRConfig = {}
): SWRReturn<T> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  const [data, setData] = useState<T | undefined>(finalConfig.fallbackData);
  const [error, setError] = useState<Error | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isValidating, setIsValidating] = useState(false);

  const retryCountRef = useRef(0);
  const mountedRef = useRef(true);

  /**
   * Fetch data with caching and deduplication
   */
  const fetchData = useCallback(
    async (forceRefresh = false): Promise<T | undefined> => {
      if (!key) return undefined;

      setIsValidating(true);

      try {
        // Check if same request is already in flight
        if (pendingRequests.has(key) && !forceRefresh) {
          const result = await pendingRequests.get(key);
          if (mountedRef.current) {
            setData(result);
            setError(undefined);
            setIsLoading(false);
            setIsValidating(false);
          }
          return result;
        }

        // Check cache first
        if (!forceRefresh) {
          const cached = await cacheGet<T>(key);
          if (cached && mountedRef.current) {
            setData(cached);
            setIsLoading(false);
            // Continue to revalidate in background
          }
        }

        // Fetch fresh data
        const promise = fetcher();
        pendingRequests.set(key, promise);

        const result = await promise;

        // Cache the result
        await cacheSet(key, result, 3600000); // 1 hour TTL

        if (mountedRef.current) {
          setData(result);
          setError(undefined);
          retryCountRef.current = 0;
        }

        pendingRequests.delete(key);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');

        // Retry logic
        if (retryCountRef.current < (finalConfig.errorRetryCount || 0)) {
          retryCountRef.current++;

          setTimeout(() => {
            if (mountedRef.current) {
              fetchData(forceRefresh);
            }
          }, finalConfig.errorRetryInterval);
        } else {
          if (mountedRef.current) {
            setError(error);
          }
        }

        pendingRequests.delete(key);
      } finally {
        if (mountedRef.current) {
          setIsLoading(false);
          setIsValidating(false);
        }
      }

      return undefined;
    },
    [key, fetcher, finalConfig.errorRetryCount, finalConfig.errorRetryInterval]
  );

  /**
   * Mutate data manually
   */
  const mutate = useCallback(
    async (newData?: T | Promise<T>, revalidate = true): Promise<T | undefined> => {
      if (!key) return undefined;

      // Optimistic update
      if (newData !== undefined) {
        const resolvedData = newData instanceof Promise ? await newData : newData;
        setData(resolvedData);
        await cacheSet(key, resolvedData, 3600000);
      }

      // Revalidate
      if (revalidate) {
        return fetchData(true);
      }

      return data;
    },
    [key, data, fetchData]
  );

  // Initial fetch
  useEffect(() => {
    if (!key) {
      setIsLoading(false);
      return;
    }

    fetchData();
  }, [key, fetchData]);

  // Refresh interval
  useEffect(() => {
    if (!key || !finalConfig.refreshInterval) return;

    const interval = setInterval(() => {
      fetchData(true);
    }, finalConfig.refreshInterval);

    return () => clearInterval(interval);
  }, [key, finalConfig.refreshInterval, fetchData]);

  // Revalidate on focus
  useEffect(() => {
    if (!key || !finalConfig.revalidateOnFocus) return;

    const handleFocus = () => {
      fetchData(true);
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [key, finalConfig.revalidateOnFocus, fetchData]);

  // Revalidate on reconnect
  useEffect(() => {
    if (!key || !finalConfig.revalidateOnReconnect) return;

    const handleOnline = () => {
      fetchData(true);
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [key, finalConfig.revalidateOnReconnect, fetchData]);

  // Cleanup
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
  };
}

/**
 * useSWRImmutable - Data that rarely changes
 */
export function useSWRImmutable<T>(
  key: string | null,
  fetcher: () => Promise<T>
): SWRReturn<T> {
  return useSWR(key, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
  });
}

/**
 * useSWRInfinite - Paginated data fetching
 */
export function useSWRInfinite<T>(
  getKey: (pageIndex: number, previousPageData: T | null) => string | null,
  fetcher: (key: string) => Promise<T>,
  config?: SWRConfig
) {
  const [pages, setPages] = useState<T[]>([]);
  const [size, setSize] = useState(1);
  const [error, setError] = useState<Error>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPages = async () => {
      setIsLoading(true);
      const newPages: T[] = [];

      try {
        for (let i = 0; i < size; i++) {
          const key = getKey(i, i > 0 ? newPages[i - 1] : null);
          if (!key) break;

          const data = await fetcher(key);
          newPages.push(data);
        }

        setPages(newPages);
        setError(undefined);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchPages();
  }, [size, getKey, fetcher]);

  return {
    data: pages,
    error,
    isLoading,
    isValidating: false,
    size,
    setSize,
    mutate: async () => undefined,
  };
}

console.log('[useSWR] Module loaded');
