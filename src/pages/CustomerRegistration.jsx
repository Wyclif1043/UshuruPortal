// src/pages/CustomerRegistration.jsx
import React, { useState } from 'react';
import { authService } from '../services/authService';
import { Link, useNavigate } from 'react-router-dom';

const CustomerRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    phoneNo: '',
    email: '',
    landBookingFee: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [customerNumber, setCustomerNumber] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const customerData = {
        ...formData,
        landBookingFee: parseFloat(formData.landBookingFee)
      };

      const response = await authService.createCustomer(customerData);
      
      if (response.success) {
        setCustomerNumber(response.customerNumber);
        setRegistrationSuccess(true);
        setMessage('Customer registered successfully!');
        
        // Clear form
        setFormData({
          name: '',
          address: '',
          city: '',
          phoneNo: '',
          email: '',
          landBookingFee: ''
        });
        
        // Auto-redirect to booking page after 2 seconds
        setTimeout(() => {
          navigate(`/customer-booking?customerNo=${response.customerNumber}`);
        }, 2000);
        
      } else {
        setMessage(response.error || 'Failed to register customer');
      }
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error registering customer');
    } finally {
      setLoading(false);
    }
  };

  // If registration is successful, show success message with auto-redirect
  if (registrationSuccess) {
    return (
      <div className="customer-success">
        <div className="success-card">
          <div className="success-icon">✅</div>
          <h2>Registration Successful!</h2>
          <p>Customer has been registered successfully.</p>
          <div className="customer-details">
            <div className="detail-item">
              <strong>Customer Number:</strong>
              <span>{customerNumber}</span>
            </div>
          </div>
          <div className="success-actions">
            <Link 
              to={`/customer-booking?customerNo=${customerNumber}`}
              className="primary-button"
            >
              Book Land Now
            </Link>
            <button 
              onClick={() => setRegistrationSuccess(false)}
              className="secondary-button"
            >
              Register Another Customer
            </button>
          </div>
          <div className="auto-redirect-message">
            <p>Redirecting to land booking page in 2 seconds...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-registration">
      <div className="page-container">
        <div className="page-header">
          <h1>Customer Registration</h1>
          <p>Register a new customer for land booking</p>
        </div>

        <div className="registration-form-container">
          <form onSubmit={handleSubmit} className="registration-form">
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter customer's full name"
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter email address"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phoneNo"
                  value={formData.phoneNo}
                  onChange={handleChange}
                  required
                  placeholder="Enter phone number"
                />
              </div>

              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="Enter city"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Enter full address"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Land Booking Fee (KSh) *</label>
              <input
                type="number"
                name="landBookingFee"
                value={formData.landBookingFee}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="Enter booking fee amount"
              />
            </div>

            {message && (
              <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}

            <button type="submit" disabled={loading} className="submit-button">
              {loading ? 'Registering...' : 'Register Customer'}
            </button>
          </form>
        </div>

        <div className="public-navigation">
          <p>
            Already a member? <Link to="/login">Login here</Link>
          </p>
          <p>
            Want to book land? <Link to="/customer-booking">Go to Land Booking</Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        .customer-registration {
          min-height: calc(100vh - 140px);
          padding: 2rem 1rem;
        }

        .page-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .page-header {
          background: linear-gradient(135deg, #7A1F23 0%, #5a1519 100%);
          color: white;
          padding: 2rem;
          text-align: center;
        }

        .page-header h1 {
          margin: 0 0 0.5rem 0;
          font-size: 2rem;
        }

        .page-header p {
          margin: 0;
          opacity: 0.9;
        }

        .registration-form-container {
          padding: 2rem;
        }

        .registration-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          font-weight: 500;
          margin-bottom: 0.5rem;
          color: #374151;
        }

        .form-group input,
        .form-group textarea {
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #7A1F23;
          box-shadow: 0 0 0 3px rgba(122, 31, 35, 0.1);
        }

        .message {
          padding: 1rem;
          border-radius: 0.375rem;
          font-weight: 500;
        }

        .message.success {
          background-color: #d1fae5;
          color: #065f46;
          border: 1px solid #a7f3d0;
        }

        .message.error {
          background-color: #fee2e2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        .submit-button {
          background-color: #7A1F23;
          color: white;
          padding: 1rem 2rem;
          border: none;
          border-radius: 0.375rem;
          font-size: 1.125rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .submit-button:hover:not(:disabled) {
          background-color: #5a1519;
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .public-navigation {
          padding: 1.5rem 2rem;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          background-color: #f9fafb;
        }

        .public-navigation p {
          margin: 0.5rem 0;
        }

        .public-navigation a {
          color: #7A1F23;
          text-decoration: none;
          font-weight: 500;
        }

        .public-navigation a:hover {
          text-decoration: underline;
        }

        /* Success Page Styles */
        .customer-success {
          min-height: calc(100vh - 140px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
        }

        .success-card {
          background: white;
          padding: 3rem;
          border-radius: 1rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          text-align: center;
          max-width: 500px;
          width: 100%;
        }

        .success-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
        }

        .success-card h2 {
          color: #065f46;
          margin-bottom: 1rem;
          font-size: 2rem;
        }

        .success-card p {
          color: #6b7280;
          margin-bottom: 2rem;
          font-size: 1.125rem;
        }

        .customer-details {
          background-color: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 0.5rem;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 1.125rem;
        }

        .detail-item strong {
          color: #374151;
        }

        .detail-item span {
          color: #7A1F23;
          font-weight: bold;
          font-size: 1.25rem;
        }

        .success-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .primary-button {
          background-color: #7A1F23;
          color: white;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.375rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: background-color 0.3s ease;
        }

        .primary-button:hover {
          background-color: #5a1519;
        }

        .secondary-button {
          background-color: #f3f4f6;
          color: #374151;
          padding: 0.75rem 1.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .secondary-button:hover {
          background-color: #e5e7eb;
        }

        .auto-redirect-message {
          margin-top: 1rem;
          padding: 0.75rem;
          background-color: #fef3c7;
          border: 1px solid #fcd34d;
          border-radius: 0.375rem;
          color: #92400e;
        }

        .auto-redirect-message p {
          margin: 0;
          font-size: 0.875rem;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .page-header {
            padding: 1.5rem 1rem;
          }
          
          .registration-form-container {
            padding: 1.5rem;
          }
          
          .success-card {
            padding: 2rem 1.5rem;
          }
          
          .success-actions {
            flex-direction: column;
          }
          
          .detail-item {
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default CustomerRegistration;