// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

// Payment Modal Component
const PaymentModal = ({ isOpen, onClose, memberNumber, memberName, onSubmit }) => {
  const [formData, setFormData] = useState({
    customer_no: '',
    amount: '',
    cheque_date: new Date().toISOString().split('T')[0],
    transaction_time: new Date().toTimeString().split(' ')[0].substring(0, 5),
    cheque_no: '',
    plot_code: '',
    transaction_type: '7' // Default to Commitment Deposit
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Transaction types based on Ushuru system
  const transactionTypes = [
    { value: '0', label: 'None' },
    { value: '1', label: 'Land Payment' },
    { value: '2', label: 'Share Capital' },
    { value: '3', label: 'Deposit Contribution' },
    { value: '6', label: 'Land Booking Fee' },
    { value: '7', label: 'Commitment Deposit' }
  ];

  useEffect(() => {
    if (memberNumber) {
      setFormData(prev => ({
        ...prev,
        customer_no: memberNumber,
        cheque_no: generateChequeNumber()
      }));
    }
  }, [memberNumber]);

  const generateChequeNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `REF-${year}${month}${day}-${random}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear messages when user starts typing
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate required fields
      if (!formData.customer_no) {
        throw new Error('Customer number is required');
      }
      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        throw new Error('Please enter a valid amount');
      }
      if (!formData.cheque_date) {
        throw new Error('Date is required');
      }
      if (!formData.transaction_time) {
        throw new Error('Transaction time is required');
      }

      // Prepare payment data
      const paymentData = {
        customer_no: formData.customer_no,
        amount: parseFloat(formData.amount).toFixed(2),
        cheque_date: formData.cheque_date,
        transaction_time: formData.transaction_time,
        cheque_no: formData.cheque_no || generateChequeNumber(),
        plot_code: formData.plot_code || '',
        transaction_type: formData.transaction_type
      };

      console.log('💰 Processing payment:', paymentData);

      // Call the API
      const response = await authService.processGeneralReceipt(paymentData);
      
      if (response.success) {
        setSuccess('Payment processed successfully!');
        setTimeout(() => {
          onSubmit && onSubmit(response.data);
          onClose();
        }, 2000);
      } else {
        throw new Error(response.message || 'Payment failed');
      }
    } catch (err) {
      console.error('❌ Payment error:', err);
      setError(err.message || 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="payment-modal-overlay" onClick={onClose}>
      <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="payment-modal-header">
          <h2>Make Payment</h2>
          <button className="close-button" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="payment-modal-content">
          {error && (
            <div className="payment-error">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          {success && (
            <div className="payment-success">
              <i className="fas fa-check-circle"></i>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="payment-form">
            {/* Customer Number (Read-only) */}
            <div className="payment-form-group">
              <label>Customer Number</label>
              <input
                type="text"
                name="customer_no"
                value={formData.customer_no}
                onChange={handleInputChange}
                readOnly
                className="readonly-input"
              />
            </div>

            {/* Transaction Type */}
            <div className="payment-form-group">
              <label>Transaction Type *</label>
              <select
                name="transaction_type"
                value={formData.transaction_type}
                onChange={handleInputChange}
                required
                className="payment-select"
              >
                {transactionTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div className="payment-form-group">
              <label>Amount (KSh) *</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="Enter amount"
                min="1"
                step="0.01"
                required
              />
            </div>

            {/* Date and Time Row */}
            <div className="payment-form-row">
              <div className="payment-form-group">
                <label>Date *</label>
                <input
                  type="date"
                  name="cheque_date"
                  value={formData.cheque_date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="payment-form-group">
                <label>Time *</label>
                <input
                  type="time"
                  name="transaction_time"
                  value={formData.transaction_time}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Reference Number */}
            <div className="payment-form-group">
              <label>Reference Number</label>
              <input
                type="text"
                name="cheque_no"
                value={formData.cheque_no}
                onChange={handleInputChange}
                placeholder="Auto-generated if empty"
              />
              <small className="input-hint">Leave empty for auto-generation</small>
            </div>

            {/* Plot Code (Optional) */}
            <div className="payment-form-group">
              <label>Plot Code (Optional)</label>
              <input
                type="text"
                name="plot_code"
                value={formData.plot_code}
                onChange={handleInputChange}
                placeholder="Enter plot code if applicable"
              />
              <small className="input-hint">Required for Land Payment type</small>
            </div>

            {/* Payment Instructions */}
            <div className="payment-instructions">
              <i className="fas fa-info-circle"></i>
              <div>
                <strong>Payment Instructions:</strong>
                <ul>
                  <li>Ensure all required fields are filled correctly</li>
                  <li>The reference number will be generated automatically if not provided</li>
                  <li>Plot code is required for Land Payment transactions</li>
                </ul>
              </div>
            </div>

            {/* Form Actions */}
            <div className="payment-form-actions">
              <button
                type="button"
                className="payment-cancel-btn"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="payment-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-credit-card"></i>
                    Process Payment
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .payment-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          padding: 1rem;
          animation: fadeIn 0.3s ease;
        }

        .payment-modal {
          background: white;
          border-radius: 1.5rem;
          width: 100%;
          max-width: 550px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          animation: slideUp 0.4s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .payment-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          border-bottom: 2px solid #f3f4f6;
          position: sticky;
          top: 0;
          background: white;
          z-index: 10;
          border-radius: 1.5rem 1.5rem 0 0;
        }

        .payment-modal-header h2 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
        }

        .close-button {
          background: #f3f4f6;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
        }

        .close-button:hover {
          background: #7A1F23;
          color: white;
          transform: rotate(90deg);
        }

        .payment-modal-content {
          padding: 2rem;
        }

        .payment-error {
          background: #fef2f2;
          color: #dc2626;
          padding: 1rem;
          border-radius: 0.75rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border: 1px solid #fecaca;
          font-size: 0.875rem;
        }

        .payment-success {
          background: #dcfce7;
          color: #166534;
          padding: 1rem;
          border-radius: 0.75rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border: 1px solid #bbf7d0;
          font-size: 0.875rem;
        }

        .payment-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .payment-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .payment-form-group {
          display: flex;
          flex-direction: column;
        }

        .payment-form-group label {
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .payment-form-group input,
        .payment-form-group select {
          padding: 0.875rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.75rem;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
          width: 100%;
        }

        .payment-form-group input:focus,
        .payment-form-group select:focus {
          border-color: #7A1F23;
          box-shadow: 0 0 0 3px rgba(122, 31, 35, 0.1);
          outline: none;
        }

        .payment-form-group input.readonly-input {
          background: #f9fafb;
          color: #6b7280;
          cursor: not-allowed;
          border-color: #d1d5db;
        }

        .payment-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
          background-position: right 1rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
          padding-right: 2.5rem;
        }

        .input-hint {
          color: #6b7280;
          font-size: 0.75rem;
          margin-top: 0.25rem;
        }

        .payment-instructions {
          background: #eff6ff;
          border-radius: 0.75rem;
          padding: 1rem;
          display: flex;
          gap: 1rem;
          align-items: flex-start;
          font-size: 0.875rem;
          color: #1e40af;
          border: 1px solid #bfdbfe;
          margin: 0.5rem 0;
        }

        .payment-instructions i {
          font-size: 1.25rem;
          color: #3b82f6;
          flex-shrink: 0;
        }

        .payment-instructions ul {
          margin: 0.5rem 0 0 1.25rem;
          padding: 0;
        }

        .payment-instructions li {
          color: #4b5563;
          margin-bottom: 0.25rem;
        }

        .payment-form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .payment-cancel-btn {
          flex: 1;
          background: #6b7280;
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

        .payment-cancel-btn:hover:not(:disabled) {
          background: #4b5563;
          transform: translateY(-1px);
        }

        .payment-submit-btn {
          flex: 2;
          background: linear-gradient(135deg, #7A1F23, #5a1519);
          color: white;
          border: none;
          padding: 0.875rem 1.5rem;
          border-radius: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          font-size: 1rem;
        }

        .payment-submit-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #5a1519, #7A1F23);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(122, 31, 35, 0.3);
        }

        .payment-cancel-btn:disabled,
        .payment-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        @media (max-width: 768px) {
          .payment-modal-header {
            padding: 1rem 1.5rem;
          }

          .payment-modal-header h2 {
            font-size: 1.25rem;
          }

          .payment-modal-content {
            padding: 1.5rem;
          }

          .payment-form-row {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }

          .payment-form-actions {
            flex-direction: column;
          }

          .payment-instructions {
            flex-direction: column;
            gap: 0.5rem;
          }
        }

        @media (max-width: 480px) {
          .payment-modal-content {
            padding: 1rem;
          }

          .payment-form-group input,
          .payment-form-group select {
            padding: 0.75rem 0.875rem;
          }
        }
      `}</style>
    </div>
  );
};

