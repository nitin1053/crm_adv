import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Users, User, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import StatsSection from './StatsSection';

const Navbar: React.FC = () => {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleDisplayName = (roles: string[]) => {
    if (roles.includes('ROLE_ADMIN')) return 'Admin';
    if (roles.includes('ROLE_MANAGER')) return 'Manager';
    if (roles.includes('ROLE_CUSTOMER')) return 'Customer';
    return 'User';
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/dashboard" className="navbar-brand">
            CRM System
          </Link>
          
          <div className="navbar-nav">
            {user && (
              <>
                <Link to="/dashboard">
                  <Users size={20} />
                  Dashboard
                </Link>
                
                <Link to="/customers">
                  <User size={20} />
                  Customers
                </Link>
                
                <Link to="/properties">
                  <Home size={20} />
                  Properties
                </Link>
                
                <div className="d-flex align-items-center gap-2">
                  <span>Welcome, {user.username}</span>
                  <span className="badge" style={{ 
                    backgroundColor: hasRole('ROLE_ADMIN') ? '#dc3545' : 
                                   hasRole('ROLE_MANAGER') ? '#ffc107' : '#28a745',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    {getRoleDisplayName(user.roles)}
                  </span>
                </div>
                
                <button
                  className="btn btn-secondary d-flex align-items-center gap-2"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
        
        {/* Stats Section */}
        <StatsSection />
      </div>
    </nav>
  );
};

export default Navbar;
