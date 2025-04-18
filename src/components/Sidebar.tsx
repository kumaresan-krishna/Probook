import React from 'react';
import {
  Box, Flex, VStack, Icon, Text, Divider,
  useColorModeValue
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  House, Books, Trophy, UsersThree, ShoppingCart,
  Robot, ChartPieSlice, PencilSimple, Question
} from 'phosphor-react';

const MotionBox = motion(Box);

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  mobileMenuOpen?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activePage, 
  setActivePage, 
  mobileMenuOpen = false 
}) => {
  const bgColor = useColorModeValue('white', 'neutral.800');
  const activeColor = useColorModeValue('brand.500', 'brand.400');
  const activeBg = useColorModeValue('brand.50', 'brand.900');
  const hoverBg = useColorModeValue('neutral.100', 'neutral.700');
  
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: House },
    { id: 'books', name: 'My Library', icon: Books },
    { id: 'challenges', name: 'Challenges', icon: Trophy },
    { id: 'clubs', name: 'Clubs', icon: UsersThree },
    { id: 'community', name: 'Community', icon: UsersThree },
    { id: 'marketplace', name: 'Marketplace', icon: ShoppingCart },
    { id: 'bookbot', name: 'BookBot', icon: Robot },
    { id: 'writer', name: 'Writer', icon: PencilSimple },
    { id: 'analytics', name: 'Analytics', icon: ChartPieSlice },
  ];

  return (
    <Box
      as="nav"
      h="100%"
      bg={bgColor}
      width={{ base: "full", lg: "240px" }}
      position={{ base: "fixed", lg: "relative" }}
      top={{ base: 0, lg: "auto" }}
      left={{ base: 0, lg: "auto" }}
      zIndex={20}
      transform={{ 
        base: mobileMenuOpen ? "translateX(0)" : "translateX(-100%)", 
        lg: "translateX(0)" 
      }}
      transition="transform 0.3s ease"
      borderRightWidth="1px"
      borderColor={useColorModeValue('neutral.200', 'neutral.700')}
      overflowY="auto"
      pt={6}
      pb={4}
    >
      <Flex direction="column" h="100%">
        <VStack spacing={1} align="stretch" flex={1} px={2}>
          {menuItems.map((item) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              isActive={activePage === item.id}
              onClick={() => setActivePage(item.id)}
            >
              {item.name}
            </NavItem>
          ))}
        </VStack>
        
        <Divider my={4} />
        
        <Box px={4}>
          <NavItem icon={Question} isActive={activePage === 'help'} onClick={() => setActivePage('help')}>
            Help & Support
          </NavItem>
        </Box>
      </Flex>
    </Box>
  );
};

interface NavItemProps {
  icon: React.ComponentType;
  children: React.ReactNode;
  isActive?: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, children, isActive = false, onClick }) => {
  const activeColor = useColorModeValue('brand.500', 'brand.400');
  const activeBg = useColorModeValue('brand.50', 'brand.900');
  const hoverBg = useColorModeValue('neutral.100', 'neutral.700');
  
  return (
    <MotionBox
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2 }}
    >
      <Flex
        align="center"
        py={3}
        px={4}
        my={1}
        borderRadius="lg"
        role="group"
        cursor="pointer"
        fontWeight={isActive ? "600" : "normal"}
        color={isActive ? activeColor : undefined}
        bg={isActive ? activeBg : undefined}
        _hover={{ bg: !isActive ? hoverBg : undefined }}
        transition="all 0.2s"
        onClick={onClick}
      >
        <Icon
          as={icon}
          mr={4}
          boxSize={5}
          color={isActive ? activeColor : undefined}
        />
        <Text fontSize="sm" fontWeight="medium">{children}</Text>
      </Flex>
    </MotionBox>
  );
};

export default Sidebar; 