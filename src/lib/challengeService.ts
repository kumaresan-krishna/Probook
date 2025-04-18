import { v4 as uuidv4 } from 'uuid';
import { Challenge, UserChallenge, Book } from '../types';

// Local storage keys
const CHALLENGES_KEY = 'bookle_challenges';
const USER_CHALLENGES_KEY = 'bookle_user_challenges';

// Mock user ID (in a real app, this would come from authentication)
const CURRENT_USER_ID = 'current-user';

// Default challenges
const DEFAULT_CHALLENGES: Challenge[] = [
  {
    id: 'monthly-5books',
    title: 'Monthly Book Sprint',
    description: 'Read 5 books this month to earn the "Book Sprinter" badge!',
    type: 'monthly',
    criteria: {
      type: 'books_read',
      target: 5
    },
    reward: {
      type: 'badge',
      value: 'Book Sprinter',
      icon: '🏃'
    },
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString(),
    isActive: true
  },
  {
    id: 'seasonal-fantasy',
    title: 'Fantasy Explorer',
    description: 'Read 3 fantasy books this season to earn the "Fantasy Explorer" badge!',
    type: 'seasonal',
    criteria: {
      type: 'genres',
      target: 3,
      genreId: 'fantasy'
    },
    reward: {
      type: 'badge',
      value: 'Fantasy Explorer',
      icon: '🧙‍♂️'
    },
    startDate: new Date(new Date().getFullYear(), Math.floor(new Date().getMonth() / 3) * 3, 1).toISOString(),
    endDate: new Date(new Date().getFullYear(), Math.floor(new Date().getMonth() / 3) * 3 + 3, 0).toISOString(),
    isActive: true
  },
  {
    id: 'yearly-30books',
    title: 'Yearly Book Marathon',
    description: 'Read 30 books this year to earn the "Book Champion" badge!',
    type: 'yearly',
    criteria: {
      type: 'books_read',
      target: 30
    },
    reward: {
      type: 'badge',
      value: 'Book Champion',
      icon: '🏆'
    },
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString(),
    endDate: new Date(new Date().getFullYear(), 11, 31).toISOString(),
    isActive: true
  },
  {
    id: 'weekly-streak',
    title: 'Weekly Reading Streak',
    description: 'Maintain a 7-day reading streak to earn the "Consistent Reader" badge!',
    type: 'custom',
    criteria: {
      type: 'streaks',
      target: 7
    },
    reward: {
      type: 'badge',
      value: 'Consistent Reader',
      icon: '🔥'
    },
    startDate: new Date().toISOString(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
    isActive: true
  }
];

export class ChallengeService {
  // Get all available challenges
  public static getAllChallenges(): Challenge[] {
    try {
      const challenges = localStorage.getItem(CHALLENGES_KEY);
      if (!challenges) {
        // Initialize with default challenges
        localStorage.setItem(CHALLENGES_KEY, JSON.stringify(DEFAULT_CHALLENGES));
        return DEFAULT_CHALLENGES;
      }
      return JSON.parse(challenges);
    } catch (error) {
      console.error('Error getting challenges:', error);
      return [];
    }
  }

  // Get active challenges
  public static getActiveChallenges(): Challenge[] {
    const challenges = this.getAllChallenges();
    const now = new Date().toISOString();
    return challenges.filter(
      challenge => challenge.isActive && 
      challenge.startDate <= now && 
      challenge.endDate >= now
    );
  }

  // Get user's challenges
  public static getUserChallenges(): UserChallenge[] {
    try {
      const userChallenges = localStorage.getItem(USER_CHALLENGES_KEY);
      if (!userChallenges) {
        return [];
      }
      return JSON.parse(userChallenges);
    } catch (error) {
      console.error('Error getting user challenges:', error);
      return [];
    }
  }

  // Join a challenge
  public static joinChallenge(challengeId: string): UserChallenge | null {
    try {
      const challenges = this.getAllChallenges();
      const challenge = challenges.find(c => c.id === challengeId);
      
      if (!challenge || !challenge.isActive) return null;
      
      const userChallenges = this.getUserChallenges();
      
      // Check if user already joined this challenge
      if (userChallenges.some(uc => uc.challengeId === challengeId)) {
        return null;
      }
      
      const newUserChallenge: UserChallenge = {
        id: uuidv4(),
        userId: CURRENT_USER_ID,
        challengeId: challengeId,
        progress: 0,
        completed: false,
        joinedDate: new Date().toISOString()
      };
      
      userChallenges.push(newUserChallenge);
      localStorage.setItem(USER_CHALLENGES_KEY, JSON.stringify(userChallenges));
      
      return newUserChallenge;
    } catch (error) {
      console.error('Error joining challenge:', error);
      return null;
    }
  }

  // Update challenge progress
  public static updateChallengeProgress(books: Book[]): void {
    try {
      const userChallenges = this.getUserChallenges();
      const challenges = this.getAllChallenges();
      let updated = false;
      
      // For each user challenge, calculate progress
      for (const userChallenge of userChallenges) {
        if (userChallenge.completed) continue;
        
        const challenge = challenges.find(c => c.id === userChallenge.challengeId);
        if (!challenge) continue;
        
        let progress = 0;
        
        // Calculate progress based on challenge criteria
        switch (challenge.criteria.type) {
          case 'books_read':
            progress = books.filter(book => 
              book.status === 'completed' && 
              new Date(book.dateAdded) >= new Date(challenge.startDate)
            ).length;
            break;
            
          case 'genres':
            progress = books.filter(book => 
              book.status === 'completed' && 
              new Date(book.dateAdded) >= new Date(challenge.startDate) &&
              book.genre.includes(challenge.criteria.genreId || '')
            ).length;
            break;
            
          case 'streaks':
            // Simplified streak calculation
            // In a real app, this would be more sophisticated
            const lastWeekDates = Array.from({ length: 7 }, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - i);
              return date.toISOString().split('T')[0];
            });
            
            const readDates = new Set(
              books
                .filter(book => book.lastOpened)
                .map(book => book.lastOpened?.split('T')[0])
            );
            
            progress = lastWeekDates.filter(date => readDates.has(date)).length;
            break;
        }
        
        // Check if progress changed
        if (progress !== userChallenge.progress) {
          userChallenge.progress = progress;
          updated = true;
          
          // Check if challenge is completed
          if (progress >= challenge.criteria.target && !userChallenge.completed) {
            userChallenge.completed = true;
            userChallenge.completedDate = new Date().toISOString();
          }
        }
      }
      
      if (updated) {
        localStorage.setItem(USER_CHALLENGES_KEY, JSON.stringify(userChallenges));
      }
    } catch (error) {
      console.error('Error updating challenge progress:', error);
    }
  }

  // Get earned badges
  public static getEarnedBadges(): { name: string, icon: string }[] {
    try {
      const userChallenges = this.getUserChallenges().filter(uc => uc.completed);
      const challenges = this.getAllChallenges();
      
      return userChallenges
        .map(uc => {
          const challenge = challenges.find(c => c.id === uc.challengeId);
          if (!challenge || challenge.reward.type !== 'badge') return null;
          
          return {
            name: challenge.reward.value,
            icon: challenge.reward.icon || '🏅'
          };
        })
        .filter((badge): badge is { name: string, icon: string } => badge !== null);
    } catch (error) {
      console.error('Error getting earned badges:', error);
      return [];
    }
  }
} 