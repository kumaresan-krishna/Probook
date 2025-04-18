import React, { useState } from 'react';
import {
  Box, Flex, Heading, Text, Button, Tabs, TabList, Tab, TabPanels, 
  TabPanel, Avatar, Badge, Progress, Image, Grid, GridItem,
  VStack, HStack, Divider, useColorModeValue, IconButton, Icon,
  SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText,
  Menu, MenuButton, MenuList, MenuItem, Tag, TagLabel, Card, CardBody
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  BookOpen, BookmarkSimple, User, Users, Trophy, Calendar, 
  DotsThreeOutline, Clock, Star, ChartLineUp, Sparkle,
  Export, Heart, ArrowClockwise, BookmarksSimple
} from 'phosphor-react';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

// Mock data for the profile
const profileData = {
  name: 'Alex Johnson',
  username: '@alexreads',
  bio: 'Avid reader, coffee enthusiast, and software developer. I love exploring new worlds through books and sharing my thoughts with fellow readers.',
  location: 'San Francisco, CA',
  joinedDate: 'January 2021',
  following: 184,
  followers: 219,
  profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8cGVvcGxlfHx8fHx8MTY4NDMwMzQzMg&ixlib=rb-4.0.3&q=80&w=300',
  coverImage: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1290&q=80',
  readingGoal: 52,
  booksReadThisYear: 38,
  totalBooksRead: 182,
  favoriteGenres: ['Fantasy', 'Science Fiction', 'Mystery', 'Classics'],
  currentlyReading: [
    {
      id: 1,
      title: 'Project Hail Mary',
      author: 'Andy Weir',
      progress: 68,
      coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1597695864i/54493401.jpg'
    },
    {
      id: 2,
      title: 'The Midnight Library',
      author: 'Matt Haig',
      progress: 25,
      coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1602190253i/52578297.jpg'
    }
  ]
};

// Mock data for books
const recentBooks = [
  {
    id: 1,
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    rating: 5,
    dateRead: '2 weeks ago',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1546071216i/5907.jpg'
  },
  {
    id: 2,
    title: 'Dune',
    author: 'Frank Herbert',
    rating: 4,
    dateRead: '1 month ago',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1555447414i/44767458.jpg'
  },
  {
    id: 3,
    title: 'Klara and the Sun',
    author: 'Kazuo Ishiguro',
    rating: 4,
    dateRead: '2 months ago',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1603206535i/54120408.jpg'
  },
  {
    id: 4,
    title: 'The Song of Achilles',
    author: 'Madeline Miller',
    rating: 5,
    dateRead: '3 months ago',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1331154660i/11250317.jpg'
  }
];

// Mock data for achievements
const achievements = [
  {
    id: 1,
    title: 'Bookworm',
    description: 'Read 100 books',
    icon: <BookOpen weight="fill" />,
    date: 'June 2023',
    color: 'blue'
  },
  {
    id: 2,
    title: 'Genre Explorer',
    description: 'Read books from 10 different genres',
    icon: <BookmarkSimple weight="fill" />,
    date: 'April 2023',
    color: 'purple'
  },
  {
    id: 3,
    title: 'Night Owl',
    description: 'Read for 10 nights in a row',
    icon: <Clock weight="fill" />,
    date: 'March 2023',
    color: 'teal'
  },
  {
    id: 4,
    title: '5-Star Reviewer',
    description: 'Write 25 book reviews',
    icon: <Star weight="fill" />,
    date: 'February 2023',
    color: 'yellow'
  },
  {
    id: 5,
    title: 'Consistent Reader',
    description: 'Read every day for a month',
    icon: <ArrowClockwise weight="fill" />,
    date: 'January 2023',
    color: 'green'
  },
  {
    id: 6,
    title: 'Collection Master',
    description: 'Create 5 book collections',
    icon: <BookmarksSimple weight="fill" />,
    date: 'December 2022',
    color: 'orange'
  }
];

// Generate stars for book ratings
const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <HStack spacing={1}>
      {[...Array(5)].map((_, i) => (
        <Box key={i} color={i < rating ? 'yellow.400' : 'gray.300'}>
          <Star weight={i < rating ? "fill" : "regular"} size={16} />
        </Box>
      ))}
    </HStack>
  );
};

