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
