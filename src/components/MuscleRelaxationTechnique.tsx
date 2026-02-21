import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View, Text, Pressable, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { Check, Volume2, VolumeX } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { GradientBackground, FloatingOrbs, TechniqueHeader } from './ui';
import { MuscleRelaxationSelector } from './MuscleRelaxationSelector';
import { MUSCLE_GROUPS, TRANSITION_DURATION, MuscleGroup } from '../constants/muscleGroups';
import { colors, typography, spacing } from '../theme';
import { useVoiceAudio } from '../hooks/useVoiceAudio';
import { useAudio } from '../hooks/useAudio';
import { usePreferences } from '../hooks/usePreferences';

type SessionType = 'quick' | 'standard';
type Phase = 'tense' | 'release' | 'transition' | 'complete';

interface MuscleRelaxationTechniqueProps {
  onClose: () => void;
  hapticEnabled?: boolean;
}

export function MuscleRelaxationTechnique({
  onClose,
  hapticEnabled = true,
}: MuscleRelaxationTechniqueProps) {
  const [sessionType, setSessionType] = useState<SessionType | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('tense');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const indicatorScale = useSharedValue(1);
  const indicatorOpacity = useSharedValue(0.6);
  const { play: playVoice, stop: stopVoice } = useVoiceAudio();
  const { play: playSound, stop: stopSound } = useAudio();
  const { preferences } = usePreferences();

  const muscleGroups = sessionType ? MUSCLE_GROUPS[sessionType] : [];
  const currentGroup: MuscleGroup | null = muscleGroups[currentIndex] || null;

  const triggerHaptic = useCallback(
    async (style: 'medium' | 'light' | 'success') => {
      if (!hapticEnabled) return;
      try {
        if (style === 'success') {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
          await Haptics.impactAsync(
            style === 'medium'
              ? Haptics.ImpactFeedbackStyle.Medium
              : Haptics.ImpactFeedbackStyle.Light
          );
        }
      } catch {}
    },
    [hapticEnabled]
  );

  const playMuscleAudio = useCallback(
    (audioId: string) => {
      if (voiceEnabled) {
        playVoice('muscle', audioId);
      }
    },
    [voiceEnabled, playVoice]
  );

  const toggleVoice = useCallback(() => {
    if (voiceEnabled) {
      stopVoice();
    }
    setVoiceEnabled((prev) => !prev);
  }, [voiceEnabled, stopVoice]);

  const animateIndicator = useCallback(
    (toPhase: Phase) => {
      if (toPhase === 'tense') {
        // Contract and brighten
        indicatorScale.value = withTiming(0.7, {
          duration: 500,
          easing: Easing.out(Easing.ease),
        });
        indicatorOpacity.value = withTiming(1, { duration: 500 });
      } else if (toPhase === 'release') {
        // Expand and soften
        indicatorScale.value = withTiming(1.1, {
          duration: 800,
          easing: Easing.out(Easing.ease),
        });
        indicatorOpacity.value = withTiming(0.5, { duration: 800 });
      } else if (toPhase === 'transition') {
        // Reset to neutral
        indicatorScale.value = withTiming(1, { duration: 300 });
        indicatorOpacity.value = withTiming(0.6, { duration: 300 });
      }
    },
    [indicatorScale, indicatorOpacity]
  );

  // Stop background sound when component unmounts
  useEffect(() => {
    return () => {
      stopSound();
    };
  }, [stopSound]);

  // Start session
  const handleSessionSelect = (type: SessionType) => {
    setSessionType(type);
    setCurrentIndex(0);
    setPhase('tense');
    const firstGroup = MUSCLE_GROUPS[type][0];
    setTimeRemaining(firstGroup.tenseDuration);
    animateIndicator('tense');
    triggerHaptic('medium');
    // Play background ambient sound
    playSound(preferences.preferredSound);
    // Play voice audio for first muscle group
    playMuscleAudio(firstGroup.id);
  };

  // Timer logic
  useEffect(() => {
    if (!sessionType || phase === 'complete') return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Phase complete, move to next
          if (phase === 'tense') {
            setPhase('release');
            animateIndicator('release');
            triggerHaptic('light');
            playMuscleAudio('release');
            return currentGroup?.releaseDuration || 10;
          } else if (phase === 'release') {
            // Check if more groups
            if (currentIndex < muscleGroups.length - 1) {
              setPhase('transition');
              animateIndicator('transition');
              playMuscleAudio('transition');
              return TRANSITION_DURATION;
            } else {
              // Session complete
              setPhase('complete');
              triggerHaptic('success');
              playMuscleAudio('complete');
              stopSound();
              return 0;
            }
          } else if (phase === 'transition') {
            // Move to next group
            const nextIndex = currentIndex + 1;
            const nextGroup = muscleGroups[nextIndex];
            setCurrentIndex(nextIndex);
            setPhase('tense');
            animateIndicator('tense');
            triggerHaptic('medium');
            playMuscleAudio(nextGroup?.id || 'hands');
            return muscleGroups[nextIndex]?.tenseDuration || 5;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [
    sessionType,
    phase,
    currentIndex,
    currentGroup,
    muscleGroups,
    animateIndicator,
    triggerHaptic,
    playMuscleAudio,
    stopSound,
  ]);

  const animatedIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ scale: indicatorScale.value }],
    opacity: indicatorOpacity.value,
  }));

  const handleRepeat = () => {
    if (sessionType) {
      handleSessionSelect(sessionType);
    }
  };

  // Session selector
  if (!sessionType) {
    return (
      <GradientBackground>
        <FloatingOrbs />
        <SafeAreaView style={styles.container}>
          <StatusBar style="light" />
          <TechniqueHeader title="Muscle Relaxation" onClose={onClose} />
          <MuscleRelaxationSelector onSelect={handleSessionSelect} onClose={onClose} />
        </SafeAreaView>
      </GradientBackground>
    );
  }

  // Session complete
  if (phase === 'complete') {
    return (
      <GradientBackground>
        <FloatingOrbs />
        <SafeAreaView style={styles.container}>
          <StatusBar style="light" />
          <TechniqueHeader title="Complete" onClose={onClose} />
          <View style={styles.completeContainer}>
            <View style={styles.completeIcon}>
              <Check size={48} color={colors.accent.primary} strokeWidth={2} />
            </View>
            <Text style={styles.completeTitle}>Session Complete</Text>
            <Text style={styles.completeSubtitle}>
              Great job! Your muscles should feel more relaxed.
            </Text>
            <View style={styles.completeActions}>
              <Pressable style={styles.repeatButton} onPress={handleRepeat}>
                <Text style={styles.repeatButtonText}>Repeat Session</Text>
              </Pressable>
              <Pressable style={styles.doneButton} onPress={onClose}>
                <Text style={styles.doneButtonText}>Done</Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  // Active session
  const getInstructionText = () => {
    if (phase === 'tense') {
      return currentGroup?.instruction || '';
    } else if (phase === 'release') {
      return 'Release and relax...';
    } else {
      return 'Transitioning...';
    }
  };

  const getPhaseLabel = () => {
    if (phase === 'tense') return 'TENSE';
    if (phase === 'release') return 'RELEASE';
    return 'NEXT';
  };

  return (
    <GradientBackground>
      <FloatingOrbs />
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <TechniqueHeader
          title="Muscle Relaxation"
          onClose={onClose}
          rightElement={
            <Pressable style={styles.voiceButton} onPress={toggleVoice}>
              {voiceEnabled ? (
                <Volume2 size={20} color={colors.text.primary} />
              ) : (
                <VolumeX size={20} color={colors.text.secondary} />
              )}
            </Pressable>
          }
        />

        <View style={styles.content}>
          {/* Progress dots */}
          <View style={styles.progressContainer}>
            {muscleGroups.map((group, index) => (
              <View
                key={group.id}
                style={[
                  styles.progressDot,
                  index < currentIndex && styles.progressDotComplete,
                  index === currentIndex && styles.progressDotActive,
                ]}
              />
            ))}
          </View>

          {/* Main indicator */}
          <View style={styles.indicatorContainer}>
            <Animated.View style={[styles.indicator, animatedIndicatorStyle]}>
              <View style={styles.indicatorInner}>
                <Text style={styles.phaseLabel}>{getPhaseLabel()}</Text>
                <Text style={styles.timer}>{timeRemaining}</Text>
              </View>
            </Animated.View>
          </View>

          {/* Muscle group info */}
          <View style={styles.infoContainer}>
            <Text style={styles.muscleName}>{currentGroup?.name}</Text>
            <Text style={styles.instruction}>{getInstructionText()}</Text>
          </View>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  voiceButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.glass.surface,
    borderWidth: 1,
    borderColor: colors.glass.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.xl,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  progressDotComplete: {
    backgroundColor: colors.accent.primary,
  },
  progressDotActive: {
    backgroundColor: colors.accent.primary,
    width: 24,
  },
  indicatorContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  indicator: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.accent.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
  },
  indicatorInner: {
    alignItems: 'center',
  },
  phaseLabel: {
    ...typography.caption,
    color: colors.background.start,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  timer: {
    fontSize: 48,
    fontWeight: '300',
    color: colors.background.start,
  },
  infoContainer: {
    alignItems: 'center',
  },
  muscleName: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  instruction: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  completeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  completeIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(100, 255, 218, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  completeTitle: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  completeSubtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  completeActions: {
    width: '100%',
    gap: spacing.md,
  },
  repeatButton: {
    backgroundColor: colors.accent.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 16,
    alignItems: 'center',
  },
  repeatButtonText: {
    ...typography.button,
    color: colors.background.start,
    fontWeight: '600',
  },
  doneButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  doneButtonText: {
    ...typography.body,
    color: colors.text.secondary,
  },
});
