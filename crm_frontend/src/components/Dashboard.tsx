import React, { useState, useEffect, useMemo } from 'react';
import { customerService } from '../services/api';
import { propertyService } from '../services/propertyService';
import { CustomerResponse, PropertyResponse, PropertyStats } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Users, UserCheck, UserPlus, TrendingUp, MapPin, Bed, Bath, Square, Home, DollarSign, BarChart3, Building2 } from 'lucide-react';
import DataSeeder from './DataSeeder';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    recentCustomers: [] as CustomerResponse[],
  });
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<PropertyResponse[]>([]);
  const { user, hasRole } = useAuth();
  const [propertyStats, setPropertyStats] = useState<PropertyStats | null>(null);
  const [propertyQuery, setPropertyQuery] = useState('');
  const navigate = useNavigate();
  const canManage = hasRole('ROLE_MANAGER') || hasRole('ROLE_ADMIN');

  
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const customers = await customerService.getAllCustomers();
        const recentCustomers = customers
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);
        
        setStats({
          totalCustomers: customers.length,
          recentCustomers,
        });

        // Load all properties for the dashboard cards
        const allProps = await propertyService.getAllProperties();
        setProperties(allProps || []);

        // Load property stats for insights
        const statsData = await propertyService.getPropertyStats();
        setPropertyStats(statsData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const topCities: Array<[string, number]> = useMemo(() => {
    const counts = new Map<string, number>();
    properties.forEach(p => {
      if (p.city) counts.set(p.city, (counts.get(p.city) || 0) + 1);
    });
    return Array.from(counts.entries()).sort((a,b) => b[1]-a[1]).slice(0,6);
  }, [properties]);

  const getRoleDisplayName = (roles: string[]) => {
    if (roles.includes('ROLE_ADMIN')) return 'Administrator';
    if (roles.includes('ROLE_MANAGER')) return 'Manager';
    if (roles.includes('ROLE_CUSTOMER')) return 'Customer';
    return 'User';
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

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

  
  const goToPropertiesSearch = () => {
    const qs = new URLSearchParams();
    if (propertyQuery.trim()) qs.set('q', propertyQuery.trim());
    navigate({ pathname: '/properties', search: `?${qs.toString()}` });
  };

  return (
    <div className="container">
      <div className="mb-4">
        <h1>Dashboard</h1>
        <p className="text-muted">
          Welcome back, {user?.username}! You are logged in as {getRoleDisplayName(user?.roles || [])}.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="d-flex gap-3 mb-4">
        <div className="card" style={{ flex: 1 }}>
          <div className="d-flex align-items-center gap-3">
            <div style={{ 
              backgroundColor: '#007bff', 
              borderRadius: '8px', 
              padding: '12px',
              color: 'white'
            }}>
              <Users size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '24px' }}>{stats.totalCustomers}</h3>
              <p style={{ margin: 0, color: '#6c757d' }}>Total Customers</p>
            </div>
          </div>
        </div>

        <div className="card" style={{ flex: 1 }}>
          <div className="d-flex align-items-center gap-3">
            <div style={{ 
              backgroundColor: '#28a745', 
              borderRadius: '8px', 
              padding: '12px',
              color: 'white'
            }}>
              <UserCheck size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '24px' }}>{stats.recentCustomers.length}</h3>
              <p style={{ margin: 0, color: '#6c757d' }}>Recent Additions</p>
            </div>
          </div>
        </div>

        <div className="card" style={{ flex: 1 }}>
          <div className="d-flex align-items-center gap-3">
            <div style={{ 
              backgroundColor: '#ffc107', 
              borderRadius: '8px', 
              padding: '12px',
              color: 'white'
            }}>
              <TrendingUp size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '24px' }}>
                {hasRole('ROLE_ADMIN') ? 'Admin' : hasRole('ROLE_MANAGER') ? 'Manager' : 'Viewer'}
              </h3>
              <p style={{ margin: 0, color: '#6c757d' }}>Your Role</p>
            </div>
          </div>
        </div>
      </div>

      {/* Property Insights */}
      {propertyStats && (
        <div className="card">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Property Insights</h3>
            <a href="/properties" className="btn btn-primary">Manage Properties</a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            <div className="card" style={{ margin: 0 }}>
              <div className="d-flex align-items-center gap-3">
                <div style={{ background: '#dcfce7', color: '#166534', padding: 12, borderRadius: 8 }}>
                  <Home size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>For Sale</div>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>{propertyStats.totalForSale}</div>
                </div>
              </div>
            </div>
            <div className="card" style={{ margin: 0 }}>
              <div className="d-flex align-items-center gap-3">
                <div style={{ background: '#dbeafe', color: '#1e40af', padding: 12, borderRadius: 8 }}>
                  <Building2 size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>For Rent</div>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>{propertyStats.totalForRent}</div>
                </div>
              </div>
            </div>
            <div className="card" style={{ margin: 0 }}>
              <div className="d-flex align-items-center gap-3">
                <div style={{ background: '#f3f4f6', color: '#1f2937', padding: 12, borderRadius: 8 }}>
                  <TrendingUp size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>Sold</div>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>{propertyStats.totalSold}</div>
                </div>
              </div>
            </div>
            <div className="card" style={{ margin: 0 }}>
              <div className="d-flex align-items-center gap-3">
                <div style={{ background: '#ede9fe', color: '#4c1d95', padding: 12, borderRadius: 8 }}>
                  <BarChart3 size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>Rented</div>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>{propertyStats.totalRented}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Market Snapshot & Quick Search */}
      <div className="card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Market Snapshot</h3>
          <div className="d-flex gap-2" style={{ alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search properties..."
              value={propertyQuery}
              onChange={(e) => setPropertyQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && goToPropertiesSearch()}
              className="form-input"
              style={{ minWidth: 240 }}
            />
            <button className="btn btn-primary" onClick={goToPropertiesSearch}>Search</button>
            {(hasRole('ROLE_MANAGER') || hasRole('ROLE_ADMIN')) && (
              <a href="/properties/new" className="btn btn-success">Add Property</a>
            )}
          </div>
        </div>
        <div className="d-flex gap-3" style={{ flexWrap: 'wrap' }}>
          <div className="card" style={{ flex: '1 1 280px', margin: 0 }}>
            <div className="d-flex align-items-center gap-3">
              <div style={{ background: '#dcfce7', color: '#166534', padding: 10, borderRadius: 8 }}>
                <DollarSign size={18} />
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>Avg Sale Price</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{propertyStats ? formatPrice(propertyStats.averageSalePrice) : '—'}</div>
              </div>
            </div>
            <div className="d-flex align-items-center gap-3" style={{ marginTop: 12 }}>
              <div style={{ background: '#dbeafe', color: '#1e40af', padding: 10, borderRadius: 8 }}>
                <Home size={18} />
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>Avg Rent Price</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{propertyStats ? formatPrice(propertyStats.averageRentPrice) : '—'}</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ flex: '2 1 360px', margin: 0 }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div style={{ fontWeight: 600 }}>Top Cities</div>
              <a href="/properties" className="text-decoration-none">View All</a>
            </div>
            {topCities.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 8 }}>
                {topCities.map(([city, count]: [string, number]) => (
                  <div key={city} className="d-flex align-items-center justify-content-between" style={{ background: '#f9fafb', borderRadius: 8, padding: '8px 12px' }}>
                    <div className="d-flex align-items-center" style={{ gap: 8 }}>
                      <MapPin size={14} />
                      <div style={{ fontWeight: 600 }}>{city}</div>
                    </div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{count} props</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted">No city data yet.</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Customers */}
      <div className="card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Recent Customers</h3>
          <a href="/customers" className="btn btn-primary">
            View All Customers
          </a>
        </div>
        
        {stats.recentCustomers.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Company</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.firstName} {customer.lastName}</td>
                  <td>{customer.email}</td>
                  <td>{customer.company || '-'}</td>
                  <td>
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-4">
            <UserPlus size={48} className="text-muted mb-3" />
            <p className="text-muted">No customers found. Start by adding your first customer!</p>
            {hasRole('ROLE_MANAGER') && (
              <a href="/customers" className="btn btn-primary">
                Add Customer
              </a>
            )}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3>Quick Actions</h3>
        <div className="d-flex gap-2">
          <a href="/customers" className="btn btn-primary">
            <Users size={16} />
            Manage Customers
          </a>
          {hasRole('ROLE_MANAGER') && (
            <a href="/customers" className="btn btn-success">
              <UserPlus size={16} />
              Add New Customer
            </a>
          )}
        </div>
      </div>

      {/* Latest Properties */}
      <div className="card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Latest Properties</h3>
          <div className="d-flex gap-2">
            <a href="/properties" className="btn btn-primary">View All</a>
            {(hasRole('ROLE_MANAGER') || hasRole('ROLE_ADMIN')) && (
              <a href="/properties/new" className="btn btn-success">Add Property</a>
            )}
          </div>
        </div>
        {properties.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {properties.map((p) => (
              <a key={p.id} href={`/properties/${p.id}`} className="text-decoration-none" style={{ color: 'inherit' }}>
                <div className="card" style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
                  <div style={{ position: 'relative', height: 160, background: '#e5e7eb' }}>
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.title || 'Property image'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div className="d-flex align-items-center justify-content-center" style={{ height: '100%', color: '#9ca3af' }}>
                        <Square size={48} />
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '12px 16px' }}>
                    <h4 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600, color: '#111827' }}>{p.title}</h4>
                    <div className="d-flex align-items-center" style={{ color: '#6b7280', fontSize: 14, marginBottom: 8 }}>
                      <MapPin size={14} style={{ marginRight: 6 }} />
                      <span>{p.city}, {p.state}</span>
                    </div>
                    <div className="d-flex align-items-center" style={{ color: '#6b7280', fontSize: 14, gap: 12, marginBottom: 8 }}>
                      <div className="d-flex align-items-center"><Bed size={14} style={{ marginRight: 4 }} /> {p.bedrooms}</div>
                      <div className="d-flex align-items-center"><Bath size={14} style={{ marginRight: 4 }} /> {p.bathrooms}</div>
                      <div className="d-flex align-items-center"><Square size={14} style={{ marginRight: 4 }} /> {p.squareFeet ? p.squareFeet.toLocaleString() : '—'} sq ft</div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <div style={{ fontWeight: 700, fontSize: 18, color: '#111827' }}>{formatPrice(p.price)}</div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>{p.propertyType?.toString().replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</div>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <p className="text-muted">No properties found.</p>
        )}
      </div>

      {/* Data Seeder */}
      <DataSeeder />
    </div>
  );
};

export default Dashboard;
