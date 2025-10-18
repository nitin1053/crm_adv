// Property types and enums
export enum PropertyType {
  SINGLE_FAMILY = 'SINGLE_FAMILY',
  CONDO = 'CONDO',
  TOWNHOUSE = 'TOWNHOUSE',
  APARTMENT = 'APARTMENT',
  DUPLEX = 'DUPLEX',
  MULTI_FAMILY = 'MULTI_FAMILY',
  COMMERCIAL = 'COMMERCIAL',
  LAND = 'LAND',
  MOBILE_HOME = 'MOBILE_HOME',
  OTHER = 'OTHER'
}

export enum PropertyStatus {
  FOR_SALE = 'FOR_SALE',
  FOR_RENT = 'FOR_RENT',
  SOLD = 'SOLD',
  RENTED = 'RENTED',
  PENDING = 'PENDING',
  OFF_MARKET = 'OFF_MARKET',
  COMING_SOON = 'COMING_SOON'
}

export interface PropertyRequest {
  title: string;
  description: string;
  price: number | string; // Support both number and string for precision
  address: string;
  city: string;
  state: string;
  zipCode: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  propertyType: PropertyType;
  status: PropertyStatus;
  imageUrl?: string;
  virtualTourUrl?: string;
  floorPlanUrl?: string;
  features?: string;
  amenities?: string;
}

export interface PropertyResponse {
  id: number;
  title: string;
  description: string;
  price: number | string; // Support both number and string for precision
  address: string;
  city: string;
  state: string;
  zipCode: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  propertyType: PropertyType;
  status: PropertyStatus;
  imageUrl?: string;
  virtualTourUrl?: string;
  floorPlanUrl?: string;
  features?: string;
  amenities?: string;
  createdAt: string;
  updatedAt: string;
  aiEstimatedValue?: number | string;
  aiMarketAnalysis?: string;
  aiLeadScore?: number;
  aiRecommendations?: string;
}

export interface PropertyFilters {
  city?: string;
  state?: string;
  propertyType?: PropertyType;
  status?: PropertyStatus;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  minBathrooms?: number;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}

export interface PropertyStats {
  totalForSale: number;
  totalSold: number;
  totalForRent: number;
  totalRented: number;
  averageSalePrice: number | string; // Support both number and string for precision
  averageRentPrice: number | string; // Support both number and string for precision
  cityStatistics: Array<[string, number]>;
}

// Error response interface for better error handling
export interface ApiError {
  message: string;
  status: number;
  timestamp: string;
  path: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

