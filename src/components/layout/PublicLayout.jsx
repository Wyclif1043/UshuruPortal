// src/components/layout/PublicLayout.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const PublicLayout = ({ children }) => {
  return (
    <div className="public-layout">
      {/* Public Header */}
      <header className="public-header">
        <div className="public-header-content">
          <div className="public-logo-container">
            <Link to="/" className="public-logo-link">
              <img 
                src="/images/ushuru-logo.png" 
                alt="Ushuru Investment Co-operative Society" 
                className="public-logo"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const fallback = e.target.nextSibling;
                  if (fallback) {
                    fallback.style.display = 'flex';
                  }
                }}
              />
              <div className="public-logo-fallback">
                <span>UI</span>
              </div>
            </Link>
            <div className="public-company-info">
              <div className="public-company-name">
                USHURU <span>INVESTMENT</span>
              </div>
              <div className="public-company-subtitle">Co-operative Society</div>
            </div>
          </div>
          
          <div className="public-header-actions">
            <Link to="/login" className="public-login-link">
              <i className="fas fa-sign-in-alt"></i>
              <span className="login-text">Member Login</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="public-main">
        {children}
      </main>

      {/* Public Footer */}
      <footer className="public-footer">
        <div className="public-footer-content">
          <div className="public-footer-info">
            <p>&copy; 2024 Ushuru Investment Co-operative Society. All rights reserved.</p>
          </div>
          <div className="public-footer-links">
            <Link to="/customer-registration">Customer Registration</Link>
            <Link to="/customer-booking">Land Booking</Link>
            <a href="/contact">Contact Us</a>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .public-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #f8fafc;
        }

        .public-header {
          background: linear-gradient(135deg, #7A1F23 0%, #5a1519 100%);
          padding: 1rem;
          color: white;
          box-shadow: 0 2px 20px rgba(122, 31, 35, 0.15);
          position: relative;
          z-index: 100;
        }

        .public-header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          gap: 1rem;
        }

        .public-logo-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
        }

        .public-logo-link {
          display: flex;
          align-items: center;
          text-decoration: none;
          gap: 0.75rem;
        }

        .public-logo {
          width: 2.5rem;
          height: 2.5rem;
          object-fit: contain;
          border-radius: 0.375rem;
        }

        .public-logo-fallback {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 0.5rem;
          display: none;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #F5B800, #e6ac00);
          color: #7A1F23;
          font-weight: bold;
          font-size: 0.9rem;
          flex-shrink: 0;
        }

        .public-company-info {
          text-align: left;
        }

        .public-company-name {
          font-size: clamp(1rem, 2.5vw, 1.25rem);
          font-weight: 800;
          line-height: 1.2;
          white-space: nowrap;
        }

        .public-company-name span {
          color: #F5B800;
          font-weight: 700;
        }

        .public-company-subtitle {
          font-size: clamp(0.7rem, 1.5vw, 0.875rem);
          color: #F5B800;
          font-weight: 500;
          margin-top: 0.125rem;
        }

        .public-header-actions {
          display: flex;
          gap: 0.75rem;
          flex-shrink: 0;
        }

        .public-login-link {
          padding: 0.5rem 1rem;
          background: linear-gradient(135deg, #F5B800, #e6ac00);
          color: #7A1F23;
          text-decoration: none;
          border-radius: 0.5rem;
          font-weight: 600;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(245, 184, 0, 0.3);
        }

        .public-login-link:hover {
          background: linear-gradient(135deg, #e6ac00, #d9a200);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(245, 184, 0, 0.4);
        }

        .login-text {
          font-weight: 600;
        }

        .public-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #f8fafc;
        }

        .public-footer {
          background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
          color: white;
          padding: 1.5rem 1rem;
          margin-top: auto;
          border-top: 1px solid #4a5568;
        }

        .public-footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .public-footer-info p {
          margin: 0;
          color: #cbd5e0;
          font-size: 0.875rem;
        }

        .public-footer-links {
          display: flex;
          gap: 1.25rem;
          flex-wrap: wrap;
        }

        .public-footer-links a {
          color: #cbd5e0;
          text-decoration: none;
          transition: all 0.3s ease;
          font-size: 0.875rem;
          font-weight: 500;
          padding: 0.25rem 0;
          position: relative;
        }

        .public-footer-links a:hover {
          color: #F5B800;
          transform: translateY(-1px);
        }

        .public-footer-links a:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: #F5B800;
          transition: width 0.3s ease;
        }

        .public-footer-links a:hover:after {
          width: 100%;
        }

        /* Mobile-first Responsive Design */
        @media (max-width: 768px) {
          .public-header {
            padding: 0.875rem;
          }

          .public-header-content {
            flex-direction: column;
            gap: 0.75rem;
            text-align: center;
          }

          .public-logo-container {
            justify-content: center;
          }

          .public-company-info {
            text-align: center;
          }

          .public-company-name {
            white-space: normal;
            line-height: 1.1;
          }

          .public-footer {
            padding: 1.25rem 0.875rem;
          }

          .public-footer-content {
            flex-direction: column;
            text-align: center;
            gap: 0.75rem;
          }

          .public-footer-links {
            justify-content: center;
            gap: 1rem;
          }
        }

        @media (max-width: 480px) {
          .public-header {
            padding: 0.75rem;
          }

          .public-logo-container {
            flex-direction: column;
            gap: 0.5rem;
          }

          .public-logo-link {
            flex-direction: column;
            text-align: center;
          }

          .public-company-name {
            font-size: 1.1rem;
          }

          .public-login-link {
            padding: 0.5rem 0.875rem;
            font-size: 0.85rem;
          }

          .public-footer {
            padding: 1rem 0.75rem;
          }

          .public-footer-links {
            flex-direction: column;
            gap: 0.5rem;
          }

          .public-footer-links a {
            padding: 0.375rem 0;
          }
        }

        @media (max-width: 360px) {
          .public-header {
            padding: 0.625rem;
          }

          .public-company-name {
            font-size: 1rem;
          }

          .public-company-subtitle {
            font-size: 0.75rem;
          }

          .public-login-link {
            padding: 0.375rem 0.75rem;
            font-size: 0.8rem;
          }
        }

        /* Large screens */
        @media (min-width: 1200px) {
          .public-header-content {
            padding: 0 1rem;
          }
        }

        /* Print styles */
        @media print {
          .public-header,
          .public-footer {
            display: none;
          }
          
          .public-main {
            background: white;
          }
        }
      `}</style>
    </div>
  );
};

export default PublicLayout;