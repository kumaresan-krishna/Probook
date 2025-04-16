import React, { useState, useEffect } from 'react';
import '../styles/Sidebar.css';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  mobileMenuOpen?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, mobileMenuOpen }) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Check if we're on mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Determine sidebar classes
  const sidebarClasses = [
    'sidebar',
    collapsed ? 'collapsed' : '',
    isMobile && mobileMenuOpen ? 'open' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={sidebarClasses}>
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        {collapsed ? '❯' : '❮'}
      </div>

      <div className="sidebar-items">
        <button 
          className={`sidebar-item ${activePage === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActivePage('dashboard')}
          data-tooltip="Dashboard"
        >
          <span className="sidebar-icon">📊</span>
          {!collapsed && <span className="sidebar-label">Dashboard</span>}
        </button>

        <button 
          className={`sidebar-item ${activePage === 'books' ? 'active' : ''}`}
          onClick={() => setActivePage('books')}
          data-tooltip="My Library"
        >
          <span className="sidebar-icon">📖</span>
          {!collapsed && <span className="sidebar-label">My Library</span>}
        </button>

        <button 
          className={`sidebar-item ${activePage === 'community' ? 'active' : ''}`}
          onClick={() => setActivePage('community')}
          data-tooltip="Clubs & Community"
        >
          <span className="sidebar-icon">👥</span>
          {!collapsed && <span className="sidebar-label">Clubs & Community</span>}
        </button>

        <button 
          className={`sidebar-item ${activePage === 'clubs' ? 'active' : ''}`}
          onClick={() => setActivePage('clubs')}
          data-tooltip="Book Clubs"
        >
          <span className="sidebar-icon">👥</span>
          {!collapsed && <span className="sidebar-label">Book Clubs</span>}
        </button>

        <button 
          className={`sidebar-item ${activePage === 'marketplace' ? 'active' : ''}`}
          onClick={() => setActivePage('marketplace')}
          data-tooltip="Marketplace"
        >
          <span className="sidebar-icon">🛒</span>
          {!collapsed && <span className="sidebar-label">Marketplace</span>}
        </button>

        <button 
          className={`sidebar-item ${activePage === 'bookbot' ? 'active' : ''}`}
          onClick={() => setActivePage('bookbot')}
          data-tooltip="AI Book Bot"
        >
          <span className="sidebar-icon">🤖</span>
          {!collapsed && <span className="sidebar-label">AI Book Bot</span>}
        </button>

        <button 
          className={`sidebar-item ${activePage === 'writer' ? 'active' : ''}`}
          onClick={() => setActivePage('writer')}
          data-tooltip="Writer.ai"
        >
          <span className="sidebar-icon">✍️</span>
          {!collapsed && <span className="sidebar-label">Writer.ai</span>}
        </button>

        <button 
          className={`sidebar-item ${activePage === 'analytics' ? 'active' : ''}`}
          onClick={() => setActivePage('analytics')}
          data-tooltip="Analytics"
        >
          <span className="sidebar-icon">📈</span>
          {!collapsed && <span className="sidebar-label">Analytics</span>}
        </button>

        <div className="sidebar-divider"></div>

        <button 
          className={`sidebar-item ${activePage === 'help' ? 'active' : ''}`}
          onClick={() => setActivePage('help')}
          data-tooltip="Help & Support"
        >
          <span className="sidebar-icon">❓</span>
          {!collapsed && <span className="sidebar-label">Help & Support</span>}
        </button>
      </div>

      {!collapsed && (
        <div className="sidebar-footer">
          <div className="app-info">
            <span className="app-version">Prebook v1.0</span>
            <span className="app-copyright">© 2023 Prebook Inc.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar; 