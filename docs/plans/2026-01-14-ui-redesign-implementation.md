# ReliefKey UI Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform ReliefKey into a polished, nature-inspired wellness app with settings and rich animations.

**Architecture:** Theme system provides design tokens, reusable UI components build on theme, navigation wraps screens, each screen uses components with Reanimated for animations.

**Tech Stack:** React Native, Expo, react-native-reanimated, expo-linear-gradient, @react-navigation/bottom-tabs

---

## Phase 1: Foundation

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install navigation and animation packages**

Run:
```bash
npx expo install react-native-reanimated expo-linear-gradient @react-navigation/native @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context
```

**Step 2: Verify installation**

Run: `npm ls react-native-reanimated expo-linear-gradient @react-navigation/native`
Expected: All packages listed without errors

**Step 3: Update babel.config.js for reanimated**

Modify `babel.config.js`:
```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
  };
};
```

**Step 4: Commit**

```bash
git add package.json package-lock.json babel.config.js
git commit -m "chore: add navigation and animation dependencies"
```

---

### Task 2: Create Theme System

**Files:**
- Create: `src/theme/colors.ts`
- Create: `src/theme/spacing.ts`
- Create: `src/theme/typography.ts`
- Create: `src/theme/index.ts`

**Step 1: Create colors.ts**

```typescript
export const colors = {
  // Backgrounds
  background: {
    primary: '#1a2e1a',
    secondary: '#2d4a3e',
    surface: 'rgba(62, 92, 78, 0.6)',
    surfaceSolid: '#3e5c4e',
  },
  // Accents
  accent: {
    warm: '#d4a574',
    warmLight: '#e8c9a0',
    calm: '#7eb8c9',
    calmLight: '#a8d4e0',
  },
  // Text
  text: {
    primary: '#f5f2eb',
    secondary: '#a8b5a0',
    muted: '#6b7a65',
  },
  // Semantic
  success: '#7cb87c',
  error: '#c97e7e',
  // Gradients
  gradients: {
    forest: ['#1a2e1a', '#2d4a3e', '#3e5c4e'],
    sky: ['#2d4a3e', '#3e5c4e', '#4a7a6a'],
    warmGlow: ['#d4a574', '#e8c9a0'],
  },
} as const;

export type Colors = typeof colors;
```

**Step 2: Create spacing.ts**

```typescript
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
```

**Step 3: Create typography.ts**

```typescript
import { TextStyle } from 'react-native';

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 0.5,
  } as TextStyle,
  h2: {
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 0.3,
  } as TextStyle,
  h3: {
    fontSize: 20,
    fontWeight: '600',
  } as TextStyle,
  body: {
    fontSize: 16,
    fontWeight: '400',
  } as TextStyle,
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
  } as TextStyle,
  caption: {
    fontSize: 12,
    fontWeight: '400',
  } as TextStyle,
  button: {
    fontSize: 18,
    fontWeight: '600',
  } as TextStyle,
} as const;

export type Typography = typeof typography;
```

**Step 4: Create index.ts**

```typescript
export { colors } from './colors';
export { spacing, borderRadius } from './spacing';
export { typography } from './typography';

export const theme = {
  colors: require('./colors').colors,
  spacing: require('./spacing').spacing,
  borderRadius: require('./spacing').borderRadius,
  typography: require('./typography').typography,
};

export type Theme = typeof theme;
```

**Step 5: Commit**

```bash
git add src/theme/
git commit -m "feat: add theme system with colors, spacing, typography"
```

---

### Task 3: Create GradientBackground Component

**Files:**
- Create: `src/components/ui/GradientBackground.tsx`

**Step 1: Create the component**

```typescript
import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme';

interface GradientBackgroundProps {
  children: React.ReactNode;
  variant?: 'forest' | 'sky';
  style?: ViewStyle;
}

export function GradientBackground({
  children,
  variant = 'forest',
  style,
}: GradientBackgroundProps) {
  const gradientColors = colors.gradients[variant];

  return (
    <LinearGradient
      colors={gradientColors}
      style={[styles.container, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

**Step 2: Commit**

```bash
git add src/components/ui/
git commit -m "feat: add GradientBackground component"
```

---

### Task 4: Create Card Component

**Files:**
- Create: `src/components/ui/Card.tsx`

**Step 1: Create the component**

```typescript
import React from 'react';
import {
  StyleSheet,
  View,
  ViewStyle,
  Pressable,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { colors, borderRadius, spacing } from '../../theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'default' | 'elevated';
}

