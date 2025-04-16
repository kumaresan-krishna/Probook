import React, { useState, useEffect } from 'react';
import '../styles/Clubs.css';

interface Club {
  id: number;
  name: string;
  description: string;
  coverImage: string;
  genres: string[];
  memberCount: number;
  activity: 'Very High' | 'High' | 'Medium' | 'Low';
  isMember?: boolean;
  isModerator?: boolean;
  ranking?: {
    popularity: number; // 1 = most popular
    activity: number;   // 1 = most active
  };
  isFavorite?: boolean;
  lastActive?: string;
  pinnedPosts?: Post[];
}

interface Post {
  id: number;
  authorId: number;
  authorName: string;
  authorAvatar: string;
  content: string;
  likes: number;
  comments: number;
  timestamp: string;
  attachedBook?: {
    title: string;
    author: string;
    coverImage: string;
  };
  isPoll?: boolean;
  pollOptions?: {
    text: string;
    votes: number;
  }[];
}

interface ClubEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  meetLink: string;
  attendees: number;
  isReadAlong?: boolean;
  readAlongBook?: {
    title: string;
    author: string;
    coverImage: string;
    currentPage?: number;
    totalPages?: number;
  };
}

interface ClubMember {
  id: number;
  name: string;
  avatar: string;
  isModerator: boolean;
  joinedDate: string;
}

interface ChatMessage {
  id: number;
  userId: number;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  reactions: {
    '❤️': number;
    '🔥': number;
    '👍': number;
    '😂': number;
  };
  userReactions?: string[];
}

