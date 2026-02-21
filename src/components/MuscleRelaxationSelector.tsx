import React from 'react';
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Sparkles, Clock } from 'lucide-react-native';
import { colors, typography, spacing } from '../theme';
import { SESSION_INFO } from '../constants/muscleGroups';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type SessionType = 'quick' | 'standard';

interface MuscleRelaxationSelectorProps {
  onSelect: (sessionType: SessionType) => void;
  onClose: () => void;
}

interface SessionCardProps {
  type: SessionType;
  onSelect: () => void;
}

function SessionCard({ type, onSelect }: SessionCardProps) {
  const scale = useSharedValue(1);
  const info = SESSION_INFO[type];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const CardContent = () => (
    <View style={styles.cardContent}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardLabel}>{info.label}</Text>
        <View style={styles.durationBadge}>
          <Clock size={14} color={colors.accent.primary} strokeWidth={2} />
          <Text style={styles.durationText}>{info.duration}</Text>
        </View>
      </View>
      <Text style={styles.cardDescription}>{info.description}</Text>
    </View>
  );

  return (
    <AnimatedPressable
      onPress={onSelect}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.card, animatedStyle]}
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

export function MuscleRelaxationSelector({
  onSelect,
  onClose,
}: MuscleRelaxationSelectorProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Sparkles size={32} color={colors.accent.primary} strokeWidth={1.5} />
        </View>
        <Text style={styles.title}>Muscle Relaxation</Text>
        <Text style={styles.subtitle}>Choose your session length</Text>
      </View>

      <View style={styles.cards}>
        <SessionCard type="quick" onSelect={() => onSelect('quick')} />
        <SessionCard type="standard" onSelect={() => onSelect('standard')} />
      </View>

      <Pressable onPress={onClose} style={styles.cancelButton}>
        <Text style={styles.cancelText}>Cancel</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  cards: {
    gap: spacing.md,
  },
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  blur: {
    backgroundColor: colors.glass.surface,
  },
  webBlur: {
    backgroundColor: colors.glass.surface,
    backdropFilter: 'blur(20px)',
  },
  cardContent: {
    padding: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardLabel: {
    ...typography.h2,
    color: colors.text.primary,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    gap: 4,
  },
  durationText: {
    ...typography.caption,
    color: colors.accent.primary,
    fontWeight: '600',
  },
  cardDescription: {
    ...typography.body,
    color: colors.text.secondary,
  },
  cancelButton: {
    alignItems: 'center',
    marginTop: spacing.xl,
    padding: spacing.md,
  },
  cancelText: {
    ...typography.body,
    color: colors.text.secondary,
  },
});