export function Card({ children, onPress, style, variant = 'default' }: CardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const content = (
    <View style={[styles.card, variant === 'elevated' && styles.elevated, style]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={animatedStyle}
      >
        {content}
      </AnimatedPressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
});
```

**Step 2: Commit**

```bash
git add src/components/ui/Card.tsx
git commit -m "feat: add Card component with press animation"
```

---

### Task 5: Create Button Component

**Files:**
- Create: `src/components/ui/Button.tsx`

**Step 1: Create the component**

```typescript
import React from 'react';
import {
  StyleSheet,
  Text,
  Pressable,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import { colors, borderRadius, spacing, typography } from '../../theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  style,
  textStyle,
  disabled = false,
}: ButtonProps) {
  const scale = useSharedValue(1);
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = variant === 'primary'
      ? interpolateColor(
          pressed.value,
          [0, 1],
          [colors.accent.warm, colors.accent.warmLight]
        )
      : variant === 'secondary'
      ? interpolateColor(
          pressed.value,
          [0, 1],
          [colors.background.surfaceSolid, colors.background.secondary]
        )
      : 'transparent';

    return {
      transform: [{ scale: scale.value }],
      backgroundColor,
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
    pressed.value = withSpring(1);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    pressed.value = withSpring(0);
  };

  const sizeStyles = {
    sm: styles.sizeSm,
    md: styles.sizeMd,
    lg: styles.sizeLg,
  };

  const textSizeStyles = {
    sm: styles.textSm,
    md: styles.textMd,
    lg: styles.textLg,
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        styles.button,
        sizeStyles[size],
        variant === 'ghost' && styles.ghost,
        disabled && styles.disabled,
        animatedStyle,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          textSizeStyles[size],
          variant === 'ghost' && styles.ghostText,
          disabled && styles.disabledText,
          textStyle,
        ]}
      >
        {title}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeSm: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  sizeMd: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  sizeLg: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: colors.text.primary,
    fontWeight: '600',
  },
  textSm: {
    fontSize: 14,
  },
  textMd: {
    fontSize: 16,
  },
  textLg: {
    fontSize: 18,
  },
  ghostText: {
    color: colors.accent.warm,
  },
  disabledText: {
    color: colors.text.muted,
  },
});
```

**Step 2: Commit**

```bash
git add src/components/ui/Button.tsx
git commit -m "feat: add Button component with variants and animations"
```

---

### Task 6: Create UI Components Index

**Files:**
- Create: `src/components/ui/index.ts`

**Step 1: Create the index**

```typescript
export { GradientBackground } from './GradientBackground';
export { Card } from './Card';
export { Button } from './Button';
```

**Step 2: Commit**

```bash
git add src/components/ui/index.ts
git commit -m "feat: add UI components index"
```

---

## Phase 2: Navigation

### Task 7: Set Up Navigation Structure

**Files:**
- Create: `src/navigation/BottomTabNavigator.tsx`
- Create: `src/navigation/index.tsx`
- Create: `src/screens/SettingsScreen.tsx`
- Create: `src/screens/ProgressScreen.tsx`

**Step 1: Create placeholder SettingsScreen**

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GradientBackground } from '../components/ui';
import { colors, typography, spacing } from '../theme';

export function SettingsScreen() {
  return (
    <GradientBackground>
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Coming soon</Text>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
});
```

**Step 2: Create placeholder ProgressScreen**

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GradientBackground } from '../components/ui';
import { colors, typography, spacing } from '../theme';

