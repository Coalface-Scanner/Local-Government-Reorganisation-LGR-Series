import { useState, useCallback } from 'react';

export function useRetry<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  maxRetries = 3,
  delay = 1000
): [T, boolean, number] {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const retryFn = useCallback(
    async (...args: Parameters<T>): Promise<ReturnType<T>> => {
      let lastError: unknown;
      
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          setIsRetrying(attempt > 0);
          setRetryCount(attempt);
          const result = await fn(...args);
          setIsRetrying(false);
          setRetryCount(0);
          return result;
        } catch (error) {
          lastError = error;
          
          if (attempt < maxRetries) {
            // Exponential backoff
            const waitTime = delay * Math.pow(2, attempt);
            await new Promise(resolve => setTimeout(resolve, waitTime));
          }
        }
      }
      
      setIsRetrying(false);
      setRetryCount(0);
      throw lastError;
    },
    [fn, maxRetries, delay]
  ) as T;

  return [retryFn, isRetrying, retryCount];
}
