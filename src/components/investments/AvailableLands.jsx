// src/components/investments/AvailableLands.jsx
import React, { useState } from 'react';
import PlotModal from './PlotModal';

const AvailableLands = ({ lands, loading, onViewPlots, memberNo, memberName }) => {
  const [imageErrors, setImageErrors] = useState({});
  const [selectedLand, setSelectedLand] = useState(null);
  const [showPlotModal, setShowPlotModal] = useState(false);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
        </div>
        <p>Loading available lands...</p>
      </div>
    );
  }

  if (!lands || lands.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <i className="fas fa-globe-africa"></i>
        </div>
        <h3>No Lands Available</h3>
        <p>There are currently no lands available for investment.</p>
      </div>
    );
  }

  const handleImageError = (landId) => {
    setImageErrors(prev => ({ ...prev, [landId]: true }));
  };

  // Function to convert base64 data URL to proper image URL
  const getImageUrl = (land) => {
    const landCode = land['Land Code'];
    
    // If image already failed to load, show placeholder
    if (imageErrors[landCode]) {
      return null;
    }

    // Check if we have base64 data
    const imageData = land['Land Image'];
    if (imageData && imageData.startsWith('/9j/')) {
      return `data:image/jpeg;base64,${imageData}`;
    }
    
    return null;
  };

  const handleViewPlots = (land) => {
    setSelectedLand(land);
    setShowPlotModal(true);
    // Call the parent's onViewPlots if needed
    if (onViewPlots) {
      onViewPlots(land);
    }
  };

  const handleCloseModal = () => {
    setShowPlotModal(false);
    setSelectedLand(null);
  };

  const handlePlotBooked = () => {
    // Handle successful plot booking
    console.log('Plot booked successfully');
    // You can add additional logic here like showing a success message
    setTimeout(() => {
      handleCloseModal();
    }, 2000);
  };

  // Generate booking number
  const generateBookingNumber = () => {
    const prefix = 'BK';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  };

  return (
    <div className="available-lands">
      <div className="section-header">
        <h2>Available Lands for Investment</h2>
        <p className="section-subtitle">Explore our premium land offerings across different regions</p>
      </div>
      
      <div className="lands-grid">
        {lands.map((land, index) => {
          const landCode = land['Land Code'];
          const imageUrl = getImageUrl(land);
          const hasImageError = imageErrors[landCode];
          
          return (
            <div key={landCode || index} className="land-card">
              <div className="land-card-header">
                <div className="land-badge">
                  <i className="fas fa-map-marker-alt"></i>
                  {land.Region || 'Unknown Region'}
                </div>
                <span className={`status-badge status-${land.Status?.toLowerCase() || 'unknown'}`}>
                  {land.Status || 'Unknown'}
                </span>
              </div>
              
              {/* Land Image Section */}
              <div className="land-image-container">
                {imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt={land.Description || 'Land image'}
                    className="land-image"
                    onError={() => handleImageError(landCode)}
                    loading="lazy"
                  />
                ) : (
                  <div className="land-image-placeholder">
                    <i className="fas fa-mountain"></i>
                    <span>Land Preview</span>
                  </div>
                )}
                <div className="land-image-overlay">
                  <span className="land-code-overlay">Code: {landCode}</span>
                </div>
              </div>
              
              <div className="land-card-body">
                <h3 className="land-name">{land.Description || 'Unnamed Land'}</h3>
                <p className="land-location">
                  <i className="fas fa-map-pin"></i>
                  {land.Region || 'Unknown'} Region
                </p>
                
                <div className="land-stats">
                  <div className="land-stat">
                    <div className="stat-icon">
                      <i className="fas fa-expand-arrows-alt"></i>
                    </div>
                    <div className="stat-info">
                      <span className="stat-value">{land['Total Area'] || 0} acres</span>
                      <span className="stat-label">Total Area</span>
                    </div>
                  </div>
                  
                  <div className="land-stat">
                    <div className="stat-icon">
                      <i className="fas fa-flag"></i>
                    </div>
                    <div className="stat-info">
                      <span className="stat-value">{land['Available Area'] || 0} acres</span>
                      <span className="stat-label">Available</span>
                    </div>
                  </div>
                  
                  <div className="land-stat">
                    <div className="stat-icon">
                      <i className="fas fa-crop-alt"></i>
                    </div>
                    <div className="stat-info">
                      <span className="stat-value">{land['Default Plot Size'] || 0} acres</span>
                      <span className="stat-label">Plot Size</span>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                {land['Title Deed No'] && (
                  <div className="land-additional-info">
                    <div className="additional-info-item">
                      <i className="fas fa-file-contract"></i>
                      <span>Title: {land['Title Deed No']}</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="land-card-footer">
                <button 
                  className="view-plots-button"
                  onClick={() => handleViewPlots(land)}
                >
                  <i className="fas fa-eye"></i>
                  View Available Plots
                </button>
                <button 
                  className="details-button"
                  onClick={() => {
                    // You can add a modal or expand details here
                    console.log('View details for:', land);
                  }}
                >
                  <i className="fas fa-info-circle"></i>
                  Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Plot Modal */}
      {showPlotModal && selectedLand && (
        <PlotModal
          land={selectedLand}
          memberNo={memberNo}
          memberName={memberName}
          onClose={handleCloseModal}
          onPlotBooked={handlePlotBooked}
          generateBookingNumber={generateBookingNumber}
        />
      )}

      <style jsx>{`
        .available-lands {
          padding: 0;
        }

        .section-header {
          margin-bottom: 2rem;
          text-align: center;
        }

        .section-header h2 {
          font-size: clamp(1.25rem, 3vw, 1.5rem);
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
          line-height: 1.3;
        }

        .section-subtitle {
          color: #6b7280;
          font-size: clamp(0.9rem, 2vw, 1rem);
          margin: 0;
          line-height: 1.4;
        }

        .lands-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 350px), 1fr));
          gap: 1.5rem;
        }

        .land-card {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #e5e7eb;
          transition: all 0.3s ease;
          position: relative;
          height: fit-content;
        }

        .land-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(122, 31, 35, 0.15);
          border-color: #7A1F23;
        }

        .land-card:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(135deg, #7A1F23, #F5B800);
          z-index: 1;
        }

        .land-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 1rem 1.25rem 0.5rem;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .land-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(122, 31, 35, 0.1);
          color: #7A1F23;
          padding: 0.5rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          white-space: nowrap;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        .status-active {
          background: #DCFCE7;
          color: #16A34A;
        }

        .status-available {
          background: #DCFCE7;
          color: #16A34A;
        }

        .status-unavailable {
          background: #FEE2E2;
          color: #DC2626;
        }

        .status-pending {
          background: #FEF3C7;
          color: #D97706;
        }

        .status-unknown {
          background: #F3F4F6;
          color: #6B7280;
        }

        /* Land Image Section */
        .land-image-container {
          position: relative;
          height: 200px;
          overflow: hidden;
          margin: 0 1.25rem;
          border-radius: 12px;
          background: #f3f4f6;
        }

        .land-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .land-card:hover .land-image {
          transform: scale(1.05);
        }

        .land-image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
          background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
        }

        .land-image-placeholder i {
          font-size: 3rem;
          margin-bottom: 0.5rem;
          opacity: 0.5;
        }

        .land-image-placeholder span {
          font-size: 0.875rem;
          font-weight: 500;
        }

        .land-image-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
          padding: 1rem;
          color: white;
          display: flex;
          justify-content: flex-end;
        }

        .land-code-overlay {
          background: rgba(122, 31, 35, 0.9);
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .land-card-body {
          padding: 1.25rem;
          margin-bottom: 1rem;
        }

        .land-name {
          font-size: clamp(1.1rem, 2.5vw, 1.25rem);
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.5rem;
          line-height: 1.3;
          word-wrap: break-word;
        }

        .land-location {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #6b7280;
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
        }

        .land-location i {
          color: #7A1F23;
        }

        .land-stats {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .land-stat {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(122, 31, 35, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #7A1F23;
          flex-shrink: 0;
        }

        .stat-info {
          flex: 1;
          min-width: 0;
        }

        .stat-value {
          display: block;
          font-weight: 600;
          color: #1f2937;
          font-size: 0.95rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .stat-label {
          display: block;
          color: #6b7280;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        .land-additional-info {
          border-top: 1px solid #e5e7eb;
          padding-top: 1rem;
        }

        .additional-info-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .additional-info-item i {
          color: #7A1F23;
          width: 16px;
        }

        .land-card-footer {
          display: flex;
          gap: 0.75rem;
          padding: 0 1.25rem 1.25rem;
        }

        .view-plots-button {
          flex: 1;
          background: linear-gradient(135deg, #7A1F23, #5a1519);
          color: white;
          border: none;
          padding: 0.75rem 1.25rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          font-size: 0.875rem;
          white-space: nowrap;
        }

        .view-plots-button:hover {
          background: linear-gradient(135deg, #5a1519, #7A1F23);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(122, 31, 35, 0.3);
        }

        .details-button {
          flex: 0 0 auto;
          background: transparent;
          color: #7A1F23;
          border: 1px solid #7A1F23;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          font-size: 0.875rem;
          white-space: nowrap;
        }

        .details-button:hover {
          background: rgba(122, 31, 35, 0.1);
        }

        /* Empty and Loading States */
        .empty-state {
          text-align: center;
          padding: 3rem 1rem;
          color: #6b7280;
        }

        .empty-icon {
          font-size: clamp(3rem, 10vw, 4rem);
          color: #d1d5db;
          margin-bottom: 1rem;
        }

        .empty-state h3 {
          font-size: clamp(1.25rem, 3vw, 1.5rem);
          font-weight: 600;
          margin-bottom: 1rem;
          color: #374151;
        }

        .empty-state p {
          font-size: clamp(0.9rem, 2vw, 1rem);
          margin-bottom: 2rem;
          line-height: 1.4;
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
          .lands-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .land-card-header {
            padding: 0.875rem 1rem 0.5rem;
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
          
          .land-image-container {
            margin: 0 1rem;
            height: 180px;
          }
          
          .land-card-body {
            padding: 1rem;
          }

          .land-card-footer {
            padding: 0 1rem 1rem;
            flex-direction: column;
            gap: 0.5rem;
          }

          .view-plots-button,
          .details-button {
            width: 100%;
          }

          .section-header {
            margin-bottom: 1.5rem;
            text-align: left;
          }
        }

        @media (max-width: 480px) {
          .land-card {
            border-radius: 12px;
          }
          
          .land-image-container {
            height: 160px;
            margin: 0 0.875rem;
            border-radius: 8px;
          }

          .land-name {
            font-size: 1.1rem;
          }

          .land-stat {
            gap: 0.5rem;
          }

          .stat-icon {
            width: 36px;
            height: 36px;
            font-size: 0.9rem;
          }

          .view-plots-button,
          .details-button {
            padding: 0.875rem 1rem;
            font-size: 0.85rem;
          }
        }

        @media (max-width: 360px) {
          .land-card {
            padding: 0.875rem;
          }

          .land-image-container {
            height: 140px;
          }

          .land-stats {
            gap: 0.5rem;
          }

          .stat-icon {
            width: 32px;
            height: 32px;
          }

          .stat-value {
            font-size: 0.9rem;
          }
        }

        /* Large screens */
        @media (min-width: 1200px) {
          .lands-grid {
            grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
          }

          .land-image-container {
            height: 220px;
          }
        }

        /* Animation for image loading */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .land-image {
          animation: fadeIn 0.5s ease-in;
        }
      `}</style>
    </div>
  );
};

export default AvailableLands;