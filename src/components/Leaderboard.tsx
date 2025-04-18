import React, { useState, useEffect } from 'react';
import { LeaderboardEntry } from '../types';
import { LeaderboardService } from '../lib/leaderboardService';
import '../styles/Leaderboard.css';

interface LeaderboardProps {
  initialMode?: 'global' | 'friends';
}

const Leaderboard: React.FC<LeaderboardProps> = ({ initialMode = 'global' }) => {
  const [mode, setMode] = useState<'global' | 'friends'>(initialMode);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  
  useEffect(() => {
    // Load leaderboard data based on mode
    loadLeaderboardData();
  }, [mode]);
  
  const loadLeaderboardData = () => {
    const data = mode === 'global' 
      ? LeaderboardService.getGlobalLeaderboard() 
      : LeaderboardService.getFriendsLeaderboard();
    
    setEntries(data);
  };
  
  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return null;
    }
  };
  
  const isCurrentUser = (userId: string) => userId === 'current-user';
  
  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h2>Reader Leaderboard</h2>
        <div className="leaderboard-tabs">
          <button 
            className={`tab ${mode === 'global' ? 'active' : ''}`}
            onClick={() => setMode('global')}
          >
            Global
          </button>
          <button 
            className={`tab ${mode === 'friends' ? 'active' : ''}`}
            onClick={() => setMode('friends')}
          >
            Friends
          </button>
        </div>
      </div>
      
      <div className="leaderboard-timeframe">
        <span>Top Readers This Month</span>
      </div>
      
      <div className="leaderboard-table">
        <div className="leaderboard-headers">
          <div className="header rank">Rank</div>
          <div className="header user">Reader</div>
          <div className="header books">Books</div>
          <div className="header score">Score</div>
        </div>
        
        <div className="leaderboard-entries">
          {entries.length > 0 ? (
            entries.map(entry => (
              <div 
                key={entry.userId} 
                className={`leaderboard-entry ${isCurrentUser(entry.userId) ? 'current-user' : ''}`}
              >
                <div className="entry-rank">
                  {getMedalIcon(entry.rank) || entry.rank}
                </div>
                <div className="entry-user">
                  <span className="user-avatar">{entry.avatar}</span>
                  <span className="user-name">{entry.username}</span>
                  {entry.isFriend && <span className="friend-indicator">👫</span>}
                </div>
                <div className="entry-books">{entry.books}</div>
                <div className="entry-score">{entry.score}</div>
              </div>
            ))
          ) : (
            <div className="no-entries">No readers to display</div>
          )}
        </div>
      </div>
      
      <div className="leaderboard-footer">
        <p>
          <span className="info-icon">ℹ️</span>
          Score is calculated based on books completed and pages read this month
        </p>
      </div>
    </div>
  );
};

export default Leaderboard; 