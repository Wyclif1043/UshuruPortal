// src/components/Profile.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { profileLoadStart, profileLoadSuccess, profileLoadFailure } from '../store/slices/authSlice';
import { authService } from '../services/authService';

const Profile = () => {
  const dispatch = useDispatch();
  const { 
    memberNumber, 
    profile, 
    nextOfKin, 
    nominees, 
    profileLoading, 
    profileError 
  } = useSelector((state) => state.auth);

  useEffect(() => {
    const loadProfile = async () => {
      if (memberNumber && !profile) {
        dispatch(profileLoadStart());
        try {
          const response = await authService.getMemberProfile(memberNumber);
          if (response.status === 'success') {
            dispatch(profileLoadSuccess(response));
          } else {
            dispatch(profileLoadFailure(response.message || 'Failed to load profile'));
          }
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Failed to load profile';
          dispatch(profileLoadFailure(errorMessage));
        }
      }
    };

    loadProfile();
  }, [dispatch, memberNumber, profile]);

  if (profileLoading) {
    return (
      <div className="profile-container">
        <div className="loading-state">
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i>
          </div>
          <p>Loading profile information...</p>
        </div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="profile-container">
        <div className="error-state">
          <div className="error-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <h3>Unable to Load Profile</h3>
          <p>{profileError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="retry-button"
          >
            <i className="fas fa-redo"></i>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-container">
        <div className="empty-state">
          <div className="empty-icon">
            <i className="fas fa-user-slash"></i>
          </div>
          <h3>No Profile Data</h3>
          <p>Profile information is not available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="header-content">
          <div className="profile-avatar">
            <i className="fas fa-user-circle"></i>
          </div>
          <div className="profile-info">
            <h1>{profile.FullName || 'Member Profile'}</h1>
            <p>Member since {new Date().getFullYear()}</p>
            <div className="status-badge">
              <span className={`status ${profile.Status?.toLowerCase() || 'active'}`}>
                {profile.Status || 'Active'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Profile Content */}
      <div className="profile-content">
        {/* Personal Information Card */}
        <div className="profile-card">
          <div className="card-header">
            <i className="fas fa-id-card"></i>
            <h2>Personal Information</h2>
          </div>
          <div className="card-content">
            <div className="info-grid">
              <div className="info-item">
                <label>Member Number</label>
                <div className="info-value">
                  <i className="fas fa-hashtag"></i>
                  {profile.MemberNumber || 'N/A'}
                </div>
              </div>
              <div className="info-item">
                <label>Full Name</label>
                <div className="info-value">
                  <i className="fas fa-user"></i>
                  {profile.FullName || 'N/A'}
                </div>
              </div>
              <div className="info-item">
                <label>Email Address</label>
                <div className="info-value">
                  <i className="fas fa-envelope"></i>
                  {profile.Email || 'N/A'}
                </div>
              </div>
              <div className="info-item">
                <label>Phone Number</label>
                <div className="info-value">
                  <i className="fas fa-phone"></i>
                  {profile.Phone || 'N/A'}
                </div>
              </div>
              <div className="info-item">
                <label>ID Number</label>
                <div className="info-value">
                  <i className="fas fa-id-card"></i>
                  {profile.IDNumber || 'N/A'}
                </div>
              </div>
              <div className="info-item">
                <label>Payroll Number</label>
                <div className="info-value">
                  <i className="fas fa-briefcase"></i>
                  {profile.PayrollNumber || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next of Kin Section */}
        {nextOfKin && nextOfKin.length > 0 && (
          <div className="profile-card">
            <div className="card-header">
              <i className="fas fa-users"></i>
              <h2>Next of Kin ({nextOfKin.length})</h2>
            </div>
            <div className="card-content">
              <div className="kin-grid">
                {nextOfKin.map((kin, index) => (
                  <div key={index} className="kin-card">
                    <div className="kin-header">
                      <h3>{kin.Name || 'Unnamed'}</h3>
                      <span className="relationship-badge">{kin.Relationship || 'Relative'}</span>
                    </div>
                    <div className="kin-details">
                      <div className="detail-item">
                        <i className="fas fa-id-card"></i>
                        <span>{kin.ID || 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-birthday-cake"></i>
                        <span>{kin.DateOfBirth || 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>{kin.Address || 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-phone"></i>
                        <span>{kin.Telephone || 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-envelope"></i>
                        <span>{kin.Email || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Nominees Section */}
        <div className="profile-card">
          <div className="card-header">
            <i className="fas fa-user-friends"></i>
            <h2>Nominees</h2>
          </div>
          <div className="card-content">
            {nominees && nominees.length > 0 ? (
              <div className="nominees-grid">
                {nominees.map((nominee, index) => (
                  <div key={index} className="nominee-card">
                    <div className="nominee-header">
                      <h3>{nominee.Name || 'Unnamed Nominee'}</h3>
                      <span className="relationship-badge">{nominee.Relationship || 'Nominee'}</span>
                    </div>
                    <div className="nominee-details">
                      <div className="detail-item">
                        <i className="fas fa-percentage"></i>
                        <span>Allocation: {nominee.Allocation || 'N/A'}%</span>
                      </div>
                      {/* Add more nominee details as needed */}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-section">
                <i className="fas fa-user-friends"></i>
                <p>No nominees registered</p>
                <button className="add-button">
                  <i className="fas fa-plus"></i>
                  Add Nominee
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .profile-container {
          min-height: 100vh;
          background: #f8fafc;
          padding: 2rem;
        }

        /* Profile Header */
        .profile-header {
          background: linear-gradient(135deg, #7A1F23 0%, #5a1519 100%);
          color: white;
          border-radius: 1rem;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 20px rgba(122, 31, 35, 0.15);
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .profile-avatar {
          font-size: 4rem;
          color: #F5B800;
        }

        .profile-info h1 {
          margin: 0 0 0.5rem 0;
          font-size: 2rem;
          font-weight: 700;
        }

        .profile-info p {
          margin: 0 0 1rem 0;
          opacity: 0.9;
          font-size: 1.1rem;
        }

        .status-badge .status {
          padding: 0.5rem 1rem;
          border-radius: 2rem;
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .status.active {
          background: #10B981;
          color: white;
        }

        .status.inactive {
          background: #6B7280;
          color: white;
        }

        /* Profile Content */
        .profile-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* Profile Cards */
        .profile-card {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }

        .card-header {
          background: #f8fafc;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .card-header i {
          color: #7A1F23;
          font-size: 1.25rem;
        }

        .card-header h2 {
          margin: 0;
          color: #374151;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .card-content {
          padding: 2rem;
        }

        /* Information Grid */
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .info-item label {
          font-weight: 600;
          color: #6B7280;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .info-value {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 0.75rem;
          border: 1px solid #e5e7eb;
          font-weight: 500;
          color: #374151;
        }

        .info-value i {
          color: #7A1F23;
          width: 1rem;
        }

        /* Next of Kin Grid */
        .kin-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .kin-card {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }

        .kin-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .kin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .kin-header h3 {
          margin: 0;
          color: #374151;
          font-size: 1.25rem;
        }

        .relationship-badge {
          background: #7A1F23;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .kin-details {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #6B7280;
        }

        .detail-item i {
          width: 1rem;
          color: #7A1F23;
        }

        /* Nominees Grid */
        .nominees-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .nominee-card {
          background: #f0f9ff;
          border: 1px solid #bae6fd;
          border-radius: 0.75rem;
          padding: 1.5rem;
        }

        .nominee-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .nominee-header h3 {
          margin: 0;
          color: #0369a1;
        }

        /* Empty States */
        .empty-section {
          text-align: center;
          padding: 3rem 2rem;
          color: #6B7280;
        }

        .empty-section i {
          font-size: 3rem;
          margin-bottom: 1rem;
          color: #9CA3AF;
        }

        .empty-section p {
          margin: 0 0 1.5rem 0;
          font-size: 1.125rem;
        }

        .add-button {
          background: #7A1F23;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .add-button:hover {
          background: #5a1519;
        }

        /* Loading and Error States */
        .loading-state,
        .error-state,
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          text-align: center;
        }

        .loading-spinner,
        .error-icon,
        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1.5rem;
        }

        .loading-spinner {
          color: #7A1F23;
        }

        .error-icon {
          color: #EF4444;
        }

        .empty-icon {
          color: #9CA3AF;
        }

        .error-state h3,
        .empty-state h3 {
          margin: 0 0 1rem 0;
          color: #374151;
        }

        .error-state p,
        .empty-state p {
          margin: 0 0 1.5rem 0;
          color: #6B7280;
          max-width: 400px;
        }

        .retry-button {
          background: #7A1F23;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .retry-button:hover {
          background: #5a1519;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .profile-container {
            padding: 1rem;
          }

          .profile-header {
            padding: 1.5rem;
          }

          .header-content {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }

          .profile-info h1 {
            font-size: 1.5rem;
          }

          .info-grid,
          .kin-grid,
          .nominees-grid {
            grid-template-columns: 1fr;
          }

          .card-content {
            padding: 1.5rem;
          }

          .kin-header,
          .nominee-header {
            flex-direction: column;
            gap: 0.5rem;
            align-items: flex-start;
          }
        }

        @media (max-width: 480px) {
          .profile-header {
            padding: 1rem;
          }

          .card-header {
            padding: 1rem 1.5rem;
          }

          .card-header h2 {
            font-size: 1.25rem;
          }

          .card-content {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;