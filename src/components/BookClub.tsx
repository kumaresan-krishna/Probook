import React, { useState } from 'react';
import {
  Box, Flex, Grid, Heading, Text, Button, Input, IconButton,
  InputGroup, InputLeftElement, Badge, Menu, MenuButton,
  MenuList, MenuItem, Tab, Tabs, TabList, TabPanels,
  TabPanel, SimpleGrid, Divider, useColorModeValue, useBreakpointValue,
  Container, VStack, HStack, Tag, Avatar, AvatarGroup, Image,
  useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel,
  Select, Textarea, Switch, Card, CardBody, CardHeader, CardFooter,
  Tooltip, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent,
  DrawerCloseButton, Stack, useToast, Spinner, LinkBox, LinkOverlay,
  StackDivider, Progress, Icon
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { 
  FiSearch, FiPlus, FiUsers, FiBook, FiBookmark, FiChevronDown, 
  FiMessageCircle, FiShare2, FiMic, FiGlobe, FiCalendar, FiFilter, 
  FiHeart, FiStar, FiAward, FiArrowLeft, FiSettings, FiCheck,
  FiThumbsUp, FiMail, FiInfo, FiClock 
} from 'react-icons/fi';
import { IconType } from 'react-icons';

// Create a custom IconWrapper component to fix TypeScript issues
const IconWrapper = ({
  icon,
  ...props
}: {
  icon: IconType;
  [key: string]: any;
}) => {
  // Use type assertion to make TypeScript happy
  const IconComponent = icon as React.ElementType;
  return <IconComponent {...props} />;
};

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

// Type Definitions
interface Club {
  id: number;
  name: string;
  description: string;
  coverImage: string;
  genres: string[];
  memberCount: number;
  activity: 'Very High' | 'High' | 'Medium' | 'Low';
  isMember?: boolean;
  isModerator?: boolean;
  isFavorite?: boolean;
  lastActive?: string;
  currentlyReading?: {
    title: string;
    author: string;
    coverImage: string;
  };
  nextMeeting?: string;
  unreadMessages?: number;
}

// Sample data
const sampleClubs: Club[] = [
  {
    id: 1,
    name: "Fantasy Readers Circle",
    description: "A vibrant community for fans of fantasy literature exploring worlds of magic and adventure.",
    coverImage: "https://images.unsplash.com/photo-1518872380-13cd9f638c2b?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60",
    genres: ["Fantasy", "Adventure"],
    memberCount: 342,
    activity: "Very High",
    isMember: true,
    isModerator: false,
    isFavorite: true,
    lastActive: "2 minutes ago",
    currentlyReading: {
      title: "The Way of Kings",
      author: "Brandon Sanderson",
      coverImage: "https://images-na.ssl-images-amazon.com/images/I/91KzZWpgmyL.jpg"
    },
    nextMeeting: "Tomorrow, 7:00 PM",
    unreadMessages: 5
  },
  {
    id: 2,
    name: "Science Fiction Explorers",
    description: "Venture through time, space, and possibility with our sci-fi focused book club.",
    coverImage: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60",
    genres: ["Science Fiction", "Speculative Fiction"],
    memberCount: 289,
    activity: "High",
    isMember: true,
    isModerator: true,
    isFavorite: false,
    lastActive: "1 hour ago",
    currentlyReading: {
      title: "Project Hail Mary",
      author: "Andy Weir",
      coverImage: "https://images-na.ssl-images-amazon.com/images/I/91vS2L5YfEL.jpg"
    },
    nextMeeting: "Friday, 8:00 PM",
    unreadMessages: 0
  },
  {
    id: 3,
    name: "Mystery Solvers Society",
    description: "For fans of whodunits, detective stories, and all things mysterious.",
    coverImage: "https://images.unsplash.com/photo-1576872381149-7847515ce5d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60",
    genres: ["Mystery", "Thriller", "Crime"],
    memberCount: 187,
    activity: "Medium",
    isMember: false,
    isFavorite: false,
    lastActive: "3 days ago",
    currentlyReading: {
      title: "The Thursday Murder Club",
      author: "Richard Osman",
      coverImage: "https://images-na.ssl-images-amazon.com/images/I/81X9Y1ITCFL.jpg"
    },
    nextMeeting: "Next Thursday, 6:30 PM"
  },
  {
    id: 4,
    name: "Literary Classics",
    description: "Exploring timeless works that have shaped literature through the ages.",
    coverImage: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60",
    genres: ["Classics", "Literary Fiction"],
    memberCount: 156,
    activity: "Medium",
    isMember: false,
    isFavorite: false,
    lastActive: "2 days ago"
  },
  {
    id: 5,
    name: "Romance Readers",
    description: "Celebrating stories of love, passion, and heartfelt connections across all subgenres.",
    coverImage: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60",
    genres: ["Romance", "Contemporary", "Historical"],
    memberCount: 256,
    activity: "High",
    isMember: false,
    isFavorite: false,
    lastActive: "5 hours ago"
  },
  {
    id: 6,
    name: "History Enthusiasts",
    description: "Delving into non-fiction and historical fiction that brings the past to life.",
    coverImage: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60",
    genres: ["History", "Non-Fiction", "Historical Fiction"],
    memberCount: 128,
    activity: "Medium",
    isMember: false,
    isFavorite: false,
    lastActive: "1 day ago"
  }
];

// Statistics data
const clubStats: Array<{ label: string; value: number; icon: IconType }> = [
  { label: "Clubs Joined", value: 4, icon: FiUsers },
  { label: "Books Discussed", value: 16, icon: FiBook },
  { label: "Reading Challenges", value: 3, icon: FiAward }
];

const BookClub: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState<'myClubs' | 'discover' | 'invitations'>('myClubs');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recommended');
  
  // Modal for creating a club
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Colors
  const bg = useColorModeValue('white', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const accentColor = useColorModeValue('blue.500', 'blue.300');
  
  // Responsive styles
  const gridColumns = useBreakpointValue({ base: 1, md: 2, lg: 3 });
  const containerPadding = useBreakpointValue({ base: 4, md: 6 });
  
  // Filter clubs based on search and genre
  const filteredClubs = sampleClubs.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          club.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || club.genres.includes(selectedGenre);
    
    if (activeTab === 'myClubs') {
      return matchesSearch && matchesGenre && club.isMember;
    } else {
      return matchesSearch && matchesGenre;
    }
  });
  
  // All available genres in the clubs
  const allGenres = Array.from(new Set(sampleClubs.flatMap(club => club.genres))).sort();
  
  // Render a club card
  const renderClubCard = (club: Club) => (
    <MotionBox
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      key={club.id}
    >
      <Card 
        overflow="hidden" 
        variant="outline"
        borderColor={borderColor}
        bg={cardBg}
        h="100%"
      >
        <Box position="relative">
          <Image
            src={club.coverImage}
            alt={club.name}
            objectFit="cover"
            height="140px"
            width="100%"
          />
          <HStack 
            position="absolute" 
            top="2" 
            right="2" 
            spacing="1"
          >
            {club.isMember && (
              <Badge colorScheme="green" variant="solid" fontSize="xs" px="2" py="1">
                Member
              </Badge>
            )}
            {club.isModerator && (
              <Badge colorScheme="purple" variant="solid" fontSize="xs" px="2" py="1">
                Moderator
              </Badge>
            )}
            <IconButton
              aria-label={club.isFavorite ? "Remove from favorites" : "Add to favorites"}
              icon={<IconWrapper icon={FiHeart} color={club.isFavorite ? "red" : undefined} fill={club.isFavorite ? "red" : "none"} />}
              size="sm"
              variant="ghost"
              colorScheme={club.isFavorite ? "red" : "gray"}
              onClick={(e) => {
                e.stopPropagation();
                // Toggle favorite logic would go here
              }}
            />
          </HStack>
        </Box>
        
        <CardBody py="3">
          <VStack align="start" spacing="2">
            <Heading size="md" noOfLines={1}>{club.name}</Heading>
            
            <HStack wrap="wrap" spacing="1">
              {club.genres.map(genre => (
                <Tag key={genre} size="sm" colorScheme="blue" variant="subtle">
                  {genre}
                </Tag>
              ))}
            </HStack>
            
            <Text fontSize="sm" color="gray.500" noOfLines={2}>
              {club.description}
            </Text>
            
            <HStack spacing="4" w="100%" pt="2">
              <Flex align="center">
                <IconWrapper icon={FiUsers} size="14px" />
                <Text ml="1" fontSize="sm">{club.memberCount}</Text>
              </Flex>
              <Badge
                colorScheme={
                  club.activity === 'Very High' ? 'green' : 
                  club.activity === 'High' ? 'teal' : 
                  club.activity === 'Medium' ? 'blue' : 'gray'
                }
                variant="subtle"
                fontSize="xs"
                px="2"
              >
                {club.activity}
              </Badge>
              <Text fontSize="xs" color="gray.500" ml="auto">
                Active {club.lastActive}
              </Text>
            </HStack>
            
            {club.currentlyReading && (
              <Box 
                mt="2" 
                p="3" 
                w="100%" 
                borderRadius="md" 
                bg={useColorModeValue('gray.50', 'gray.700')}
              >
                <HStack spacing="3">
                  <Image 
                    src={club.currentlyReading.coverImage} 
                    alt={club.currentlyReading.title}
                    boxSize="40px"
                    objectFit="cover"
                    borderRadius="sm"
                  />
                  <VStack spacing="0" align="start" flex="1">
                    <Text fontSize="xs" color="gray.500">Currently Reading</Text>
                    <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                      {club.currentlyReading.title}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      by {club.currentlyReading.author}
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            )}
            
            {club.nextMeeting && (
              <HStack mt="1" fontSize="xs" color="gray.500">
                <IconWrapper icon={FiCalendar} size="12px" />
                <Text>Next meeting: {club.nextMeeting}</Text>
              </HStack>
            )}
          </VStack>
        </CardBody>
        
        <CardFooter 
          pt="0" 
          pb="3" 
          px="4" 
          justify="space-between"
        >
          {club.unreadMessages ? (
            <Badge colorScheme="red" variant="subtle" borderRadius="full">
              {club.unreadMessages} new
            </Badge>
          ) : (
            <Box />
          )}
          
          <HStack spacing="2">
            <IconButton
              aria-label="Chat"
              icon={<IconWrapper icon={FiMessageCircle} />}
              size="sm"
              variant="ghost"
            />
            <IconButton
              aria-label="Share"
              icon={<IconWrapper icon={FiShare2} />}
              size="sm"
              variant="ghost"
            />
            <Button size="sm" colorScheme="blue">
              {club.isMember ? "Enter" : "Join"}
            </Button>
          </HStack>
        </CardFooter>
      </Card>
    </MotionBox>
  );
  
  // Render create club modal
  const renderCreateClubModal = () => (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create a New Book Club</ModalHeader>
        <ModalCloseButton />
        
        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Club Name</FormLabel>
              <Input placeholder="Enter a name for your club" />
            </FormControl>
            
            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea 
                placeholder="What is your club about? What kinds of books will you discuss?"
                rows={4}
              />
            </FormControl>
            
            <FormControl isRequired>
              <FormLabel>Meeting Type</FormLabel>
              <Select placeholder="Select meeting type">
                <option value="virtual">Virtual (Online)</option>
                <option value="inPerson">In-Person</option>
                <option value="hybrid">Hybrid (Both)</option>
              </Select>
            </FormControl>
            
            <FormControl isRequired>
              <FormLabel>Privacy</FormLabel>
              <Select placeholder="Select privacy setting">
                <option value="public">Public (Anyone can join)</option>
                <option value="private">Private (By invitation only)</option>
                <option value="restricted">Restricted (Request to join)</option>
              </Select>
            </FormControl>
            
            <FormControl>
              <FormLabel>Select Genres (up to 3)</FormLabel>
              <SimpleGrid columns={2} spacing={2}>
                {allGenres.map(genre => (
                  <Checkbox key={genre} colorScheme="blue">
                    {genre}
                  </Checkbox>
                ))}
              </SimpleGrid>
            </FormControl>
            
            <FormControl>
              <FormLabel>Upload Cover Image</FormLabel>
              <Button leftIcon={<IconWrapper icon={FiPlus} />} w="full">
                Choose Image
              </Button>
            </FormControl>
          </VStack>
        </ModalBody>
        
        <ModalFooter>
          <Button onClick={onClose} mr={3}>Cancel</Button>
          <Button colorScheme="blue">Create Club</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
  
  return (
    <Container maxW="container.xl" py={containerPadding}>
      {/* Header */}
      <VStack spacing={6} align="stretch" mb={8}>
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <Box>
            <Heading size="xl" mb={2}>Book Clubs</Heading>
            <Text color="gray.500">Join a community of readers passionate about sharing ideas</Text>
          </Box>
          
          <Button
            leftIcon={<IconWrapper icon={FiPlus} />}
            colorScheme="blue"
            size="md"
            onClick={onOpen}
          >
            Create Club
          </Button>
        </Flex>
        
        {/* Stats Cards */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
          {clubStats.map((stat, idx) => (
            <Card key={idx}>
              <CardBody>
                <HStack>
                  <Flex
                    borderRadius="md"
                    bg={accentColor}
                    color="white"
                    p={3}
                    justify="center"
                    align="center"
                  >
                    <IconWrapper icon={stat.icon} size="24px" />
                  </Flex>
                  <Box>
                    <Text fontWeight="bold" fontSize="2xl">{stat.value}</Text>
                    <Text color="gray.500">{stat.label}</Text>
                  </Box>
                </HStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </VStack>
      
      {/* Tabs */}
      <Tabs 
        variant="line" 
        colorScheme="blue" 
        mb={6}
        onChange={(index) => setActiveTab(['myClubs', 'discover', 'invitations'][index] as any)}
      >
        <TabList>
          <Tab>My Clubs</Tab>
          <Tab>Discover</Tab>
          <Tab>
            Invitations 
            <Badge ml={2} colorScheme="red" borderRadius="full">3</Badge>
          </Tab>
        </TabList>
        
        <TabPanels>
          <TabPanel px={0}>
            {/* My Clubs Content */}
            <Box>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={6}>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <IconWrapper icon={FiSearch} color="gray.300" />
                  </InputLeftElement>
                  <Input 
                    placeholder="Search my clubs" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </InputGroup>
                
                <HStack>
                  <Menu>
                    <MenuButton
                      as={Button}
                      rightIcon={<IconWrapper icon={FiChevronDown} />}
                      variant="outline"
                      flex="1"
                    >
                      Genre: {selectedGenre === 'all' ? 'All' : selectedGenre}
                    </MenuButton>
                    <MenuList>
                      <MenuItem onClick={() => setSelectedGenre('all')}>All Genres</MenuItem>
                      <MenuDivider />
                      {allGenres.map(genre => (
                        <MenuItem 
                          key={genre} 
                          onClick={() => setSelectedGenre(genre)}
                        >
                          {genre}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Menu>
                  
                  <Menu>
                    <MenuButton
                      as={Button}
                      rightIcon={<IconWrapper icon={FiChevronDown} />}
                      variant="outline"
                      flex="1"
                    >
                      Sort: {sortBy.replace(/^\w/, c => c.toUpperCase())}
                    </MenuButton>
                    <MenuList>
                      <MenuItem onClick={() => setSortBy('recommended')}>Recommended</MenuItem>
                      <MenuItem onClick={() => setSortBy('newest')}>Newest</MenuItem>
                      <MenuItem onClick={() => setSortBy('activity')}>Most Active</MenuItem>
                      <MenuItem onClick={() => setSortBy('members')}>Most Members</MenuItem>
                    </MenuList>
                  </Menu>
                </HStack>
              </SimpleGrid>
              
              {filteredClubs.length > 0 ? (
                <SimpleGrid columns={gridColumns} spacing={6}>
                  {filteredClubs.map(club => renderClubCard(club))}
                </SimpleGrid>
              ) : (
                <Box textAlign="center" py={10}>
                  <Text fontSize="lg" mb={4}>No clubs found matching your criteria</Text>
                  <Button leftIcon={<IconWrapper icon={FiPlus} />} colorScheme="blue" onClick={onOpen}>
                    Create a Club
                  </Button>
                </Box>
              )}
            </Box>
          </TabPanel>
          
          <TabPanel px={0}>
            {/* Discover Content - Would be similar to My Clubs but with different filtering */}
            <Box>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={6}>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <IconWrapper icon={FiSearch} color="gray.300" />
                  </InputLeftElement>
                  <Input 
                    placeholder="Discover clubs" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </InputGroup>
                
                <HStack>
                  <Menu>
                    <MenuButton
                      as={Button}
                      rightIcon={<IconWrapper icon={FiChevronDown} />}
                      variant="outline"
                      flex="1"
                    >
                      Genre: {selectedGenre === 'all' ? 'All' : selectedGenre}
                    </MenuButton>
                    <MenuList>
                      <MenuItem onClick={() => setSelectedGenre('all')}>All Genres</MenuItem>
                      <MenuDivider />
                      {allGenres.map(genre => (
                        <MenuItem 
                          key={genre} 
                          onClick={() => setSelectedGenre(genre)}
                        >
                          {genre}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Menu>
                  
                  <Menu>
                    <MenuButton
                      as={Button}
                      rightIcon={<IconWrapper icon={FiChevronDown} />}
                      variant="outline"
                      flex="1"
                    >
                      Sort: {sortBy.replace(/^\w/, c => c.toUpperCase())}
                    </MenuButton>
                    <MenuList>
                      <MenuItem onClick={() => setSortBy('recommended')}>Recommended</MenuItem>
                      <MenuItem onClick={() => setSortBy('newest')}>Newest</MenuItem>
                      <MenuItem onClick={() => setSortBy('activity')}>Most Active</MenuItem>
                      <MenuItem onClick={() => setSortBy('members')}>Most Members</MenuItem>
                    </MenuList>
                  </Menu>
                </HStack>
              </SimpleGrid>
              
              <SimpleGrid columns={gridColumns} spacing={6}>
                {sampleClubs
                  .filter(club => !club.isMember &&
                    (selectedGenre === 'all' || club.genres.includes(selectedGenre)) &&
                    (club.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                     club.description.toLowerCase().includes(searchQuery.toLowerCase())))
                  .map(club => renderClubCard(club))}
              </SimpleGrid>
            </Box>
          </TabPanel>
          
          <TabPanel px={0}>
            {/* Invitations Content */}
            <VStack spacing={4} align="stretch">
              {[1, 2, 3].map(i => (
                <Card key={i}>
                  <CardBody>
                    <HStack spacing={4}>
                      <Avatar name={`Inviter ${i}`} src={`https://randomuser.me/api/portraits/${i % 2 ? 'women' : 'men'}/${i + 20}.jpg`} />
                      <Box flex="1">
                        <Text fontWeight="bold">
                          {["Sarah Johnson", "Michael Chen", "Emily Rodriguez"][i-1]} invited you to join
                        </Text>
                        <Text>
                          {["Historical Fiction Fans", "Modern Classics", "SciFi & Fantasy Readers"][i-1]}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          {["2 days ago", "1 week ago", "Just now"][i-1]}
                        </Text>
                      </Box>
                      <HStack>
                        <Button size="sm" colorScheme="blue">Accept</Button>
                        <Button size="sm" variant="outline">Decline</Button>
                      </HStack>
                    </HStack>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
      
      {/* Create Club Modal */}
      {renderCreateClubModal()}
    </Container>
  );
};

// For TypeScript support with Chakra UI
const Checkbox = ({ children, ...props }: any) => (
  <FormControl display="flex" alignItems="center">
    <Switch id={`checkbox-${children}`} colorScheme="blue" size="sm" {...props} />
    <FormLabel htmlFor={`checkbox-${children}`} mb="0" ml="2" fontSize="sm">
      {children}
    </FormLabel>
  </FormControl>
);

const MenuDivider = () => <Box my="1" h="1px" bg="gray.200" />;

export default BookClub; 