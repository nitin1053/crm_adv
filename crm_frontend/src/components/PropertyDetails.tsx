import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { propertyService } from '../services/propertyService';
import { PropertyResponse, PropertyStatus } from '../types';
import { ArrowLeft, MapPin, Bed, Bath, Square, DollarSign, Home, Image, FileText, Brain } from 'lucide-react';

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

const formatStatus = (status?: PropertyStatus) => {
  if (!status) return '';
  return status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
};

const getStatusColor = (status?: PropertyStatus) => {
  switch (status) {
    case 'FOR_SALE':
      return { bg: '#dcfce7', fg: '#166534' };
    case 'FOR_RENT':
      return { bg: '#dbeafe', fg: '#1e40af' };
    case 'SOLD':
      return { bg: '#f3f4f6', fg: '#1f2937' };
    case 'RENTED':
      return { bg: '#ede9fe', fg: '#4c1d95' };
    case 'PENDING':
      return { bg: '#fef3c7', fg: '#92400e' };
    case 'OFF_MARKET':
      return { bg: '#fee2e2', fg: '#991b1b' };
    case 'COMING_SOON':
      return { bg: '#ffedd5', fg: '#9a3412' };
    default:
      return { bg: '#f3f4f6', fg: '#374151' };
  }
};

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [property, setProperty] = useState<PropertyResponse | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        if (!id) throw new Error('Missing property id');
        const data = await propertyService.getPropertyById(Number(id));
        setProperty(data);
      } catch (e: any) {
        setError(e?.response?.data?.message || 'Failed to load property');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container">
        <div className="card">
          <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ marginBottom: 12 }}>
            <ArrowLeft size={16} /> Back
          </button>
          <div className="alert alert-error">{error || 'Property not found'}</div>
        </div>
      </div>
    );
  }

  const statusColor = getStatusColor(property.status);

  return (
    <div className="container" style={{ paddingBottom: 24 }}>
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="d-flex justify-content-between align-items-center" style={{ marginBottom: 12 }}>
          <button onClick={() => navigate(-1)} className="btn btn-secondary">
            <ArrowLeft size={16} /> Back
          </button>
          <div style={{
            background: statusColor.bg,
            color: statusColor.fg,
            padding: '6px 10px',
            borderRadius: 9999,
            fontSize: 12,
            fontWeight: 600,
          }}>
            {formatStatus(property.status)}
          </div>
        </div>

        <h1 style={{ margin: '0 0 8px' }}>{property.title}</h1>
        <div className="d-flex align-items-center" style={{ color: '#6b7280', marginBottom: 8 }}>
          <MapPin size={16} style={{ marginRight: 6 }} />
          <span>{property.address}, {property.city}, {property.state} {property.zipCode}</span>
        </div>
        <div className="d-flex align-items-center" style={{ gap: 16, color: '#374151', marginBottom: 8 }}>
          <div className="d-flex align-items-center"><DollarSign size={18} style={{ marginRight: 6 }} /> <strong>{formatPrice(property.price)}</strong></div>
          <div className="d-flex align-items-center"><Home size={18} style={{ marginRight: 6 }} /> {property.propertyType?.toString().replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</div>
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ position: 'relative', width: '100%', height: 360, background: '#e5e7eb' }}>
          {property.imageUrl ? (
            <img src={property.imageUrl} alt={property.title || 'Property image'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div className="d-flex align-items-center justify-content-center" style={{ height: '100%', color: '#9ca3af' }}>
              <Image size={48} />
            </div>
          )}
          {property.aiLeadScore && property.aiLeadScore >= 70 && (
            <div style={{ position: 'absolute', top: 12, right: 12, background: '#efeaff', color: '#4c1d95', padding: '6px 10px', borderRadius: 9999, fontSize: 12, fontWeight: 600 }}>
              <span className="d-flex align-items-center" style={{ gap: 6 }}>
                <Brain size={14} /> Lead Score: {property.aiLeadScore}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="d-flex gap-3" style={{ flexWrap: 'wrap', marginBottom: 16 }}>
        <div className="card" style={{ flex: '1 1 320px' }}>
          <h3 className="d-flex align-items-center" style={{ gap: 8, marginBottom: 12 }}>
            <FileText size={18} /> Overview
          </h3>
          <div className="d-flex" style={{ gap: 16, color: '#4b5563', flexWrap: 'wrap' }}>
            <div className="d-flex align-items-center"><Bed size={16} style={{ marginRight: 6 }} /> {property.bedrooms} Beds</div>
            <div className="d-flex align-items-center"><Bath size={16} style={{ marginRight: 6 }} /> {property.bathrooms} Baths</div>
            <div className="d-flex align-items-center"><Square size={16} style={{ marginRight: 6 }} /> {property.squareFeet ? property.squareFeet.toLocaleString() : '—'} sq ft</div>
          </div>
          {property.aiEstimatedValue && (
            <div style={{ marginTop: 12, padding: 12, background: '#eff6ff', borderRadius: 8, color: '#1d4ed8' }}>
              <div style={{ fontWeight: 600 }}>AI Estimated Value</div>
              <div>{formatPrice(property.aiEstimatedValue)}</div>
            </div>
          )}
        </div>

        <div className="card" style={{ flex: '1 1 320px' }}>
          <h3 className="d-flex align-items-center" style={{ gap: 8, marginBottom: 12 }}>
            <FileText size={18} /> Description
          </h3>
          <p style={{ color: '#374151', whiteSpace: 'pre-wrap' }}>
            {property.description}
          </p>
        </div>
      </div>

      <div className="d-flex gap-3" style={{ flexWrap: 'wrap', marginBottom: 16 }}>
        <div className="card" style={{ flex: '1 1 320px' }}>
          <h3 className="d-flex align-items-center" style={{ gap: 8, marginBottom: 12 }}>
            <Image size={18} /> Media & Links
          </h3>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {property.virtualTourUrl && (
              <li><a href={property.virtualTourUrl} target="_blank" rel="noreferrer">Virtual Tour</a></li>
            )}
            {property.floorPlanUrl && (
              <li><a href={property.floorPlanUrl} target="_blank" rel="noreferrer">Floor Plan</a></li>
            )}
            {property.imageUrl && (
              <li><a href={property.imageUrl} target="_blank" rel="noreferrer">Main Image</a></li>
            )}
          </ul>
        </div>

        <div className="card" style={{ flex: '1 1 320px' }}>
          <h3 className="d-flex align-items-center" style={{ gap: 8, marginBottom: 12 }}>
            <FileText size={18} /> Features & Amenities
          </h3>
          <div className="d-flex" style={{ gap: 16, color: '#374151', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 200px' }}>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Features</div>
              <div style={{ whiteSpace: 'pre-wrap' }}>{property.features || '—'}</div>
            </div>
            <div style={{ flex: '1 1 200px' }}>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Amenities</div>
              <div style={{ whiteSpace: 'pre-wrap' }}>{property.amenities || '—'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
