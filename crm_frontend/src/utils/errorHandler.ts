import { AxiosError } from 'axios';
import { ApiError } from '../types/property';

export interface ErrorMessage {
  title: string;
  message: string;
  type: 'error' | 'warning' | 'info';
}

export class ErrorHandler {
  static handleApiError(error: AxiosError): ErrorMessage {
    const response = error.response;
    
    if (!response) {
      return {
        title: 'Network Error',
        message: 'Unable to connect to the server. Please check your internet connection and try again.',
        type: 'error'
      };
    }

    const status = response.status;
    const data = response.data as ApiError;

    switch (status) {
      case 400:
        return {
          title: 'Bad Request',
          message: data.message || 'Invalid request. Please check your input and try again.',
          type: 'error'
        };
      
      case 401:
        return {
          title: 'Unauthorized',
          message: 'Your session has expired. Please log in again.',
          type: 'error'
        };
      
      case 403:
        return {
          title: 'Forbidden',
          message: 'You do not have permission to perform this action.',
          type: 'error'
        };
      
      case 404:
        return {
          title: 'Not Found',
          message: 'The requested resource was not found.',
          type: 'error'
        };
      
      case 409:
        return {
          title: 'Conflict',
          message: data.message || 'A conflict occurred. The resource may already exist.',
          type: 'error'
        };
      
      case 422:
        return {
          title: 'Validation Error',
          message: this.formatValidationErrors(data),
          type: 'error'
        };
      
      case 500:
        return {
          title: 'Server Error',
          message: 'An internal server error occurred. Please try again later.',
          type: 'error'
        };
      
      default:
        return {
          title: 'Error',
          message: data.message || 'An unexpected error occurred.',
          type: 'error'
        };
    }
  }

  static formatValidationErrors(data: ApiError): string {
    if (data.errors && data.errors.length > 0) {
      const errorMessages = data.errors.map(err => `${err.field}: ${err.message}`).join('\n');
      return errorMessages;
    }
    return data.message || 'Validation failed. Please check your input.';
  }

  static handleTimeoutError(): ErrorMessage {
    return {
      title: 'Request Timeout',
      message: 'The request took too long to complete. Please try again.',
      type: 'error'
    };
  }

  static handleRetryError(attempts: number): ErrorMessage {
    return {
      title: 'Connection Failed',
      message: `Failed to connect after ${attempts} attempts. Please check your connection and try again.`,
      type: 'error'
    };
  }
}
