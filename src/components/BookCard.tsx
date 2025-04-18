import React from 'react';
import {
  Box, Image, Text, Flex, Badge, Icon, IconButton,
  Menu, MenuButton, MenuList, MenuItem,
  useColorModeValue, Progress, HStack
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  BookOpen, BookmarkSimple, DotsThreeVertical,
  PencilSimple, Trash, Share, Check,
  Star
} from 'phosphor-react';

// --- Copied Type Definitions from Library.tsx --- 
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
// --- End Copied Type Definitions --- 

const MotionBox = motion(Box);

export interface BookCardProps {
  entry: LibraryEntry;
  onClick?: (entry: LibraryEntry) => void;
  onMarkAsRead?: (entry: LibraryEntry) => void;
  onEdit?: (entry: LibraryEntry) => void;
  onShare?: (entry: LibraryEntry) => void;
  onRemove?: (entryId: string) => void;
}

const BookCard = ({ 
  entry, 
  onClick, 
  onMarkAsRead, 
  onEdit, 
  onShare, 
  onRemove 
}: BookCardProps) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const secondaryColor = useColorModeValue('gray.600', 'gray.400');
  const reviewTextColor = useColorModeValue('gray.500', 'gray.300');

  const getStatusDetails = (shelfName: string | null | undefined) => {
    const lowerShelfName = shelfName?.toLowerCase() || '';
    switch (lowerShelfName) {
      case 'currently reading': return { text: 'Reading', color: 'blue', statusKey: 'reading' };
      case 'read':
      case 'completed': return { text: 'Completed', color: 'green', statusKey: 'completed' };
      case 'want to read': return { text: 'Want to Read', color: 'purple', statusKey: 'to_read' };
      default: return { text: shelfName || 'Unknown Shelf', color: 'gray', statusKey: 'unknown' };
    }
  };
  
  const statusDetails = getStatusDetails(entry.bookshelf?.name);
  
  if (!entry || !entry.book) {
      return (
          <MotionBox bg={cardBg} borderRadius="xl" p={4} boxShadow="sm" borderWidth="1px" borderColor={borderColor}>
              <Text>Error: Invalid book data.</Text>
          </MotionBox>
      );
  }

  const { book, review } = entry;

  return (
    <MotionBox
      bg={cardBg}
      borderRadius="xl"
      overflow="hidden"
      boxShadow="sm"
      borderWidth="1px"
      borderColor={borderColor}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      whileHover={{ 
        y: -6, 
        boxShadow: 'lg',
        transition: { duration: 0.2 }
      }}
      onClick={() => onClick?.(entry)}
      cursor={onClick ? 'pointer' : 'default'}
      position="relative"
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <Box position="relative" height="200px">
        <Image
          src={book.cover_image_url || '/placeholder-book.png'}
          alt={book.title || 'Book cover'}
          objectFit="cover"
          width="100%"
          height="100%"
        />
        
        {entry.progress_pct !== undefined && entry.progress_pct !== null && entry.progress_pct > 0 && (
          <Box
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            bg="rgba(0,0,0,0.7)"
            py={1}
            px={2}
          >
            <Flex align="center" justify="space-between" mb={1}>
              <Text fontSize="2xs" color="white" fontWeight="medium">PROGRESS</Text>
              <Text fontSize="2xs" color="white" fontWeight="bold">{entry.progress_pct}%</Text>
            </Flex>
            <Progress 
              value={entry.progress_pct}
              size="xs" 
              colorScheme="brand"
              borderRadius="full"
              bg="whiteAlpha.300"
            />
          </Box>
        )}
        
        <Badge
          position="absolute"
          top={2}
          left={2}
          colorScheme={statusDetails.color}
          px={2}
          py="2px"
          borderRadius="full"
          fontWeight="medium"
          fontSize="xs"
          textTransform="uppercase"
        >
          {statusDetails.text}
        </Badge>
      </Box>
      
      <Flex 
        direction="column" 
        justify="space-between"
        p={4}
        flex="1"
      >
        <Box mb={3}>
          <Text
            fontWeight="bold"
            fontSize="md"
            color={textColor}
            noOfLines={1}
            mb={1}
            title={book.title || ''}
          >
            {book.title || '[No Title]'}
          </Text>
          
          <Text
            fontSize="sm"
            color={secondaryColor}
            noOfLines={1}
            mb={2}
            title={book.author || ''}
          >
            {book.author || '[No Author]'}
          </Text>
          
          {review && (
            <Box mb={2}>
               <HStack spacing={1} mb={1}>
                    {[...Array(5)].map((_, i) => (
                        <Icon 
                            key={i} 
                            as={Star} 
                            weight={i < review.rating ? "fill" : "regular"} 
                            color={i < review.rating ? "yellow.400" : "gray.300"} 
                            boxSize={4}
                        />
                    ))}
                </HStack>
                 {review.review_text && (
                     <Text 
                        fontSize="xs" 
                        color={reviewTextColor} 
                        fontStyle="italic" 
                        noOfLines={2}
                        title={review.review_text}
                     >
                        "{review.review_text}"
                    </Text>
                 )}
            </Box>
          )}
        </Box>
        
        <Flex justify="space-between" align="center">
          <Flex align="center">
            <Icon as={BookOpen} color="brand.400" mr={1} />
            <Text fontSize="xs" color={secondaryColor}>
              {book.format?.name || '[No Format]'}
            </Text>
          </Flex>
          
          <Menu placement="bottom-end">
            <MenuButton
              as={IconButton}
              icon={<DotsThreeVertical weight="bold" />}
              variant="ghost"
              size="sm"
              aria-label="Options"
              onClick={(e) => e.stopPropagation()}
            />
            <MenuList shadow="lg" minW="150px">
              {statusDetails.statusKey === 'to_read' && onMarkAsRead && (
                <MenuItem 
                  icon={<Check size={16} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead(entry);
                  }}
                >
                  Mark as Read
                </MenuItem>
              )}
              
              {onEdit && (
                  <MenuItem 
                    icon={<PencilSimple weight="bold" size={16} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(entry);
                    }}
                  >
                    {statusDetails.statusKey === 'completed' && review 
                        ? 'View/Edit Review' 
                        : (statusDetails.statusKey === 'completed' 
                            ? 'Add Review' 
                            : 'Edit Book/Progress')}
                  </MenuItem>
              )}
              
              {onShare && <MenuItem 
                icon={<Share weight="bold" size={16} />}
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(entry);
                }}
              >
                Share
              </MenuItem>}

              {onRemove && <MenuItem 
                icon={<Trash weight="bold" size={16} />} 
                color="red.500"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(entry.id);
                }}
              >
                Remove from Library
              </MenuItem>}
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </MotionBox>
  );
};

export default BookCard; 