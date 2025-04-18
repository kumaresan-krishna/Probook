import { LeaderboardEntry } from '../types';

// Local storage key
const LEADERBOARD_KEY = 'bookle_leaderboard';

// Mock current user ID
const CURRENT_USER_ID = 'current-user';

// Mock user data
const MOCK_USERS = [
  {
    userId: CURRENT_USER_ID,
    username: 'You',
    avatar: '👤',
    books: 12,
    pages: 3245,
    isFriend: false
  },
  {
    userId: 'user1',
    username: 'BookLover42',
    avatar: '👩‍🦰',
    books: 15,
    pages: 4320,
    isFriend: true
  },
  {
    userId: 'user2',
    username: 'PageTurner',
    avatar: '👨‍🦱',
    books: 8,
    pages: 2150,
    isFriend: true
  },
  {
    userId: 'user3',
    username: 'ReadingRainbow',
    avatar: '👩‍🦳',
    books: 19,
    pages: 5100,
    isFriend: false
  },
  {
    userId: 'user4',
    username: 'BookishWanderer',
    avatar: '🧔',
    books: 14,
    pages: 3890,
    isFriend: true
  },
  {
    userId: 'user5',
    username: 'ReadingRocket',
    avatar: '👨‍🦲',
    books: 21,
    pages: 5640,
    isFriend: false
  },
  {
    userId: 'user6',
    username: 'LibraryExplorer',
    avatar: '👱‍♀️',
    books: 10,
    pages: 2900,
    isFriend: true
  },
  {
    userId: 'user7',
    username: 'BookWorm',
    avatar: '👧',
    books: 18,
    pages: 4700,
    isFriend: false
  }
];

export class LeaderboardService {
  // Get global leaderboard
  public static getGlobalLeaderboard(): LeaderboardEntry[] {
    try {
      // In a real app, this would fetch from a server
      // For now, we'll use mock data
      
      // Calculate scores (simple calculation: books * 100 + pages / 10)
      const entries = MOCK_USERS.map(user => ({
        ...user,
        score: user.books * 100 + Math.floor(user.pages / 10)
      }));
      
      // Sort by score (descending)
      const sortedEntries = entries.sort((a, b) => b.score - a.score);
      
      // Assign ranks
      return sortedEntries.map((entry, index) => ({
        ...entry,
        rank: index + 1
      }));
    } catch (error) {
      console.error('Error getting global leaderboard:', error);
      return [];
    }
  }
  
  // Get friends leaderboard
  public static getFriendsLeaderboard(): LeaderboardEntry[] {
    try {
      const allEntries = this.getGlobalLeaderboard();
      
      // Filter for friends and current user
      const friendsEntries = allEntries.filter(entry => 
        entry.isFriend || entry.userId === CURRENT_USER_ID
      );
      
      // Sort by score (descending)
      const sortedEntries = friendsEntries.sort((a, b) => b.score - a.score);
      
      // Assign ranks
      return sortedEntries.map((entry, index) => ({
        ...entry,
        rank: index + 1
      }));
    } catch (error) {
      console.error('Error getting friends leaderboard:', error);
      return [];
    }
  }
  
  // Get user's rank
  public static getUserRank(global: boolean = true): number {
    try {
      const leaderboard = global ? 
        this.getGlobalLeaderboard() : 
        this.getFriendsLeaderboard();
      
      const userEntry = leaderboard.find(entry => entry.userId === CURRENT_USER_ID);
      return userEntry ? userEntry.rank : 0;
    } catch (error) {
      console.error('Error getting user rank:', error);
      return 0;
    }
  }
  
  // Update user's stats (would be called when a user completes a book)
  public static updateUserStats(booksRead: number, pagesRead: number): void {
    try {
      const currentUser = MOCK_USERS.find(user => user.userId === CURRENT_USER_ID);
      if (currentUser) {
        currentUser.books = booksRead;
        currentUser.pages = pagesRead;
      }
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  }
} 