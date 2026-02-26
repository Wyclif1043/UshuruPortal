// src/components/investments/PlotModal.jsx
import React, { useState, useEffect } from 'react';
import { authService } from '../../services/authService';

const PlotModal = ({ land, memberNo, memberName, onClose, onPlotBooked, generateBookingNumber }) => {
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(null);
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showPaymentStatus, setShowPaymentStatus] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [paymentMessage, setPaymentMessage] = useState('');
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [sessionID, setSessionID] = useState(null);
  const [paymentCheckInterval, setPaymentCheckInterval] = useState(null);
  const [formData, setFormData] = useState({
    bookingNo: '',
    buyerName: '',
    bookingDate: new Date().toISOString().split('T')[0],
    bookingFee: '',
    phoneNumber: memberNo || '',
    transactionReferenceNo: '',
    memberNo: memberNo || ''
  });

  useEffect(() => {
    const loadPlots = async () => {
      setLoading(true);
      setLoadingError(null);
      
      try {
        console.log('🔍 Loading plots for land:', land);
        
        if (!land || !land['Land Code']) {
          throw new Error('Invalid land data: Missing Land Code');
        }

        const response = await authService.getPlotsByLand(land['Land Code']);
        console.log('🔍 Response from getPlotsByLand:', response);
        
        if (response && response.success) {
          setPlots(response.plots || []);
        } else {
          throw new Error(response?.message || 'Failed to load plots');
        }
      } catch (err) {
        console.error('❌ Error loading plots:', err);
        setLoadingError(err.message || 'Failed to load plots. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadPlots();
  }, [land]);

  useEffect(() => {
    return () => {
      if (paymentCheckInterval) {
        clearInterval(paymentCheckInterval);
      }
    };
  }, [paymentCheckInterval]);

  // Poll for payment status
  const startPaymentStatusPolling = (sessionId) => {
    if (paymentCheckInterval) {
      clearInterval(paymentCheckInterval);
    }

    const interval = setInterval(async () => {
      try {
        const statusResponse = await authService.checkPaymentStatus(sessionId);
        console.log('📊 Payment status check:', statusResponse);

        if (statusResponse.status === 'processed') {
          // Payment successful and booking processed
          setPaymentStatus('success');
          setPaymentMessage('Payment successful! Plot booking completed.');
          
          if (statusResponse.booking_result?.success) {
            setMessage('Plot booked successfully!');
            setTimeout(() => {
              onPlotBooked();
            }, 1500);
          }
          
          clearInterval(interval);
          setPaymentCheckInterval(null);
        } else if (statusResponse.payment_status === 'failed') {
          setPaymentStatus('failed');
          setPaymentMessage(statusResponse.result_desc || 'Payment failed');
          clearInterval(interval);
          setPaymentCheckInterval(null);
        }
        // Keep polling if still pending
      } catch (err) {
        console.error('❌ Error checking payment status:', err);
        // Don't clear interval on error, just log
      }
    }, 3000); // Poll every 3 seconds

    setPaymentCheckInterval(interval);
  };

  const parsePrice = (value) => {
    if (!value && value !== 0) return 0;
    const cleaned = String(value).replace(/,/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  const formatCurrency = (amount) => {
    const numericAmount = parsePrice(amount);
    if (numericAmount === 0) return 'KES 0';
    
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numericAmount);
  };

  const handleBookPlot = (plot) => {
    setSelectedPlot(plot);
    const parsedPrice = parsePrice(plot.member_price);
    
    setFormData(prev => ({
      ...prev,
      bookingNo: generateBookingNumber(),
      buyerName: memberName || '',
      bookingFee: parsedPrice,
      phoneNumber: memberNo || '',
      memberNo: memberNo || ''
    }));
    setShowBookingForm(true);
    setMessage('');
    setPaymentMessage('');
    setPaymentStatus(null);
  };

  const handleInitiatePayment = async (e) => {
    e.preventDefault();
    setPaymentLoading(true);
    setPaymentMessage('');
    setMessage('');

    try {
      const phoneNumber = formData.phoneNumber.trim();
      if (!phoneNumber) {
        throw new Error('Phone number is required');
      }

      let formattedPhone = phoneNumber;
      if (phoneNumber.startsWith('0')) {
        formattedPhone = '254' + phoneNumber.substring(1);
      } else if (phoneNumber.startsWith('7')) {
        formattedPhone = '254' + phoneNumber;
      } else if (!phoneNumber.startsWith('254')) {
        formattedPhone = '254' + phoneNumber;
      }

      if (formattedPhone.length !== 12) {
        throw new Error('Please enter a valid Safaricom number (e.g., 254706126213 or 0706126213)');
      }

      if (!formData.memberNo && !memberNo) {
        throw new Error('Member number is required');
      }

      const finalMemberNo = formData.memberNo || memberNo;

      // Generate session ID
      const newSessionID = generateSessionId();
      setSessionID(newSessionID);

      const paymentData = {
        phonenumber: formattedPhone,
        amount: formData.bookingFee,
        accno: finalMemberNo || formattedPhone,
        transactionType: "LandDeposit",
        orgCode: "68",
        bookingType: "member", // Identifies this as member booking
        bookingData: {
          memberNo: finalMemberNo,
          landCode: land['Land Code'],
          plotCode: selectedPlot.plot_code,
          bookingDate: formData.bookingDate,
          buyerName: formData.buyerName,
          phoneNumber: formattedPhone
        }
      };

      console.log('📱 Initiating STK Push:', paymentData);

      const response = await authService.initiateSTKPush(paymentData);
      console.log('✅ STK Push response:', response);

      if (response.ResultCode === "0") {
        setPaymentStatus('pending');
        setPaymentMessage('STK push sent. Please check your phone and enter PIN.');
        setShowBookingForm(false);
        setShowPaymentStatus(true);
        
        // Start polling for payment status using the sessionID from response
        startPaymentStatusPolling(response.sessionID || newSessionID);
      } else {
        setPaymentStatus('failed');
        setPaymentMessage(response.ResultDesc || 'Failed to initiate payment');
      }
    } catch (err) {
      console.error('❌ Payment initiation error:', err);
      setPaymentMessage(err.message || 'Error initiating payment');
      setPaymentStatus('failed');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBackToPlots = () => {
    setShowBookingForm(false);
    setShowPaymentStatus(false);
    setPaymentStatus(null);
    setPaymentMessage('');
    setMessage('');
    if (paymentCheckInterval) {
      clearInterval(paymentCheckInterval);
      setPaymentCheckInterval(null);
    }
  };

  const generateSessionId = () => {
    return 'SW' + Math.random().toString(36).substring(2, 12).toUpperCase();
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'available': return 'available';
      case 'booked': return 'booked';
      case 'sold': return 'sold';
      case 'acquired': return 'sold';
      default: return 'unknown';
    }
  };

  const getPaymentStatusMessage = () => {
    switch (paymentStatus) {
      case 'pending':
        return { text: 'Waiting for payment confirmation...', icon: 'fa-spinner fa-pulse', color: '#F59E0B' };
      case 'success':
        return { text: 'Payment successful!', icon: 'fa-check-circle', color: '#10B981' };
      case 'failed':
        return { text: 'Payment failed', icon: 'fa-exclamation-circle', color: '#EF4444' };
      default:
        return { text: '', icon: '', color: '' };
    }
  };

  // Count available plots
  const availablePlotsCount = plots.filter(p => 
    p.plot_status?.toLowerCase() === 'available'
  ).length;

  return (
    <div className="plot-modal-overlay" onClick={onClose}>
      <div className="plot-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <h2>
              {showPaymentStatus
                ? 'Payment Status'
                : showBookingForm
                  ? 'Book Plot'
                  : `Plots - ${land.Description || 'Land'}`}
            </h2>
            <p>
              {showPaymentStatus || showBookingForm
                ? `Plot: ${selectedPlot?.plot_code} | Land: ${land['Land Code']}`
                : `Land Code: ${land['Land Code']} | Region: ${land.Region || 'Unknown'} | Available: ${availablePlotsCount}`
              }
            </p>
          </div>
          <button className="close-button" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-content">
          {showPaymentStatus ? (
            <div className="payment-status-view">
              <div className="payment-summary">
                <div className="payment-amount">
                  <span className="label">Amount:</span>
                  <span className="value">{formatCurrency(formData.bookingFee)}</span>
                </div>
                <div className="payment-phone">
                  <span className="label">Phone:</span>
                  <span className="value">{formData.phoneNumber}</span>
                </div>
                <div className="payment-member">
                  <span className="label">Member No:</span>
                  <span className="value">{memberNo || formData.memberNo}</span>
                </div>
              </div>

              <div className={`payment-message ${paymentStatus}`}>
                <i className={`fas ${getPaymentStatusMessage().icon}`} style={{ color: getPaymentStatusMessage().color }}></i>
                <p>{paymentMessage || 'Processing your payment...'}</p>
              </div>

              {paymentStatus === 'pending' && (
                <div className="payment-instructions">
                  <h4>Instructions:</h4>
                  <ol>
                    <li>Check your phone for an STK push from M-PESA</li>
                    <li>Enter your M-PESA PIN to authorize the payment</li>
                    <li>Wait for confirmation (this may take a few moments)</li>
                    <li>Do not close this window</li>
                  </ol>
                  <div className="payment-timer">
                    <i className="fas fa-hourglass-half"></i>
                    <span>Waiting for confirmation...</span>
                  </div>
                </div>
              )}

              {paymentStatus === 'failed' && (
                <div className="payment-actions">
                  <button
                    className="retry-button"
                    onClick={handleBackToPlots}
                  >
                    <i className="fas fa-redo"></i>
                    Try Again
                  </button>
                </div>
              )}

              {paymentStatus === 'success' && (
                <div className="booking-progress">
                  <i className="fas fa-check-circle" style={{ color: '#10B981' }}></i>
                  <p>Plot booking completed successfully!</p>
                </div>
              )}

              {message && (
                <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
                  <i className={`fas ${message.includes('success') ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
                  {message}
                </div>
              )}

              <div className="payment-footer">
                <button
                  className="back-button"
                  onClick={handleBackToPlots}
                  disabled={paymentStatus === 'pending'}
                >
                  <i className="fas fa-arrow-left"></i>
                  Back to Plots
                </button>
              </div>
            </div>
          ) : showBookingForm ? (
            <div className="booking-form-view">
              <div className="plot-summary">
                <h3>Plot Details</h3>
                <div className="plot-info">
                  <div className="info-item">
                    <span className="label">Plot Code:</span>
                    <span className="value">{selectedPlot?.plot_code}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Area:</span>
                    <span className="value">{selectedPlot?.area} acres</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Price:</span>
                    <span className="value price">{formatCurrency(selectedPlot?.member_price)}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Land:</span>
                    <span className="value">{land.Description || 'Land'} ({land['Land Code']})</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleInitiatePayment} className="booking-form">
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
                      name="memberNo"
                      value={formData.memberNo}
                      onChange={handleInputChange}
                      required
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
                      placeholder="Enter amount"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>M-PESA Phone Number:</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 254706126213 or 0706126213"
                    pattern="[0-9]{9,12}"
                    title="Please enter a valid phone number (9-12 digits)"
                  />
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
                    onClick={handleBackToPlots}
                    disabled={paymentLoading}
                  >
                    <i className="fas fa-arrow-left"></i>
                    Back
                  </button>
                  <button
                    type="submit"
                    className="submit-button"
                    disabled={paymentLoading}
                  >
                    {paymentLoading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        Sending...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-mobile-alt"></i>
                        Pay with M-PESA
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="payment-info">
                <i className="fas fa-info-circle"></i>
                <p>You will receive an STK push on your phone to complete the payment.</p>
              </div>
            </div>
          ) : (
            <>
              {loading ? (
                <div className="loading-state">
                  <div className="loading-spinner">
                    <i className="fas fa-spinner fa-spin"></i>
                  </div>
                  <p>Loading available plots...</p>
                </div>
              ) : loadingError ? (
                <div className="error-state">
                  <i className="fas fa-exclamation-circle"></i>
                  <h3>Error Loading Plots</h3>
                  <p>{loadingError}</p>
                  <button 
                    className="retry-button"
                    onClick={() => window.location.reload()}
                  >
                    <i className="fas fa-redo"></i>
                    Retry
                  </button>
                </div>
              ) : (
                <>
                  <div className="plots-grid">
                    {plots.map((plot, index) => (
                      <div key={plot.plot_code || index} className={`plot-card ${getStatusColor(plot.plot_status)}`}>
                        <div className="plot-card-header">
                          <h3 className="plot-code">{plot.plot_code}</h3>
                          <span className={`status-badge status-${getStatusColor(plot.plot_status)}`}>
                            {plot.plot_status || 'Unknown'}
                          </span>
                        </div>

                        <div className="plot-card-body">
                          <div className="plot-details">
                            <div className="detail-item">
                              <span className="label">Area:</span>
                              <span className="value">{plot.area || 0} acres</span>
                            </div>
                            <div className="detail-item">
                              <span className="label">Member Price:</span>
                              <span className="value price">{formatCurrency(plot.member_price)}</span>
                            </div>
                            <div className="detail-item">
                              <span className="label">Non-Member:</span>
                              <span className="value">{formatCurrency(plot.non_member_price)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="plot-card-footer">
                          {plot.plot_status?.toLowerCase() === 'available' ? (
                            <button
                              className="book-button"
                              onClick={() => handleBookPlot(plot)}
                            >
                              <i className="fas fa-map-marked-alt"></i>
                              Book This Plot
                            </button>
                          ) : (
                            <button className="book-button disabled" disabled>
                              {plot.plot_status || 'Unavailable'}
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

      {/* ADD THIS CSS FOR THE PLOT MODAL */}
      <style jsx>{`
        .plot-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1100;
          padding: 1rem;
          backdrop-filter: blur(5px);
          animation: fadeIn 0.3s ease;
        }

        .plot-modal {
          background: white;
          border-radius: 20px;
          width: 100%;
          max-width: 900px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          animation: slideUp 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 1.5rem 2rem;
          border-bottom: 2px solid #f3f4f6;
          position: sticky;
          top: 0;
          background: white;
          z-index: 10;
          border-radius: 20px 20px 0 0;
        }

        .modal-title h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.25rem;
          line-height: 1.2;
        }

        .modal-title p {
          color: #6b7280;
          font-size: 0.875rem;
          margin: 0;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 1.25rem;
          color: #9ca3af;
          cursor: pointer;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .close-button:hover {
          background: #f3f4f6;
          color: #7A1F23;
          transform: rotate(90deg);
        }

        .modal-content {
          padding: 2rem;
        }

        /* Loading State */
        .loading-state {
          text-align: center;
          padding: 3rem 1rem;
          color: #6b7280;
        }

        .loading-spinner {
          font-size: 2rem;
          color: #7A1F23;
          margin-bottom: 1rem;
        }

        /* Error State */
        .error-state {
          text-align: center;
          padding: 3rem 1rem;
        }
        
        .error-state i {
          font-size: 3rem;
          color: #ef4444;
          margin-bottom: 1rem;
        }
        
        .error-state h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #374151;
        }
        
        .error-state p {
          color: #6b7280;
          margin-bottom: 1.5rem;
        }

        .retry-button {
          background: #7A1F23;
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .retry-button:hover {
          background: #5a1519;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(122, 31, 35, 0.3);
        }

        /* Empty State */
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
          color: #6b7280;
        }

        /* Plots Grid */
        .plots-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .plot-card {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          border: 1px solid #e5e7eb;
          transition: all 0.3s ease;
          position: relative;
        }

        .plot-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(122, 31, 35, 0.15);
        }

        .plot-card.available {
          border-left: 4px solid #10B981;
        }

        .plot-card.booked {
          border-left: 4px solid #F59E0B;
          opacity: 0.9;
        }

        .plot-card.sold {
          border-left: 4px solid #EF4444;
          opacity: 0.8;
        }

        .plot-card.unknown {
          border-left: 4px solid #9CA3AF;
        }

        .plot-card-header {
          padding: 1rem 1.25rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e5e7eb;
        }

        .plot-code {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
          font-family: monospace;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
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

        .status-unknown {
          background: #F3F4F6;
          color: #6B7280;
        }

        .plot-card-body {
          padding: 1.25rem;
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
          font-size: 0.875rem;
        }

        .detail-item .label {
          color: #6b7280;
        }

        .detail-item .value {
          font-weight: 500;
          color: #1f2937;
        }

        .detail-item .value.price {
          color: #7A1F23;
          font-weight: 600;
        }

        .plot-card-footer {
          padding: 1rem 1.25rem;
          border-top: 1px solid #e5e7eb;
        }

        .book-button {
          width: 100%;
          background: linear-gradient(135deg, #7A1F23, #5a1519);
          color: white;
          border: none;
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
        }

        .book-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #5a1519, #7A1F23);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(122, 31, 35, 0.3);
        }

        .book-button.disabled {
          background: #d1d5db;
          cursor: not-allowed;
          opacity: 0.7;
        }

        .book-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* Message Styles */
        .message {
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.875rem;
        }

        .message.success {
          background: #DCFCE7;
          color: #16A34A;
        }

        .message.error {
          background: #FEE2E2;
          color: #DC2626;
        }

        .message i {
          font-size: 1rem;
        }

        /* Booking Form Styles */
        .booking-form-view {
          max-width: 600px;
          margin: 0 auto;
        }

        .plot-summary {
          background: #f8fafc;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          border: 1px solid #e5e7eb;
        }

        .plot-summary h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .plot-info {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .info-item .label {
          font-size: 0.75rem;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-item .value {
          font-size: 1rem;
          font-weight: 500;
          color: #1f2937;
        }

        .info-item .value.price {
          color: #7A1F23;
          font-size: 1.1rem;
          font-weight: 700;
        }

        .booking-form {
          margin-bottom: 2rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .form-group input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .form-group input:focus {
          outline: none;
          border-color: #7A1F23;
          box-shadow: 0 0 0 3px rgba(122, 31, 35, 0.1);
        }

        .form-group input.readonly-input {
          background: #f3f4f6;
          cursor: not-allowed;
        }

        .input-hint {
          display: block;
          font-size: 0.75rem;
          color: #6b7280;
          margin-top: 0.25rem;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        .back-button {
          flex: 1;
          padding: 0.75rem 1rem;
          background: white;
          color: #6b7280;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .back-button:hover:not(:disabled) {
          background: #f3f4f6;
          border-color: #9ca3af;
        }

        .back-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .submit-button {
          flex: 2;
          padding: 0.75rem 1rem;
          background: linear-gradient(135deg, #7A1F23, #5a1519);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .submit-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #5a1519, #7A1F23);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(122, 31, 35, 0.3);
        }

        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .payment-info {
          background: #EFF6FF;
          border-radius: 8px;
          padding: 1rem;
          display: flex;
          gap: 1rem;
          align-items: flex-start;
          color: #3B82F6;
          font-size: 0.875rem;
          line-height: 1.5;
          border: 1px solid #BFDBFE;
        }

        .payment-info i {
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .payment-info p {
          margin: 0;
          color: #1E40AF;
        }

        /* Payment Status Styles */
        .payment-status-view {
          max-width: 500px;
          margin: 0 auto;
          text-align: center;
        }

        .payment-summary {
          background: #f8fafc;
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 2rem;
          border: 2px solid #e5e7eb;
        }

        .payment-amount {
          margin-bottom: 1.5rem;
        }

        .payment-amount .label {
          display: block;
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .payment-amount .value {
          font-size: 2rem;
          font-weight: 700;
          color: #7A1F23;
        }

        .payment-phone {
          margin-bottom: 1rem;
        }

        .payment-phone .label,
        .payment-member .label {
          display: block;
          font-size: 0.75rem;
          color: #6b7280;
          margin-bottom: 0.25rem;
        }

        .payment-phone .value,
        .payment-member .value {
          font-size: 1.1rem;
          font-weight: 500;
          color: #1f2937;
        }

        .payment-message {
          padding: 1.5rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 1rem;
        }

        .payment-message.pending {
          background: #FEF3C7;
          color: #D97706;
        }

        .payment-message.success {
          background: #DCFCE7;
          color: #16A34A;
        }

        .payment-message.failed {
          background: #FEE2E2;
          color: #DC2626;
        }

        .payment-message i {
          font-size: 1.5rem;
        }

        .payment-message p {
          margin: 0;
          font-weight: 500;
        }

        .payment-instructions {
          text-align: left;
          background: #f8fafc;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          border: 1px solid #e5e7eb;
        }

        .payment-instructions h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .payment-instructions ol {
          margin: 0 0 1.5rem 1.5rem;
          padding: 0;
        }

        .payment-instructions li {
          color: #4b5563;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }

        .payment-timer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: #7A1F23;
          font-size: 0.875rem;
          font-weight: 500;
          padding: 1rem;
          background: white;
          border-radius: 8px;
          border: 1px dashed #7A1F23;
        }

        .payment-actions {
          margin-bottom: 2rem;
        }

        .booking-progress {
          padding: 2rem;
          text-align: center;
          color: #7A1F23;
        }

        .booking-progress i {
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .booking-progress p {
          margin: 0;
          font-size: 0.875rem;
        }

        .payment-footer {
          margin-top: 2rem;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .modal-header {
            padding: 1rem 1.5rem;
          }

          .modal-title h2 {
            font-size: 1.25rem;
          }

          .modal-content {
            padding: 1.5rem;
          }

          .plots-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .plot-info {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .form-actions {
            flex-direction: column;
          }

          .back-button,
          .submit-button {
            width: 100%;
          }

          .payment-summary {
            padding: 1.5rem;
          }

          .payment-amount .value {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .modal-header {
            padding: 1rem;
            flex-direction: column;
            gap: 1rem;
          }

          .modal-title h2 {
            font-size: 1.1rem;
          }

          .modal-content {
            padding: 1rem;
          }

          .plot-summary {
            padding: 1rem;
          }

          .payment-summary {
            padding: 1rem;
          }

          .payment-message {
            padding: 1rem;
            font-size: 0.875rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PlotModal;