export function ProgressScreen() {
  return (
    <GradientBackground>
      <View style={styles.container}>
        <Text style={styles.title}>Progress</Text>
        <Text style={styles.subtitle}>Coming soon</Text>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
});
```

**Step 3: Create BottomTabNavigator**

```typescript
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { ProgressScreen } from '../screens/ProgressScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { colors, spacing } from '../theme';

const Tab = createBottomTabNavigator();

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Home: '🏠',
    Progress: '📊',
    Settings: '⚙️',
  };

  return (
    <View style={styles.iconContainer}>
      <Text style={[styles.icon, focused && styles.iconFocused]}>
        {icons[name]}
      </Text>
      {focused && <View style={styles.indicator} />}
    </View>
  );
}

export function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabLabel,
        tabBarActiveTintColor: colors.accent.warm,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarIcon: ({ focused }) => (
          <TabIcon name={route.name} focused={focused} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.background.primary,
    borderTopWidth: 0,
    height: 80,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  iconContainer: {
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    opacity: 0.6,
  },
  iconFocused: {
    opacity: 1,
  },
  indicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accent.warm,
    marginTop: 4,
  },
});
```

**Step 4: Create navigation index**

```typescript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { BottomTabNavigator } from './BottomTabNavigator';

export function Navigation() {
  return (
    <NavigationContainer>
      <BottomTabNavigator />
    </NavigationContainer>
  );
}

export { BottomTabNavigator };
```

**Step 5: Commit**

```bash
git add src/navigation/ src/screens/SettingsScreen.tsx src/screens/ProgressScreen.tsx
git commit -m "feat: add bottom tab navigation with placeholder screens"
```

---

### Task 8: Update App Entry Point

**Files:**
- Modify: `App.tsx`

**Step 1: Update App.tsx to use Navigation**

```typescript
import React from 'react';
import { Navigation } from './src/navigation';

export default function App() {
  return <Navigation />;
}
```

**Step 2: Verify app loads**

Run: `npx expo start --web` and check browser
Expected: App shows with bottom tabs (Home, Progress, Settings)

**Step 3: Commit**

```bash
git add App.tsx
git commit -m "feat: integrate navigation into App entry point"
```

---

## Phase 3: Home Screen Redesign

### Task 9: Create Time-Based Greeting Hook

**Files:**
- Create: `src/hooks/useGreeting.ts`

**Step 1: Create the hook**

```typescript
import { useMemo } from 'react';

interface Greeting {
  text: string;
  emoji: string;
}

export function useGreeting(): Greeting {
  return useMemo(() => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return { text: 'Good morning', emoji: '🌅' };
    } else if (hour >= 12 && hour < 17) {
      return { text: 'Good afternoon', emoji: '☀️' };
    } else if (hour >= 17 && hour < 21) {
      return { text: 'Good evening', emoji: '🌆' };
    } else {
      return { text: 'Wind down', emoji: '🌙' };
    }
  }, []);
}
```

**Step 2: Commit**

```bash
git add src/hooks/useGreeting.ts
git commit -m "feat: add useGreeting hook for time-based messages"
```

---

### Task 10: Create TechniqueCard Component

**Files:**
- Create: `src/components/TechniqueCard.tsx`

**Step 1: Create the component**

```typescript
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Card } from './ui';
import { colors, typography, spacing, borderRadius } from '../theme';
import { Technique } from '../types';

interface TechniqueCardProps {
  technique: Technique;
  onPress: () => void;
  isImplemented?: boolean;
}

const techniquePatterns: Record<string, { bg: string; pattern: string }> = {
  breathing: { bg: '#2a4a40', pattern: '○' },
  'audio-masking': { bg: '#2a3a4a', pattern: '∿' },
  'mental-distraction': { bg: '#3a3a4a', pattern: '△' },
  'muscle-relaxation': { bg: '#4a3a3a', pattern: '◇' },
  visualization: { bg: '#3a4a3a', pattern: '☁' },
};

