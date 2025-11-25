import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/globals.css';

const Register = () => {
  const [formData, setFormData] = useState({
    id_no: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/register-member/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Registration successful! A temporary PIN has been sent to your registered phone number.');
        
        // Store temporary password and redirect to change PIN page
        localStorage.setItem('tempIdNo', formData.id_no);
        localStorage.setItem('tempPassword', data.temporary_password);
        
        setTimeout(() => {
          navigate('/change-pin');
        }, 2000);
      } else {
        setError(data.error || data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left Section - Branding */}
      <div 
        className="brand-section"
        style={{
          background: 'linear-gradient(to bottom right, #7A1F23, #5a1519)'
        }}
      >
        {/* Faded Logo Background for larger screens */}
        <div 
          className="logo-background"
          style={{
            backgroundImage: 'url(/images/ushuru-logo.png)',
          }}
        ></div>
        
        {/* Content */}
        <div className="brand-content">
          {/* Logo and Company Name */}
          <div className="company-branding">
            {/* Logo Image */}
            <div className="logo-container">
              <img 
                src="/images/ushuru-logo.png" 
                alt="Ushuru Investment Co-operative Society" 
                className="logo-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  // Show fallback if image fails to load
                  const fallback = e.target.nextSibling;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              {/* Fallback Logo */}
              <div 
                className="logo-fallback"
                style={{ backgroundColor: '#F5B800' }}
              >
                <span className="logo-text">UI</span>
              </div>
            </div>
            
            {/* Company Name */}
            <div className="company-text">
              <div className="company-name">
                USHURU <span style={{ color: '#F5B800' }}>INVESTMENT</span>
              </div>
              <div className="company-subtitle" style={{ color: '#F5B800' }}>
                Co-operative Society
              </div>
              <div className="company-slogan" style={{ color: '#F5B800' }}>
                Uwekezaji Imara
              </div>
            </div>
          </div>

          <p className="brand-tagline">
            Join our investment community and start your journey to financial growth
          </p>

          {/* Benefits - Hidden on mobile, visible on tablet and desktop */}
          <div className="benefits-section">
            <div className="benefit-item">
              <div 
                className="benefit-icon"
                style={{ backgroundColor: '#F5B800', color: '#7A1F23' }}
              >
                <i className="fas fa-chart-line"></i>
              </div>
              <span className="benefit-text">Access to lucrative investment opportunities</span>
            </div>
            
            <div className="benefit-item">
              <div 
                className="benefit-icon"
                style={{ backgroundColor: '#F5B800', color: '#7A1F23' }}
              >
                <i className="fas fa-shield-alt"></i>
              </div>
              <span className="benefit-text">Secure and regulated investments</span>
            </div>
            
            <div className="benefit-item">
              <div 
                className="benefit-icon"
                style={{ backgroundColor: '#F5B800', color: '#7A1F23' }}
              >
                <i className="fas fa-users"></i>
              </div>
              <span className="benefit-text">Join a community of like-minded investors</span>
            </div>
            
            <div className="benefit-item">
              <div 
                className="benefit-icon"
                style={{ backgroundColor: '#F5B800', color: '#7A1F23' }}
              >
                <i className="fas fa-hand-holding-usd"></i>
              </div>
              <span className="benefit-text">Regular dividends and investment returns</span>
            </div>
          </div>

          {/* Mobile-only simplified benefits */}
          <div className="mobile-benefits">
            <div className="mobile-benefit-grid">
              <div className="mobile-benefit">
                <div 
                  className="mobile-benefit-icon"
                  style={{ backgroundColor: '#F5B800', color: '#7A1F23' }}
                >
                  <i className="fas fa-chart-line"></i>
                </div>
                <span className="mobile-benefit-label">Investments</span>
              </div>
              <div className="mobile-benefit">
                <div 
                  className="mobile-benefit-icon"
                  style={{ backgroundColor: '#F5B800', color: '#7A1F23' }}
                >
                  <i className="fas fa-shield-alt"></i>
                </div>
                <span className="mobile-benefit-label">Security</span>
              </div>
              <div className="mobile-benefit">
                <div 
                  className="mobile-benefit-icon"
                  style={{ backgroundColor: '#F5B800', color: '#7A1F23' }}
                >
                  <i className="fas fa-users"></i>
                </div>
                <span className="mobile-benefit-label">Community</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Registration Form */}
      <div className="form-section">
        <div className="form-container">
          {/* Mobile Header */}
          <div className="mobile-header">
            <h2 className="form-title-mobile">Join Our Society</h2>
            <p className="form-subtitle-mobile">Register for member portal access</p>
          </div>

          {/* Desktop Header */}
          <div className="desktop-header">
            <h2 className="form-title">Join Our Society</h2>
            <p className="form-subtitle">Register for member portal access</p>
          </div>

          <form onSubmit={handleSubmit} className="registration-form">
            <div className="form-group">
              <label htmlFor="id_no" className="form-label">
                National ID Number *
              </label>
              <input
                id="id_no"
                name="id_no"
                type="text"
                required
                placeholder="Enter your national ID number"
                value={formData.id_no}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {error && (
              <div className="error-message">
                <i className="fas fa-exclamation-circle"></i>
                {error}
              </div>
            )}

            {success && (
              <div className="success-message">
                <i className="fas fa-check-circle"></i>
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="submit-button"
            >
              {isLoading ? (
                <span className="button-content">
                  <i className="fas fa-spinner fa-spin"></i>
                  Registering...
                </span>
              ) : (
                <span className="button-content">
                  <i className="fas fa-user-plus"></i>
                  Register Now
                </span>
              )}
            </button>

            <div className="form-footer">
              <p className="footer-text">
                Already have an account?{' '}
                <Link to="/login" className="footer-link">
                  Sign in here
                </Link>
              </p>
            </div>

            {/* Information Box */}
            {/* <div className="info-box">
              <div className="info-content">
                <i className="fas fa-info-circle info-icon"></i>
                <div>
                  <p className="info-title">What happens next?</p>
                  <ul className="info-list">
                    <li>• You'll receive a 4-digit temporary PIN via SMS</li>
                    <li>• You'll be redirected to set your permanent PIN</li>
                    <li>• Then you can login to access all member features</li>
                  </ul>
                </div>
              </div>
            </div> */}
          </form>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        @media (min-width: 1024px) {
          .login-container {
            flex-direction: row;
          }
        }

        /* Brand Section */
        .brand-section {
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          color: white;
          padding: 2rem 1rem;
          position: relative;
          overflow: hidden;
          min-height: 40vh;
        }

        @media (min-width: 1024px) {
          .brand-section {
            width: 50%;
            min-height: 100vh;
            padding: 2rem;
          }
        }

        .logo-background {
          position: absolute;
          inset: 0;
          opacity: 0.05;
          background-size: 50%;
          background-position: center;
          background-repeat: no-repeat;
          filter: grayscale(100%) brightness(200%);
          display: none;
        }

        @media (min-width: 1024px) {
          .logo-background {
            display: block;
          }
        }

        .brand-content {
          max-width: 28rem;
          width: 100%;
          position: relative;
          z-index: 10;
        }

        .company-branding {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        @media (min-width: 768px) {
          .company-branding {
            margin-bottom: 2rem;
          }
        }

        .logo-container {
          width: 5rem;
          height: 5rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          background-color: #F5B800;
        }

        @media (min-width: 768px) {
          .logo-container {
            width: 6rem;
            height: 6rem;
          }
        }

        @media (min-width: 1024px) {
          .logo-container {
            width: 8rem;
            height: 8rem;
          }
        }

        .logo-image {
          width: 80%;
          height: 80%;
          object-fit: contain;
        }

        .logo-fallback {
          width: 100%;
          height: 100%;
          border-radius: 0.5rem;
          display: none;
          align-items: center;
          justify-content: center;
        }

        .logo-text {
          color: #7A1F23;
          font-weight: bold;
          font-size: 1.5rem;
        }

        @media (min-width: 768px) {
          .logo-text {
            font-size: 2rem;
          }
        }

        .company-text {
          text-align: center;
        }

        .company-name {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 0.25rem;
        }

        @media (min-width: 768px) {
          .company-name {
            font-size: 2rem;
          }
        }

        @media (min-width: 1024px) {
          .company-name {
            font-size: 2.5rem;
          }
        }

        .company-subtitle {
          font-size: 1.125rem;
          margin-bottom: 0.5rem;
        }

        @media (min-width: 768px) {
          .company-subtitle {
            font-size: 1.25rem;
          }
        }

        .company-slogan {
          font-size: 0.875rem;
          font-style: italic;
        }

        @media (min-width: 768px) {
          .company-slogan {
            font-size: 1rem;
          }
        }

        .brand-tagline {
          font-size: 1rem;
          margin-bottom: 2rem;
          text-align: center;
        }

        @media (min-width: 768px) {
          .brand-tagline {
            font-size: 1.125rem;
            margin-bottom: 3rem;
          }
        }

        .benefits-section {
          display: none;
          flex-direction: column;
          gap: 1.5rem;
        }

        @media (min-width: 768px) {
          .benefits-section {
            display: flex;
          }
        }

        .benefit-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          text-align: left;
        }

        .benefit-icon {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .benefit-text {
          font-size: 0.875rem;
        }

        @media (min-width: 1024px) {
          .benefit-text {
            font-size: 1rem;
          }
        }

        .mobile-benefits {
          display: block;
          margin-top: 1rem;
        }

        @media (min-width: 768px) {
          .mobile-benefits {
            display: none;
          }
        }

        .mobile-benefit-grid {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
        }

        .mobile-benefit {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .mobile-benefit-icon {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
        }

        .mobile-benefit-label {
          font-size: 0.75rem;
        }

        /* Form Section */
        .form-section {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f9fafb;
          padding: 1.5rem 1rem;
        }

        @media (min-width: 1024px) {
          .form-section {
            width: 50%;
            padding: 2rem;
          }
        }

        .form-container {
          width: 100%;
          max-width: 28rem;
        }

        .mobile-header {
          display: block;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        @media (min-width: 1024px) {
          .mobile-header {
            display: none;
          }
        }

        .form-title-mobile {
          font-size: 1.75rem;
          font-weight: bold;
          color: #7A1F23;
          margin-bottom: 0.5rem;
        }

        .form-subtitle-mobile {
          color: #666;
          font-size: 0.875rem;
        }

        .desktop-header {
          display: none;
          text-align: center;
          margin-bottom: 0.5rem;
        }

        @media (min-width: 1024px) {
          .desktop-header {
            display: block;
          }
        }

        .form-title {
          font-size: 2rem;
          font-weight: bold;
          color: #7A1F23;
          margin-bottom: 0.5rem;
        }

        .form-subtitle {
          color: #666;
        }

        .registration-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 1rem;
          transition: all 0.3s ease;
          background-color: white;
        }

        .form-input:focus {
          border-color: #7A1F23;
          box-shadow: 0 0 0 3px rgba(122, 31, 35, 0.1);
          outline: none;
        }

        .error-message {
          border-radius: 0.5rem;
          padding: 1rem;
          border: 1px solid #fecaca;
          background-color: #fef2f2;
          color: #b91c1c;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .success-message {
          border-radius: 0.5rem;
          padding: 1rem;
          border: 1px solid #bbf7d0;
          background-color: #f0fdf4;
          color: #166534;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .submit-button {
          background-color: #7A1F23;
          color: white;
          padding: 0.75rem;
          border-radius: 0.5rem;
          font-weight: 600;
          border: none;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          min-height: 3rem;
        }

        .submit-button:hover:not(:disabled) {
          background-color: #5a1519;
        }

        .submit-button:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .button-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .form-footer {
          text-align: center;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
        }

        .footer-text {
          font-size: 0.875rem;
          color: #666;
        }

        .footer-link {
          font-weight: 500;
          color: #7A1F23;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .footer-link:hover {
          color: #5a1519;
          text-decoration: underline;
        }

        .info-box {
          background-color: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 0.5rem;
          padding: 1rem;
        }

        .info-content {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .info-icon {
          color: #3b82f6;
          margin-top: 0.125rem;
          flex-shrink: 0;
        }

        .info-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1e40af;
          margin-bottom: 0.5rem;
        }

        .info-list {
          font-size: 0.75rem;
          color: #374151;
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .info-list li {
          margin-bottom: 0.25rem;
        }
      `}</style>
    </div>
  );
};

export default Register;