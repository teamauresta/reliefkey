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
