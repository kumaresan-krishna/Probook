import React, { useState, useEffect } from 'react';
import { Challenge, UserChallenge, Book as BookType } from '../types';
import { ChallengeService } from '../lib/challengeService';
import ChallengeCard from '../components/ChallengeCard';
import Leaderboard from '../components/Leaderboard';
import '../styles/ChallengesPage.css';
import {
  Box, Flex, Grid, Heading, Text, Button, Tabs, TabList,
  Tab, TabPanels, TabPanel, SimpleGrid, Icon, Badge,
  useColorModeValue, Stack, HStack, Stat, StatLabel, StatNumber, StatHelpText, Divider, Tooltip, Progress, VStack
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  Trophy, Users, ArrowRight, Plus, Lightning,
  BookOpen, Crown, Medal, Star, Books, TrendUp, Clock, Calendar, Target, Check, Flag, Books as BookIcon
} from 'phosphor-react';

interface ChallengesPageProps {
  books: BookType[];
}

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

// Fix interfaces for components
interface MonthlyStatCardProps {
  icon: React.ComponentType;
  title: string;  
  value: string;
  comparison: string;
  isPositive: boolean;
}

interface AchievementCardProps {
  title: string;
  description: string;
  icon: React.ComponentType;
  color: string;
  earnedDate: string;
}

