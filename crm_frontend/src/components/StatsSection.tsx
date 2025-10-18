import React, { useState, useEffect, useCallback } from 'react';
import { customerService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Users, TrendingUp, Calendar, Activity } from 'lucide-react';

interface StatsData {
  totalCustomers: number;
  newCustomersThisMonth: number;
  totalCompanies: number;
  averageCustomersPerDay: number;
}

const StatsSection: React.FC = () => {
  const [stats, setStats] = useState<StatsData>({
    totalCustomers: 0,
    newCustomersThisMonth: 0,
    totalCompanies: 0,
    averageCustomersPerDay: 0,
  });
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      const customers = await customerService.getAllCustomers();
      
      // Calculate statistics
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const newCustomersThisMonth = customers.filter(customer => 
        new Date(customer.createdAt) >= startOfMonth
      ).length;
      
      const uniqueCompanies = new Set(
        customers
          .filter(customer => customer.company && customer.company.trim() !== '')
          .map(customer => customer.company)
      ).size;
      
      // Calculate average customers per day (last 30 days)
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const recentCustomers = customers.filter(customer => 
        new Date(customer.createdAt) >= thirtyDaysAgo
      );
      const averageCustomersPerDay = recentCustomers.length / 30;
      
      setStats({
        totalCustomers: customers.length,
        newCustomersThisMonth,
        totalCompanies: uniqueCompanies,
        averageCustomersPerDay: Math.round(averageCustomersPerDay * 10) / 10,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadStats();
    }
  }, [isAuthenticated, loadStats]);

  // Expose refresh function globally for other components
  useEffect(() => {
    (window as any).refreshStats = loadStats;
    return () => {
      delete (window as any).refreshStats;
    };
  }, [loadStats]);

  if (!isAuthenticated || loading) {
    return null;
  }

  return (
    <div className="stats-section">
      <div className="stats-container">
        <div className="stat-item">
          <div className="stat-icon">
            <Users size={16} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalCustomers}</div>
            <div className="stat-label">Total Customers</div>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon">
            <Calendar size={16} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.newCustomersThisMonth}</div>
            <div className="stat-label">This Month</div>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon">
            <Activity size={16} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalCompanies}</div>
            <div className="stat-label">Companies</div>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon">
            <TrendingUp size={16} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.averageCustomersPerDay}</div>
            <div className="stat-label">Avg/Day (30d)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;