export function TechniqueCard({
  technique,
  onPress,
  isImplemented = true,
}: TechniqueCardProps) {
  const pattern = techniquePatterns[technique.id] || techniquePatterns.breathing;

  return (
    <Card
      onPress={isImplemented ? onPress : undefined}
      style={[styles.card, { backgroundColor: pattern.bg }]}
      variant="elevated"
    >
      <View style={styles.patternContainer}>
        <Text style={styles.pattern}>{pattern.pattern}</Text>
      </View>
      <Text style={styles.icon}>{technique.icon}</Text>
      <Text style={styles.name}>{technique.name}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {technique.description}
      </Text>
      {!isImplemented && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Soon</Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: spacing.xs,
    minHeight: 140,
    position: 'relative',
    overflow: 'hidden',
  },
  patternContainer: {
    position: 'absolute',
    top: -20,
    right: -20,
    opacity: 0.1,
  },
  pattern: {
    fontSize: 100,
    color: colors.text.primary,
  },
  icon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  name: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  badge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.background.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  badgeText: {
    ...typography.caption,
    color: colors.text.muted,
    fontWeight: '500',
  },
});
```

**Step 2: Commit**

```bash
git add src/components/TechniqueCard.tsx
git commit -m "feat: add TechniqueCard component with patterns"
```

---

### Task 11: Create QuickStartButton Component

**Files:**
- Create: `src/components/QuickStartButton.tsx`

**Step 1: Create the component**

```typescript
import React, { useEffect } from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSpring,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { colors, typography, spacing, borderRadius } from '../theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface QuickStartButtonProps {
  techniqueName: string;
  onPress: () => void;
}

export function QuickStartButton({ techniqueName, onPress }: QuickStartButtonProps) {
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.glow, glowStyle]} />
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.button, buttonStyle]}
        testID="quick-start-button"
      >
        <Text style={styles.title}>Quick Start</Text>
        <Text style={styles.subtitle}>{techniqueName}</Text>
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
  },
  glow: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    backgroundColor: colors.accent.warm,
    borderRadius: borderRadius.xl + 8,
    opacity: 0.3,
  },
  button: {
    backgroundColor: colors.accent.warm,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
  },
  title: {
    ...typography.h2,
    color: colors.background.primary,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.background.secondary,
    marginTop: spacing.xs,
  },
});
```

**Step 2: Commit**

```bash
git add src/components/QuickStartButton.tsx
git commit -m "feat: add QuickStartButton with pulsing glow animation"
```

---

### Task 12: Redesign HomeScreen

**Files:**
- Modify: `src/screens/HomeScreen.tsx`

**Step 1: Rewrite HomeScreen with new design**

```typescript
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GradientBackground } from '../components/ui';
import { TechniqueCard } from '../components/TechniqueCard';
import { QuickStartButton } from '../components/QuickStartButton';
import { BreathingTechnique } from '../components/BreathingTechnique';
import { AudioMaskingTechnique } from '../components/AudioMaskingTechnique';
import { MentalDistractionTechnique } from '../components/MentalDistractionTechnique';
import { usePreferences } from '../hooks/usePreferences';
import { useGreeting } from '../hooks/useGreeting';
import { TechniqueId } from '../types';
import { TECHNIQUES } from '../constants';
import { colors, typography, spacing } from '../theme';

const IMPLEMENTED_TECHNIQUES: TechniqueId[] = [
  'breathing',
  'audio-masking',
  'mental-distraction',
];