// Chart data for reading activity
const monthlyReading = [35, 28, 45, 65, 53, 42, 38, 55, 48, 62, 70, 58];

const ProfilePage: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  
  // Theme colors
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const accentColor = useColorModeValue('brand.600', 'brand.400');
  const mutedText = useColorModeValue('gray.600', 'gray.400');
  const badgeBg = useColorModeValue('gray.100', 'gray.700');
  
  return (
    <MotionBox
      as="main"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      pb={8}
    >
      {/* Cover Image & Profile Header */}
      <Box position="relative" h="280px" mb="80px">
        <Image 
          src={profileData.coverImage} 
          alt="Cover Image"
          objectFit="cover"
          w="100%"
          h="100%"
          borderRadius={{ base: 'none', md: 'xl' }}
        />
        
        <Flex
          position="absolute"
          bottom="-60px"
          left="50%"
          transform="translateX(-50%)"
          width={{ base: "90%", md: "80%" }}
          maxW="1200px"
          justifyContent="space-between"
          alignItems={{ base: "center", md: "flex-end" }}
          flexDirection={{ base: "column", md: "row" }}
        >
          <HStack spacing={6} mb={{ base: 4, md: 0 }}>
            <Avatar 
              size="xl" 
              src={profileData.profileImage}
              name={profileData.name}
              border="4px solid"
              borderColor={cardBg}
            />
            
            <VStack align="flex-start" spacing={1}>
              <HStack>
                <Heading size="lg">{profileData.name}</Heading>
                <Badge colorScheme="brand" px={2} py={1} borderRadius="full">
                  Pro
                </Badge>
              </HStack>
              <Text color={mutedText}>{profileData.username}</Text>
            </VStack>
          </HStack>
          
          <HStack spacing={4}>
            <Button colorScheme="brand">Follow</Button>
            <Button variant="outline">Message</Button>
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<DotsThreeOutline weight="bold" />}
                variant="ghost"
                aria-label="More options"
              />
              <MenuList>
                <MenuItem icon={<Export weight="bold" />}>Share Profile</MenuItem>
                <MenuItem icon={<User weight="bold" />}>View as Public</MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
      </Box>
      
      {/* Main Content */}
      <Grid
        maxW="1200px"
        mx="auto"
        px={{ base: 4, md: 8 }}
        templateColumns={{ base: "1fr", lg: "280px 1fr" }}
        gap={8}
      >
        {/* Sidebar */}
        <GridItem>
          <VStack spacing={6} align="stretch">
            {/* Profile Bio */}
            <MotionBox
              bg={cardBg}
              p={6}
              borderRadius="xl"
              boxShadow="sm"
              border="1px solid"
              borderColor={borderColor}
              variants={itemVariants}
            >
              <VStack align="stretch" spacing={4}>
                <Heading size="md">About</Heading>
                <Text>{profileData.bio}</Text>
                
                <HStack color={mutedText}>
                  <Icon as={User} />
                  <Text fontSize="sm">{profileData.location}</Text>
                </HStack>
                
                <HStack color={mutedText}>
                  <Icon as={Calendar} />
                  <Text fontSize="sm">Joined {profileData.joinedDate}</Text>
                </HStack>
                
                <HStack spacing={6}>
                  <VStack spacing={0} align="flex-start">
                    <Text fontWeight="bold">{profileData.following}</Text>
                    <Text fontSize="sm" color={mutedText}>Following</Text>
                  </VStack>
                  
                  <VStack spacing={0} align="flex-start">
                    <Text fontWeight="bold">{profileData.followers}</Text>
                    <Text fontSize="sm" color={mutedText}>Followers</Text>
                  </VStack>
                </HStack>
              </VStack>
            </MotionBox>
            
            {/* Reading Stats */}
            <MotionBox
              bg={cardBg}
              p={6}
              borderRadius="xl"
              boxShadow="sm"
              border="1px solid"
              borderColor={borderColor}
              variants={itemVariants}
            >
              <VStack align="stretch" spacing={4}>
                <Heading size="md">Reading Stats</Heading>
                
                <VStack align="stretch">
                  <Flex justify="space-between">
                    <Text>Annual Reading Goal</Text>
                    <Text fontWeight="bold">{profileData.booksReadThisYear}/{profileData.readingGoal} books</Text>
                  </Flex>
                  <Progress 
                    value={(profileData.booksReadThisYear / profileData.readingGoal) * 100} 
                    colorScheme="brand"
                    borderRadius="full"
                    size="sm"
                  />
                </VStack>
                
                <SimpleGrid columns={2} spacing={4} mt={2}>
                  <Stat>
                    <StatLabel color={mutedText}>Books Read</StatLabel>
                    <StatNumber>{profileData.totalBooksRead}</StatNumber>
                    <StatHelpText>Lifetime</StatHelpText>
                  </Stat>
                  
                  <Stat>
                    <StatLabel color={mutedText}>This Year</StatLabel>
                    <StatNumber>{profileData.booksReadThisYear}</StatNumber>
                    <StatHelpText>+12% from last year</StatHelpText>
                  </Stat>
                </SimpleGrid>
              </VStack>
            </MotionBox>
            
            {/* Currently Reading */}
            <MotionBox
              bg={cardBg}
              p={6}
              borderRadius="xl"
              boxShadow="sm"
              border="1px solid"
              borderColor={borderColor}
              variants={itemVariants}
            >
              <VStack align="stretch" spacing={4}>
                <Heading size="md">Currently Reading</Heading>
                
                {profileData.currentlyReading.map(book => (
                  <Flex key={book.id} gap={4}>
                    <Image 
                      src={book.coverImage} 
                      alt={book.title}
                      boxSize="80px"
                      objectFit="cover"
                      borderRadius="md"
                    />
                    <VStack align="stretch" spacing={2} flex={1}>
                      <Text fontWeight="semibold" noOfLines={1}>{book.title}</Text>
                      <Text fontSize="sm" color={mutedText}>{book.author}</Text>
                      <Box>
                        <Text fontSize="xs" mb={1}>
                          {book.progress}% complete
                        </Text>
                        <Progress 
                          value={book.progress} 
                          size="xs" 
                          colorScheme="brand"
                          borderRadius="full"
                        />
                      </Box>
                    </VStack>
                  </Flex>
                ))}
              </VStack>
            </MotionBox>
            
            {/* Favorite Genres */}
            <MotionBox
              bg={cardBg}
              p={6}
              borderRadius="xl"
              boxShadow="sm"
              border="1px solid"
              borderColor={borderColor}
              variants={itemVariants}
            >
              <VStack align="stretch" spacing={4}>
                <Heading size="md">Favorite Genres</Heading>
                <Flex wrap="wrap" gap={2}>
                  {profileData.favoriteGenres.map((genre, index) => (
                    <Tag key={index} colorScheme="brand" size="md" borderRadius="full">
                      <TagLabel>{genre}</TagLabel>
                    </Tag>
                  ))}
                </Flex>
              </VStack>
            </MotionBox>
          </VStack>
        </GridItem>
        
        {/* Main Content */}
        <GridItem>
          <MotionBox
            bg={cardBg}
            borderRadius="xl"
            boxShadow="sm"
            border="1px solid"
            borderColor={borderColor}
            overflow="hidden"
            variants={itemVariants}
          >
            <Tabs 
              colorScheme="brand"
              onChange={(index) => setTabIndex(index)}
              isLazy
            >
              <TabList px={6} pt={4}>
                <Tab>Books</Tab>
                <Tab>Reviews</Tab>
                <Tab>Collections</Tab>
                <Tab>Achievements</Tab>
                <Tab>Activity</Tab>
              </TabList>
              
              <TabPanels>
                {/* Books Tab */}
                <TabPanel p={6}>
                  <VStack align="stretch" spacing={6}>
                    <HStack justify="space-between">
                      <Heading size="md">Recently Read</Heading>
                      <Button variant="ghost" size="sm" rightIcon={<BookOpen />}>
                        View All
                      </Button>
                    </HStack>
                    
                    <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} spacing={4}>
                      {recentBooks.map(book => (
                        <Card key={book.id} variant="outline" overflow="hidden">
                          <CardBody p={0}>
                            <VStack align="stretch" spacing={0}>
                              <Box position="relative" height="180px">
                                <Image 
                                  src={book.coverImage} 
                                  alt={book.title}
                                  objectFit="cover"
                                  w="100%"
                                  h="100%"
                                />
                                <HStack 
                                  position="absolute" 
                                  top={2} 
                                  right={2}
                                  bg="blackAlpha.600"
                                  color="white"
                                  px={2}
                                  py={1}
                                  borderRadius="md"
                                  fontSize="xs"
                                >
                                  <Icon as={Star} weight="fill" color="yellow.400" />
                                  <Text fontWeight="bold">{book.rating}.0</Text>
                                </HStack>
                              </Box>
                              <Box p={4}>
                                <Text fontWeight="semibold" noOfLines={1} mb={1}>
                                  {book.title}
                                </Text>
                                <Text fontSize="sm" color={mutedText} mb={2}>
                                  {book.author}
                                </Text>
                                <HStack justify="space-between">
                                  <RatingStars rating={book.rating} />
                                  <Text fontSize="xs" color={mutedText}>
                                    {book.dateRead}
                                  </Text>
                                </HStack>
                              </Box>
                            </VStack>
                          </CardBody>
                        </Card>
                      ))}
                    </SimpleGrid>
                  </VStack>
                </TabPanel>
                
                {/* Reviews Tab */}
                <TabPanel p={6}>
                  <VStack align="stretch" spacing={6}>
                    <HStack justify="space-between">
                      <Heading size="md">Recent Reviews</Heading>
                      <Button variant="ghost" size="sm">
                        View All
                      </Button>
                    </HStack>
                    
                    <Text color={mutedText}>
                      This would show the user's book reviews with ratings, dates, and comments.
                    </Text>
                  </VStack>
                </TabPanel>
                
                {/* Collections Tab */}
                <TabPanel p={6}>
                  <VStack align="stretch" spacing={6}>
                    <HStack justify="space-between">
                      <Heading size="md">Book Collections</Heading>
                      <Button variant="ghost" size="sm">
                        Create New
                      </Button>
                    </HStack>
                    
                    <Text color={mutedText}>
                      This would show the user's curated book collections and reading lists.
                    </Text>
                  </VStack>
                </TabPanel>
                
                {/* Achievements Tab */}
                <TabPanel p={6}>
                  <VStack align="stretch" spacing={6}>
                    <Heading size="md">Reading Achievements</Heading>
                    
                    <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
                      {achievements.map(achievement => (
                        <MotionFlex
                          key={achievement.id}
                          p={4}
                          borderRadius="lg"
                          border="1px solid"
                          borderColor={borderColor}
                          direction="column"
                          align="center"
                          textAlign="center"
                          _hover={{ 
                            transform: 'translateY(-4px)',
                            boxShadow: 'md',
                            borderColor: `${achievement.color}.300`
                          }}
                          transition={{ duration: 0.2 }}
                          gap={3}
                        >
                          <Flex
                            borderRadius="full"
                            bg={`${achievement.color}.100`}
                            color={`${achievement.color}.500`}
                            boxSize="60px"
                            justify="center"
                            align="center"
                            fontSize="2xl"
                          >
                            {achievement.icon}
                          </Flex>
                          <VStack spacing={1}>
                            <Heading size="sm">{achievement.title}</Heading>
                            <Text fontSize="sm" color={mutedText}>
                              {achievement.description}
                            </Text>
                            <Badge colorScheme={achievement.color} mt={1}>
                              {achievement.date}
                            </Badge>
                          </VStack>
                        </MotionFlex>
                      ))}
                    </SimpleGrid>
                  </VStack>
                </TabPanel>
                
                {/* Activity Tab */}
                <TabPanel p={6}>
                  <VStack align="stretch" spacing={6}>
                    <Heading size="md">Reading Activity</Heading>
                    
                    <HStack justify="space-between" align="flex-start">
                      <VStack align="flex-start" spacing={0}>
                        <Heading size="lg">
                          {monthlyReading.reduce((sum, val) => sum + val, 0)}
                        </Heading>
                        <Text color={mutedText}>Books read in the last 12 months</Text>
                      </VStack>
                      
                      <HStack>
                        <Box h="100px" w="300px" bg={badgeBg} borderRadius="md" p={4}>
                          {/* This would be a chart component */}
                          <Text fontSize="sm" textAlign="center">Monthly Reading Chart</Text>
                        </Box>
                      </HStack>
                    </HStack>
                    
                    <Divider />
                    
                    <Text color={mutedText}>
                      This would show a chronological feed of the user's reading activity.
                    </Text>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </MotionBox>
        </GridItem>
      </Grid>
    </MotionBox>
  );
};

export default ProfilePage; 