// src/components/investments/PlotModal.jsx
import React, { useState, useEffect } from 'react';
import { authService } from '../../services/authService';

const PlotModal = ({ land, memberNo, memberName, onClose, onPlotBooked, generateBookingNumber }) => {
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    bookingNo: '',
    buyerName: '',
    bookingDate: new Date().toISOString().split('T')[0],
    bookingFee: ''
  });

  useEffect(() => {
    const loadPlots = async () => {
      setLoading(true);
      try {
        const response = await authService.getPlotsByLand(land['Land Code']);
        if (response.success) {
          setPlots(response.plots || []);
        }
      } catch (err) {
        console.error('Error loading plots:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPlots();
  }, [land]);

  const handleBookPlot = (plot) => {
    setSelectedPlot(plot);
    setFormData(prev => ({
      ...prev,
      bookingNo: generateBookingNumber(),
      buyerName: memberName || '',
      bookingFee: plot['Member Price'] || ''
    }));
    setShowBookingForm(true);
    setMessage('');
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setMessage('');

    try {
      const bookingData = {
        ...formData,
        landCode: land['Land Code'],
        plotCode: selectedPlot['Plot Code.'],
        memberNo: memberNo,
        bookingFee: parseFloat(formData.bookingFee)
      };

      const response = await authService.bookPlot(bookingData);
      
      if (response.success) {
        setMessage('Plot booked successfully!');
        setTimeout(() => {
          onPlotBooked();
        }, 1500);
      } else {
        setMessage(response.error || 'Failed to book plot');
      }
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error booking plot');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'available': return 'available';
      case 'booked': return 'booked';
      case 'sold': return 'sold';
      default: return 'unknown';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  return (
    <div className="plot-modal-overlay" onClick={onClose}>
      <div className="plot-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <h2>{showBookingForm ? 'Book Plot' : `Available Plots - ${land.Description}`}</h2>
            <p>
              {showBookingForm 
                ? `Plot: ${selectedPlot?.['Plot Code.']} | Land: ${land['Land Code']}`
                : `Land Code: ${land['Land Code']} | Region: ${land.Region}`
              }
            </p>
          </div>
          <button className="close-button" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-content">
          {showBookingForm ? (
            // Booking Form View
            <div className="booking-form-view">
              <div className="plot-summary">
                <h3>Plot Details</h3>
                <div className="plot-info">
                  <div className="info-item">
                    <span className="label">Plot Code:</span>
                    <span className="value">{selectedPlot?.['Plot Code.']}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Area:</span>
                    <span className="value">{selectedPlot?.Area} acres</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Price:</span>
                    <span className="value price">{formatCurrency(selectedPlot?.['Member Price'])}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Land:</span>
                    <span className="value">{land.Description} ({land['Land Code']})</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleBookingSubmit} className="booking-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Booking Number:</label>
                    <input
                      type="text"
                      name="bookingNo"
                      value={formData.bookingNo}
                      onChange={handleInputChange}
                      required
                      readOnly
                      className="readonly-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Member Number:</label>
                    <input
                      type="text"
                      value={memberNo}
                      readOnly
                      className="readonly-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Buyer Name:</label>
                  <input
                    type="text"
                    name="buyerName"
                    value={formData.buyerName}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter buyer's full name"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Booking Date:</label>
                    <input
                      type="date"
                      name="bookingDate"
                      value={formData.bookingDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Booking Fee (KSh):</label>
                    <input
                      type="number"
                      name="bookingFee"
                      value={formData.bookingFee}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      placeholder="Enter booking fee amount"
                    />
                  </div>
                </div>

                {message && (
                  <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
                    <i className={`fas ${message.includes('success') ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
                    {message}
                  </div>
                )}

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="back-button"
                    onClick={() => setShowBookingForm(false)}
                    disabled={bookingLoading}
                  >
                    <i className="fas fa-arrow-left"></i>
                    Back to Plots
                  </button>
                  <button 
                    type="submit" 
                    className="submit-button"
                    disabled={bookingLoading}
                  >
                    {bookingLoading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        Booking Plot...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-map-marked-alt"></i>
                        Book Plot
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            // Plots List View
            <>
              {loading ? (
                <div className="loading-state">
                  <div className="loading-spinner">
                    <i className="fas fa-spinner fa-spin"></i>
                  </div>
                  <p>Loading available plots...</p>
                </div>
              ) : (
                <>
                  {message && (
                    <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
                      <i className={`fas ${message.includes('success') ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
                      {message}
                    </div>
                  )}

                  <div className="plots-grid">
                    {plots.map((plot, index) => (
                      <div key={index} className={`plot-card ${getStatusColor(plot['Plot Status'])}`}>
                        <div className="plot-card-header">
                          <h3 className="plot-code">{plot['Plot Code.']}</h3>
                          <span className={`status-badge status-${getStatusColor(plot['Plot Status'])}`}>
                            {plot['Plot Status']}
                          </span>
                        </div>

                        <div className="plot-card-body">
                          <div className="plot-details">
                            <div className="detail-item">
                              <span className="label">Area:</span>
                              <span className="value">{plot.Area} acres</span>
                            </div>
                            <div className="detail-item">
                              <span className="label">Member Price:</span>
                              <span className="value price">{formatCurrency(plot['Member Price'])}</span>
                            </div>
                            <div className="detail-item">
                              <span className="label">Non-Member:</span>
                              <span className="value">{formatCurrency(plot['Non Member Price'])}</span>
                            </div>
                          </div>
                        </div>

                        <div className="plot-card-footer">
                          {plot['Plot Status']?.toLowerCase() === 'available' ? (
                            <button
                              className="book-button"
                              onClick={() => handleBookPlot(plot)}
                            >
                              <i className="fas fa-map-marked-alt"></i>
                              Book This Plot
                            </button>
                          ) : (
                            <button className="book-button disabled" disabled>
                              {plot['Plot Status']}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {plots.length === 0 && (
                    <div className="empty-state">
                      <i className="fas fa-map-marked-alt"></i>
                      <h3>No Plots Available</h3>
                      <p>There are currently no plots available for this land.</p>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .plot-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
          overflow-y: auto;
        }

        .plot-modal {
          background: white;
          border-radius: 16px;
          width: 100%;
          max-width: ${showBookingForm ? 'min(600px, 95vw)' : 'min(900px, 95vw)'};
          max-height: 90vh;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: modalSlideIn 0.3s ease-out;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 1.5rem;
          background: linear-gradient(135deg, #7A1F23 0%, #5a1519 100%);
          color: white;
          gap: 1rem;
        }

        .modal-title {
          flex: 1;
          min-width: 0;
        }

        .modal-title h2 {
          margin: 0 0 0.5rem 0;
          font-size: clamp(1.25rem, 3vw, 1.5rem);
          font-weight: 700;
          line-height: 1.3;
          word-wrap: break-word;
        }

        .modal-title p {
          margin: 0;
          opacity: 0.9;
          font-size: clamp(0.8rem, 2vw, 0.9rem);
          line-height: 1.4;
          word-wrap: break-word;
        }

        .close-button {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .close-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(90deg);
        }

        .modal-content {
          padding: 1.5rem;
          max-height: calc(90vh - 120px);
          overflow-y: auto;
        }

        /* Booking Form Styles */
        .booking-form-view {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .plot-summary {
          background: #f8fafc;
          border-radius: 12px;
          padding: 1.25rem;
          border-left: 4px solid #7A1F23;
        }

        .plot-summary h3 {
          margin: 0 0 1rem 0;
          color: #1f2937;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .plot-info {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 0.75rem;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          gap: 0.5rem;
        }

        .info-item .label {
          color: #6b7280;
          font-weight: 500;
          font-size: 0.9rem;
          white-space: nowrap;
        }

        .info-item .value {
          color: #1f2937;
          font-weight: 600;
          font-size: 0.9rem;
          text-align: right;
          word-break: break-word;
        }

        .info-item .value.price {
          color: #7A1F23;
          font-size: 1rem;
        }

        .booking-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-weight: 600;
          color: #374151;
          font-size: 0.9rem;
        }

        .form-group input,
        .form-group select {
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
          width: 100%;
          box-sizing: border-box;
        }

        .form-group input:focus,
        .form-group select:focus {
          border-color: #7A1F23;
          box-shadow: 0 0 0 3px rgba(122, 31, 35, 0.1);
          outline: none;
        }

        .readonly-input {
          background: #f3f4f6;
          color: #6b7280;
          cursor: not-allowed;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 1rem;
          flex-wrap: wrap;
        }

        .back-button {
          background: transparent;
          color: #6b7280;
          border: 1px solid #d1d5db;
          padding: 0.75rem 1.25rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          font-size: 0.9rem;
          white-space: nowrap;
        }

        .back-button:hover:not(:disabled) {
          background: #f3f4f6;
        }

        .submit-button {
          background: linear-gradient(135deg, #7A1F23, #5a1519);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          font-size: 0.9rem;
          white-space: nowrap;
        }

        .submit-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #5a1519, #7A1F23);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(122, 31, 35, 0.3);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        /* Plots Grid Styles */
        .plots-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.25rem;
        }

        .plot-card {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border-radius: 12px;
          padding: 1.25rem;
          border: 2px solid #e5e7eb;
          transition: all 0.3s ease;
          height: fit-content;
        }

        .plot-card.available {
          border-color: #10B981;
        }

        .plot-card.booked {
          border-color: #F59E0B;
        }

        .plot-card.sold {
          border-color: #EF4444;
        }

        .plot-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .plot-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
          gap: 0.5rem;
        }

        .plot-code {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
          word-break: break-word;
        }

        .status-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .status-available {
          background: #DCFCE7;
          color: #16A34A;
        }

        .status-booked {
          background: #FEF3C7;
          color: #D97706;
        }

        .status-sold {
          background: #FEE2E2;
          color: #DC2626;
        }

        .plot-card-body {
          margin-bottom: 1.25rem;
        }

        .plot-details {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.5rem;
        }

        .detail-item .label {
          color: #6b7280;
          font-size: 0.8rem;
          font-weight: 500;
          white-space: nowrap;
        }

        .detail-item .value {
          color: #1f2937;
          font-weight: 600;
          font-size: 0.85rem;
          text-align: right;
        }

        .detail-item .value.price {
          color: #7A1F23;
          font-size: 0.9rem;
        }

        .plot-card-footer {
          display: flex;
          justify-content: center;
        }

        .book-button {
          background: linear-gradient(135deg, #7A1F23, #5a1519);
          color: white;
          border: none;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          width: 100%;
          justify-content: center;
          font-size: 0.85rem;
          white-space: nowrap;
        }

        .book-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #5a1519, #7A1F23);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(122, 31, 35, 0.3);
        }

        .book-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .book-button.disabled {
          background: #6b7280;
        }

        .book-button.disabled:hover {
          background: #6b7280;
          transform: none;
          box-shadow: none;
        }

        .message {
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .message.success {
          background: #DCFCE7;
          color: #16A34A;
          border: 1px solid #BBF7D0;
        }

        .message.error {
          background: #FEF2F2;
          color: #DC2626;
          border: 1px solid #FECACA;
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
          font-size: clamp(1.1rem, 3vw, 1.25rem);
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #374151;
        }

        /* Mobile-first Responsive Design */
        @media (max-width: 768px) {
          .plot-modal {
            margin: 0.5rem;
            max-height: 95vh;
          }

          .modal-header {
            padding: 1.25rem;
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }

          .modal-content {
            padding: 1.25rem;
            max-height: calc(95vh - 140px);
          }

          .plots-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }

          .form-actions {
            flex-direction: column-reverse;
          }

          .back-button,
          .submit-button {
            width: 100%;
            justify-content: center;
          }

          .plot-info {
            grid-template-columns: 1fr;
          }

          .info-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
          }

          .info-item .value {
            text-align: left;
          }
        }

        @media (max-width: 480px) {
          .plot-modal-overlay {
            padding: 0.5rem;
          }

          .plot-modal {
            margin: 0;
            border-radius: 12px;
          }

          .modal-header {
            padding: 1rem;
          }

          .modal-content {
            padding: 1rem;
          }

          .plot-card {
            padding: 1rem;
          }

          .plot-summary {
            padding: 1rem;
          }

          .plot-card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .plot-code {
            font-size: 1rem;
          }

          .book-button {
            padding: 0.875rem 0.75rem;
            font-size: 0.8rem;
          }
        }

        @media (max-width: 360px) {
          .modal-header {
            padding: 0.875rem;
          }

          .modal-content {
            padding: 0.875rem;
          }

          .plot-card {
            padding: 0.875rem;
          }

          .form-group input,
          .form-group select {
            padding: 0.675rem;
          }
        }

        /* Large screens */
        @media (min-width: 1200px) {
          .plots-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          }
        }

        /* Touch device improvements */
        @media (hover: none) {
          .plot-card:hover {
            transform: none;
          }

          .book-button:hover {
            transform: none;
          }

          .submit-button:hover {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
};

export default PlotModal;