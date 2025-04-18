import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import '../styles/Dashboard.css';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeFeature, setActiveFeature] = useState<string>('library');
  const [activeCarouselItem, setActiveCarouselItem] = useState(0);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, []);

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

  const renderFeatureContent = () => {
    switch (activeFeature) {
      case 'library':
        return (
          <div className="feature-content library-content">
            <div className="feature-header">
              <h2>My Library Segmentation</h2>
              <button className="primary-btn">+ Create New Segment</button>
            </div>
            <div className="segment-filters">
              <button className="filter-btn active">All Segments</button>
              <button className="filter-btn">Fiction</button>
              <button className="filter-btn">Non-Fiction</button>
              <button className="filter-btn">To Read</button>
              <button className="filter-btn">In Progress</button>
              <button className="filter-btn">Completed</button>
            </div>
            <div className="book-segments">
              <div className="segment-card">
                <div className="segment-header">
                  <h3>Currently Reading</h3>
                  <span className="badge in-progress">In Progress</span>
                </div>
                <div className="segment-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '45%' }}></div>
                  </div>
                  <span className="progress-text">5 of 11 books completed</span>
                </div>
                <div className="segment-books">
                  <div className="book-item">
                    <div className="book-cover"></div>
                    <div className="book-info">
                      <h4>The Midnight Library</h4>
                      <p>Matt Haig</p>
                      <div className="book-progress">
                        <div className="book-progress-bar">
                          <div className="book-progress-fill" style={{ width: '75%' }}></div>
                        </div>
                        <span>75%</span>
                      </div>
                    </div>
                  </div>
                  <div className="book-item">
                    <div className="book-cover"></div>
                    <div className="book-info">
                      <h4>Project Hail Mary</h4>
                      <p>Andy Weir</p>
                      <div className="book-progress">
                        <div className="book-progress-bar">
                          <div className="book-progress-fill" style={{ width: '30%' }}></div>
                        </div>
                        <span>30%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="segment-actions">
                  <button className="action-btn">Edit</button>
                  <button className="action-btn">Share</button>
                </div>
              </div>
              
              <div className="segment-card">
                <div className="segment-header">
                  <h3>Sci-Fi Collection</h3>
                  <span className="badge">12 Books</span>
                </div>
                <div className="segment-books">
                  <div className="book-item">
                    <div className="book-cover"></div>
                    <div className="book-info">
                      <h4>Dune</h4>
                      <p>Frank Herbert</p>
                      <span className="status-tag completed">Completed</span>
                    </div>
                  </div>
                  <div className="book-item">
                    <div className="book-cover"></div>
                    <div className="book-info">
                      <h4>The Three-Body Problem</h4>
                      <p>Liu Cixin</p>
                      <span className="status-tag to-read">To Read</span>
                    </div>
                  </div>
                </div>
                <div className="segment-actions">
                  <button className="action-btn">Edit</button>
                  <button className="action-btn">Share</button>
                </div>
              </div>
              
              <div className="segment-card add-segment">
                <div className="add-segment-content">
                  <span className="add-icon">+</span>
                  <p>Create New Segment</p>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'community':
        return (
          <div className="feature-content community-content">
            <div className="feature-header">
              <h2>Community & Clubs</h2>
              <button className="primary-btn">+ Create New Club</button>
            </div>
            <div className="community-layout">
              <div className="community-sidebar">
                <div className="sidebar-tabs">
                  <button className="sidebar-tab active">Clubs</button>
                  <button className="sidebar-tab">Messages</button>
                  <button className="sidebar-tab">Events</button>
                </div>
                <div className="clubs-list">
                  <div className="club-item active">
                    <div className="club-avatar"></div>
                    <div className="club-info">
                      <h4>Fantasy Readers</h4>
                      <p>342 members</p>
                    </div>
                    <span className="notification-badge">5</span>
                  </div>
                  <div className="club-item">
                    <div className="club-avatar"></div>
                    <div className="club-info">
                      <h4>Science Fiction</h4>
                      <p>289 members</p>
                    </div>
                  </div>
                  <div className="club-item">
                    <div className="club-avatar"></div>
                    <div className="club-info">
                      <h4>Mystery Lovers</h4>
                      <p>178 members</p>
                    </div>
                    <span className="notification-badge">2</span>
                  </div>
                </div>
              </div>
              <div className="community-feed">
                <div className="pinned-event">
                  <div className="event-banner">
                    <span className="event-tag">Upcoming Event</span>
                  </div>
                  <div className="event-details">
                    <h3>Author Q&A: Brandon Sanderson</h3>
                    <p>Join us for a live virtual Q&A session with Brandon Sanderson discussing the Mistborn series</p>
                    <div className="event-meta">
                      <span className="event-time">Tomorrow, 7:00 PM</span>
                      <span className="event-attendees">156 attending</span>
                    </div>
                    <button className="attend-btn">Add to Calendar</button>
                  </div>
                </div>
                
                <div className="feed-post">
                  <div className="post-header">
                    <div className="author-avatar"></div>
                    <div className="post-meta">
                      <h4>Michael Chen</h4>
                      <div className="post-details">
                        <span className="club-tag">Fantasy Readers</span>
                        <span className="post-time">2 hours ago</span>
                      </div>
                    </div>
                  </div>
                  <div className="post-content">
                    <h3>Thoughts on The Name of the Wind</h3>
                    <p>I just finished reading The Name of the Wind by Patrick Rothfuss and wanted to share my thoughts on the magic system...</p>
                  </div>
                  <div className="post-actions">
                    <button className="action-link">24 Likes</button>
                    <button className="action-link">12 Comments</button>
                    <button className="action-link">Share</button>
                  </div>
                </div>
                
                <div className="feed-post">
                  <div className="post-header">
                    <div className="author-avatar"></div>
                    <div className="post-meta">
                      <h4>Sarah Johnson</h4>
                      <div className="post-details">
                        <span className="club-tag">Business Books</span>
                        <span className="post-time">4 hours ago</span>
                      </div>
                    </div>
                  </div>
                  <div className="post-content">
                    <h3>Summary: The Psychology of Money</h3>
                    <p>Here are my key takeaways from Morgan Housel's The Psychology of Money. I found chapter 3 particularly insightful when it discusses...</p>
                  </div>
                  <div className="post-actions">
                    <button className="action-link">35 Likes</button>
                    <button className="action-link">8 Comments</button>
                    <button className="action-link">Share</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'marketplace':
        return (
          <div className="feature-content marketplace-content">
            <div className="feature-header">
              <h2>Book Marketplace</h2>
              <button className="primary-btn">+ Sell a Book</button>
            </div>
            <div className="marketplace-filters">
              <div className="search-container">
                <input type="text" placeholder="Search books, authors..." />
                <button className="search-btn">Search</button>
              </div>
              <div className="filter-container">
                <select className="filter-select">
                  <option>All Categories</option>
                  <option>Fiction</option>
                  <option>Non-Fiction</option>
                  <option>Sci-Fi</option>
                  <option>Mystery</option>
                </select>
                <select className="filter-select">
                  <option>All Conditions</option>
                  <option>New</option>
                  <option>Like New</option>
                  <option>Good</option>
                  <option>Acceptable</option>
                </select>
                <select className="filter-select">
                  <option>Sort By: Newest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Best Rated</option>
                </select>
              </div>
            </div>
            <div className="book-listings">
              <div className="book-card">
                <div className="book-badge new">New</div>
                <div className="book-image"></div>
                <div className="book-details">
                  <h3>Cloud Cuckoo Land</h3>
                  <p className="book-author">Anthony Doerr</p>
                  <div className="seller-info">
                    <p>Seller: Robert Johnson</p>
                    <div className="seller-rating">
                      <span className="stars">★★★★★</span>
                      <span className="rating-value">4.9</span>
                    </div>
                  </div>
                  <div className="book-price">$14.99</div>
                  <div className="book-condition">Like New</div>
                </div>
                <div className="book-actions">
                  <button className="buy-now-btn">Buy Now</button>
                  <button className="make-offer-btn">Make Offer</button>
                </div>
              </div>
              
              <div className="book-card">
                <div className="book-badge used">Used</div>
                <div className="book-image"></div>
                <div className="book-details">
                  <h3>The Lincoln Highway</h3>
                  <p className="book-author">Amor Towles</p>
                  <div className="seller-info">
                    <p>Seller: Amanda Garcia</p>
                    <div className="seller-rating">
                      <span className="stars">★★★★★</span>
                      <span className="rating-value">4.7</span>
                    </div>
                  </div>
                  <div className="book-price">$13.25</div>
                  <div className="book-condition">Excellent</div>
                </div>
                <div className="book-actions">
                  <button className="buy-now-btn">Buy Now</button>
                  <button className="make-offer-btn">Make Offer</button>
                </div>
              </div>
              
              <div className="book-card">
                <div className="book-badge pending">Offer Pending</div>
                <div className="book-image"></div>
                <div className="book-details">
                  <h3>The Dutch House</h3>
                  <p className="book-author">Ann Patchett</p>
                  <div className="seller-info">
                    <p>Seller: Daniel Wilson</p>
                    <div className="seller-rating">
                      <span className="stars">★★★★★</span>
                      <span className="rating-value">4.8</span>
                    </div>
                  </div>
                  <div className="book-price">$9.99</div>
                  <div className="book-condition">Good</div>
                </div>
                <div className="book-actions">
                  <button className="buy-now-btn" disabled>Buy Now</button>
                  <button className="make-offer-btn" disabled>Make Offer</button>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'bookbot':
        return (
          <div className="feature-content bookbot-content">
            <div className="feature-header">
              <h2>Bri - Bibliophile Reader Interface</h2>
            </div>
            <div className="chat-container">
              <div className="chat-history">
                <div className="chat-date-separator">
                  <span>Today</span>
                </div>
                <div className="chat-message bot">
                  <div className="message-avatar"></div>
                  <div className="message-content">
                    <p>Hello! I'm Bri, your Bibliophile Reader Interface. I can help you discover new books, provide recommendations, answer questions about books you're reading, and more. How can I assist you today?</p>
                    <div className="message-time">10:30 AM</div>
                  </div>
                </div>
                <div className="chat-message user">
                  <div className="message-content">
                    <p>I just finished reading Project Hail Mary by Andy Weir and loved it. Can you recommend similar sci-fi books?</p>
                    <div className="message-time">10:32 AM</div>
                  </div>
                </div>
                <div className="chat-message bot">
                  <div className="message-avatar"></div>
                  <div className="message-content">
                    <p>Great choice! If you enjoyed Project Hail Mary, I think you'll like these sci-fi books with similar themes of scientific problem-solving and space exploration:</p>
                    <div className="book-carousel">
                      <div className="carousel-book">
                        <div className="carousel-book-cover"></div>
                        <div className="carousel-book-info">
                          <h4>The Martian</h4>
                          <p>Andy Weir</p>
                        </div>
                      </div>
                      <div className="carousel-book">
                        <div className="carousel-book-cover"></div>
                        <div className="carousel-book-info">
                          <h4>Children of Time</h4>
                          <p>Adrian Tchaikovsky</p>
                        </div>
                      </div>
                      <div className="carousel-book">
                        <div className="carousel-book-cover"></div>
                        <div className="carousel-book-info">
                          <h4>Seveneves</h4>
                          <p>Neal Stephenson</p>
                        </div>
                      </div>
                    </div>
                    <div className="message-time">10:33 AM</div>
                    <div className="message-feedback">
                      <button className="feedback-btn">👍</button>
                      <button className="feedback-btn">👎</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="chat-input-container">
                <div className="quick-replies">
                  <button className="quick-reply-chip">Recommend a mystery book</button>
                  <button className="quick-reply-chip">Find books like The Hobbit</button>
                  <button className="quick-reply-chip">Book clubs near me</button>
                </div>
                <div className="chat-input">
                  <input type="text" placeholder="Ask me anything about books..." />
                  <button className="send-button">Send</button>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'writer':
        return (
          <div className="feature-content writer-content">
            <div className="feature-header">
              <h2>Writer.ai</h2>
              <div className="writer-actions">
                <button className="action-btn">Save</button>
                <button className="action-btn">Export</button>
                <button className="action-btn">Share</button>
              </div>
            </div>
            <div className="writer-layout">
              <div className="writer-sidebar">
                <div className="project-info">
                  <h3>My Novel</h3>
                  <div className="project-meta">
                    <span>Last edited: Today, 2:45 PM</span>
                    <span>Word count: 15,245</span>
                  </div>
                </div>
                <div className="chapter-list">
                  <h4>Chapters</h4>
                  <ul>
                    <li className="chapter-item completed">
                      <span className="chapter-number">1</span>
                      <span className="chapter-title">The Beginning</span>
                    </li>
                    <li className="chapter-item completed">
                      <span className="chapter-number">2</span>
                      <span className="chapter-title">The Journey</span>
                    </li>
                    <li className="chapter-item active">
                      <span className="chapter-number">3</span>
                      <span className="chapter-title">The Challenge</span>
                    </li>
                    <li className="chapter-item">
                      <span className="chapter-number">4</span>
                      <span className="chapter-title">The Revelation</span>
                    </li>
                    <li className="add-chapter">
                      <span className="add-icon">+</span>
                      <span>Add Chapter</span>
                    </li>
                  </ul>
                </div>
                <div className="writing-progress">
                  <h4>Progress</h4>
                  <div className="progress-stat">
                    <div className="stat-label">Total Progress</div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '45%' }}></div>
                    </div>
                    <div className="stat-value">45%</div>
                  </div>
                  <div className="progress-stat">
                    <div className="stat-label">Daily Goal</div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '80%' }}></div>
                    </div>
                    <div className="stat-value">800/1000 words</div>
                  </div>
                </div>
                <div className="ai-assistants">
                  <h4>AI Assistants</h4>
                  <button className="assistant-btn">Plot Development</button>
                  <button className="assistant-btn">Character Building</button>
                  <button className="assistant-btn">Dialogue Enhancement</button>
                </div>
              </div>
              <div className="writer-editor">
                <div className="editor-toolbar">
                  <div className="toolbar-group">
                    <button className="toolbar-btn">B</button>
                    <button className="toolbar-btn">I</button>
                    <button className="toolbar-btn">U</button>
                  </div>
                  <div className="toolbar-group">
                    <button className="toolbar-btn">H1</button>
                    <button className="toolbar-btn">H2</button>
                    <button className="toolbar-btn">¶</button>
                  </div>
                  <div className="toolbar-group">
                    <button className="toolbar-btn">⌘</button>
                    <button className="toolbar-btn">◎</button>
                  </div>
                </div>
                <div className="editor-content">
                  <h2>Chapter 3: The Challenge</h2>
                  <p>The morning sun cast long shadows across the valley as Elena prepared for the day ahead. She knew that the challenge awaiting her would test not only her physical abilities but also her resolve.</p>
                  <p>The council had been clear—either she completed the trials or her family would face exile. There was no middle ground, no room for partial success.</p>
                  <p><span className="ai-suggestion">The weight of responsibility pressed down on her shoulders like a physical burden, making each step towards the ancient grounds feel like walking through deep water.</span></p>
                  <p>"You don't have to do this," Marcus said, his voice barely above a whisper. He stood at the edge of the clearing, concern etched across his face.</p>
                  <p>"We both know that's not true," Elena replied, adjusting the ceremonial dagger at her belt. "There's no choice here. There never was."</p>
                </div>
                <div className="collaboration-panel">
                  <div className="collaborators">
                    <div className="collaborator">
                      <div className="collaborator-avatar you"></div>
                      <span>You</span>
                    </div>
                    <div className="collaborator">
                      <div className="collaborator-avatar"></div>
                      <span>AI Assistant</span>
                    </div>
                  </div>
                  <button className="invite-btn">+ Invite Co-Author</button>
                </div>
              </div>
              <div className="writer-notes">
                <h3>Notes & Suggestions</h3>
                <div className="note-item">
                  <h4>Character Consistency</h4>
                  <p>Elena's determination here contrasts with her hesitation in Chapter 1. Consider adding a brief reflection on what changed.</p>
                </div>
                <div className="note-item">
                  <h4>Setting Description</h4>
                  <p>The valley mentioned could use more sensory details to enhance immersion.</p>
                </div>
                <div className="note-item">
                  <h4>AI Suggestion</h4>
                  <p>Try expanding the dialogue between Elena and Marcus to reveal more of their relationship dynamics.</p>
                  <button className="apply-suggestion-btn">Apply</button>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return <div>Feature not found</div>;
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <div className="user-profile">
          <div className="user-avatar"></div>
          <div className="user-info">
            <h3>{user?.email}</h3>
            <p>Book Enthusiast</p>
          </div>
        </div>
        <div className="feature-navigation">
          <button 
            className={`feature-btn ${activeFeature === 'library' ? 'active' : ''}`}
            onClick={() => setActiveFeature('library')}
          >
            <span className="feature-icon library-icon">📚</span>
            <span className="feature-label">My Library</span>
          </button>
          <button 
            className={`feature-btn ${activeFeature === 'community' ? 'active' : ''}`}
            onClick={() => setActiveFeature('community')}
          >
            <span className="feature-icon community-icon">👥</span>
            <span className="feature-label">Community & Clubs</span>
          </button>
          <button 
            className={`feature-btn ${activeFeature === 'marketplace' ? 'active' : ''}`}
            onClick={() => setActiveFeature('marketplace')}
          >
            <span className="feature-icon marketplace-icon">🛍️</span>
            <span className="feature-label">Marketplace</span>
          </button>
          <button 
            className={`feature-btn ${activeFeature === 'bookbot' ? 'active' : ''}`}
            onClick={() => setActiveFeature('bookbot')}
          >
            <span className="feature-icon bookbot-icon">🤖</span>
            <span className="feature-label">Bri</span>
          </button>
          <button 
            className={`feature-btn ${activeFeature === 'writer' ? 'active' : ''}`}
            onClick={() => setActiveFeature('writer')}
          >
            <span className="feature-icon writer-icon">✍️</span>
            <span className="feature-label">Writer.ai</span>
          </button>
        </div>
        <div className="dashboard-footer">
          <button 
            className="sign-out-button"
            onClick={() => supabase.auth.signOut()}
          >
            Sign Out
          </button>
        </div>
      </div>
      <div className="dashboard-content">
        {renderFeatureContent()}
      </div>
    </div>
  );
};

export default Dashboard; 