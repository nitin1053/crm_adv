import React, { useState, useEffect } from 'react';
import { customerService } from '../services/api';
import { CustomerResponse } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Users, UserCheck, UserPlus, TrendingUp } from 'lucide-react';
import DataSeeder from './DataSeeder';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    recentCustomers: [] as CustomerResponse[],
  });
  const [loading, setLoading] = useState(true);
  const { user, hasRole } = useAuth();

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
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

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

      {/* Data Seeder */}
      <DataSeeder />
    </div>
  );
};

export default Dashboard;
