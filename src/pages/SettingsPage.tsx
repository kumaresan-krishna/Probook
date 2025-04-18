import React, { useState } from 'react';
import {
  Box, Flex, Heading, Text, Button, Tabs, TabList, Tab, TabPanels, 
  TabPanel, FormControl, FormLabel, Input, Switch, Select, Avatar,
  VStack, HStack, Divider, useColorMode, useColorModeValue,
  SimpleGrid, Icon, useToast, Tooltip
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  User, Bell, Gear, Moon, Sun, BookOpen, ClockCounterClockwise,
  Envelope, Lock, SignOut, Upload, Check, X, Globe, Bell as BellIcon
} from 'phosphor-react';

const MotionBox = motion(Box);

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

const SettingsPage: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();
  const [tabIndex, setTabIndex] = useState(0);
  
  // Theme colors
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const mutedText = useColorModeValue('gray.600', 'gray.400');
  
  // Mock user data
  const [userData, setUserData] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    bio: 'Avid reader, coffee enthusiast, and software developer. I love exploring new worlds through books.',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8cGVvcGxlfHx8fHx8MTY4NDMwMzQzMg&ixlib=rb-4.0.3&q=80&w=300',
  });
  
  // Mock reading preferences
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    achievementAlerts: true,
    friendActivity: true,
    challengeReminders: true,
    defaultPrivacy: 'friends',
    theme: colorMode,
    fontSize: 'medium',
    readingGoal: '50',
  });
  
  const handleUserDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };
  
  const handlePreferenceChange = (name: string, value: any) => {
    setPreferences({
      ...preferences,
      [name]: value
    });
  };
  
  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    handlePreferenceChange(name, checked);
  };
  
  const handleSaveProfile = () => {
    toast({
      title: 'Profile updated',
      description: 'Your profile information has been updated successfully.',
      status: 'success',
      duration: 5000,
      isClosable: true,
      position: 'top-right',
    });
  };
  
  const handleSavePreferences = () => {
    toast({
      title: 'Preferences updated',
      description: 'Your reading preferences have been updated successfully.',
      status: 'success',
      duration: 5000,
      isClosable: true,
      position: 'top-right',
    });
  };
  
  const handleDeleteAccount = () => {
    toast({
      title: 'Account deletion requested',
      description: 'We\'ve sent you an email with further instructions.',
      status: 'info',
      duration: 5000,
      isClosable: true,
      position: 'top-right',
    });
  };
  
  return (
    <MotionBox
      as="section"
      maxW="1200px"
      mx="auto"
      pb={8}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Heading mb={6} size="xl">Settings</Heading>
      
      <Box
        bg={cardBg}
        borderRadius="xl"
        boxShadow="sm"
        overflow="hidden"
      >
        <Tabs 
          isFitted 
          colorScheme="brand"
          onChange={(index) => setTabIndex(index)}
          isLazy
        >
          <TabList>
            <Tab>
              <HStack spacing={2}>
                <Icon as={User} weight="bold" />
                <Text>Profile</Text>
              </HStack>
            </Tab>
            <Tab>
              <HStack spacing={2}>
                <Icon as={Bell} weight="bold" />
                <Text>Notifications</Text>
              </HStack>
            </Tab>
            <Tab>
              <HStack spacing={2}>
                <Icon as={BookOpen} weight="bold" />
                <Text>Reading</Text>
              </HStack>
            </Tab>
            <Tab>
              <HStack spacing={2}>
                <Icon as={Gear} weight="bold" />
                <Text>Account</Text>
              </HStack>
            </Tab>
          </TabList>
          
          <TabPanels>
            {/* Profile Tab */}
            <TabPanel p={6}>
              <MotionBox
                variants={itemVariants}
              >
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
                  {/* Profile Photo Section */}
                  <VStack spacing={4} align="center">
                    <Avatar 
                      size="2xl" 
                      src={userData.profileImage}
                      name={userData.name}
                      border="4px solid"
                      borderColor={borderColor}
                    />
                    <Button leftIcon={<Upload weight="bold" />} colorScheme="brand" size="sm">
                      Upload Photo
                    </Button>
                    <Text fontSize="sm" color={mutedText} textAlign="center">
                      JPEG, PNG or GIF. Maximum 2MB.
                    </Text>
                  </VStack>
                  
                  {/* Profile Info Section */}
                  <VStack spacing={6} align="stretch" gridColumn={{ md: "2 / span 2" }}>
                    <FormControl>
                      <FormLabel fontWeight="medium">Display Name</FormLabel>
                      <Input 
                        name="name"
                        value={userData.name}
                        onChange={handleUserDataChange}
                      />
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel fontWeight="medium">Email</FormLabel>
                      <Input 
                        name="email"
                        value={userData.email}
                        onChange={handleUserDataChange}
                        type="email"
                      />
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel fontWeight="medium">Bio</FormLabel>
                      <Input 
                        name="bio"
                        value={userData.bio}
                        onChange={handleUserDataChange}
                        as="textarea"
                        minH="100px"
                      />
                      <Text fontSize="sm" color={mutedText} mt={1}>
                        Tell others a bit about yourself and your reading preferences.
                      </Text>
                    </FormControl>
                    
                    <Box pt={4}>
                      <Button colorScheme="brand" onClick={handleSaveProfile}>
                        Save Changes
                      </Button>
                    </Box>
                  </VStack>
                </SimpleGrid>
              </MotionBox>
            </TabPanel>
            
            {/* Notifications Tab */}
            <TabPanel p={6}>
              <MotionBox
                variants={itemVariants}
              >
                <VStack align="stretch" spacing={6}>
                  <Heading size="md" mb={2}>Notification Preferences</Heading>

                  <Box>
                    <Heading size="sm" mb={4}>Email Notifications</Heading>
                    <VStack align="stretch" spacing={4} pl={2}>
                      <Flex justify="space-between" align="center">
                        <Box>
                          <Text>Email Notifications</Text>
                          <Text fontSize="sm" color={mutedText}>
                            Receive emails about activity, comments, etc
                          </Text>
                        </Box>
                        <Switch 
                          colorScheme="brand" 
                          isChecked={preferences.emailNotifications}
                          name="emailNotifications"
                          onChange={handleSwitchChange}
                        />
                      </Flex>
                      
                      <Flex justify="space-between" align="center">
                        <Box>
                          <Text>Weekly Digest</Text>
                          <Text fontSize="sm" color={mutedText}>
                            Get a weekly summary of your reading activity
                          </Text>
                        </Box>
                        <Switch 
                          colorScheme="brand" 
                          isChecked={preferences.weeklyDigest}
                          name="weeklyDigest"
                          onChange={handleSwitchChange}
                        />
                      </Flex>
                    </VStack>
                  </Box>
                  
                  <Divider />
                  
                  <Box>
                    <Heading size="sm" mb={4}>Push Notifications</Heading>
                    <VStack align="stretch" spacing={4} pl={2}>
                      <Flex justify="space-between" align="center">
                        <Box>
                          <Text>Push Notifications</Text>
                          <Text fontSize="sm" color={mutedText}>
                            Receive notifications in your browser
                          </Text>
                        </Box>
                        <Switch 
                          colorScheme="brand" 
                          isChecked={preferences.pushNotifications}
                          name="pushNotifications"
                          onChange={handleSwitchChange}
                        />
                      </Flex>
                      
                      <Flex justify="space-between" align="center">
                        <Box>
                          <Text>Achievement Alerts</Text>
                          <Text fontSize="sm" color={mutedText}>
                            Get notified when you earn badges or achievements
                          </Text>
                        </Box>
                        <Switch 
                          colorScheme="brand" 
                          isChecked={preferences.achievementAlerts}
                          name="achievementAlerts"
                          onChange={handleSwitchChange}
                        />
                      </Flex>
                      
                      <Flex justify="space-between" align="center">
                        <Box>
                          <Text>Friend Activity</Text>
                          <Text fontSize="sm" color={mutedText}>
                            Get notified about your friends' reading activity
                          </Text>
                        </Box>
                        <Switch 
                          colorScheme="brand" 
                          isChecked={preferences.friendActivity}
                          name="friendActivity"
                          onChange={handleSwitchChange}
                        />
                      </Flex>
                      
                      <Flex justify="space-between" align="center">
                        <Box>
                          <Text>Challenge Reminders</Text>
                          <Text fontSize="sm" color={mutedText}>
                            Get reminders about upcoming and ongoing challenges
                          </Text>
                        </Box>
                        <Switch 
                          colorScheme="brand" 
                          isChecked={preferences.challengeReminders}
                          name="challengeReminders"
                          onChange={handleSwitchChange}
                        />
                      </Flex>
                    </VStack>
                  </Box>
                  
                  <Box pt={4}>
                    <Button colorScheme="brand" onClick={handleSavePreferences}>
                      Save Notification Settings
                    </Button>
                  </Box>
                </VStack>
              </MotionBox>
            </TabPanel>
            
            {/* Reading Tab */}
            <TabPanel p={6}>
              <MotionBox
                variants={itemVariants}
              >
                <VStack align="stretch" spacing={6}>
                  <Heading size="md" mb={2}>Reading Preferences</Heading>
                  
                  <FormControl>
                    <FormLabel fontWeight="medium">Annual Reading Goal</FormLabel>
                    <HStack maxW="300px">
                      <Input 
                        type="number" 
                        value={preferences.readingGoal}
                        onChange={(e) => handlePreferenceChange('readingGoal', e.target.value)}
                      />
                      <Text>books</Text>
                    </HStack>
                    <Text fontSize="sm" color={mutedText} mt={1}>
                      Set your reading goal for the year
                    </Text>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel fontWeight="medium">Default Book Privacy</FormLabel>
                    <Select 
                      maxW="300px"
                      value={preferences.defaultPrivacy}
                      onChange={(e) => handlePreferenceChange('defaultPrivacy', e.target.value)}
                    >
                      <option value="public">Public - Everyone can see</option>
                      <option value="friends">Friends - Only friends can see</option>
                      <option value="private">Private - Only you can see</option>
                    </Select>
                    <Text fontSize="sm" color={mutedText} mt={1}>
                      Choose who can see your reading activity by default
                    </Text>
                  </FormControl>
                  
                  <Divider />
                  
                  <Box>
                    <Heading size="sm" mb={4}>Display Settings</Heading>
                    
                    <Flex justify="space-between" align="center" mb={4}>
                      <Box>
                        <Text>Theme</Text>
                        <Text fontSize="sm" color={mutedText}>
                          Choose between light and dark mode
                        </Text>
                      </Box>
                      <Button
                        leftIcon={colorMode === 'dark' ? <Moon weight="fill" /> : <Sun weight="fill" />}
                        onClick={toggleColorMode}
                        size="sm"
                      >
                        {colorMode === 'dark' ? 'Dark Mode' : 'Light Mode'}
                      </Button>
                    </Flex>
                    
                    <FormControl>
                      <FormLabel fontWeight="medium">Font Size</FormLabel>
                      <Select 
                        maxW="300px"
                        value={preferences.fontSize}
                        onChange={(e) => handlePreferenceChange('fontSize', e.target.value)}
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </Select>
                    </FormControl>
                  </Box>
                  
                  <Box pt={4}>
                    <Button colorScheme="brand" onClick={handleSavePreferences}>
                      Save Reading Preferences
                    </Button>
                  </Box>
                </VStack>
              </MotionBox>
            </TabPanel>
            
            {/* Account Tab */}
            <TabPanel p={6}>
              <MotionBox
                variants={itemVariants}
              >
                <VStack align="stretch" spacing={8}>
                  <Box>
                    <Heading size="md" mb={4}>Account Management</Heading>
                    
                    <VStack spacing={4} align="stretch">
                      <Flex 
                        p={4} 
                        borderRadius="md" 
                        bg={useColorModeValue('gray.50', 'gray.700')}
                        justify="space-between"
                        align="center"
                      >
                        <HStack>
                          <Icon as={Envelope} boxSize={5} />
                          <Box>
                            <Text fontWeight="medium">Change Email</Text>
                            <Text fontSize="sm" color={mutedText}>
                              Update your email address
                            </Text>
                          </Box>
                        </HStack>
                        <Button size="sm" variant="outline">
                          Change
                        </Button>
                      </Flex>
                      
                      <Flex 
                        p={4} 
                        borderRadius="md" 
                        bg={useColorModeValue('gray.50', 'gray.700')}
                        justify="space-between"
                        align="center"
                      >
                        <HStack>
                          <Icon as={Lock} boxSize={5} />
                          <Box>
                            <Text fontWeight="medium">Change Password</Text>
                            <Text fontSize="sm" color={mutedText}>
                              Update your security credentials
                            </Text>
                          </Box>
                        </HStack>
                        <Button size="sm" variant="outline">
                          Change
                        </Button>
                      </Flex>

                      <Flex 
                        p={4} 
                        borderRadius="md" 
                        bg={useColorModeValue('gray.50', 'gray.700')}
                        justify="space-between"
                        align="center"
                      >
                        <HStack>
                          <Icon as={Globe} boxSize={5} />
                          <Box>
                            <Text fontWeight="medium">Language & Region</Text>
                            <Text fontSize="sm" color={mutedText}>
                              Set your preferred language and region
                            </Text>
                          </Box>
                        </HStack>
                        <Button size="sm" variant="outline">
                          Change
                        </Button>
                      </Flex>
                      
                      <Flex 
                        p={4} 
                        borderRadius="md" 
                        bg={useColorModeValue('gray.50', 'gray.700')}
                        justify="space-between"
                        align="center"
                      >
                        <HStack>
                          <Icon as={ClockCounterClockwise} boxSize={5} />
                          <Box>
                            <Text fontWeight="medium">Export Data</Text>
                            <Text fontSize="sm" color={mutedText}>
                              Download a copy of your reading history and data
                            </Text>
                          </Box>
                        </HStack>
                        <Button size="sm" variant="outline">
                          Export
                        </Button>
                      </Flex>
                    </VStack>
                  </Box>
                  
                  <Divider />

                  <Box>
                    <Heading size="md" mb={4} color="red.500">Danger Zone</Heading>
                    
                    <Box 
                      p={6} 
                      borderRadius="md" 
                      borderWidth="1px" 
                      borderColor="red.300"
                      bg={useColorModeValue('red.50', 'rgba(200, 30, 30, 0.1)')}
                    >
                      <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                        <Box>
                          <Text fontWeight="medium" color="red.500">Delete Account</Text>
                          <Text fontSize="sm">
                            Permanently delete your account and all your data
                          </Text>
                        </Box>
                        <Button 
                          colorScheme="red" 
                          leftIcon={<SignOut weight="bold" />}
                          onClick={handleDeleteAccount}
                        >
                          Delete Account
                        </Button>
                      </Flex>
                    </Box>
                  </Box>
                </VStack>
              </MotionBox>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </MotionBox>
  );
};

export default SettingsPage; 