import { extendTheme } from '@chakra-ui/react';

const colors = {
  brand: {
    50: '#E3E8FF',
    100: '#C7D0FF',
    200: '#A5B4FF',
    300: '#8293FF',
    400: '#5C6EFF', // Primary blue
    500: '#3D52F4',
    600: '#2339DC',
    700: '#1A2EB3',
    800: '#12228A',
    900: '#0A1761',
  },
  accent: {
    50: '#FFEEF2',
    100: '#FFD2DB',
    200: '#FFADBF',
    300: '#FF879F',
    400: '#FF527A', // Secondary accent
    500: '#F03358',
    600: '#D91E45',
    700: '#B01235',
    800: '#8A0C29',
    900: '#65051D',
  },
  neutral: {
    50: '#F7F9FC',
    100: '#EDF1F7',
    200: '#E4E9F2',
    300: '#C5CEE0',
    400: '#8F9BB3',
    500: '#5F698A',
    600: '#2E3A59',
    700: '#222B45',
    800: '#192038',
    900: '#151A30',
  },
  success: {
    500: '#00B383',
  },
  warning: {
    500: '#FFAA00',
  },
  error: {
    500: '#FF3D71',
  },
};

const fonts = {
  heading: '"Inter", system-ui, sans-serif',
  body: '"Inter", system-ui, sans-serif',
};

const components = {
  Button: {
    baseStyle: {
      fontWeight: 600,
      borderRadius: 'md',
      lineHeight: '1',
      height: 'auto',
      py: '3',
    },
    variants: {
      solid: (props: { colorScheme: string }) => ({
        bg: props.colorScheme === 'brand' ? 'brand.400' : undefined,
        _hover: {
          bg: props.colorScheme === 'brand' ? 'brand.500' : undefined,
          transform: 'translateY(-1px)',
          boxShadow: 'md',
        },
        transition: 'all 0.2s',
      }),
      ghost: {
        _hover: {
          bg: 'rgba(0,0,0,0.05)',
        },
      },
    },
  },
  Card: {
    baseStyle: {
      container: {
        borderRadius: 'xl',
        boxShadow: 'lg',
        overflow: 'hidden',
        bg: 'white',
        transition: 'all 0.3s ease',
        _hover: {
          transform: 'translateY(-4px)',
          boxShadow: 'xl',
        },
      },
    },
  },
  Heading: {
    baseStyle: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
  },
  Input: {
    baseStyle: {
      field: {
        borderRadius: 'md',
      },
    },
    variants: {
      filled: {
        field: {
          backgroundColor: 'neutral.100',
          _hover: {
            backgroundColor: 'neutral.200',
          },
          _focus: {
            backgroundColor: 'white',
            borderColor: 'brand.400',
          },
        },
      },
    },
    defaultProps: {
      variant: 'filled',
    },
  },
};

export const theme = extendTheme({ 
  colors, 
  fonts, 
  components,
  styles: {
    global: {
      body: {
        bg: 'neutral.50',
      },
    },
  },
}); 