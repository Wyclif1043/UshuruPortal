// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const Dashboard = () => {
  const { memberNumber, profile } = useSelector((state) => state.auth);
  const [accountDetails, setAccountDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadAccountDetails = async () => {
      if (!memberNumber) return;
      
      setLoading(true);
      try {
        const response = await authService.getMemberAccountDetails(memberNumber);
        setAccountDetails(response);
      } catch (err) {
        setError('Failed to load account details');
        console.error('Error loading account details:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAccountDetails();
  }, [memberNumber]);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="dashboard-container">
      {/* Welcome Header */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {profile?.FullName?.split(' ')[0] || 'Member'}! 👋</h1>
          <p>Here's what's happening with your account today</p>
        </div>
        <div className="user-badge">
          <div className="user-avatar">
            {getInitials(accountDetails?.name || profile?.FullName)}
          </div>
          <div className="user-details">
            <div className="user-name">{accountDetails?.name || profile?.FullName || `Member ${memberNumber}`}</div>
            <div className="user-role">Society Member</div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="dashboard-content">
        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin"></i>
            </div>
            <p>Loading your dashboard...</p>
          </div>
        ) : (
          <div className="dashboard-grid">
            {/* Account Overview Card */}
            <div className="dashboard-card account-overview">
              <div className="card-header">
                <div className="card-icon">
                  <i className="fas fa-user-circle"></i>
                </div>
                <h3>Account Overview</h3>
              </div>
              <div className="card-body">
                <div className="info-grid">
                  <div className="info-item">
                    <div className="info-label">Member Number</div>
                    <div className="info-value">{accountDetails?.member_no || memberNumber}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Full Name</div>
                    <div className="info-value">{accountDetails?.name || profile?.FullName}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Email Address</div>
                    <div className="info-value">{accountDetails?.email || profile?.Email}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Account Status</div>
                    <div className="status-badge active">
                      <i className="fas fa-check-circle"></i>
                      {profile?.Status || 'Active'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="dashboard-card quick-actions-card">
              <div className="card-header">
                <div className="card-icon">
                  <i className="fas fa-bolt"></i>
                </div>
                <h3>Quick Actions</h3>
              </div>
              <div className="card-body">
                <div className="actions-grid">
                  <button 
                    className="action-btn primary"
                    onClick={() => navigate('/profile')}
                  >
                    <i className="fas fa-user"></i>
                    View Profile
                  </button>
                  <button 
                    className="action-btn secondary"
                    onClick={() => navigate('/investments')}
                  >
                    <i className="fas fa-home"></i>
                    Book Plot
                  </button>
                  <button 
                    className="action-btn secondary"
                    onClick={() => navigate('/payments')}
                  >
                    <i className="fas fa-credit-card"></i>
                    Make Payment
                  </button>
                  <button 
                    className="action-btn secondary"
                    onClick={() => navigate('/reports')}
                  >
                    <i className="fas fa-file-download"></i>
                    Download Statement
                  </button>
                </div>
              </div>
            </div>

            {/* Statistics Card */}
            <div className="dashboard-card statistics-card">
              <div className="card-header">
                <div className="card-icon">
                  <i className="fas fa-chart-bar"></i>
                </div>
                <h3>Membership Statistics</h3>
              </div>
              <div className="card-body">
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-icon">
                      <i className="fas fa-user-check"></i>
                    </div>
                    <div className="stat-content">
                      <div className="stat-number">1</div>
                      <div className="stat-label">Active Account</div>
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-icon">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div className="stat-content">
                      <div className="stat-number">0</div>
                      <div className="stat-label">Booked Plots</div>
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-icon">
                      <i className="fas fa-clock"></i>
                    </div>
                    <div className="stat-content">
                      <div className="stat-number">0</div>
                      <div className="stat-label">Pending Payments</div>
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-icon">
                      <i className="fas fa-percentage"></i>
                    </div>
                    <div className="stat-content">
                      <div className="stat-number">100%</div>
                      <div className="stat-label">Profile Complete</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity Card */}
            <div className="dashboard-card activity-card">
              <div className="card-header">
                <div className="card-icon">
                  <i className="fas fa-history"></i>
                </div>
                <h3>Recent Activity</h3>
              </div>
              <div className="card-body">
                <div className="activity-list">
                  <div className="activity-item">
                    <div className="activity-icon success">
                      <i className="fas fa-check"></i>
                    </div>
                    <div className="activity-content">
                      <div className="activity-title">Account Verified</div>
                      <div className="activity-time">Today at 09:30 AM</div>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon info">
                      <i className="fas fa-shield-alt"></i>
                    </div>
                    <div className="activity-content">
                      <div className="activity-title">OTP Authentication</div>
                      <div className="activity-time">Today at 09:25 AM</div>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon primary">
                      <i className="fas fa-door-open"></i>
                    </div>
                    <div className="activity-content">
                      <div className="activity-title">Portal Login</div>
                      <div className="activity-time">Today at 09:20 AM</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications Card */}
            <div className="dashboard-card notifications-card">
              <div className="card-header">
                <div className="card-icon">
                  <i className="fas fa-bell"></i>
                </div>
                <h3>Notifications</h3>
                <span className="notification-badge">3</span>
              </div>
              <div className="card-body">
                <div className="notifications-list">
                  <div className="notification-item">
                    <div className="notification-icon info">
                      <i className="fas fa-info-circle"></i>
                    </div>
                    <div className="notification-content">
                      <div className="notification-title">Complete Your Profile</div>
                      <div className="notification-message">Add missing information to access all features</div>
                    </div>
                  </div>
                  <div className="notification-item">
                    <div className="notification-icon warning">
                      <i className="fas fa-exclamation-triangle"></i>
                    </div>
                    <div className="notification-content">
                      <div className="notification-title">Investment Opportunities</div>
                      <div className="notification-message">New land plots available for booking</div>
                    </div>
                  </div>
                  <div className="notification-item">
                    <div className="notification-icon primary">
                      <i className="fas fa-file-alt"></i>
                    </div>
                    <div className="notification-content">
                      <div className="notification-title">Terms & Conditions</div>
                      <div className="notification-message">Please review updated society policies</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Card */}
            <div className="dashboard-card support-card">
              <div className="card-header">
                <div className="card-icon">
                  <i className="fas fa-headset"></i>
                </div>
                <h3>Need Help?</h3>
              </div>
              <div className="card-body">
                <div className="support-content">
                  <p>Our support team is here to help you with any questions or issues.</p>
                  <div className="contact-details">
                    <div className="contact-item">
                      <i className="fas fa-phone"></i>
                      <span>{profile?.Phone || '+254 700 000000'}</span>
                    </div>
                    <div className="contact-item">
                      <i className="fas fa-envelope"></i>
                      <span>support@ushuru.com</span>
                    </div>
                    <div className="contact-item">
                      <i className="fas fa-clock"></i>
                      <span>Mon - Fri: 8:00 AM - 5:00 PM</span>
                    </div>
                  </div>
                  <button className="support-btn">
                    <i className="fas fa-comment-dots"></i>
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .dashboard-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 2rem;
        }

        /* Dashboard Header */
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding: 0 0.5rem;
        }

        .welcome-section h1 {
          margin: 0 0 0.5rem 0;
          color: #2d3748;
          font-size: 2.25rem;
          font-weight: 700;
        }

        .welcome-section p {
          margin: 0;
          color: #718096;
          font-size: 1.125rem;
        }

        .user-badge {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: white;
          padding: 1rem 1.5rem;
          border-radius: 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
        }

        .user-avatar {
          width: 3.5rem;
          height: 3.5rem;
          border-radius: 50%;
          background: linear-gradient(135deg, #7A1F23 0%, #F5B800 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.25rem;
          font-weight: bold;
        }

        .user-details .user-name {
          font-weight: 600;
          color: #2d3748;
          font-size: 1.1rem;
          margin-bottom: 0.25rem;
        }

        .user-details .user-role {
          color: #718096;
          font-size: 0.875rem;
        }

        /* Dashboard Grid */
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        /* Base Card Styles */
        .dashboard-card {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .dashboard-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem 1.5rem 1rem;
          border-bottom: 1px solid #f1f5f9;
          position: relative;
        }

        .card-icon {
          width: 3rem;
          height: 3rem;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          color: white;
        }

        .card-header h3 {
          margin: 0;
          color: #2d3748;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .card-body {
          padding: 1.5rem;
        }

        /* Account Overview Card */
        .account-overview .card-icon {
          background: linear-gradient(135deg, #7A1F23 0%, #9B2C2C 100%);
        }

        .info-grid {
          display: grid;
          gap: 1rem;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .info-item:last-child {
          border-bottom: none;
        }

        .info-label {
          color: #718096;
          font-weight: 500;
          font-size: 0.875rem;
        }

        .info-value {
          color: #2d3748;
          font-weight: 600;
          text-align: right;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.375rem 0.75rem;
          border-radius: 2rem;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .status-badge.active {
          background: #dcfce7;
          color: #166534;
        }

        /* Quick Actions Card */
        .quick-actions-card .card-icon {
          background: linear-gradient(135deg, #F5B800 0%, #D97706 100%);
        }

        .actions-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .action-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 0.5rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .action-btn.primary {
          background: linear-gradient(135deg, #7A1F23 0%, #9B2C2C 100%);
          color: white;
          border: none;
        }

        .action-btn.secondary {
          color: #4a5568;
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .action-btn i {
          font-size: 1.25rem;
        }

        /* Statistics Card */
        .statistics-card .card-icon {
          background: linear-gradient(135deg, #10B981 0%, #059669 100%);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 0.75rem;
          border: 1px solid #e2e8f0;
        }

        .stat-icon {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          color: #7A1F23;
          font-size: 1rem;
        }

        .stat-number {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2d3748;
          line-height: 1;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #718096;
          margin-top: 0.25rem;
        }

        /* Activity Card */
        .activity-card .card-icon {
          background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem;
          border-radius: 0.75rem;
          background: #f8fafc;
        }

        .activity-icon {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
          color: white;
        }

        .activity-icon.success {
          background: #10B981;
        }

        .activity-icon.info {
          background: #3B82F6;
        }

        .activity-icon.primary {
          background: #7A1F23;
        }

        .activity-title {
          font-weight: 600;
          color: #2d3748;
          font-size: 0.875rem;
        }

        .activity-time {
          color: #718096;
          font-size: 0.75rem;
          margin-top: 0.25rem;
        }

        /* Notifications Card */
        .notifications-card .card-icon {
          background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
        }

        .notification-badge {
          background: #EF4444;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 600;
          position: absolute;
          top: 1rem;
          right: 1.5rem;
        }

        .notifications-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .notification-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 0.75rem;
          border-left: 4px solid #e2e8f0;
        }

        .notification-icon {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
          color: white;
          flex-shrink: 0;
        }

        .notification-icon.info {
          background: #3B82F6;
        }

        .notification-icon.warning {
          background: #F59E0B;
        }

        .notification-icon.primary {
          background: #7A1F23;
        }

        .notification-title {
          font-weight: 600;
          color: #2d3748;
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }

        .notification-message {
          color: #718096;
          font-size: 0.75rem;
          line-height: 1.4;
        }

        /* Support Card */
        .support-card .card-icon {
          background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
        }

        .support-content p {
          color: #718096;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .contact-details {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #4a5568;
          font-size: 0.875rem;
        }

        .contact-item i {
          color: #7A1F23;
          width: 1rem;
        }

        .support-btn {
          width: 100%;
          background: linear-gradient(135deg, #7A1F23 0%, #9B2C2C 100%);
          color: white;
          border: none;
          padding: 0.875rem 1.5rem;
          border-radius: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .support-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(122, 31, 35, 0.3);
        }

        /* Loading and Error States */
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          text-align: center;
        }

        .loading-spinner {
          font-size: 2rem;
          color: #7A1F23;
          margin-bottom: 1rem;
        }

        .loading-state p {
          color: #718096;
          margin: 0;
        }

        .error-message {
          background: #fef2f2;
          color: #dc2626;
          padding: 1rem 1.5rem;
          border-radius: 0.75rem;
          border: 1px solid #fecaca;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .dashboard-container {
            padding: 1rem;
          }

          .dashboard-header {
            flex-direction: column;
            gap: 1.5rem;
            align-items: flex-start;
          }

          .welcome-section h1 {
            font-size: 1.75rem;
          }

          .user-badge {
            width: 100%;
            justify-content: flex-start;
          }

          .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .actions-grid {
            grid-template-columns: 1fr;
          }

          .stats-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 480px) {
          .dashboard-header {
            margin-bottom: 1.5rem;
          }

          .welcome-section h1 {
            font-size: 1.5rem;
          }

          .card-body {
            padding: 1rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .stat-item {
            justify-content: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;