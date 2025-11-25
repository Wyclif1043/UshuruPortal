// src/pages/Investments.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { authService } from '../services/authService';
import BookedPlots from '../components/investments/BookedPlots';
import AvailableLands from '../components/investments/AvailableLands';
import PlotModal from '../components/investments/PlotModal';

const Investments = () => {
  const { memberNumber, profile } = useSelector((state) => state.auth);
  const [accountDetails, setAccountDetails] = useState(null);
  const [activeTab, setActiveTab] = useState('booked');
  const [bookedPlots, setBookedPlots] = useState([]);
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedLand, setSelectedLand] = useState(null);
  const [showPlotModal, setShowPlotModal] = useState(false);

  // Load account details first
  useEffect(() => {
    const loadAccountDetails = async () => {
      if (!memberNumber) return;
      
      try {
        const response = await authService.getMemberAccountDetails(memberNumber);
        setAccountDetails(response);
      } catch (err) {
        console.error('Error loading account details:', err);
      }
    };

    loadAccountDetails();
  }, [memberNumber]);

  // Load booked plots and lands when component mounts
  useEffect(() => {
    if (accountDetails || memberNumber) {
      loadBookedPlots();
      loadLands();
    }
  }, [accountDetails, memberNumber]);

  const loadBookedPlots = async () => {
    setLoading(true);
    try {
      const memberNo = accountDetails?.member_no || memberNumber;
      const response = await authService.getMemberBookedPlots(memberNo);
      if (response.success) {
        setBookedPlots(response.bookedPlots || []);
      } else {
        setError('Failed to load booked plots');
      }
    } catch (err) {
      setError('Error loading booked plots');
      console.error('Error loading booked plots:', err);
    } finally {
      setLoading(false);
    }
  };

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

  const handleViewPlots = (land) => {
    setSelectedLand(land);
    setShowPlotModal(true);
  };

  const handlePlotBooked = () => {
    loadBookedPlots();
    setShowPlotModal(false);
    setSelectedLand(null);
  };

  const generateBookingNumber = () => {
    const lastNumber = bookedPlots.reduce((max, plot) => {
      if (plot.bookingNo && plot.bookingNo.startsWith('B')) {
        const num = parseInt(plot.bookingNo.substring(1));
        return Math.max(max, num);
      }
      return max;
    }, 0);
    
    return `B${String(lastNumber + 1).padStart(3, '0')}`;
  };

  const tabs = [
    { id: 'booked', label: 'My Booked Plots', icon: 'fas fa-map-marked-alt' },
    { id: 'available', label: 'Available Lands', icon: 'fas fa-globe-africa' }
  ];

  return (
    <div className="investments-page">
      <div className="investments-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="page-title">Land Investments</h1>
            <p className="page-subtitle">Manage your plot bookings and explore available investment opportunities</p>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-map-marked-alt"></i>
              </div>
              <div className="stat-info">
                <span className="stat-value">{bookedPlots.length}</span>
                <span className="stat-label">Booked Plots</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-globe-africa"></i>
              </div>
              <div className="stat-info">
                <span className="stat-value">{lands.length}</span>
                <span className="stat-label">Available Lands</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="investments-content">
        {error && (
          <div className="error-banner">
            <div className="error-content">
              <i className="fas fa-exclamation-triangle"></i>
              <span>{error}</span>
              <button onClick={() => setError('')} className="close-error">
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        )}

        <div className="investments-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <i className={tab.icon}></i>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="tab-content">
          {loading && (
            <div className="loading-state">
              <div className="loading-spinner">
                <i className="fas fa-spinner fa-spin"></i>
              </div>
              <p>Loading investment data...</p>
            </div>
          )}
          
          {!loading && activeTab === 'booked' && (
            <BookedPlots 
              plots={bookedPlots} 
              onRefresh={loadBookedPlots}
              loading={loading}
            />
          )}
          
          {!loading && activeTab === 'available' && (
            <AvailableLands 
              lands={lands}
              loading={loading}
              onViewPlots={handleViewPlots}
            />
          )}
        </div>
      </div>

      {/* Plot Modal */}
      {showPlotModal && selectedLand && (
        <PlotModal
          land={selectedLand}
          memberNo={accountDetails?.member_no || memberNumber}
          memberName={accountDetails?.name || profile?.FullName}
          onClose={() => {
            setShowPlotModal(false);
            setSelectedLand(null);
          }}
          onPlotBooked={handlePlotBooked}
          generateBookingNumber={generateBookingNumber}
        />
      )}

      <style jsx>{`
        .investments-page {
          min-height: 100vh;
          background: #f8fafc;
        }

        .investments-header {
          background: linear-gradient(135deg, #7A1F23 0%, #5a1519 100%);
          color: white;
          padding: 2rem 1.5rem;
          box-shadow: 0 4px 20px rgba(122, 31, 35, 0.1);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          max-width: 1200px;
          margin: 0 auto;
          gap: 2rem;
        }

        .header-text {
          flex: 1;
        }

        .page-title {
          font-size: clamp(1.75rem, 4vw, 2rem);
          font-weight: 700;
          margin-bottom: 0.5rem;
          line-height: 1.2;
        }

        .page-subtitle {
          font-size: clamp(0.9rem, 2vw, 1.1rem);
          opacity: 0.9;
          margin: 0;
          line-height: 1.4;
        }

        .header-stats {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(255, 255, 255, 0.1);
          padding: 1rem;
          border-radius: 12px;
          backdrop-filter: blur(10px);
          min-width: 140px;
        }

        .stat-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: rgba(245, 184, 0, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F5B800;
          font-size: 1.1rem;
          flex-shrink: 0;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 1.375rem;
          font-weight: 700;
          line-height: 1;
        }

        .stat-label {
          font-size: 0.8rem;
          opacity: 0.8;
          white-space: nowrap;
        }

        .investments-content {
          padding: 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .error-banner {
          background: #FEF2F2;
          border: 1px solid #FECACA;
          color: #DC2626;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
        }

        .error-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .close-error {
          background: none;
          border: none;
          color: #DC2626;
          cursor: pointer;
          margin-left: auto;
          padding: 0.25rem;
        }

        .investments-tabs {
          display: flex;
          background: white;
          border-radius: 12px;
          padding: 0.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          flex-wrap: wrap;
        }

        .tab-button {
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
          border-radius: 8px;
          transition: all 0.3s ease;
          min-width: 140px;
        }

        .tab-button:hover {
          color: #7A1F23;
          background: #f9fafb;
        }

        .tab-button.active {
          background: #7A1F23;
          color: white;
          box-shadow: 0 2px 8px rgba(122, 31, 35, 0.2);
        }

        .tab-label {
          white-space: nowrap;
        }

        .tab-content {
          min-height: 400px;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 1rem;
          color: #6b7280;
          text-align: center;
        }

        .loading-spinner {
          font-size: 2rem;
          color: #7A1F23;
          margin-bottom: 1rem;
        }

        /* Mobile-first Responsive Design */
        @media (max-width: 768px) {
          .investments-header {
            padding: 1.5rem 1rem;
          }

          .header-content {
            flex-direction: column;
            gap: 1.5rem;
            text-align: center;
          }

          .investments-content {
            padding: 1rem;
          }

          .header-stats {
            width: 100%;
            justify-content: center;
          }

          .stat-card {
            flex: 1;
            min-width: 120px;
            justify-content: center;
          }

          .investments-tabs {
            flex-direction: column;
            gap: 0.25rem;
          }

          .tab-button {
            justify-content: flex-start;
            min-width: auto;
          }

          .stat-icon {
            width: 40px;
            height: 40px;
            font-size: 1rem;
          }

          .stat-value {
            font-size: 1.25rem;
          }
        }

        @media (max-width: 480px) {
          .investments-header {
            padding: 1.25rem 0.75rem;
          }

          .investments-content {
            padding: 0.75rem;
          }

          .page-title {
            font-size: 1.5rem;
          }

          .page-subtitle {
            font-size: 0.9rem;
          }

          .stat-card {
            padding: 0.75rem;
            gap: 0.5rem;
          }

          .stat-icon {
            width: 36px;
            height: 36px;
          }

          .stat-value {
            font-size: 1.125rem;
          }

          .stat-label {
            font-size: 0.75rem;
          }

          .tab-button {
            padding: 0.75rem;
            font-size: 0.9rem;
          }
        }

        @media (max-width: 360px) {
          .header-stats {
            flex-direction: column;
            align-items: center;
          }

          .stat-card {
            width: 100%;
            max-width: 200px;
          }

          .tab-button {
            font-size: 0.85rem;
          }
        }

        /* Large screens */
        @media (min-width: 1440px) {
          .investments-header,
          .investments-content {
            max-width: 1400px;
          }
        }
      `}</style>
    </div>
  );
};

export default Investments;