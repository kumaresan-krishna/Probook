import React from 'react';
import {
  Box, Flex, Text, Heading, Progress, Button, Badge,
  Icon, useColorModeValue, Tooltip
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  Trophy, Clock, Users, ArrowRight, BookOpen,
  Medal, Star, Lightning
} from 'phosphor-react';

const MotionBox = motion(Box);

interface ChallengeCardProps {
  id: string | number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  booksRequired: number;
  booksCompleted: number;
  participants: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'genre' | 'seasonal' | 'community' | 'personal';
  isActive: boolean;
  onClick?: () => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  title,
  description,
  startDate,
  endDate,
  booksRequired,
  booksCompleted,
  participants,
  difficulty,
  category,
  isActive,
  onClick
}) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  
  // Format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  // Calculate progress percentage
  const progressPercentage = Math.min(Math.round((booksCompleted / booksRequired) * 100), 100);
  
  // Calculate days remaining
  const daysRemaining = () => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };
  
  // Get badge color for difficulty
  const getDifficultyColor = () => {
    switch(difficulty) {
      case 'easy': return 'green';
      case 'medium': return 'orange';
      case 'hard': return 'red';
      default: return 'gray';
    }
  };
  
  // Get icon for category
  const getCategoryIcon = () => {
    switch(category) {
      case 'genre': return BookOpen;
      case 'seasonal': return Lightning;
      case 'community': return Users;
      case 'personal': return Star;
      default: return Trophy;
    }
  };
  
  return (
    <MotionBox
      bg={cardBg}
      borderRadius="xl"
      borderWidth="1px"
      borderColor={borderColor}
      overflow="hidden"
      whileHover={{ y: -5, boxShadow: 'lg' }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      cursor={onClick ? 'pointer' : 'default'}
      opacity={isActive ? 1 : 0.7}
      h="100%"
      display="flex"
      flexDirection="column"
    >
      {/* Category Banner */}
      <Box 
        py={1} 
        px={4} 
        bg={`${category === 'genre' ? 'purple' : 
              category === 'seasonal' ? 'blue' :
              category === 'community' ? 'green' : 'orange'}.500`}
        color="white"
      >
        <Flex align="center" justify="space-between">
          <Flex align="center">
            <Icon as={getCategoryIcon()} weight="bold" mr={1} />
            <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wider">
              {category} Challenge
            </Text>
          </Flex>
          
          <Badge 
            colorScheme={getDifficultyColor()} 
            fontSize="xs"
            textTransform="uppercase"
            borderRadius="full"
            px={2}
          >
            {difficulty}
          </Badge>
        </Flex>
      </Box>
      
      {/* Challenge Content */}
      <Box p={5} flex="1" display="flex" flexDirection="column">
        <Heading size="md" mb={2} noOfLines={1} color={textColor}>
          {title}
        </Heading>
        
        <Text fontSize="sm" color={mutedColor} mb={4} noOfLines={2} flex="1">
          {description}
        </Text>
        
        {/* Progress Section */}
        <Box mb={4}>
          <Flex justify="space-between" mb={1}>
            <Text fontSize="xs" fontWeight="medium" color={mutedColor}>
              PROGRESS
            </Text>
            <Text fontSize="xs" fontWeight="bold">
              {booksCompleted}/{booksRequired} books
            </Text>
          </Flex>
          
          <Progress 
            value={progressPercentage} 
            size="sm" 
            colorScheme={
              category === 'genre' ? 'purple' : 
              category === 'seasonal' ? 'blue' :
              category === 'community' ? 'green' : 'orange'
            }
            borderRadius="full"
            hasStripe={progressPercentage < 100}
            isAnimated={progressPercentage < 100}
            mb={1}
          />
          
          {progressPercentage === 100 && (
            <Flex justify="center" my={1}>
              <Badge 
                colorScheme="green" 
                variant="solid" 
                borderRadius="full" 
                px={3}
                py={1}
              >
                <Flex align="center">
                  <Icon as={Trophy} weight="fill" mr={1} />
                  <Text fontSize="xs">Challenge Complete!</Text>
                </Flex>
              </Badge>
            </Flex>
          )}
        </Box>
        
        {/* Details Section */}
        <Flex mt="auto" justify="space-between" flexWrap="wrap" gap={2}>
          <Flex align="center">
            <Tooltip label="Time Remaining">
              <Flex align="center" mr={3}>
                <Icon as={Clock} weight="bold" mr={1} color={mutedColor} />
                <Text fontSize="xs" color={mutedColor}>
                  {daysRemaining()} days left
                </Text>
              </Flex>
            </Tooltip>
            
            <Tooltip label="Participants">
              <Flex align="center">
                <Icon as={Users} weight="bold" mr={1} color={mutedColor} />
                <Text fontSize="xs" color={mutedColor}>
                  {participants}
                </Text>
              </Flex>
            </Tooltip>
          </Flex>
          
          {isActive && (
            <Button 
              size="xs" 
              colorScheme={
                category === 'genre' ? 'purple' : 
                category === 'seasonal' ? 'blue' :
                category === 'community' ? 'green' : 'orange'
              }
              variant="outline"
              rightIcon={<ArrowRight weight="bold" />}
              onClick={(e) => {
                e.stopPropagation();
                if (onClick) onClick();
              }}
            >
              View Details
            </Button>
          )}
        </Flex>
      </Box>
    </MotionBox>
  );
};

export default ChallengeCard; 