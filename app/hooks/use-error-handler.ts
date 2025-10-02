import { useState, useCallback } from 'react';
import { ErrorHandler, AppError } from '../lib/error-handler';

export const useErrorHandler = () => {
  const [errors, setErrors] = useState<AppError[]>([]);
  const errorHandler = ErrorHandler.getInstance();

  const handleError = useCallback((code: string, message: string, details?: string) => {
    const error = errorHandler.createError(code, message, details);
    errorHandler.logError(error);
    setErrors(prev => [...prev, error]);
  }, [errorHandler]);

  const handleApiError = useCallback((error: unknown) => {
    const appError = errorHandler.handleApiError(error);
    errorHandler.logError(appError);
    setErrors(prev => [...prev, appError]);
  }, [errorHandler]);

  const clearErrors = useCallback(() => {
    setErrors([]);
    errorHandler.clearErrorLog();
  }, [errorHandler]);

  const removeError = useCallback((timestamp: string) => {
    setErrors(prev => prev.filter(error => error.timestamp !== timestamp));
  }, []);

  return {
    errors,
    handleError,
    handleApiError,
    clearErrors,
    removeError,
  };
};