// src/components/investments/PlotBooking.jsx
import React, { useState, useEffect } from 'react';
import { authService } from '../../services/authService';

const PlotBooking = ({ memberNo, memberName, lands, onPlotBooked, generateBookingNumber }) => {
  const [formData, setFormData] = useState({
    bookingNo: '',
    landCode: '',
    plotCode: '',
    bookingDate: new Date().toISOString().split('T')[0],
    buyerName: '',
    bookingFee: ''
  });
  const [availablePlots, setAvailablePlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Generate initial booking number
    setFormData(prev => ({
      ...prev,
      bookingNo: generateBookingNumber(),
      buyerName: memberName || ''
    }));
  }, [generateBookingNumber, memberName]);

  const handleLandChange = async (landCode) => {
    setFormData(prev => ({ ...prev, landCode, plotCode: '' }));
    
    if (landCode) {
      setLoading(true);
      try {
        const response = await authService.getPlotsByLand(landCode);
        if (response.success) {
          // Filter available plots
          const available = response.plots.filter(
            plot => plot['Plot Status']?.toLowerCase() === 'available'
          );
          setAvailablePlots(available);
        }
      } catch (err) {
        console.error('Error loading plots:', err);
        setAvailablePlots([]);
      } finally {
        setLoading(false);
      }
    } else {
      setAvailablePlots([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const bookingData = {
        ...formData,
        memberNo: memberNo, // This now uses the member number from account details
        bookingFee: parseFloat(formData.bookingFee)
      };

      const response = await authService.bookPlot(bookingData);
      
      if (response.success) {
        setMessage('Plot booked successfully!');
        setFormData({
          bookingNo: generateBookingNumber(),
          landCode: '',
          plotCode: '',
          bookingDate: new Date().toISOString().split('T')[0],
          buyerName: memberName || '',
          bookingFee: ''
        });
        setAvailablePlots([]);
        onPlotBooked();
      } else {
        setMessage(response.error || 'Failed to book plot');
      }
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error booking plot');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="plot-booking">
      <div className="booking-header">
        <h2>Book New Plot</h2>
        <p>Fill in the details below to book your investment plot</p>
      </div>
      
      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-row">
          <div className="form-group">
            <label>Booking Number:</label>
            <input
              type="text"
              name="bookingNo"
              value={formData.bookingNo}
              onChange={handleChange}
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
            onChange={handleChange}
            required
            placeholder="Enter buyer's full name"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Select Land:</label>
            <select
              name="landCode"
              value={formData.landCode}
              onChange={(e) => handleLandChange(e.target.value)}
              required
            >
              <option value="">Select Land</option>
              {lands.map((land, index) => (
                <option key={index} value={land['Land Code']}>
                  {land.Description} ({land['Land Code']})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Select Plot:</label>
            <select
              name="plotCode"
              value={formData.plotCode}
              onChange={handleChange}
              required
              disabled={!formData.landCode || loading}
            >
              <option value="">Select Plot</option>
              {availablePlots.map((plot, index) => (
                <option key={index} value={plot['Plot Code.']}>
                  {plot['Plot Code.']} - {plot.Area} acres
                </option>
              ))}
            </select>
            {loading && <span className="loading-text">Loading plots...</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Booking Date:</label>
            <input
              type="date"
              name="bookingDate"
              value={formData.bookingDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Booking Fee (KSh):</label>
            <input
              type="number"
              name="bookingFee"
              value={formData.bookingFee}
              onChange={handleChange}
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

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? (
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
      </form>
    </div>
  );
};

export default PlotBooking;