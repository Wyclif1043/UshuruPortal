// src/components/layout/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    {
      path: '/dashboard',
      icon: 'fas fa-chart-line',
      text: 'Dashboard',
      description: 'Overview & Analytics'
    },
    {
      path: '/profile',
      icon: 'fas fa-user',
      text: 'Profile',
      description: 'Personal Information'
    },
    {
      path: '/investments',
      icon: 'fas fa-home',
      text: 'Investments',
      description: 'Plot Bookings & Lands'
    },
    {
      path: '/contributions',
      icon: 'fas fa-hand-holding-usd',
      text: 'Contributions',
      description: 'Manage Investments'
    },
    {
      path: '/reports',
      icon: 'fas fa-chart-bar',
      text: 'Reports',
      description: 'Financial Reports'
    },
    {
      path: '/documents',
      icon: 'fas fa-file-contract',
      text: 'Documents',
      description: 'Forms & Contracts'
    },
    {
      path: '/messages',
      icon: 'fas fa-comments',
      text: 'Messages',
      description: 'Society Communication'
    },
    {
      path: '/support',
      icon: 'fas fa-headset',
      text: 'Support',
      description: 'Help & Assistance'
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={toggleSidebar}
        />
      )}

      {/* Mobile Toggle Button */}
      {isMobile && (
        <button 
          className="sidebar-toggle"
          onClick={toggleSidebar}
        >
          <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      )}

      <div className={`sidebar ${isOpen ? 'open' : ''} ${isMobile ? 'mobile' : ''}`}>
        {/* Logo Section */}
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-image-container">
              <img 
                src="/images/ushuru-logo.png" 
                alt="Ushuru Investment Co-operative Society" 
                className="logo-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="logo-fallback">
                <span>UI</span>
              </div>
            </div>
            <div className="logo-text">
              <div className="company-name">
                USHURU <span>INVESTMENT</span>
              </div>
              <div className="company-subtitle">Co-operative Society</div>
              <div className="company-slogan">Uwekezaji Imara</div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          <ul className="nav-menu">
            {menuItems.map((item) => (
              <li 
                key={item.path} 
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => isMobile && setIsOpen(false)}
              >
                <Link to={item.path} className="nav-link">
                  <div className="nav-icon">
                    <i className={item.icon}></i>
                  </div>
                  <div className="nav-content">
                    <span className="nav-text">{item.text}</span>
                    <span className="nav-description">{item.description}</span>
                  </div>
                  <div className="nav-indicator">
                    <i className="fas fa-chevron-right"></i>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Section - Fixed at bottom */}
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              <i className="fas fa-user-circle"></i>
            </div>
            <div className="user-info">
              <span className="user-name">Member Portal</span>
              <span className="user-status">Online</span>
            </div>
          </div>
          
          <button onClick={handleLogout} className="logout-button">
            <div className="logout-icon">
              <i className="fas fa-sign-out-alt"></i>
            </div>
            <span className="logout-text">Logout</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        .sidebar {
          width: 300px;
          height: 100vh;
          background: linear-gradient(180deg, #7A1F23 0%, #5a1519 100%);
          color: white;
          position: fixed;
          left: 0;
          top: 0;
          display: flex;
          flex-direction: column;
          box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          overflow: hidden;
          transition: transform 0.3s ease;
        }

        /* Mobile Styles */
        .sidebar.mobile {
          transform: translateX(-100%);
        }

        .sidebar.mobile.open {
          transform: translateX(0);
        }

        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }

        .sidebar-toggle {
          position: fixed;
          top: 1rem;
          left: 1rem;
          z-index: 1001;
          background: #7A1F23;
          color: white;
          border: none;
          border-radius: 0.5rem;
          width: 3rem;
          height: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        .sidebar-header {
          padding: 2rem 1.5rem 1.5rem;
          border-bottom: 1px solid rgba(245, 184, 0, 0.2);
          background: rgba(122, 31, 35, 0.95);
          flex-shrink: 0;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .logo-image-container {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          background: linear-gradient(135deg, #F5B800, #e6a800);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(245, 184, 0, 0.3);
        }

        .logo-image {
          width: 70%;
          height: 70%;
          object-fit: contain;
        }

        .logo-fallback {
          width: 100%;
          height: 100%;
          border-radius: 12px;
          display: none;
          align-items: center;
          justify-content: center;
          color: #7A1F23;
          font-weight: bold;
          font-size: 1.25rem;
          background: linear-gradient(135deg, #F5B800, #e6a800);
        }

        .logo-text {
          flex: 1;
        }

        .company-name {
          font-size: 1.1rem;
          font-weight: bold;
          line-height: 1.2;
          margin-bottom: 0.25rem;
        }

        .company-name span {
          color: #F5B800;
        }

        .company-subtitle {
          font-size: 0.8rem;
          color: #F5B800;
          margin-bottom: 0.125rem;
        }

        .company-slogan {
          font-size: 0.7rem;
          color: rgba(245, 184, 0, 0.8);
          font-style: italic;
        }

        .sidebar-nav {
          flex: 1;
          overflow-y: auto;
          padding: 1rem 0;
          /* Ensure nav doesn't overlap with footer */
          margin-bottom: 0;
        }

        .nav-menu {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .nav-item {
          margin: 0.25rem 1rem;
          border-radius: 12px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .nav-item:before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 3px;
          background: #F5B800;
          transform: scaleY(0);
          transition: transform 0.3s ease;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .nav-item:hover:before {
          transform: scaleY(1);
        }

        .nav-item.active {
          background: linear-gradient(135deg, #F5B800, #e6a800);
          box-shadow: 0 4px 12px rgba(245, 184, 0, 0.3);
        }

        .nav-item.active:before {
          transform: scaleY(1);
        }

        .nav-link {
          display: flex;
          align-items: center;
          padding: 1rem 1.25rem;
          color: white;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .nav-item.active .nav-link {
          color: #7A1F23;
        }

        .nav-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1rem;
          flex-shrink: 0;
        }

        .nav-icon i {
          font-size: 1.1rem;
        }

        .nav-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .nav-text {
          font-weight: 600;
          font-size: 0.95rem;
          margin-bottom: 0.125rem;
        }

        .nav-description {
          font-size: 0.75rem;
          opacity: 0.8;
          color: currentColor;
        }

        .nav-indicator {
          opacity: 0.6;
          transition: opacity 0.3s ease;
        }

        .nav-item:hover .nav-indicator {
          opacity: 1;
          transform: translateX(2px);
        }

        .sidebar-footer {
          padding: 1.5rem;
          border-top: 1px solid rgba(245, 184, 0, 0.2);
          background: rgba(90, 21, 25, 0.9);
          flex-shrink: 0;
          /* Ensure footer stays at bottom */
          margin-top: auto;
          /* Add some spacing from the nav */
          border-top: 2px solid rgba(245, 184, 0, 0.3);
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(245, 184, 0, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F5B800;
        }

        .user-avatar i {
          font-size: 1.5rem;
        }

        .user-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 0.125rem;
        }

        .user-status {
          font-size: 0.75rem;
          color: #10B981;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .user-status:before {
          content: '';
          width: 6px;
          height: 6px;
          background: #10B981;
          border-radius: 50%;
        }

        .logout-button {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 8px;
          color: #EF4444;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .logout-button:hover {
          background: rgba(239, 68, 68, 0.2);
          border-color: rgba(239, 68, 68, 0.3);
          transform: translateY(-1px);
        }

        .logout-icon {
          width: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Scrollbar Styling */
        .sidebar-nav::-webkit-scrollbar {
          width: 4px;
        }

        .sidebar-nav::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }

        .sidebar-nav::-webkit-scrollbar-thumb {
          background: #F5B800;
          border-radius: 2px;
        }

        /* Improved Mobile Responsiveness */
        @media (max-width: 768px) {
          .sidebar {
            width: 280px;
          }

          .company-name {
            font-size: 1rem;
          }

          .company-subtitle {
            font-size: 0.75rem;
          }

          .sidebar-footer {
            padding: 1.25rem;
            position: sticky;
            bottom: 0;
            background: rgba(90, 21, 25, 0.95);
            backdrop-filter: blur(10px);
          }

          .logout-button {
            padding: 1rem;
            font-size: 1rem;
          }
        }

        @media (max-width: 480px) {
          .sidebar {
            width: 100%;
          }

          .logo-container {
            gap: 0.875rem;
          }

          .logo-image-container {
            width: 50px;
            height: 50px;
          }

          .nav-item {
            margin: 0.125rem 0.75rem;
          }

          .nav-link {
            padding: 0.875rem 1rem;
          }

          .sidebar-footer {
            padding: 1rem;
          }

          .user-profile {
            margin-bottom: 0.875rem;
            padding: 0.625rem;
          }

          .logout-button {
            padding: 0.875rem;
            min-height: 50px;
          }

          /* Ensure logout button is easily tappable on mobile */
          .logout-button {
            min-height: 44px; /* Minimum touch target size */
          }
        }

        /* Extra small devices */
        @media (max-width: 360px) {
          .sidebar-footer {
            padding: 0.875rem;
          }

          .user-profile {
            flex-direction: column;
            text-align: center;
            gap: 0.5rem;
          }

          .user-info {
            align-items: center;
          }

          .logout-button {
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;