const Clubs: React.FC = () => {
  // States for various views
  const [view, setView] = useState<'discover' | 'profile' | 'dashboard' | 'create'>('discover');
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'discussions' | 'events' | 'members'>('discussions');
  const [chatOpen, setChatOpen] = useState(false);
  
  // New states
  const [sortBy, setSortBy] = useState<'recommended' | 'popular' | 'active' | 'newest'>('recommended');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [showPinnedPosts, setShowPinnedPosts] = useState(true);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  // Sample Data
  const allGenres = [
    'Fantasy', 'Science Fiction', 'Mystery', 'Thriller', 'Romance', 
    'Historical Fiction', 'Non-Fiction', 'Biography', 'Self-Help', 'Poetry'
  ];

  const trendingClubs: Club[] = [
    {
      id: 1,
      name: 'Fantasy Readers',
      description: 'A community for fans of fantasy literature. We discuss everything from classic epics to modern urban fantasy and everything in between.',
      coverImage: 'https://images.unsplash.com/photo-1518872380-13cd9f638c2b',
      genres: ['Fantasy', 'Adventure'],
      memberCount: 342,
      activity: 'Very High',
      isMember: true,
      ranking: { popularity: 1, activity: 2 },
      isFavorite: true,
      lastActive: '2 minutes ago',
      pinnedPosts: [
        {
          id: 101,
          authorId: 201,
          authorName: 'Alex Rivera',
          authorAvatar: 'https://randomuser.me/api/portraits/men/52.jpg',
          content: '📢 Welcome to Fantasy Readers! Please read our community guidelines before posting. Our next book club pick will be "The Way of Kings" by Brandon Sanderson.',
          likes: 45,
          comments: 12,
          timestamp: '2 weeks ago'
        }
      ]
    },
    {
      id: 2,
      name: 'Science Fiction Explorers',
      description: 'Explore the worlds of science fiction with us. We discuss novels, short stories, TV shows, and movies.',
      coverImage: 'https://images.unsplash.com/photo-1465101162946-4377e57745c3',
      genres: ['Science Fiction'],
      memberCount: 289,
      activity: 'High',
      isMember: true,
      ranking: { popularity: 3, activity: 1 },
      isFavorite: true,
      lastActive: '1 hour ago'
    },
    {
      id: 3,
      name: 'Mystery Book Club',
      description: 'For fans of whodunits, detective stories, and all things mysterious.',
      coverImage: 'https://images.unsplash.com/photo-1576872381149-7847515ce5d8',
      genres: ['Mystery', 'Thriller'],
      memberCount: 187,
      activity: 'Medium',
      ranking: { popularity: 5, activity: 6 },
      lastActive: '3 days ago'
    },
    {
      id: 4,
      name: 'Classic Literature',
      description: 'Discussing timeless classics from around the world and throughout history.',
      coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d',
      genres: ['Classic', 'Literary Fiction'],
      memberCount: 134,
      activity: 'Medium',
      isMember: true,
      isModerator: true,
      ranking: { popularity: 6, activity: 7 },
      lastActive: '2 days ago'
    },
    {
      id: 5,
      name: 'Romance Readers',
      description: 'For passionate readers of romance novels of all types - historical, contemporary, paranormal, and more.',
      coverImage: 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954',
      genres: ['Romance'],
      memberCount: 256,
      activity: 'High',
      ranking: { popularity: 2, activity: 3 },
      lastActive: '5 hours ago'
    },
    {
      id: 6,
      name: 'History Buffs',
      description: 'A club for readers who love historical fiction and non-fiction history books.',
      coverImage: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1',
      genres: ['Historical Fiction', 'Non-Fiction', 'Biography'],
      memberCount: 128,
      activity: 'Medium',
      ranking: { popularity: 4, activity: 5 },
      lastActive: '1 day ago'
    }
  ];

  // Sample Club Discussions/Posts
  const clubPosts: Post[] = [
    {
      id: 1,
      authorId: 101,
      authorName: 'Sarah Johnson',
      authorAvatar: 'https://randomuser.me/api/portraits/women/42.jpg',
      content: 'Just finished reading "The Fifth Season" by N.K. Jemisin and I\'m absolutely blown away by the world-building. Anyone else read this series?',
      likes: 24,
      comments: 12,
      timestamp: '2 hours ago',
      attachedBook: {
        title: 'The Fifth Season',
        author: 'N.K. Jemisin',
        coverImage: 'https://images-na.ssl-images-amazon.com/images/I/91hJ+x0BrUL.jpg'
      }
    },
    {
      id: 2,
      authorId: 102,
      authorName: 'Michael Chen',
      authorAvatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      content: 'What should we read for next month? Please vote in the poll below!',
      likes: 18,
      comments: 5,
      timestamp: '1 day ago',
      isPoll: true,
      pollOptions: [
        { text: 'Piranesi by Susanna Clarke', votes: 12 },
        { text: 'The Starless Sea by Erin Morgenstern', votes: 15 },
        { text: 'Black Sun by Rebecca Roanhorse', votes: 8 },
        { text: 'A Master of Djinn by P. Djèlí Clark', votes: 10 }
      ]
    },
    {
      id: 3,
      authorId: 103,
      authorName: 'Emily Rodriguez',
      authorAvatar: 'https://randomuser.me/api/portraits/women/33.jpg',
      content: 'I\'ve created a character map for the complex relationships in "The Priory of the Orange Tree." Hope this helps others keep track!',
      likes: 45,
      comments: 22,
      timestamp: '3 days ago'
    }
  ];

  // Sample Club Events
  const clubEvents: ClubEvent[] = [
    {
      id: 1,
      title: 'July Book Discussion: The Fifth Season',
      description: 'Join us to discuss N.K. Jemisin\'s award-winning novel. Come with your questions and favorite moments!',
      date: 'July 28, 2023',
      time: '7:00 PM EST',
      meetLink: 'https://meet.google.com/abc-defg-hij',
      attendees: 32
    },
    {
      id: 2,
      title: 'Author Q&A: Brandon Sanderson',
      description: 'Special event! Brandon Sanderson will join us for a 45-minute Q&A session about the Cosmere universe.',
      date: 'August 10, 2023',
      time: '6:30 PM EST',
      meetLink: 'https://meet.google.com/klm-nopq-rst',
      attendees: 87
    },
    {
      id: 3,
      title: 'Fantasy Writing Workshop',
      description: 'Workshop for club members interested in writing their own fantasy stories. We\'ll cover worldbuilding, magic systems, and character development.',
      date: 'August 15, 2023',
      time: '5:00 PM EST',
      meetLink: 'https://meet.google.com/uvw-xyz-123',
      attendees: 24
    },
    {
      id: 4,
      title: 'Live Read-Along: The Way of Kings',
      description: "Join our synchronized reading session! We'll be reading chapters 15-20 together, with live discussion.",
      date: 'August 5, 2023',
      time: '8:00 PM EST',
      meetLink: 'https://meet.google.com/read-along-1',
      attendees: 42,
      isReadAlong: true,
      readAlongBook: {
        title: 'The Way of Kings',
        author: 'Brandon Sanderson',
        coverImage: 'https://images-na.ssl-images-amazon.com/images/I/91KzZWpgmyL.jpg',
        currentPage: 350,
        totalPages: 1007
      }
    }
  ];

  // Sample Club Members
  const clubMembers: ClubMember[] = [
    {
      id: 201,
      name: 'Alex Rivera',
      avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
      isModerator: true,
      joinedDate: 'Founder - Oct 2021'
    },
    {
      id: 202,
      name: 'Michelle Kim',
      avatar: 'https://randomuser.me/api/portraits/women/62.jpg',
      isModerator: true,
      joinedDate: 'Moderator - Dec 2021'
    },
    {
      id: 101,
      name: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/42.jpg',
      isModerator: false,
      joinedDate: 'Mar 2022'
    },
    {
      id: 102,
      name: 'Michael Chen',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      isModerator: false,
      joinedDate: 'Feb 2022'
    },
    {
      id: 103,
      name: 'Emily Rodriguez',
      avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
      isModerator: false,
      joinedDate: 'Apr 2022'
    }
  ];

  // Add sample chat messages
  const sampleChatMessages: ChatMessage[] = [
    {
      id: 1,
      userId: 201,
      userName: 'Alex Rivera',
      userAvatar: 'https://randomuser.me/api/portraits/men/52.jpg',
      content: 'Has anyone started reading "The Way of Kings" yet?',
      timestamp: '1 hour ago',
      reactions: { '❤️': 2, '🔥': 0, '👍': 5, '😂': 0 },
      userReactions: ['👍']
    },
    {
      id: 2,
      userId: 101,
      userName: 'Sarah Johnson',
      userAvatar: 'https://randomuser.me/api/portraits/women/42.jpg',
      content: "I'm about halfway through! Loving it so far.",
      timestamp: '45 minutes ago',
      reactions: { '❤️': 3, '🔥': 1, '👍': 2, '😂': 0 }
    },
    {
      id: 3,
      userId: 102,
      userName: 'Michael Chen',
      userAvatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      content: "I'm finding the beginning a bit slow, but everyone says it picks up.",
      timestamp: '30 minutes ago',
      reactions: { '❤️': 0, '🔥': 0, '👍': 2, '😂': 0 }
    },
    {
      id: 4,
      userId: 103,
      userName: 'Emily Rodriguez',
      userAvatar: 'https://randomuser.me/api/portraits/women/33.jpg',
      content: 'The worldbuilding is incredible! 🌍',
      timestamp: '15 minutes ago',
      reactions: { '❤️': 4, '🔥': 2, '👍': 1, '😂': 0 }
    }
  ];

  // Function to handle club selection
  const handleClubSelect = (club: Club) => {
    setSelectedClub(club);
    setView('profile');
  };

  // Function to join a club
  const handleJoinClub = () => {
    if (selectedClub) {
      setSelectedClub({
        ...selectedClub,
        isMember: true
      });
      // In a real app, this would make an API call to join the club
    }
  };

  // Function to enter club dashboard
  const handleEnterClub = () => {
    setView('dashboard');
  };

  // Function to handle creating a new club
  const handleCreateClub = () => {
    setView('create');
  };

  // PWA installation handler
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Function to show the install prompt
  const handleInstallClick = () => {
    if (installPrompt) {
      // Show the install prompt
      installPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      installPrompt.userChoice.then((choiceResult: {outcome: string}) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        // Clear the saved prompt since it can't be used again
        setInstallPrompt(null);
      });
    }
  };

  // Initialize chat messages
  useEffect(() => {
    if (selectedClub && selectedClub.id === 1) {
      setChatMessages(sampleChatMessages);
    } else {
      setChatMessages([]);
    }
  }, [selectedClub]);

  // Favorite/unfavorite club function
  const toggleFavorite = (clubId: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering the handleClubSelect

    const updatedClubs = trendingClubs.map(club => {
      if (club.id === clubId) {
        return { ...club, isFavorite: !club.isFavorite };
      }
      return club;
    });

    // In a real app, you would also make an API call here
    console.log(`Club ${clubId} ${trendingClubs.find(c => c.id === clubId)?.isFavorite ? 'unfavorited' : 'favorited'}`);
  };

  // Add a reaction to a chat message
  const addReaction = (messageId: number, reaction: string) => {
    setChatMessages(messages => 
      messages.map(message => {
        if (message.id === messageId) {
          const userReactions = message.userReactions || [];
          const hasReacted = userReactions.includes(reaction);
          
          if (hasReacted) {
            // Remove reaction
            return {
              ...message,
              reactions: {
                ...message.reactions,
                [reaction]: message.reactions[reaction as keyof typeof message.reactions] - 1
              },
              userReactions: userReactions.filter(r => r !== reaction)
            };
          } else {
            // Add reaction
            return {
              ...message,
              reactions: {
                ...message.reactions,
                [reaction]: message.reactions[reaction as keyof typeof message.reactions] + 1
              },
              userReactions: [...userReactions, reaction]
            };
          }
        }
        return message;
      })
    );
  };

  // Send a chat message
  const sendChatMessage = () => {
    if (chatInput.trim() === '') return;
    
    const newMessage: ChatMessage = {
      id: chatMessages.length + 1,
      userId: 999, // Current user
      userName: 'You',
      userAvatar: 'https://randomuser.me/api/portraits/men/85.jpg',
      content: chatInput,
      timestamp: 'Just now',
      reactions: { '❤️': 0, '🔥': 0, '👍': 0, '😂': 0 },
      userReactions: []
    };
    
    setChatMessages([...chatMessages, newMessage]);
    setChatInput('');
  };

  // Filter and sort clubs
  const processedClubs = trendingClubs
    .filter(club => {
      // Filter by genre
      if (genreFilter !== 'all' && !club.genres.includes(genreFilter)) {
        return false;
      }
      
      // Filter by search query
      if (searchQuery && !club.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Filter favorites
      if (showOnlyFavorites && !club.isFavorite) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort by selected criteria
      switch(sortBy) {
        case 'popular':
          return (a.ranking?.popularity || 999) - (b.ranking?.popularity || 999);
        case 'active':
          return (a.ranking?.activity || 999) - (b.ranking?.activity || 999);
        case 'newest':
          // This would need actual creation dates, using member count as proxy
          return b.memberCount - a.memberCount;
        default: // recommended
          // Complex algorithm for recommendations would go here
          // For example, a weighted score of popularity, activity, and match to user interests
          return ((a.isMember ? 0 : 1) - (b.isMember ? 0 : 1)) || 
                 ((a.isFavorite ? 0 : 1) - (b.isFavorite ? 0 : 1)) ||
                 ((a.ranking?.popularity || 999) - (b.ranking?.popularity || 999));
      }
    });

  // Calculate percentage for poll options
  const calculatePollPercentage = (votes: number, options: { text: string, votes: number }[]) => {
    const totalVotes = options.reduce((sum, option) => sum + option.votes, 0);
    return totalVotes === 0 ? 0 : Math.round((votes / totalVotes) * 100);
  };

  // Render club discovery view
  const renderClubDiscovery = () => (
    <div className="clubs-discovery">
      <div className="clubs-header">
        <h1>Book Clubs</h1>
        <div className="clubs-controls">
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Search clubs..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {installPrompt && (
            <button className="install-app-btn" onClick={handleInstallClick}>
              📱 Install App
            </button>
          )}
          <button className="create-club-btn" onClick={handleCreateClub}>Create Club</button>
        </div>
      </div>
      
      <div className="clubs-filters">
        <div className="clubs-sort">
          <label>Sort by: </label>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="recommended">Recommended</option>
            <option value="popular">Most Popular</option>
            <option value="active">Most Active</option>
            <option value="newest">Newest</option>
          </select>
        </div>
        
        <div className="favorites-filter">
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              checked={showOnlyFavorites}
              onChange={() => setShowOnlyFavorites(!showOnlyFavorites)}
            />
            Show favorites only
          </label>
        </div>
      </div>
      
      <div className="genre-filter">
        <button 
          className={genreFilter === 'all' ? 'active' : ''} 
          onClick={() => setGenreFilter('all')}
        >
          All Genres
        </button>
        {allGenres.map(genre => (
          <button
            key={genre}
            className={genreFilter === genre ? 'active' : ''}
            onClick={() => setGenreFilter(genre)}
          >
            {genre}
          </button>
        ))}
      </div>
      
      <div className="clubs-grid">
        {processedClubs.map(club => (
          <div className="club-card" key={club.id} onClick={() => handleClubSelect(club)}>
            <div className="club-banner" style={{ backgroundImage: `url(${club.coverImage})` }}>
              {club.isMember && <div className="member-badge">Member</div>}
              {club.isModerator && <div className="moderator-badge">Moderator</div>}
              <button 
                className={`favorite-btn ${club.isFavorite ? 'favorited' : ''}`}
                onClick={(e) => toggleFavorite(club.id, e)}
                aria-label={club.isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                {club.isFavorite ? '★' : '☆'}
              </button>
              {club.ranking?.popularity === 1 && <div className="most-popular-badge">Most Popular</div>}
              {club.ranking?.activity === 1 && <div className="most-active-badge">Most Active</div>}
            </div>
            <div className="club-info">
              <h3>{club.name}</h3>
              <div className="club-meta">
                <span className="members">{club.memberCount} members</span>
                <span className={`activity ${club.activity.toLowerCase().replace(' ', '-')}`}>{club.activity} Activity</span>
              </div>
              <div className="club-meta">
                <span className="last-active">Active: {club.lastActive}</span>
              </div>
              <div className="club-genres">
                {club.genres.map(genre => (
                  <span key={genre} className="genre-tag">{genre}</span>
                ))}
              </div>
              <p className="club-description">{club.description.substring(0, 100)}...</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render club profile view
  const renderClubProfile = () => {
    if (!selectedClub) return null;
    
    return (
      <div className="club-profile">
        <button className="back-btn" onClick={() => setView('discover')}>← Back to Clubs</button>
        
        <div className="club-banner-large" style={{ backgroundImage: `url(${selectedClub.coverImage})` }}>
          <div className="club-banner-overlay">
            <h1>{selectedClub.name}</h1>
            <div className="club-meta-large">
              <span className="members">{selectedClub.memberCount} members</span>
              <span className={`activity ${selectedClub.activity.toLowerCase().replace(' ', '-')}`}>
                {selectedClub.activity} Activity
              </span>
            </div>
            <div className="club-genres-large">
              {selectedClub.genres.map(genre => (
                <span key={genre} className="genre-tag">{genre}</span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="club-profile-content">
          <div className="club-description-full">
            <h2>About this Club</h2>
            <p>{selectedClub.description}</p>
          </div>
          
          <div className="club-preview">
            <h2>Recent Activity</h2>
            <div className="club-preview-post">
              <div className="preview-post-header">
                <div className="author-avatar" style={{ backgroundImage: `url(${clubPosts[0].authorAvatar})` }}></div>
                <div className="author-info">
                  <span className="author-name">{clubPosts[0].authorName}</span>
                  <span className="post-time">{clubPosts[0].timestamp}</span>
                </div>
              </div>
              <p className="post-content">{clubPosts[0].content}</p>
            </div>
            
            <div className="club-preview-event">
              <h3>Upcoming Event</h3>
              <div className="preview-event-card">
                <div className="event-title">{clubEvents[0].title}</div>
                <div className="event-date">{clubEvents[0].date} • {clubEvents[0].time}</div>
                <div className="event-attendees">{clubEvents[0].attendees} attending</div>
              </div>
            </div>
          </div>
          
          <div className="club-action">
            {selectedClub.isMember ? (
              <button className="enter-club-btn" onClick={handleEnterClub}>Enter Club</button>
            ) : (
              <button className="join-club-btn" onClick={handleJoinClub}>Join Club</button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render club dashboard view
  const renderClubDashboard = () => {
    if (!selectedClub) return null;
    
    return (
      <div className="club-dashboard">
        <div className="dashboard-header">
          <button className="back-btn" onClick={() => setView('discover')}>← Back to Clubs</button>
          <h1>{selectedClub.name}</h1>
          <button className="settings-btn">⚙️</button>
        </div>
        
        <div className="dashboard-tabs">
          <button 
            className={activeTab === 'discussions' ? 'active' : ''} 
            onClick={() => setActiveTab('discussions')}
          >
            Discussions
          </button>
          <button 
            className={activeTab === 'events' ? 'active' : ''} 
            onClick={() => setActiveTab('events')}
          >
            Events
          </button>
          <button 
            className={activeTab === 'members' ? 'active' : ''} 
            onClick={() => setActiveTab('members')}
          >
            Members
          </button>
        </div>
        
        <div className="dashboard-content">
          {activeTab === 'discussions' && (
            <div className="discussions-panel">
              {selectedClub.pinnedPosts && selectedClub.pinnedPosts.length > 0 && showPinnedPosts && (
                <div className="pinned-posts">
                  <div className="pinned-header">
                    <h3>📌 Pinned Announcements</h3>
                    <button 
                      className="toggle-pinned" 
                      onClick={() => setShowPinnedPosts(false)}
                    >
                      Hide
                    </button>
                  </div>
                  {selectedClub.pinnedPosts.map(post => (
                    <div className="pinned-post" key={post.id}>
                      <div className="post-header">
                        <div className="post-avatar" style={{ backgroundImage: `url(${post.authorAvatar})` }}></div>
                        <div className="post-meta">
                          <span className="post-author">{post.authorName}</span>
                          <span className="post-time">{post.timestamp}</span>
                        </div>
                      </div>
                      <div className="post-content">
                        <p>{post.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {!showPinnedPosts && selectedClub.pinnedPosts && selectedClub.pinnedPosts.length > 0 && (
                <button 
                  className="show-pinned-btn"
                  onClick={() => setShowPinnedPosts(true)}
                >
                  Show Pinned Announcements (1)
                </button>
              )}

              <div className="create-post">
                <textarea 
                  placeholder="Start a discussion or ask a question..."
                ></textarea>
                <div className="post-actions">
                  <button className="attach-book">📚 Attach Book</button>
                  <button className="create-poll">📊 Create Poll</button>
                  <button className="post-btn">Post</button>
                </div>
              </div>
              
              <div className="posts-list">
                {clubPosts.map(post => (
                  <div className="post-card" key={post.id}>
                    <div className="post-header">
                      <div className="post-avatar" style={{ backgroundImage: `url(${post.authorAvatar})` }}></div>
                      <div className="post-meta">
                        <span className="post-author">{post.authorName}</span>
                        <span className="post-time">{post.timestamp}</span>
                      </div>
                    </div>
                    
                    <div className="post-content">
                      <p>{post.content}</p>
                      
                      {post.attachedBook && (
                        <div className="attached-book">
                          <div className="book-cover" style={{ backgroundImage: `url(${post.attachedBook.coverImage})` }}></div>
                          <div className="book-info">
                            <div className="book-title">{post.attachedBook.title}</div>
                            <div className="book-author">{post.attachedBook.author}</div>
                          </div>
                        </div>
                      )}
                      
                      {post.isPoll && post.pollOptions && (
                        <div className="poll-container">
                          <div className="poll-options">
                            {post.pollOptions.map((option, index) => (
                              <div className="poll-option" key={index}>
                                <div className="option-text">{option.text}</div>
                                <div className="option-bar-container">
                                  <div 
                                    className="option-bar" 
                                    style={{ width: `${calculatePollPercentage(option.votes, post.pollOptions!)}%` }}
                                  ></div>
                                  <span className="vote-percentage">
                                    {calculatePollPercentage(option.votes, post.pollOptions!)}%
                                  </span>
                                </div>
                                <div className="vote-count">{option.votes} votes</div>
                              </div>
                            ))}
                          </div>
                          <button className="vote-btn">Vote</button>
                        </div>
                      )}
                    </div>
                    
                    <div className="post-footer">
                      <button className="like-btn">👍 {post.likes}</button>
                      <button className="comment-btn">💬 {post.comments}</button>
                      <button className="share-btn">🔗 Share</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'events' && (
            <div className="events-panel">
              <button className="create-event-btn">+ Create Event</button>
              
              <div className="events-list">
                {clubEvents.map(event => (
                  <div className={`event-card ${event.isReadAlong ? 'read-along-event' : ''}`} key={event.id}>
                    {event.isReadAlong && <div className="read-along-badge">📖 Live Read-Along</div>}
                    <div className="event-header">
                      <h3>{event.title}</h3>
                      <span className="event-date">{event.date} • {event.time}</span>
                    </div>
                    
                    <p className="event-description">{event.description}</p>
                    
                    {event.readAlongBook && (
                      <div className="read-along-details">
                        <div className="book-info-large">
                          <div className="book-cover-large" style={{ backgroundImage: `url(${event.readAlongBook.coverImage})` }}></div>
                          <div>
                            <h4>{event.readAlongBook.title}</h4>
                            <p>by {event.readAlongBook.author}</p>
                            {event.readAlongBook.currentPage && (
                              <div className="reading-progress">
                                <div className="progress-text">
                                  Reading: Page {event.readAlongBook.currentPage} of {event.readAlongBook.totalPages}
                                </div>
                                <div className="progress-bar-container">
                                  <div 
                                    className="progress-bar" 
                                    style={{ width: `${(event.readAlongBook.currentPage / (event.readAlongBook.totalPages ?? 1)) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="event-footer">
                      <span className="attendees">{event.attendees} attending</span>
                      <a href={event.meetLink} className="meet-link" target="_blank" rel="noopener noreferrer">
                        {event.isReadAlong ? 'Join Read-Along' : 'Join Google Meet'}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'members' && (
            <div className="members-panel">
              <div className="members-search">
                <input type="text" placeholder="Search members..." />
              </div>
              
              <div className="members-list">
                {clubMembers.map(member => (
                  <div className="member-card" key={member.id}>
                    <div className="member-avatar" style={{ backgroundImage: `url(${member.avatar})` }}></div>
                    <div className="member-info">
                      <div className="member-name">{member.name}</div>
                      <div className="member-since">Joined: {member.joinedDate}</div>
                    </div>
                    {member.isModerator && (
                      <div className="moderator-badge">Moderator</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Updated Chat Sidebar with reactions */}
        <div className={`chat-sidebar ${chatOpen ? 'open' : ''}`}>
          <div className="chat-header">
            <h3>Club Chat</h3>
            <button className="close-chat" onClick={() => setChatOpen(false)}>✕</button>
          </div>
          
          <div className="chat-messages">
            {chatMessages.length === 0 ? (
              <div className="chat-message-placeholder">
                Chat messages will appear here.
              </div>
            ) : (
              chatMessages.map((message) => (
                <div 
                  key={message.id} 
                  className={`chat-message ${message.userId === 999 ? 'own-message' : ''}`}
                >
                  <div className="message-avatar" style={{ backgroundImage: `url(${message.userAvatar})` }}></div>
                  <div className="message-content">
                    <div className="message-header">
                      <span className="message-sender">{message.userName}</span>
                      <span className="message-time">{message.timestamp}</span>
                    </div>
                    <p className="message-text">{message.content}</p>
                    
                    <div className="message-reactions">
                      {Object.entries(message.reactions).map(([reaction, count]) => (
                        count > 0 && (
                          <span 
                            key={reaction} 
                            className={`reaction-badge ${message.userReactions?.includes(reaction) ? 'user-reacted' : ''}`}
                            onClick={() => addReaction(message.id, reaction)}
                          >
                            {reaction} {count}
                          </span>
                        )
                      ))}
                      
                      <div className="reaction-buttons">
                        <button 
                          className="add-reaction-btn"
                          onClick={() => setSelectedReaction(selectedReaction ? null : 'open')}
                        >
                          +
                        </button>
                        
                        {selectedReaction === 'open' && (
                          <div className="reaction-selector">
                            <button onClick={() => { addReaction(message.id, '❤️'); setSelectedReaction(null); }}>❤️</button>
                            <button onClick={() => { addReaction(message.id, '🔥'); setSelectedReaction(null); }}>🔥</button>
                            <button onClick={() => { addReaction(message.id, '👍'); setSelectedReaction(null); }}>👍</button>
                            <button onClick={() => { addReaction(message.id, '😂'); setSelectedReaction(null); }}>😂</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="chat-input">
            <textarea 
              placeholder="Type a message..." 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendChatMessage())}
            ></textarea>
            <button onClick={sendChatMessage}>Send</button>
          </div>
        </div>
        
        {!chatOpen && (
          <button className="open-chat-btn" onClick={() => setChatOpen(true)}>
            💬 Chat
          </button>
        )}
      </div>
    );
  };

  // Render club creation form
  const renderClubCreation = () => (
    <div className="create-club-form">
      <button className="back-btn" onClick={() => setView('discover')}>← Back to Clubs</button>
      
      <h1>Create a New Book Club</h1>
      
      <form className="club-form">
        <div className="form-group">
          <label>Club Name</label>
          <input type="text" placeholder="Enter a name for your club" />
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea placeholder="What is your club about? What kinds of books will you discuss?"></textarea>
        </div>
        
        <div className="form-group">
          <label>Select Genres (up to 3)</label>
          <div className="genre-checkboxes">
            {allGenres.map(genre => (
              <label key={genre} className="genre-checkbox">
                <input type="checkbox" value={genre} />
                {genre}
              </label>
            ))}
          </div>
        </div>
        
        <div className="form-group">
          <label>Cover Image</label>
          <div className="image-upload">
            <input type="file" accept="image/*" />
            <div className="upload-placeholder">Click to upload an image</div>
          </div>
        </div>
        
        <div className="form-group">
          <label className="checkbox-label">
            <input type="checkbox" />
            Require approval for new members
          </label>
        </div>
        
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => setView('discover')}>Cancel</button>
          <button type="button" className="submit-btn" onClick={() => setView('discover')}>Create Club</button>
        </div>
      </form>
    </div>
  );

  // Render the appropriate view
  return (
    <div className="clubs-container">
      {view === 'discover' && renderClubDiscovery()}
      {view === 'profile' && renderClubProfile()}
      {view === 'dashboard' && renderClubDashboard()}
      {view === 'create' && renderClubCreation()}
    </div>
  );
};

export default Clubs; 