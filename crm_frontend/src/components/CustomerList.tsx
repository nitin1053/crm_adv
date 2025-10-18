import React, { useState, useEffect } from 'react';
import { customerService } from '../services/api';
import { CustomerResponse, PaginatedResponse } from '../types';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import CustomerForm from './CustomerForm';
import CustomerDetails from './CustomerDetails';

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<PaginatedResponse<CustomerResponse> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerResponse | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('asc');
  
  const { hasRole } = useAuth();

  const loadCustomers = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await customerService.getCustomers(currentPage, 6, sortBy, sortDir);
      setCustomers(data);
      setError('');
    } catch (err: any) {
      setError('Failed to load customers');
    } finally {
      setLoading(false);
    }
  }, [currentPage, sortBy, sortDir]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customerService.deleteCustomer(id);
        loadCustomers();
      } catch (err: any) {
        setError('Failed to delete customer');
      }
    }
  };

  const handleEdit = (customer: CustomerResponse) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleView = (customer: CustomerResponse) => {
    setSelectedCustomer(customer);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCustomer(null);
    loadCustomers();
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (selectedCustomer) {
    return (
      <CustomerDetails
        customer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );
  }

  if (showForm) {
    return (
      <CustomerForm
        customer={editingCustomer}
        onClose={handleFormClose}
      />
    );
  }

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Customers</h1>
        {hasRole('ROLE_MANAGER') && (
          <button
            className="btn btn-primary d-flex align-items-center gap-2"
            onClick={() => setShowForm(true)}
          >
            <Plus size={20} />
            Add Customer
          </button>
        )}
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {customers && (
        <>
          <div className="card">
            <table className="table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>
                    ID {sortBy === 'id' && (sortDir === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('firstName')} style={{ cursor: 'pointer' }}>
                    Name {sortBy === 'firstName' && (sortDir === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>
                    Email {sortBy === 'email' && (sortDir === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Phone</th>
                  <th>Company</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.content.map((customer) => (
                  <tr key={customer.id}>
                    <td>{customer.id}</td>
                    <td>{customer.firstName} {customer.lastName}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phone || '-'}</td>
                    <td>{customer.company || '-'}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleView(customer)}
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        {hasRole('ROLE_MANAGER') && (
                          <button
                            className="btn btn-primary"
                            onClick={() => handleEdit(customer)}
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                        )}
                        {hasRole('ROLE_ADMIN') && (
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDelete(customer.id)}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center">
            <div>
              Showing {customers.number * customers.size + 1} to{' '}
              {Math.min((customers.number + 1) * customers.size, customers.totalElements)} of{' '}
              {customers.totalElements} customers
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-secondary"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={customers.first}
              >
                Previous
              </button>
              <span className="d-flex align-items-center">
                Page {customers.number + 1} of {customers.totalPages}
              </span>
              <button
                className="btn btn-secondary"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={customers.last}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomerList;
