import React from 'react';
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Wind, Volume2, BrainCircuit, PersonStanding, Mountain, LucideIcon } from 'lucide-react-native';
import { colors, typography, spacing } from '../theme';
import { Technique } from '../types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface TechniqueCardProps {
  technique: Technique;
  onPress: () => void;
  isImplemented?: boolean;
}

const techniqueIcons: Record<string, LucideIcon> = {
  breathing: Wind,
  'audio-masking': Volume2,
  'mental-distraction': BrainCircuit,
  'muscle-relaxation': PersonStanding,
  visualization: Mountain,
};

export function TechniqueCard({
  technique,
  onPress,
  isImplemented = true,
}: TechniqueCardProps) {
  const scale = useSharedValue(1);
  const Icon = techniqueIcons[technique.id] || Wind;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (isImplemented) {
      scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const CardContent = () => (
    <View style={styles.content}>
      <View style={styles.iconContainer}>
        <Icon
          size={28}
          color={isImplemented ? colors.accent.primary : colors.text.muted}
          strokeWidth={1.5}
        />
      </View>
      <Text style={[styles.name, !isImplemented && styles.mutedText]}>
        {technique.name}
      </Text>
      <Text style={styles.description} numberOfLines={2}>
        {technique.description}
      </Text>
      {!isImplemented && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Coming Soon</Text>
        </View>
      )}
    </View>
  );

  return (
    <AnimatedPressable
      onPress={isImplemented ? onPress : undefined}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.card, animatedStyle, !isImplemented && styles.disabled]}
    >
      {Platform.OS === 'web' ? (
        <View style={styles.webBlur}>
          <CardContent />
        </View>
      ) : (
        <BlurView intensity={20} tint="dark" style={styles.blur}>
          <CardContent />
        </BlurView>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: spacing.xs,
    minHeight: 160,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glass.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 6,
  },
  disabled: {
    opacity: 0.6,
  },
  blur: {
    flex: 1,
    backgroundColor: colors.glass.surface,
  },
  webBlur: {
    flex: 1,
    backgroundColor: colors.glass.surface,
    backdropFilter: 'blur(20px)',
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  name: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  mutedText: {
    color: colors.text.muted,
  },
  description: {
    ...typography.caption,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  badge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
  },
  badgeText: {
    ...typography.small,
    color: colors.text.muted,
    fontWeight: '500',
  },
});
