import React, { useState, useEffect } from 'react';
import { propertyService } from '../services/propertyService';
import { PropertyStats, PropertyResponse } from '../types';
import { 
  Home, 
  DollarSign, 
  TrendingUp, 
  MapPin, 
  BarChart3, 
  Plus,
  Brain,
  Building2,
  Users,
  Star,
  Target,
  Zap
} from 'lucide-react';
import PropertyList from './PropertyList';
import PropertyForm from './PropertyForm';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PropertyDashboard: React.FC = () => {
  const [stats, setStats] = useState<PropertyStats | null>(null);
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const canManage = hasRole('ROLE_MANAGER') || hasRole('ROLE_ADMIN');
  const [error, setError] = useState('');
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<PropertyResponse | null>(null);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await propertyService.getPropertyStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load property stats:', error);
      setError('Failed to load property statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleEditProperty = (property: PropertyResponse) => {
    setSelectedProperty(property);
    setShowPropertyForm(true);
  };

  const handleCloseForm = () => {
    setShowPropertyForm(false);
    setSelectedProperty(null);
    loadStats();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Building2 className="text-white h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Property Hub</h1>
                <p className="text-gray-600 text-sm sm:text-base">Manage your real estate portfolio</p>
              </div>
            </div>
            { (hasRole('ROLE_MANAGER') || hasRole('ROLE_ADMIN')) && (
              <button
                onClick={() => navigate('/properties/new')}
                className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Property
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center justify-between">
            <span>{error}</span>
            <button onClick={loadStats} className="ml-4 px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200">Retry</button>
          </div>
        )}

        {/* Stats Overview */}
        {stats && (
          <div className="gap-6" style={{ display: 'flex', overflowX: 'auto', paddingBottom: '8px' }}>
            <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow" style={{ minWidth: 260, flex: '0 0 auto' }}>
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Home className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">For Sale</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalForSale}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow" style={{ minWidth: 260, flex: '0 0 auto' }}>
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">For Rent</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalForRent}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow" style={{ minWidth: 260, flex: '0 0 auto' }}>
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Sold</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalSold}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow" style={{ minWidth: 260, flex: '0 0 auto' }}>
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rented</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalRented}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Price Analysis */}
        {stats && (stats.averageSalePrice || stats.averageRentPrice) && (
          <div className="flex flex-row flex-wrap items-stretch gap-4" style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'stretch' }}>
            <div className="bg-white rounded-lg shadow-sm border p-6" style={{ flex: '1 1 320px', minWidth: 300 }}>
              <div className="flex items-center mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900">Average Sale Price</h3>
              </div>
              <p className="text-3xl font-bold text-green-600 mb-2">
                {formatPrice(stats.averageSalePrice)}
              </p>
              <p className="text-gray-600">Based on {stats.totalForSale} properties for sale</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6" style={{ flex: '1 1 320px', minWidth: 300 }}>
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Home className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900">Average Rent Price</h3>
              </div>
              <p className="text-3xl font-bold text-blue-600 mb-2">
                {formatPrice(stats.averageRentPrice)}
              </p>
              <p className="text-gray-600">Based on {stats.totalForRent} properties for rent</p>
            </div>
          </div>
        )}

        {/* City Statistics */}
        {stats && stats.cityStatistics && stats.cityStatistics.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-purple-100 rounded-lg">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900">Properties by City</h3>
            </div>
            <div className="gap-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
              {stats.cityStatistics.slice(0, 6).map(([city, count]) => (
                <div key={city} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg" style={{ minWidth: 220, flex: '0 0 auto' }}>
                  <div>
                    <h4 className="font-medium text-gray-900">{city}</h4>
                    <p className="text-sm text-gray-600">{count} properties</p>
                  </div>
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Building2 className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Features Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="ml-3 text-xl font-bold text-white">AI-Powered Intelligence</h3>
              <p className="ml-3 text-blue-100">Advanced analytics and insights</p>
            </div>
          </div>
          <div className="gap-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12, alignItems: 'stretch' }}>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <h4 className="ml-2 font-semibold text-white">Property Analysis</h4>
              </div>
              <p className="text-blue-100 text-sm">AI analyzes each property for market value and recommendations</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <h4 className="ml-2 font-semibold text-white">Market Insights</h4>
              </div>
              <p className="text-blue-100 text-sm">Real-time market analysis and trends for any city</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <h4 className="ml-2 font-semibold text-white">Lead Scoring</h4>
              </div>
              <p className="text-blue-100 text-sm">AI automatically scores leads based on property interest</p>
            </div>
          </div>
        </div>

        {/* Properties List */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">All Properties</h3>
            { (hasRole('ROLE_MANAGER') || hasRole('ROLE_ADMIN')) && (
              <button
                onClick={() => navigate('/properties/new')}
                className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </button>
            )}
          </div>
          <PropertyList
            onEdit={canManage ? (property) => handleEditProperty(property) : undefined}
            onDelete={canManage ? async (property) => {
              try {
                await propertyService.deleteProperty(property.id);
                loadStats();
              } catch (e) {
                console.error('Failed to delete property', e);
                throw e;
              }
            } : undefined}
          />
        </div>

        {/* Property Form Modal */}
        {showPropertyForm && (
          <PropertyForm
            property={selectedProperty}
            onClose={handleCloseForm}
          />
        )}
      </div>
    </div>
  );
};

export default PropertyDashboard;