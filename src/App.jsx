// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ChangePin from './pages/auth/ChangePin';
import OTPVerification from './pages/auth/OTPVerification';
import Dashboard from './pages/Dashboard';
import Profile from './components/Profile';
import Investments from './pages/Investments';
import CustomerRegistration from './pages/CustomerRegistration';
import CustomerBooking from './pages/CustomerBooking';
import Sidebar from './components/layout/Sidebar';
import PublicLayout from './components/layout/PublicLayout';
import MembershipApplication from './pages/MembershipApplication';
import './styles/globals.css';

function App() {
  const { isAuthenticated, requiresOTP } = useSelector((state) => state.auth);

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  // OTP Route component
  const OTPRoute = ({ children }) => {
    return requiresOTP && !isAuthenticated ? children : <Navigate to="/login" />;
  };

  // Layout component with sidebar
  const LayoutWithSidebar = ({ children }) => {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <div className="main-content">
          {children}
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : 
            requiresOTP ? <Navigate to="/otp-verification" /> : 
            <Login />
          } 
        />
        
        <Route 
          path="/otp-verification" 
          element={
            <OTPRoute>
              <OTPVerification />
            </OTPRoute>
          } 
        />
        
        <Route 
          path="/register" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Register />
          } 
        />

        <Route 
          path="/change-pin" 
          element={
            <ChangePin />
          } 
        />

        {/* Customer Routes - All Public */}
        <Route 
          path="/customer-registration" 
          element={
            <PublicLayout>
              <CustomerRegistration />
            </PublicLayout>
          } 
        />

        <Route 
          path="/customer-booking" 
          element={
            <PublicLayout>
              <CustomerBooking />
            </PublicLayout>
          } 
        />

        {/* Protected Routes with Sidebar */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <LayoutWithSidebar>
                <Dashboard />
              </LayoutWithSidebar>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <LayoutWithSidebar>
                <Profile />
              </LayoutWithSidebar>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/investments" 
          element={
            <ProtectedRoute>
              <LayoutWithSidebar>
                <Investments />
              </LayoutWithSidebar>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/reports" 
          element={
            <ProtectedRoute>
              <LayoutWithSidebar>
                <div className="page-header">
                  <h1>Reports</h1>
                  <p>View your financial reports and statements</p>
                </div>
                <div className="page-content">
                  <p>Reports content coming soon...</p>
                </div>
              </LayoutWithSidebar>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/payments" 
          element={
            <ProtectedRoute>
              <LayoutWithSidebar>
                <div className="page-header">
                  <h1>Payments</h1>
                  <p>Manage your payments and transactions</p>
                </div>
                <div className="page-content">
                  <p>Payments content coming soon...</p>
                </div>
              </LayoutWithSidebar>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/membership-application" 
          element={<MembershipApplication />} 
        />

        {/* Default route */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        
        {/* 404 route */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </div>
  );
}

export default App;