export function HomeScreen() {
  const { preferences } = usePreferences();
  const greeting = useGreeting();
  const [activeTechnique, setActiveTechnique] = useState<TechniqueId | null>(null);

  const handleQuickStart = () => {
    setActiveTechnique(preferences.defaultTechnique);
  };

  const handleTechniqueSelect = (id: TechniqueId) => {
    if (IMPLEMENTED_TECHNIQUES.includes(id)) {
      setActiveTechnique(id);
    }
  };

  const handleClose = () => {
    setActiveTechnique(null);
  };

  // Render active technique full-screen
  if (activeTechnique) {
    switch (activeTechnique) {
      case 'breathing':
        return (
          <BreathingTechnique
            hapticEnabled={preferences.hapticEnabled}
            onClose={handleClose}
          />
        );
      case 'audio-masking':
        return <AudioMaskingTechnique onClose={handleClose} />;
      case 'mental-distraction':
        return <MentalDistractionTechnique onClose={handleClose} />;
      default:
        return null;
    }
  }

  const defaultTechnique = TECHNIQUES.find(
    (t) => t.id === preferences.defaultTechnique
  );

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />

        <View style={styles.header}>
          <Text style={styles.greeting}>
            {greeting.emoji} {greeting.text}
          </Text>
          <Text style={styles.title}>ReliefKey</Text>
          <Text style={styles.subtitle}>Find your calm</Text>
        </View>

        <QuickStartButton
          techniqueName={defaultTechnique?.name || 'Guided Breathing'}
          onPress={handleQuickStart}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>All Techniques</Text>
          <View style={styles.grid}>
            {TECHNIQUES.map((technique, index) => (
              <View key={technique.id} style={styles.gridItem}>
                <TechniqueCard
                  technique={technique}
                  onPress={() => handleTechniqueSelect(technique.id)}
                  isImplemented={IMPLEMENTED_TECHNIQUES.includes(technique.id)}
                />
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  greeting: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
    marginLeft: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  gridItem: {
    width: '50%',
  },
});
```

**Step 2: Verify HomeScreen renders**

Run: `npx expo start --web` and check browser
Expected: New nature-themed home screen with card grid, quick start button, and greeting

**Step 3: Commit**

```bash
git add src/screens/HomeScreen.tsx
git commit -m "feat: redesign HomeScreen with nature theme and card grid"
```

---

## Phase 4: Settings Screen

### Task 13: Extend Types for Settings

**Files:**
- Modify: `src/types/index.ts`

**Step 1: Add new types**

Add to the existing file:

```typescript
export type ThemeMode = 'forest' | 'meadow' | 'dusk';
export type AnimationIntensity = 'full' | 'reduced' | 'minimal';
export type SoundType = 'white-noise' | 'rain' | 'water' | 'forest' | 'campfire';

export interface UserPreferences {
  defaultTechnique: TechniqueId;
  hapticEnabled: boolean;
  preferredSound: SoundType;
  theme: ThemeMode;
  animationIntensity: AnimationIntensity;
  favorites: TechniqueId[];
  customBreathingPatterns: BreathingPattern[];
}
```

**Step 2: Update DEFAULT_PREFERENCES in constants**

Modify `src/constants/index.ts`:

```typescript
export const DEFAULT_PREFERENCES: UserPreferences = {
  defaultTechnique: 'breathing',
  hapticEnabled: true,
  preferredSound: 'white-noise',
  theme: 'forest',
  animationIntensity: 'full',
  favorites: ['breathing'],
  customBreathingPatterns: [],
};
```

**Step 3: Commit**

```bash
git add src/types/index.ts src/constants/index.ts
git commit -m "feat: extend types for settings preferences"
```

---

### Task 14: Create SettingRow Component

**Files:**
- Create: `src/components/ui/SettingRow.tsx`

**Step 1: Create the component**

```typescript
import React from 'react';
import { StyleSheet, View, Text, Switch, Pressable } from 'react-native';
import { colors, typography, spacing } from '../../theme';

interface SettingRowProps {
  label: string;
  description?: string;
  value?: boolean;
  onToggle?: (value: boolean) => void;
  onPress?: () => void;
  rightElement?: React.ReactNode;
}

export function SettingRow({
  label,
  description,
  value,
  onToggle,
  onPress,
  rightElement,
}: SettingRowProps) {
  const content = (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
      {onToggle !== undefined && value !== undefined && (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{
            false: colors.background.surfaceSolid,
            true: colors.accent.warm,
          }}
          thumbColor={colors.text.primary}
        />
      )}
      {rightElement}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={styles.pressable}>
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.background.surface,
  },
  pressable: {
    opacity: 1,
  },
  textContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  label: {
    ...typography.body,
    color: colors.text.primary,
  },
  description: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
});
```

**Step 2: Update UI index**

Add to `src/components/ui/index.ts`:

```typescript
export { SettingRow } from './SettingRow';
```

**Step 3: Commit**

```bash
git add src/components/ui/SettingRow.tsx src/components/ui/index.ts
git commit -m "feat: add SettingRow component"
```

---

### Task 15: Create SegmentedControl Component

**Files:**
- Create: `src/components/ui/SegmentedControl.tsx`

**Step 1: Create the component**

```typescript
import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { colors, typography, spacing, borderRadius } from '../../theme';

