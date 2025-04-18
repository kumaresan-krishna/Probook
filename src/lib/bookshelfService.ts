import { v4 as uuidv4 } from 'uuid';
import { CustomBookshelf } from '../types';

// Local storage key
const CUSTOM_BOOKSHELVES_KEY = 'bookle_custom_bookshelves';

// Default bookshelves
const DEFAULT_BOOKSHELVES = [
  {
    id: 'favorites',
    name: 'Favorites',
    description: 'My favorite books of all time',
    bookIds: [],
    createdAt: new Date().toISOString(),
    emoji: '⭐'
  }
];

export class BookshelfService {
  // Get all custom bookshelves
  public static getAllBookshelves(): CustomBookshelf[] {
    try {
      const bookshelves = localStorage.getItem(CUSTOM_BOOKSHELVES_KEY);
      if (!bookshelves) {
        // Initialize with default bookshelves
        localStorage.setItem(CUSTOM_BOOKSHELVES_KEY, JSON.stringify(DEFAULT_BOOKSHELVES));
        return DEFAULT_BOOKSHELVES;
      }
      return JSON.parse(bookshelves);
    } catch (error) {
      console.error('Error getting bookshelves:', error);
      return [];
    }
  }

  // Create a new custom bookshelf
  public static createBookshelf(name: string, description?: string, emoji?: string): CustomBookshelf {
    const bookshelves = this.getAllBookshelves();
    
    const newBookshelf: CustomBookshelf = {
      id: uuidv4(),
      name,
      description,
      bookIds: [],
      createdAt: new Date().toISOString(),
      emoji
    };
    
    bookshelves.push(newBookshelf);
    localStorage.setItem(CUSTOM_BOOKSHELVES_KEY, JSON.stringify(bookshelves));
    
    return newBookshelf;
  }

  // Update an existing bookshelf
  public static updateBookshelf(bookshelf: CustomBookshelf): boolean {
    try {
      const bookshelves = this.getAllBookshelves();
      const index = bookshelves.findIndex(b => b.id === bookshelf.id);
      
      if (index === -1) return false;
      
      bookshelves[index] = bookshelf;
      localStorage.setItem(CUSTOM_BOOKSHELVES_KEY, JSON.stringify(bookshelves));
      
      return true;
    } catch (error) {
      console.error('Error updating bookshelf:', error);
      return false;
    }
  }

  // Delete a bookshelf
  public static deleteBookshelf(bookshelfId: string): boolean {
    try {
      const bookshelves = this.getAllBookshelves();
      const updatedBookshelves = bookshelves.filter(b => b.id !== bookshelfId);
      
      if (updatedBookshelves.length === bookshelves.length) return false;
      
      localStorage.setItem(CUSTOM_BOOKSHELVES_KEY, JSON.stringify(updatedBookshelves));
      return true;
    } catch (error) {
      console.error('Error deleting bookshelf:', error);
      return false;
    }
  }

  // Add a book to a bookshelf
  public static addBookToShelf(bookId: string, shelfId: string): boolean {
    try {
      const bookshelves = this.getAllBookshelves();
      const shelf = bookshelves.find(b => b.id === shelfId);
      
      if (!shelf) return false;
      
      // Don't add if already in the shelf
      if (shelf.bookIds.includes(bookId)) return true;
      
      shelf.bookIds.push(bookId);
      localStorage.setItem(CUSTOM_BOOKSHELVES_KEY, JSON.stringify(bookshelves));
      
      return true;
    } catch (error) {
      console.error('Error adding book to shelf:', error);
      return false;
    }
  }

  // Remove a book from a bookshelf
  public static removeBookFromShelf(bookId: string, shelfId: string): boolean {
    try {
      const bookshelves = this.getAllBookshelves();
      const shelf = bookshelves.find(b => b.id === shelfId);
      
      if (!shelf) return false;
      
      shelf.bookIds = shelf.bookIds.filter(id => id !== bookId);
      localStorage.setItem(CUSTOM_BOOKSHELVES_KEY, JSON.stringify(bookshelves));
      
      return true;
    } catch (error) {
      console.error('Error removing book from shelf:', error);
      return false;
    }
  }

  // Get all bookshelves that contain a specific book
  public static getBookshelvesForBook(bookId: string): CustomBookshelf[] {
    try {
      const bookshelves = this.getAllBookshelves();
      return bookshelves.filter(shelf => shelf.bookIds.includes(bookId));
    } catch (error) {
      console.error('Error getting bookshelves for book:', error);
      return [];
    }
  }
} 