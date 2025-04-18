import React from 'react';
import { 
  Box, Flex, IconButton, Input, InputGroup, InputLeftElement, 
  HStack, Avatar, Menu, MenuButton, MenuList, MenuItem,
  useColorModeValue, Heading, useBreakpointValue
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlass, Bell, UserCircle, SignOut, Gear,
  List
} from 'phosphor-react';

const MotionFlex = motion(Flex);

interface NavbarProps {
  onToggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const bgColor = useColorModeValue('white', 'neutral.800');
  const borderColor = useColorModeValue('neutral.200', 'neutral.700');
  const showSearch = useBreakpointValue({ base: false, md: true });
  
  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      w="100%"
      px={4}
      py={3}
      bg={bgColor}
      borderBottomWidth="1px"
      borderColor={borderColor}
      boxShadow="sm"
    >
      <HStack spacing={4}>
        <IconButton
          display={{ base: 'flex', lg: 'none' }}
          onClick={onToggleSidebar}
          variant="ghost"
          aria-label="Toggle navigation"
          icon={<List weight="bold" size={24} />}
        />
        
        <Heading 
          size="md" 
          fontWeight="black" 
          bgGradient="linear(to-r, brand.400, brand.600)"
          bgClip="text"
        >
          BOOKLE
        </Heading>
      </HStack>
      
      {showSearch && (
        <InputGroup maxW="400px" mx={{ base: 0, lg: 8 }}>
          <InputLeftElement pointerEvents="none">
            <MagnifyingGlass weight="bold" />
          </InputLeftElement>
          <Input 
            placeholder="Search books, authors, or topics..." 
            borderRadius="full"
            bg="neutral.100"
          />
        </InputGroup>
      )}
      
      <HStack spacing={3}>
        <MotionFlex
          justify="center"
          align="center"
          position="relative"
          p={2}
          borderRadius="full"
          cursor="pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Bell weight="fill" size={22} />
          <Box
            position="absolute"
            top={1}
            right={1}
            w={2}
            h={2}
            bg="accent.500"
            borderRadius="full"
          />
        </MotionFlex>
        
        <Menu>
          <MenuButton
            as={Avatar}
            size="sm"
            cursor="pointer"
            src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
            _hover={{ 
              transform: 'scale(1.05)',
              boxShadow: 'md'
            }}
            transition="all 0.2s"
          />
          <MenuList shadow="lg" p={1}>
            <MenuItem icon={<UserCircle weight="fill" size={18} />}>
              Profile
            </MenuItem>
            <MenuItem icon={<Gear weight="fill" size={18} />}>
              Settings
            </MenuItem>
            <MenuItem icon={<SignOut weight="fill" size={18} />} color="red.500">
              Sign out
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Flex>
  );
};

export default Navbar; 