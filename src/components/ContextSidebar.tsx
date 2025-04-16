import React, { useCallback, useEffect, useState } from 'react';
import '../styles/ContextSidebar.css';

interface ContextSidebarProps {
  activePage: string;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const ContextSidebar: React.FC<ContextSidebarProps> = ({
  activePage,
  isOpen,
  toggleSidebar
}) => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  // Check if we're on desktop view
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Create a memoized close handler that will definitely close the sidebar
  const handleClose = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOpen) {
      toggleSidebar();
    }
  }, [isOpen, toggleSidebar]);

  // Get title based on active page
  const getContextTitle = () => {
    switch (activePage) {
      case 'books':
        return 'Library Options';
      case 'community':
        return 'Community Tools';
      case 'marketplace':
        return 'Shopping Cart';
      default:
        return 'Quick Access';
    }
  };

  const renderLibraryContent = () => (
    <div className="sidebar-section">
      <h3>Library Filters</h3>
      <div className="filter-group">
        <h4>Genres</h4>
        <div className="filter-items">
          <label><input type="checkbox" /> Fiction</label>
          <label><input type="checkbox" /> Non-Fiction</label>
          <label><input type="checkbox" /> Science Fiction</label>
          <label><input type="checkbox" /> Mystery</label>
          <label><input type="checkbox" /> Biography</label>
        </div>
      </div>
      
      <div className="filter-group">
        <h4>Reading Status</h4>
        <div className="filter-items">
          <label><input type="checkbox" /> Currently Reading</label>
          <label><input type="checkbox" /> Want to Read</label>
          <label><input type="checkbox" /> Completed</label>
          <label><input type="checkbox" /> DNF</label>
        </div>
      </div>
      
      <div className="reading-stats">
        <h3>Reading Stats</h3>
        <div className="stats-item">
          <span>Books Read (2023):</span>
          <span className="stats-value">24</span>
        </div>
        <div className="stats-item">
          <span>Pages This Week:</span>
          <span className="stats-value">342</span>
        </div>
        <div className="stats-item">
          <span>Reading Streak:</span>
          <span className="stats-value">7 days</span>
        </div>
      </div>
    </div>
  );

  const renderCommunityContent = () => (
    <div className="sidebar-section">
      <div className="club-activity">
        <h3>Club Chat</h3>
        <div className="chat-messages">
          <div className="chat-message">
            <div className="message-avatar">JD</div>
            <div className="message-content">
              <div className="message-author">Jane Doe</div>
              <div className="message-text">Just finished chapter 5! Thoughts?</div>
              <div className="message-time">2 min ago</div>
            </div>
          </div>
          <div className="chat-message">
            <div className="message-avatar">JS</div>
            <div className="message-content">
              <div className="message-author">John Smith</div>
              <div className="message-text">The plot twist was amazing!</div>
              <div className="message-time">1 min ago</div>
            </div>
          </div>
        </div>
        <div className="chat-input">
          <input type="text" placeholder="Type a message..." />
          <button className="send-button">📤</button>
        </div>
      </div>
      
      <div className="upcoming-events">
        <h3>Upcoming Events</h3>
        <div className="event-item">
          <div className="event-date">May 15</div>
          <div className="event-details">
            <div className="event-title">Book Discussion: "The Silent Patient"</div>
            <div className="event-time">7:00 PM - 8:30 PM</div>
          </div>
        </div>
        <div className="event-item">
          <div className="event-date">May 22</div>
          <div className="event-details">
            <div className="event-title">Author Q&A: Sarah Johnson</div>
            <div className="event-time">6:00 PM - 7:00 PM</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMarketplaceContent = () => (
    <div className="sidebar-section">
      <div className="cart-section">
        <h3>Your Cart (3)</h3>
        <div className="cart-items">
          <div className="cart-item">
            <div className="cart-item-title">The Great Gatsby</div>
            <div className="cart-item-price">$12.99</div>
          </div>
          <div className="cart-item">
            <div className="cart-item-title">1984</div>
            <div className="cart-item-price">$10.50</div>
          </div>
          <div className="cart-item">
            <div className="cart-item-title">To Kill a Mockingbird</div>
            <div className="cart-item-price">$11.25</div>
          </div>
          <div className="cart-total">
            <span>Total:</span>
            <span className="total-price">$34.74</span>
          </div>
          <button className="checkout-button">Checkout</button>
        </div>
      </div>
      
      <div className="offers-section">
        <h3>Offers Received</h3>
        <div className="offer-item">
          <div className="offer-book">Dune (Hardcover)</div>
          <div className="offer-details">
            <div className="offer-from">From: BookLover22</div>
            <div className="offer-price">$18.00</div>
          </div>
          <div className="offer-actions">
            <button className="accept-button">Accept</button>
            <button className="decline-button">Decline</button>
          </div>
        </div>
      </div>
      
      <div className="delivery-section">
        <h3>Order Status</h3>
        <div className="delivery-item">
          <div className="delivery-title">Order #1337</div>
          <div className="delivery-status">In Transit</div>
          <div className="delivery-eta">Arriving: May 17</div>
        </div>
      </div>
    </div>
  );

  const renderDefaultContent = () => (
    <div className="sidebar-section">
      <h3>Quick Actions</h3>
      <div className="quick-actions">
        <button className="action-button">Add a Book</button>
        <button className="action-button">Join a Club</button>
        <button className="action-button">Browse Store</button>
      </div>
      
      <h3>Notifications</h3>
      <div className="notification-list">
        <div className="notification-item">
          <div className="notification-icon">📖</div>
          <div className="notification-content">New club recommendation based on your shelf</div>
        </div>
        <div className="notification-item">
          <div className="notification-icon">🏆</div>
          <div className="notification-content">You've completed your reading goal for the week!</div>
        </div>
      </div>
    </div>
  );

  const getSidebarContent = () => {
    switch (activePage) {
      case 'books':
        return renderLibraryContent();
      case 'community':
        return renderCommunityContent();
      case 'marketplace':
        return renderMarketplaceContent();
      default:
        return renderDefaultContent();
    }
  };

  return (
    <div 
      className={`context-sidebar ${isOpen ? 'open' : 'closed'}`}
      onClick={(e) => e.stopPropagation()}
    >
      {!isDesktop && (
        <div className="context-sidebar-toggle" onClick={toggleSidebar}>
          {isOpen ? '❯' : '❮'}
        </div>
      )}
      <div className="context-sidebar-header">
        <h2>{getContextTitle()}</h2>
        <button 
          className="close-icon" 
          onClick={handleClose} 
          aria-label="Close sidebar"
          type="button"
        >
          ✕
        </button>
      </div>
      <div className="context-sidebar-content">
        {getSidebarContent()}
      </div>
      <div className="context-sidebar-footer">
        <button 
          className="close-button" 
          onClick={handleClose}
          type="button"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ContextSidebar; 