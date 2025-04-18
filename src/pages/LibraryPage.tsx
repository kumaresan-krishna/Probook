import React, { useState, useEffect } from 'react';
import {
  Box, Flex, Heading, Text, IconButton, Input, InputGroup, 
  InputLeftElement, Grid, SimpleGrid, HStack, VStack, Select,
  Badge, Image, Button, Menu, MenuButton, MenuList, MenuItem,
  useColorModeValue, Drawer, DrawerOverlay, DrawerContent, 
  DrawerHeader, DrawerBody, DrawerCloseButton, useDisclosure,
  Tabs, TabList, Tab, TabPanels, TabPanel, Checkbox, RadioGroup,
  Radio, RangeSlider, RangeSliderTrack, RangeSliderFilledTrack,
  RangeSliderThumb, Divider, Tag, TagLabel, useBreakpointValue,
  Card, CardBody, Tooltip, Progress, Spinner, Alert, AlertIcon,
  Icon
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  MagnifyingGlass, Funnel, SortAscending, DotsThreeOutline,
  BookOpen, Star, Clock, CaretDown, GridFour, Rows, BookmarkSimple,
  Export, Heart, Plus, Check, ArrowsDownUp, BookmarksSimple, X
} from 'phosphor-react';
import { supabase } from '../lib/supabase'; // Correct path to supabase client
import BookCard from '../components/BookCard'; // Use default import for BookCard
// Define the type for the fetched library entry based on API spec
// Ensure nested types match the select query
interface Genre {
  name: string | null; // Allow null if name might be missing
}

interface Format {
  name: string | null; // Allow null
}

// Adjusted Book type - make fields optional based on potential nulls
interface Book {
  id: string;
  title: string | null;
  author: string | null;
  cover_image_url?: string | null;
  pages?: number | null;
  // Genre and Format are now single objects, potentially null if join fails
  genre: Genre | null; 
  format: Format | null;
  created_at: string | null;
}

interface Bookshelf {
  name: string | null; // Allow null
}

// Add Review interface definition (consistent with Library.tsx)
interface Review { 
    id: string; 
    library_entry_id: string; 
    rating: number; 
    review_text: string | null; 
    reviewed_at: string; 
}

// Adjusted LibraryEntry type (add review field)
export interface LibraryEntry {
  id: string;
  progress_pct: number | null; // Allow null
  added_at: string | null;
  updated_at: string | null;
  // Book and Bookshelf are single objects, potentially null
  book: Book | null; 
  bookshelf: Bookshelf | null;
  user_id: string | null;
  book_id: string | null;
  bookshelf_id: string | null;
  review: Review | null; // Added review field
}

const MotionFlex = motion(Flex);
const MotionBox = motion(Box);

// Animation variants
const pageVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.3 }
  }
};

// REMOVE Sample book data
/*
const booksData = [
  // ... removed hardcoded data ...
];
*/

// REMOVE: Extract all unique genres from the books - will fetch from DB later if needed
/*
const allGenres = Array.from(
  new Set(booksData.flatMap(book => book.genres))
).sort();
*/
const allGenres: string[] = []; // Placeholder, fetch genres separately if needed for filters

// REMOVE: Status options - Derive from bookshelves or use fixed list if needed
/*
const statusOptions = ["All", "Read", "Currently Reading", "Want to Read"];
*/
const statusOptions = ["All", "Currently Reading", "Want to Read", "Read", "Completed"]; // Match bookshelves?

// REMOVE: RatingStars component if not needed directly from LibraryEntry or fetch reviews separately
/*
// Generate stars for book ratings
const RatingStars = ({ rating }: { rating: number }) => {
  // ... removed component ...
};
*/

