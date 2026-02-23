// src/components/investments/BookedPlots.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import './BookedPlots.css';

const BookedPlots = ({ plots, loading, onRefresh }) => {
  // Get member number from Redux store - NO HARDCODING
  const { memberNumber } = useSelector((state) => state.auth);
  
  // Offer Modal states
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offeredPlots, setOfferedPlots] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [selectedPlot, setSelectedPlot] = useState(null);
  
  // Payment Plan states
  const [generatingPaymentPlan, setGeneratingPaymentPlan] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [showPaymentPlanForm, setShowPaymentPlanForm] = useState(false);
  
  // PDF Preview states
  const [showPdfPreviewModal, setShowPdfPreviewModal] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [pdfPlotCode, setPdfPlotCode] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  
  // Restructure states
  const [showRestructureModal, setShowRestructureModal] = useState(false);
  const [restructuringPlan, setRestructuringPlan] = useState(false);
  const [selectedPlotForRestructure, setSelectedPlotForRestructure] = useState(null);
  
  // Restructure form state
  const [restructureMonths, setRestructureMonths] = useState('');
  const [restructureInstallments, setRestructureInstallments] = useState('');
  const [restructureStartDate, setRestructureStartDate] = useState('');
  const [restructureReason, setRestructureReason] = useState('');
  
  // Payment plan form state - user fillable (Start Date removed)
  const [paymentPlanMonths, setPaymentPlanMonths] = useState('');
  const [noOfInstallments, setNoOfInstallments] = useState('');

  // Payment Modal states (aligned with PlotModal approach)
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState('');
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentFormData, setPaymentFormData] = useState({
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentTime: new Date().toTimeString().split(' ')[0].substring(0, 5),
    referenceNo: '',
    plotCode: '',
    transactionType: '3', // Default to '3' (General Receipt)
    phoneNumber: memberNumber || ''
  });

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Reset form when opening
  useEffect(() => {
    if (showPaymentPlanForm) {
      setPaymentPlanMonths('');
      setNoOfInstallments('');
    }
  }, [showPaymentPlanForm]);

  // Reset restructure form when opening - FIXED
  useEffect(() => {
    if (showRestructureModal) {
      setRestructureMonths('');
      setRestructureInstallments('');
      setRestructureStartDate('');
      setRestructureReason('');
    }
  }, [showRestructureModal]);

  // Reset payment form when opening
  useEffect(() => {
    if (showPaymentModal && selectedPlot) {
      setPaymentFormData({
        amount: '',
        paymentDate: new Date().toISOString().split('T')[0],
        paymentTime: new Date().toTimeString().split(' ')[0].substring(0, 5),
        referenceNo: `REF-${Date.now().toString().slice(-6)}`,
        plotCode: selectedPlot.plot_code || '',
        transactionType: '3',
        phoneNumber: memberNumber || ''
      });
      setPaymentMessage('');
      setPaymentStatus(null);
    }
  }, [showPaymentModal, selectedPlot, memberNumber]);

  // Clean up PDF URL when modal closes
  useEffect(() => {
    if (!showPdfPreviewModal && pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl);
      setPdfPreviewUrl(null);
      setPdfPlotCode(null);
    }
  }, [showPdfPreviewModal, pdfPreviewUrl]);

  // Clean up offer modal when closed
  const handleCloseOfferModal = () => {
    setShowOfferModal(false);
    setSelectedPlot(null);
    setOfferedPlots([]);
    setShowPaymentPlanForm(false);
  };

  // Open offer modal and fetch plots on offer
  const handleOpenOfferModal = async () => {
    setShowOfferModal(true);
    setShowPaymentPlanForm(false);
    await fetchPlotsOnOffer();
  };

  // Fetch plots on offer with dynamic member number
  const fetchPlotsOnOffer = async () => {
    if (!memberNumber) {
      console.error('No member number available');
      setOfferedPlots([]);
      return;
    }

    setLoadingOffers(true);
    try {
      const response = await api.get('/get-member-plots-offer/', {
        params: { member_no: memberNumber }
      });
      if (response.data.status === 'success') {
        setOfferedPlots(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching plots on offer:', error);
      setOfferedPlots([]);
    } finally {
      setLoadingOffers(false);
    }
  };

  // Show payment plan form for a specific offered plot
  const handleShowPaymentPlanFormForPlot = (plot) => {
    setSelectedPlot(plot);
    setShowPaymentPlanForm(true);
  };

  // Open restructure modal for an offered plot - ONLY for ACTIVE offer status
  const handleOpenRestructureModalForOfferedPlot = (plot) => {
    setSelectedPlotForRestructure(plot);
    setShowRestructureModal(true);
  };

  // Close restructure modal - FIXED
  const handleCloseRestructureModal = () => {
    setShowRestructureModal(false);
    setSelectedPlotForRestructure(null);
    setRestructureMonths('');
    setRestructureInstallments('');
    setRestructureStartDate('');
    setRestructureReason('');
  };

  // Open payment modal
  const handleOpenPaymentModal = (plot) => {
    setSelectedPlot(plot);
    setShowPaymentModal(true);
  };

  // Close payment modal
  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedPlot(null);
    setPaymentProcessing(false);
    setPaymentMessage('');
    setPaymentStatus(null);
  };

  // Handle payment form input change
  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Generate session ID (aligned with PlotModal)
  const generateSessionId = () => {
    return 'SW' + Math.random().toString(36).substring(2, 12).toUpperCase();
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return 'KES 0';
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount === 0) return 'KES 0';
    
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numericAmount);
  };

  // Submit payment (aligned with PlotModal's approach)
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    if (!memberNumber) {
      setPaymentMessage('Member number is required');
      setPaymentStatus('failed');
      return;
    }

    if (!paymentFormData.amount || parseFloat(paymentFormData.amount) <= 0) {
      setPaymentMessage('Please enter a valid amount');
      setPaymentStatus('failed');
      return;
    }

    if (!paymentFormData.referenceNo) {
      setPaymentMessage('Reference number is required');
      setPaymentStatus('failed');
      return;
    }

    setPaymentProcessing(true);
    setPaymentMessage('');
    setPaymentStatus('pending');

    try {
      const payload = {
        customer_no: memberNumber,
        amount: parseFloat(paymentFormData.amount).toFixed(2),
        cheque_date: paymentFormData.paymentDate,
        transaction_time: paymentFormData.paymentTime,
        cheque_no: paymentFormData.referenceNo,
        plot_code: paymentFormData.plotCode || selectedPlot?.plot_code || '',
        transaction_type: paymentFormData.transactionType // '3' for General Receipt
      };

      console.log('📤 Sending payment:', payload);

      const response = await api.post('/general-receipts/', payload);
      
      if (response.data.status === 'success') {
        setPaymentMessage('Payment processed successfully!');
        setPaymentStatus('success');
        
        setTimeout(() => {
          handleClosePaymentModal();
          if (onRefresh) onRefresh();
        }, 2000);
      } else {
        setPaymentMessage(response.data.message || 'Failed to process payment');
        setPaymentStatus('failed');
      }
    } catch (error) {
      console.error('❌ Error processing payment:', error);
      setPaymentMessage(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Error processing payment. Please try again.'
      );
      setPaymentStatus('failed');
    } finally {
      setPaymentProcessing(false);
    }
  };

  // Get payment status message (aligned with PlotModal)
  const getPaymentStatusMessage = () => {
    switch (paymentStatus) {
      case 'pending':
        return { text: 'Processing payment...', icon: 'fa-spinner fa-pulse', color: '#F59E0B' };
      case 'success':
        return { text: 'Payment successful!', icon: 'fa-check-circle', color: '#10B981' };
      case 'failed':
        return { text: 'Payment failed', icon: 'fa-exclamation-circle', color: '#EF4444' };
      default:
        return { text: '', icon: '', color: '' };
    }
  };

  // Close PDF preview modal
  const handleClosePdfPreviewModal = () => {
    setShowPdfPreviewModal(false);
  };

  // Download PDF after preview
  const handleDownloadPdf = () => {
    if (pdfPreviewUrl && pdfPlotCode) {
      const link = document.createElement('a');
      link.href = pdfPreviewUrl;
      link.setAttribute('download', `payment_plan_${pdfPlotCode}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  // Generate payment plan for selected plot (Start Date removed from payload)
  const handleGeneratePaymentPlan = async () => {
    if (!selectedPlot || !memberNumber) return;
    
    // Validate form
    if (!paymentPlanMonths || !noOfInstallments) {
      alert('Please fill in all payment plan fields');
      return;
    }

    const months = parseInt(paymentPlanMonths);
    const installments = parseInt(noOfInstallments);

    if (months < 1 || months > 3) {
      alert('Payment plan months must be between 1 and 3');
      return;
    }

    if (installments < 1) {
      alert('Number of installments must be at least 1');
      return;
    }

    if (installments < months) {
      alert('Number of installments cannot be less than the duration in months');
      return;
    }
    
    setGeneratingPaymentPlan(true);
    try {
      const response = await api.post('/generate-payment-plan/', {
        buyerNo: memberNumber,
        plotCode: selectedPlot.plot_code,
        landCode: selectedPlot.land_code,
        paymentPlanMonths: months,
        noOfInstallments: installments
        // Start Date field removed
      });
      
      if (response.data.status === 'success') {
        alert('Payment plan generated successfully!');
        setShowPaymentPlanForm(false);
        // Refresh the offered plots list
        await fetchPlotsOnOffer();
      } else {
        alert(response.data.message || 'Failed to generate payment plan. Please try again.');
      }
    } catch (error) {
      console.error('Error generating payment plan:', error);
      alert(error.response?.data?.message || 'Error generating payment plan. Please try again.');
    } finally {
      setGeneratingPaymentPlan(false);
    }
  };

  // Handle restructure payment plan - FIXED validation
  const handleRestructurePaymentPlan = async () => {
    if (!selectedPlotForRestructure || !memberNumber) {
      alert('Missing member or plot information');
      return;
    }
    
    // Validate form with better error messages
    if (!restructureMonths) {
      alert('Please enter payment plan duration');
      return;
    }
    
    if (!restructureInstallments) {
      alert('Please enter number of installments');
      return;
    }
    
    if (!restructureStartDate) {
      alert('Please select a start date');
      return;
    }
    
    if (!restructureReason || restructureReason.trim() === '') {
      alert('Please provide a reason for restructuring');
      return;
    }

    const months = parseInt(restructureMonths);
    const installments = parseInt(restructureInstallments);

    if (months < 1 || months > 3) {
      alert('Payment plan months must be between 1 and 3');
      return;
    }

    if (installments < 1) {
      alert('Number of installments must be at least 1');
      return;
    }

    if (installments < months) {
      alert('Number of installments cannot be less than the duration in months');
      return;
    }

    if (restructureReason.trim().length < 5) {
      alert('Please provide a more detailed reason (at least 5 characters)');
      return;
    }
    
    setRestructuringPlan(true);
    try {
      console.log('Sending restructure request:', {
        buyerNo: memberNumber,
        plotCode: selectedPlotForRestructure.plot_code,
        paymentPlanMonths: months,
        noOfInstallments: installments,
        paymentPlanStartDate: restructureStartDate,
        reasonForChange: restructureReason.trim()
      });

      const response = await api.post('/restructure-payment-plan/', {
        buyerNo: memberNumber,
        plotCode: selectedPlotForRestructure.plot_code,
        paymentPlanMonths: months,
        noOfInstallments: installments,
        paymentPlanStartDate: restructureStartDate,
        reasonForChange: restructureReason.trim()
      });
      
      if (response.data.status === 'success') {
        alert('Payment plan restructured successfully!');
        handleCloseRestructureModal();
        // Refresh the offered plots list
        await fetchPlotsOnOffer();
      } else {
        alert(response.data.message || 'Failed to restructure payment plan. Please try again.');
      }
    } catch (error) {
      console.error('Error restructuring payment plan:', error);
      
      // Better error message
      if (error.response) {
        alert(error.response.data?.message || `Server error: ${error.response.status}`);
      } else if (error.request) {
        alert('No response from server. Please check your connection.');
      } else {
        alert('Error restructuring payment plan. Please try again.');
      }
    } finally {
      setRestructuringPlan(false);
    }
  };

  // View/Preview Payment Plan PDF for any plot
  const handleViewPaymentPlan = async (plotCode) => {
    if (!plotCode) return;
    
    setPdfLoading(true);
    setDownloadingPdf(true);
    try {
      const response = await api.get('/plot-payment-plan-pdf/', {
        params: {
          plot_code: plotCode
        },
        responseType: 'blob',
        timeout: 30000
      });
      
      // Check if response is PDF
      const contentType = response.headers['content-type'];
      
      if (contentType?.includes('application/json')) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const errorData = JSON.parse(reader.result);
            alert(errorData.error || 'Failed to load payment plan. Please generate one first.');
          } catch {
            alert('Failed to load payment plan. Please try again.');
          }
        };
        reader.readAsText(response.data);
        return;
      }
      
      // Create blob URL for preview
      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      
      setPdfPreviewUrl(fileURL);
      setPdfPlotCode(plotCode);
      setShowPdfPreviewModal(true);
      
    } catch (error) {
      console.error('Error loading payment plan PDF:', error);
      
      // Check if error response is JSON
      if (error.response?.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const errorData = JSON.parse(reader.result);
            alert(errorData.error || 'Failed to load payment plan. Please generate one first.');
          } catch {
            alert('Failed to load payment plan. Please try again.');
          }
        };
        reader.readAsText(error.response.data);
      } else {
        alert('No payment plan found. Please generate one first.');
      }
    } finally {
      setPdfLoading(false);
      setDownloadingPdf(false);
    }
  };

  // Check if plot can be restructured - ONLY for ACTIVE offer status
  const canRestructure = (plot) => {
    return plot.plot_offer_status?.toLowerCase() === 'active';
  };

  if (!memberNumber) {
    return (
      <div className="loading-state">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
        <p>Loading member information...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
        <p>Loading booked plots...</p>
      </div>
    );
  }

  const entries = plots?.data?.all_entries || [];
  const summary = plots?.data?.summary;

  if (!entries.length) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <i className="fas fa-map-marked-alt"></i>
        </div>
        <h3>No Booked Plots</h3>
        <p>You haven't booked any plots yet. Start your investment journey today!</p>
        <button className="refresh-btn" onClick={onRefresh}>
          <i className="fas fa-sync-alt"></i> Check for Updates
        </button>
      </div>
    );
  }

  return (
    <div className="booked-plots-container">
      {/* Offer Modal - Dedicated page for plots on offer */}
      {showOfferModal && (
        <div className="modal-overlay">
          <div className="modal-container modal-lg">
            <div className="modal-header">
              <h2>
                {showPaymentPlanForm ? 'Generate Payment Plan' : 'Plots on Offer'}
              </h2>
              <button className="modal-close-btn" onClick={handleCloseOfferModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body">
              {showPaymentPlanForm ? (
                // Payment Plan Form View (Start Date removed)
                <div className="payment-plan-form">
                  <div className="selected-plot-info">
                    <h3>Generate Payment Plan</h3>
                    <div className="selected-plot-card">
                      <div className="plot-header">
                        <span className="plot-icon">
                          <i className="fas fa-map-pin"></i>
                        </span>
                        <div>
                          <h4>{selectedPlot?.plot_code}</h4>
                          <p className="plot-land">Land: {selectedPlot?.land_code}</p>
                          <p className="plot-buyer">Buyer No: {memberNumber}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3>Payment Plan Details</h3>
                  <p className="form-description">
                    Fill in the payment plan details below
                  </p>
                  
                  <div className="form-grid two-columns">
                    <div className="form-group">
                      <label htmlFor="paymentPlanMonths">
                        Payment Plan Duration (Months) <span className="required">*</span>
                      </label>
                      <input
                        type="number"
                        id="paymentPlanMonths"
                        className="form-input"
                        value={paymentPlanMonths}
                        onChange={(e) => setPaymentPlanMonths(e.target.value)}
                        min="1"
                        max="3"
                        placeholder="Enter 1, 2, or 3"
                        required
                      />
                      <small className="field-hint">Minimum: 1 month, Maximum: 3 months</small>
                    </div>

                    <div className="form-group">
                      <label htmlFor="noOfInstallments">
                        Number of Installments <span className="required">*</span>
                      </label>
                      <input
                        type="number"
                        id="noOfInstallments"
                        className="form-input"
                        value={noOfInstallments}
                        onChange={(e) => setNoOfInstallments(e.target.value)}
                        min="1"
                        placeholder="Enter number of installments"
                        required
                      />
                      <small className="field-hint">
                        Must be at least equal to duration months
                      </small>
                    </div>
                    
                    {/* Start Date field has been removed */}
                  </div>

                  <div className="form-actions">
                    <button 
                      className="btn-secondary"
                      onClick={() => setShowPaymentPlanForm(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      className="btn-primary"
                      onClick={handleGeneratePaymentPlan}
                      disabled={generatingPaymentPlan || !paymentPlanMonths || !noOfInstallments || parseInt(noOfInstallments) < parseInt(paymentPlanMonths)}
                    >
                      {generatingPaymentPlan ? (
                        <>
                          <div className="spinner-small"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-file-signature"></i> Generate Payment Plan
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                // Plots on Offer View
                <>
                  <div className="offer-header">
                    <div className="offer-header-content">
                      <i className="fas fa-hand-holding-usd"></i>
                      <div>
                        <h3>Available Plots for Payment Plan</h3>
                        <p className="member-info">Member Number: {memberNumber}</p>
                      </div>
                    </div>
                  </div>

                  <div className="offered-plots-section">
                    {loadingOffers ? (
                      <div className="loading-offers">
                        <div className="spinner-small"></div>
                        <p>Loading your offered plots...</p>
                      </div>
                    ) : offeredPlots.length === 0 ? (
                      <div className="no-offers">
                        <div className="no-offers-icon">
                          <i className="fas fa-inbox"></i>
                        </div>
                        <h3>No Plots Available</h3>
                        <p>You don't have any plots on offer at the moment.</p>
                        <p className="no-offers-hint">
                          Plots will appear here when they are ready for payment plan setup.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="offers-summary">
                          <span className="offers-count">
                            <i className="fas fa-chart-line"></i>
                            {offeredPlots.length} {offeredPlots.length === 1 ? 'Plot' : 'Plots'} Available
                          </span>
                        </div>
                        <div className="offered-plots-grid">
                          {offeredPlots.map((plot, index) => (
                            <div key={index} className="offered-plot-card">
                              <div className="card-header">
                                <div className="plot-id">
                                  <span className="plot-icon">
                                    <i className="fas fa-map-pin"></i>
                                  </span>
                                  <div>
                                    <h4>{plot.plot_code}</h4>
                                    <p className="plot-land">Land: {plot.land_code}</p>
                                  </div>
                                </div>
                                <span className={`offer-status status-${plot.plot_offer_status?.toLowerCase()}`}>
                                  {plot.plot_offer_status}
                                </span>
                              </div>
                              
                              <div className="card-body">
                                <div className="plot-details-grid">
                                  <div className="detail-item">
                                    <span className="detail-label">
                                      <i className="fas fa-vector-square"></i> Area
                                    </span>
                                    <span className="detail-value">{plot.area} acres</span>
                                  </div>
                                  <div className="detail-item">
                                    <span className="detail-label">
                                      <i className="fas fa-tag"></i> Member Price
                                    </span>
                                    <span className="detail-value price">
                                      KES {parseFloat(plot.member_price || 0).toLocaleString('en-KE')}
                                    </span>
                                  </div>
                                  <div className="detail-item">
                                    <span className="detail-label">
                                      <i className="fas fa-coins"></i> Balance
                                    </span>
                                    <span className={`detail-value ${plot.balance > 0 ? 'text-warning' : plot.balance < 0 ? 'text-success' : ''}`}>
                                      KES {parseFloat(plot.balance || 0).toLocaleString('en-KE')}
                                    </span>
                                  </div>
                                  <div className="detail-item">
                                    <span className="detail-label">
                                      <i className="fas fa-info-circle"></i> Plot Status
                                    </span>
                                    <span className={`status-badge ${plot.plot_status?.toLowerCase()}`}>
                                      {plot.plot_status}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="card-footer plot-actions">
                                {/* Generate Payment Plan Button */}
                                <button 
                                  className="btn-primary btn-sm"
                                  onClick={() => handleShowPaymentPlanFormForPlot(plot)}
                                >
                                  <i className="fas fa-file-signature"></i> Generate Plan
                                </button>
                                
                                {/* View Payment Plan Button */}
                                <button 
                                  className="btn-outline btn-sm"
                                  onClick={() => handleViewPaymentPlan(plot.plot_code)}
                                  disabled={pdfLoading}
                                >
                                  <i className="fas fa-file-pdf"></i> View Plan
                                </button>
                                
                                {/* Restructure Button - ONLY for ACTIVE offer status */}
                                {canRestructure(plot) && (
                                  <button 
                                    className="btn-warning btn-sm"
                                    onClick={() => handleOpenRestructureModalForOfferedPlot(plot)}
                                  >
                                    <i className="fas fa-edit"></i> Restructure
                                  </button>
                                )}

                                {/* Payment Button - Always visible */}
                                <button 
                                  className="btn-success btn-sm"
                                  onClick={() => handleOpenPaymentModal(plot)}
                                >
                                  <i className="fas fa-credit-card"></i> Make Payment
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
            
            <div className="modal-footer">
              {!showPaymentPlanForm && (
                <button 
                  className="btn-secondary"
                  onClick={handleCloseOfferModal}
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal - Aligned with PlotModal approach */}
      {showPaymentModal && selectedPlot && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>
                <i className="fas fa-credit-card"></i> Make Payment
              </h2>
              <button className="modal-close-btn" onClick={handleClosePaymentModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="selected-plot-info">
                <h3>Payment Details</h3>
                <div className="selected-plot-card">
                  <div className="plot-header">
                    <span className="plot-icon">
                      <i className="fas fa-map-pin"></i>
                    </span>
                    <div>
                      <h4>{selectedPlot.plot_code}</h4>
                      <p className="plot-land">Land: {selectedPlot.land_code}</p>
                      <p className="plot-buyer">Member No: {memberNumber}</p>
                    </div>
                  </div>
                  
                  {/* Plot Financial Summary */}
                  <div className="plot-financial-summary">
                    <div className="summary-item">
                      <span className="summary-label">Member Price:</span>
                      <span className="summary-value">
                        {formatCurrency(selectedPlot.member_price)}
                      </span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Current Balance:</span>
                      <span className={`summary-value ${selectedPlot.balance > 0 ? 'text-warning' : 'text-success'}`}>
                        {formatCurrency(selectedPlot.balance)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handlePaymentSubmit} className="payment-form">
                <div className="form-grid two-columns">
                  <div className="form-group">
                    <label htmlFor="amount">
                      Amount (KES) <span className="required">*</span>
                    </label>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      className="form-input"
                      value={paymentFormData.amount}
                      onChange={handlePaymentInputChange}
                      min="1"
                      step="0.01"
                      placeholder="Enter amount"
                      required
                      disabled={paymentProcessing}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="referenceNo">
                      Reference Number <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="referenceNo"
                      name="referenceNo"
                      className="form-input"
                      value={paymentFormData.referenceNo}
                      onChange={handlePaymentInputChange}
                      placeholder="Enter reference number"
                      required
                      disabled={paymentProcessing}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="paymentDate">
                      Payment Date <span className="required">*</span>
                    </label>
                    <input
                      type="date"
                      id="paymentDate"
                      name="paymentDate"
                      className="form-input"
                      value={paymentFormData.paymentDate}
                      onChange={handlePaymentInputChange}
                      max={today}
                      required
                      disabled={paymentProcessing}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="paymentTime">
                      Payment Time <span className="required">*</span>
                    </label>
                    <input
                      type="time"
                      id="paymentTime"
                      name="paymentTime"
                      className="form-input"
                      value={paymentFormData.paymentTime}
                      onChange={handlePaymentInputChange}
                      required
                      disabled={paymentProcessing}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="plotCode">Plot Code</label>
                    <input
                      type="text"
                      id="plotCode"
                      name="plotCode"
                      className="form-input"
                      value={paymentFormData.plotCode || selectedPlot.plot_code}
                      onChange={handlePaymentInputChange}
                      placeholder="Plot code (optional)"
                      disabled={paymentProcessing}
                    />
                    <small className="field-hint">Leave blank for general payments</small>
                  </div>
                </div>

                {/* Payment Status Message - Aligned with PlotModal */}
                {paymentMessage && (
                  <div className={`payment-message ${paymentStatus}`}>
                    <i className={`fas ${getPaymentStatusMessage().icon}`} style={{ color: getPaymentStatusMessage().color }}></i>
                    <p>{paymentMessage}</p>
                  </div>
                )}

                {paymentStatus === 'pending' && (
                  <div className="payment-instructions">
                    <h4>Processing Payment:</h4>
                    <div className="payment-timer">
                      <i className="fas fa-spinner fa-pulse"></i>
                      <span>Please wait while we process your payment...</span>
                    </div>
                  </div>
                )}

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={handleClosePaymentModal}
                    disabled={paymentProcessing}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={paymentProcessing}
                  >
                    {paymentProcessing ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check-circle"></i> Submit Payment
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="payment-info-note">
                <i className="fas fa-info-circle"></i>
                <p>
                  Transaction Type: <strong>General Receipt (3)</strong>. 
                  This payment will be recorded as a general receipt against your account.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF Preview Modal */}
      {showPdfPreviewModal && pdfPreviewUrl && (
        <div className="modal-overlay pdf-preview-overlay">
          <div className="modal-container pdf-preview-container">
            <div className="modal-header">
              <h2>
                <i className="fas fa-file-pdf"></i> 
                Payment Plan - {pdfPlotCode}
              </h2>
              <button className="modal-close-btn" onClick={handleClosePdfPreviewModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body pdf-preview-body">
              <div className="pdf-viewer">
                <iframe
                  src={pdfPreviewUrl}
                  title={`Payment Plan - ${pdfPlotCode}`}
                  width="100%"
                  height="600px"
                  style={{ border: 'none' }}
                />
              </div>
            </div>
            
            <div className="modal-footer pdf-preview-footer">
              <div className="pdf-info">
                <i className="fas fa-info-circle"></i>
                Preview of payment plan for plot {pdfPlotCode}
              </div>
              <div className="pdf-actions">
                <button 
                  className="btn-secondary" 
                  onClick={handleClosePdfPreviewModal}
                >
                  Close
                </button>
                <button 
                  className="btn-primary" 
                  onClick={handleDownloadPdf}
                >
                  <i className="fas fa-download"></i> Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Restructure Payment Plan Modal - FIXED */}
      {showRestructureModal && selectedPlotForRestructure && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Restructure Payment Plan</h2>
              <button className="modal-close-btn" onClick={handleCloseRestructureModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="selected-plot-info">
                <h3>Selected Plot</h3>
                <div className="selected-plot-card">
                  <div className="plot-header">
                    <span className="plot-icon">
                      <i className="fas fa-map-pin"></i>
                    </span>
                    <div>
                      <h4>{selectedPlotForRestructure.plot_code}</h4>
                      <p className="plot-land">Land: {selectedPlotForRestructure.land_code}</p>
                      <p className="plot-buyer">Buyer No: {memberNumber}</p>
                      <div className="offer-badge active">
                        <i className="fas fa-check-circle"></i> Offer Status: Active
                      </div>
                    </div>
                  </div>
                  
                  {/* Plot Financial Summary */}
                  <div className="plot-financial-summary">
                    <div className="summary-item">
                      <span className="summary-label">Member Price:</span>
                      <span className="summary-value">
                        {formatCurrency(selectedPlotForRestructure.member_price)}
                      </span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Current Balance:</span>
                      <span className={`summary-value ${selectedPlotForRestructure.balance > 0 ? 'text-warning' : 'text-success'}`}>
                        {formatCurrency(selectedPlotForRestructure.balance)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <h3>Restructure Details</h3>
              <p className="form-description">
                Modify your existing payment plan below
              </p>
              
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="restructureMonths">
                    New Payment Plan Duration (Months) <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    id="restructureMonths"
                    className="form-input"
                    value={restructureMonths}
                    onChange={(e) => setRestructureMonths(e.target.value)}
                    min="1"
                    max="3"
                    placeholder="Enter 1, 2, or 3"
                    required
                  />
                  <small className="field-hint">Minimum: 1 month, Maximum: 3 months</small>
                </div>

                <div className="form-group">
                  <label htmlFor="restructureInstallments">
                    New Number of Installments <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    id="restructureInstallments"
                    className="form-input"
                    value={restructureInstallments}
                    onChange={(e) => setRestructureInstallments(e.target.value)}
                    min="1"
                    placeholder="Enter number of installments"
                    required
                  />
                  <small className="field-hint">
                    Must be at least equal to duration months
                  </small>
                </div>

                <div className="form-group">
                  <label htmlFor="restructureStartDate">
                    New Start Date <span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    id="restructureStartDate"
                    className="form-input"
                    value={restructureStartDate}
                    onChange={(e) => setRestructureStartDate(e.target.value)}
                    min={today}
                    required
                  />
                  <small className="field-hint">Start date cannot be in the past</small>
                </div>

                {/* REASON FOR CHANGE - LENGTHENED HORIZONTALLY */}
                <div className="form-group full-width reason-full-width">
                  <label htmlFor="restructureReason">
                    Reason for Change <span className="required">*</span>
                  </label>
                  <textarea
                    id="restructureReason"
                    className="form-textarea reason-textarea"
                    value={restructureReason}
                    onChange={(e) => setRestructureReason(e.target.value)}
                    placeholder="Please provide a reason for restructuring your payment plan"
                    rows="4"
                    required
                  />
                  <small className="field-hint">Minimum 5 characters</small>
                </div>
              </div>
              
              {/* ===== SUMMARY OF CHANGES SECTION REMOVED ===== */}
              
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn-secondary" 
                onClick={handleCloseRestructureModal}
              >
                Cancel
              </button>
              <button 
                className="btn-warning"
                onClick={handleRestructurePaymentPlan}
                disabled={restructuringPlan}
              >
                {restructuringPlan ? (
                  <>
                    <div className="spinner-small"></div>
                    Restructuring...
                  </>
                ) : (
                  <>
                    <i className="fas fa-file-invoice"></i> Restructure Plan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="page-header">
        <div className="header-content">
          <h1>My Booked Plots</h1>
          <p className="page-subtitle">
            Track and manage all your plot investments in one place
          </p>
        </div>
        
        <div className="header-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <div className="stat-content">
              <h3>{entries.length}</h3>
              <p>Total Plots</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-content">
              <h3>{summary?.confirmed_bookings || entries.length}</h3>
              <p>Confirmed</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-content">
              <h3>{entries.filter(p => !p.commitment_paid).length}</h3>
              <p>Pending Payment</p>
            </div>
          </div>
        </div>
      </div>

      <div className="plots-grid">
        {entries.map((plot, index) => (
          <div key={index} className="plot-card">
            <div className="card-header">
              <div className="plot-id">
                <span className="plot-icon">
                  <i className="fas fa-map-pin"></i>
                </span>
                <div>
                  <h4>{plot.plot_code}</h4>
                  <p className="plot-land">Land: {plot.land_code}</p>
                </div>
              </div>
              
              <span className={`status-badge status-${plot.booking_status?.toLowerCase()}`}>
                <span className="status-dot"></span>
                {plot.booking_status}
              </span>
            </div>
            
            <div className="card-footer">
              {plot.booking_status === 'Completed' && (
                <div className="plot-actions">
                  {/* Offer Button - Opens dedicated modal */}
                  <button 
                    className="btn-primary"
                    onClick={handleOpenOfferModal}
                  >
                    <i className="fas fa-hand-holding-usd"></i> Offer
                  </button>
                </div>
              )}
              {plot.booking_status !== 'Completed' && (
                <button className="btn-disabled" disabled>
                  <i className="fas fa-lock"></i> Complete Payment First
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