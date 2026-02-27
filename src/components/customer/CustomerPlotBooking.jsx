// src/components/customer/CustomerPlotBooking.jsx
import React, { useState, useEffect } from 'react';

const CustomerPlotBooking = ({ customerNo, land, plots, onBookingSuccess, onBack }) => {
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [paymentMessage, setPaymentMessage] = useState('');
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [formData, setFormData] = useState({
    bookingDate: new Date().toISOString().split('T')[0],
    phoneNumber: '',
    bookingFee: '',
    transactionReferenceNo: ''
  });

  // Add effect to prevent body scroll when modal is open
  useEffect(() => {
    if (showPaymentModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showPaymentModal]);

  // Helper function to parse price (removes commas and converts to number)
  const parsePrice = (price) => {
    if (!price && price !== 0) return 0;
    // Remove commas and convert to number
    const cleaned = String(price).replace(/,/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  const handlePlotSelect = (plot) => {
    setSelectedPlot(plot);
    // Parse the price to remove commas before setting in form
    const parsedPrice = parsePrice(plot.non_member_price || plot.member_price);
    setFormData(prev => ({
      ...prev,
      bookingFee: parsedPrice
    }));
    setError('');
    setSuccess('');
    setPaymentMessage('');
    setPaymentStatus(null);
    // Open payment modal
    setShowPaymentModal(true);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedPlot(null);
    setError('');
    setPaymentMessage('');
    setPaymentStatus(null);
    setFormData(prev => ({
      ...prev,
      phoneNumber: '',
      bookingFee: prev.bookingFee // Keep the booking fee
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateSessionId = () => {
    return 'SW' + Math.random().toString(36).substring(2, 12).toUpperCase();
  };

  const handleInitiatePayment = async (e) => {
    e.preventDefault();

    if (!selectedPlot) {
      setError('Please select a plot first');
      return;
    }

    const phoneNumber = formData.phoneNumber.trim();
    if (!phoneNumber) {
      setError('Phone number is required');
      return;
    }

    if (!formData.bookingFee || parseFloat(formData.bookingFee) <= 0) {
      setError('Please enter a valid booking fee amount');
      return;
    }

    setPaymentLoading(true);
    setPaymentMessage('');
    setError('');

    try {
      let formattedPhone = phoneNumber;
      if (phoneNumber.startsWith('0')) {
        formattedPhone = '254' + phoneNumber.substring(1);
      } else if (phoneNumber.startsWith('7')) {
        formattedPhone = '254' + phoneNumber;
      } else if (!phoneNumber.startsWith('254')) {
        formattedPhone = '254' + phoneNumber;
      }

      if (formattedPhone.length !== 12) {
        throw new Error('Please enter a valid Safaricom number (e.g., 254706126213)');
      }

      const paymentData = {
        sessionID: generateSessionId(),
        phonenumber: formattedPhone,
        amount: formData.bookingFee,
        accno: customerNo || formattedPhone,
        transactionType: "LandDeposit",
        orgCode: "68"
      };

      console.log('Initiating STK Push for customer:', paymentData);

      const response = await fetch('http://88.99.215.90:8001/api/mpesa-stk-push/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });

      const data = await response.json();
      console.log('STK Push response:', data);

      if (data.ResultCode === "0") {
        setPaymentMessage('Payment successful! Proceeding with plot booking...');
        setPaymentStatus('success');

        const transactionRef = data.TransactionID || `MPESA${Date.now()}`;
        setFormData(prev => ({
          ...prev,
          transactionReferenceNo: transactionRef
        }));

        setTimeout(async () => {
          await handleBookingSubmit(transactionRef);
        }, 1500);

      } else if (data.ResultCode === "1032") {
        setPaymentMessage('Transaction cancelled by user');
        setPaymentStatus('cancelled');
      } else if (data.ResultCode === "1037") {
        setPaymentMessage('Transaction timeout. Please try again.');
        setPaymentStatus('timeout');
      } else if (data.ResultCode === "1") {
        setPaymentMessage('Insufficient balance. Please top up and try again.');
        setPaymentStatus('failed');
      } else {
        setPaymentMessage(data.ResultDesc || 'Payment failed');
        setPaymentStatus('failed');
      }
    } catch (err) {
      console.error('Payment initiation error:', err);
      setPaymentMessage(err.message || 'Error initiating payment');
      setPaymentStatus('failed');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleBookingSubmit = async (transactionRef) => {
    setLoading(true);
    setError('');

    try {
      const bookingData = {
        customerNo: customerNo,
        landCode: land['Land Code'],
        plotCode: selectedPlot.plot_code,
        bookingDate: formData.bookingDate,
        buyerName: "Customer",
        bookingFeePaid: parseFloat(formData.bookingFee),
        transactionReferenceNo: transactionRef
      };

      console.log('📤 Sending booking request:', bookingData);

      const response = await fetch('http://127.0.0.1:8000/api/book-plot-non-member/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      const data = await response.json();
      console.log('✅ Booking response:', data);

      if (data.success) {
        setSuccess(`
          Plot booked successfully! 
          We will send you notifications about your plot status via email and SMS.
          Please check your registered contact details for updates.
        `);
        // Close payment modal after successful booking
        setShowPaymentModal(false);
        setTimeout(() => {
          onBookingSuccess();
        }, 4000);
      } else {
        setError(data.error || 'Failed to book plot');
      }
    } catch (err) {
      console.error('❌ Booking error:', err);
      setError('Error booking plot. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Improved formatCurrency function that handles both string and number inputs
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return 'Ksh 0';

    // First parse the amount to remove any existing commas
    const parsedAmount = parsePrice(amount);

    if (parsedAmount === 0) return 'Ksh 0';

    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(parsedAmount);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'available': return 'available';
      case 'booked': return 'booked';
      case 'sold': return 'sold';
      default: return 'unknown';
    }
  };

  const getPaymentStatusMessage = () => {
    switch (paymentStatus) {
      case 'pending':
        return { text: 'Waiting for payment confirmation...', icon: 'fa-spinner fa-pulse', color: '#F59E0B' };
      case 'success':
        return { text: 'Payment successful!', icon: 'fa-check-circle', color: '#10B981' };
      case 'cancelled':
        return { text: 'Payment cancelled', icon: 'fa-times-circle', color: '#EF4444' };
      case 'failed':
        return { text: 'Payment failed', icon: 'fa-exclamation-circle', color: '#EF4444' };
      case 'timeout':
        return { text: 'Payment timeout', icon: 'fa-clock', color: '#EF4444' };
      default:
        return { text: '', icon: '', color: '' };
    }
  };

  // Split plots into rows of 3
  const chunkArray = (array, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const plotRows = chunkArray(plots, 3);

  return (
    <div className="customer-plot-booking-modal">
      {/* Modal Overlay */}
      <div className="modal-overlay">
        {/* Modal Container */}
        <div className="modal-container">
          {/* Modal Header */}
          <div className="modal-header">
            <div className="modal-title">
              <h2>Available Plots</h2>
              <p>{land?.Description} - {land?.['Land Code']}</p>
            </div>
            <button className="close-button" onClick={onBack}>
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Modal Content */}
          <div className="modal-content">
            {/* Error/Success Messages */}
            {error && !showPaymentModal && (
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
                <div className="success-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="success-content">
                  <div className="success-title">Booking Confirmed! 🎉</div>
                  <div className="success-message">
                    {success}
                  </div>
                  <div className="notification-badges">
                    <span className="badge email">
                      <i className="fas fa-envelope"></i>
                      Email
                    </span>
                    <span className="badge sms">
                      <i className="fas fa-mobile-alt"></i>
                      SMS
                    </span>
                  </div>
                </div>
                <button onClick={() => setSuccess('')} className="close-message">
                  <i className="fas fa-times"></i>
                </button>
              </div>
            )}

            <div className="booking-content">
              {/* Available Plots Section */}
              <div className="plots-section">
                <div className="section-header">
                  <h3>Select a Plot</h3>
                  <p>Choose from available plots below</p>
                </div>

                {plots.length > 0 ? (
                  <div className="plots-grid-container">
                    {plotRows.map((row, rowIndex) => (
                      <div key={rowIndex} className="plots-row">
                        {row.map((plot, colIndex) => (
                          <div
                            key={`${rowIndex}-${colIndex}`}
                            className={`plot-card ${getStatusColor(plot.plot_status)} ${selectedPlot?.plot_code === plot.plot_code ? 'selected' : ''}`}
                            onClick={() => handlePlotSelect(plot)}
                          >
                            <div className="plot-card-header">
                              <h3 className="plot-code">{plot.plot_code}</h3>
                              <span className={`status-badge status-${getStatusColor(plot.plot_status)}`}>
                                {plot.plot_status}
                              </span>
                            </div>

                            <div className="plot-card-body">
                              <div className="plot-details">
                                <div className="detail-item">
                                  <span className="label">Area:</span>
                                  <span className="value">{plot.area} acres</span>
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
                              {selectedPlot?.plot_code === plot.plot_code ? (
                                <div className="selected-indicator">
                                  <i className="fas fa-check-circle"></i>
                                  Selected
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
                        {/* Fill empty slots with invisible cards to maintain grid */}
                        {row.length < 3 && [...Array(3 - row.length)].map((_, i) => (
                          <div key={`empty-${i}`} className="plot-card placeholder" aria-hidden="true" />
                        ))}
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
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPlot && (
        <div className="payment-modal-overlay" onClick={handleClosePaymentModal}>
          <div className="payment-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="payment-modal-header">
              <h3>Complete Payment</h3>
              <button className="payment-close-button" onClick={handleClosePaymentModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="payment-modal-content">
              {/* Payment Messages */}
              {error && (
                <div className="message error">
                  <i className="fas fa-exclamation-circle"></i>
                  {error}
                  <button onClick={() => setError('')} className="close-message">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              )}

              {paymentMessage && (
                <div className={`message payment-message ${paymentStatus}`}>
                  <i className={`fas ${getPaymentStatusMessage().icon}`} style={{ color: getPaymentStatusMessage().color }}></i>
                  {paymentMessage}
                </div>
              )}

              {/* Selected Plot Summary */}
              <div className="payment-plot-summary">
                <div className="summary-header">
                  <span className="plot-label">Selected Plot:</span>
                  <span className="plot-code-badge">{selectedPlot.plot_code}</span>
                </div>
                <div className="summary-details">
                  <div className="summary-row">
                    <span>Land:</span>
                    <span>{land.Description}</span>
                  </div>
                  <div className="summary-row">
                    <span>Area:</span>
                    <span>{selectedPlot.area} acres</span>
                  </div>
                  <div className="summary-row">
                    <span>Price:</span>
                    <span className="price">{formatCurrency(selectedPlot.non_member_price)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Form */}
              <form onSubmit={handleInitiatePayment} className="payment-form">
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
                    value={formData.bookingFee}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    placeholder="Enter amount"
                    className="form-input"
                  />
                  <small className="input-hint">
                    Suggested: {formatCurrency(selectedPlot.non_member_price)}
                  </small>
                </div>

                <div className="form-group">
                  <label htmlFor="phoneNumber" className="form-label">
                    M-PESA Phone Number *
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., 254706126213 or 0706126213"
                    pattern="[0-9]{9,12}"
                    title="Please enter a valid phone number (9-12 digits)"
                    className="form-input"
                  />
                  <small className="input-hint">Enter the M-PESA number to pay from</small>
                </div>

                <div className="payment-info">
                  <i className="fas fa-info-circle"></i>
                  <p>You will receive an STK push on your phone to complete the payment.</p>
                </div>

                <div className="payment-form-actions">
                  <button
                    type="button"
                    onClick={handleClosePaymentModal}
                    className="payment-secondary-button"
                    disabled={paymentLoading || loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={paymentLoading || loading}
                    className="payment-primary-button"
                  >
                    {paymentLoading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        Processing...
                      </>
                    ) : loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        Booking...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-mobile-alt"></i>
                        Pay & Book
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Modal Overlay - Full screen with blur */
        .customer-plot-booking-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9999;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: fadeIn 0.3s ease;
          z-index: 10000;
          overflow-y: auto;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        /* Main Modal Container */
        .modal-container {
          background: white;
          border-radius: 1.5rem;
          width: 100%;
          max-width: 1400px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          animation: slideUp 0.4s ease;
          position: relative;
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

        /* Modal Header - Sticky */
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          border-bottom: 2px solid #f3f4f6;
          position: sticky;
          top: 0;
          background: white;
          z-index: 10;
          border-radius: 1.5rem 1.5rem 0 0;
        }

        .modal-title h2 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.25rem 0;
        }

        .modal-title p {
          color: #6b7280;
          font-size: 0.95rem;
          margin: 0;
        }

        .close-button {
          background: #f3f4f6;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1.1rem;
        }

        .close-button:hover {
          background: #7A1F23;
          color: white;
          transform: rotate(90deg);
        }

        /* Modal Content */
        .modal-content {
          padding: 2rem;
        }

        /* Messages */
        .message {
          padding: 1rem 1.5rem;
          border-radius: 0.75rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          font-weight: 500;
          position: relative;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message.error {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        .message.success {
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          color: #166534;
          border: 1px solid #bbf7d0;
          box-shadow: 0 4px 12px rgba(22, 101, 52, 0.1);
        }

        .success-icon {
          font-size: 2rem;
          color: #16a34a;
          flex-shrink: 0;
        }

        .success-content {
          flex: 1;
        }

        .success-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #166534;
        }

        .success-message {
          line-height: 1.6;
          margin-bottom: 1rem;
          white-space: pre-line;
        }

        .notification-badges {
          display: flex;
          gap: 0.75rem;
          margin-top: 0.5rem;
          flex-wrap: wrap;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.375rem 0.75rem;
          background: white;
          border-radius: 2rem;
          font-size: 0.8rem;
          font-weight: 600;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .badge.email {
          color: #2563eb;
          border: 1px solid #93c5fd;
        }

        .badge.sms {
          color: #7A1F23;
          border: 1px solid #fecaca;
        }

        .payment-message.pending {
          background: #FEF3C7;
          color: #92400E;
          border: 1px solid #FCD34D;
        }

        .payment-message.success {
          background: #DCFCE7;
          color: #16A34A;
          border: 1px solid #BBF7D0;
        }

        .payment-message.cancelled,
        .payment-message.failed,
        .payment-message.timeout {
          background: #FEF2F2;
          color: #DC2626;
          border: 1px solid #FECACA;
        }

        .close-message {
          background: none;
          border: none;
          color: inherit;
          cursor: pointer;
          margin-left: auto;
          padding: 0.25rem;
          opacity: 0.7;
          transition: opacity 0.2s;
        }

        .close-message:hover {
          opacity: 1;
        }

        /* Main Layout */
        .booking-content {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        /* Plots Section */
        .plots-section {
          background: #f8fafc;
          border-radius: 1rem;
          padding: 1.5rem;
          width: 100%;
        }

        .section-header {
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .section-header h3 {
          margin: 0 0 0.5rem 0;
          color: #1f2937;
          font-size: 1.3rem;
          font-weight: 600;
        }

        .section-header p {
          margin: 0;
          color: #6b7280;
          font-size: 0.95rem;
        }

        .plots-grid-container {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .plots-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }

        .plot-card {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border-radius: 12px;
          padding: 1.25rem;
          border: 2px solid #e5e7eb;
          transition: all 0.3s ease;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .plot-card.placeholder {
          visibility: hidden;
          pointer-events: none;
          opacity: 0;
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

        .plot-card.selected {
          border-color: #7A1F23;
          box-shadow: 0 0 0 3px rgba(122, 31, 35, 0.2);
          transform: translateY(-2px);
          background: white;
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
          flex: 1;
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
          margin-top: auto;
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

        /* Payment Modal Styles */
        .payment-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 11000;
          padding: 1rem;
          animation: fadeIn 0.3s ease;
        }

        .payment-modal-container {
          background: white;
          border-radius: 1.5rem;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          animation: slideUp 0.4s ease;
        }

        .payment-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          border-bottom: 2px solid #f3f4f6;
          position: sticky;
          top: 0;
          background: white;
          z-index: 10;
          border-radius: 1.5rem 1.5rem 0 0;
        }

        .payment-modal-header h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .payment-close-button {
          background: #f3f4f6;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
        }

        .payment-close-button:hover {
          background: #7A1F23;
          color: white;
          transform: rotate(90deg);
        }

        .payment-modal-content {
          padding: 2rem;
        }

        .payment-plot-summary {
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
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .plot-label {
          font-weight: 600;
          color: #374151;
        }

        .plot-code-badge {
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

        .summary-row span:first-child {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .summary-row span:last-child {
          color: #1f2937;
          font-weight: 500;
          font-size: 0.875rem;
        }

        .summary-row .price {
          color: #7A1F23;
          font-weight: 600;
          font-size: 1rem;
        }

        .payment-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
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
          width: 100%;
        }

        .form-input:focus {
          border-color: #7A1F23;
          box-shadow: 0 0 0 3px rgba(122, 31, 35, 0.1);
          outline: none;
        }

        .input-hint {
          color: #6b7280;
          font-size: 0.8rem;
          margin-top: 0.25rem;
        }

        .payment-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: #EFF6FF;
          border-radius: 0.75rem;
          color: #1E40AF;
          font-size: 0.9rem;
        }

        .payment-info i {
          font-size: 1.2rem;
          color: #3B82F6;
          flex-shrink: 0;
        }

        .payment-info p {
          margin: 0;
          line-height: 1.5;
        }

        .payment-form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .payment-secondary-button {
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

        .payment-secondary-button:hover:not(:disabled) {
          background: #4b5563;
          transform: translateY(-1px);
        }

        .payment-primary-button {
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

        .payment-primary-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #5a1519, #7A1F23);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(122, 31, 35, 0.3);
        }

        .payment-primary-button:disabled,
        .payment-secondary-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .plots-row {
            grid-template-columns: repeat(2, 1fr);
          }

          .modal-container {
            max-height: 95vh;
          }

          .modal-content {
            padding: 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .modal-header {
            padding: 1rem 1.5rem;
          }

          .modal-title h2 {
            font-size: 1.3rem;
          }

          .modal-content {
            padding: 1rem;
          }

          .plots-section {
            padding: 1rem;
          }

          .section-header h3 {
            font-size: 1.1rem;
          }

          .plots-row {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .plot-card {
            max-width: 100%;
          }

          .payment-modal-container {
            max-width: 90%;
          }

          .payment-modal-header h3 {
            font-size: 1.25rem;
          }

          .payment-modal-content {
            padding: 1.5rem;
          }

          .payment-form-actions {
            flex-direction: column;
          }

          .payment-info {
            flex-direction: column;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .modal-overlay {
            padding: 0.5rem;
          }

          .modal-header {
            padding: 0.875rem 1rem;
          }

          .modal-title h2 {
            font-size: 1.2rem;
          }

          .close-button {
            width: 36px;
            height: 36px;
          }

          .plot-card {
            padding: 1rem;
          }

          .plot-code {
            font-size: 1rem;
          }

          .payment-modal-content {
            padding: 1rem;
          }

          .payment-plot-summary {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CustomerPlotBooking;