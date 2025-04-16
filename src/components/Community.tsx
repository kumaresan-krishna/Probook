import React, { useState, useEffect } from 'react';
import '../styles/Community.css';

const Community: React.FC = () => {
  // State for active filters and mobile detection
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [activeTopicFilter, setActiveTopicFilter] = useState<string>('popular');
  const [favoriteClubs, setFavoriteClubs] = useState<string[]>(['Fantasy Book Club', 'Science Fiction Readers']);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
  const [rankingType, setRankingType] = useState<string>('activity');

  // Sample data for posts
  const posts = [
    {
      id: 1,
      author: 'Sarah Johnson',
      club: 'Fantasy Book Club',
      time: '2 hours ago',
      content: 'Just finished "The Name of the Wind" and I\'m absolutely blown away. The prose is beautiful, and Kvothe\'s journey is captivating. Anyone else read it?',
      likes: 24,
      comments: 12,
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      reactions: [
        { emoji: '❤️', count: 14, reacted: true },
        { emoji: '👍', count: 8, reacted: false },
        { emoji: '🔥', count: 6, reacted: false }
      ]
    },
    {
      id: 2,
      author: 'Michael Chen',
      club: 'Science Fiction Readers',
      time: '5 hours ago',
      content: 'Our club\'s reading "Project Hail Mary" by Andy Weir this month. If you loved The Martian, you\'ll definitely enjoy this one. Fascinating science and a compelling story!',
      likes: 18,
      comments: 7,
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      reactions: [
        { emoji: '👍', count: 12, reacted: false },
        { emoji: '🚀', count: 5, reacted: false },
        { emoji: '🤔', count: 3, reacted: false }
      ]
    },
    {
      id: 3,
      author: 'Emily Rodriguez',
      club: 'Mystery Lovers',
      time: '1 day ago',
      content: 'We\'re starting a new initiative to spotlight underrepresented mystery authors. I\'m compiling a list - drop your recommendations in the comments!',
      likes: 32,
      comments: 28,
      avatar: 'https://randomuser.me/api/portraits/women/66.jpg',
      reactions: [
        { emoji: '👏', count: 22, reacted: false },
        { emoji: '❤️', count: 15, reacted: false },
        { emoji: '🙌', count: 8, reacted: false }
      ]
    }
  ];

  // Sample data for events
  const events = [
    {
      id: 1,
      title: 'Virtual Book Discussion: "Dune"',
      club: 'Science Fiction Readers',
      description: 'Join us for an in-depth discussion of Frank Herbert\'s sci-fi masterpiece.',
      date: 'Tomorrow, 7:00 PM',
      participants: 18,
      isLive: false
    },
    {
      id: 2,
      title: 'Author Q&A: Jane Doe',
      club: 'Mystery Lovers',
      description: 'Live interview with bestselling mystery author Jane Doe about her new novel.',
      date: 'Now',
      participants: 42,
      isLive: true
    },
    {
      id: 3,
      title: 'Fantasy Book Club Weekly Meeting',
      club: 'Fantasy Book Club',
      description: 'Our regular weekly meeting to discuss current reads and upcoming books.',
      date: 'Saturday, 3:00 PM',
      participants: 24,
      isLive: false
    }
  ];

  // Sample data for live read-alongs
  const liveReadAlongs = [
    {
      id: 1,
      title: '"The Fellowship of the Ring" Read-Along',
      club: 'Fantasy Book Club',
      currentChapter: 'Chapter 7: In the House of Tom Bombadil',
      participants: 26,
      progress: 32
    },
    {
      id: 2,
      title: '"Murder on the Orient Express" AudioBook Club',
      club: 'Mystery Lovers',
      currentChapter: 'Chapter 12: The Evidence of the Secretary',
      participants: 18,
      progress: 58
    }
  ];

  // Sample data for user clubs
  const userClubs = {
    moderating: [
      {
        id: 1,
        name: 'Fantasy Book Club',
        description: 'A community for lovers of fantasy literature, from epic adventures to magical realism.',
        members: 425,
        image: 'https://source.unsplash.com/random/300x200/?fantasy',
        activity: 'high',
        rank: 2
      }
    ],
    member: [
      {
        id: 2,
        name: 'Science Fiction Readers',
        description: 'Exploring the vast universes of science fiction across books, movies, and more.',
        members: 720,
        image: 'https://source.unsplash.com/random/300x200/?space',
        activity: 'high',
        rank: 1
      },
      {
        id: 3,
        name: 'Mystery Lovers',
        description: 'For those who enjoy solving puzzles and uncovering clues in the world of mystery novels.',
        members: 310,
        image: 'https://source.unsplash.com/random/300x200/?mystery',
        activity: 'medium',
        rank: 5
      },
      {
        id: 4,
        name: 'Historical Fiction Club',
        description: 'Discussing novels that bring history to life through compelling narratives.',
        members: 185,
        image: 'https://source.unsplash.com/random/300x200/?history',
        activity: 'low',
        rank: 12
      }
    ],
    discover: [
      {
        id: 5,
        name: 'Poetry Circle',
        description: 'Celebrating the beauty and power of poetry from all eras and styles.',
        members: 260,
        image: 'https://source.unsplash.com/random/300x200/?poetry',
        activity: 'medium',
        rank: 8
      },
      {
        id: 6,
        name: 'Thriller & Suspense',
        description: 'For readers who love heart-pounding suspense and unexpected twists.',
        members: 540,
        image: 'https://source.unsplash.com/random/300x200/?thriller',
        activity: 'high',
        rank: 3
      }
    ]
  };

  // Sample data for trending topics
  const trendingTopics = [
    {
      id: 1,
      title: 'BookTok Recommendations',
      posts: 42,
      lastActive: '10 minutes ago'
    },
    {
      id: 2,
      title: 'Controversial Endings Discussion',
      posts: 37,
      lastActive: '2 hours ago'
    },
    {
      id: 3,
      title: 'Best Debut Novels of 2023',
      posts: 29,
      lastActive: '1 hour ago'
    },
    {
      id: 4,
      title: 'Physical Books vs E-Readers',
      posts: 64,
      lastActive: '30 minutes ago'
    }
  ];

  // Sample data for polls
  const polls = [
    {
      id: 1,
      question: 'Which genre do you read most frequently?',
      options: [
        { text: 'Fantasy', votes: 127 },
        { text: 'Mystery/Thriller', votes: 104 },
        { text: 'Science Fiction', votes: 89 },
        { text: 'Literary Fiction', votes: 63 },
        { text: 'Historical Fiction', votes: 58 }
      ],
      totalVotes: 441,
      hasVoted: false
    },
    {
      id: 2,
      question: 'How many books do you typically read per month?',
      options: [
        { text: '0-1', votes: 78 },
        { text: '2-3', votes: 145 },
        { text: '4-6', votes: 94 },
        { text: '7+', votes: 42 }
      ],
      totalVotes: 359,
      hasVoted: true
    }
  ];

  // Sample data for messages
  const messages = [
    {
      id: 1,
      sender: 'Jessica Williams',
      avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
      preview: 'Hey! Just wanted to recommend a book I think you\'d love based on your recent posts...',
      time: '10:45 AM',
      unread: true
    },
    {
      id: 2,
      sender: 'David Lee',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      preview: 'Thanks for the book recommendation! I just started reading it and it\'s fantastic so far.',
      time: 'Yesterday',
      unread: false
    },
    {
      id: 3,
      sender: 'Sophia Martinez',
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
      preview: 'Are you joining the virtual book club meeting this weekend? We\'re discussing "The Midnight Library"...',
      time: 'Yesterday',
      unread: true
    }
  ];

  // Sample data for invitations
  const invitations = [
    {
      id: 1,
      type: 'club',
      from: 'Historical Non-Fiction Club',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'event',
      from: 'Alex Thompson',
      details: 'Author Signing: Margaret Atwood',
      time: 'Yesterday'
    }
  ];

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter posts based on the selected filter
  const filteredContent = () => {
    switch (activeFilter) {
      case 'posts':
        return { posts, events: [] };
      case 'events':
        return { posts: [], events };
      default:
        return { posts, events };
    }
  };

  // Toggle favorite status for a club
  const toggleFavorite = (clubName: string) => {
    if (favoriteClubs.includes(clubName)) {
      setFavoriteClubs(favoriteClubs.filter(club => club !== clubName));
    } else {
      setFavoriteClubs([...favoriteClubs, clubName]);
    }
  };

  // Add reaction to a post
  const addReaction = (postId: number, emoji: string) => {
    // This would interact with an API in a real application
    console.log(`Added ${emoji} reaction to post ${postId}`);
  };

  // Calculate percentage for poll options
  const calculatePercentage = (votes: number, total: number) => {
    return Math.round((votes / total) * 100);
  };

  // Determine activity level class
  const getActivityClass = (level: string) => {
    switch (level) {
      case 'high':
        return 'high';
      case 'medium':
        return 'medium';
      default:
        return 'low';
    }
  };

  // Sort clubs based on ranking type
  const sortClubs = (clubs: any[]) => {
    if (rankingType === 'activity') {
      return [...clubs].sort((a, b) => {
        if (a.activity === 'high' && b.activity !== 'high') return -1;
        if (a.activity !== 'high' && b.activity === 'high') return 1;
        if (a.activity === 'medium' && b.activity === 'low') return -1;
        if (a.activity === 'low' && b.activity === 'medium') return 1;
        return 0;
      });
    } else {
      return [...clubs].sort((a, b) => a.rank - b.rank);
    }
  };

  return (
    <div className="community-container">
      {/* Community Header */}
      <div className="community-header">
        <h1>Books Community</h1>
        <div className="community-actions">
          <button className="primary-btn">Create Club</button>
          <button className="secondary-btn">Find Clubs</button>
          {isMobile && (
            <button className="secondary-btn mobile-indicator">
              <span className="mobile-icon">📱</span> Mobile Mode
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Filter Club Activity:</label>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All Activity
            </button>
            <button
              className={`filter-btn ${activeFilter === 'posts' ? 'active' : ''}`}
              onClick={() => setActiveFilter('posts')}
            >
              Posts
            </button>
            <button
              className={`filter-btn ${activeFilter === 'events' ? 'active' : ''}`}
              onClick={() => setActiveFilter('events')}
            >
              Events
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-community-content">
        {/* Club Activity Feed */}
        <section>
          <div className="section-header">
            <h2>Club Activity Feed</h2>
          </div>
          <div className="feed-container">
            <div className="feed-posts">
              {filteredContent().posts.map(post => (
                <div className="feed-post" key={post.id}>
                  <div className="post-header">
                    <div className="post-avatar" style={{ backgroundImage: `url(${post.avatar})` }}></div>
                    <div className="post-meta">
                      <span className="post-author">{post.author}</span>
                      <span className="post-club">{post.club}</span>
                      <span className="post-time">{post.time}</span>
                    </div>
                  </div>
                  <div className="post-content">
                    <p>{post.content}</p>
                  </div>
                  <div className="post-reactions">
                    {post.reactions.map((reaction, i) => (
                      <button
                        key={i}
                        className="reaction-btn"
                        onClick={() => addReaction(post.id, reaction.emoji)}
                      >
                        <span className="reaction-emoji">{reaction.emoji}</span>
                        <span>{reaction.count}</span>
                      </button>
                    ))}
                    <button className="add-reaction-btn">+</button>
                  </div>
                  <div className="post-actions">
                    <button className="post-action-btn">
                      <span className="action-icon">💬</span> Comment ({post.comments})
                    </button>
                    <button className="post-action-btn">
                      <span className="action-icon">↪️</span> Share
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="events-container">
              <h3 className="events-title">Upcoming Events</h3>
              {filteredContent().events.map(event => (
                <div className={`event-card ${event.isLive ? 'live-event' : ''}`} key={event.id}>
                  {event.isLive && <span className="live-badge">LIVE NOW</span>}
                  <div className="event-header">
                    <h4 className="event-title">{event.title}</h4>
                    <span className="event-club">{event.club}</span>
                  </div>
                  <div className="event-details">
                    <p className="event-description">{event.description}</p>
                    <div className="event-meta">
                      <span>{event.date}</span>
                      <span>{event.participants} participants</span>
                    </div>
                  </div>
                  <button className="join-event-btn">
                    {event.isLive ? 'Join Now' : 'Remind Me'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Live Read-Alongs Section */}
        <section className="live-readalongs-section">
          <div className="section-header">
            <h2>Live Read-Alongs</h2>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="readalongs-container">
            {liveReadAlongs.length > 0 ? (
              liveReadAlongs.map(readAlong => (
                <div className="readalong-card" key={readAlong.id}>
                  <div className="readalong-header">
                    <h3 className="readalong-title">{readAlong.title}</h3>
                    <span className="readalong-club">{readAlong.club}</span>
                  </div>
                  <div className="readalong-details">
                    <div className="readalong-info">
                      <p><strong>Currently Reading:</strong> {readAlong.currentChapter}</p>
                      <p><strong>Participants:</strong> {readAlong.participants} online now</p>
                      <p><strong>Progress:</strong> {readAlong.progress}% complete</p>
                    </div>
                    <button className="join-event-btn">Join Read-Along</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-readalongs">
                <p>No active read-alongs at the moment.</p>
                <button className="primary-btn">Start a Read-Along</button>
              </div>
            )}
          </div>
        </section>

        {/* Your Clubs */}
        <section>
          <div className="section-header">
            <h2>Your Book Clubs</h2>
            <div className="rankings-toggle">
              <button 
                className={`ranking-btn ${rankingType === 'activity' ? 'active' : ''}`}
                onClick={() => setRankingType('activity')}
              >
                Most Active
              </button>
              <button 
                className={`ranking-btn ${rankingType === 'popularity' ? 'active' : ''}`}
                onClick={() => setRankingType('popularity')}
              >
                Most Popular
              </button>
            </div>
          </div>
          <div className="clubs-grid">
            {userClubs.moderating.length > 0 && (
              <>
                <h3>Clubs You Moderate</h3>
                <div className="clubs-list">
                  {sortClubs(userClubs.moderating).map(club => (
                    <div className="club-card" key={club.id}>
                      <div className="club-badge">
                        {rankingType === 'popularity' && club.rank <= 3 && (
                          <span className="ranking-badge">Top {club.rank}</span>
                        )}
                      </div>
                      <div className="club-image" style={{ backgroundImage: `url(${club.image})` }}></div>
                      <div className="club-details">
                        <div className="club-header">
                          <h4 className="club-name">{club.name}</h4>
                          <button 
                            className={`favorite-btn ${favoriteClubs.includes(club.name) ? 'active' : ''}`}
                            onClick={() => toggleFavorite(club.name)}
                          >
                            ★
                          </button>
                        </div>
                        <p className="club-description">{club.description}</p>
                        <div className="club-meta">
                          <span>{club.members} members</span>
                          <div className={`activity-indicator ${getActivityClass(club.activity)}`}>
                            <span className="dot"></span>
                            <span>{club.activity} activity</span>
                          </div>
                        </div>
                      </div>
                      <div className="club-actions">
                        <button className="primary-btn">Manage Club</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <h3>Clubs You're In</h3>
            <div className="clubs-list">
              {sortClubs(userClubs.member).map(club => (
                <div className="club-card" key={club.id}>
                  <div className="club-badge">
                    {rankingType === 'popularity' && club.rank <= 3 && (
                      <span className="ranking-badge">Top {club.rank}</span>
                    )}
                  </div>
                  <div className="club-image" style={{ backgroundImage: `url(${club.image})` }}></div>
                  <div className="club-details">
                    <div className="club-header">
                      <h4 className="club-name">{club.name}</h4>
                      <button 
                        className={`favorite-btn ${favoriteClubs.includes(club.name) ? 'active' : ''}`}
                        onClick={() => toggleFavorite(club.name)}
                      >
                        ★
                      </button>
                    </div>
                    <p className="club-description">{club.description}</p>
                    <div className="club-meta">
                      <span>{club.members} members</span>
                      <div className={`activity-indicator ${getActivityClass(club.activity)}`}>
                        <span className="dot"></span>
                        <span>{club.activity} activity</span>
                      </div>
                    </div>
                  </div>
                  <div className="club-actions">
                    <button className="primary-btn">View Club</button>
                  </div>
                </div>
              ))}
            </div>

            <h3>Discover New Clubs</h3>
            <div className="clubs-list">
              {sortClubs(userClubs.discover).map(club => (
                <div className="club-card" key={club.id}>
                  <div className="club-badge">
                    {rankingType === 'popularity' && club.rank <= 3 && (
                      <span className="ranking-badge">Top {club.rank}</span>
                    )}
                  </div>
                  <div className="club-image" style={{ backgroundImage: `url(${club.image})` }}></div>
                  <div className="club-details">
                    <div className="club-header">
                      <h4 className="club-name">{club.name}</h4>
                      <button 
                        className={`favorite-btn ${favoriteClubs.includes(club.name) ? 'active' : ''}`}
                        onClick={() => toggleFavorite(club.name)}
                      >
                        ★
                      </button>
                    </div>
                    <p className="club-description">{club.description}</p>
                    <div className="club-meta">
                      <span>{club.members} members</span>
                      <div className={`activity-indicator ${getActivityClass(club.activity)}`}>
                        <span className="dot"></span>
                        <span>{club.activity} activity</span>
                      </div>
                    </div>
                  </div>
                  <div className="club-actions">
                    <button className="primary-btn">Join Club</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trending Topics */}
        <section>
          <div className="section-header with-tabs">
            <h2>Trending Discussions</h2>
            <div className="section-tabs">
              <button
                className={`tab-btn ${activeTopicFilter === 'popular' ? 'active' : ''}`}
                onClick={() => setActiveTopicFilter('popular')}
              >
                Popular
              </button>
              <button
                className={`tab-btn ${activeTopicFilter === 'recent' ? 'active' : ''}`}
                onClick={() => setActiveTopicFilter('recent')}
              >
                Recent
              </button>
            </div>
          </div>
          <div className="trending-topics">
            {trendingTopics.map(topic => (
              <div className="trending-topic-card" key={topic.id}>
                <h3 className="topic-title">{topic.title}</h3>
                <div className="topic-meta">
                  <span>{topic.posts} posts</span>
                  <span>Active {topic.lastActive}</span>
                </div>
                <button className="join-discussion-btn">Join Discussion</button>
              </div>
            ))}
          </div>
        </section>

        {/* Active Polls */}
        <section>
          <div className="section-header">
            <h2>Active Polls</h2>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="polls-container">
            {polls.map(poll => (
              <div className="poll-card" key={poll.id}>
                <h3 className="poll-question">{poll.question}</h3>
                <div className="poll-options">
                  {poll.options.map((option, i) => {
                    const percentage = calculatePercentage(option.votes, poll.totalVotes);
                    return (
                      <div className="poll-option" key={i}>
                        <div className="option-bar">
                          <div 
                            className="option-progress" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                          <div className="option-text">
                            {option.text}
                            <span style={{ marginLeft: 'auto' }}>{percentage}%</span>
                          </div>
                        </div>
                        <div className="vote-count">{option.votes} votes</div>
                      </div>
                    );
                  })}
                </div>
                <div className="poll-footer">
                  <div className="total-votes">{poll.totalVotes} total votes</div>
                  {!poll.hasVoted && <button className="vote-btn">Vote</button>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Messages & Invitations */}
        <section className="messages-section">
          <div className="section-header">
            <h2>Messages & Invitations</h2>
            <span className="messages-count">5</span>
          </div>
          
          <div className="inbox-preview">
            <h3>Recent Messages</h3>
            <div className="messages-list">
              {messages.map(message => (
                <div className={`message-item ${message.unread ? 'unread' : ''}`} key={message.id}>
                  <img src={message.avatar} alt={message.sender} className="message-avatar" />
                  <div className="message-content">
                    <div className="message-header">
                      <span className="sender-name">{message.sender}</span>
                      <span className="message-time">{message.time}</span>
                    </div>
                    <p className="message-preview">{message.preview}</p>
                  </div>
                  {message.unread && <div className="unread-indicator"></div>}
                </div>
              ))}
            </div>
            <button className="view-all-messages">View All Messages</button>
          </div>
          
          <div className="invitations-preview">
            <h3>Club Invitations</h3>
            <div className="invitations-list">
              {invitations.map(invitation => (
                <div className="invitation-item" key={invitation.id}>
                  <div className="invitation-icon">
                    {invitation.type === 'club' ? '👥' : '📅'}
                  </div>
                  <div className="invitation-content">
                    <p className="invitation-text">
                      {invitation.type === 'club' 
                        ? `You've been invited to join ${invitation.from}`
                        : `${invitation.from} invited you to ${invitation.details}`
                      }
                    </p>
                    <span className="invitation-time">{invitation.time}</span>
                  </div>
                  <div className="invitation-actions">
                    <button className="accept-btn">Accept</button>
                    <button className="decline-btn">Decline</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Community; 