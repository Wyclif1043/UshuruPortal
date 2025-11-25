import React from 'react';
import { useSelector } from 'react-redux';

const Header = () => {
  const { user } = useSelector((state) => state.auth);

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.username?.substring(0, 2).toUpperCase() || 'UM';
  };

  const getUserName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.username || 'Member';
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="page-title">
          <h1>Member Portal</h1>
        </div>

        <div className="user-section">
          <div className="notification-icon">
            <i className="fas fa-bell"></i>
            <span className="notification-badge">3</span>
          </div>
          
          <div className="user-info">
            <div className="user-details">
              <div className="user-name">Welcome, {getUserName()}</div>
              <div className="user-role">Member Portal</div>
            </div>
            
            <div className="user-avatar">
              {getUserInitials()}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .header {
          background: linear-gradient(to right, #7A1F23, #5a1519);
          color: white;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          height: 80px;
          display: flex;
          align-items: center;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 30px;
          width: 100%;
        }

        .page-title h1 {
          font-size: 24px;
          font-weight: bold;
          margin: 0;
          color: white;
        }

        .page-subtitle {
          color: #F5B800;
          font-size: 14px;
          margin: 4px 0 0 0;
        }

        .user-section {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .notification-icon {
          position: relative;
          font-size: 18px;
          color: white;
          cursor: pointer;
          padding: 8px;
        }

        .notification-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          background-color: #F5B800;
          color: #7A1F23;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          font-size: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .user-details {
          text-align: right;
        }

        .user-name {
          font-weight: 600;
          color: white;
          font-size: 14px;
        }

        .user-role {
          font-size: 12px;
          color: #F5B800;
          margin-top: 2px;
        }

        .user-avatar {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background: linear-gradient(135deg, #F5B800 0%, #E5A800 100%);
          color: #7A1F23;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .header {
            height: auto;
            padding: 10px 0;
          }

          .header-content {
            padding: 0 20px;
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }

          .user-section {
            width: 100%;
            justify-content: space-between;
          }

          .user-details {
            display: none;
          }

          .user-avatar {
            width: 40px;
            height: 40px;
            font-size: 12px;
          }
        }

        @media (max-width: 480px) {
          .page-title h1 {
            font-size: 20px;
          }

          .user-section {
            gap: 10px;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;