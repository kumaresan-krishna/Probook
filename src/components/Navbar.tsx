import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import '../styles/Navbar.css';

const Navbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isDropdownOpen) setIsDropdownOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left - Logo and App Name */}
        <div className="navbar-brand">
          <div className="app-logo">P</div>
          <span className="app-name">Prebook</span>
        </div>

        {/* Center - Search Bar */}
        <div className="navbar-search">
          <input 
            type="text" 
            placeholder="Search books, clubs, users..." 
            className="search-input"
          />
          <button className="search-button">
            <span>🔍</span>
          </button>
        </div>

        {/* Right - Notifications and Profile */}
        <div className="navbar-actions">
          <div className="notification-container">
            <button 
              className="notification-bell"
              onClick={toggleNotifications}
            >
              <span>🔔</span>
              <span className="notification-badge">3</span>
            </button>
            
            {isNotificationsOpen && (
              <div className="notifications-dropdown">
                <div className="dropdown-header">
                  <h3>Notifications</h3>
                  <button className="mark-all-read">Mark all as read</button>
                </div>
                <div className="notification-list">
                  <div className="notification-item unread">
                    <div className="notification-avatar"></div>
                    <div className="notification-content">
                      <p>
                        <strong>Sarah Johnson</strong> commented on your post about "The Psychology of Money"
                      </p>
                      <span className="notification-time">2 hours ago</span>
                    </div>
                    <div className="unread-marker"></div>
                  </div>
                  <div className="notification-item unread">
                    <div className="notification-avatar"></div>
                    <div className="notification-content">
                      <p>
                        <strong>Fantasy Readers</strong> club has a new event: "Author Q&A: Brandon Sanderson"
                      </p>
                      <span className="notification-time">Yesterday</span>
                    </div>
                    <div className="unread-marker"></div>
                  </div>
                  <div className="notification-item">
                    <div className="notification-avatar"></div>
                    <div className="notification-content">
                      <p>
                        <strong>Book Exchange Group</strong> approved your offer for "The Silent Patient"
                      </p>
                      <span className="notification-time">2 days ago</span>
                    </div>
                  </div>
                </div>
                <div className="dropdown-footer">
                  <button className="view-all-button">View all notifications</button>
                </div>
              </div>
            )}
          </div>
          
          <div className="profile-container">
            <button 
              className="profile-button"
              onClick={toggleDropdown}
            >
              <div className="avatar"></div>
            </button>
            
            {isDropdownOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-user-info">
                  <div className="dropdown-avatar"></div>
                  <div className="dropdown-name">
                    <h4>John Doe</h4>
                    <p>john.doe@example.com</p>
                  </div>
                </div>
                
                <ul className="dropdown-menu">
                  <li className="dropdown-item">
                    <span className="dropdown-icon">👤</span>
                    <span>Profile</span>
                  </li>
                  <li className="dropdown-item">
                    <span className="dropdown-icon">⚙️</span>
                    <span>Settings</span>
                  </li>
                  <li className="dropdown-item">
                    <span className="dropdown-icon">📚</span>
                    <span>My Library</span>
                  </li>
                  <li className="dropdown-item">
                    <span className="dropdown-icon">👥</span>
                    <span>My Clubs</span>
                  </li>
                  <li className="dropdown-divider"></li>
                  <li 
                    className="dropdown-item logout-item"
                    onClick={handleLogout}
                  >
                    <span className="dropdown-icon">🚪</span>
                    <span>Logout</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 