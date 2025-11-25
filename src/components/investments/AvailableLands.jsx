// src/components/investments/AvailableLands.jsx
import React from 'react';

const AvailableLands = ({ lands, loading, onViewPlots }) => {
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

  return (
    <div className="available-lands">
      <div className="section-header">
        <h2>Available Lands for Investment</h2>
        <p className="section-subtitle">Explore our premium land offerings across different regions</p>
      </div>
      
      <div className="lands-grid">
        {lands.map((land, index) => (
          <div key={index} className="land-card">
            <div className="land-card-header">
              <div className="land-badge">
                <i className="fas fa-map-marker-alt"></i>
                {land.Region}
              </div>
              <span className={`status-badge status-${land.Status?.toLowerCase()}`}>
                {land.Status}
              </span>
            </div>
            
            <div className="land-card-body">
              <h3 className="land-name">{land.Description}</h3>
              <p className="land-code">Land Code: {land['Land Code']}</p>
              
              <div className="land-stats">
                <div className="land-stat">
                  <div className="stat-icon">
                    <i className="fas fa-expand-arrows-alt"></i>
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">{land['Total Area']} acres</span>
                    <span className="stat-label">Total Area</span>
                  </div>
                </div>
                
                <div className="land-stat">
                  <div className="stat-icon">
                    <i className="fas fa-flag"></i>
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">{land['Available Area']} acres</span>
                    <span className="stat-label">Available</span>
                  </div>
                </div>
                
                <div className="land-stat">
                  <div className="stat-icon">
                    <i className="fas fa-crop-alt"></i>
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">{land['Default Plot Size']} acres</span>
                    <span className="stat-label">Plot Size</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="land-card-footer">
              <button 
                className="view-plots-button"
                onClick={() => onViewPlots(land)}
              >
                <i className="fas fa-eye"></i>
                View Available Plots
              </button>
            </div>
          </div>
        ))}
      </div>

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
          gap: 1.25rem;
        }

        .land-card {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #e5e7eb;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
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
        }

        .land-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
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

        .land-card-body {
          margin-bottom: 1.5rem;
        }

        .land-name {
          font-size: clamp(1.1rem, 2.5vw, 1.25rem);
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.5rem;
          line-height: 1.3;
          word-wrap: break-word;
        }

        .land-code {
          color: #6b7280;
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
          word-break: break-all;
        }

        .land-stats {
          display: flex;
          flex-direction: column;
          gap: 1rem;
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

        .land-card-footer {
          display: flex;
          justify-content: flex-end;
        }

        .view-plots-button {
          background: linear-gradient(135deg, #7A1F23, #5a1519);
          color: white;
          border: none;
          padding: 0.75rem 1.25rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          font-size: 0.875rem;
          white-space: nowrap;
          width: 100%;
          justify-content: center;
        }

        .view-plots-button:hover {
          background: linear-gradient(135deg, #5a1519, #7A1F23);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(122, 31, 35, 0.3);
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
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
          
          .land-stats {
            gap: 0.75rem;
          }

          .land-card {
            padding: 1.25rem;
          }

          .section-header {
            margin-bottom: 1.5rem;
            text-align: left;
          }
        }

        @media (max-width: 480px) {
          .land-card {
            padding: 1rem;
            border-radius: 12px;
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

          .view-plots-button {
            padding: 0.875rem 1rem;
            font-size: 0.85rem;
          }
        }

        @media (max-width: 360px) {
          .land-card {
            padding: 0.875rem;
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
        }
      `}</style>
    </div>
  );
};

export default AvailableLands;