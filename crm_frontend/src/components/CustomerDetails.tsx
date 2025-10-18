import React from 'react';
import { CustomerResponse } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Edit, Trash2, X, Calendar, Mail, Phone, Building, FileText } from 'lucide-react';

interface CustomerDetailsProps {
  customer: CustomerResponse;
  onClose: () => void;
  onEdit: (customer: CustomerResponse) => void;
  onDelete: (id: number) => void;
}

const CustomerDetails: React.FC<CustomerDetailsProps> = ({
  customer,
  onClose,
  onEdit,
  onDelete,
}) => {
  const { hasRole } = useAuth();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container">
      <div className="card">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Customer Details</h2>
          <button
            className="btn btn-secondary"
            onClick={onClose}
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="d-flex gap-4">
          <div style={{ flex: 1 }}>
            <div className="mb-4">
              <h3 className="d-flex align-items-center gap-2">
                {customer.firstName} {customer.lastName}
              </h3>
              <p className="text-muted">Customer ID: {customer.id}</p>
            </div>

            <div className="d-flex flex-column gap-3">
              <div className="d-flex align-items-center gap-2">
                <Mail size={20} className="text-muted" />
                <div>
                  <strong>Email:</strong> {customer.email}
                </div>
              </div>

              {customer.phone && (
                <div className="d-flex align-items-center gap-2">
                  <Phone size={20} className="text-muted" />
                  <div>
                    <strong>Phone:</strong> {customer.phone}
                  </div>
                </div>
              )}

              {customer.company && (
                <div className="d-flex align-items-center gap-2">
                  <Building size={20} className="text-muted" />
                  <div>
                    <strong>Company:</strong> {customer.company}
                  </div>
                </div>
              )}

              <div className="d-flex align-items-center gap-2">
                <Calendar size={20} className="text-muted" />
                <div>
                  <strong>Created:</strong> {formatDate(customer.createdAt)}
                </div>
              </div>

              <div className="d-flex align-items-center gap-2">
                <Calendar size={20} className="text-muted" />
                <div>
                  <strong>Last Updated:</strong> {formatDate(customer.updatedAt)}
                </div>
              </div>
            </div>
          </div>

          {customer.notes && (
            <div style={{ flex: 1 }}>
              <h4 className="d-flex align-items-center gap-2">
                <FileText size={20} />
                Notes
              </h4>
              <div className="card" style={{ backgroundColor: '#f8f9fa' }}>
                <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                  {customer.notes}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="d-flex gap-2 justify-content-between mt-4">
          <div className="d-flex gap-2">
            {hasRole('ROLE_MANAGER') && (
              <button
                className="btn btn-primary d-flex align-items-center gap-2"
                onClick={() => onEdit(customer)}
              >
                <Edit size={16} />
                Edit Customer
              </button>
            )}
            {hasRole('ROLE_ADMIN') && (
              <button
                className="btn btn-danger d-flex align-items-center gap-2"
                onClick={() => onDelete(customer.id)}
              >
                <Trash2 size={16} />
                Delete Customer
              </button>
            )}
          </div>
          <button
            className="btn btn-secondary"
            onClick={onClose}
          >
            Back to List
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