interface Option<T> {
  label: string;
  value: T;
}

interface SegmentedControlProps<T> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  const selectedIndex = options.findIndex((opt) => opt.value === value);

  return (
    <View style={styles.container}>
      {options.map((option, index) => {
        const isSelected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[
              styles.option,
              isSelected && styles.optionSelected,
              index === 0 && styles.optionFirst,
              index === options.length - 1 && styles.optionLast,
            ]}
          >
            <Text
              style={[styles.optionText, isSelected && styles.optionTextSelected]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.background.surface,
    borderRadius: borderRadius.md,
    padding: spacing.xs,
  },
  option: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    borderRadius: borderRadius.sm,
  },
  optionSelected: {
    backgroundColor: colors.accent.warm,
  },
  optionFirst: {
    borderTopLeftRadius: borderRadius.sm,
    borderBottomLeftRadius: borderRadius.sm,
  },
  optionLast: {
    borderTopRightRadius: borderRadius.sm,
    borderBottomRightRadius: borderRadius.sm,
  },
  optionText: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: colors.background.primary,
  },
});
```

**Step 2: Update UI index**

Add to `src/components/ui/index.ts`:

```typescript
export { SegmentedControl } from './SegmentedControl';
```

**Step 3: Commit**

```bash
git add src/components/ui/SegmentedControl.tsx src/components/ui/index.ts
git commit -m "feat: add SegmentedControl component"
```

---

### Task 16: Implement Full SettingsScreen

**Files:**
- Modify: `src/screens/SettingsScreen.tsx`

**Step 1: Implement SettingsScreen**

```typescript
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GradientBackground, Card, SettingRow, SegmentedControl } from '../components/ui';
import { usePreferences } from '../hooks/usePreferences';
import { colors, typography, spacing } from '../theme';
import { TECHNIQUES, BREATHING_PATTERNS } from '../constants';
import { ThemeMode, AnimationIntensity, SoundType, TechniqueId } from '../types';

const THEME_OPTIONS = [
  { label: 'Forest', value: 'forest' as ThemeMode },
  { label: 'Meadow', value: 'meadow' as ThemeMode },
  { label: 'Dusk', value: 'dusk' as ThemeMode },
];

const ANIMATION_OPTIONS = [
  { label: 'Full', value: 'full' as AnimationIntensity },
  { label: 'Reduced', value: 'reduced' as AnimationIntensity },
  { label: 'Minimal', value: 'minimal' as AnimationIntensity },
];

const SOUND_OPTIONS: { label: string; value: SoundType }[] = [
  { label: 'White Noise', value: 'white-noise' },
  { label: 'Rain', value: 'rain' },
  { label: 'Water', value: 'water' },
];

