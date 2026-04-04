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
          getStatusAsync: jest.fn(() => Promise.resolve({ isLoaded: true })),
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

// Mock expo-blur
jest.mock('expo-blur', () => ({
  BlurView: ({ children }) => children,
}));

// Mock lucide-react-native
jest.mock('lucide-react-native', () => {
  const React = require('react');
  const createMockIcon = () => (props) => React.createElement('View', props);
  return {
    // Technique icons
    Wind: createMockIcon(),
    Volume2: createMockIcon(),
    BrainCircuit: createMockIcon(),
    PersonStanding: createMockIcon(),
    Mountain: createMockIcon(),
    // Navigation
    Home: createMockIcon(),
    TrendingUp: createMockIcon(),
    Settings: createMockIcon(),
    MapPin: createMockIcon(),
    // Restroom finder
    Accessibility: createMockIcon(),
    DoorOpen: createMockIcon(),
    Crosshair: createMockIcon(),
    RefreshCw: createMockIcon(),
    // Audio masking
    Radio: createMockIcon(),
    Waves: createMockIcon(),
    CloudLightning: createMockIcon(),
    TreePine: createMockIcon(),
    Bird: createMockIcon(),
    Bug: createMockIcon(),
    Leaf: createMockIcon(),
    // Visualization scenes
    Star: createMockIcon(),
    // UI elements
    X: createMockIcon(),
    ChevronRight: createMockIcon(),
    ChevronDown: createMockIcon(),
    Check: createMockIcon(),
    VolumeX: createMockIcon(),
    Play: createMockIcon(),
    Pause: createMockIcon(),
    Moon: createMockIcon(),
    Sun: createMockIcon(),
    Bell: createMockIcon(),
    Clock: createMockIcon(),
    // Legacy (kept for compatibility)
    Brain: createMockIcon(),
    Sparkles: createMockIcon(),
    Eye: createMockIcon(),
    BarChart3: createMockIcon(),
    LucideIcon: () => null,
  };
});

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
    FadeIn: { delay: () => ({}) },
    SlideInDown: { springify: () => ({ damping: () => ({ stiffness: () => ({}) }) }) },
    SlideOutDown: { duration: () => ({}) },
  };
});

// Mock expo-location
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted' })
  ),
  getCurrentPositionAsync: jest.fn(() =>
    Promise.resolve({
      coords: { latitude: 37.7749, longitude: -122.4194 },
    })
  ),
  Accuracy: {
    Balanced: 3,
    High: 4,
    Highest: 5,
    Low: 2,
    Lowest: 1,
  },
}));

// Mock react-native-maps
jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MockMapView = React.forwardRef((props, ref) => {
    React.useImperativeHandle(ref, () => ({
      animateToRegion: jest.fn(),
    }));
    return React.createElement(View, { testID: 'map-view', ...props }, props.children);
  });
  MockMapView.displayName = 'MapView';
  const MockMarker = (props) =>
    React.createElement(View, { testID: 'map-marker', ...props }, props.children);
  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
    PROVIDER_GOOGLE: 'google',
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
