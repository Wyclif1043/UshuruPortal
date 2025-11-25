// src/components/investments/BookedPlots.jsx
import React from 'react';

const BookedPlots = ({ plots, onRefresh, loading }) => {
  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
        </div>
        <p>Loading your booked plots...</p>
      </div>
    );
  }

  if (!plots || plots.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <i className="fas fa-map-marked-alt"></i>
        </div>
        <h3>No Plots Booked Yet</h3>
        <p>Start your investment journey by exploring our available lands and booking your first plot!</p>
        <button className="cta-button">
          <i className="fas fa-globe-africa"></i>
          Explore Lands
        </button>
      </div>
    );
  }

  return (
    <div className="booked-plots">
      <div className="section-header">
        <div className="section-title">
          <h2>My Booked Plots</h2>
          <p className="section-subtitle">Manage your land investments and track payments</p>
        </div>
        <button onClick={onRefresh} className="refresh-button">
          <i className="fas fa-sync-alt"></i>
          Refresh
        </button>
      </div>

      <div className="plots-grid">
        {plots.map((plot, index) => (
          <div key={index} className="plot-card">
            <div className="plot-header">
              <div className="plot-title">
                <h3>Plot {plot.plotCode}</h3>
                <span className="plot-land">Land: {plot.landCode}</span>
              </div>
              <span className={`status-badge status-${plot.bookingStatus.toLowerCase()}`}>
                {plot.bookingStatus}
              </span>
            </div>
            
            <div className="plot-details">
              <div className="detail-group">
                <div className="detail-item">
                  <label>Booking Number:</label>
                  <span className="detail-value">{plot.bookingNo || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <label>Booking Date:</label>
                  <span className="detail-value">{plot.bookingDate}</span>
                </div>
              </div>
              
              <div className="detail-group">
                <div className="detail-item">
                  <label>Booking Fee:</label>
                  <span className="detail-value amount">KSh {plot.bookingFee}</span>
                </div>
                <div className="detail-item">
                  <label>Total Paid:</label>
                  <span className="detail-value amount">KSh {plot.totalPaid}</span>
                </div>
              </div>
              
              {plot.totalPaid < plot.bookingFee && (
                <div className="payment-remaining">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${(plot.totalPaid / plot.bookingFee) * 100}%` }}
                    ></div>
                  </div>
                  <span className="remaining-text">
                    KSh {plot.bookingFee - plot.totalPaid} remaining
                  </span>
                </div>
              )}
            </div>

            <div className="plot-actions">
              <button className="action-button secondary">
                <i className="fas fa-info-circle"></i>
                Details
              </button>
              {plot.totalPaid < plot.bookingFee && (
                <button className="action-button primary">
                  <i className="fas fa-credit-card"></i>
                  Make Payment
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookedPlots;