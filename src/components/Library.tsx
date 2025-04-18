import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Box, Flex, Grid, Heading, Text, Button, Input, IconButton,
  InputGroup, InputLeftElement, Badge, Menu, MenuButton,
  MenuList, MenuItem, Select, Tab, Tabs, TabList, TabPanels,
  TabPanel, SimpleGrid, Divider, useColorModeValue, useBreakpointValue,
  Container, VStack, HStack, Tag, useDisclosure, Icon, Modal,
  ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody,
  ModalFooter, FormControl, FormLabel, Textarea,
  Spinner, Alert, AlertIcon, Image, useToast,
  RadioGroup, Radio, Progress
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlass, Funnel, CaretDown, ListBullets, SquaresFour,
  Plus, Books, BookOpen, BookmarkSimple, X, Export,
  Check, PencilSimple, Share, Trash, DotsThreeVertical, Star
} from 'phosphor-react';
import '../styles/Library.css';
import BookCard, { BookCardProps } from './BookCard';
import ShareableBookshelf from './ShareableBookshelf';
import { supabase } from '../lib/supabase';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionGrid = motion(Grid);

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

// Define necessary nested types locally
interface LibraryEntryGenre { name: string | null; }
interface LibraryEntryFormat { name: string | null; }
interface LibraryEntryBook { 
  id: string;
  title: string | null;
  author: string | null;
  cover_image_url?: string | null;
  pages?: number | null;
  genre: LibraryEntryGenre | null; 
  format: LibraryEntryFormat | null;
  created_at: string | null;
}
interface LibraryEntryBookshelf { name: string | null; }
interface Review { 
    id: string; 
    library_entry_id: string; 
    rating: number; 
    review_text: string | null; 
    reviewed_at: string; 
}

// Local LibraryEntry definition (includes review)
export interface LibraryEntry {
  id: string;
  progress_pct: number | null;
  added_at: string | null;
  updated_at: string | null;
  book: LibraryEntryBook | null;
  bookshelf: LibraryEntryBookshelf | null;
  user_id: string | null;
  book_id: string | null;
  bookshelf_id: string | null;
  review: Review | null;
}