const ChallengesPage: React.FC<ChallengesPageProps> = ({ books }) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userChallenges, setUserChallenges] = useState<UserChallenge[]>([]);
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
  const [displayMode, setDisplayMode] = useState<'all' | 'active' | 'completed'>('active');
  const [earnedBadges, setEarnedBadges] = useState<{ name: string, icon: string }[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);

  // Theme colors
  const bgColor = useColorModeValue('neutral.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  // Mock data for challenges
  const userStats = {
    completedChallenges: 18,
    ongoingChallenges: 3,
    streakDays: 45,
    totalBooks: 76,
    rank: 'Book Champion',
    points: 1240
  };

  useEffect(() => {
    // Load challenges
    loadChallenges();
    
    // Update challenge progress
    ChallengeService.updateChallengeProgress(books);
    
    // Get earned badges
    setEarnedBadges(ChallengeService.getEarnedBadges());
  }, [books]);
  
  const loadChallenges = () => {
    const allChallenges = ChallengeService.getAllChallenges();
    setChallenges(allChallenges);
    
    const activeOnes = ChallengeService.getActiveChallenges();
    setActiveChallenges(activeOnes);
    
    const userOnes = ChallengeService.getUserChallenges();
    setUserChallenges(userOnes);
  };
  
  const handleJoinChallenge = (challengeId: string) => {
    const result = ChallengeService.joinChallenge(challengeId);
    if (result) {
      // Refresh user challenges
      setUserChallenges([...userChallenges, result]);
    }
  };
  
  const getFilteredChallenges = () => {
    switch (displayMode) {
      case 'all':
        return challenges;
      case 'active': {
        // Get IDs of challenges the user has joined
        const joinedChallengeIds = userChallenges.map(uc => uc.challengeId);
        // Filter active challenges for those the user has joined
        return activeChallenges.filter(challenge => 
          joinedChallengeIds.includes(challenge.id) &&
          !userChallenges.find(uc => uc.challengeId === challenge.id)?.completed
        );
      }
      case 'completed':
        // Get IDs of completed challenges
        const completedChallengeIds = userChallenges
          .filter(uc => uc.completed)
          .map(uc => uc.challengeId);
        // Return completed challenges
        return challenges.filter(challenge => 
          completedChallengeIds.includes(challenge.id)
        );
      default:
        return challenges;
    }
  };
  
  const getUserChallenge = (challengeId: string) => {
    return userChallenges.find(uc => uc.challengeId === challengeId);
  };
  
  const filteredChallenges = getFilteredChallenges();
  
  const handleChallengeClick = (challengeId: string | number) => {
    console.log('Challenge clicked:', challengeId);
    // In a real app, this might navigate to a challenge detail page
  };

  const handleCreateChallenge = () => {
    console.log('Create challenge clicked');
    // In a real app, this might open a modal or navigate to a challenge creation page
  };

  // User's reading goals
  const readingGoals = [
    { 
      id: 1,
      title: 'Books in 2023',
      target: 50,
      current: 32,
      icon: BookIcon,
      timeLeft: '42 days left'
    },
    { 
      id: 2,
      title: 'Pages this month',
      target: 1500,
      current: 920,
      icon: Calendar,
      timeLeft: '8 days left'
    },
    { 
      id: 3,
      title: 'Reading time',
      target: 50,
      current: 24,
      icon: Clock,
      unit: 'hours',
      timeLeft: '2 weeks left'
    }
  ];
  
  // Current challenges
  const currentChallenges = [
    {
      id: 1,
      title: 'Summer Reading Challenge',
      description: 'Read 10 books between June and August',
      progress: 7,
      total: 10,
      badgeColor: 'orange',
      badgeText: 'Summer',
      daysLeft: 23,
      participants: 145
    },
    {
      id: 2,
      title: 'Classics Challenge',
      description: 'Read 5 classic novels published before 1950',
      progress: 2,
      total: 5,
      badgeColor: 'purple',
      badgeText: 'Classics',
      daysLeft: 56,
      participants: 89
    },
    {
      id: 3,
      title: 'Diverse Authors',
      description: 'Read books by authors from 8 different countries',
      progress: 3,
      total: 8,
      badgeColor: 'green',
      badgeText: 'Diversity',
      daysLeft: 120,
      participants: 213
    }
  ];
  
  // Achievements
  const achievements = [
    {
      id: 1,
      title: 'Bookworm',
      description: 'Read 100 books total',
      progress: 76,
      total: 100,
      icon: BookIcon,
      earned: false
    },
    {
      id: 2,
      title: 'Genre Explorer',
      description: 'Read books from 10 different genres',
      progress: 10,
      total: 10,
      icon: Target,
      earned: true,
      date: 'June 12, 2023'
    },
    {
      id: 3,
      title: 'Night Owl',
      description: 'Log reading sessions after midnight 15 times',
      progress: 12,
      total: 15,
      icon: Clock,
      earned: false
    },
    {
      id: 4,
      title: 'Streak Master',
      description: 'Read for 30 consecutive days',
      progress: 30,
      total: 30,
      icon: TrendUp,
      earned: true,
      date: 'May 24, 2023'
    },
    {
      id: 5,
      title: 'Speed Reader',
      description: 'Finish a 300+ page book in 2 days',
      progress: 1,
      total: 1,
      icon: Flag,
      earned: true,
      date: 'July 8, 2023'
    },
    {
      id: 6,
      title: 'Series Completer',
      description: 'Finish 5 book series',
      progress: 3,
      total: 5,
      icon: Check,
      earned: false
    }
  ];

  return (
    <MotionBox
      as="section"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      maxW="1400px"
      mx="auto"
      pb={8}
    >
      {/* Header */}
      <MotionFlex
        variants={itemVariants}
        justify="space-between"
        align="center"
        mb={8}
        wrap="wrap"
        gap={4}
      >
        <Heading size="xl" fontWeight="extrabold">Reading Challenges</Heading>
        <Button
          leftIcon={<Plus weight="bold" />}
          colorScheme="brand"
          onClick={handleCreateChallenge}
        >
          Create Challenge
        </Button>
      </MotionFlex>

      {/* Stats Cards */}
      <MotionBox
        variants={itemVariants}
        mb={8}
      >
        <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4}>
          <StatCard
            icon={Trophy}
            title="Completed"
            value={userStats.completedChallenges.toString()}
            comparison="2 more than last month"
            isPositive={true}
          />
          <StatCard
            icon={Lightning}
            title="Active"
            value={userStats.ongoingChallenges.toString()}
            comparison="Same as last month"
            isPositive={true}
          />
          <StatCard
            icon={TrendUp}
            title="Streak"
            value={`${userStats.streakDays} days`}
            comparison="5 days more than before"
            isPositive={true}
          />
          <StatCard
            icon={Books}
            title="Total Books"
            value={userStats.totalBooks.toString()}
            comparison="10 more than last month"
            isPositive={true}
          />
          <StatCard
            icon={Crown}
            title="Rank"
            value={userStats.rank}
            comparison="Up 1 level"
            isPositive={true}
          />
          <StatCard
            icon={Star}
            title="Points"
            value={userStats.points.toString()}
            comparison="+120 this month"
            isPositive={true}
          />
        </SimpleGrid>
      </MotionBox>

      {/* Tabs Section */}
      <MotionBox
        variants={itemVariants}
        bg={cardBg}
        borderRadius="xl"
        boxShadow="sm"
        overflow="hidden"
        mb={6}
      >
        <Tabs 
          colorScheme="brand" 
          onChange={(index) => setActiveTab(index)}
          variant="enclosed"
        >
          <TabList px={4} pt={2}>
            <Tab fontWeight="medium">
              <Flex align="center">
                <Icon as={Lightning} weight="bold" mr={2} />
                <Text>Active</Text>
                <Badge ml={2} colorScheme="green" borderRadius="full">
                  {activeChallenges.length}
                </Badge>
              </Flex>
            </Tab>
            <Tab fontWeight="medium">
              <Flex align="center">
                <Icon as={Trophy} weight="bold" mr={2} />
                <Text>Completed</Text>
              </Flex>
            </Tab>
            <Tab fontWeight="medium">
              <Flex align="center">
                <Icon as={Users} weight="bold" mr={2} />
                <Text>Community</Text>
              </Flex>
            </Tab>
            <Tab fontWeight="medium">
              <Flex align="center">
                <Icon as={BookOpen} weight="bold" mr={2} />
                <Text>Upcoming</Text>
              </Flex>
            </Tab>
          </TabList>

          <TabPanels>
            {/* Active Challenges */}
            <TabPanel p={4}>
              <Grid 
                templateColumns={{ 
                  base: "repeat(1, 1fr)", 
                  md: "repeat(2, 1fr)", 
                  lg: "repeat(3, 1fr)" 
                }}
                gap={4}
              >
                {activeChallenges.map(challenge => (
                  <ChallengeCard
                    key={challenge.id}
                    id={challenge.id}
                    title={challenge.title}
                    description={challenge.description}
                    startDate={challenge.startDate}
                    endDate={challenge.endDate}
                    booksRequired={10}
                    booksCompleted={getUserChallenge(challenge.id)?.progress || 0}
                    participants={50}
                    difficulty="medium"
                    category="seasonal"
                    isActive={true}
                    onClick={() => handleChallengeClick(challenge.id)}
                  />
                ))}
              </Grid>
            </TabPanel>

            {/* Completed Challenges */}
            <TabPanel p={4}>
              <Grid 
                templateColumns={{ 
                  base: "repeat(1, 1fr)", 
                  md: "repeat(2, 1fr)", 
                  lg: "repeat(3, 1fr)" 
                }}
                gap={4}
              >
                {filteredChallenges.map(challenge => (
                  <ChallengeCard
                    key={challenge.id}
                    id={challenge.id}
                    title={challenge.title}
                    description={challenge.description}
                    startDate={challenge.startDate}
                    endDate={challenge.endDate}
                    booksRequired={10}
                    booksCompleted={getUserChallenge(challenge.id)?.progress || 0}
                    participants={50}
                    difficulty="medium"
                    category="seasonal"
                    isActive={true}
                    onClick={() => handleChallengeClick(challenge.id)}
                  />
                ))}
              </Grid>
            </TabPanel>

            {/* Community Challenges */}
            <TabPanel p={4}>
              <Grid 
                templateColumns={{ 
                  base: "repeat(1, 1fr)", 
                  md: "repeat(2, 1fr)", 
                  lg: "repeat(3, 1fr)" 
                }}
                gap={4}
              >
                {filteredChallenges.map(challenge => (
                  <ChallengeCard
                    key={challenge.id}
                    id={challenge.id}
                    title={challenge.title}
                    description={challenge.description}
                    startDate={challenge.startDate}
                    endDate={challenge.endDate}
                    booksRequired={10}
                    booksCompleted={getUserChallenge(challenge.id)?.progress || 0}
                    participants={50}
                    difficulty="medium"
                    category="seasonal"
                    isActive={true}
                    onClick={() => handleChallengeClick(challenge.id)}
                  />
                ))}
              </Grid>
            </TabPanel>

            {/* Upcoming Challenges */}
            <TabPanel p={4}>
              <Grid 
                templateColumns={{ 
                  base: "repeat(1, 1fr)", 
                  md: "repeat(2, 1fr)", 
                  lg: "repeat(3, 1fr)" 
                }}
                gap={4}
              >
                {filteredChallenges.map(challenge => (
                  <ChallengeCard
                    key={challenge.id}
                    id={challenge.id}
                    title={challenge.title}
                    description={challenge.description}
                    startDate={challenge.startDate}
                    endDate={challenge.endDate}
                    booksRequired={10}
                    booksCompleted={getUserChallenge(challenge.id)?.progress || 0}
                    participants={50}
                    difficulty="medium"
                    category="seasonal"
                    isActive={true}
                    onClick={() => handleChallengeClick(challenge.id)}
                  />
                ))}
              </Grid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </MotionBox>

      {/* Achievements Section */}
      <MotionBox
        variants={itemVariants}
      >
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="md">Recent Achievements</Heading>
          <Button 
            variant="ghost" 
            colorScheme="brand" 
            rightIcon={<ArrowRight />} 
            size="sm"
          >
            View All
          </Button>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
          <AchievementCard
            title="Consistent Reader"
            description="Maintained a 30-day reading streak"
            icon={TrendUp}
            color="purple.500"
            earnedDate="Oct 15, 2023"
          />
          <AchievementCard
            title="Genre Explorer"
            description="Read books from 5 different genres"
            icon={BookOpen}
            color="blue.500"
            earnedDate="Sep 28, 2023"
          />
          <AchievementCard
            title="Book Worm"
            description="Read 50 books in a year"
            icon={Books}
            color="green.500"
            earnedDate="Sep 20, 2023"
          />
          <AchievementCard
            title="Challenge Champion"
            description="Completed 10 reading challenges"
            icon={Trophy}
            color="yellow.500"
            earnedDate="Aug 5, 2023"
          />
        </SimpleGrid>
      </MotionBox>

      {/* Reading Stats Overview */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        {readingGoals.map(goal => (
          <MotionBox
            key={goal.id}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            bg={cardBg}
            p={5}
            borderRadius="lg"
            boxShadow="md"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <Flex justify="space-between" align="center" mb={3}>
              <Heading size="md">{goal.title}</Heading>
              <Icon as={goal.icon} boxSize="24px" color={goal.icon === BookIcon ? "orange.500" : goal.icon === Calendar ? "blue.500" : "purple.500"} />
            </Flex>
            
            <Stat>
              <StatNumber fontSize="2xl" mb={2}>
                {goal.current} <Text as="span" fontSize="md" color={mutedColor}>/ {goal.target}{goal.unit ? ` ${goal.unit}` : ''}</Text>
              </StatNumber>
              <Progress
                value={(goal.current / goal.target) * 100}
                colorScheme={goal.icon === BookIcon ? "orange" : goal.icon === Calendar ? "blue" : "purple"}
                borderRadius="full"
                size="sm"
                mb={2}
              />
              <StatHelpText>{goal.timeLeft}</StatHelpText>
            </Stat>
          </MotionBox>
        ))}
      </SimpleGrid>
      
      {/* Tabs for Challenges and Achievements */}
      <Tabs 
        variant="soft-rounded" 
        colorScheme="blue" 
        onChange={(index) => setActiveTab(index)}
        mb={6}
      >
        <TabList mb={4}>
          <Tab>Active Challenges</Tab>
          <Tab>Achievements</Tab>
        </TabList>
        
        <TabPanels>
          {/* Current Challenges Tab */}
          <TabPanel p={0}>
            <Flex justify="space-between" align="center" mb={4}>
              <Heading size="md">Current Challenges</Heading>
              <Button leftIcon={<Plus />} colorScheme="blue" size="sm">
                Join New Challenge
              </Button>
            </Flex>
            
            <Stack spacing={4} align="stretch">
              {currentChallenges.map(challenge => (
                <MotionBox
                  key={challenge.id}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                  bg={cardBg}
                  p={5}
                  borderRadius="lg"
                  boxShadow="sm"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <Flex justify="space-between" wrap="wrap">
                    <VStack align="start" spacing={2} flex="1">
                      <Flex align="center">
                        <Heading size="md" mr={2}>{challenge.title}</Heading>
                        <Badge colorScheme={challenge.badgeColor}>{challenge.badgeText}</Badge>
                      </Flex>
                      <Text color={mutedColor}>{challenge.description}</Text>
                      
                      <HStack mt={2}>
                        <Text color={mutedColor} fontSize="sm">
                          <Icon as={Calendar} mr={1} />
                          {challenge.daysLeft} days left
                        </Text>
                        <Text color={mutedColor} fontSize="sm">
                          <Icon as={Users} mr={1} />
                          {challenge.participants} participants
                        </Text>
                      </HStack>
                    </VStack>
                    
                    <Box minW="150px" textAlign="right">
                      <Text fontSize="xl" fontWeight="bold" mb={1}>
                        {challenge.progress}/{challenge.total}
                      </Text>
                      <Progress
                        value={(challenge.progress / challenge.total) * 100}
                        colorScheme={challenge.badgeColor}
                        borderRadius="full"
                        size="sm"
                        mb={2}
                      />
                    </Box>
                  </Flex>
                </MotionBox>
              ))}
            </Stack>
          </TabPanel>
          
          {/* Achievements Tab */}
          <TabPanel p={0}>
            <Heading size="md" mb={4}>Your Achievements</Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {achievements.map(achievement => (
                <MotionBox
                  key={achievement.id}
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  bg={cardBg}
                  p={4}
                  borderRadius="lg"
                  boxShadow="sm"
                  borderWidth="1px"
                  borderColor={borderColor}
                  opacity={achievement.earned ? 1 : 0.7}
                  position="relative"
                >
                  {achievement.earned && (
                    <Badge 
                      position="absolute" 
                      top="-10px" 
                      right="-10px" 
                      borderRadius="full" 
                      p={2} 
                      colorScheme="green"
                    >
                      <Icon as={Check} />
                    </Badge>
                  )}
                  
                  <VStack align="start" spacing={3}>
                    <Icon 
                      as={achievement.icon} 
                      boxSize="40px" 
                      p={2}
                      bg={achievement.earned ? "green.100" : "gray.100"}
                      color={achievement.earned ? "green.500" : "gray.500"}
                      borderRadius="full" 
                    />
                    
                    <Heading size="sm">{achievement.title}</Heading>
                    <Text fontSize="sm" color={mutedColor}>{achievement.description}</Text>
                    
                    <Box w="100%">
                      <Flex justify="space-between" mb={1}>
                        <Text fontSize="xs" color={mutedColor}>Progress</Text>
                        <Text fontSize="xs" fontWeight="bold">
                          {achievement.progress}/{achievement.total}
                        </Text>
                      </Flex>
                      <Progress
                        value={(achievement.progress / achievement.total) * 100}
                        colorScheme={achievement.earned ? "green" : "blue"}
                        borderRadius="full"
                        size="xs"
                      />
                    </Box>
                    
                    {achievement.earned && (
                      <Text fontSize="xs" color="green.500">
                        Completed on {achievement.date}
                      </Text>
                    )}
                  </VStack>
                </MotionBox>
              ))}
            </SimpleGrid>
          </TabPanel>
        </TabPanels>
      </Tabs>
      
      {/* Monthly Reading Stats */}
      <Box mt={8}>
        <Heading size="md" mb={4}>Monthly Reading Stats</Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <StatCard 
            icon={Books} 
            title="Books Read" 
            value="5" 
            comparison="+2 from last month"
            isPositive={true}
          />
          <StatCard 
            icon={Clock} 
            title="Reading Time" 
            value="28 hours" 
            comparison="-3 from last month"
            isPositive={false}
          />
          <StatCard 
            icon={Star} 
            title="Average Rating" 
            value="4.3" 
            comparison="+0.2 from last month"
            isPositive={true}
          />
        </SimpleGrid>
      </Box>
    </MotionBox>
  );
};

