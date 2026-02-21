import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Volume2, VolumeX } from 'lucide-react-native';
import { useBreathing } from '../hooks/useBreathing';
import { useVoiceAudio } from '../hooks/useVoiceAudio';
import { useAudio } from '../hooks/useAudio';
import { usePreferences } from '../hooks/usePreferences';
import { BREATHING_PATTERNS } from '../constants';
import { GradientBackground, FloatingOrbs, GlassCard, TechniqueHeader } from './ui';
import { colors, spacing, typography } from '../theme';

interface BreathingTechniqueProps {
  hapticEnabled: boolean;
  onClose?: () => void;
}

const PHASE_LABELS: Record<string, string> = {
  inhale: 'Inhale',
  hold: 'Hold',
  exhale: 'Exhale',
  rest: 'Rest',
};

export function BreathingTechnique({ hapticEnabled, onClose }: BreathingTechniqueProps) {
  const { isActive, phase, secondsRemaining, cycleCount, start, stop } = useBreathing({
    pattern: BREATHING_PATTERNS['box'],
    hapticEnabled,
  });
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const { play: playVoice, stop: stopVoice } = useVoiceAudio();
  const { play: playSound, stop: stopSound } = useAudio();
  const { preferences } = usePreferences();
  const previousPhaseRef = useRef<string | null>(null);

  // Play voice cue when phase changes
  useEffect(() => {
    if (isActive && voiceEnabled && phase !== previousPhaseRef.current) {
      playVoice('breathing', phase);
      previousPhaseRef.current = phase;
    }
  }, [isActive, phase, voiceEnabled, playVoice]);

  // Stop background sound when component unmounts
  useEffect(() => {
    return () => {
      stopSound();
    };
  }, [stopSound]);

  // Play start cue when session begins
  const handleStart = useCallback(() => {
    if (voiceEnabled) {
      playVoice('breathing', 'start');
    }
    // Play background ambient sound
    playSound(preferences.preferredSound);
    previousPhaseRef.current = null;
    start();
  }, [voiceEnabled, playVoice, playSound, preferences.preferredSound, start]);

  // Stop voice and sound when session ends
  const handleStop = useCallback(() => {
    stopVoice();
    stopSound();
    previousPhaseRef.current = null;
    stop();
  }, [stopVoice, stopSound, stop]);

  const toggleVoice = useCallback(() => {
    if (voiceEnabled) {
      stopVoice();
    }
    setVoiceEnabled((prev) => !prev);
  }, [voiceEnabled, stopVoice]);

  return (
    <GradientBackground>
      <FloatingOrbs />
      <SafeAreaView style={styles.container}>
        <TechniqueHeader
          title="Guided Breathing"
          onClose={onClose || (() => {})}
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

        {isActive ? (
          <View style={styles.activeContainer}>
            <GlassCard style={styles.phaseCircle} intensity="medium">
              <Text style={styles.phaseText}>{PHASE_LABELS[phase]}</Text>
              <Text style={styles.timerText}>{secondsRemaining}</Text>
            </GlassCard>
            <Text style={styles.cycleText}>Cycle {cycleCount + 1}</Text>
            <TouchableOpacity style={styles.stopButton} onPress={handleStop}>
              <Text style={styles.buttonText}>Stop</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.inactiveContainer}>
            <GlassCard style={styles.instructionCard} intensity="low">
              <Text style={styles.instructionText}>
                Follow the breathing pattern.{'\n'}
                Voice and haptic feedback will guide you.
              </Text>
            </GlassCard>
            <TouchableOpacity style={styles.startButton} onPress={handleStart}>
              <Text style={styles.buttonText}>Start</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
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
  activeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  phaseText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  timerText: {
    fontSize: 56,
    fontWeight: 'bold',
    color: colors.accent.primary,
    marginTop: spacing.sm,
  },
  cycleText: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
  },
  instructionCard: {
    padding: spacing.xl,
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  instructionText: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 28,
  },
  startButton: {
    backgroundColor: colors.success,
    paddingHorizontal: 60,
    paddingVertical: spacing.lg,
    borderRadius: 40,
  },
  stopButton: {
    backgroundColor: colors.glass.surface,
    borderWidth: 1,
    borderColor: colors.glass.border,
    paddingHorizontal: 60,
    paddingVertical: spacing.lg,
    borderRadius: 40,
  },
  buttonText: {
    color: colors.text.primary,
    fontSize: 22,
    fontWeight: 'bold',
  },
});
