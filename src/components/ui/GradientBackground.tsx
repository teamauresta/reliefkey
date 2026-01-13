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
