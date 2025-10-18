import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { customerService } from '../services/api';
import { CustomerRequest, CustomerResponse } from '../types';
import { X } from 'lucide-react';

type CustomerFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  notes?: string;
};

interface CustomerFormProps {
  customer?: CustomerResponse | null;
  onClose: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ customer, onClose }) => {
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerFormData>({
    defaultValues: customer ? {
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone || '',
      company: customer.company || '',
      notes: customer.notes || '',
    } : undefined,
  });

  const validateForm = (data: CustomerFormData): string | null => {
    if (!data.firstName.trim()) return 'First name is required';
    if (!data.lastName.trim()) return 'Last name is required';
    if (!data.email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return 'Invalid email format';
    return null;
  };

  const onSubmit = async (data: CustomerFormData) => {
    const validationError = validateForm(data);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const customerData: CustomerRequest = {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim(),
        phone: data.phone?.trim() || undefined,
        company: data.company?.trim() || undefined,
        notes: data.notes?.trim() || undefined,
      };

      if (customer) {
        await customerService.updateCustomer(customer.id, customerData);
      } else {
        await customerService.createCustomer(customerData);
      }
      
      // Refresh stats if available
      if ((window as any).refreshStats) {
        (window as any).refreshStats();
      }
      
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save customer');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>{customer ? 'Edit Customer' : 'Add New Customer'}</h2>
          <button
            className="btn btn-secondary"
            onClick={onClose}
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="d-flex gap-3">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">First Name *</label>
              <input
                type="text"
                className="form-input"
                {...register('firstName', { required: 'First name is required' })}
                placeholder="Enter first name"
              />
              {errors.firstName && (
                <div className="form-error">{errors.firstName.message}</div>
              )}
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Last Name *</label>
              <input
                type="text"
                className="form-input"
                {...register('lastName', { required: 'Last name is required' })}
                placeholder="Enter last name"
              />
              {errors.lastName && (
                <div className="form-error">{errors.lastName.message}</div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              type="email"
              className="form-input"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email format'
                }
              })}
              placeholder="Enter email address"
            />
            {errors.email && (
              <div className="form-error">{errors.email.message}</div>
            )}
          </div>

          <div className="d-flex gap-3">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Phone</label>
              <input
                type="tel"
                className="form-input"
                {...register('phone')}
                placeholder="Enter phone number"
              />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Company</label>
              <input
                type="text"
                className="form-input"
                {...register('company')}
                placeholder="Enter company name"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea
              className="form-input"
              rows={4}
              {...register('notes')}
              placeholder="Enter additional notes"
            />
          </div>

          <div className="d-flex gap-2 justify-content-between">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : (customer ? 'Update Customer' : 'Create Customer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;
