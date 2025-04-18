import React from 'react';
import {
  Box, Flex, Grid, Heading, Text, Stat, StatLabel, 
  StatNumber, StatHelpText, StatArrow, SimpleGrid,
  Progress, Icon, useColorModeValue
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  BookOpen, BookmarkSimple, Books, Trophy,
  ClockClockwise, TrendUp, Calendar
} from 'phosphor-react';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      when: "beforeChildren", 
      staggerChildren: 0.1 
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

const DashboardHome: React.FC = () => {
  const bgColor = useColorModeValue('neutral.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  // Mock data (this would come from your API or state)
  const stats = {
    booksRead: 28,
    streak: 15,
    clubsJoined: 5,
    readingTime: 9.5,
    readingGoal: { current: 28, target: 50 }
  };

  const currentlyReading = [
    {
      id: 1,
      title: "The Midnight Library",
      author: "Matt Haig",
      cover: "https://images-na.ssl-images-amazon.com/images/I/81YzHKeWq7L.jpg",
      progress: 65,
      currentPage: 195,
      totalPages: 304,
      estimatedCompletion: "May 28"
    },
    {
      id: 2,
      title: "Project Hail Mary",
      author: "Andy Weir",
      cover: "https://images-na.ssl-images-amazon.com/images/I/91Bd7P8UwxL.jpg",
      progress: 23,
      currentPage: 82,
      totalPages: 496,
      estimatedCompletion: "June 12"
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: "completion",
      title: "The Psychology of Money",
      author: "Morgan Housel",
      date: "2 days ago",
      cover: "https://images-na.ssl-images-amazon.com/images/I/81Lb75rUhLL.jpg",
    },
    {
      id: 2,
      type: "milestone",
      title: "Project Hail Mary",
      author: "Andy Weir",
      milestone: "25%",
      date: "3 days ago",
      cover: "https://images-na.ssl-images-amazon.com/images/I/91Bd7P8UwxL.jpg"
    },
    {
      id: 3,
      type: "started",
      title: "The Midnight Library",
      author: "Matt Haig",
      date: "5 days ago",
      cover: "https://images-na.ssl-images-amazon.com/images/I/81YzHKeWq7L.jpg"
    }
  ];

  return (
    <MotionBox
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      maxW="1200px"
      mx="auto"
      pb={8}
    >
      {/* Dashboard Header */}
      <MotionFlex 
        variants={itemVariants}
        justify="space-between" 
        align="center" 
        mb={8}
      >
        <Heading size="xl" fontWeight="extrabold">Dashboard</Heading>
        <Box>
          <Text color={mutedColor} fontWeight="medium">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
        </Box>
      </MotionFlex>

      {/* Stats Overview */}
      <MotionBox variants={itemVariants} mb={8}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5}>
          <StatCard
            label="Books Read"
            value={stats.booksRead}
            icon={Books}
            iconColor="brand.400"
            increase={8}
            helpText="vs. last month"
          />
          
          <StatCard
            label="Reading Streak"
            value={`${stats.streak} days`}
            icon={TrendUp}
            iconColor="green.500"
            increase={5}
            helpText="consecutive days"
          />
          
          <StatCard
            label="Reading Time"
            value={`${stats.readingTime}h`}
            icon={ClockClockwise}
            iconColor="purple.500"
            increase={-12}
            helpText="vs. last week"
          />
          
          <StatCard
            label="Reading Goal"
            value={`${stats.readingGoal.current}/${stats.readingGoal.target}`}
            icon={Trophy}
            iconColor="orange.500"
            increase={15}
            helpText="books this year"
            showProgress
            progress={(stats.readingGoal.current / stats.readingGoal.target) * 100}
          />
        </SimpleGrid>
      </MotionBox>

      {/* Currently Reading */}
      <MotionBox variants={itemVariants} mb={8}>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="md">Currently Reading</Heading>
          <Text color="brand.500" fontWeight="medium" fontSize="sm" cursor="pointer">
            View All
          </Text>
        </Flex>
        
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
          {currentlyReading.map(book => (
            <ReadingBookCard key={book.id} book={book} />
          ))}
        </SimpleGrid>
      </MotionBox>

      {/* Recent Activity */}
      <MotionBox variants={itemVariants}>
        <Heading size="md" mb={4}>Recent Activity</Heading>
        
        <Box
          borderRadius="xl"
          bg={cardBg}
          boxShadow="sm"
          overflow="hidden"
        >
          {recentActivity.map((activity, index) => (
            <ActivityItem 
              key={activity.id} 
              activity={activity} 
              isLast={index === recentActivity.length - 1} 
            />
          ))}
        </Box>
      </MotionBox>
    </MotionBox>
  );
};

