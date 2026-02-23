// src/components/Reports.jsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import MemberDepositStatement from './reports/MemberDepositStatement';
import MemberStatement from './reports/MemberStatement';
// import MemberShareCertificate from './reports/MemberShareCertificate';
import LandTransactionReport from './reports/LandTransactionReport';

const Reports = () => {
  const { username } = useSelector((state) => state.auth);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDepositReport, setShowDepositReport] = useState(false);
  const [showMemberStatement, setShowMemberStatement] = useState(false);
  // const [showShareCertificate, setShowShareCertificate] = useState(false);
  const [showLandTransaction, setShowLandTransaction] = useState(false);

  const reportTypes = [
    {
      id: 1,
      name: 'Member Statement',
      icon: 'fas fa-file-invoice-dollar',
      description: 'Detailed member account transactions and balance history',
      color: '#7A1F23',
      available: true
    },
    // {
    //   id: 2,
    //   name: 'Member Share Certificate',
    //   icon: 'fas fa-certificate',
    //   description: 'Official share certificate showing member shareholdings',
    //   color: '#2563EB',
    //   available: true
    // },
    {
      id: 3,
      name: 'Land Transaction Report',
      icon: 'fas fa-map-marked-alt',
      description: 'Land purchases, sales, and transfer history',
      color: '#10B981',
      available: true
    },
    {
      id: 4,
      name: 'Deposits Report',
      icon: 'fas fa-piggy-bank',
      description: 'Savings and fixed deposit summaries',
      color: '#DC2626',
      available: true
    },
    {
      id: 5,
      name: 'Loan Statement',
      icon: 'fas fa-file-contract',
      description: 'Loan balances and repayment schedules',
      color: '#7C3AED',
      available: false
    },
    {
      id: 6,
      name: 'Tax Certificate',
      icon: 'fas fa-file-certificate',
      description: 'Annual tax deduction certificates',
      color: '#EA580C',
      available: false
    }
  ];

  const handleReportClick = (report) => {
    setSelectedReport(report);
    console.log('Selected report:', report.name);
    
    // Reset all report show states
    setShowDepositReport(false);
    setShowMemberStatement(false);
    // setShowShareCertificate(false);
    setShowLandTransaction(false);
    
    // Show appropriate report component
    if (report.id === 1) {
      setShowMemberStatement(true);
    // } else if (report.id === 2) {
    //   setShowShareCertificate(true);
    } else if (report.id === 3) {
      setShowLandTransaction(true);
    } else if (report.id === 4) {
      setShowDepositReport(true);
    } else {
      // For other reports, you can show a modal or message
      alert(`${report.name} is coming soon!`);
    }
  };

  const handleBackToReports = () => {
    setShowDepositReport(false);
    setShowMemberStatement(false);
    // setShowShareCertificate(false);
    setShowLandTransaction(false);
    setSelectedReport(null);
  };

  // If showing member statement report
  if (showMemberStatement) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <button
            onClick={handleBackToReports}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-6"
          >
            <i className="fas fa-arrow-left"></i>
            Back to Reports
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Member Statement</h1>
          <p className="text-gray-600 mt-2">View your detailed member account transactions and balance history</p>
        </div>
        <MemberStatement />
      </div>
    );
  }

  // If showing share certificate report - COMMENTED OUT
  // if (showShareCertificate) {
  //   return (
  //     <div className="p-6">
  //       <div className="mb-6">
  //         <button
  //           onClick={handleBackToReports}
  //           className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-6"
  //         >
  //           <i className="fas fa-arrow-left"></i>
  //           Back to Reports
  //         </button>
  //         <h1 className="text-3xl font-bold text-gray-900">Member Share Certificate</h1>
  //         <p className="text-gray-600 mt-2">Generate official share certificate showing member shareholdings</p>
  //       </div>
  //       <MemberShareCertificate />
  //     </div>
  //   );
  // }

  // If showing land transaction report
  if (showLandTransaction) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <button
            onClick={handleBackToReports}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-6"
          >
            <i className="fas fa-arrow-left"></i>
            Back to Reports
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Land Transaction Report</h1>
          <p className="text-gray-600 mt-2">View land purchases, sales, and transfer history</p>
        </div>
        <LandTransactionReport />
      </div>
    );
  }

  // If showing deposit report
  if (showDepositReport) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <button
            onClick={handleBackToReports}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-6"
          >
            <i className="fas fa-arrow-left"></i>
            Back to Reports
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Deposits Report</h1>
          <p className="text-gray-600 mt-2">Generate detailed deposit transaction history</p>
        </div>
        <MemberDepositStatement />
      </div>
    );
  }

  // Otherwise, show the main reports grid
  return (
    <div className="reports-container">
      <div className="reports-content">
        <div className="content-wrapper">
          {/* Page Title */}
          <div className="page-title-section">
            <h1>Financial Reports</h1>
            <p>Welcome back, {username}! Generate and view your financial reports.</p>
          </div>
          
          {/* Quick Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-file-alt"></i>
              </div>
              <div className="stat-content">
                <h3>3</h3>
                <p>Reports Available</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="stat-content">
                <h3>3</h3>
                <p>Ready to Generate</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-clock"></i>
              </div>
              <div className="stat-content">
                <h3>3</h3>
                <p>Coming Soon</p>
              </div>
            </div>
          </div>

          {/* Reports Grid - Horizontal Layout */}
          <div className="reports-card">
            <div className="card-header">
              <h2>Available Reports</h2>
              <p>Select a report type to generate detailed financial documents</p>
            </div>
            
            <div className="report-types-horizontal">
              {reportTypes.map((report) => (
                <div 
                  key={report.id}
                  className={`report-item-horizontal ${selectedReport?.id === report.id ? 'selected' : ''} ${report.available ? 'available' : 'coming-soon'}`}
                  onClick={() => handleReportClick(report)}
                >
                  {report.available && (
                    <div className="report-badge">
                      <span className="badge-available">
                        <i className="fas fa-check"></i> Available
                      </span>
                    </div>
                  )}
                  
                  <div className="report-icon-horizontal" style={{ backgroundColor: `${report.color}15` }}>
                    <i className={report.icon} style={{ color: report.color }}></i>
                  </div>
                  <div className="report-content-horizontal">
                    <h3>{report.name}</h3>
                    <p>{report.description}</p>
                  </div>
                  <div className="report-action-horizontal">
                    <i className="fas fa-chevron-right"></i>
                  </div>
                </div>
              ))}
            </div>

            {/* Report Action Section - Only show if a report is selected */}
            {selectedReport && (
              <div className="date-range-selector">
                <h3>{selectedReport.name}</h3>
                <p className="report-description">{selectedReport.description}</p>
                
                {selectedReport.available ? (
                  <div className="report-action-container">
                    <p className="action-info">
                      <i className="fas fa-info-circle"></i>
                      Click the button below to generate your {selectedReport.name.toLowerCase()}
                    </p>
                    <button 
                      className="btn-generate"
                      onClick={() => {
                        if (selectedReport.id === 1) {
                          setShowMemberStatement(true);
                        // } else if (selectedReport.id === 2) {
                        //   setShowShareCertificate(true);
                        } else if (selectedReport.id === 3) {
                          setShowLandTransaction(true);
                        } else if (selectedReport.id === 4) {
                          setShowDepositReport(true);
                        }
                      }}
                    >
                      <i className="fas fa-play-circle"></i>
                      Generate {selectedReport.name}
                    </button>
                  </div>
                ) : (
                  <div className="coming-soon-action">
                    <div className="coming-soon-icon">
                      <i className="fas fa-tools"></i>
                    </div>
                    <p>This report feature is coming soon!</p>
                    <button 
                      className="btn-generate btn-disabled"
                      disabled
                    >
                      <i className="fas fa-clock"></i>
                      Coming Soon
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Recent Reports */}
          <div className="recent-reports">
            <h3>Recently Generated Reports</h3>
            <div className="recent-list">
              <div className="recent-item">
                <div className="recent-icon">
                  <i className="fas fa-file-pdf"></i>
                </div>
                <div className="recent-details">
                  <h4>Member Statement - Q4 2024</h4>
                  <p>Generated on Dec 15, 2024 • PDF • 2.4 MB</p>
                </div>
                <button className="btn-download">
                  <i className="fas fa-download"></i>
                </button>
              </div>
              {/* Member Share Certificate recent item - COMMENTED OUT */}
              {/* <div className="recent-item">
                <div className="recent-icon">
                  <i className="fas fa-file-pdf"></i>
                </div>
                <div className="recent-details">
                  <h4>Member Share Certificate - John Doe</h4>
                  <p>Generated on Dec 20, 2024 • PDF • 1.2 MB</p>
                </div>
                <button className="btn-download">
                  <i className="fas fa-download"></i>
                </button>
              </div> */}
              <div className="recent-item">
                <div className="recent-icon">
                  <i className="fas fa-file-pdf"></i>
                </div>
                <div className="recent-details">
                  <h4>Land Transaction Report - Plot A23</h4>
                  <p>Generated on Dec 22, 2024 • PDF • 3.1 MB</p>
                </div>
                <button className="btn-download">
                  <i className="fas fa-download"></i>
                </button>
              </div>
              <div className="recent-item">
                <div className="recent-icon">
                  <i className="fas fa-file-excel"></i>
                </div>
                <div className="recent-details">
                  <h4>Deposits Report - November</h4>
                  <p>Generated on Dec 1, 2024 • Excel • 1.8 MB</p>
                </div>
                <button className="btn-download">
                  <i className="fas fa-download"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* All your existing styles remain exactly the same */
        .reports-container {
          width: 100%;
          min-height: calc(100vh - 80px);
        }

        .reports-content {
          width: 100%;
          padding: 30px;
          min-height: 100%;
        }

        .content-wrapper {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Page Title */
        .page-title-section {
          margin-bottom: 2rem;
        }

        .page-title-section h1 {
          margin: 0;
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .page-title-section p {
          margin: 0;
          color: #64748b;
          font-size: 1.1rem;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 1rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: transform 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-4px);
        }

        .stat-icon {
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

        .stat-content h3 {
          margin: 0;
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
        }

        .stat-content p {
          margin: 0.25rem 0 0 0;
          color: #64748b;
          font-size: 0.9rem;
        }

        /* Reports Card */
        .reports-card {
          background: white;
          border-radius: 1.5rem;
          padding: 2.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          margin-bottom: 2rem;
        }

        .card-header {
          margin-bottom: 2rem;
          text-align: center;
        }

        .card-header h2 {
          margin: 0;
          font-size: 1.75rem;
          color: #1e293b;
          font-weight: 700;
        }

        .card-header p {
          margin: 0.5rem 0 0 0;
          color: #64748b;
          font-size: 1.1rem;
        }

        /* Horizontal Report Types */
        .report-types-horizontal {
          display: flex;
          gap: 1.25rem;
          overflow-x: auto;
          padding: 1rem 0.5rem;
          margin: 0 -0.5rem;
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }

        .report-item-horizontal {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 2rem 1.5rem;
          background: #f8fafc;
          border: 2px solid transparent;
          border-radius: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          min-width: 280px;
          flex-shrink: 0;
          text-align: center;
        }

        .report-item-horizontal:hover {
          background: white;
          border-color: #7A1F23;
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(122, 31, 35, 0.15);
        }

        .report-item-horizontal.selected {
          background: white;
          border-color: #7A1F23;
          box-shadow: 0 8px 25px rgba(122, 31, 35, 0.15);
        }

        .report-item-horizontal.coming-soon {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .report-item-horizontal.coming-soon:hover {
          transform: none;
          border-color: transparent;
          box-shadow: none;
        }

        .report-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
        }

        .badge-available {
          background: #10b981;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .report-icon-horizontal {
          width: 80px;
          height: 80px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          flex-shrink: 0;
        }

        .report-content-horizontal {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .report-content-horizontal h3 {
          margin: 0;
          font-size: 1.2rem;
          font-weight: 600;
          color: #1e293b;
        }

        .report-content-horizontal p {
          margin: 0.5rem 0 0 0;
          color: #64748b;
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .report-action-horizontal {
          color: #94a3b8;
          transition: all 0.3s ease;
          font-size: 1.1rem;
        }

        .report-item-horizontal:hover .report-action-horizontal {
          color: #7A1F23;
          transform: translateX(4px);
        }

        /* Date Range Selector */
        .date-range-selector {
          background: #f8fafc;
          padding: 2rem;
          border-radius: 1rem;
          border: 1px solid #e2e8f0;
          margin-top: 2rem;
          text-align: center;
        }

        .date-range-selector h3 {
          margin: 0 0 0.5rem 0;
          color: #1e293b;
          font-size: 1.5rem;
        }

        .report-description {
          color: #64748b;
          margin-bottom: 1.5rem;
        }

        .report-action-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .action-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #475569;
          background: #e2e8f0;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          margin: 0;
        }

        .coming-soon-action {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .coming-soon-icon {
          width: 60px;
          height: 60px;
          background: #e2e8f0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          font-size: 1.5rem;
        }

        .coming-soon-action p {
          color: #64748b;
          margin: 0;
        }

        .btn-generate {
          background: linear-gradient(135deg, #7A1F23, #9a2f35);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 0.75rem;
          cursor: pointer;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          min-width: 200px;
          justify-content: center;
        }

        .btn-generate:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(122, 31, 35, 0.3);
        }

        .btn-generate.btn-disabled {
          background: #e2e8f0;
          color: #94a3b8;
          cursor: not-allowed;
        }

        .btn-generate.btn-disabled:hover {
          transform: none;
          box-shadow: none;
        }

        /* Recent Reports */
        .recent-reports {
          background: white;
          border-radius: 1.5rem;
          padding: 2.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          text-align: center;
        }

        .recent-reports h3 {
          margin: 0 0 1.5rem 0;
          color: #1e293b;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .recent-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .recent-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background: #f8fafc;
          border-radius: 1rem;
          transition: all 0.3s ease;
        }

        .recent-item:hover {
          background: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .recent-icon {
          width: 50px;
          height: 50px;
          border-radius: 10px;
          background: #7A1F23;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .recent-details {
          flex: 1;
          text-align: left;
        }

        .recent-details h4 {
          margin: 0;
          color: #1e293b;
          font-size: 1.1rem;
        }

        .recent-details p {
          margin: 0.25rem 0 0 0;
          color: #64748b;
          font-size: 0.9rem;
        }

        .btn-download {
          background: transparent;
          border: 2px solid #e2e8f0;
          color: #64748b;
          width: 45px;
          height: 45px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .btn-download:hover {
          background: #7A1F23;
          border-color: #7A1F23;
          color: white;
          transform: translateY(-2px);
        }

        /* Scrollbar Styling for Horizontal Scroll */
        .report-types-horizontal::-webkit-scrollbar {
          height: 6px;
        }

        .report-types-horizontal::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }

        .report-types-horizontal::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        .report-types-horizontal::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .reports-content {
            padding: 20px;
          }

          .page-title-section h1 {
            font-size: 1.75rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .reports-card,
          .recent-reports {
            padding: 1.5rem;
          }

          .report-item-horizontal {
            min-width: 250px;
            padding: 1.5rem;
          }

          .report-badge {
            top: 0.5rem;
            right: 0.5rem;
          }

          .badge-available {
            font-size: 0.7rem;
            padding: 0.2rem 0.5rem;
          }
        }

        @media (max-width: 480px) {
          .reports-content {
            padding: 15px;
          }

          .report-types-horizontal {
            gap: 1rem;
          }

          .report-item-horizontal {
            min-width: 220px;
            padding: 1.25rem;
          }

          .report-icon-horizontal {
            width: 60px;
            height: 60px;
            font-size: 1.5rem;
          }

          .recent-item {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }

          .recent-details {
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default Reports;