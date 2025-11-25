import React, { useState, useEffect } from 'react';
import { authService } from '../../services/authService';

const CustomerPlotBooking = ({ customerNo, land, onBookingSuccess, onBack }) => {
  const [plots, setPlots] = useState([]);
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [plotsLoading, setPlotsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    bookingDate: new Date().toISOString().split('T')[0],
    bookingFee: ''
  });

  useEffect(() => {
    loadPlots();
  }, [land]);

  const loadPlots = async () => {
    setPlotsLoading(true);
    try {
      const response = await authService.getPlotsByLand(land['Land Code']);
      if (response.success) {
        // Filter only available plots and ensure prices are properly formatted
        const availablePlots = response.plots
          .filter(plot => plot['Plot Status']?.toLowerCase() === 'available')
          .map(plot => ({
            ...plot,
            // Ensure prices are numbers and have proper values
            'Member Price': parseFloat(plot['Member Price']) || 0,
            'Non Member Price': parseFloat(plot['Non Member Price']) || 0,
            'Area': parseFloat(plot['Area']) || 0
          }));
        setPlots(availablePlots);
      } else {
        setError('Failed to load plots');
      }
    } catch (err) {
      setError('Error loading plots');
      console.error('Error loading plots:', err);
    } finally {
      setPlotsLoading(false);
    }
  };

  const handlePlotSelect = (plot) => {
    setSelectedPlot(plot);
    setError('');
    setSuccess('');
    // Set default booking fee based on plot price
    if (plot['Member Price'] && plot['Member Price'] > 0) {
      setFormData(prev => ({
        ...prev,
        bookingFee: plot['Member Price'].toString()
      }));
    } else {
      // If no price, let user enter manually
      setFormData(prev => ({
        ...prev,
        bookingFee: ''
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateBookingNumber = () => {
    const timestamp = new Date().getTime();
    return `BKG${timestamp}`;
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedPlot) {
      setError('Please select a plot first');
      return;
    }

    if (!formData.bookingFee || parseFloat(formData.bookingFee) <= 0) {
      setError('Please enter a valid booking fee');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const bookingData = {
        customerNo: customerNo,
        landCode: land['Land Code'],
        plotCode: selectedPlot['Plot Code.'],
        bookingDate: formData.bookingDate,
        bookingFee: parseFloat(formData.bookingFee),
        bookingNo: generateBookingNumber(),
        buyerName: "Customer" // You'll need to get this from customer registration
      };

      console.log('📤 Sending booking request:', bookingData);

      const response = await authService.customerBookPlot(bookingData);
      
      console.log('✅ Booking response:', response);

      if (response.success) {
        setSuccess('Plot booked successfully!');
        setTimeout(() => {
          onBookingSuccess();
        }, 2000);
      } else {
        setError(response.error || 'Failed to book plot');
      }
    } catch (err) {
      console.error('❌ Booking error:', err);
      setError(err.response?.data?.error || 'Error booking plot. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return 'Ksh 0';
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'available': return 'available';
      case 'booked': return 'booked';
      case 'sold': return 'sold';
      default: return 'unknown';
    }
  };

  return (
    <div className="customer-plot-booking">
      {/* Header */}
      <div className="booking-header">
        <button onClick={onBack} className="back-button">
          <i className="fas fa-arrow-left"></i>
          Back to Lands
        </button>
        <div className="header-content">
          <h1>Book a Plot</h1>
          <p>Select a plot and complete booking for {land.Description}</p>
        </div>
        <div className="customer-badge">
          <i className="fas fa-user"></i>
          Customer: {customerNo}
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="message error">
          <i className="fas fa-exclamation-circle"></i>
          {error}
          <button onClick={() => setError('')} className="close-message">
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {success && (
        <div className="message success">
          <i className="fas fa-check-circle"></i>
          {success}
        </div>
      )}

      <div className="booking-content">
        {/* Available Plots Section */}
        <div className="plots-section">
          <div className="section-header">
            <h2>Available Plots</h2>
            <p>Select a plot from {land.Description}</p>
          </div>

          {plotsLoading ? (
            <div className="loading-state">
              <div className="loading-spinner">
                <i className="fas fa-spinner fa-spin"></i>
              </div>
              <p>Loading available plots...</p>
            </div>
          ) : plots.length > 0 ? (
            <div className="plots-grid">
              {plots.map((plot, index) => (
                <div
                  key={index}
                  className={`plot-card ${getStatusColor(plot['Plot Status'])}`}
                  onClick={() => handlePlotSelect(plot)}
                >
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
                    {selectedPlot?.['Plot Code.'] === plot['Plot Code.'] ? (
                      <div className="selected-indicator">
                        <i className="fas fa-check-circle"></i>
                        Selected for Booking
                      </div>
                    ) : (
                      <button className="select-plot-button">
                        <i className="fas fa-hand-pointer"></i>
                        Select Plot
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <i className="fas fa-map-marked-alt"></i>
              <h3>No Available Plots</h3>
              <p>There are currently no available plots for this land.</p>
              <button onClick={onBack} className="primary-button">
                <i className="fas fa-arrow-left"></i>
                Back to Lands
              </button>
            </div>
          )}
        </div>

        {/* Booking Form Section */}
        {selectedPlot && (
          <div className="booking-form-section">
            <div className="form-container">
              <div className="form-header">
                <h2>Booking Details</h2>
                <p>Complete the booking for {selectedPlot['Plot Code.']}</p>
              </div>

              <div className="selected-plot-summary">
                <div className="summary-header">
                  <h3>Selected Plot Summary</h3>
                  <span className="plot-badge">{selectedPlot['Plot Code.']}</span>
                </div>
                <div className="summary-details">
                  <div className="summary-row">
                    <span className="label">Plot Code:</span>
                    <span className="value">{selectedPlot['Plot Code.']}</span>
                  </div>
                  <div className="summary-row">
                    <span className="label">Area:</span>
                    <span className="value">{selectedPlot.Area} acres</span>
                  </div>
                  <div className="summary-row">
                    <span className="label">Member Price:</span>
                    <span className="value price">{formatCurrency(selectedPlot['Member Price'])}</span>
                  </div>
                  <div className="summary-row">
                    <span className="label">Land:</span>
                    <span className="value">{land.Description}</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleBookingSubmit} className="booking-form">
                <div className="form-group">
                  <label className="form-label">Customer Number</label>
                  <input
                    type="text"
                    value={customerNo}
                    readOnly
                    className="form-input readonly"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="bookingDate" className="form-label">
                      Booking Date *
                    </label>
                    <input
                      id="bookingDate"
                      name="bookingDate"
                      type="date"
                      required
                      value={formData.bookingDate}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="bookingFee" className="form-label">
                      Booking Fee (KSh) *
                    </label>
                    <input
                      id="bookingFee"
                      name="bookingFee"
                      type="number"
                      required
                      min="0"
                      step="1000"
                      placeholder="Enter booking fee amount"
                      value={formData.bookingFee}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                    {selectedPlot['Member Price'] > 0 && (
                      <div className="fee-suggestion">
                        Suggested: {formatCurrency(selectedPlot['Member Price'])}
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPlot(null);
                      setError('');
                      setSuccess('');
                    }}
                    className="secondary-button"
                    disabled={loading}
                  >
                    <i className="fas fa-times"></i>
                    Change Plot
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="primary-button"
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        Processing Booking...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-map-marked-alt"></i>
                        Confirm Booking
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .customer-plot-booking {
          min-height: 100vh;
          background: #f8fafc;
          padding: 1rem;
        }

        .booking-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          padding: 1.5rem;
          border-radius: 1rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #6b7280;
          color: white;
          border: none;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .back-button:hover {
          background: #4b5563;
        }

        .header-content {
          flex: 1;
          text-align: center;
        }

        .header-content h1 {
          margin: 0 0 0.5rem 0;
          color: #1f2937;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .header-content p {
          margin: 0;
          color: #6b7280;
        }

        .customer-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #7A1F23;
          color: white;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          font-weight: 600;
        }

        .message {
          padding: 1rem 1.5rem;
          border-radius: 0.75rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 500;
          position: relative;
        }

        .message.error {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        .message.success {
          background: #f0fdf4;
          color: #166534;
          border: 1px solid #bbf7d0;
        }

        .close-message {
          background: none;
          border: none;
          color: inherit;
          cursor: pointer;
          margin-left: auto;
          padding: 0.25rem;
        }

        .booking-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 1024px) {
          .booking-content {
            grid-template-columns: 1fr 1fr;
          }
        }

        .plots-section, .booking-form-section {
          background: white;
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .section-header {
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .section-header h2 {
          margin: 0 0 0.5rem 0;
          color: #1f2937;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .section-header p {
          margin: 0;
          color: #6b7280;
          font-size: 1rem;
        }

        /* UPDATED: Use the same grid layout as PlotModal */
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
          cursor: pointer;
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

        .select-plot-button {
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

        .select-plot-button:hover {
          background: linear-gradient(135deg, #5a1519, #7A1F23);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(122, 31, 35, 0.3);
        }

        .selected-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: #10b981;
          font-weight: 600;
          padding: 0.75rem;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 0.75rem;
          font-size: 0.85rem;
          width: 100%;
        }

        .selected-indicator i {
          font-size: 1.1rem;
        }

        /* Rest of the CSS remains the same */
        .form-container {
          max-width: 100%;
        }

        .form-header {
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .form-header h2 {
          margin: 0 0 0.5rem 0;
          color: #1f2937;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .form-header p {
          margin: 0;
          color: #6b7280;
        }

        .selected-plot-summary {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-radius: 1rem;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          border-left: 4px solid #7A1F23;
        }

        .summary-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .summary-header h3 {
          margin: 0;
          color: #1f2937;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .plot-badge {
          background: #7A1F23;
          color: white;
          padding: 0.375rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .summary-details {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .summary-row:last-child {
          border-bottom: none;
        }

        .summary-row .label {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .summary-row .value {
          color: #1f2937;
          font-weight: 500;
          font-size: 0.875rem;
        }

        .summary-row .value.price {
          color: #7A1F23;
          font-weight: 600;
          font-size: 1rem;
        }

        .booking-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        @media (min-width: 640px) {
          .form-row {
            grid-template-columns: 1fr 1fr;
          }
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .form-input {
          padding: 0.875rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.75rem;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
        }

        .form-input:focus {
          border-color: #7A1F23;
          box-shadow: 0 0 0 3px rgba(122, 31, 35, 0.1);
          outline: none;
        }

        .form-input.readonly {
          background: #f9fafb;
          color: #6b7280;
          cursor: not-allowed;
          border-color: #d1d5db;
        }

        .fee-suggestion {
          margin-top: 0.5rem;
          color: #7A1F23;
          font-size: 0.875rem;
          font-weight: 500;
          background: #fef7f7;
          padding: 0.5rem;
          border-radius: 0.375rem;
          text-align: center;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .secondary-button {
          flex: 1;
          background: #6b7280;
          color: white;
          border: none;
          padding: 0.875rem 1.5rem;
          border-radius: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .secondary-button:hover:not(:disabled) {
          background: #4b5563;
          transform: translateY(-1px);
        }

        .primary-button {
          flex: 2;
          background: linear-gradient(135deg, #7A1F23, #5a1519);
          color: white;
          border: none;
          padding: 0.875rem 1.5rem;
          border-radius: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          font-size: 1rem;
        }

        .primary-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #5a1519, #7A1F23);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(122, 31, 35, 0.3);
        }

        .primary-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
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
          font-size: 3rem;
          color: #d1d5db;
          margin-bottom: 1rem;
        }

        .empty-state h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #374151;
        }

        .empty-state p {
          margin-bottom: 1.5rem;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .booking-header {
            flex-direction: column;
            text-align: center;
          }

          .form-actions {
            flex-direction: column;
          }

          .plots-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Large screens */
        @media (min-width: 1200px) {
          .plots-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          }
        }
      `}</style>
    </div>
  );
};

export default CustomerPlotBooking;