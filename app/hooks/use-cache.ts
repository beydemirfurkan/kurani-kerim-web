import { useState, useCallback, useEffect } from 'react';
import { CacheManager } from '../lib/cache-manager';

export const useCache = () => {
  const [isLoading, setIsLoading] = useState(false);
  const cacheManager = CacheManager.getInstance();

  const getCachedData = useCallback(<T>(key: string): T | null => {
    return cacheManager.get<T>(key);
  }, [cacheManager]);

  const setCachedData = useCallback(<T>(
    key: string, 
    data: T, 
    ttl?: number
  ): void => {
    cacheManager.set(key, data, ttl);
  }, [cacheManager]);

  const hasCachedData = useCallback((key: string): boolean => {
    return cacheManager.has(key);
  }, [cacheManager]);

  const deleteCachedData = useCallback((key: string): boolean => {
    return cacheManager.delete(key);
  }, [cacheManager]);

  const clearAllCache = useCallback((): void => {
    cacheManager.clear();
  }, [cacheManager]);

  const fetchWithCache = useCallback(async <T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl?: number
  ): Promise<T> => {
    setIsLoading(true);
    
    try {
      const cachedData = cacheManager.get<T>(key);
      
      if (cachedData) {
        setIsLoading(false);
        return cachedData;
      }

      const freshData = await fetchFn();
      cacheManager.set(key, freshData, ttl);
      
      setIsLoading(false);
      return freshData;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  }, [cacheManager]);

  useEffect(() => {
    const cleanup = () => cacheManager.cleanup();
    const interval = setInterval(cleanup, 60000); // Cleanup every minute
    
    return () => clearInterval(interval);
  }, [cacheManager]);

  return {
    isLoading,
    getCachedData,
    setCachedData,
    hasCachedData,
    deleteCachedData,
    clearAllCache,
    fetchWithCache,
  };
};