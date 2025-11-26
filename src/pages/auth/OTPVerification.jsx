// src/pages/auth/OTPVerification.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { 
  otpVerificationStart, 
  otpVerificationSuccess, 
  otpVerificationFailure 
} from '../../store/slices/authSlice';
import { authService } from '../../services/authService';

const OTPVerification = () => {
  const [otp, setOtp] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [autoFilled, setAutoFilled] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { memberNumber, isLoading, error } = useSelector((state) => state.auth);

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

  useEffect(() => {
    // Start countdown for resend OTP
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Auto-fill OTP from localStorage when component mounts
  useEffect(() => {
    const generatedOTP = localStorage.getItem('generatedOTP');
    const otpTimestamp = localStorage.getItem('otpTimestamp');
    
    // Check if OTP is still valid (within 10 minutes)
    if (generatedOTP && otpTimestamp) {
      const timeDiff = Date.now() - parseInt(otpTimestamp);
      const tenMinutes = 10 * 60 * 1000; // 10 minutes in milliseconds
      
      if (timeDiff < tenMinutes && !otp && !autoFilled) {
        setOtp(generatedOTP);
        setAutoFilled(true);
        
        // Auto-submit after a short delay
        const autoSubmitTimer = setTimeout(() => {
          if (!isLoading) {
            handleSubmit(null, generatedOTP);
          }
        }, 1500); // 1.5 second delay to show user the auto-filled OTP
        
        return () => clearTimeout(autoSubmitTimer);
      } else if (timeDiff >= tenMinutes) {
        // Clear expired OTP
        localStorage.removeItem('generatedOTP');
        localStorage.removeItem('otpTimestamp');
      }
    }
  }, [otp, autoFilled, isLoading]);

  const handleOtpChange = (e) => {
    // Only allow numbers and limit to 4 digits
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setOtp(value);
    
    // Auto-submit when 4 digits are entered
    if (value.length === 4 && !isLoading) {
      handleSubmit(null, value);
    }
  };

  const handleSubmit = async (e, otpValue = otp) => {
    if (e) e.preventDefault();
    
    const otpToVerify = otpValue || otp;
    
    if (otpToVerify.length !== 4) {
      dispatch(otpVerificationFailure('Please enter a valid 4-digit OTP'));
      return;
    }

    dispatch(otpVerificationStart());
    
    try {
      const otpData = {
        username: memberNumber,
        otpCode: otpToVerify,
      };
      
      const response = await authService.verifyOTP(otpData);
      
      if (response.status === 'success') {
        // Clear the stored OTP after successful verification
        localStorage.removeItem('generatedOTP');
        localStorage.removeItem('otpTimestamp');
        
        dispatch(otpVerificationSuccess(response));
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        dispatch(otpVerificationFailure(response.message || 'OTP verification failed'));
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'OTP verification failed. Please try again.';
      dispatch(otpVerificationFailure(errorMessage));
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    try {
      // Call your resend OTP service
      await authService.resendOTP({ username: memberNumber });
      setCountdown(60);
      setCanResend(false);
      setOtp('');
      setAutoFilled(false);
      
      // Clear old OTP from localStorage when resending
      localStorage.removeItem('generatedOTP');
      localStorage.removeItem('otpTimestamp');
      
      // Show success message or notification
      alert('OTP has been resent to your registered contact');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to resend OTP. Please try again.';
      dispatch(otpVerificationFailure(errorMessage));
    }
  };

  const handleBackToLogin = () => {
    // Clear stored OTP when going back to login
    localStorage.removeItem('generatedOTP');
    localStorage.removeItem('otpTimestamp');
    navigate('/login');
  };

  return (
    <div className="otp-page">
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

      <div className="otp-content">
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
                Secure Two-Factor Authentication - Protecting your investment account with an extra layer of security
              </p>

              <div className="desktop-features-list">
                <div className="desktop-feature-item">
                  <div className="desktop-feature-icon">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <span>Enhanced security with OTP verification</span>
                </div>
                
                <div className="desktop-feature-item">
                  <div className="desktop-feature-icon">
                    <i className="fas fa-clock"></i>
                  </div>
                  <span>OTP expires automatically for your protection</span>
                </div>
                
                <div className="desktop-feature-item">
                  <div className="desktop-feature-icon">
                    <i className="fas fa-mobile-alt"></i>
                  </div>
                  <span>Delivered to your registered mobile number</span>
                </div>
                
                <div className="desktop-feature-item">
                  <div className="desktop-feature-icon">
                    <i className="fas fa-lock"></i>
                  </div>
                  <span>One-time use code for secure access</span>
                </div>
              </div>

              <div className="desktop-security-tips">
                <h4 className="security-tips-title">Security Tips:</h4>
                <ul className="security-tips-list">
                  <li>Never share your OTP with anyone</li>
                  <li>The OTP is valid for 10 minutes only</li>
                  <li>Contact support if you didn't request this OTP</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* OTP Form Section */}
        <div className="otp-form-section">
          <div className="otp-form-container">
            {/* Mobile Form Header */}
            {isMobile && (
              <div className="mobile-form-header">
                <h2 className="mobile-form-title">OTP Verification</h2>
                <p className="mobile-form-subtitle">Enter the code sent to your registered contact</p>
              </div>
            )}

            {/* Desktop Form Header */}
            {!isMobile && (
              <div className="desktop-form-header">
                <h2 className="desktop-form-title">OTP Verification</h2>
                <p className="desktop-form-subtitle">Enter the code sent to your registered contact</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="otp-form">
              <div className="otp-instructions">
                <div className="otp-icon">
                  <i className="fas fa-sms"></i>
                </div>
                <p className="instruction-text">
                  We've sent a 4-digit verification code to the mobile number associated with your account.
                  {autoFilled && (
                    <span style={{
                      display: 'block', 
                      marginTop: '0.5rem', 
                      fontWeight: 'bold', 
                      color: '#F5B800',
                      fontSize: '0.8rem'
                    }}>
                      <i className="fas fa-bolt"></i> OTP Auto-filled & will auto-verify shortly...
                    </span>
                  )}
                </p>
              </div>

              <div className="form-field">
                <label htmlFor="otp" className="form-label">
                  Enter OTP Code
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  placeholder="Enter 4-digit OTP"
                  value={otp}
                  onChange={handleOtpChange}
                  className="otp-input"
                  maxLength={4}
                  pattern="\d{4}"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  autoFocus
                  disabled={autoFilled && isLoading}
                />
                <div className="otp-hint">
                  <i className="fas fa-info-circle"></i>
                  {autoFilled ? 'OTP auto-filled from system' : 'Enter the 4-digit code sent to your device'}
                </div>
              </div>

              {error && (
                <div className="error-message">
                  <i className="fas fa-exclamation-circle"></i>
                  {typeof error === 'string' ? error : 'OTP verification failed. Please try again.'}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isLoading || otp.length !== 4}
                className="verify-submit-button"
              >
                {isLoading ? (
                  <span className="button-content">
                    <i className="fas fa-spinner fa-spin"></i>
                    {autoFilled ? 'Auto-verifying...' : 'Verifying...'}
                  </span>
                ) : (
                  <span className="button-content">
                    <i className="fas fa-check-circle"></i>
                    Verify & Continue
                  </span>
                )}
              </button>

              <div className="resend-section">
                <p className="resend-text">
                  Didn't receive the code?{' '}
                  {canResend ? (
                    <button 
                      type="button" 
                      className="resend-link"
                      onClick={handleResendOTP}
                    >
                      Resend OTP
                    </button>
                  ) : (
                    <span className="countdown-text">
                      Resend available in <strong>{countdown}s</strong>
                    </span>
                  )}
                </p>
              </div>

              <div className="form-footer">
                <button 
                  type="button" 
                  onClick={handleBackToLogin}
                  className="back-to-login-button"
                >
                  <i className="fas fa-arrow-left"></i>
                  Back to Login
                </button>
              </div>
            </form>

            {/* Mobile Security Tips */}
            {isMobile && (
              <div className="mobile-security-tips">
                <h4 className="security-tips-title">Security Tips:</h4>
                <ul className="security-tips-list">
                  <li>Never share your OTP with anyone</li>
                  <li>The OTP is valid for 10 minutes only</li>
                  <li>Contact support if you didn't request this OTP</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .otp-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .otp-content {
          display: flex;
          flex: 1;
          flex-direction: column;
        }

        @media (min-width: 1024px) {
          .otp-content {
            flex-direction: row;
          }
        }

        /* Mobile Header - Same as login */
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

        /* Desktop Brand Section - Same as login with updated content */
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

        .desktop-security-tips {
          margin-top: 2rem;
          text-align: left;
          background: rgba(245, 184, 0, 0.1);
          padding: 1.5rem;
          border-radius: 0.5rem;
          border-left: 4px solid #F5B800;
        }

        .security-tips-title {
          color: #F5B800;
          margin-bottom: 1rem;
          font-size: 1rem;
        }

        .security-tips-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .security-tips-list li {
          margin-bottom: 0.5rem;
          padding-left: 1rem;
          position: relative;
          font-size: 0.875rem;
        }

        .security-tips-list li:before {
          content: '•';
          color: #F5B800;
          position: absolute;
          left: 0;
        }

        /* OTP Form Section */
        .otp-form-section {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f9fafb;
          padding: 1.5rem;
        }

        @media (min-width: 1024px) {
          .otp-form-section {
            width: 50%;
            padding: 2rem;
          }
        }

        .otp-form-container {
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

        .otp-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .otp-instructions {
          text-align: center;
          padding: 1.5rem;
          background: linear-gradient(135deg, #7A1F23, #5a1519);
          border-radius: 0.5rem;
          color: white;
        }

        .otp-icon {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: #F5B800;
        }

        .instruction-text {
          font-size: 0.875rem;
          line-height: 1.5;
          margin: 0;
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

        .otp-input {
          width: 100%;
          padding: 1rem;
          border: 2px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 1.5rem;
          font-weight: bold;
          text-align: center;
          letter-spacing: 0.5rem;
          transition: all 0.3s ease;
          background-color: white;
        }

        .otp-input:focus {
          border-color: #7A1F23;
          box-shadow: 0 0 0 3px rgba(122, 31, 35, 0.1);
          outline: none;
        }

        .otp-hint {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: #666;
          margin-top: 0.5rem;
        }

        .otp-hint i {
          color: #7A1F23;
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

        .verify-submit-button {
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

        .verify-submit-button:hover:not(:disabled) {
          background-color: #5a1519;
        }

        .verify-submit-button:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .button-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .resend-section {
          text-align: center;
          padding: 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          background-color: #f9fafb;
        }

        .resend-text {
          font-size: 0.875rem;
          color: #666;
          margin: 0;
        }

        .resend-link {
          background: none;
          border: none;
          color: #7A1F23;
          font-weight: 600;
          cursor: pointer;
          text-decoration: underline;
        }

        .resend-link:hover {
          color: #5a1519;
        }

        .countdown-text {
          color: #9ca3af;
        }

        .form-footer {
          text-align: center;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
        }

        .back-to-login-button {
          background: none;
          border: 1px solid #d1d5db;
          color: #666;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .back-to-login-button:hover {
          background-color: #f3f4f6;
          border-color: #9ca3af;
        }

        .mobile-security-tips {
          margin-top: 2rem;
          padding: 1rem;
          background-color: #fef3c7;
          border-radius: 0.5rem;
          border-left: 4px solid #f59e0b;
        }

        .mobile-security-tips .security-tips-title {
          color: #92400e;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }

        .mobile-security-tips .security-tips-list {
          font-size: 0.75rem;
          color: #92400e;
        }

        .mobile-security-tips .security-tips-list li:before {
          color: #f59e0b;
        }

        /* Responsive adjustments */
        @media (max-width: 480px) {
          .otp-form-section {
            padding: 1rem;
          }
          
          .mobile-form-title {
            font-size: 1.5rem;
          }
          
          .otp-input {
            padding: 0.875rem;
            font-size: 1.25rem;
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .desktop-brand-section {
            padding: 3rem 2rem;
          }
          
          .otp-form-section {
            padding: 3rem;
          }
        }
      `}</style>
    </div>
  );
};

export default OTPVerification;