const LibraryPage: React.FC = () => {
  // State for view mode
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  // const [selectedStatus, setSelectedStatus] = useState('All'); // Use bookshelf name for filtering status
  const [selectedBookshelf, setSelectedBookshelf] = useState('All');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]); // Needs adjustment if genres are fetched
  // const [yearRange, setYearRange] = useState([1900, new Date().getFullYear()]); // Year filtering not directly supported by entry data
  // const [showFavoritesOnly, setShowFavoritesOnly] = useState(false); // Favorites need a dedicated shelf/flag

  // Sorting state
  const [sortBy, setSortBy] = useState('book.title'); // Adjust sort keys
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Filter drawer state
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Data fetching state
  const [libraryEntries, setLibraryEntries] = useState<LibraryEntry[]>([]);
  const [allEntries, setAllEntries] = useState<LibraryEntry[]>([]); // Store unfiltered entries
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userShelves, setUserShelves] = useState<{ id: string; name: string }[]>([]); // State for user's bookshelves

  // --- UI Rendering Variables (Moved Hooks Here) ---
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const sidebarBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const inputBg = useColorModeValue('white', 'gray.700'); // For inputs/selects
  const filterButtonBg = useColorModeValue('white', 'gray.700');
  const toggleBg = useColorModeValue('gray.100', 'gray.700'); // For view mode toggle
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Fetch user ID and bookshelves on mount
  useEffect(() => {
    const fetchUserAndShelves = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          // Fetch bookshelves for the logged-in user
          const { data: shelves, error: shelvesError } = await supabase
            .from('bookshelves')
            .select('id, name')
            .eq('user_id', user.id)
            .order('name');

          if (shelvesError) {
            console.error('Error fetching bookshelves:', shelvesError);
            setError('Could not fetch your bookshelves.');
          } else if (shelves) {
            setUserShelves(shelves);
          }
        } else {
          setError("User not logged in.");
          setLoading(false);
        }
      } catch (err) {
        console.error('Error getting user:', err);
        setError("Failed to get user session.");
        setLoading(false);
      }
    };
    fetchUserAndShelves();
  }, []);


  // Fetch library entries when user ID is available
  useEffect(() => {
    if (!userId) return; // Don't fetch if no user ID

    const fetchLibraryEntries = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use the select query from the API spec - ensure review is included
        const { data, error: fetchError } = await supabase
          .from('library_entries')
          .select(`
            id, 
            progress_pct, 
            added_at, 
            updated_at, 
            user_id,
            book_id,
            bookshelf_id,
            book:books (
              id, title, author, cover_image_url, pages, created_at,
              genre:genres (name), 
              format:formats (name)
            ), 
            bookshelf:bookshelves (name),
            review:reviews (*)
          `)
          .eq('user_id', userId)
          .order('added_at', { ascending: false }); 

        if (fetchError) {
          throw fetchError;
        }

        if (data) {
          console.log("Fetched Library Entries (LibraryPage):", data);
          
          // Process data to handle review array (consistent with Library.tsx)
          const processedData = (data || []).map(entry => ({
              ...entry,
              review: Array.isArray(entry.review) ? (entry.review[0] || null) : (entry.review || null)
          }));
          console.log("Processed Library Entries (LibraryPage):", processedData);

          // Use the processed data
          // FIXME: Using 'as unknown as LibraryEntry[]' due to TS struggles. Replace with generated types.
          setAllEntries(processedData as unknown as LibraryEntry[]); 
          setLibraryEntries(processedData as unknown as LibraryEntry[]); 
        } else {
          setAllEntries([]);
          setLibraryEntries([]);
        }
      } catch (err: any) {
        console.error("Error fetching library entries (LibraryPage):", err);
        setError(`Failed to fetch library entries: ${err.message || 'Unknown error'}`);
        setAllEntries([]);
        setLibraryEntries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLibraryEntries();
  }, [userId]); // Re-fetch if user ID changes

  // Update filtered books when filters or sort change
  useEffect(() => {
    let result = [...allEntries]; // Start with all fetched entries
    
    // Apply search filter (on book title or author)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(entry => 
        entry.book?.title?.toLowerCase().includes(query) || 
        entry.book?.author?.toLowerCase().includes(query)
      );
    }

    // Apply bookshelf (status) filter
    if (selectedBookshelf !== 'All') {
      result = result.filter(entry => entry.bookshelf?.name === selectedBookshelf);
    }
    
    // Apply genre filter (if genres are available and selected)
    if (selectedGenres.length > 0) {
      result = result.filter(entry => 
          selectedGenres.includes(entry.book?.genre?.name || '')
      );
    }

    // Apply sorting
    result.sort((a, b) => {
        let valA: any, valB: any;
        // Access nested properties for sorting
        if (sortBy === 'book.title') {
            valA = a.book?.title;
            valB = b.book?.title;
        } else if (sortBy === 'book.author') {
            valA = a.book?.author;
            valB = b.book?.author;
        } else if (sortBy === 'added_at') {
            valA = new Date(a.added_at || '').getTime();
            valB = new Date(b.added_at || '').getTime();
        } else if (sortBy === 'updated_at') {
            valA = new Date(a.updated_at || '').getTime();
            valB = new Date(b.updated_at || '').getTime();
        } else if (sortBy === 'progress_pct') {
            valA = a.progress_pct;
            valB = b.progress_pct;
        } else {
             // Default or fallback sort
             valA = a.book?.title;
             valB = b.book?.title;
        }

        // Handle potential null/undefined values if necessary
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    setLibraryEntries(result); // Update the displayed entries

  }, [searchQuery, selectedBookshelf, selectedGenres, sortBy, sortOrder, allEntries]); // Re-run filter/sort when dependencies change
  
  // Handlers for filter changes (keep placeholders or adapt)
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBookshelf(event.target.value);
  };

  // TODO: Adapt genre handling if fetched from DB
  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  // TODO: Adapt year range if implemented
  // const handleYearChange = (value: number[]) => {
  //   setYearRange(value);
  // };

  // TODO: Adapt favorites if implemented
  // const handleFavoritesToggle = () => {
  //   setShowFavoritesOnly(prev => !prev);
  // };

  // Reset filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedBookshelf('All');
    setSelectedGenres([]);
    // setYearRange([1900, new Date().getFullYear()]);
    // setShowFavoritesOnly(false);
    onClose(); // Close drawer if open
  };

  // Handlers for sorting
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Main content rendering
  const renderContent = () => {
    if (loading) {
      return (
        <Flex justify="center" align="center" minH="400px">
          <Spinner size="xl" thickness="4px" speed="0.65s" emptyColor="gray.200" color="brand.500" />
          <Text ml={4} fontSize="lg">Loading your library...</Text>
        </Flex>
      );
    }

    if (error) {
      return (
        <Alert status="error" variant="subtle" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" height="200px">
          <AlertIcon boxSize="40px" mr={0} />
          <Text mt={4} mb={1} fontSize="lg">Error loading library</Text>
          <Text fontSize="sm">{error}</Text>
        </Alert>
      );
    }

    if (libraryEntries.length === 0 && !loading) {
       return (
        <Flex justify="center" align="center" minH="400px" direction="column">
           <Icon as={BookmarksSimple} boxSize="50px" color="gray.400" mb={4} />
           <Text fontSize="xl" fontWeight="medium" color="gray.600">Your library is empty.</Text>
           <Text color="gray.500">Add some books to get started!</Text>
           {/* Optionally add a button/link to add books */}
         </Flex>
       );
    }

    // Use SimpleGrid for responsive layout
    return (
      <MotionBox variants={pageVariants} initial="hidden" animate="visible">
        <SimpleGrid 
          columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }} 
          spacing={6}
        >
          {libraryEntries.map((entry) => (
            <MotionBox key={entry.id} variants={itemVariants}>
              {/* Pass the entire entry to BookCard */}
              {/* Make sure BookCard is updated to accept 'entry' prop */}
              <BookCard 
                  entry={entry} 
                  // Pass necessary handlers if BookCard needs them
                  // onRemove={(id) => console.log("Remove entry:", id)} 
                  // onEdit={(id) => console.log("Edit entry:", id)}
                  // ... other handlers ...
              />
            </MotionBox>
          ))}
        </SimpleGrid>
      </MotionBox>
    );
  };


  return (
    <Flex direction={{ base: 'column', md: 'row' }} bg={bgColor} minH="100vh">
      {/* Sidebar/Filter Section */}
      <Box 
        w={{ base: 'full', md: '280px' }} 
        p={5} 
        bg={sidebarBg} 
        borderRightWidth={{ md: '1px' }} 
        borderColor={borderColor}
        position={{ base: 'relative', md: 'sticky' }}
        top={{ md: 0 }}
        h={{ md: '100vh' }}
        overflowY={{ md: 'auto' }}
        zIndex={10} // Ensure sidebar is above content on mobile
      >
        <Heading size="md" mb={6}>Bookshelves</Heading>
        {/* TODO: Replace hardcoded shelves with fetched userShelves */}
        <VStack align="stretch" spacing={2}>
          <Button 
            leftIcon={<Icon as={BookmarksSimple} />} 
            justifyContent="space-between" 
            variant={selectedBookshelf === 'All' ? 'solid' : 'ghost'}
            colorScheme={selectedBookshelf === 'All' ? 'brand' : 'gray'}
            onClick={() => setSelectedBookshelf('All')}
          >
            All Books
            <Badge ml={2} colorScheme="gray"> {/* TODO: Show total count */}
              {allEntries.length}
            </Badge>
          </Button>
          {userShelves.map(shelf => (
             <Button 
               key={shelf.id}
               // leftIcon={<Icon as={getIconForShelf(shelf.name)} />} // Add icons later
               justifyContent="space-between" 
               variant={selectedBookshelf === shelf.name ? 'solid' : 'ghost'}
               colorScheme={selectedBookshelf === shelf.name ? 'brand' : 'gray'}
               onClick={() => setSelectedBookshelf(shelf.name)}
             >
               {shelf.name}
               <Badge ml={2} colorScheme="gray">
                 {/* Calculate count for this shelf */}
                 {allEntries.filter(e => e.bookshelf?.name === shelf.name).length}
               </Badge>
             </Button>
          ))}
          {/* <Button leftIcon={<Icon as={BookOpen} />} justifyContent="space-between" variant="ghost">Currently Reading <Badge ml={2}>3</Badge></Button>
          <Button leftIcon={<Icon as={BookmarkSimple} />} justifyContent="space-between" variant="ghost">Want to Read <Badge ml={2}>24</Badge></Button>
          <Button leftIcon={<Icon as={Check} />} justifyContent="space-between" variant="ghost">Read <Badge ml={2}>40</Badge></Button>
          <Button leftIcon={<Icon as={Heart} />} justifyContent="space-between" variant="ghost">Favorites <Badge ml={2}>12</Badge></Button> */}
          <Divider my={4} />
          {/* Potentially list custom shelves here */}
          <Button leftIcon={<Icon as={Plus} />} variant="ghost" justifyContent="flex-start" colorScheme="brand">
            Create New Shelf
          </Button>
        </VStack>
      </Box>

      {/* Main Content Area */}
      <Box flex="1" p={6} overflowY="auto">
        {/* Header Section */}
        <Flex 
          justify="space-between" 
          align="center" 
          mb={6} 
          flexWrap="wrap" // Allow wrapping on smaller screens
          gap={4} // Add gap between items when wrapping
        >
          <InputGroup maxW={{ base: '100%', sm: '350px' }}>
            <InputLeftElement pointerEvents="none">
              <Icon as={MagnifyingGlass} color="gray.400" />
            </InputLeftElement>
            <Input 
              placeholder="Search books by title or author..." 
              value={searchQuery}
              onChange={handleSearchChange}
              bg={inputBg}
            />
          </InputGroup>

          <HStack spacing={3}>
             {/* Simplified Filters - Use Drawer for more */}
             <Select 
               w="auto" 
               value={sortBy} 
               onChange={handleSortChange}
               bg={inputBg}
             >
               <option value="book.title">Title</option>
               <option value="book.author">Author</option>
               <option value="added_at">Date Added</option>
               <option value="updated_at">Last Updated</option>
               <option value="progress_pct">Progress</option>
               {/* Add more sort options like rating if reviews are fetched */}
             </Select>
             <IconButton 
                aria-label="Sort order"
                icon={<Icon as={ArrowsDownUp} weight={sortOrder === 'asc' ? 'regular' : 'bold'} />}
                onClick={toggleSortOrder}
                variant="outline"
                bg={inputBg}
             />
             
             {/* View Mode Toggle */}
             <HStack spacing={0} bg={toggleBg} borderRadius="md" p="2px">
                <IconButton 
                   aria-label="Grid view"
                   icon={<GridFour />} 
                   size="sm"
                   variant={viewMode === 'grid' ? 'solid' : 'ghost'}
                   colorScheme={viewMode === 'grid' ? 'brand' : 'gray'}
                   onClick={() => setViewMode('grid')}
                   />
                <IconButton 
                   aria-label="List view"
                   icon={<Rows />} 
                   size="sm"
                   variant={viewMode === 'list' ? 'solid' : 'ghost'}
                   colorScheme={viewMode === 'list' ? 'brand' : 'gray'}
                   onClick={() => setViewMode('list')}
                   isDisabled // List view not fully implemented yet
                   />
             </HStack>
            
            {/* Advanced Filter Button (Mobile/Optional) */}
            {isMobile && (
              <IconButton 
                aria-label="Filters"
                icon={<Funnel />} 
                onClick={onOpen}
                variant="outline"
                bg={filterButtonBg}
              />
            )}
          </HStack>
        </Flex>
        
        {/* Display Content (Grid/List) */}
        {renderContent()}

      </Box>

      {/* Filter Drawer */}
      <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Filters</DrawerHeader>
          <DrawerBody>
            <VStack spacing={6} align="stretch">
              {/* Bookshelf Filter */}
              <Box>
                <Text fontWeight="semibold" mb={2}>Shelf / Status</Text>
                <Select 
                  value={selectedBookshelf} 
                  onChange={(e) => setSelectedBookshelf(e.target.value)}
                >
                  <option value="All">All</option>
                  {userShelves.map(shelf => (
                    <option key={shelf.id} value={shelf.name}>{shelf.name}</option>
                  ))}
                </Select>
              </Box>

              {/* Genre Filter - Requires fetching genres */}
              <Box>
                <Text fontWeight="semibold" mb={2}>Genre</Text>
                {/* <SimpleGrid columns={2} spacing={2}>
                  {allGenres.map(genre => (
                    <Checkbox 
                      key={genre}
                      isChecked={selectedGenres.includes(genre)}
                      onChange={() => toggleGenre(genre)}
                    >
                      {genre}
                    </Checkbox>
                  ))}
                </SimpleGrid> */}
                <Text fontSize="sm" color="gray.500">(Genre filter needs setup)</Text>
              </Box>

              {/* Add other filters like format, year range etc. if needed */}
              
              <Button colorScheme="brand" onClick={onClose}>Apply Filters</Button>
              <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

export default LibraryPage; 