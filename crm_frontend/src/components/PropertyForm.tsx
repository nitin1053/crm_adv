import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { propertyService } from '../services/propertyService';
import { PropertyRequest, PropertyResponse, PropertyType, PropertyStatus } from '../types';
import { X, DollarSign, MapPin, Bed, Bath, Square, Image, Link, FileText } from 'lucide-react';

type PropertyFormData = {
  title: string;
  description: string;
  price: number | string;
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
};

interface PropertyFormProps {
  property?: PropertyResponse | null;
  onClose: () => void;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ property, onClose }) => {
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PropertyFormData>({
    defaultValues: property ? {
      title: property.title,
      description: property.description,
      price: typeof property.price === 'string' ? parseFloat(property.price) || 0 : property.price,
      address: property.address,
      city: property.city,
      state: property.state,
      zipCode: property.zipCode,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      squareFeet: property.squareFeet,
      propertyType: property.propertyType,
      status: property.status,
      imageUrl: property.imageUrl || '',
      virtualTourUrl: property.virtualTourUrl || '',
      floorPlanUrl: property.floorPlanUrl || '',
      features: property.features || '',
      amenities: property.amenities || '',
    } : {
      propertyType: PropertyType.SINGLE_FAMILY,
      status: PropertyStatus.FOR_SALE,
    },
  });

  const validateForm = (data: PropertyFormData): string | null => {
    if (!data.title.trim()) return 'Title is required';
    if (!data.description.trim()) return 'Description is required';
    const price = typeof data.price === 'string' ? parseFloat(data.price) : data.price;
    if (!price || price <= 0) return 'Price must be greater than 0';
    if (!data.address.trim()) return 'Address is required';
    if (!data.city.trim()) return 'City is required';
    if (!data.state.trim()) return 'State is required';
    if (!data.zipCode.trim()) return 'ZIP code is required';
    if (!data.bedrooms || data.bedrooms < 1) return 'Bedrooms must be at least 1';
    if (!data.bathrooms || data.bathrooms < 1) return 'Bathrooms must be at least 1';
    if (!data.squareFeet || data.squareFeet < 1) return 'Square feet must be greater than 0';
    return null;
  };

  const onSubmit = async (data: PropertyFormData) => {
    const validationError = validateForm(data);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const propertyData: PropertyRequest = {
        title: data.title.trim(),
        description: data.description.trim(),
        price: typeof data.price === 'string' ? parseFloat(data.price) || 0 : data.price,
        address: data.address.trim(),
        city: data.city.trim(),
        state: data.state.trim(),
        zipCode: data.zipCode.trim(),
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        squareFeet: data.squareFeet,
        propertyType: data.propertyType,
        status: data.status,
        imageUrl: data.imageUrl?.trim() || undefined,
        virtualTourUrl: data.virtualTourUrl?.trim() || undefined,
        floorPlanUrl: data.floorPlanUrl?.trim() || undefined,
        features: data.features?.trim() || undefined,
        amenities: data.amenities?.trim() || undefined,
      };

      if (property) {
        await propertyService.updateProperty(property.id, propertyData);
      } else {
        await propertyService.createProperty(propertyData);
      }

      // Refresh stats if available
      if ((window as any).refreshStats) {
        (window as any).refreshStats();
      }

      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save property');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {property ? 'Edit Property' : 'Add New Property'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText size={20} />
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  {...register('title', { required: true })}
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Property title"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">Title is required</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    {...register('price', { required: true, min: 1 })}
                    type="number"
                    step="0.01"
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">Price must be greater than 0</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                {...register('description', { required: true })}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Property description"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">Description is required</p>
              )}
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MapPin size={20} />
              Location
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <input
                {...register('address', { required: true })}
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Street address"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">Address is required</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  {...register('city', { required: true })}
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="City"
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">City is required</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <input
                  {...register('state', { required: true })}
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="State"
                />
                {errors.state && (
                  <p className="text-red-500 text-sm mt-1">State is required</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code *
                </label>
                <input
                  {...register('zipCode', { required: true })}
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ZIP code"
                />
                {errors.zipCode && (
                  <p className="text-red-500 text-sm mt-1">ZIP code is required</p>
                )}
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Bed size={20} />
              Property Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bedrooms *
                </label>
                <input
                  {...register('bedrooms', { required: true, min: 1 })}
                  type="number"
                  min="1"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.bedrooms && (
                  <p className="text-red-500 text-sm mt-1">Bedrooms must be at least 1</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bathrooms *
                </label>
                <input
                  {...register('bathrooms', { required: true, min: 1 })}
                  type="number"
                  min="1"
                  step="0.5"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.bathrooms && (
                  <p className="text-red-500 text-sm mt-1">Bathrooms must be at least 1</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Square Feet *
                </label>
                <div className="relative">
                  <Square className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    {...register('squareFeet', { required: true, min: 1 })}
                    type="number"
                    min="1"
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                {errors.squareFeet && (
                  <p className="text-red-500 text-sm mt-1">Square feet must be greater than 0</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Type *
                </label>
                <select
                  {...register('propertyType', { required: true })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.values(PropertyType).map(type => (
                    <option key={type} value={type}>
                      {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  {...register('status', { required: true })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.values(PropertyStatus).map(status => (
                    <option key={status} value={status}>
                      {status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Media and Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Image size={20} />
              Media & Links
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  {...register('imageUrl')}
                  type="url"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Virtual Tour URL
                </label>
                <input
                  {...register('virtualTourUrl')}
                  type="url"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/virtual-tour"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Floor Plan URL
                </label>
                <input
                  {...register('floorPlanUrl')}
                  type="url"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/floor-plan.pdf"
                />
              </div>
            </div>
          </div>

          {/* Features and Amenities */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText size={20} />
              Features & Amenities
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Features
                </label>
                <textarea
                  {...register('features')}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="List key features (e.g., Hardwood floors, Updated kitchen, Central AC)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amenities
                </label>
                <textarea
                  {...register('amenities')}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="List amenities (e.g., Pool, Gym, Parking, Security)"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Saving...' : (property ? 'Update Property' : 'Create Property')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyForm;

