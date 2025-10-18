import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import CustomerList from './components/CustomerList';
import PropertyDashboard from './components/PropertyDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import PropertyForm from './components/PropertyForm';
import PropertyDetails from './components/PropertyDetails';

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <div className="App">
        {isAuthenticated && <Navbar />}
        <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
            } 
          />
          <Route 
            path="/signup" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/customers" 
            element={
              <ProtectedRoute>
                <CustomerList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/properties" 
            element={
              <ProtectedRoute>
                <PropertyDashboard />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/properties/new"
            element={
              <ProtectedRoute>
                <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
                  <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 16px' }}>
                    <PropertyForm isModal={false} onClose={() => window.history.back()} />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/properties/:id"
            element={
              <ProtectedRoute>
                <PropertyDetails />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/" 
            element={
              <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
            } 
          />
          <Route 
            path="*" 
            element={
              <div className="container">
                <div className="card">
                  <div className="text-center">
                    <h2>404 - Page Not Found</h2>
                    <p>The page you're looking for doesn't exist.</p>
                    <a href="/dashboard" className="btn btn-primary">
                      Go to Dashboard
                    </a>
                  </div>
                </div>
              </div>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;
