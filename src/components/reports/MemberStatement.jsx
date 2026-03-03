// src/components/reports/MemberStatement.jsx
import React, { useState, useRef } from 'react';

const MemberStatement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: getFirstDayOfMonth(),
    endDate: getToday(),
  });
  
  const [memberNumber, setMemberNumber] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [autoDownload, setAutoDownload] = useState(true);
  const [includeTransactions, setIncludeTransactions] = useState(true);
  const [includeShares, setIncludeShares] = useState(true);
  const [includeLoans, setIncludeLoans] = useState(true);

  // Helper functions
  function getToday() {
    const today = new Date();
    return formatDate(today);
  }

  function getFirstDayOfMonth() {
    const today = new Date();
    return formatDate(new Date(today.getFullYear(), today.getMonth(), 1));
  }

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleMemberNumberChange = (e) => {
    setMemberNumber(e.target.value);
    setError('');
  };

  const generateReport = async (shouldAutoDownload = autoDownload) => {
    setError('');
    setSuccess('');
    setPdfUrl('');
    
    if (!memberNumber.trim()) {
      setError('Please enter a member number');
      return;
    }
    
    setLoading(true);
    
    try {
      const memberNo = memberNumber.trim();
      
      // Build API URL with parameters
      let apiUrl = `http://127.0.0.1:8000/api/member-detailed-report/?member_no=${memberNo}`;
      
      // Add date filter if provided
      if (dateRange.startDate) {
        apiUrl += `&filter=${dateRange.startDate}`;
      }
      
      // Add optional parameters
      if (includeTransactions) {
        apiUrl += `&include_transactions=true`;
      }
      
      if (includeShares) {
        apiUrl += `&include_shares=true`;
      }
      
      if (includeLoans) {
        apiUrl += `&include_loans=true`;
      }
      
      console.log('Fetching from:', apiUrl);
      
      // Fetch API with proper handling
      const response = await fetch(apiUrl);
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        // Try to read error message
        const errorText = await response.text();
        console.error('Error response:', errorText);
        
        let errorMessage = `Server error: ${response.status}`;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || errorJson.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }
      
      // Check if response is PDF
      const contentType = response.headers.get('content-type');
      console.log('Content-Type:', contentType);
      
      if (contentType && contentType.includes('application/pdf')) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        setPdfUrl(url);
        
        // Auto-download if enabled
        if (shouldAutoDownload) {
          const link = document.createElement('a');
          link.href = url;
          link.download = `member-statement-${memberNo}-${dateRange.startDate}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Clean up URL after download
          setTimeout(() => {
            window.URL.revokeObjectURL(url);
          }, 100);
        }
        
        setSuccess(`Member statement generated for Member ${memberNo}`);
      } else {
        // Not a PDF - might be JSON error
        const text = await response.text();
        console.error('Non-PDF response:', text);
        
        try {
          const json = JSON.parse(text);
          setError(json.error || json.message || 'Server returned non-PDF response');
        } catch {
          setError(`Server returned: ${text.substring(0, 100)}...`);
        }
      }
      
    } catch (err) {
      console.error('Full error:', err);
      
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        setError('Network error. Please check:\n1. Is Django server running at http://127.0.0.1:8000?\n2. Check browser console for CORS errors');
      } else {
        setError(err.message || 'Failed to generate report');
      }
    } finally {
      setLoading(false);
    }
  };

  // Direct download method (bypasses React state)
  const directDownload = () => {
    if (!memberNumber.trim()) {
      setError('Please enter a member number');
      return;
    }
    
    const memberNo = memberNumber.trim();
    let url = `http://127.0.0.1:8000/api/member-detailed-report/?member_no=${memberNo}`;
    
    if (dateRange.startDate) {
      url += `&filter=${dateRange.startDate}`;
    }
    
    // Add optional parameters
    if (includeTransactions) {
      url += `&include_transactions=true`;
    }
    
    if (includeShares) {
      url += `&include_shares=true`;
    }
    
    if (includeLoans) {
      url += `&include_loans=true`;
    }
    
    // Create hidden iframe to trigger download
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);
    
    // Remove after some time
    setTimeout(() => {
      iframe.remove();
    }, 5000);
    
    setSuccess('Report download started...');
  };

  // Open in new tab
  const openInNewTab = () => {
    if (!memberNumber.trim()) {
      setError('Please enter a member number');
      return;
    }
    
    const memberNo = memberNumber.trim();
    let url = `http://127.0.0.1:8000/api/member-detailed-report/?member_no=${memberNo}`;
    
    if (dateRange.startDate) {
      url += `&filter=${dateRange.startDate}`;
    }
    
    // Add optional parameters
    if (includeTransactions) {
      url += `&include_transactions=true`;
    }
    
    if (includeShares) {
      url += `&include_shares=true`;
    }
    
    if (includeLoans) {
      url += `&include_loans=true`;
    }
    
    window.open(url, '_blank');
    
    setSuccess('Opening report in new tab...');
  };

  return (
    <div className="member-statement-card">
      {/* Card Header */}
      <div className="card-header">
        <div className="header-icon">
          <i className="fas fa-file-invoice-dollar"></i>
        </div>
        <div className="header-content">
          <h3>Member Detailed Statement</h3>
          <p>Generate comprehensive member account statement with transactions, shares, and loans</p>
        </div>
      </div>

      {/* Settings Section */}
      <div className="settings-section">
        <h4>Report Settings</h4>
        <div className="toggle-group">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={autoDownload}
              onChange={(e) => setAutoDownload(e.target.checked)}
              className="toggle-input"
            />
            <span className="toggle-slider"></span>
            <span className="toggle-text">Auto-download PDF after generation</span>
          </label>
        </div>
        
        <div className="report-options">
          <h4>Include in Report:</h4>
          <div className="options-grid">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={includeTransactions}
                onChange={(e) => setIncludeTransactions(e.target.checked)}
                className="checkbox-input"
              />
              <span className="checkbox-custom"></span>
              <span className="checkbox-text">
                <i className="fas fa-exchange-alt"></i> Transactions
              </span>
            </label>
            
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={includeShares}
                onChange={(e) => setIncludeShares(e.target.checked)}
                className="checkbox-input"
              />
              <span className="checkbox-custom"></span>
              <span className="checkbox-text">
                <i className="fas fa-chart-pie"></i> Shares
              </span>
            </label>
            
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={includeLoans}
                onChange={(e) => setIncludeLoans(e.target.checked)}
                className="checkbox-input"
              />
              <span className="checkbox-custom"></span>
              <span className="checkbox-text">
                <i className="fas fa-file-contract"></i> Loans
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Member Number Input */}
      <div className="member-input-section">
        <h4>Enter Member Details</h4>
        <div className="member-input-group">
          <label htmlFor="memberNumber">
            <i className="fas fa-user"></i> Member Number
          </label>
          <input
            type="text"
            id="memberNumber"
            name="memberNumber"
            value={memberNumber}
            onChange={handleMemberNumberChange}
            placeholder="Enter member number (e.g., CUST024)"
            className="member-input"
          />
        </div>
      </div>

      {/* Date Input */}
      <div className="date-range-section">
        <h4>Select Statement Date</h4>
        <div className="date-input-group">
          <label htmlFor="startDate">
            <i className="fas fa-calendar-alt"></i> As of Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={dateRange.startDate}
            onChange={handleDateChange}
            className="date-input"
          />
          <p className="date-hint">The statement will show transactions up to this date</p>
        </div>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          <div className="error-content">
            <strong>Error:</strong>
            <div style={{ whiteSpace: 'pre-wrap', marginTop: '0.5rem' }}>{error}</div>
          </div>
        </div>
      )}
      
      {success && (
        <div className="success-message">
          <i className="fas fa-check-circle"></i>
          <span>{success}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="action-buttons">
        <button 
          className="btn-generate"
          onClick={() => generateReport(autoDownload)}
          disabled={loading || !memberNumber.trim()}
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              Generating Statement...
            </>
          ) : (
            <>
              <i className="fas fa-file-pdf"></i>
              Generate Member Statement
            </>
          )}
        </button>
        
        <button 
          className="btn-secondary"
          onClick={directDownload}
          disabled={!memberNumber.trim()}
        >
          <i className="fas fa-download"></i>
          Direct Download
        </button>
        
        <button 
          className="btn-secondary"
          onClick={openInNewTab}
          disabled={!memberNumber.trim()}
        >
          <i className="fas fa-external-link-alt"></i>
          Open in New Tab
        </button>
      </div>

      {/* Report Preview */}
      {pdfUrl && (
        <div className="preview-section">
          <h4>Statement Preview</h4>
          <div className="pdf-preview">
            <iframe
              src={pdfUrl}
              title="Member Statement Preview"
              className="pdf-iframe"
            />
          </div>
        </div>
      )}

      <style jsx>{`
        .member-statement-card {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          max-width: 800px;
          margin: 2rem auto;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid #f1f5f9;
        }

        .header-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          background: linear-gradient(135deg, #7A1F23, #9a2f35);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
        }

        .header-content h3 {
          margin: 0;
          font-size: 1.5rem;
          color: #1e293b;
          font-weight: 600;
        }

        .header-content p {
          margin: 0.25rem 0 0 0;
          color: #64748b;
          font-size: 0.95rem;
        }

        .settings-section {
          margin-bottom: 1.5rem;
          padding: 1.5rem;
          background: #f8fafc;
          border-radius: 0.75rem;
          border: 1px solid #e2e8f0;
        }

        .settings-section h4 {
          margin: 0 0 1rem 0;
          color: #1e293b;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .toggle-group {
          margin-bottom: 1.5rem;
        }

        .toggle-label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
        }

        .toggle-input {
          display: none;
        }

        .toggle-slider {
          width: 44px;
          height: 24px;
          background: #cbd5e1;
          border-radius: 24px;
          position: relative;
          transition: background 0.3s ease;
        }

        .toggle-slider:before {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          top: 2px;
          left: 2px;
          transition: transform 0.3s ease;
        }

        .toggle-input:checked + .toggle-slider {
          background: #7A1F23;
        }

        .toggle-input:checked + .toggle-slider:before {
          transform: translateX(20px);
        }

        .toggle-text {
          font-weight: 500;
          color: #334155;
        }

        .report-options h4 {
          margin: 0 0 0.75rem 0;
          font-size: 0.95rem;
          color: #475569;
        }

        .options-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 0.75rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          padding: 0.5rem;
          background: white;
          border-radius: 0.5rem;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }

        .checkbox-label:hover {
          background: #f1f5f9;
          border-color: #94a3b8;
        }

        .checkbox-input {
          display: none;
        }

        .checkbox-custom {
          width: 18px;
          height: 18px;
          border: 2px solid #cbd5e1;
          border-radius: 4px;
          display: inline-block;
          position: relative;
          transition: all 0.2s ease;
        }

        .checkbox-input:checked + .checkbox-custom {
          background: #7A1F23;
          border-color: #7A1F23;
        }

        .checkbox-input:checked + .checkbox-custom:after {
          content: '✓';
          position: absolute;
          color: white;
          font-size: 12px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .checkbox-text {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #334155;
          font-size: 0.9rem;
        }

        .checkbox-text i {
          color: #64748b;
          width: 16px;
        }

        .member-input-section {
          margin-bottom: 1.5rem;
        }

        .member-input-section h4 {
          margin: 0 0 1rem 0;
          color: #1e293b;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .member-input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .member-input-group label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #475569;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .member-input {
          width: 100%;
          padding: 0.875rem;
          border: 2px solid #e2e8f0;
          border-radius: 0.75rem;
          font-size: 1rem;
          transition: border-color 0.3s ease;
          background: white;
        }

        .member-input:focus {
          outline: none;
          border-color: #7A1F23;
          box-shadow: 0 0 0 3px rgba(122, 31, 35, 0.1);
        }

        .date-range-section {
          margin-bottom: 1.5rem;
        }

        .date-range-section h4 {
          margin: 0 0 1rem 0;
          color: #1e293b;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .date-input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .date-input-group label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #475569;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .date-input {
          width: 100%;
          padding: 0.875rem;
          border: 2px solid #e2e8f0;
          border-radius: 0.75rem;
          font-size: 1rem;
          transition: border-color 0.3s ease;
          background: white;
        }

        .date-input:focus {
          outline: none;
          border-color: #7A1F23;
          box-shadow: 0 0 0 3px rgba(122, 31, 35, 0.1);
        }

        .date-hint {
          margin: 0.25rem 0 0 0;
          color: #64748b;
          font-size: 0.8rem;
          font-style: italic;
        }

        .error-message {
          background: #fee2e2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 1rem;
          border-radius: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .error-content {
          margin-left: 0.5rem;
        }

        .success-message {
          background: #d1fae5;
          border: 1px solid #a7f3d0;
          color: #059669;
          padding: 1rem;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .btn-generate {
          flex: 2;
          background: linear-gradient(135deg, #7A1F23, #9a2f35);
          color: white;
          border: none;
          padding: 1rem 1.5rem;
          border-radius: 0.75rem;
          cursor: pointer;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          transition: all 0.3s ease;
          min-width: 200px;
          justify-content: center;
        }

        .btn-generate:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(122, 31, 35, 0.3);
        }

        .btn-generate:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-secondary {
          flex: 1;
          background: #f1f5f9;
          color: #475569;
          border: 2px solid #e2e8f0;
          padding: 1rem 1.5rem;
          border-radius: 0.75rem;
          cursor: pointer;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          transition: all 0.3s ease;
          min-width: 150px;
          justify-content: center;
        }

        .btn-secondary:hover {
          background: #e2e8f0;
          color: #7A1F23;
          border-color: #7A1F23;
        }

        .preview-section {
          margin-bottom: 2rem;
        }

        .preview-section h4 {
          margin: 0 0 1rem 0;
          color: #1e293b;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .pdf-preview {
          border: 2px solid #e2e8f0;
          border-radius: 0.75rem;
          overflow: hidden;
        }

        .pdf-iframe {
          width: 100%;
          height: 500px;
          border: none;
        }

        @media (max-width: 768px) {
          .member-statement-card {
            padding: 1.5rem;
            margin: 1rem;
          }

          .action-buttons {
            flex-direction: column;
          }

          .btn-generate,
          .btn-secondary {
            width: 100%;
            flex: none;
          }

          .pdf-iframe {
            height: 400px;
          }

          .options-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .member-statement-card {
            padding: 1rem;
          }

          .pdf-iframe {
            height: 300px;
          }
        }
      `}</style>
    </div>
  );
};

export default MemberStatement;