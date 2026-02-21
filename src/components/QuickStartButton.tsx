import React, { useEffect } from 'react';
import { StyleSheet, Text, Pressable, View, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSpring,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { Sparkles } from 'lucide-react-native';
import { colors, typography, spacing } from '../theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface QuickStartButtonProps {
  techniqueName: string;
  onPress: () => void;
}

export function QuickStartButton({ techniqueName, onPress }: QuickStartButtonProps) {
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.4);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    // Breathing glow animation
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.4, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    // Subtle pulse
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * pulseScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const ButtonContent = () => (
    <View style={styles.content}>
      <View style={styles.iconContainer}>
        <Sparkles size={28} color={colors.accent.primary} strokeWidth={1.5} />
      </View>
      <Text style={styles.title}>Quick Start</Text>
      <Text style={styles.subtitle}>{techniqueName}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Outer glow */}
      <Animated.View style={[styles.glow, glowStyle]} />

      {/* Gradient border */}
      <LinearGradient
        colors={[colors.accent.primary, 'rgba(100, 255, 218, 0.3)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBorder}
      >
        <AnimatedPressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[styles.button, buttonStyle]}
          testID="quick-start-button"
        >
          {Platform.OS === 'web' ? (
            <View style={styles.webBlur}>
              <ButtonContent />
            </View>
          ) : (
            <BlurView intensity={30} tint="dark" style={styles.blur}>
              <ButtonContent />
            </BlurView>
          )}
        </AnimatedPressable>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xl,
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    top: -20,
    left: 0,
    right: 0,
    bottom: -20,
    backgroundColor: colors.accent.primary,
    borderRadius: 44,
    opacity: 0.4,
  },
  gradientBorder: {
    borderRadius: 32,
    padding: 2,
  },
  button: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  blur: {
    backgroundColor: colors.glass.surface,
  },
  webBlur: {
    backgroundColor: colors.glass.surface,
    backdropFilter: 'blur(30px)',
  },
  content: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl * 2,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.caption,
    color: colors.accent.primary,
    marginTop: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});
