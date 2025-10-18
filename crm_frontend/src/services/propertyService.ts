import axios from 'axios';
import { PropertyRequest, PropertyResponse, PropertyFilters, PropertyStats } from '../types';
import { config } from '../config/environment';

const api = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: config.requestTimeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const propertyService = {
  // Get properties with filters
  getProperties: async (filters: PropertyFilters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.city) params.append('city', filters.city);
    if (filters.state) params.append('state', filters.state);
    if (filters.propertyType) params.append('propertyType', filters.propertyType);
    if (filters.status) params.append('status', filters.status);
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.minBedrooms) params.append('minBedrooms', filters.minBedrooms.toString());
    if (filters.minBathrooms) params.append('minBathrooms', filters.minBathrooms.toString());
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.size) params.append('size', filters.size.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortDir) params.append('sortDir', filters.sortDir);

    const response = await api.get(`/properties?${params.toString()}`);
    return response.data;
  },

  // Search properties
  searchProperties: async (query: string, page: number = 0, size: number = 10) => {
    const response = await api.get(`/properties/search?q=${encodeURIComponent(query)}&page=${page}&size=${size}`);
    return response.data;
  },

  // Get featured properties
  getFeaturedProperties: async () => {
    const response = await api.get('/properties/featured');
    return response.data;
  },

  // Get property by ID
  getPropertyById: async (id: number) => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  // Create property
  createProperty: async (property: PropertyRequest) => {
    const response = await api.post('/properties', property);
    return response.data;
  },

  // Update property
  updateProperty: async (id: number, property: PropertyRequest) => {
    const response = await api.put(`/properties/${id}`, property);
    return response.data;
  },

  // Delete property
  deleteProperty: async (id: number) => {
    await api.delete(`/properties/${id}`);
  },

  // Get property statistics
  getPropertyStats: async () => {
    const response = await api.get('/properties/stats');
    return response.data;
  },

  // Analyze property with AI
  analyzeProperty: async (id: number) => {
    const response = await api.post(`/properties/${id}/analyze`);
    return response.data;
  },

  // Get market analysis
  getMarketAnalysis: async (city: string, state: string) => {
    const response = await api.get(`/properties/market-analysis?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}`);
    return response.data;
  },

  // Get all properties (for admin)
  getAllProperties: async () => {
    const response = await api.get('/properties?size=1000');
    return response.data.content;
  }
};