const Library: React.FC = () => {
  // State for selected filters
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [activeGenre, setActiveGenre] = useState<string>('all');
  const [activeFormat, setActiveFormat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('added_at');
  const [isSelectingBooks, setIsSelectingBooks] = useState(false);
  const [selectedBookIds, setSelectedBookIds] = useState<string[]>([]);
  const [filteredByShelf, setFilteredByShelf] = useState<{ shelfName: string, bookIds: string[] } | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedShelf, setSelectedShelf] = useState<string>('all');
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [isNewShelfModalOpen, setIsNewShelfModalOpen] = useState(false);
  const [newShelfName, setNewShelfName] = useState("");
  const [isEditBookModalOpen, setIsEditBookModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<LibraryEntry | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewingEntry, setReviewingEntry] = useState<LibraryEntry | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState<number>(0);
  
  // Use Chakra's disclosure hook for the share modal
  const { isOpen: isShareModalOpen, onOpen: openShareModal, onClose: closeShareModal } = useDisclosure();
  
  // Responsive values
  const isMobile = useBreakpointValue({ base: true, md: false });
  const gridColumns = useBreakpointValue({ base: 2, sm: 3, md: 4, lg: 5, xl: 6 });
  
  // Theme colors
  const bgColor = useColorModeValue('neutral.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  const activeShelfBg = useColorModeValue('brand.50', 'brand.900');
  const activeShelfColor = useColorModeValue('brand.600', 'brand.200');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');

  // Data Fetching State (NEW)
  const [libraryEntries, setLibraryEntries] = useState<LibraryEntry[]>([]);
  const [allEntries, setAllEntries] = useState<LibraryEntry[]>([]);
  const [userShelves, setUserShelves] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for Add Book Modal Form (NEW)
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    coverUrl: '',
    status: 'to_read',
    format: 'physical',
    genre: 'Fiction', // Default or first option
    pages: ''
  });
  
  // Store fetched user data including metadata (for username)
  const [user, setUser] = useState<any>(null); 
  
  // Fetch user ID and bookshelves on mount
  useEffect(() => {
    const fetchUserAndShelves = async () => {
      try {
        // Fetch user data along with session
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        
        if (userData.user) {
          setUser(userData.user); // Store user object
          setUserId(userData.user.id);
          
          // Fetch bookshelves
          const { data: shelves, error: shelvesError } = await supabase
            .from('bookshelves')
            .select('id, name')
            .eq('user_id', userData.user.id)
            .order('name'); 

          if (shelvesError) throw shelvesError;
          if (shelves) {
            setUserShelves([{ id: 'all', name: 'All Books' }, ...shelves]);
          } else {
            setUserShelves([{ id: 'all', name: 'All Books' }]);
          }
        } else {
          setError("User not logged in.");
          setLoading(false);
        }
      } catch (err: any) {
        console.error('Error fetching user/shelves:', err);
        setError(`Failed to load initial data: ${err.message}`);
        setLoading(false);
      }
    };
    fetchUserAndShelves();
  }, []);

  // Fetch library entries (updated select query)
  const fetchLibraryEntries = useCallback(async () => {
    if (!userId) return; 
    setLoading(true);
    setError(null);
    try {
        const { data, error: fetchError } = await supabase
          .from('library_entries')
          // Added review:reviews(*) - assumes review table uses library_entry_id as FK
          .select(`
            id, progress_pct, added_at, updated_at, user_id, book_id, bookshelf_id,
            book:books (*, genre:genres(name), format:formats(name)),
            bookshelf:bookshelves (name),
            review:reviews (*)
          `)
          .eq('user_id', userId)
          .order('added_at', { ascending: false });

        if (fetchError) throw fetchError;

        // Process data to ensure 'review' is an object or null, not an array
        const processedData = (data || []).map(entry => ({
            ...entry,
            review: Array.isArray(entry.review) ? (entry.review[0] || null) : (entry.review || null)
        }));

        console.log("Fetched & Processed Library Entries:", processedData);

        setAllEntries(processedData as unknown as LibraryEntry[]);
        setLibraryEntries(processedData as unknown as LibraryEntry[]);
      } catch (err: any) {
          console.error("Error fetching library entries:", err);
          setError(`Failed to fetch library entries: ${err.message}`);
          setAllEntries([]);
          setLibraryEntries([]);
      } finally {
          setLoading(false);
      }
  }, [userId]);

  useEffect(() => {
    fetchLibraryEntries();
  }, [fetchLibraryEntries]);

  // Remove Book Handler (UPDATED with Supabase delete)
  const handleRemoveBook = useCallback(async (entryId: string) => {
    if (!entryId) return;

    // Optimistically remove from UI first
    const previousEntries = [...allEntries];
    setAllEntries(prev => prev.filter(entry => entry.id !== entryId));
    // Note: filteredEntries will update automatically via useMemo

    try {
      const { error } = await supabase
        .from('library_entries')
        .delete()
        .eq('id', entryId);

      if (error) throw error;

      toast({ title: "Book removed from library.", status: "success", duration: 2000, isClosable: true });
      // No need to refetch if optimistic update is sufficient

    } catch (error: any) {
      console.error("Error removing book:", error);
      toast({ title: "Error removing book", description: error.message, status: "error", duration: 5000, isClosable: true });
      // Revert UI changes on error
      setAllEntries(previousEntries);
    }
  }, [allEntries, toast]); // Include allEntries in dependency array

  // Add Review Handler (UPDATED to set initial state)
  const handleAddReview = useCallback((entryId: string) => {
    const entryToReview = allEntries.find(entry => entry.id === entryId);
    if (entryToReview) {
      setReviewingEntry(entryToReview); // Use the new state variable
      // Set initial state from existing review, if present
      setReviewText(entryToReview.review?.review_text || "");
      setReviewRating(entryToReview.review?.rating || 0); // Default to 0 if no rating
      setIsReviewModalOpen(true);
    } else {
        console.warn("Could not find entry to review:", entryId);
        toast({ title: "Error", description: "Could not find the book entry to review.", status: "error" });
    }
  }, [allEntries, toast]); // Include allEntries & toast

  // Save Review Handler (IMPLEMENTED with Supabase upsert)
  const handleSaveReview = useCallback(async (entryId: string, reviewText: string, rating: number) => {
      if (!entryId || rating === 0) {
          toast({ title: "Rating is required (1-5 stars).", status: "warning", duration: 3000, isClosable: true });
          return;
      }
      if (!reviewingEntry) {
          toast({ title: "Error", description: "No book selected for review.", status: "error" });
          return;
      }
      setIsSubmitting(true);
      try {
          const reviewPayload = {
              library_entry_id: entryId,
              rating: rating,
              review_text: reviewText.trim() || null, // Store null if text is empty
          };

          // Use upsert: update if review exists, otherwise insert.
          const { error } = await supabase
              .from('reviews')
              .upsert(reviewPayload, {
                  onConflict: 'library_entry_id',
              });

          if (error) throw error;

          toast({ title: "Review saved successfully!", status: "success", duration: 3000, isClosable: true });
          setIsReviewModalOpen(false);
          fetchLibraryEntries(); // Refetch data to show the new/updated review

      } catch (error: any) {
          console.error("Error saving review:", error);
          toast({ title: "Error saving review", description: error.message, status: "error", duration: 5000, isClosable: true });
      } finally {
          setIsSubmitting(false);
      }
  }, [toast, fetchLibraryEntries, reviewingEntry]); // Added reviewingEntry

  // Get only completed books with reviews for sharing
  const getCompletedBooksWithReviews = () => {
    return libraryEntries.filter(entry => 
      entry.bookshelf?.name?.toLowerCase() === 'completed'
    );
  };
  
  // Get selected books for sharing
  const getSelectedBooks = () => {
    if (selectedBookIds.length === 0) return [];
    return libraryEntries.filter(entry => selectedBookIds.includes(entry.id));
  };

  // Toggle book selection
  const toggleBookSelection = (entryId: string) => {
    setSelectedBookIds(prev => 
      prev.includes(entryId)
        ? prev.filter(id => id !== entryId)
        : [...prev, entryId]
    );
  };

  // Start selecting books for sharing
  const startSelectingBooks = () => {
    setIsSelectingBooks(true);
    setActiveFilter('completed');
    setSelectedBookIds([]);
  };

  // Cancel book selection
  const cancelSelectingBooks = () => {
    setIsSelectingBooks(false);
    setSelectedBookIds([]);
  };

  // Create shareable image with selected books
  const createShareableImage = () => {
    setIsSelectingBooks(false);
    openShareModal();
  };

  // Filter & Sort Logic (Update to use libraryEntries)
  const filteredEntries = useMemo(() => {
    let result = [...allEntries]; // Start with all fetched entries
    console.log(`[Filtering] Starting with ${result.length} entries.`); // Log initial count

    // Filter by search query (book title or author)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(entry => 
        entry.book?.title?.toLowerCase().includes(query) || 
        entry.book?.author?.toLowerCase().includes(query)
      );
      console.log(`[Filtering] After search ('${searchQuery}'): ${result.length} entries.`); // Log count after search
    }
    
    // Filter by selected shelf (using selectedShelf state - ensure it's shelf NAME)
    if (selectedShelf !== 'all' && selectedShelf !== 'All Books') { // Make sure we compare against the actual shelf name
        console.log(`[Filtering] Applying shelf filter: '${selectedShelf}'`); // Log shelf filter being applied
        result = result.filter(entry => entry.bookshelf?.name === selectedShelf);
        console.log(`[Filtering] After shelf filter: ${result.length} entries.`); // Log count after shelf filter
    }
    
    // Filter by genre (using activeGenre state)
    if (activeGenre !== 'all') {
      result = result.filter(entry => 
        entry.book?.genre?.name?.toLowerCase() === activeGenre.toLowerCase()
      );
       console.log(`[Filtering] After genre filter ('${activeGenre}'): ${result.length} entries.`); // Log count after genre filter
    }
    
    // Filter by format (using activeFormat state)
    if (activeFormat !== 'all') {
      result = result.filter(entry => 
          entry.book?.format?.name?.toLowerCase() === activeFormat.toLowerCase()
      );
       console.log(`[Filtering] After format filter ('${activeFormat}'): ${result.length} entries.`); // Log count after format filter
    }
    
    // Sort entries (using sortBy state)
    // TODO: Add optional chaining and null checks for safety
    result.sort((a, b) => {
        let valA: any, valB: any;
        switch (sortBy) {
            case 'title':
                valA = a.book?.title?.toLowerCase();
                valB = b.book?.title?.toLowerCase();
                break;
            case 'author':
                valA = a.book?.author?.toLowerCase();
                valB = b.book?.author?.toLowerCase();
                break;
            case 'added_at': // Already default fetch sort, but keep for explicit selection
                valA = new Date(a.added_at || 0).getTime();
                valB = new Date(b.added_at || 0).getTime();
                // Sort descending by default for date added
                return valB - valA; 
            case 'progress_pct':
                valA = a.progress_pct || 0;
                valB = b.progress_pct || 0;
                // Sort descending by default for progress
                return valB - valA;
            // Add cases for other potential sort fields (updated_at, pages, etc.)
            default:
                // Default to date added descending if sortBy is unknown
                valA = new Date(a.added_at || 0).getTime();
                valB = new Date(b.added_at || 0).getTime();
                return valB - valA; 
        }
        // Standard ascending sort for non-date/progress fields
        if (valA < valB) return -1;
        if (valA > valB) return 1;
        return 0;
    });
    
    console.log("[Filtering] Final filtered/sorted entries:", result); // Log the final array
    return result;
  }, [allEntries, searchQuery, selectedShelf, activeGenre, activeFormat, sortBy]);
  
  // Get all unique genres from fetched entries
  const allGenres = useMemo(() => {
    const genres = new Set<string>();
    allEntries.forEach(entry => {
      if (entry.book?.genre?.name) {
        genres.add(entry.book.genre.name);
      }
    });
    return Array.from(genres).sort();
  }, [allEntries]);

  // Handler for Add Book Modal input changes
  const handleNewBookChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setNewBook(prev => ({ ...prev, [id]: value }));
  };

  // Add Book Handler (UPDATED with Supabase logic)
  const handleAddBook = useCallback(async () => {
    if (!userId || !newBook.title || !newBook.author) {
      toast({ title: "Missing required fields (Title, Author).", status: "warning", duration: 3000, isClosable: true });
      return;
    }
    setIsSubmitting(true);
    try {
      // 1. Find/Create Genre ID
      let { data: genreData, error: genreError } = await supabase
        .from('genres')
        .select('id')
        .eq('name', newBook.genre)
        .single();
      if (genreError && genreError.code !== 'PGRST116') throw genreError; // PGRST116 = no rows found
      let genreId = genreData?.id;
      if (!genreId) {
        const { data: newGenreData, error: newGenreError } = await supabase
          .from('genres')
          .insert({ name: newBook.genre })
          .select('id')
          .single();
        if (newGenreError) throw newGenreError;
        genreId = newGenreData?.id;
      }
      if (!genreId) throw new Error('Could not find or create genre.');

      // 2. Find/Create Format ID
      let { data: formatData, error: formatError } = await supabase
        .from('formats')
        .select('id')
        .eq('name', newBook.format)
        .single();
      if (formatError && formatError.code !== 'PGRST116') throw formatError;
      let formatId = formatData?.id;
      if (!formatId) {
        const { data: newFormatData, error: newFormatError } = await supabase
          .from('formats')
          .insert({ name: newBook.format })
          .select('id')
          .single();
        if (newFormatError) throw newFormatError;
        formatId = newFormatData?.id;
      }
      if (!formatId) throw new Error('Could not find or create format.');

      // 3. Insert into 'books' table
      const { data: bookData, error: bookError } = await supabase
        .from('books')
        .insert({
          title: newBook.title,
          author: newBook.author,
          cover_image_url: newBook.coverUrl || null,
          pages: newBook.pages ? parseInt(newBook.pages) : null,
          genre_id: genreId,
          format_id: formatId
        })
        .select('id')
        .single();
      if (bookError) throw bookError;
      const bookId = bookData?.id;
      if (!bookId) throw new Error('Could not insert book.');

      // 4. Find Bookshelf ID based on status 
      // Ensure status string is used
      const targetShelfName = mapStatusToShelfName(newBook.status); 
      const { data: shelfData, error: shelfError } = await supabase
        .from('bookshelves')
        .select('id')
        .eq('user_id', userId)
        .eq('name', targetShelfName) 
        .single();
      if (shelfError) {
        // Handle case where default shelf might be missing for the user
        console.error(`Bookshelf '${targetShelfName}' not found for user.`, shelfError);
        throw new Error(`Could not find shelf: ${targetShelfName}. Ensure default shelves exist.`);
      }
      const bookshelfId = shelfData?.id;
      if (!bookshelfId) throw new Error(`Could not find shelf ID for: ${targetShelfName}`);

      // 5. Insert into 'library_entries' table
      const { error: entryError } = await supabase
        .from('library_entries')
        .insert({
          user_id: userId,
          book_id: bookId,
          bookshelf_id: bookshelfId,
          // Ensure status string is used for progress
          progress_pct: newBook.status === 'completed' ? 100 : (newBook.status === 'reading' ? 0 : 0) 
        });
      if (entryError) throw entryError;

      toast({ title: "Book added successfully!", status: "success", duration: 3000, isClosable: true });
      setIsAddBookModalOpen(false);
      setNewBook({ title: '', author: '', coverUrl: '', status: 'to_read', format: 'physical', genre: 'Fiction', pages: '' }); // Reset form
      fetchLibraryEntries(); // Refetch data

    } catch (error: any) {
      console.error("Error adding book:", error);
      toast({ title: "Error adding book", description: error.message, status: "error", duration: 5000, isClosable: true });
    } finally {
      setIsSubmitting(false);
    }
  }, [userId, newBook, fetchLibraryEntries, toast]);

  // Create New Shelf Handler (UPDATED with Supabase)
  const handleCreateNewShelf = useCallback(async () => {
    if (!newShelfName.trim() || !userId) return;
    setIsSubmitting(true);
    try {
        const { data, error } = await supabase
            .from('bookshelves')
            .insert({ name: newShelfName.trim(), user_id: userId })
            .select(); // Select to confirm insert
            
        if (error) throw error;
        
        toast({ title: "Shelf created!", status: "success", duration: 3000, isClosable: true });
        setNewShelfName("");
        setIsNewShelfModalOpen(false);
        // Refetch shelves
        const { data: shelves } = await supabase
            .from('bookshelves')
            .select('id, name')
            .eq('user_id', userId)
            .order('name');
        setUserShelves([{ id: 'all', name: 'All Books' }, ...(shelves || [])]);
        
    } catch (error: any) {
        console.error("Error creating shelf:", error);
        toast({ title: "Error creating shelf", description: error.message, status: "error", duration: 5000, isClosable: true });
    } finally {
        setIsSubmitting(false);
    }
  }, [newShelfName, userId, toast]);

  // Add handler to mark a book as read/unread
  const handleMarkAsRead = useCallback(async (entryId: string) => {
    console.log("Marking as read:", entryId);
  }, []);

  // Add handler to edit a book OR trigger review modal for completed books
  const handleEditBook = useCallback((entryId: string) => {
    const entryToEdit = allEntries.find(entry => entry.id === entryId);
    if (entryToEdit) {
      // Check if the book is on a 'Completed' shelf (adjust name if needed)
      const isCompleted = entryToEdit.bookshelf?.name?.toLowerCase() === 'completed';

      if (isCompleted) {
        // If completed, trigger the review flow instead of edit book
        handleAddReview(entryId);
      } else {
        // Otherwise, open the standard edit modal
        setEditingEntry(entryToEdit);
        setIsEditBookModalOpen(true);
      }
    } else {
        console.warn("Could not find entry to edit/review:", entryId);
        toast({ title: "Error", description: "Could not find the book entry.", status: "error" });
    }
  }, [allEntries, handleAddReview, toast]); // Added handleAddReview and toast to dependencies

  // Add handler to save edited book
  const handleSaveEditedBook = useCallback(async (editedEntryData: Partial<LibraryEntry>) => {
    console.log("Saving edited entry:", editedEntryData);
    setIsEditBookModalOpen(false);
    setEditingEntry(null);
  }, []);

  // Share Book Handler (Update state variable)
  const handleShareBook = useCallback((entryId: string) => {
    setIsSelectingBooks(true);
    setSelectedBookIds([entryId]);
    openShareModal();
  }, [openShareModal]);

  // Helper function to map status string to bookshelf name 
  // Ensure signature accepts string
  const mapStatusToShelfName = (status: string): string => {
      switch (status) {
          case 'reading': return 'Currently Reading';
          case 'completed': return 'Completed';
          case 'to_read': return 'Want to Read';
          case 'dnf': return 'Did Not Finish'; 
          default: return 'Unknown Shelf'; 
      }
  };

  // --- Render Loading/Error States --- 
  if (loading && allEntries.length === 0) { // Show initial loading spinner
      return (
          <Flex justify="center" align="center" minH="50vh">
              <Spinner size="xl" thickness="4px" speed="0.65s" emptyColor="gray.200" color="brand.500" />
          </Flex>
      );
  }

  if (error) {
      return (
          <Container maxW="container.md" py={10}>
              <Alert status="error" variant="subtle" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" borderRadius="md" p={6}>
                  <AlertIcon boxSize="40px" mr={0} />
                  <Heading size="md" mt={4} mb={2}>Error Loading Library</Heading>
                  <Text fontSize="sm">{error}</Text>
                  <Button mt={4} colorScheme="red" onClick={() => window.location.reload()}>Try Again</Button>
              </Alert>
          </Container>
      );
  }
  // --- End Loading/Error States --- 

  return (
    <Box 
      bg={bgColor} 
      minH="100vh" 
      py={5} 
      px={{ base: 3, md: 5 }}
    >
      <Container maxW="container.xl" px={0}>
        {/* Header */}
        <Flex 
          direction={{ base: 'column', md: 'row' }} 
          justify="space-between" 
          align={{ base: 'start', md: 'center' }}
          mb={6}
          gap={4}
        >
          <Heading as="h1" size="xl" fontWeight="bold" color={textColor}>
            My Library
          </Heading>
          
          <HStack spacing={3}>
            {isSelectingBooks ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  leftIcon={<X weight="bold" />}
                  onClick={cancelSelectingBooks}
                >
                  Cancel
                </Button>
                <Button 
                  colorScheme="brand" 
                  size="sm"
                  leftIcon={<Export weight="bold" />}
                  onClick={createShareableImage}
                  isDisabled={selectedBookIds.length === 0}
                >
                  Create Shareable Image
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  leftIcon={<Export weight="bold" />}
                  onClick={startSelectingBooks}
                >
                  Share Shelf
                </Button>
                <Button 
                  colorScheme="brand" 
                  size="sm"
                  leftIcon={<Plus weight="bold" />}
                  onClick={() => setIsAddBookModalOpen(true)}
                >
                  Add Book
                </Button>
              </>
            )}
          </HStack>
        </Flex>
        
        {/* Main Content */}
        <Flex direction={{ base: 'column', lg: 'row' }} gap={6}>
          {/* Sidebar - Shelves */}
          <Box 
            width={{ base: "full", lg: "240px" }}
            flexShrink={0}
          >
            <VStack 
              spacing={1} 
              align="stretch" 
              bg={cardBg}
              p={4}
              borderRadius="xl"
              boxShadow="sm"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Heading as="h3" size="sm" mb={2} pl={2}>Bookshelves</Heading>
              
              {userShelves.map((shelf) => (
                <Flex
                  key={shelf.id}
                  py={2}
                  px={3}
                  borderRadius="lg"
                  align="center"
                  justify="space-between"
                  cursor="pointer"
                  bg={selectedShelf === shelf.name ? activeShelfBg : 'transparent'}
                  color={selectedShelf === shelf.name ? activeShelfColor : textColor}
                  _hover={{ bg: selectedShelf !== shelf.name ? hoverBg : undefined }}
                  onClick={() => {
                    setSelectedShelf(shelf.name);
                  }}
                >
                  <Flex align="center">
                    <Icon as={shelf.name === 'All Books' ? Books : BookmarkSimple} mr={3} weight={selectedShelf === shelf.name ? "fill" : "regular"} />
                    <Text fontSize="sm" fontWeight={selectedShelf === shelf.name ? "medium" : "normal"}>
                      {shelf.name}
                    </Text>
                  </Flex>
                  <Badge borderRadius="full" px={2} colorScheme={selectedShelf === shelf.name ? "brand" : "gray"}>
                    {shelf.name === 'All Books' 
                      ? allEntries.length 
                      : allEntries.filter(e => e.bookshelf?.name === shelf.name).length}
                  </Badge>
                </Flex>
              ))}
              
              <Divider my={3} />
              
              <Button 
                leftIcon={<Plus weight="bold" />} 
                variant="ghost" 
                size="sm" 
                justifyContent="flex-start"
                py={2}
                onClick={() => setIsNewShelfModalOpen(true)}
              >
                Create New Shelf
              </Button>
            </VStack>
          </Box>
          
          {/* Main Content Area */}
          <Box flex={1}>
            {/* Filters Section */}
            <Flex 
              direction={{ base: 'column', md: 'row' }}
              mb={5}
              gap={3}
              p={4}
              bg={cardBg}
              borderRadius="xl"
              boxShadow="sm"
              borderWidth="1px"
              borderColor={borderColor}
              align={{ base: "stretch", md: "center" }}
              justify="space-between"
            >
              {/* Search */}
              <InputGroup maxW={{ base: "full", md: "300px" }}>
                <InputLeftElement pointerEvents="none">
                  <MagnifyingGlass color={mutedColor} />
                </InputLeftElement>
                <Input
                  placeholder="Search books..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  borderRadius="lg"
                />
              </InputGroup>
              
              <HStack spacing={3} justify={{ base: 'space-between', md: 'flex-end' }}>
                {/* Format Filter */}
                <Menu closeOnSelect={true}>
                  <MenuButton 
                    as={Button} 
                    rightIcon={<CaretDown />} 
                    variant="outline" 
                    size="sm"
                  >
                    {activeFormat === 'all' ? 'Format: All' : `Format: ${activeFormat}`}
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={() => setActiveFormat('all')}>All Formats</MenuItem>
                    <MenuItem onClick={() => setActiveFormat('physical')}>Physical</MenuItem>
                    <MenuItem onClick={() => setActiveFormat('ebook')}>E-Book</MenuItem>
                    <MenuItem onClick={() => setActiveFormat('audiobook')}>Audiobook</MenuItem>
                  </MenuList>
                </Menu>
                
                {/* Genre Filter */}
                <Menu closeOnSelect={true}>
                  <MenuButton 
                    as={Button} 
                    rightIcon={<CaretDown />} 
                    variant="outline" 
                    size="sm"
                  >
                    {activeGenre === 'all' ? 'Genre: All' : `Genre: ${activeGenre}`}
                  </MenuButton>
                  <MenuList maxH="300px" overflowY="auto">
                    <MenuItem onClick={() => setActiveGenre('all')}>All Genres</MenuItem>
                    {allGenres.map(genre => (
                      <MenuItem key={genre} onClick={() => setActiveGenre(genre)}>
                        {genre}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
                
                {/* Sort By */}
                <Menu closeOnSelect={true}>
                  <MenuButton 
                    as={Button} 
                    rightIcon={<CaretDown />} 
                    variant="outline" 
                    size="sm"
                  >
                    Sort By: {sortBy.replace('_', ' ').replace('pct','% ').replace('added at', 'Date Added').replace('book.title', 'Title').replace('book.author', 'Author').replace('progress pct', 'Progress')}
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={() => setSortBy('added_at')}>Date Added</MenuItem>
                    <MenuItem onClick={() => setSortBy('title')}>Title</MenuItem>
                    <MenuItem onClick={() => setSortBy('author')}>Author</MenuItem>
                    <MenuItem onClick={() => setSortBy('progress_pct')}>Progress</MenuItem>
                  </MenuList>
                </Menu>
                
                {/* View Mode */}
                <Flex borderWidth="1px" borderRadius="md" overflow="hidden">
                  <IconButton
                    aria-label="Grid view"
                    icon={<SquaresFour weight={viewMode === 'grid' ? 'fill' : 'regular'} />}
                    size="sm"
                    variant={viewMode === 'grid' ? 'solid' : 'ghost'}
                    colorScheme={viewMode === 'grid' ? 'brand' : undefined}
                    onClick={() => setViewMode('grid')}
                    borderRadius="none"
                    borderRightWidth="1px"
                  />
                  <IconButton
                    aria-label="List view"
                    icon={<ListBullets weight={viewMode === 'list' ? 'fill' : 'regular'} />}
                    size="sm"
                    variant={viewMode === 'list' ? 'solid' : 'ghost'}
                    colorScheme={viewMode === 'list' ? 'brand' : undefined}
                    onClick={() => setViewMode('list')}
                    borderRadius="none"
                  />
                </Flex>
              </HStack>
            </Flex>
            
            {/* Book Grid */}
            <Box>
              {filteredEntries.length === 0 ? (
                <Flex 
                  direction="column" 
                  align="center" 
                  justify="center" 
                  p={10} 
                  bg={cardBg}
                  borderRadius="xl"
                  boxShadow="sm"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <Text fontSize="lg" mb={4}>No books found with the current filters</Text>
                  <Text fontSize="sm" color={mutedColor} mb={4}>Try adjusting your search or filters.</Text>
                  <Button colorScheme="brand" onClick={() => {
                    setSelectedShelf('all');
                    setActiveGenre('all');
                    setActiveFormat('all');
                    setSearchQuery('');
                    setSortBy('added_at');
                  }}>
                    Clear Filters
                  </Button>
                </Flex>
              ) : (
                <MotionGrid
                  templateColumns={viewMode === 'grid' ? 
                    `repeat(${gridColumns}, 1fr)` : 
                    "1fr"
                  }
                  gap={4}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredEntries.map(entry => {
                    return (
                        <MotionBox key={entry.id} variants={itemVariants}>
                          {viewMode === 'grid' ? (
                            <BookCard
                              entry={entry}
                              onClick={isSelectingBooks ? () => toggleBookSelection(entry.id) : undefined}
                              onMarkAsRead={() => handleMarkAsRead(entry.id)}
                              onEdit={() => handleEditBook(entry.id)}
                              onShare={() => handleShareBook(entry.id)}
                              onRemove={() => handleRemoveBook(entry.id)}
                            />
                          ) : (
                            <ListBookItem 
                              book={entry}
                              onClick={isSelectingBooks ? () => toggleBookSelection(entry.id) : undefined}
                              onAddReview={() => handleAddReview(entry.id)}
                              onMarkAsRead={() => handleMarkAsRead(entry.id)}
                              onEdit={() => handleEditBook(entry.id)}
                              onShare={() => handleShareBook(entry.id)}
                              onRemove={() => handleRemoveBook(entry.id)}
                            />
                          )}
                        </MotionBox>
                    );
                  })}
                </MotionGrid>
              )}
            </Box>
          </Box>
        </Flex>
      </Container>
      
      {/* Add Book Modal (UPDATED to use state) */} 
      <Modal isOpen={isAddBookModalOpen} onClose={() => !isSubmitting && setIsAddBookModalOpen(false)} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Book</ModalHeader>
          <ModalCloseButton isDisabled={isSubmitting} />
          
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired isInvalid={!newBook.title && isSubmitting}> {/* Add basic validation indication */}
                <FormLabel>Book Title</FormLabel>
                <Input placeholder="Enter book title" id="title" value={newBook.title} onChange={handleNewBookChange} isDisabled={isSubmitting}/>
              </FormControl>
              
              <FormControl isRequired isInvalid={!newBook.author && isSubmitting}>
                <FormLabel>Author</FormLabel>
                <Input placeholder="Enter author name" id="author" value={newBook.author} onChange={handleNewBookChange} isDisabled={isSubmitting}/>
              </FormControl>
              
              <FormControl>
                <FormLabel>Cover Image URL</FormLabel>
                <Input placeholder="Enter cover image URL" id="coverUrl" value={newBook.coverUrl} onChange={handleNewBookChange} isDisabled={isSubmitting}/>
              </FormControl>
              
              <HStack spacing={4}>
                <FormControl>
                  <FormLabel>Initial Shelf (Status)</FormLabel>
                  <Select id="status" value={newBook.status} onChange={handleNewBookChange} isDisabled={isSubmitting}>
                    <option value="to_read">Want to Read</option>
                    <option value="reading">Currently Reading</option>
                    <option value="completed">Completed</option>
                    {/* <option value="dnf">Did Not Finish</option> */}
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Format</FormLabel>
                  {/* TODO: Populate format options from DB? */} 
                  <Select id="format" value={newBook.format} onChange={handleNewBookChange} isDisabled={isSubmitting}>
                    <option value="Physical">Physical</option>
                    <option value="E-Book">E-Book</option>
                    <option value="Audiobook">Audiobook</option>
                  </Select>
                </FormControl>
              </HStack>
              
              <HStack spacing={4}>
                <FormControl>
                  <FormLabel>Genre</FormLabel>
                   {/* TODO: Populate genre options from DB? */} 
                  <Select id="genre" value={newBook.genre} onChange={handleNewBookChange} isDisabled={isSubmitting}>
                    <option value="Fiction">Fiction</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                    <option value="Science Fiction">Science Fiction</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Mystery">Mystery</option>
                    <option value="Biography">Biography</option>
                    <option value="History">History</option>
                    <option value="Self-Help">Self-Help</option>
                     {/* Add more genres or fetch dynamically */} 
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Pages</FormLabel>
                  <Input type="number" placeholder="Number of pages" id="pages" value={newBook.pages} onChange={handleNewBookChange} isDisabled={isSubmitting}/>
                </FormControl>
              </HStack>
            </VStack>
          </ModalBody>
          
          <ModalFooter>
            <Button onClick={() => setIsAddBookModalOpen(false)} mr={3} isDisabled={isSubmitting}>Cancel</Button>
            <Button 
              colorScheme="brand" 
              onClick={handleAddBook} // Use the updated handler
              isLoading={isSubmitting} // Show loading state
              isDisabled={isSubmitting}
            >
              Add Book
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Create New Shelf Modal (UPDATED) */} 
      <Modal isOpen={isNewShelfModalOpen} onClose={() => !isSubmitting && setIsNewShelfModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Bookshelf</ModalHeader>
          <ModalCloseButton isDisabled={isSubmitting} />
          
          <ModalBody pb={6}>
            <FormControl isInvalid={!newShelfName.trim() && isSubmitting}>
              <FormLabel>Shelf Name</FormLabel>
              <Input 
                placeholder="Enter shelf name" 
                value={newShelfName} 
                onChange={e => setNewShelfName(e.target.value)}
                isDisabled={isSubmitting}
              />
            </FormControl>
          </ModalBody>
          
          <ModalFooter>
            <Button onClick={() => setIsNewShelfModalOpen(false)} mr={3} isDisabled={isSubmitting}>Cancel</Button>
            <Button 
              colorScheme="brand" 
              onClick={handleCreateNewShelf} // Use updated handler
              isDisabled={!newShelfName.trim() || isSubmitting}
              isLoading={isSubmitting}
            >
              Create Shelf
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Book Modal */}
      {editingEntry && (
        <Modal isOpen={isEditBookModalOpen} onClose={() => setIsEditBookModalOpen(false)} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Book</ModalHeader>
            <ModalCloseButton />
            
            <ModalBody pb={6}>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                  <FormLabel>Book Title</FormLabel>
                  <Input 
                    placeholder="Enter book title" 
                    id="edit-title" 
                    defaultValue={editingEntry.book?.title || ''}
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Author</FormLabel>
                  <Input 
                    placeholder="Enter author name" 
                    id="edit-author" 
                    defaultValue={editingEntry.book?.author || ''}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Cover Image URL</FormLabel>
                  <Input 
                    placeholder="Enter cover image URL" 
                    id="edit-coverUrl" 
                    defaultValue={editingEntry.book?.cover_image_url || ''}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Bookshelf</FormLabel>
                  <Select id="edit-bookshelf" defaultValue={editingEntry.bookshelf_id || ''}>
                      {userShelves.filter(s => s.id !== 'all').map(shelf => (
                          <option key={shelf.id} value={shelf.id}>{shelf.name}</option>
                      ))}
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Format</FormLabel>
                  <Select id="edit-format" defaultValue={editingEntry.book?.format?.name || ''}>
                     <option value="Physical">Physical</option>
                     <option value="E-Book">E-Book</option>
                     <option value="Audiobook">Audiobook</option>
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Progress (%)</FormLabel>
                  <Input 
                    type="number" 
                    id="edit-progress" 
                    defaultValue={editingEntry.progress_pct || 0}
                    min={0}
                    max={100}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Pages</FormLabel>
                  <Input 
                    type="number" 
                    id="edit-pages" 
                    defaultValue={editingEntry.book?.pages || 0}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Genre</FormLabel>
                  <Select 
                    id="edit-genre" 
                    defaultValue={editingEntry.book?.genre?.name || ''}
                  >
                    {allGenres.map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </Select>
                </FormControl>
              </VStack>
            </ModalBody>
            
            <ModalFooter>
              <Button onClick={() => setIsEditBookModalOpen(false)} mr={3}>Cancel</Button>
              <Button 
                colorScheme="brand" 
                onClick={() => {
                  const updatedProgress = parseInt((document.getElementById('edit-progress') as HTMLInputElement)?.value || '0');
                  const updatedBookshelfId = (document.getElementById('edit-bookshelf') as HTMLSelectElement)?.value;
                  handleSaveEditedBook({ id: editingEntry.id, progress_pct: updatedProgress, bookshelf_id: updatedBookshelfId });
                }}
              >
                Save Changes
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {/* Review Modal (UPDATED with rating and save logic) */} 
      {reviewingEntry && (
        <Modal isOpen={isReviewModalOpen} onClose={() => !isSubmitting && setIsReviewModalOpen(false)}>
          <ModalOverlay />
          <ModalContent>
           <ModalHeader>
             {reviewingEntry.review ? 'Edit Review' : 'Add Review'} for {reviewingEntry.book?.title}
           </ModalHeader>
           <ModalCloseButton isDisabled={isSubmitting} />

           <ModalBody pb={6}>
              {/* Display existing review if editing */} 
              {reviewingEntry.review && (
                <Box mb={4} p={3} bg={useColorModeValue("gray.50", "gray.700")} borderRadius="md" borderWidth="1px">
                  <Text fontSize="sm" fontWeight="medium" color={mutedColor}>Current Review:</Text>
                  {reviewingEntry.review.rating && (
                       <HStack spacing={1} my={1}>
                          {[...Array(5)].map((_, i) => (
                            <Icon key={i} as={Star} weight={i < reviewingEntry.review!.rating ? "fill" : "regular"} color={i < reviewingEntry.review!.rating ? "yellow.400" : "gray.300"} />
                          ))}
                      </HStack>
                  )}
                  <Text mt={1} fontSize="sm">{reviewingEntry.review.review_text}</Text>
                </Box>
              )}

               {/* Star Rating Input */} 
               <FormControl mb={4} isRequired>
                  <FormLabel>Rating</FormLabel>
                  <RadioGroup onChange={(val) => setReviewRating(parseInt(val))} value={reviewRating.toString()} isDisabled={isSubmitting}>
                    <HStack spacing={4}>
                      {[1, 2, 3, 4, 5].map(ratingValue => (
                        <Radio key={ratingValue} value={ratingValue.toString()}>
                           <HStack spacing={1}>
                                {[...Array(ratingValue)].map((_, i) => (
                                    <Icon key={i} as={Star} weight="fill" color="yellow.400" boxSize={4}/>
                                ))}
                            </HStack>
                        </Radio>
                      ))}
                    </HStack>
                  </RadioGroup>
               </FormControl>

               {/* Review Text Input */} 
               <FormControl>
                 <FormLabel>{reviewingEntry.review ? 'Update Your Review Text' : 'Your Review Text (Optional)'}</FormLabel>
                 <Textarea
                   placeholder="Write your thoughts about this book..."
                   value={reviewText}
                   onChange={e => setReviewText(e.target.value)}
                   minHeight="150px" // Reduced height slightly
                   isDisabled={isSubmitting}
                 />
               </FormControl>
             </ModalBody>

             <ModalFooter>
               <Button onClick={() => setIsReviewModalOpen(false)} mr={3} isDisabled={isSubmitting}>Cancel</Button>
               <Button 
                 colorScheme="brand"
                 onClick={() => {
                   if (reviewingEntry) {
                     handleSaveReview(reviewingEntry.id, reviewText, reviewRating);
                   }
                 }}
                 isLoading={isSubmitting}
                 isDisabled={reviewRating === 0 || isSubmitting}
               >
                 {reviewingEntry.review ? 'Update Review' : 'Save Review'}
               </Button>
             </ModalFooter>
           </ModalContent>
         </Modal>
       )}

      {/* Share Modal (Update username) */} 
      <Modal isOpen={isShareModalOpen} onClose={closeShareModal} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Share Bookshelf</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ShareableBookshelf 
              entries={getSelectedBooks()} 
              username={user?.user_metadata?.username || user?.email || 'User'} // Pass username if available
              onClose={closeShareModal} 
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

interface ListBookItemProps {
  book: LibraryEntry;
  onClick?: () => void;
  onAddReview?: () => void;
  onMarkAsRead?: () => void;
  onEdit?: () => void;
  onShare?: () => void;
  onRemove?: () => void;
}

const ListBookItem: React.FC<ListBookItemProps> = ({
  book: entry, // Rename prop to entry for clarity
  onClick,
  onAddReview, // This will be used by the dedicated review button
  onMarkAsRead,
  onEdit, // This should only handle editing book/progress now
  onShare,
  onRemove
}) => {
  // Check for valid entry FIRST
  if (!entry?.book) {
      // Return placeholder BEFORE hooks are called
      return <Box p={3}>Invalid book data.</Box>;
  }

  // Hooks are called only if the component proceeds to render fully
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const secondaryColor = useColorModeValue('gray.600', 'gray.400');
  const reviewTextColor = useColorModeValue('gray.500', 'gray.300');

  // Extract data using optional chaining (can be simplified now)
  const title = entry.book.title || '[No Title]'; // Removed optional chaining on entry.book
  const author = entry.book.author || '[No Author]'; // Removed optional chaining on entry.book
  const coverUrl = entry.book.cover_image_url || '/placeholder-book.png'; // Removed optional chaining on entry.book
  const shelfName = entry.bookshelf?.name || 'Unknown';
  const isCompleted = shelfName.toLowerCase() === 'completed';
  const progress = entry.progress_pct;
  const genres = entry.book.genre?.name ? [entry.book.genre.name] : []; // Removed optional chaining on entry.book
  const format = entry.book.format?.name || 'Unknown'; // Removed optional chaining on entry.book
  const dateAdded = entry.added_at;
  const pages = entry.book.pages; // Removed optional chaining on entry.book
  const review = entry.review; // Get review object

  // Map shelf name to status text/color for badge
  const getStatusDetails = (shelf: string) => {
      switch (shelf.toLowerCase()) {
        case 'currently reading': return { text: 'Reading', color: 'blue' };
        case 'completed': return { text: 'Completed', color: 'green' };
        case 'want to read': return { text: 'Want to Read', color: 'purple' };
        case 'did not finish': return { text: 'DNF', color: 'red' };
        default: return { text: shelf, color: 'gray' };
      }
  };
  const statusDetails = getStatusDetails(shelfName);

  return (
    <MotionBox
      bg={cardBg}
      borderRadius="xl"
      overflow="hidden"
      boxShadow="sm"
      borderWidth="1px"
      borderColor={borderColor}
      whileHover={{ y: -2, boxShadow: 'md' }}
      onClick={onClick}
      cursor={onClick ? 'pointer' : 'default'}
    >
      <Flex p={3} gap={4}>
        {/* Book Cover */}
        <Box width="60px" height="90px" flexShrink={0} borderRadius="md" overflow="hidden">
          <Image 
            src={coverUrl}
            alt={`${title} cover`}
            objectFit="cover"
            width="100%"
            height="100%"
          />
        </Box>

        {/* Book Info */}
        <Flex flex={1} direction="column" justify="space-between" minW={0}> {/* Added minW={0} */}
          <Box>
            <Flex align="center" mb={1} justify="space-between">
                <Text fontWeight="bold" fontSize="md" color={textColor} mr={2} noOfLines={1} title={title}>
                    {title}
                </Text>
                <Badge colorScheme={statusDetails.color} fontSize="xs" whiteSpace="nowrap">
                    {statusDetails.text}
                </Badge>
            </Flex>

            <Text fontSize="sm" color={secondaryColor} mb={1} noOfLines={1} title={author}>
              {author}
            </Text>

            <Flex mt={1} flexWrap="wrap" gap={1}>
              {genres.map((g: string) => (
                <Tag key={g} size="sm" borderRadius="full" colorScheme="gray">
                  {g}
                </Tag>
              ))}
              <Tag size="sm" borderRadius="full" colorScheme="purple">
                {format}
              </Tag>
            </Flex>

            {/* Display Review if exists */} 
            {review && (
              <Box mt={2} pl={1}>
                <HStack spacing={1} mb={1}>
                    {[...Array(5)].map((_, i) => (
                        <Icon key={i} as={Star} weight={i < review.rating ? "fill" : "regular"} color={i < review.rating ? "yellow.400" : "gray.300"} boxSize={3}/>
                    ))}
                </HStack>
                {review.review_text && (
                    <Text fontSize="xs" color={reviewTextColor} fontStyle="italic" noOfLines={1} title={review.review_text}>
                      "{review.review_text}"
                    </Text>
                )}
              </Box>
            )}
          </Box>

          {/* Reading Progress */}
          {progress != null && progress > 0 && progress < 100 && (
            <Flex align="center" mt={2}>
              <Progress value={progress} size="xs" colorScheme="brand" flex={1} mr={2} borderRadius="full"/>
              <Text fontSize="xs" fontWeight="medium" color={secondaryColor}>
                {progress}%
              </Text>
            </Flex>
          )}
        </Flex>

        {/* Extra Info & Actions */}
        <Flex flexDirection="column" alignItems="flex-end" justifyContent="space-between" ml={3} flexShrink={0}>
           <VStack align="flex-end" spacing={1}>
                <Text fontSize="xs" color={secondaryColor} whiteSpace="nowrap">
                    Added: {dateAdded ? new Date(dateAdded).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                </Text>
                {pages != null && (
                    <Text fontSize="xs" color={secondaryColor}>
                    {pages} pages
                    </Text>
                )}
            </VStack>

          <HStack spacing={1} mt={2}>
            {/* Add/View Review button - ONLY for completed books */}
            {isCompleted && onAddReview && (
                <Button 
                    size="xs" 
                    variant="outline" 
                    colorScheme="teal" 
                    leftIcon={<Icon as={Star} weight="fill" />} 
                    onClick={(e) => {
                        e.stopPropagation();
                        onAddReview();
                    }}
                >
                    {review ? 'View Review' : 'Add Review'}
                </Button>
            )}
            {/* Action Menu */} 
            <Menu placement="bottom-end">
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<DotsThreeVertical size={16} />}
                variant="ghost"
                size="sm"
                onClick={(e) => e.stopPropagation()}
              />
              <MenuList onClick={(e) => e.stopPropagation()}>
                {/* Mark as Read (conditional logic might need adjustment) */} 
                {onMarkAsRead && (
                  <MenuItem icon={<Check size={16} />} onClick={onMarkAsRead}>
                    Mark as {isCompleted ? 'Unread' : 'Read'}
                  </MenuItem>
                )}
                {/* Edit Book (Only for non-completed or if separate edit needed) */} 
                {onEdit && (
                  <MenuItem icon={<PencilSimple size={16} />} onClick={onEdit}>
                    Edit Book/Progress
                  </MenuItem>
                )}
                 {/* Review option removed here - handled by dedicated button */} 
                {onShare && (
                  <MenuItem icon={<Share size={16} />} onClick={onShare}>
                    Share Book
                  </MenuItem>
                )}
                {onRemove && (
                  <MenuItem icon={<Trash size={16} />} onClick={onRemove} color="red.500">
                    Remove from Library
                  </MenuItem>
                )}
              </MenuList>
            </Menu>
           </HStack>
        </Flex>
      </Flex>
    </MotionBox>
  );
};

export default Library;