// src/pages/auth/Login.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import { authService } from '../../services/authService';
import '../../styles/globals.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  
  const [isMobile, setIsMobile] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      dispatch(loginFailure('Please fill in all fields'));
      return;
    }

    dispatch(loginStart());
    
    try {
      const response = await authService.loginMember(formData);
      
      if (response.status === 'otp_required' && response.requires_otp) {
        dispatch(loginSuccess(response));
        // Redirect to OTP verification page
        navigate('/otp-verification');
      } else {
        dispatch(loginFailure('Unexpected response from server'));
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      dispatch(loginFailure(errorMessage));
    }
  };

  const handleJoinNow = () => {
    navigate('/register');
  };

  const handleCustomerRegistration = () => {
    navigate('/customer-registration');
  };

  return (
    <div className="login-page">
      {/* Mobile Header */}
      {isMobile && (
        <div className="mobile-header">
          <div className="mobile-header-content">
            <div className="mobile-logo-container">
              <img 
                src="/images/ushuru-logo.png" 
                alt="Ushuru Investment Co-operative Society" 
                className="mobile-logo"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="mobile-logo-fallback">
                <span>UI</span>
              </div>
            </div>
            <div className="mobile-company-info">
              <div className="mobile-company-name">
                USHURU <span>INVESTMENT</span>
              </div>
              <div className="mobile-company-subtitle">Co-operative Society</div>
              <div className="mobile-company-slogan">Uwekezaji Imara</div>
            </div>
          </div>
        </div>
      )}

      <div className="login-content">
        {/* Desktop Brand Section */}
        {!isMobile && (
          <div className="desktop-brand-section">
            <div className="desktop-logo-background"></div>
            <div className="desktop-background-overlay"></div>
            
            <div className="desktop-brand-content">
              <div className="desktop-company-branding">
                <div className="desktop-logo-icon">
                  <img 
                    src="/images/ushuru-logo.png" 
                    alt="Ushuru Investment Co-operative Society" 
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="desktop-logo-fallback">
                    <span>UI</span>
                  </div>
                </div>
                
                <div className="desktop-company-text">
                  <div className="desktop-company-name">
                    USHURU <span>INVESTMENT</span>
                  </div>
                  <div className="desktop-company-subtitle">Co-operative Society</div>
                  <div className="desktop-company-slogan">Uwekezaji Imara</div>
                </div>
              </div>

              <p className="desktop-brand-tagline">
                Members Portal - Manage your investments, track contributions, and communicate with the society in real-time
              </p>

              <div className="desktop-features-list">
                <div className="desktop-feature-item">
                  <div className="desktop-feature-icon">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <span>Secure access with Two-Factor Authentication</span>
                </div>
                
                <div className="desktop-feature-item">
                  <div className="desktop-feature-icon">
                    <i className="fas fa-chart-line"></i>
                  </div>
                  <span>Real-time investment tracking and management</span>
                </div>
                
                <div className="desktop-feature-item">
                  <div className="desktop-feature-icon">
                    <i className="fas fa-file-contract"></i>
                  </div>
                  <span>Online document submission and approval</span>
                </div>
                
                <div className="desktop-feature-item">
                  <div className="desktop-feature-icon">
                    <i className="fas fa-comments"></i>
                  </div>
                  <span>Direct communication with society management</span>
                </div>
              </div>

              <div className="desktop-join-section">
                <Link to="/membership-application" className="desktop-join-button">
                  <i className="fas fa-user-plus"></i>
                  Join Our Society
                </Link>
                <p className="desktop-join-text">
                  New to Ushuru? Start your investment journey today!
                </p>
              </div>

              {/* ADDED: Customer Registration Section for Desktop */}
              <div className="desktop-customer-section">
                <Link to="/customer-registration" className="desktop-customer-button">
                  <i className="fas fa-user-tie"></i>
                  Register Customer
                </Link>
                <p className="desktop-customer-text">
                  Register new customers for land booking
                </p>
              </div>

              <div className="desktop-social-section">
                <p className="desktop-social-title">Follow us on social media</p>
                <div className="desktop-social-links">
                  <a href="#" title="Facebook"><i className="fab fa-facebook-f"></i></a>
                  <a href="#" title="Twitter"><i className="fab fa-twitter"></i></a>
                  <a href="#" title="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                  <a href="#" title="Instagram"><i className="fab fa-instagram"></i></a>
                  <a href="#" title="YouTube"><i className="fab fa-youtube"></i></a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Login Form Section */}
        <div className="login-form-section">
          <div className="login-form-container">
            {/* Mobile Form Header */}
            {isMobile && (
              <div className="mobile-form-header">
                <h2 className="mobile-form-title">Member Login</h2>
                <p className="mobile-form-subtitle">Access your investment portal</p>
              </div>
            )}

            {/* Desktop Form Header */}
            {!isMobile && (
              <div className="desktop-form-header">
                <h2 className="desktop-form-title">Member Login</h2>
                <p className="desktop-form-subtitle">Access your investment portal</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-field">
                <label htmlFor="username" className="form-label">
                  Username / Member Number
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  placeholder="Enter your username or member number"
                  value={formData.username}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-field">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-options">
                <label className="remember-me-option">
                  <input type="checkbox" className="remember-checkbox" />
                  <span>Remember me</span>
                </label>
                
                <a href="#" className="forgot-password-link">
                  Forgot Password?
                </a>
              </div>

              {error && (
                <div className="error-message">
                  <i className="fas fa-exclamation-circle"></i>
                  {typeof error === 'string' ? error : 'Login failed. Please check your credentials and try again.'}
                </div>
              )}

              <button type="submit" disabled={isLoading} className="login-submit-button">
                {isLoading ? (
                  <span className="button-content">
                    <i className="fas fa-spinner fa-spin"></i>
                    Signing in...
                  </span>
                ) : (
                  <span className="button-content">
                    <i className="fas fa-sign-in-alt"></i>
                    Login to Portal
                  </span>
                )}
              </button>

              {/* Mobile Join Button */}
              {isMobile && (
                <div className="mobile-action-buttons">
                  <button type="button" onClick={() => navigate('/membership-application')} className="mobile-join-button">
                    <i className="fas fa-user-plus"></i>
                    Join Our Society
                  </button>
                  
                  
                  {/* ADDED: Customer Registration Button for Mobile */}
                  <button type="button" onClick={handleCustomerRegistration} className="mobile-customer-button">
                    <i className="fas fa-user-tie"></i>
                    Register Customer
                  </button>
                </div>
              )}

              <div className="form-footer">
                <p className="footer-text">
                  Not yet a Member?{' '}
                  <Link to="/register" className="register-link">
                    Register Here!!
                  </Link>
                </p>
                
                {/* ADDED: Customer Registration Link for Desktop */}
                {!isMobile && (
                  <p className="footer-text customer-footer">
                    Register new customers for land booking?{' '}
                    <Link to="/customer-registration" className="customer-register-link">
                      Click Here
                    </Link>
                  </p>
                )}
              </div>
            </form>

            {/* Mobile Social Links */}
            {isMobile && (
              <div className="mobile-social-section">
                <p className="mobile-social-title">Follow us</p>
                <div className="mobile-social-links">
                  <a href="#" title="Facebook"><i className="fab fa-facebook-f"></i></a>
                  <a href="#" title="Twitter"><i className="fab fa-twitter"></i></a>
                  <a href="#" title="Instagram"><i className="fab fa-instagram"></i></a>
                  <a href="#" title="YouTube"><i className="fab fa-youtube"></i></a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .login-content {
          display: flex;
          flex: 1;
          flex-direction: column;
        }

        @media (min-width: 1024px) {
          .login-content {
            flex-direction: row;
          }
        }

        /* Mobile Header */
        .mobile-header {
          background: linear-gradient(to right, #7A1F23, #5a1519);
          padding: 1rem;
          text-align: center;
          color: white;
        }

        .mobile-header-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .mobile-logo-container {
          width: 3rem;
          height: 3rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #F5B800;
        }

        .mobile-logo {
          width: 80%;
          height: 80%;
          object-fit: contain;
        }

        .mobile-logo-fallback {
          width: 100%;
          height: 100%;
          border-radius: 0.5rem;
          display: none;
          align-items: center;
          justify-content: center;
          color: #7A1F23;
          font-weight: bold;
          font-size: 0.875rem;
        }

        .mobile-company-info {
          text-align: left;
        }

        .mobile-company-name {
          font-size: 1rem;
          font-weight: bold;
        }

        .mobile-company-name span {
          color: #F5B800;
        }

        .mobile-company-subtitle {
          font-size: 0.75rem;
          color: #F5B800;
        }

        .mobile-company-slogan {
          font-size: 0.625rem;
          font-style: italic;
          color: #F5B800;
        }

        /* Desktop Brand Section */
        .desktop-brand-section {
          width: 50%;
          display: none;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          color: white;
          padding: 2rem;
          position: relative;
          overflow: hidden;
          background: linear-gradient(to bottom right, #7A1F23, #5a1519);
        }

        @media (min-width: 1024px) {
          .desktop-brand-section {
            display: flex;
          }
        }

        .desktop-logo-background {
          position: absolute;
          inset: 0;
          opacity: 0.1;
          background-image: url('/images/ushuru-logo.png');
          background-size: 60%;
          background-position: center;
          background-repeat: no-repeat;
          filter: grayscale(100%) brightness(200%);
        }

        .desktop-background-overlay {
          position: absolute;
          inset: 0;
          background-color: #7A1F23;
          opacity: 0.8;
        }

        .desktop-brand-content {
          max-width: 28rem;
          width: 100%;
          position: relative;
          z-index: 10;
        }

        .desktop-company-branding {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 2rem;
        }

        .desktop-logo-icon {
          width: 5rem;
          height: 5rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          background-color: #F5B800;
        }

        .desktop-logo-icon img {
          width: 80%;
          height: 80%;
          object-fit: contain;
        }

        .desktop-logo-fallback {
          width: 100%;
          height: 100%;
          border-radius: 0.5rem;
          display: none;
          align-items: center;
          justify-content: center;
          color: #7A1F23;
          font-weight: bold;
          font-size: 1.5rem;
        }

        .desktop-company-text {
          text-align: center;
        }

        .desktop-company-name {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 0.25rem;
        }

        .desktop-company-name span {
          color: #F5B800;
        }

        .desktop-company-subtitle {
          font-size: 1.125rem;
          margin-bottom: 0.5rem;
          color: #F5B800;
        }

        .desktop-company-slogan {
          font-size: 0.875rem;
          font-style: italic;
          color: #F5B800;
        }

        .desktop-brand-tagline {
          font-size: 1.125rem;
          margin-bottom: 3rem;
          text-align: center;
        }

        .desktop-features-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .desktop-feature-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          text-align: left;
        }

        .desktop-feature-icon {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #F5B800;
          color: #7A1F23;
          flex-shrink: 0;
        }

        .desktop-join-section {
          margin-top: 2rem;
          text-align: center;
        }

        .desktop-join-button {
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          border: none;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background-color: #F5B800;
          color: #7A1F23;
          text-decoration: none;
        }

        .desktop-join-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
        }

        .desktop-join-text {
          font-size: 0.875rem;
          margin-top: 0.5rem;
          color: #F5B800;
        }

        /* ADDED: Desktop Customer Registration Section */
        .desktop-customer-section {
          margin-top: 1.5rem;
          text-align: center;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(245, 184, 0, 0.3);
        }

        .desktop-customer-button {
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          border: none;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background-color: #28a745;
          color: white;
          text-decoration: none;
        }

        .desktop-customer-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
          background-color: #218838;
        }

        .desktop-customer-text {
          font-size: 0.875rem;
          margin-top: 0.5rem;
          color: #F5B800;
        }

        .desktop-social-section {
          margin-top: 3rem;
        }

        .desktop-social-title {
          text-align: center;
          margin-bottom: 1rem;
          font-size: 0.875rem;
          color: #F5B800;
        }

        .desktop-social-links {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
        }

        .desktop-social-links a {
          color: #F5B800;
          transition: all 0.3s ease;
        }

        .desktop-social-links a:hover {
          color: white;
          transform: scale(1.1);
        }

        /* Login Form Section */
        .login-form-section {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f9fafb;
          padding: 1.5rem;
        }

        @media (min-width: 1024px) {
          .login-form-section {
            width: 50%;
            padding: 2rem;
          }
        }

        .login-form-container {
          width: 100%;
          max-width: 28rem;
        }

        .mobile-form-header {
          display: block;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        @media (min-width: 1024px) {
          .mobile-form-header {
            display: none;
          }
        }

        .mobile-form-title {
          font-size: 1.875rem;
          font-weight: bold;
          color: #7A1F23;
          margin-bottom: 0.5rem;
        }

        .mobile-form-subtitle {
          color: #666;
          margin-top: 0.5rem;
        }

        .desktop-form-header {
          display: none;
          text-align: center;
          margin-bottom: 0.5rem;
        }

        @media (min-width: 1024px) {
          .desktop-form-header {
            display: block;
          }
        }

        .desktop-form-title {
          font-size: 2rem;
          font-weight: bold;
          color: #7A1F23;
          margin-bottom: 0.5rem;
        }

        .desktop-form-subtitle {
          color: #666;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-field {
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

        .form-options {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .remember-me-option {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .remember-checkbox {
          width: 1rem;
          height: 1rem;
          color: #7A1F23;
          border-color: #d1d5db;
          border-radius: 0.25rem;
          cursor: pointer;
        }

        .forgot-password-link {
          font-size: 0.875rem;
          font-weight: 500;
          color: #7A1F23;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .forgot-password-link:hover {
          color: #5a1519;
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

        .login-submit-button {
          background-color: #7A1F23;
          color: white;
          padding: 0.75rem;
          border-radius: 0.5rem;
          font-weight: 600;
          border: none;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(122, 31, 35, 0.2);
          width: 100%;
        }

        .login-submit-button:hover:not(:disabled) {
          background-color: #5a1519;
        }

        .login-submit-button:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .button-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        /* ADDED: Mobile Action Buttons Container */
        .mobile-action-buttons {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .mobile-join-button {
          padding: 0.75rem;
          border-radius: 0.5rem;
          font-weight: 600;
          border: none;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background-color: #F5B800;
          color: #7A1F23;
        }

        .mobile-join-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
        }

        /* ADDED: Mobile Customer Registration Button */
        .mobile-customer-button {
          padding: 0.75rem;
          border-radius: 0.5rem;
          font-weight: 600;
          border: none;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background-color: #28a745;
          color: white;
        }

        .mobile-customer-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
          background-color: #218838;
        }

        .form-footer {
          text-align: center;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
        }

        .footer-text {
          font-size: 0.875rem;
          color: #666;
          margin-bottom: 0.5rem;
        }

        /* ADDED: Customer Footer Text */
        .customer-footer {
          margin-top: 0.5rem;
          padding-top: 0.5rem;
          border-top: 1px dashed #e5e7eb;
        }

        .register-link {
          font-weight: 500;
          color: #7A1F23;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .register-link:hover {
          color: #5a1519;
          text-decoration: underline;
        }

        /* ADDED: Customer Registration Link */
        .customer-register-link {
          font-weight: 500;
          color: #28a745;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .customer-register-link:hover {
          color: #218838;
          text-decoration: underline;
        }

        /* Mobile Social Section */
        .mobile-social-section {
          margin-top: 2rem;
          text-align: center;
        }

        .mobile-social-title {
          font-size: 0.875rem;
          color: #666;
          margin-bottom: 1rem;
        }

        .mobile-social-links {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
        }

        .mobile-social-links a {
          color: #7A1F23;
          transition: all 0.3s ease;
        }

        .mobile-social-links a:hover {
          color: #5a1519;
          transform: scale(1.1);
        }

        /* Responsive adjustments */
        @media (max-width: 480px) {
          .login-form-section {
            padding: 1rem;
          }
          
          .mobile-form-title {
            font-size: 1.5rem;
          }
          
          .form-input {
            padding: 0.875rem 1rem;
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .desktop-brand-section {
            padding: 3rem 2rem;
          }
          
          .login-form-section {
            padding: 3rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;