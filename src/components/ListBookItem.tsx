import React, { FC } from 'react';
import {
  Box, Image as ChakraImage, Text, Flex, Badge, Button, Tag,
  useColorModeValue,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
  Progress,
  IconButton
} from '@chakra-ui/react';
import { 
  CheckIcon,
  EditIcon, 
  ExternalLinkIcon, 
  DeleteIcon,
  ChevronDownIcon 
} from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import { Book } from '../types';
import { Check, Share, Trash } from 'phosphor-react';

const MotionBox = motion(Box);

interface ListBookItemProps {
  book: Book;
  onClick?: (book: Book) => void;
  onAddReview?: (book: Book) => void;
  onMarkAsRead?: (book: Book) => void;
  onEdit?: (book: Book) => void;
  onShare?: (book: Book) => void;
  onRemove?: (book: Book) => void;
}

const ListBookItem: FC<ListBookItemProps> = ({ 
  book, 
  onClick, 
  onAddReview,
  onMarkAsRead,
  onEdit,
  onShare,
  onRemove
}) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const secondaryColor = useColorModeValue('gray.600', 'gray.400');
  
  // Get color for status badge
  const getBadgeColor = (status: string) => {
    switch (status) {
      case "reading":
        return "blue";
      case "completed":
        return "green";
      case "to_read":
        return "purple";
      case "dnf":
        return "red";
      default:
        return "gray";
    }
  };
  
  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "reading":
        return "Reading";
      case "completed":
        return "Completed";
      case "to_read":
        return "Want to Read";
      case "dnf":
        return "Did Not Finish";
      default:
        return status;
    }
  };
  
  return (
    <MotionBox
      bg={cardBg}
      borderRadius="xl"
      overflow="hidden"
      boxShadow="sm"
      borderWidth="1px"
      borderColor={borderColor}
      whileHover={{ 
        y: -2, 
        boxShadow: 'md'
      }}
      onClick={() => onClick?.(book)}
      cursor={onClick ? 'pointer' : 'default'}
    >
      <Flex p={3}>
        {/* Book Cover */}
        <Box 
          width="60px" 
          height="90px" 
          flexShrink={0} 
          mr={4} 
          borderRadius="md" 
          overflow="hidden"
        >
          <ChakraImage
            src={book.cover || 'https://via.placeholder.com/300x450/eef/000?text=No+Cover'}
            alt={`${book.title} cover`}
            objectFit="cover"
            width="100%"
            height="100%"
          />
        </Box>
        
        {/* Book Info */}
        <Flex flex={1} direction="column" justify="space-between">
          <Box>
            <Flex align="center" mb={1}>
              <Text fontWeight="bold" fontSize="md" color={textColor} mr={2}>
                {book.title}
              </Text>
              <Badge colorScheme={getBadgeColor(book.status)} fontSize="xs">
                {getStatusText(book.status)}
              </Badge>
            </Flex>
            
            <Text fontSize="sm" color={secondaryColor} mb={1}>
              {book.author}
            </Text>
            
            <Flex mt={1} flexWrap="wrap" gap={1}>
              {book.genre && book.genre.map((g: string) => (
                <Tag key={g} size="sm" borderRadius="full" colorScheme="gray">
                  {g}
                </Tag>
              ))}
              <Tag size="sm" borderRadius="full" colorScheme="purple">
                {book.format}
              </Tag>
            </Flex>
            
            {/* Show review preview if it exists */}
            {book.review && (
              <Box mt={2}>
                <Badge colorScheme="teal" fontSize="xs" mb={1}>
                  Has Review
                </Badge>
                <Text 
                  fontSize="xs" 
                  color="gray.500" 
                  fontStyle="italic" 
                  noOfLines={1}
                >
                  "{book.review.substring(0, 40)}{book.review.length > 40 ? '...' : ''}"
                </Text>
              </Box>
            )}
          </Box>
          
          {/* Reading Progress */}
          {book.readingProgress > 0 && book.readingProgress < 100 && (
            <Flex align="center" mt={2}>
              <Box flex={1} h="4px" bg="gray.100" borderRadius="full" mr={2}>
                <Box 
                  h="100%" 
                  w={`${book.readingProgress}%`} 
                  bgGradient="linear(to-r, brand.400, accent.400)"
                  borderRadius="full"
                />
              </Box>
              <Text fontSize="xs" fontWeight="medium" color={secondaryColor}>
                {book.readingProgress}%
              </Text>
            </Flex>
          )}
        </Flex>
        
        {/* Extra Info */}
        <Flex flexDirection="column" alignItems="flex-end" justifyContent="space-between" ml={3}>
          <Text fontSize="xs" color={secondaryColor}>
            {new Date(book.dateAdded).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}
          </Text>
          
          {/* Menu for book actions */}
          <Menu>
            <MenuButton 
              as={IconButton}
              icon={<ChevronDownIcon />}
              variant="ghost" 
              size="sm"
              aria-label="Options"
              ml={2}
            />
            <MenuList>
              {book.status === "to_read" && onMarkAsRead && (
                <MenuItem icon={<Check size={16} />} onClick={() => onMarkAsRead(book)}>
                  Mark as Read
                </MenuItem>
              )}
              {onEdit && (
                <MenuItem icon={<EditIcon />} onClick={() => onEdit(book)}>
                  Edit
                </MenuItem>
              )}
              {onShare && (
                <MenuItem icon={<ExternalLinkIcon />} onClick={() => onShare(book)}>
                  Share
                </MenuItem>
              )}
              {onRemove && (
                <MenuItem icon={<DeleteIcon />} onClick={() => onRemove(book)}>
                  Remove
                </MenuItem>
              )}
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </MotionBox>
  );
};

export default ListBookItem; 