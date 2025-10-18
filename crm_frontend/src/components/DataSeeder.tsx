import React, { useState } from 'react';
import { customerService } from '../services/api';
import { CustomerRequest } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Database, Plus } from 'lucide-react';

const DataSeeder: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>('');
  const { hasRole } = useAuth();

  const sampleCustomers: CustomerRequest[] = [
    {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@techcorp.com',
      phone: '+1-555-0101',
      company: 'TechCorp Inc.',
      notes: 'Interested in enterprise solutions. High priority lead.'
    },
    {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@innovate.com',
      phone: '+1-555-0102',
      company: 'Innovate Solutions',
      notes: 'Looking for custom software development services.'
    },
    {
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'michael.brown@globaltech.com',
      phone: '+1-555-0103',
      company: 'GlobalTech Systems',
      notes: 'Enterprise client with multiple project requirements.'
    },
    {
      firstName: 'Emily',
      lastName: 'Davis',
      email: 'emily.davis@startup.io',
      phone: '+1-555-0104',
      company: 'Startup Innovations',
      notes: 'Early-stage startup, budget-conscious but high potential.'
    },
    {
      firstName: 'David',
      lastName: 'Wilson',
      email: 'david.wilson@megacorp.com',
      phone: '+1-555-0105',
      company: 'MegaCorp Industries',
      notes: 'Large enterprise client, long-term partnership potential.'
    },
    {
      firstName: 'Lisa',
      lastName: 'Anderson',
      email: 'lisa.anderson@digital.com',
      phone: '+1-555-0106',
      company: 'Digital Dynamics',
      notes: 'Digital transformation specialist, needs comprehensive solution.'
    },
    {
      firstName: 'Robert',
      lastName: 'Taylor',
      email: 'robert.taylor@cloudtech.com',
      phone: '+1-555-0107',
      company: 'CloudTech Solutions',
      notes: 'Cloud infrastructure expert, interested in scalable solutions.'
    },
    {
      firstName: 'Jennifer',
      lastName: 'Martinez',
      email: 'jennifer.martinez@ai-systems.com',
      phone: '+1-555-0108',
      company: 'AI Systems Ltd.',
      notes: 'AI and machine learning focus, cutting-edge technology needs.'
    },
    {
      firstName: 'Christopher',
      lastName: 'Garcia',
      email: 'chris.garcia@fintech.com',
      phone: '+1-555-0109',
      company: 'FinTech Innovations',
      notes: 'Financial technology sector, security and compliance critical.'
    },
    {
      firstName: 'Amanda',
      lastName: 'Rodriguez',
      email: 'amanda.rodriguez@healthtech.com',
      phone: '+1-555-0110',
      company: 'HealthTech Solutions',
      notes: 'Healthcare technology, HIPAA compliance required.'
    },
    {
      firstName: 'James',
      lastName: 'Lee',
      email: 'james.lee@retailtech.com',
      phone: '+1-555-0111',
      company: 'RetailTech Systems',
      notes: 'E-commerce and retail solutions, high-volume transaction needs.'
    },
    {
      firstName: 'Maria',
      lastName: 'Gonzalez',
      email: 'maria.gonzalez@edtech.com',
      phone: '+1-555-0112',
      company: 'EduTech Platforms',
      notes: 'Educational technology, learning management systems.'
    }
  ];

  const seedData = async () => {
    if (!hasRole('ROLE_MANAGER')) {
      setMessage('Only managers and admins can seed data.');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      let successCount = 0;
      let errorCount = 0;

      for (const customer of sampleCustomers) {
        try {
          await customerService.createCustomer(customer);
          successCount++;
        } catch (error) {
          errorCount++;
          console.error('Failed to create customer:', customer.email, error);
        }
      }

      setMessage(`Successfully created ${successCount} customers. ${errorCount > 0 ? `${errorCount} failed.` : ''}`);
      
      // Refresh stats if available
      if ((window as any).refreshStats) {
        (window as any).refreshStats();
      }
    } catch (error) {
      setMessage('Failed to seed data. Please try again.');
      console.error('Seeding error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasRole('ROLE_MANAGER')) {
    return null;
  }

  return (
    <div className="card">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="d-flex align-items-center gap-2">
          <Database size={20} />
          Sample Data
        </h3>
        <button
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={seedData}
          disabled={isLoading}
        >
          <Plus size={16} />
          {isLoading ? 'Adding...' : 'Add Sample Customers'}
        </button>
      </div>
      
      <p className="text-muted mb-3">
        Add {sampleCustomers.length} sample customers to see the statistics in action. 
        This will help demonstrate the CRM functionality with realistic data.
      </p>
      
      {message && (
        <div className={`alert ${message.includes('Successfully') ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}
      
      <div className="d-flex flex-wrap gap-2">
        {sampleCustomers.slice(0, 6).map((customer, index) => (
          <div key={index} className="badge" style={{ backgroundColor: '#e9ecef', color: '#495057' }}>
            {customer.firstName} {customer.lastName} - {customer.company}
          </div>
        ))}
        {sampleCustomers.length > 6 && (
          <div className="badge" style={{ backgroundColor: '#e9ecef', color: '#495057' }}>
            +{sampleCustomers.length - 6} more...
          </div>
        )}
      </div>
    </div>
  );
};

export default DataSeeder;
