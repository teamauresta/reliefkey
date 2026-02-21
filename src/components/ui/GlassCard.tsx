import React from 'react';
import {
  StyleSheet,
  View,
  ViewStyle,
  Pressable,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { colors, spacing } from '../../theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface GlassCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  intensity?: 'low' | 'medium' | 'high';
  noPadding?: boolean;
}

export function GlassCard({
  children,
  onPress,
  style,
  intensity = 'medium',
  noPadding = false,
}: GlassCardProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const blurIntensity = intensity === 'low' ? 15 : intensity === 'high' ? 40 : 20;

  const CardContent = () => (
    <View style={[styles.card, !noPadding && styles.padding, style]}>
      {Platform.OS === 'web' ? (
        <View style={styles.webBlur}>
          {children}
        </View>
      ) : (
        <BlurView intensity={blurIntensity} tint="dark" style={styles.blur}>
          {children}
        </BlurView>
      )}
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
        <CardContent />
      </AnimatedPressable>
    );
  }

  return <CardContent />;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glass.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 32,
    elevation: 8,
  },
  padding: {
    padding: spacing.lg,
  },
  blur: {
    backgroundColor: colors.glass.surface,
    borderRadius: 23,
  },
  webBlur: {
    backgroundColor: colors.glass.surface,
    backdropFilter: 'blur(20px)',
    borderRadius: 23,
  },
});