// Stat Card Component
interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ComponentType;
  iconColor: string;
  increase: number;
  helpText: string;
  showProgress?: boolean;
  progress?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  iconColor,
  increase,
  helpText,
  showProgress = false,
  progress = 0
}) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  
  return (
    <Box
      bg={cardBg}
      p={5}
      borderRadius="xl"
      boxShadow="sm"
      position="relative"
      overflow="hidden"
    >
      <Flex justify="space-between" align="flex-start">
        <Stat>
          <StatLabel color="gray.500" fontSize="sm" fontWeight="medium">{label}</StatLabel>
          <StatNumber fontSize="2xl" fontWeight="bold" my={1}>{value}</StatNumber>
          <StatHelpText mb={0}>
            <StatArrow type={increase >= 0 ? 'increase' : 'decrease'} />
            {Math.abs(increase)}% {helpText}
          </StatHelpText>
        </Stat>
        
        <Flex
          w="40px"
          h="40px"
          justify="center"
          align="center"
          borderRadius="lg"
          bg={`${iconColor}15`}
          color={iconColor}
        >
          <Icon as={icon} boxSize={5} />
        </Flex>
      </Flex>
      
      {showProgress && (
        <Box mt={4}>
          <Progress 
            value={progress} 
            size="sm" 
            colorScheme="brand" 
            borderRadius="full"
            hasStripe={progress < 100}
            isAnimated={progress < 100}
          />
        </Box>
      )}
      
      {/* Decorative element */}
      <Box
        position="absolute"
        bottom={-12}
        right={-12}
        width="80px"
        height="80px"
        borderRadius="full"
        bg={`${iconColor}05`}
        zIndex={0}
      />
    </Box>
  );
};

// Reading Book Card Component
interface ReadingBookProps {
  book: {
    id: number;
    title: string;
    author: string;
    cover: string;
    progress: number;
    currentPage: number;
    totalPages: number;
    estimatedCompletion: string;
  };
}

const ReadingBookCard: React.FC<ReadingBookProps> = ({ book }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  
  return (
    <Box
      bg={cardBg}
      borderRadius="xl"
      overflow="hidden"
      boxShadow="sm"
      transition="all 0.2s"
      _hover={{ transform: 'translateY(-4px)', boxShadow: 'md' }}
    >
      <Flex>
        <Box
          width="100px"
          height="150px"
          bgImage={`url(${book.cover})`}
          bgSize="cover"
          bgPosition="center"
        />
        
        <Box p={4} flex="1">
          <Heading size="sm" mb={1}>{book.title}</Heading>
          <Text fontSize="sm" color={mutedColor} mb={3}>{book.author}</Text>
          
          <Flex align="center" fontSize="xs" color={mutedColor} mb={2}>
            <Icon as={BookOpen} mr={1} />
            <Text>{book.currentPage} of {book.totalPages} pages</Text>
          </Flex>
          
          <Flex align="center" fontSize="xs" color={mutedColor} mb={3}>
            <Icon as={Calendar} mr={1} />
            <Text>Est. completion: {book.estimatedCompletion}</Text>
          </Flex>
          
          <Box>
            <Flex justify="space-between" mb={1}>
              <Text fontSize="xs" fontWeight="medium">Progress</Text>
              <Text fontSize="xs" fontWeight="bold">{book.progress}%</Text>
            </Flex>
            <Progress 
              value={book.progress} 
              size="sm" 
              colorScheme="brand" 
              borderRadius="full" 
            />
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

// Activity Item Component
interface ActivityItemProps {
  activity: {
    id: number;
    type: string;
    title: string;
    author: string;
    date: string;
    milestone?: string;
    cover: string;
  };
  isLast: boolean;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity, isLast }) => {
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  
  // Get icon based on activity type
  const getActivityIcon = () => {
    switch(activity.type) {
      case 'completion': return BookmarkSimple;
      case 'milestone': return Books;
      case 'started': return BookOpen;
      default: return BookOpen;
    }
  };
  
  // Get background color based on activity type
  const getActivityColor = () => {
    switch(activity.type) {
      case 'completion': return 'green.500';
      case 'milestone': return 'brand.400';
      case 'started': return 'purple.500';
      default: return 'gray.500';
    }
  };
  
  // Get activity description
  const getActivityDesc = () => {
    switch(activity.type) {
      case 'completion': return 'Completed';
      case 'milestone': return `Reached ${activity.milestone}`;
      case 'started': return 'Started reading';
      default: return 'Updated';
    }
  };
  
  return (
    <Flex
      p={4}
      borderBottomWidth={isLast ? '0' : '1px'}
      borderColor={borderColor}
      align="center"
      _hover={{ bg: useColorModeValue('gray.50', 'gray.750') }}
    >
      <Flex
        w="40px"
        h="40px"
        align="center"
        justify="center"
        borderRadius="full"
        bg={`${getActivityColor()}15`}
        color={getActivityColor()}
        mr={4}
        flexShrink={0}
      >
        <Icon as={getActivityIcon()} boxSize={5} />
      </Flex>
      
      <Box flex="1">
        <Text fontWeight="medium">{getActivityDesc()}</Text>
        <Text fontSize="sm" color={mutedColor}>
          {activity.title} by {activity.author}
        </Text>
      </Box>
      
      <Text fontSize="xs" color={mutedColor}>
        {activity.date}
      </Text>
    </Flex>
  );
};

export default DashboardHome;

 