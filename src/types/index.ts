export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  status: 'reading' | 'completed' | 'to_read' | 'dnf';
  readingProgress?: number;
  lastOpened?: string;
  dateAdded: string;
  genre: string[];
  format: 'physical' | 'ebook' | 'audiobook';
  review?: string;
}

export interface CustomBookshelf {
  id: string;
  name: string;
  description?: string;
  bookIds: string[];
  createdAt: string;
  emoji?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'monthly' | 'seasonal' | 'yearly' | 'custom';
  criteria: {
    type: 'books_read' | 'pages_read' | 'genres' | 'authors' | 'streaks';
    target: number;
    genreId?: string;
    authorId?: string;
  };
  reward: {
    type: 'badge' | 'points' | 'title';
    value: string;
    icon?: string;
  };
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface UserChallenge {
  id: string;
  userId: string;
  challengeId: string;
  progress: number;
  completed: boolean;
  completedDate?: string;
  joinedDate: string;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar?: string;
  score: number;
  rank: number;
  books: number;
  pages: number;
  isFriend?: boolean;
} 