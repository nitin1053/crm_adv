import React, { useState, useEffect, useCallback } from 'react';
import { propertyService } from '../services/propertyService';
import { PropertyResponse, PropertyFilters, PropertyType, PropertyStatus } from '../types';
import { Search, Filter, MapPin, Bed, Bath, Square, Eye, Edit, Trash2, Brain, Heart } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

type PropertyListProps = {
  onView?: (property: PropertyResponse) => void;
  onEdit?: (property: PropertyResponse) => void;
  onDelete?: (property: PropertyResponse) => Promise<void> | void;
};

const PropertyList: React.FC<PropertyListProps> = ({ onView, onEdit, onDelete }) => {
  const [properties, setProperties] = useState<PropertyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<PropertyFilters>({
    page: 0,
    size: 12,
    sortBy: 'createdAt',
    sortDir: 'desc'
  });

  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Load favorites from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('favoriteProperties');
      if (raw) setFavoriteIds(JSON.parse(raw));
    } catch {}
  }, []);

  const toggleFavorite = (id: number) => {
    setFavoriteIds(prev => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter(x => x !== id) : [...prev, id];
      try { localStorage.setItem('favoriteProperties', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  // Initialize filters/search from URL on first load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || '';
    const page = parseInt(params.get('page') || '0', 10);
    const size = parseInt(params.get('size') || '12', 10);
    const ptRaw = params.get('propertyType') || undefined;
    const stRaw = params.get('status') || undefined;
    const validPT = Object.values(PropertyType) as string[];
    const validST = Object.values(PropertyStatus) as string[];
    const propertyType = ptRaw && validPT.includes(ptRaw) ? (ptRaw as PropertyType) : undefined;
    const status = stRaw && validST.includes(stRaw) ? (stRaw as PropertyStatus) : undefined;
    const city = params.get('city') || undefined;
    const stateParam = params.get('state') || undefined;
    const minPrice = params.get('minPrice') ? Number(params.get('minPrice')) : undefined;
    const maxPrice = params.get('maxPrice') ? Number(params.get('maxPrice')) : undefined;
    const minBedrooms = params.get('minBedrooms') ? Number(params.get('minBedrooms')) : undefined;
    const minBathrooms = params.get('minBathrooms') ? Number(params.get('minBathrooms')) : undefined;

    setSearchTerm(q);
    setFilters(prev => ({
      ...prev,
      page: isNaN(page) ? 0 : page,
      size: isNaN(size) ? 12 : size,
      propertyType,
      status,
      city,
      state: stateParam,
      minPrice,
      maxPrice,
      minBedrooms,
      minBathrooms
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep URL in sync with filters and search term
  useEffect(() => {
    const qs = new URLSearchParams();
    if (searchTerm) qs.set('q', searchTerm);
    if (filters.page !== undefined) qs.set('page', String(filters.page));
    if (filters.size !== undefined) qs.set('size', String(filters.size));
    if (filters.propertyType) qs.set('propertyType', filters.propertyType);
    if (filters.status) qs.set('status', filters.status);
    if (filters.city) qs.set('city', filters.city);
    if (filters.state) qs.set('state', filters.state);
    if (filters.minPrice !== undefined) qs.set('minPrice', String(filters.minPrice));
    if (filters.maxPrice !== undefined) qs.set('maxPrice', String(filters.maxPrice));
    if (filters.minBedrooms !== undefined) qs.set('minBedrooms', String(filters.minBedrooms));
    if (filters.minBathrooms !== undefined) qs.set('minBathrooms', String(filters.minBathrooms));

    navigate({ pathname: location.pathname, search: `?${qs.toString()}` }, { replace: true });
  }, [filters, searchTerm, navigate, location.pathname]);

  const loadProperties = useCallback(async () => {
    try {
      setLoading(true);
      const data = await propertyService.getProperties(filters);
      setProperties(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
      setError('');
    } catch (err: any) {
      setError('Failed to load properties');
      console.error('Error loading properties:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      try {
        setLoading(true);
        setFilters(prev => ({ ...prev, page: 0 }));
        const data = await propertyService.searchProperties(searchTerm, 0, filters.size || 12);
        setProperties(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
        setError('');
      } catch (err: any) {
        setError('Search failed');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    } else {
      loadProperties();
    }
  };

  const handleFilterChange = (key: keyof PropertyFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 0 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleClearFilters = () => {
    setFilters({ page: 0, size: 12, sortBy: 'createdAt', sortDir: 'desc' });
    setSearchTerm('');
  };

  const getPageNumbers = () => {
    const total = totalPages;
    const current = filters.page || 0;
    const range: (number | string)[] = [];
    const delta = 2;
    const left = Math.max(0, current - delta);
    const right = Math.min(total - 1, current + delta);

    for (let i = 0; i < total; i++) {
      if (i === 0 || i === total - 1 || (i >= left && i <= right)) {
        range.push(i);
      }
    }

    const pages: (number | string)[] = [];
    let prev: number | undefined;
    for (const p of range) {
      if (typeof prev === 'number') {
        if ((p as number) - prev === 2) {
          pages.push(prev + 1);
        } else if ((p as number) - prev > 2) {
          pages.push('...');
        }
      }
      pages.push(p);
      prev = p as number;
    }

    return pages;
  };

  const formatPrice = (price: number | string | undefined) => {
    if (price === undefined || price === null) return 'N/A';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numPrice)) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  const formatPropertyType = (type: PropertyType) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatStatus = (status: PropertyStatus) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStatusColor = (status: PropertyStatus) => {
    switch (status) {
      case PropertyStatus.FOR_SALE:
        return 'bg-green-100 text-green-800';
      case PropertyStatus.FOR_RENT:
        return 'bg-blue-100 text-blue-800';
      case PropertyStatus.SOLD:
        return 'bg-gray-100 text-gray-800';
      case PropertyStatus.RENTED:
        return 'bg-purple-100 text-purple-800';
      case PropertyStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case PropertyStatus.OFF_MARKET:
        return 'bg-red-100 text-red-800';
      case PropertyStatus.COMING_SOON:
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  const displayedProperties = favoritesOnly ? properties.filter(p => favoriteIds.includes(p.id)) : properties;

  if (loading && properties.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Properties</h2>
        
        {/* Search and Filter Controls */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Filter size={16} />
              Filters
            </button>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
            <button
              onClick={() => setFavoritesOnly(v => !v)}
              className={`px-4 py-2 border rounded-lg transition-colors ${favoritesOnly ? 'bg-yellow-100 border-yellow-300' : 'border-gray-300 hover:bg-gray-50'}`}
              aria-pressed={favoritesOnly}
            >
              {favoritesOnly ? 'Showing Favorites' : 'Favorites Only'}
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                <select
                  value={filters.propertyType || ''}
                  onChange={(e) => handleFilterChange('propertyType', e.target.value ? (e.target.value as PropertyType) : undefined)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  {Object.values(PropertyType)
                    .filter((v) => typeof v === 'string')
                    .map(type => (
                      <option key={type as string} value={type as string}>{formatPropertyType(type as PropertyType)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value ? (e.target.value as PropertyStatus) : undefined)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  {Object.values(PropertyStatus)
                    .filter((v) => typeof v === 'string')
                    .map(status => (
                      <option key={status as string} value={status as string}>{formatStatus(status as PropertyStatus)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                <input
                  type="number"
                  placeholder="Min Price"
                  value={filters.minPrice || ''}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                <input
                  type="number"
                  placeholder="Max Price"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Bedrooms</label>
                <input
                  type="number"
                  min="1"
                  placeholder="Min Bedrooms"
                  value={filters.minBedrooms || ''}
                  onChange={(e) => handleFilterChange('minBedrooms', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Bathrooms</label>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  placeholder="Min Bathrooms"
                  value={filters.minBathrooms || ''}
                  onChange={(e) => handleFilterChange('minBathrooms', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  placeholder="City"
                  value={filters.city || ''}
                  onChange={(e) => handleFilterChange('city', e.target.value || undefined)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  placeholder="State"
                  value={filters.state || ''}
                  onChange={(e) => handleFilterChange('state', e.target.value || undefined)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {favoritesOnly ? displayedProperties.length : properties.length} of {totalElements} properties
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={loadProperties} className="ml-4 px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200">Retry</button>
        </div>
      )}

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayedProperties.map((property) => (
          <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {/* Property Image */}
            <div
              className="relative h-48 bg-gray-200 cursor-pointer"
              onClick={() => (onView ? onView(property) : navigate(`/properties/${property.id}`))}
            >
              {property.imageUrl ? (
                <img
                  src={property.imageUrl}
                  alt={property.title || "Property image"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Square size={48} />
                </div>
              )}
              
              {/* Status Badge */}
              <div className="absolute top-2 left-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(property.status)}`}>
                  {formatStatus(property.status)}
                </span>
              </div>

              {/* AI Lead Score */}
              {property.aiLeadScore && property.aiLeadScore >= 70 && (
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 flex items-center gap-1">
                    <Brain size={12} />
                    {property.aiLeadScore}
                  </span>
                </div>
              )}

              {/* Favorite Toggle */}
              <button
                onClick={(e) => { e.stopPropagation(); toggleFavorite(property.id); }}
                aria-label="Toggle favorite"
                className="absolute bottom-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white shadow"
                title="Favorite"
              >
                <Heart size={16} className={favoriteIds.includes(property.id) ? 'text-red-600' : 'text-gray-300'} />
              </button>
            </div>

            {/* Property Details */}
            <div className="p-4">
              <h3
                className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer"
                onClick={() => (onView ? onView(property) : navigate(`/properties/${property.id}`))}
              >
                {property.title}
              </h3>
              
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin size={14} className="mr-1" />
                <span className="text-sm">{property.city}, {property.state}</span>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center text-gray-600 text-sm">
                  <Bed size={14} className="mr-1" />
                  <span className="mr-3">{property.bedrooms}</span>
                  <Bath size={14} className="mr-1" />
                  <span className="mr-3">{property.bathrooms}</span>
                  <Square size={14} className="mr-1" />
                  <span>{property.squareFeet ? property.squareFeet.toLocaleString() : '—'} sq ft</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xl font-bold text-gray-900">
                  {formatPrice(property.price)}
                </div>
                <div className="text-sm text-gray-500">
                  {formatPropertyType(property.propertyType)}
                </div>
              </div>

              {/* AI Insights */}
              {property.aiEstimatedValue && (
                <div className="mt-3 p-2 bg-blue-50 rounded text-sm">
                  <div className="font-medium text-blue-900">AI Estimated Value:</div>
                  <div className="text-blue-700">{formatPrice(property.aiEstimatedValue)}</div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => (onView ? onView(property) : navigate(`/properties/${property.id}`))}
                  aria-label="View property"
                  className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                >
                  <Eye size={14} />
                  View
                </button>
                <button
                  onClick={() => onEdit?.(property)}
                  aria-label="Edit property"
                  title="Edit"
                  className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 transition-colors"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={async () => {
                    if (!onDelete) return;
                    const ok = window.confirm('Delete this property? This action cannot be undone.');
                    if (!ok) return;
                    try {
                      await onDelete(property);
                      await loadProperties();
                    } catch (e) {
                      setError('Failed to delete property');
                    }
                  }}
                  aria-label="Delete property"
                  title="Delete"
                  className="px-3 py-2 border border-red-300 text-red-700 text-sm rounded hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange((filters.page || 0) - 1)}
              disabled={(filters.page || 0) === 0}
              className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {getPageNumbers().map((item, idx) => {
              if (item === '...') {
                return (
                  <span key={`ellipsis-${idx}`} className="px-3 py-2 text-gray-500">…</span>
                );
              }
              const page = item as number;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 border rounded ${
                    (filters.page || 0) === page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page + 1}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange((filters.page || 0) + 1)}
              disabled={(filters.page || 0) >= totalPages - 1}
              className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {displayedProperties.length === 0 && !loading && (
        <div className="text-center py-12">
          <Square size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default PropertyList;
