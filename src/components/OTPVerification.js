// components/OTPVerification.js
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { confirmOTP, sendOTP, resetOTPState } from '../store/slices/authSlice';

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(300); // 5 minutes
  const inputsRef = useRef([]);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { otp: otpState, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      navigate('/');
    }

    if (!otpState.memberNumber) {
      navigate('/login');
    }

    // Start countdown timer
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [token, navigate, otpState.memberNumber]);

  useEffect(() => {
    // Focus first input on mount
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 4);
    if (/^\d+$/.test(pasteData)) {
      const newOtp = pasteData.split('').slice(0, 4);
      setOtp([...newOtp, ...Array(4 - newOtp.length).fill('')]);
      
      // Focus the next empty input or last input
      const nextIndex = Math.min(newOtp.length, 3);
      inputsRef.current[nextIndex].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    
    if (otpCode.length !== 4) {
      return;
    }

    dispatch(confirmOTP({
      memberNumber: otpState.memberNumber,
      otpCode: otpCode
    }));
  };

  const handleResendOTP = () => {
    if (timer === 0) {
      dispatch(sendOTP(otpState.memberNumber));
      setTimer(300); // Reset timer to 5 minutes
      setOtp(['', '', '', '']);
      if (inputsRef.current[0]) {
        inputsRef.current[0].focus();
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBackToLogin = () => {
    dispatch(resetOTPState());
    navigate('/login');
  };

  return (
    <div className="otp-verification-page">
      <div className="otp-container">
        <div className="otp-header">
          <button onClick={handleBackToLogin} className="back-button">
            <i className="fas fa-arrow-left"></i>
          </button>
          <h2>Verify Your Identity</h2>
          <p>Enter the 4-digit code sent to your registered contact</p>
        </div>

        <form onSubmit={handleSubmit} className="otp-form">
          <div className="otp-inputs">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="otp-input"
                disabled={otpState.isLoading}
              />
            ))}
          </div>

          <div className="timer-section">
            <p className="timer-text">
              Time remaining: <span className="timer">{formatTime(timer)}</span>
            </p>
            {timer === 0 && (
              <p className="expired-text">Code expired. Please request a new one.</p>
            )}
          </div>

          {otpState.error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              {otpState.error}
            </div>
          )}

          <button
            type="submit"
            disabled={otp.join('').length !== 4 || otpState.isLoading}
            className="verify-button"
          >
            {otpState.isLoading ? (
              <span className="button-content">
                <i className="fas fa-spinner fa-spin"></i>
                Verifying...
              </span>
            ) : (
              <span className="button-content">
                <i className="fas fa-shield-alt"></i>
                Verify Code
              </span>
            )}
          </button>

          <div className="resend-section">
            <p>Didn't receive the code?</p>
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={timer > 0}
              className="resend-button"
            >
              {timer > 0 ? `Resend in ${formatTime(timer)}` : 'Resend Code'}
            </button>
          </div>
        </form>

        <div className="otp-footer">
          <p>Having trouble receiving the code?</p>
          <p className="contact-support">
            Contact support at <a href="mailto:support@ushuru.com">support@ushuru.com</a>
          </p>
        </div>
      </div>

      <style jsx>{`
        .otp-verification-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #7A1F23 0%, #5a1519 100%);
          padding: 1rem;
        }

        .otp-container {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          width: 100%;
          max-width: 28rem;
        }

        .otp-header {
          text-align: center;
          margin-bottom: 2rem;
          position: relative;
        }

        .back-button {
          position: absolute;
          left: 0;
          top: 0;
          background: none;
          border: none;
          color: #7A1F23;
          font-size: 1.25rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 0.5rem;
          transition: background-color 0.3s ease;
        }

        .back-button:hover {
          background-color: #f9fafb;
        }

        .otp-header h2 {
          color: #7A1F23;
          font-size: 1.875rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        .otp-header p {
          color: #666;
          margin: 0;
        }

        .otp-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .otp-inputs {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin: 1rem 0;
        }

        .otp-input {
          width: 4rem;
          height: 4rem;
          border: 2px solid #d1d5db;
          border-radius: 0.75rem;
          text-align: center;
          font-size: 1.5rem;
          font-weight: bold;
          transition: all 0.3s ease;
          background-color: white;
        }

        .otp-input:focus {
          border-color: #7A1F23;
          box-shadow: 0 0 0 3px rgba(122, 31, 35, 0.1);
          outline: none;
        }

        .otp-input:disabled {
          background-color: #f9fafb;
          cursor: not-allowed;
        }

        .timer-section {
          text-align: center;
        }

        .timer-text {
          color: #666;
          margin: 0;
        }

        .timer {
          color: #7A1F23;
          font-weight: bold;
        }

        .expired-text {
          color: #dc2626;
          font-size: 0.875rem;
          margin: 0.5rem 0 0 0;
        }

        .error-message {
          background-color: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 1rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
        }

        .verify-button {
          background-color: #7A1F23;
          color: white;
          border: none;
          padding: 1rem;
          border-radius: 0.75rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(122, 31, 35, 0.2);
        }

        .verify-button:hover:not(:disabled) {
          background-color: #5a1519;
          transform: translateY(-1px);
        }

        .verify-button:disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
          transform: none;
        }

        .button-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .resend-section {
          text-align: center;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
        }

        .resend-section p {
          color: #666;
          margin: 0 0 0.5rem 0;
        }

        .resend-button {
          background: none;
          border: none;
          color: #7A1F23;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.3s ease;
          font-size: 0.875rem;
        }

        .resend-button:hover:not(:disabled) {
          color: #5a1519;
          text-decoration: underline;
        }

        .resend-button:disabled {
          color: #9ca3af;
          cursor: not-allowed;
        }

        .otp-footer {
          text-align: center;
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
        }

        .otp-footer p {
          color: #666;
          margin: 0.25rem 0;
          font-size: 0.875rem;
        }

        .contact-support a {
          color: #7A1F23;
          text-decoration: none;
        }

        .contact-support a:hover {
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .otp-container {
            padding: 1.5rem;
          }

          .otp-input {
            width: 3.5rem;
            height: 3.5rem;
            font-size: 1.25rem;
          }

          .otp-header h2 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default OTPVerification;