import { useState, useCallback } from 'react';

interface ErrorState {
  hasError: boolean;
  message: string | null;
  code?: string;
}

export function useErrorHandler() {
  const [error, setError] = useState<ErrorState>({
    hasError: false,
    message: null,
  });

  const handleError = useCallback((err: unknown, userMessage?: string) => {
    console.error('Error:', err);
    
    let message = userMessage || 'An unexpected error occurred. Please try again.';
    
    if (err instanceof Error) {
      // Network errors
      if (err.message.includes('fetch') || err.message.includes('network')) {
        message = 'Network error. Please check your connection and try again.';
      }
      // Supabase errors
      else if (err.message.includes('JWT') || err.message.includes('auth')) {
        message = 'Authentication error. Please refresh the page.';
      }
      // Database errors
      else if (err.message.includes('database') || err.message.includes('query')) {
        message = 'Database error. Please try again in a moment.';
      }
      // Permission errors
      else if (err.message.includes('permission') || err.message.includes('policy')) {
        message = 'Permission denied. You may not have access to this resource.';
      }
    }

    setError({
      hasError: true,
      message,
    });
  }, []);

  const clearError = useCallback(() => {
    setError({
      hasError: false,
      message: null,
    });
  }, []);

  return {
    error,
    handleError,
    clearError,
  };
}
