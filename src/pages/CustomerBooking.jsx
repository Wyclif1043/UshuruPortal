// src/pages/CustomerBooking.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { authService } from '../services/authService';
import PublicLayout from '../components/layout/PublicLayout';
import CustomerPlotBooking from '../components/customer/CustomerPlotBooking';

const CustomerBooking = () => {
  const [searchParams] = useSearchParams();
  const customerNo = searchParams.get('customerNo');
  
  const [activeTab, setActiveTab] = useState('lands');
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedLand, setSelectedLand] = useState(null);

  useEffect(() => {
    loadLands();
  }, []);

  const loadLands = async () => {
    setLoading(true);
    try {
      const response = await authService.getLandList();
      if (response.success) {
        setLands(response.landList || []);
      } else {
        setError('Failed to load lands');
      }
    } catch (err) {
      setError('Error loading lands');
      console.error('Error loading lands:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLandSelect = (land) => {
    setSelectedLand(land);
    setActiveTab('booking');
  };

  const handleBookingSuccess = () => {
    setActiveTab('lands');
    setSelectedLand(null);
    setError('');
  };

  if (!customerNo) {
    return (
      <PublicLayout>
        <div className="customer-booking">
          <div className="error-state">
            <div className="error-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h2>Customer Number Required</h2>
            <p>Please register a customer first to access booking.</p>
            <button 
              onClick={() => window.location.href = '/customer-registration'}
              className="primary-button"
            >
              <i className="fas fa-user-plus"></i>
              Go to Registration
            </button>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="customer-booking">
        <div className="booking-container">
          {/* REMOVED DUPLICATE HEADER SECTION - PublicLayout already provides header */}

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              <span className="error-text">{error}</span>
              <button onClick={() => setError('')} className="close-error">
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}

          {/* Customer Info Card */}
          <div className="customer-info-section">
            <div className="customer-info-card">
              <div className="customer-icon">
                <i className="fas fa-user-tie"></i>
              </div>
              <div className="customer-details">
                <div className="customer-id">Customer Number: <strong>{customerNo}</strong></div>
                <div className="booking-step">
                  {activeTab === 'lands' ? 'Select a land to book plots' : 'Book your preferred plot'}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="booking-navigation">
            <div className="nav-tabs">
              <button 
                className={`nav-tab ${activeTab === 'lands' ? 'active' : ''}`}
                onClick={() => setActiveTab('lands')}
              >
                <i className="fas fa-map-marked-alt"></i>
                <span className="tab-label">Available Lands</span>
              </button>
              <button 
                className={`nav-tab ${activeTab === 'booking' ? 'active' : ''}`}
                onClick={() => setActiveTab('booking')}
                disabled={!selectedLand}
              >
                <i className="fas fa-edit"></i>
                <span className="tab-label">Book Plot</span>
                {!selectedLand && <span className="tab-hint">Select land first</span>}
              </button>
            </div>
          </div>

          {/* Content Section */}
          <div className="booking-content">
            {loading && (
              <div className="loading-state">
                <div className="loading-spinner">
                  <i className="fas fa-spinner fa-spin"></i>
                </div>
                <p>Loading available lands...</p>
              </div>
            )}
            
            {activeTab === 'lands' && (
              <div className="lands-section">
                <div className="section-header">
                  <h2>Available Lands for Booking</h2>
                  <p>Select a land to view available plots</p>
                </div>
                
                {lands.length > 0 ? (
                  <div className="lands-grid">
                    {lands.map((land, index) => (
                      <div 
                        key={index}
                        className="land-card"
                        onClick={() => handleLandSelect(land)}
                      >
                        <div className="land-card-header">
                          <div className="land-icon">
                            <i className="fas fa-mountain"></i>
                          </div>
                          <div className="land-title">
                            <h3>{land.Description}</h3>
                            <span className="land-code">{land['Land Code']}</span>
                          </div>
                          <span className={`status-badge ${land.Status?.toLowerCase() || 'available'}`}>
                            {land.Status || 'Available'}
                          </span>
                        </div>
                        
                        <div className="land-card-body">
                          <div className="land-details">
                            <div className="detail-item">
                              <i className="fas fa-map-marker-alt"></i>
                              <span>{land.Region || 'N/A'}</span>
                            </div>
                            <div className="detail-item">
                              <i className="fas fa-expand-arrows-alt"></i>
                              <span>Total: {land['Total Area'] || '0'} acres</span>
                            </div>
                            <div className="detail-item">
                              <i className="fas fa-check-circle"></i>
                              <span>Available: {land['Available Area'] || '0'} acres</span>
                            </div>
                            <div className="detail-item">
                              <i className="fas fa-crop"></i>
                              <span>Plot Size: {land['Default Plot Size'] || 'N/A'} acres</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="land-card-footer">
                          <button className="select-land-button">
                            <i className="fas fa-arrow-right"></i>
                            Select This Land
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  !loading && (
                    <div className="empty-state">
                      <i className="fas fa-map-marked-alt"></i>
                      <h3>No Lands Available</h3>
                      <p>There are currently no lands available for booking.</p>
                    </div>
                  )
                )}
              </div>
            )}
            
            {activeTab === 'booking' && selectedLand && (
              <CustomerPlotBooking 
                customerNo={customerNo}
                land={selectedLand}
                onBookingSuccess={handleBookingSuccess}
                onBack={() => {
                  setActiveTab('lands');
                  setSelectedLand(null);
                }}
              />
            )}
          </div>
        </div>

        <style jsx>{`
          .customer-booking {
            min-height: calc(100vh - 140px);
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            padding: 1rem;
          }

          .booking-container {
            max-width: 1200px;
            margin: 0 auto;
          }

          /* Customer Info Section */
          .customer-info-section {
            margin-bottom: 1.5rem;
          }

          .customer-info-card {
            display: flex;
            align-items: center;
            gap: 1rem;
            background: linear-gradient(135deg, #7A1F23 0%, #5a1519 100%);
            color: white;
            padding: 1.5rem;
            border-radius: 1rem;
            box-shadow: 0 8px 32px rgba(122, 31, 35, 0.2);
          }

          .customer-icon {
            width: 3rem;
            height: 3rem;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.25rem;
            flex-shrink: 0;
          }

          .customer-details {
            flex: 1;
          }

          .customer-details .customer-id {
            font-size: 1.1rem;
            font-weight: 600;
            margin-bottom: 0.25rem;
          }

          .customer-details .booking-step {
            opacity: 0.9;
            font-size: 0.9rem;
          }

          /* Rest of the CSS remains the same as your original */
          .error-message {
            background: #fef2f2;
            color: #dc2626;
            padding: 1rem;
            border-radius: 0.75rem;
            border: 1px solid #fecaca;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 1.5rem;
            position: relative;
          }

          .error-text {
            flex: 1;
          }

          .close-error {
            background: none;
            border: none;
            color: #dc2626;
            cursor: pointer;
            padding: 0.25rem;
            margin-left: auto;
            flex-shrink: 0;
          }

          /* Navigation Tabs */
          .booking-navigation {
            margin-bottom: 1.5rem;
          }

          .nav-tabs {
            display: flex;
            background: white;
            padding: 0.5rem;
            border-radius: 0.75rem;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            border: 1px solid #e5e7eb;
            flex-wrap: wrap;
          }

          .nav-tab {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.875rem 1rem;
            border: none;
            background: transparent;
            color: #6b7280;
            font-weight: 600;
            cursor: pointer;
            border-radius: 0.5rem;
            transition: all 0.3s ease;
            position: relative;
            min-width: 140px;
          }

          .nav-tab:hover:not(:disabled) {
            background: #f8fafc;
            color: #374151;
          }

          .nav-tab.active {
            background: linear-gradient(135deg, #7A1F23, #5a1519);
            color: white;
            box-shadow: 0 2px 8px rgba(122, 31, 35, 0.3);
          }

          .nav-tab:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .tab-label {
            white-space: nowrap;
          }

          .tab-hint {
            position: absolute;
            top: -0.25rem;
            right: -0.25rem;
            background: #F5B800;
            color: #7A1F23;
            padding: 0.125rem 0.375rem;
            border-radius: 1rem;
            font-size: 0.7rem;
            font-weight: 600;
            white-space: nowrap;
          }

          /* Lands Section */
          .lands-section {
            background: white;
            border-radius: 1rem;
            padding: 1.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            border: 1px solid #e5e7eb;
          }

          .section-header {
            text-align: center;
            margin-bottom: 1.5rem;
          }

          .section-header h2 {
            color: #1f2937;
            font-size: clamp(1.25rem, 3vw, 1.75rem);
            font-weight: 700;
            margin-bottom: 0.5rem;
            line-height: 1.3;
          }

          .section-header p {
            color: #6b7280;
            margin: 0;
            font-size: clamp(0.9rem, 2vw, 1rem);
            line-height: 1.4;
          }

          .lands-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(min(100%, 350px), 1fr));
            gap: 1.25rem;
          }

          .land-card {
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
            border-radius: 1rem;
            padding: 1.25rem;
            border: 2px solid #e5e7eb;
            transition: all 0.3s ease;
            cursor: pointer;
            height: fit-content;
          }

          .land-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
            border-color: #7A1F23;
          }

          .land-card-header {
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
            margin-bottom: 1rem;
          }

          .land-icon {
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 0.75rem;
            background: linear-gradient(135deg, #7A1F23, #F5B800);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.1rem;
            flex-shrink: 0;
          }

          .land-title {
            flex: 1;
            min-width: 0;
          }

          .land-title h3 {
            margin: 0 0 0.25rem 0;
            color: #1f2937;
            font-size: clamp(1.1rem, 2.5vw, 1.25rem);
            font-weight: 600;
            line-height: 1.3;
            word-wrap: break-word;
          }

          .land-code {
            color: #6b7280;
            font-size: 0.8rem;
            font-weight: 500;
            word-break: break-all;
          }

          .status-badge {
            padding: 0.25rem 0.5rem;
            border-radius: 2rem;
            font-size: 0.7rem;
            font-weight: 600;
            text-transform: uppercase;
            white-space: nowrap;
            flex-shrink: 0;
          }

          .status-badge.available {
            background: #dcfce7;
            color: #166534;
          }

          .status-badge.unavailable {
            background: #fef2f2;
            color: #dc2626;
          }

          .land-card-body {
            margin-bottom: 1.25rem;
          }

          .land-details {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }

          .detail-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            color: #4b5563;
            font-size: 0.85rem;
          }

          .detail-item i {
            color: #7A1F23;
            width: 1rem;
            flex-shrink: 0;
          }

          .detail-item span {
            word-break: break-word;
          }

          .land-card-footer {
            display: flex;
            justify-content: center;
          }

          .select-land-button {
            background: linear-gradient(135deg, #7A1F23, #5a1519);
            color: white;
            border: none;
            padding: 0.75rem 1.25rem;
            border-radius: 0.75rem;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.3s ease;
            font-size: 0.9rem;
            white-space: nowrap;
            width: 100%;
            justify-content: center;
          }

          .select-land-button:hover {
            background: linear-gradient(135deg, #5a1519, #7A1F23);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(122, 31, 35, 0.3);
          }

          /* Loading and Empty States */
          .loading-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 3rem 1rem;
            text-align: center;
          }

          .loading-spinner {
            font-size: 2rem;
            color: #7A1F23;
            margin-bottom: 1rem;
          }

          .loading-state p {
            color: #6b7280;
            margin: 0;
            font-size: 1rem;
          }

          .empty-state {
            text-align: center;
            padding: 3rem 1rem;
            color: #6b7280;
          }

          .empty-state i {
            font-size: clamp(2.5rem, 8vw, 3rem);
            color: #d1d5db;
            margin-bottom: 1rem;
          }

          .empty-state h3 {
            font-size: clamp(1.1rem, 3vw, 1.5rem);
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: #374151;
          }

          .empty-state p {
            font-size: clamp(0.9rem, 2vw, 1rem);
            margin: 0;
            line-height: 1.4;
          }

          .error-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 3rem 1rem;
            text-align: center;
          }

          .error-icon {
            font-size: clamp(2.5rem, 8vw, 3rem);
            color: #ef4444;
            margin-bottom: 1.5rem;
          }

          .error-state h2 {
            color: #1f2937;
            margin-bottom: 1rem;
            font-size: clamp(1.25rem, 3vw, 1.5rem);
          }

          .error-state p {
            color: #6b7280;
            margin-bottom: 2rem;
            max-width: 400px;
            font-size: clamp(0.9rem, 2vw, 1rem);
            line-height: 1.4;
          }

          .primary-button {
            background: linear-gradient(135deg, #7A1F23, #5a1519);
            color: white;
            border: none;
            padding: 0.875rem 1.5rem;
            border-radius: 0.75rem;
            font-weight: 600;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.3s ease;
            font-size: 0.9rem;
            white-space: nowrap;
          }

          .primary-button:hover {
            background: linear-gradient(135deg, #5a1519, #7A1F23);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(122, 31, 35, 0.3);
          }

          /* Mobile-first Responsive Design */
          @media (max-width: 768px) {
            .customer-booking {
              padding: 0.75rem;
              min-height: calc(100vh - 120px);
            }

            .customer-info-card {
              flex-direction: column;
              text-align: center;
              gap: 1rem;
            }

            .nav-tabs {
              flex-direction: column;
              gap: 0.25rem;
            }

            .nav-tab {
              min-width: auto;
              justify-content: flex-start;
            }

            .lands-grid {
              grid-template-columns: 1fr;
              gap: 1rem;
            }

            .lands-section {
              padding: 1.25rem;
            }

            .land-card-header {
              flex-direction: column;
              align-items: flex-start;
              gap: 0.75rem;
            }

            .status-badge {
              align-self: flex-start;
            }
          }

          @media (max-width: 480px) {
            .customer-info-card {
              padding: 1rem;
            }

            .lands-section {
              padding: 1rem;
            }

            .land-card {
              padding: 1rem;
            }

            .select-land-button {
              padding: 0.875rem 1rem;
              font-size: 0.85rem;
            }
          }
        `}</style>
      </div>
    </PublicLayout>
  );
};

export default CustomerBooking;