import { useCallback } from 'react';
import { AxiosError } from 'axios';
import { ErrorHandler } from '../utils/errorHandler';
import { notificationService } from '../utils/notification';

export const useErrorHandler = () => {
  const handleError = useCallback((error: AxiosError | Error, customMessage?: string) => {
    console.error('Error occurred:', error);
    
    if ('response' in error) {
      // Axios error
      const errorMessage = ErrorHandler.handleApiError(error as AxiosError);
      notificationService.error(
        errorMessage.title,
        customMessage || errorMessage.message
      );
    } else {
      // Regular error
      notificationService.error(
        'Error',
        customMessage || error.message || 'An unexpected error occurred'
      );
    }
  }, []);

  const handleSuccess = useCallback((message: string) => {
    notificationService.success('Success', message);
  }, []);

  const handleWarning = useCallback((message: string) => {
    notificationService.warning('Warning', message);
  }, []);

  const handleInfo = useCallback((message: string) => {
    notificationService.info('Info', message);
  }, []);

  return {
    handleError,
    handleSuccess,
    handleWarning,
    handleInfo
  };
};
