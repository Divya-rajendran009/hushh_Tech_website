// src/components/MobileBottomNav.tsx
// Mobile bottom navigation with 4 tabs matching the exact design reference
// Active tab has blue circular background behind icon

import React from 'react';
import { Box, Flex, Text, Icon } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiTrendingUp, FiUsers, FiUser } from 'react-icons/fi';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  matchPaths?: string[]; // Additional paths that should highlight this tab
}

const navItems: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: FiHome,
    path: '/',
    matchPaths: ['/our-philosophy'],
  },
  {
    id: 'fund',
    label: 'Fund A',
    icon: FiTrendingUp,
    path: '/discover-fund-a',
    matchPaths: ['/sell-the-wall', '/ai-powered-berkshire'],
  },
  {
    id: 'community',
    label: 'Community',
    icon: FiUsers,
    path: '/community',
    matchPaths: [],
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: FiUser,
    path: '/hushh-user-profile',
    matchPaths: ['/contact', '/faq'],
  },
];

// Pages where bottom nav should be hidden
const hiddenOnPages = [
  '/onboarding',
  '/login',
  '/signup',
  '/auth',
  '/kyc-flow',
  '/kyc-demo',
  '/a2a-playground',
  '/hushh-user-profile', // Hide nav on profile page for better UX (like onboarding)
];

const MobileBottomNav: React.FC = () => {
  const location = useLocation();

  // Check if current page should hide the nav
  const shouldHideNav = hiddenOnPages.some(page => 
    location.pathname.toLowerCase().startsWith(page.toLowerCase())
  );

  // Check if we're on a full-screen community post
  const isFullScreenPost = location.pathname.startsWith('/community/') && 
    location.pathname !== '/community';

  if (shouldHideNav || isFullScreenPost) {
    return null;
  }

  // Check if a nav item is active
  const isActive = (item: NavItem): boolean => {
    if (location.pathname === item.path) return true;
    if (item.matchPaths?.some(p => location.pathname.startsWith(p))) return true;
    // Special case for community - match any /community path
    if (item.id === 'community' && location.pathname.startsWith('/community')) return true;
    return false;
  };

  return (
    <Box
      as="nav"
      aria-label="Primary mobile navigation"
      display={{ base: 'block', md: 'none' }}
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      zIndex="40"
      bg="#F8F9FA"
      borderTop="1px solid"
      borderColor="#E5E7EB"
      pb="env(safe-area-inset-bottom)"
    >
      <Flex
        as="ul"
        justify="space-around"
        align="center"
        h="85px"
        maxW="448px"
        mx="auto"
        px="2"
        m="0"
        listStyleType="none"
      >
        {navItems.map((item) => {
          const active = isActive(item);
          return (
            <Box
              as="li"
              key={item.id}
              flex="1"
              h="100%"
            >
              <Flex
                as={Link}
                to={item.path}
                direction="column"
                align="center"
                justify="center"
                gap="1"
                p="2"
                w="100%"
                h="100%"
                cursor="pointer"
                transition="all 0.2s ease"
                textDecoration="none"
                bg="transparent"
                fontFamily="inherit"
                _active={{ transform: 'scale(0.95)' }}
              >
                {/* Icon Container - Blue circle when active */}
                <Flex
                  as="span"
                  align="center"
                  justify="center"
                  w="48px"
                  h="48px"
                  borderRadius="full"
                  bg={active ? '#E8F0FE' : 'transparent'}
                  transition="all 0.2s ease"
                >
                  <Icon
                    as={item.icon}
                    boxSize={6}
                    color={active ? '#2F80ED' : '#9CA3AF'}
                    strokeWidth={active ? 2.5 : 2}
                    transition="all 0.2s ease"
                  />
                </Flex>

                {/* Label */}
                <Text
                  as="span"
                  fontSize="11px"
                  fontWeight={active ? '600' : '500'}
                  color={active ? '#2F80ED' : '#9CA3AF'}
                  letterSpacing="0.01em"
                  transition="all 0.2s ease"
                  mt="-2px"
                >
                  {item.label}
                </Text>
              </Flex>
            </Box>
          );
        })}
      </Flex>
    </Box>
  );
};

export default MobileBottomNav;
