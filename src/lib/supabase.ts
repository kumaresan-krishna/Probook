import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

// Check if environment variables are configured
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL and Anon Key must be defined in your environment variables!');
}

// Create a Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types that match our table structures
export type Book = {
  id: string;
  title: string;
  author: string;
  cover_url: string;
  status: 'reading' | 'completed' | 'to_read' | 'dnf';
  progress: number;
  pages?: number;
  date_added: string;
  genre: string[];
  format: 'physical' | 'ebook' | 'audiobook';
  user_id: string;
};

export type Review = {
  id: string;
  book_id: string;
  user_id: string;
  review_text: string;
  rating?: number;
  created_at: string;
  updated_at: string;
};

export type Bookshelf = {
  id: string;
  name: string;
  icon: string;
  user_id: string;
  is_default: boolean;
};

export type BookshelfBook = {
  id: string;
  bookshelf_id: string;
  book_id: string;
  user_id: string;
  added_at: string;
};

// API functions for Books
export const bookApi = {
  // Get all books for the current user
  getUserBooks: async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('User not authenticated') };
    
    return await supabase
      .from('books')
      .select('*')
      .eq('user_id', user.user.id)
      .order('date_added', { ascending: false });
  },
  
  // Add a new book
  addBook: async (book: Omit<Book, 'id' | 'user_id'>) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('User not authenticated') };
    
    return await supabase
      .from('books')
      .insert({
        ...book,
        user_id: user.user.id
      })
      .select();
  },
  
  // Update a book
  updateBook: async (id: string, updates: Partial<Book>) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('User not authenticated') };
    
    return await supabase
      .from('books')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.user.id)
      .select();
  },
  
  // Delete a book
  deleteBook: async (id: string) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('User not authenticated') };
    
    return await supabase
      .from('books')
      .delete()
      .eq('id', id)
      .eq('user_id', user.user.id);
  }
};

// API functions for Reviews
export const reviewApi = {
  // Get review for a specific book
  getBookReview: async (bookId: string) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('User not authenticated') };
    
    return await supabase
      .from('reviews')
      .select('*')
      .eq('book_id', bookId)
      .eq('user_id', user.user.id)
      .single();
  },
  
  // Add or update a review
  upsertReview: async (bookId: string, reviewText: string, rating?: number) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('User not authenticated') };
    
    // Check if review exists
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('book_id', bookId)
      .eq('user_id', user.user.id)
      .single();
    
    if (existingReview) {
      // Update existing review
      return await supabase
        .from('reviews')
        .update({
          review_text: reviewText,
          rating,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingReview.id)
        .select();
    } else {
      // Create new review
      return await supabase
        .from('reviews')
        .insert({
          book_id: bookId,
          user_id: user.user.id,
          review_text: reviewText,
          rating,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select();
    }
  }
};

// API functions for Bookshelves
export const bookshelfApi = {
  // Get all bookshelves for the current user
  getUserBookshelves: async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('User not authenticated') };
    
    return await supabase
      .from('bookshelves')
      .select('*')
      .eq('user_id', user.user.id)
      .order('name');
  },
  
  // Create a new bookshelf
  createBookshelf: async (name: string, icon: string = 'BookmarkSimple') => {
    const { data: user } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('User not authenticated') };
    
    return await supabase
      .from('bookshelves')
      .insert({
        name,
        icon,
        user_id: user.user.id,
        is_default: false
      })
      .select();
  },
  
  // Delete a bookshelf
  deleteBookshelf: async (id: string) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('User not authenticated') };
    
    // Don't allow deletion of default bookshelves
    const { data: bookshelf } = await supabase
      .from('bookshelves')
      .select('is_default')
      .eq('id', id)
      .single();
    
    if (bookshelf?.is_default) {
      return { error: new Error('Cannot delete default bookshelf') };
    }
    
    return await supabase
      .from('bookshelves')
      .delete()
      .eq('id', id)
      .eq('user_id', user.user.id);
  },
  
  // Add a book to a bookshelf
  addBookToShelf: async (bookId: string, shelfId: string) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('User not authenticated') };
    
    return await supabase
      .from('bookshelf_books')
      .insert({
        book_id: bookId,
        bookshelf_id: shelfId,
        user_id: user.user.id,
        added_at: new Date().toISOString()
      })
      .select();
  },
  
  // Remove a book from a bookshelf
  removeBookFromShelf: async (bookId: string, shelfId: string) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('User not authenticated') };
    
    return await supabase
      .from('bookshelf_books')
      .delete()
      .eq('book_id', bookId)
      .eq('bookshelf_id', shelfId)
      .eq('user_id', user.user.id);
  },
  
  // Get all books in a bookshelf
  getBookshelfBooks: async (shelfId: string) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('User not authenticated') };
    
    return await supabase
      .from('bookshelf_books')
      .select(`
        *,
        books:book_id(*)
      `)
      .eq('bookshelf_id', shelfId)
      .eq('user_id', user.user.id);
  }
};

// Initialize default bookshelves for a new user
export const initializeUserLibrary = async (userId: string) => {
  // Create default bookshelves
  const defaultShelves = [
    { name: 'All Books', icon: 'Books', is_default: true },
    { name: 'Currently Reading', icon: 'BookOpen', is_default: true },
    { name: 'Want to Read', icon: 'BookmarkSimple', is_default: true },
    { name: 'Read', icon: 'Books', is_default: true },
    { name: 'Favorites', icon: 'BookmarkSimple', is_default: true }
  ];
  
  for (const shelf of defaultShelves) {
    await supabase
      .from('bookshelves')
      .insert({
        ...shelf,
        user_id: userId
      });
  }
};

// Listen for auth state changes to initialize new users
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' && session) {
    // Check if user has bookshelves already
    supabase
      .from('bookshelves')
      .select('id')
      .eq('user_id', session.user.id)
      .then(({ data }) => {
        // If no bookshelves, initialize default ones
        if (!data || data.length === 0) {
          initializeUserLibrary(session.user.id);
        }
      });
  }
}); 