// Stat card component for monthly stats
const StatCard: React.FC<MonthlyStatCardProps> = ({ icon, title, value, comparison, isPositive }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const subtleText = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Box
      bg={cardBg}
      p={5}
      borderRadius="lg"
      boxShadow="sm"
      borderWidth="1px"
      borderColor={borderColor}
    >
      <Flex justify="space-between" align="center" mb={3}>
        <Text fontWeight="medium" color={subtleText}>{title}</Text>
        <Icon as={icon} boxSize="20px" color={isPositive ? "green.500" : "gray.500"} />
      </Flex>
      <Text fontSize="2xl" fontWeight="bold" mb={1}>{value}</Text>
      <Text fontSize="sm" color={isPositive ? "green.500" : "red.500"}>
        {comparison}
      </Text>
    </Box>
  );
};

// Achievement Card Component
interface AchievementCardProps {
  title: string;
  description: string;
  icon: React.ComponentType;
  color: string;
  earnedDate: string;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  title,
  description,
  icon,
  color,
  earnedDate
}) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  
  return (
    <MotionBox
      bg={cardBg}
      p={4}
      borderRadius="xl"
      boxShadow="sm"
      whileHover={{ y: -5, boxShadow: 'lg' }}
      transition={{ duration: 0.2 }}
    >
      <Flex mb={3} align="center">
        <Flex 
          w="40px" 
          h="40px" 
          borderRadius="lg" 
          bg={`${color}15`}
          color={color}
          justify="center"
          align="center"
          mr={3}
        >
          <Icon as={icon} boxSize={5} />
        </Flex>
        <Box>
          <Heading size="sm">{title}</Heading>
          <Text fontSize="xs" color={mutedColor}>{earnedDate}</Text>
        </Box>
      </Flex>
      <Text fontSize="sm" color={mutedColor}>
        {description}
      </Text>
    </MotionBox>
  );
};

export default ChallengesPage; 