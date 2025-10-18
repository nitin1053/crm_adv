import axios, { AxiosResponse, AxiosError } from 'axios';
import { LoginRequest, SignupRequest, JwtResponse, CustomerRequest, CustomerResponse, PaginatedResponse } from '../types';
import { config } from '../config/environment';
import { ErrorHandler } from '../utils/errorHandler';

const api = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: config.requestTimeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors and retry logic
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    
    // Handle 401 errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(error);
    }
    
    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      const timeoutError = ErrorHandler.handleTimeoutError();
      console.error('Request timeout:', timeoutError);
      return Promise.reject(error);
    }
    
    // Handle network errors and retry logic
    if (!error.response && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, config.retryDelay));
      
      // Retry the request
      try {
        return await api(originalRequest);
      } catch (retryError) {
        const retryErrorMessage = ErrorHandler.handleRetryError(1);
        console.error('Retry failed:', retryErrorMessage);
        return Promise.reject(retryError);
      }
    }
    
    // Log error details for debugging
    const errorDetails = ErrorHandler.handleApiError(error);
    console.error('API Error:', {
      status: error.response?.status,
      message: errorDetails.message,
      url: error.config?.url,
      method: error.config?.method
    });
    
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials: LoginRequest): Promise<JwtResponse> => {
    const response: AxiosResponse<JwtResponse> = await api.post('/auth/login', credentials);
    return response.data;
  },

  signup: async (userData: SignupRequest): Promise<any> => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): any => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  hasRole: (role: string): boolean => {
    const user = authService.getCurrentUser();
    return user?.roles?.includes(role) || false;
  },
};

export const customerService = {
  getCustomers: async (page = 0, size = 6, sortBy = 'id', sortDir = 'asc'): Promise<PaginatedResponse<CustomerResponse>> => {
    const response = await api.get(`/customers?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`);
    return response.data;
  },

  getAllCustomers: async (): Promise<CustomerResponse[]> => {
    const response = await api.get('/customers/all');
    return response.data;
  },

  getCustomer: async (id: number): Promise<CustomerResponse> => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },

  createCustomer: async (customer: CustomerRequest): Promise<CustomerResponse> => {
    const response = await api.post('/customers', customer);
    return response.data;
  },

  updateCustomer: async (id: number, customer: CustomerRequest): Promise<CustomerResponse> => {
    const response = await api.put(`/customers/${id}`, customer);
    return response.data;
  },

  deleteCustomer: async (id: number): Promise<void> => {
    await api.delete(`/customers/${id}`);
  },
};

export default api;