export function SettingsScreen() {
  const { preferences, updatePreferences } = usePreferences();

  const handleDefaultTechniqueChange = (id: TechniqueId) => {
    updatePreferences({ defaultTechnique: id });
  };

  const handleThemeChange = (theme: ThemeMode) => {
    updatePreferences({ theme });
  };

  const handleAnimationChange = (animationIntensity: AnimationIntensity) => {
    updatePreferences({ animationIntensity });
  };

  const handleHapticToggle = (hapticEnabled: boolean) => {
    updatePreferences({ hapticEnabled });
  };

  const handleSoundChange = (preferredSound: SoundType) => {
    updatePreferences({ preferredSound });
  };

  const defaultTechnique = TECHNIQUES.find(
    (t) => t.id === preferences.defaultTechnique
  );

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />

        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Personalize your experience</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Quick Start Section */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Start</Text>
            <SettingRow
              label="Default Technique"
              description={defaultTechnique?.name}
              onPress={() => {}}
              rightElement={<Text style={styles.chevron}>›</Text>}
            />
          </Card>

          {/* Sound Preferences */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Sound</Text>
            <Text style={styles.sectionLabel}>Default Sound</Text>
            <SegmentedControl
              options={SOUND_OPTIONS}
              value={preferences.preferredSound}
              onChange={handleSoundChange}
            />
          </Card>

          {/* Appearance Section */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Appearance</Text>

            <Text style={styles.sectionLabel}>Theme</Text>
            <SegmentedControl
              options={THEME_OPTIONS}
              value={preferences.theme}
              onChange={handleThemeChange}
            />

            <View style={styles.spacer} />

            <Text style={styles.sectionLabel}>Animations</Text>
            <SegmentedControl
              options={ANIMATION_OPTIONS}
              value={preferences.animationIntensity}
              onChange={handleAnimationChange}
            />

            <View style={styles.spacer} />

            <SettingRow
              label="Haptic Feedback"
              description="Vibration during breathing exercises"
              value={preferences.hapticEnabled}
              onToggle={handleHapticToggle}
            />
          </Card>

          {/* About Section */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <SettingRow
              label="Version"
              rightElement={<Text style={styles.versionText}>1.0.0</Text>}
            />
            <SettingRow
              label="Send Feedback"
              onPress={() => {}}
              rightElement={<Text style={styles.chevron}>›</Text>}
            />
          </Card>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  sectionLabel: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  spacer: {
    height: spacing.md,
  },
  chevron: {
    ...typography.h2,
    color: colors.text.secondary,
  },
  versionText: {
    ...typography.body,
    color: colors.text.secondary,
  },
});
```

**Step 2: Update usePreferences hook to handle new fields**

Modify `src/hooks/usePreferences.ts` to include the new preference fields if they don't exist (gracefully handle migration).

**Step 3: Verify Settings renders**

Run: `npx expo start --web`, navigate to Settings tab
Expected: Settings screen with themed cards, toggles, and segmented controls

**Step 4: Commit**

```bash
git add src/screens/SettingsScreen.tsx
git commit -m "feat: implement SettingsScreen with preferences"
```

---

## Phase 5: Polish & Final Touches

### Task 17: Update usePreferences for New Fields

**Files:**
- Modify: `src/hooks/usePreferences.ts`

**Step 1: Read current implementation**

Read the file first to understand its structure.

**Step 2: Update to handle new preference fields with migration**

Ensure backward compatibility by merging saved preferences with defaults.

**Step 3: Commit**

```bash
git add src/hooks/usePreferences.ts
git commit -m "fix: update usePreferences to handle new fields"
```

---

### Task 18: Add Component Exports

**Files:**
- Modify: `src/components/index.ts` (create if doesn't exist)

**Step 1: Create components index**

```typescript
export { BreathingTechnique } from './BreathingTechnique';
export { AudioMaskingTechnique } from './AudioMaskingTechnique';
export { MentalDistractionTechnique } from './MentalDistractionTechnique';
export { TechniqueCard } from './TechniqueCard';
export { QuickStartButton } from './QuickStartButton';
```

**Step 2: Commit**

```bash
git add src/components/index.ts
git commit -m "chore: add components index"
```

---

### Task 19: Final Testing & Cleanup

**Step 1: Run the app**

Run: `npx expo start --web`
Check:
- Home screen renders with gradient, cards, quick start
- Settings screen renders with all sections
- Navigation works between tabs
- Quick start launches breathing technique
- Technique cards launch their respective techniques

**Step 2: Run tests**

Run: `npm test`
Fix any broken tests due to changes

**Step 3: Final commit**

```bash
git add -A
git commit -m "chore: final cleanup and fixes"
```

---

## Summary

This plan covers:
1. **Foundation**: Dependencies, theme system, core UI components
2. **Navigation**: Bottom tab navigator with 3 screens
3. **Home Screen**: Complete redesign with cards, greeting, quick start
4. **Settings Screen**: Full preferences UI with toggles and selectors
5. **Polish**: Testing and cleanup

Total tasks: 19
Estimated commits: ~15
