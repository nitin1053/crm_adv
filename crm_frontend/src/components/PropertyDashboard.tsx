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
  Search,
  Filter
} from 'lucide-react';
import PropertyList from './PropertyList';
import PropertyForm from './PropertyForm';

const PropertyDashboard: React.FC = () => {
  const [stats, setStats] = useState<PropertyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<PropertyResponse | null>(null);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await propertyService.getPropertyStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load property stats:', error);
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
    loadStats(); // Refresh stats after form closes
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="property-dashboard">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Property Management</h1>
            <p className="text-gray-600 mt-2">Manage your real estate portfolio with AI-powered insights</p>
          </div>
          <button
            onClick={() => setShowPropertyForm(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Add Property
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Home className="text-green-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">For Sale</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalForSale}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign className="text-blue-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">For Rent</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalForRent}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="text-purple-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sold</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSold}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <BarChart3 className="text-orange-600" size={24} />
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign size={20} />
              Average Sale Price
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {formatPrice(stats.averageSalePrice)}
            </p>
            <p className="text-sm text-gray-600 mt-2">Based on {stats.totalForSale} properties for sale</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Home size={20} />
              Average Rent Price
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {formatPrice(stats.averageRentPrice)}
            </p>
            <p className="text-sm text-gray-600 mt-2">Based on {stats.totalForRent} properties for rent</p>
          </div>
        </div>
      )}

      {/* City Statistics */}
      {stats && stats.cityStatistics && stats.cityStatistics.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin size={20} />
            Properties by City
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.cityStatistics.slice(0, 6).map(([city, count], index) => (
              <div key={city} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">{city}</span>
                <span className="text-sm text-gray-600">{count} properties</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Features Section */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Brain size={20} />
          AI-Powered Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Property Analysis</h4>
            <p className="text-sm text-gray-600">AI analyzes each property for market value, lead scoring, and recommendations</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Market Insights</h4>
            <p className="text-sm text-gray-600">Get real-time market analysis and trends for any city or region</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Lead Scoring</h4>
            <p className="text-sm text-gray-600">AI automatically scores leads based on property interest and customer profile</p>
          </div>
        </div>
      </div>

      {/* Properties List */}
      <PropertyList />

      {/* Property Form Modal */}
      {showPropertyForm && (
        <PropertyForm
          property={selectedProperty}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default PropertyDashboard;

