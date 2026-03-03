// src/components/reports/MemberShareCertificate.jsx
import React, { useState } from 'react';

const MemberShareCertificate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [memberNumber, setMemberNumber] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [autoDownload, setAutoDownload] = useState(true);

  const handleMemberNumberChange = (e) => {
    setMemberNumber(e.target.value);
    setError('');
  };

  const generateCertificate = async (shouldAutoDownload = autoDownload) => {
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
      
      // Build API URL with only member_no parameter
      const apiUrl = `http://127.0.0.1:8000/api/member-share-certificate/?member_no=${memberNo}`;
      
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
          link.download = `share-certificate-${memberNo}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Clean up URL after download
          setTimeout(() => {
            window.URL.revokeObjectURL(url);
          }, 100);
        }
        
        setSuccess(`Share certificate generated for Member ${memberNo}`);
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
        setError(err.message || 'Failed to generate share certificate');
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
    const url = `http://127.0.0.1:8000/api/member-share-certificate/?member_no=${memberNo}`;
    
    // Create hidden iframe to trigger download
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);
    
    // Remove after some time
    setTimeout(() => {
      iframe.remove();
    }, 5000);
    
    setSuccess('Certificate download started...');
  };

  // Open in new tab
  const openInNewTab = () => {
    if (!memberNumber.trim()) {
      setError('Please enter a member number');
      return;
    }
    
    const memberNo = memberNumber.trim();
    const url = `http://127.0.0.1:8000/api/member-share-certificate/?member_no=${memberNo}`;
    
    window.open(url, '_blank');
    
    setSuccess('Opening certificate in new tab...');
  };

  return (
    <div className="share-certificate-card">
      {/* Card Header */}
      <div className="card-header">
        <div className="header-icon">
          <i className="fas fa-certificate"></i>
        </div>
        <div className="header-content">
          <h3>Member Share Certificate</h3>
          <p>Generate official share certificate showing member shareholdings</p>
        </div>
      </div>

      {/* Settings Section - Only Auto-download */}
      <div className="settings-section">
        <h4>Certificate Settings</h4>
        
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
          onClick={() => generateCertificate(autoDownload)}
          disabled={loading || !memberNumber.trim()}
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              Generating Certificate...
            </>
          ) : (
            <>
              <i className="fas fa-file-pdf"></i>
              Generate Share Certificate
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

      {/* Certificate Preview */}
      {pdfUrl && (
        <div className="preview-section">
          <h4>Certificate Preview</h4>
          <div className="pdf-preview">
            <iframe
              src={pdfUrl}
              title="Share Certificate Preview"
              className="pdf-iframe"
            />
          </div>
        </div>
      )}

      <style jsx>{`
        .share-certificate-card {
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
          background: linear-gradient(135deg, #2563EB, #1d4ed8);
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
          margin-bottom: 0.5rem;
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
          background: #2563EB;
        }

        .toggle-input:checked + .toggle-slider:before {
          transform: translateX(20px);
        }

        .toggle-text {
          font-weight: 500;
          color: #334155;
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
          border-color: #2563EB;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
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
          background: linear-gradient(135deg, #2563EB, #1d4ed8);
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
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
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
          color: #2563EB;
          border-color: #2563EB;
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
          .share-certificate-card {
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
        }

        @media (max-width: 480px) {
          .share-certificate-card {
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

export default MemberShareCertificate;