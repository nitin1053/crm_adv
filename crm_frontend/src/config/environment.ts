// Environment configuration
export const config = {
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:9090/api',
  environment: process.env.REACT_APP_ENVIRONMENT || 'development',
  appName: process.env.REACT_APP_APP_NAME || 'CRM Real Estate',
  debug: process.env.REACT_APP_DEBUG === 'true',
  
  // Feature flags
  features: {
    aiFeatures: process.env.REACT_APP_ENABLE_AI_FEATURES !== 'false',
    analytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
  },
  
  // Request timeout in milliseconds
  requestTimeout: 10000,
  
  // Retry configuration
  maxRetries: 3,
  retryDelay: 1000,
  
  // Notification configuration
  notifications: {
    defaultDuration: 5000,
    errorDuration: 8000,
  },
};
