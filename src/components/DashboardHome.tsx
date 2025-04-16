import React, { useState } from 'react';
import '../styles/DashboardHome.css';

const DashboardHome: React.FC = () => {
  const [activeCarouselItem, setActiveCarouselItem] = useState(0);
  
  // Mock data for summary cards
  const summaryData = {
    booksRead: 28,
    clubsJoined: 5,
    activeListings: 3,
    readingGoal: { current: 28, target: 50 }
  };
  
  // Mock data for reading segments
  const segments = [
    {
      id: 1,
      title: "Currently Reading",
      books: 4,
      progress: 65,
      coverColor: "#4361ee"
    },
    {
      id: 2,
      title: "Fantasy Collection",
      books: 12,
      progress: 100,
      coverColor: "#3a0ca3"
    },
    {
      id: 3,
      title: "Business Books",
      books: 8,
      progress: 25,
      coverColor: "#4cc9f0"
    },
    {
      id: 4,
      title: "Summer Reading",
      books: 6,
      progress: 50,
      coverColor: "#f72585"
    },
    {
      id: 5,
      title: "Classics",
      books: 15,
      progress: 40,
      coverColor: "#fb8500"
    }
  ];
  
  // Mock data for activity feed
  const activities = [
    {
      id: 1,
      type: "book_progress",
      title: "Updated progress on Project Hail Mary",
      details: "75% complete",
      time: "2 hours ago",
      icon: "📖"
    },
    {
      id: 2,
      type: "club_post",
      title: "New post in Fantasy Readers club",
      details: "Sarah Johnson posted 'Thoughts on The Name of the Wind'",
      time: "Yesterday",
      icon: "👥"
    },
    {
      id: 3,
      type: "new_book",
      title: "Added The Lincoln Highway to your library",
      details: "Added to 'Want to Read' list",
      time: "2 days ago",
      icon: "📚"
    },
    {
      id: 4,
      type: "club_event",
      title: "Upcoming event in Science Fiction club",
      details: "Author Q&A: Andy Weir - Tomorrow at 7:00 PM",
      time: "2 days ago",
      icon: "📅"
    }
  ];
  
  // Navigate carousel
  const nextCarouselItem = () => {
    setActiveCarouselItem((prev) => 
      prev === segments.length - 1 ? 0 : prev + 1
    );
  };
  
  const prevCarouselItem = () => {
    setActiveCarouselItem((prev) => 
      prev === 0 ? segments.length - 1 : prev - 1
    );
  };
  
  // Calculate visible carousel items
  const getVisibleSegments = () => {
    const segmentsArray = [...segments];
    const visibleCount = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
    
    // Reorder array to show active item and next items, with wrap-around
    const reordered = [];
    for (let i = 0; i < visibleCount; i++) {
      const index = (activeCarouselItem + i) % segments.length;
      reordered.push(segmentsArray[index]);
    }
    
    return reordered;
  };
  
  return (
    <div className="dashboard-home">
      <h1 className="dashboard-title">Dashboard</h1>
      
      {/* Summary Cards Section */}
      <section className="summary-cards">
        <div className="summary-card">
          <div className="summary-icon book-icon">📚</div>
          <div className="summary-content">
            <h2>{summaryData.booksRead}</h2>
            <p>Books Read</p>
          </div>
          <div className="summary-progress">
            <div className="progress-ring">
              <svg width="60" height="60">
                <circle
                  className="progress-ring-circle-bg"
                  stroke="#e2e8f0"
                  strokeWidth="4"
                  fill="transparent"
                  r="25"
                  cx="30"
                  cy="30"
                />
                <circle
                  className="progress-ring-circle"
                  stroke="#4361ee"
                  strokeWidth="4"
                  fill="transparent"
                  r="25"
                  cx="30"
                  cy="30"
                  style={{
                    strokeDasharray: `${2 * Math.PI * 25}`,
                    strokeDashoffset: `${2 * Math.PI * 25 * (1 - summaryData.readingGoal.current / summaryData.readingGoal.target)}`
                  }}
                />
                <text x="30" y="35" textAnchor="middle" className="progress-text">
                  {Math.round(summaryData.readingGoal.current / summaryData.readingGoal.target * 100)}%
                </text>
              </svg>
            </div>
            <span className="goal-text">{summaryData.readingGoal.current}/{summaryData.readingGoal.target} Goal</span>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon club-icon">👥</div>
          <div className="summary-content">
            <h2>{summaryData.clubsJoined}</h2>
            <p>Clubs Joined</p>
          </div>
          <button className="summary-action">View Clubs</button>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon listing-icon">🛒</div>
          <div className="summary-content">
            <h2>{summaryData.activeListings}</h2>
            <p>Active Listings</p>
          </div>
          <button className="summary-action">View Listings</button>
        </div>
      </section>
      
      {/* Segments Carousel */}
      <section className="segments-section">
        <div className="section-header">
          <h2>My Segments</h2>
          <div className="carousel-controls">
            <button className="carousel-control prev" onClick={prevCarouselItem}>
              &#10094;
            </button>
            <button className="carousel-control next" onClick={nextCarouselItem}>
              &#10095;
            </button>
          </div>
        </div>
        
        <div className="segments-carousel">
          {getVisibleSegments().map(segment => (
            <div className="segment-card" key={segment.id}>
              <div 
                className="segment-cover" 
                style={{ backgroundColor: segment.coverColor }}
              ></div>
              <div className="segment-details">
                <h3>{segment.title}</h3>
                <p>{segment.books} Books</p>
                <div className="segment-progress-bar">
                  <div 
                    className="segment-progress-fill" 
                    style={{ width: `${segment.progress}%` }}
                  ></div>
                </div>
                <div className="segment-progress-text">
                  {segment.progress === 100 ? 'Complete' : `${segment.progress}% Complete`}
                </div>
              </div>
              <button className="segment-action">View</button>
            </div>
          ))}
          
          <div className="segment-card add-segment">
            <div className="add-segment-content">
              <span className="add-icon">+</span>
              <p>Create New Segment</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Main Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Activity Feed */}
        <section className="activity-feed-section">
          <div className="section-header">
            <h2>Latest Activity</h2>
            <button className="view-all-btn">View All</button>
          </div>
          
          <div className="activity-list">
            {activities.map(activity => (
              <div className="activity-item" key={activity.id}>
                <div className={`activity-icon ${activity.type}`}>
                  {activity.icon}
                </div>
                <div className="activity-content">
                  <h3>{activity.title}</h3>
                  <p>{activity.details}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Features Teasers */}
        <div className="features-section">
          <div className="feature-teaser bookbot-teaser">
            <div className="teaser-icon">🤖</div>
            <div className="teaser-content">
              <h3>AI Book Bot</h3>
              <p>Not sure what to read next? Ask Book Bot for personalized recommendations.</p>
              <div className="teaser-input-container">
                <input 
                  type="text" 
                  placeholder="Ask what to read next..." 
                  className="teaser-input"
                />
                <button className="teaser-button">Ask</button>
              </div>
            </div>
          </div>
          
          <div className="feature-teaser writer-teaser">
            <div className="teaser-icon">✍️</div>
            <div className="teaser-content">
              <h3>Writer.ai</h3>
              <p>Ready to start your writing journey? Writer.ai helps you create, edit, and enhance your stories.</p>
              <button className="teaser-action">Start Writing Today</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <section className="quick-actions-section">
        <h2>Quick Actions</h2>
        <div className="quick-actions">
          <button className="quick-action-btn">
            <span className="quick-action-icon">📕</span>
            Add Book
          </button>
          <button className="quick-action-btn">
            <span className="quick-action-icon">📋</span>
            Create Segment
          </button>
          <button className="quick-action-btn">
            <span className="quick-action-icon">👥</span>
            Join Club
          </button>
          <button className="quick-action-btn">
            <span className="quick-action-icon">🛒</span>
            Sell Book
          </button>
          <button className="quick-action-btn">
            <span className="quick-action-icon">📊</span>
            Set Reading Goal
          </button>
        </div>
      </section>
    </div>
  );
};

export default DashboardHome;

 