const Dashboard = () => {
  const { memberNumber, profile } = useSelector((state) => state.auth);
  const [accountStatistics, setAccountStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadAccountStatistics = async () => {
      if (!memberNumber) return;
      
      setLoading(true);
      try {
        const response = await authService.getMemberAccountStatistics(memberNumber);
        
        if (response.status === "success" && response.data) {
          setAccountStatistics(response.data);
        } else {
          setError(response.message || 'Failed to load account statistics');
        }
      } catch (err) {
        setError('Failed to load account statistics');
        console.error('Error loading account statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAccountStatistics();
  }, [memberNumber]);

  const handlePaymentSuccess = (paymentData) => {
    // Add to payment history
    setPaymentHistory(prev => [paymentData, ...prev].slice(0, 10));
    setShowPaymentHistory(true);
    
    // Refresh account statistics
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatCurrency = (value) => {
    if (!value) return '0';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Statistics data with icons and colors
  const statisticsData = [
    {
      id: 1,
      name: "Total Deposits",
      value: accountStatistics?.MemberDeposits || "0",
      icon: "fas fa-piggy-bank",
      color: "#10B981",
      bgColor: "#D1FAE5"
    },
    {
      id: 2,
      name: "Share Capital",
      value: accountStatistics?.ShareCapital || "0",
      icon: "fas fa-chart-line",
      color: "#3B82F6",
      bgColor: "#DBEAFE"
    },
    {
      id: 3,
      name: "Plot Balance",
      value: accountStatistics?.OutstandingPlotsBalance || "0",
      icon: "fas fa-home",
      color: "#8B5CF6",
      bgColor: "#EDE9FE"
    }
  ];

  return (
    <div className="dashboard-container">
      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        memberNumber={memberNumber}
        memberName={profile?.FullName}
        onSubmit={handlePaymentSuccess}
      />

      {/* Welcome Header */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {profile?.FullName?.split(' ')[0] || 'Member'}! 👋</h1>
          <p>Here's what's happening with your account today</p>
        </div>
        <div className="user-badge">
          <div className="user-avatar">
            {getInitials(profile?.FullName)}
          </div>
          <div className="user-details">
            <div className="user-name">{profile?.FullName || `Member ${memberNumber}`}</div>
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
            {/* Statistics Cards */}
            <div className="dashboard-card statistics-section">
              <div className="card-header">
                <div className="card-icon">
                  <i className="fas fa-chart-bar"></i>
                </div>
                <h3>Financial Overview</h3>
              </div>
              <div className="card-body">
                <div className="financial-stats-grid">
                  {statisticsData.map((stat) => (
                    <div key={stat.id} className="financial-stat-card">
                      <div className="financial-stat-icon" style={{ backgroundColor: stat.bgColor }}>
                        <i className={stat.icon} style={{ color: stat.color }}></i>
                      </div>
                      <div className="financial-stat-content">
                        <div className="financial-stat-name">{stat.name}</div>
                        <div className="financial-stat-value">KSh {formatCurrency(stat.value)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

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
                    <div className="info-value">{accountStatistics?.MemberNumber || memberNumber}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Full Name</div>
                    <div className="info-value">{profile?.FullName || 'N/A'}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Payroll No</div>
                    <div className="info-value">{accountStatistics?.PayrollNo || accountStatistics?.['Payroll No'] || 'N/A'}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Account Status</div>
                    <div className="status-badge active">
                      <i className="fas fa-check-circle"></i>
                      Active
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Card - UPDATED with Payment button */}
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
                    className="action-btn payment-btn"
                    onClick={() => setShowPaymentModal(true)}
                  >
                    <i className="fas fa-credit-card"></i>
                    Make Payment
                  </button>
                  <button 
                    className="action-btn secondary"
                    onClick={() => setShowPaymentHistory(!showPaymentHistory)}
                  >
                    <i className="fas fa-history"></i>
                    {showPaymentHistory ? 'Hide History' : 'Payment History'}
                  </button>
                </div>
              </div>
            </div>

            {/* Payment History Card - Conditional */}
            {showPaymentHistory && paymentHistory.length > 0 && (
              <div className="dashboard-card payment-history-card">
                <div className="card-header">
                  <div className="card-icon">
                    <i className="fas fa-credit-card"></i>
                  </div>
                  <h3>Recent Payments</h3>
                </div>
                <div className="card-body">
                  <div className="payment-history-list">
                    {paymentHistory.map((payment, index) => (
                      <div key={index} className="payment-history-item">
                        <div className="payment-history-icon">
                          <i className="fas fa-check-circle"></i>
                        </div>
                        <div className="payment-history-content">
                          <div className="payment-history-amount">
                            KSh {formatCurrency(payment.amount)}
                          </div>
                          <div className="payment-history-details">
                            Ref: {payment.cheque_no} | Type: {
                              payment.transaction_type === '1' ? 'Land Payment' :
                              payment.transaction_type === '2' ? 'Share Capital' :
                              payment.transaction_type === '3' ? 'Deposit' :
                              payment.transaction_type === '6' ? 'Booking Fee' :
                              payment.transaction_type === '7' ? 'Commitment' : 'Other'
                            }
                          </div>
                          <div className="payment-history-date">
                            {payment.cheque_date} at {payment.transaction_time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

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

        /* Financial Statistics Section */
        .statistics-section {
          grid-column: 1 / -1;
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border: 1px solid #e2e8f0;
        }

        .statistics-section .card-header {
          padding-bottom: 1rem;
          border-bottom: 2px solid #f1f5f9;
        }

        .statistics-section .card-icon {
          background: linear-gradient(135deg, #7A1F23 0%, #9B2C2C 100%);
        }

        .financial-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-top: 0.5rem;
        }

        .financial-stat-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem;
          background: white;
          border-radius: 1rem;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .financial-stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .financial-stat-icon {
          width: 3.5rem;
          height: 3.5rem;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .financial-stat-content {
          flex: 1;
        }

        .financial-stat-name {
          color: #718096;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .financial-stat-value {
          color: #2d3748;
          font-size: 1.5rem;
          font-weight: 700;
          line-height: 1.2;
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

        .action-btn.payment-btn {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
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

        /* Payment History Card */
        .payment-history-card {
          grid-column: 1 / -1;
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
        }

        .payment-history-card .card-icon {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
        }

        .payment-history-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .payment-history-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 0.75rem;
          border-left: 4px solid #059669;
        }

        .payment-history-icon {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          background: #dcfce7;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #059669;
          font-size: 1.25rem;
        }

        .payment-history-content {
          flex: 1;
        }

        .payment-history-amount {
          font-weight: 700;
          color: #059669;
          font-size: 1.1rem;
          margin-bottom: 0.25rem;
        }

        .payment-history-details {
          color: #4b5563;
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }

        .payment-history-date {
          color: #9ca3af;
          font-size: 0.75rem;
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
          
          .financial-stats-grid {
            grid-template-columns: repeat(2, 1fr);
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

          .financial-stats-grid {
            grid-template-columns: 1fr;
          }

          .actions-grid {
            grid-template-columns: 1fr;
          }

          .financial-stat-card {
            padding: 1rem;
          }

          .financial-stat-icon {
            width: 3rem;
            height: 3rem;
            font-size: 1.25rem;
          }

          .financial-stat-value {
            font-size: 1.25rem;
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

          .financial-stat-card {
            flex-direction: column;
            text-align: center;
            gap: 0.75rem;
          }

          .financial-stat-icon {
            width: 3.5rem;
            height: 3.5rem;
          }

          .financial-stat-value {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;