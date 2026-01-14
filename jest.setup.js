// Define global __DEV__ for React Native
global.__DEV__ = true;

require('@testing-library/jest-native/extend-expect');

// Mock expo-av - make sure the sound object has all methods
jest.mock('expo-av', () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn(() => Promise.resolve({
        sound: {
          playAsync: jest.fn(),
          stopAsync: jest.fn(),
          unloadAsync: jest.fn(),
          setIsLoopingAsync: jest.fn(),
          setVolumeAsync: jest.fn(),
        }
      })),
    },
    setAudioModeAsync: jest.fn(() => Promise.resolve()),
  },
}));

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

// Mock expo-status-bar
jest.mock('expo-status-bar', () => ({
  StatusBar: () => null,
}));

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }) => children,
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const { View, Text, Pressable } = require('react-native');
  const Animated = {
    View,
    Text,
    createAnimatedComponent: (component) => component,
  };
  return {
    default: Animated,
    ...Animated,
    useSharedValue: (initialValue) => ({ value: initialValue }),
    useAnimatedStyle: () => ({}),
    withSpring: (value) => value,
    withTiming: (value) => value,
    withRepeat: (value) => value,
    withSequence: (...values) => values[0],
    interpolateColor: () => 'transparent',
    Easing: { inOut: () => {}, ease: {} },
    createAnimatedComponent: (component) => component,
  };
});

// Mock @react-navigation
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }) => children,
  useNavigation: () => ({ navigate: jest.fn() }),
  useRoute: () => ({ params: {} }),
}));

jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({ children }) => children,
    Screen: () => null,
  }),
}));
