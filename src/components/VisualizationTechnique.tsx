import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View, Text, Pressable, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Check, Volume2, VolumeX, Sun, TreePine, Mountain, Star } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { SceneParticles, TechniqueHeader } from './ui';
import { VisualizationSelector } from './VisualizationSelector';
import {
  VISUALIZATION_SCENES,
  VisualizationScene,
  PROMPT_DURATION,
} from '../constants/visualizationScenes';
import { colors, typography, spacing } from '../theme';
import { useVoiceAudio } from '../hooks/useVoiceAudio';

interface VisualizationTechniqueProps {
  onClose: () => void;
  hapticEnabled?: boolean;
}

const SCENE_ICONS: Record<string, React.ComponentType<any>> = {
  Sun,
  TreePine,
  Mountain,
  Star,
};

export function VisualizationTechnique({
  onClose,
  hapticEnabled = true,
}: VisualizationTechniqueProps) {
  const [selectedScene, setSelectedScene] = useState<VisualizationScene | null>(null);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const promptOpacity = useSharedValue(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { play: playVoice, stop: stopVoice } = useVoiceAudio();

  const currentPhase = selectedScene?.phases[currentPhaseIndex];
  const currentPrompt = currentPhase?.prompts[currentPromptIndex];

  const triggerHaptic = useCallback(
    async (style: 'light' | 'success') => {
      if (!hapticEnabled) return;
      try {
        if (style === 'success') {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      } catch {}
    },
    [hapticEnabled]
  );

  const playSceneAudio = useCallback(
    (sceneId: string, phaseName: string, promptIndex: number) => {
      if (voiceEnabled) {
        const phaseKey = phaseName.toLowerCase();
        const audioId = `${phaseKey}-${promptIndex + 1}`;
        playVoice(sceneId as any, audioId);
      }
    },
    [voiceEnabled, playVoice]
  );

  const playCompletionAudio = useCallback(() => {
    if (voiceEnabled) {
      playVoice('visualization', 'complete');
    }
  }, [voiceEnabled, playVoice]);

  const toggleVoice = useCallback(() => {
    if (voiceEnabled) {
      stopVoice();
    }
    setVoiceEnabled((prev) => !prev);
  }, [voiceEnabled, stopVoice]);

  const animatePromptIn = useCallback(() => {
    promptOpacity.value = withTiming(1, {
      duration: 1500,
      easing: Easing.out(Easing.ease),
    });
  }, [promptOpacity]);

  const animatePromptOut = useCallback(() => {
    promptOpacity.value = withTiming(0, {
      duration: 1000,
      easing: Easing.in(Easing.ease),
    });
  }, [promptOpacity]);

  const handleSceneSelect = (scene: VisualizationScene) => {
    setSelectedScene(scene);
    setCurrentPhaseIndex(0);
    setCurrentPromptIndex(0);
    setIsComplete(false);
    triggerHaptic('light');
    animatePromptIn();
    // Play the first prompt audio
    playSceneAudio(scene.id, scene.phases[0].name, 0);
  };

  // Prompt cycling logic
  useEffect(() => {
    if (!selectedScene || isComplete) return;

    const currentPhase = selectedScene.phases[currentPhaseIndex];
    if (!currentPhase) return;

    // Schedule next prompt
    timerRef.current = setTimeout(() => {
      animatePromptOut();

      // After fade out, show next prompt
      setTimeout(() => {
        const nextPromptIndex = currentPromptIndex + 1;

        if (nextPromptIndex < currentPhase.prompts.length) {
          // Next prompt in same phase
          setCurrentPromptIndex(nextPromptIndex);
          animatePromptIn();
          // Play the next prompt audio
          playSceneAudio(selectedScene.id, currentPhase.name, nextPromptIndex);
        } else {
          // Move to next phase
          const nextPhaseIndex = currentPhaseIndex + 1;

          if (nextPhaseIndex < selectedScene.phases.length) {
            setCurrentPhaseIndex(nextPhaseIndex);
            setCurrentPromptIndex(0);
            triggerHaptic('light');
            animatePromptIn();
            // Play the first prompt of next phase
            const nextPhase = selectedScene.phases[nextPhaseIndex];
            playSceneAudio(selectedScene.id, nextPhase.name, 0);
          } else {
            // Session complete
            setIsComplete(true);
            triggerHaptic('success');
            playCompletionAudio();
          }
        }
      }, 1000);
    }, PROMPT_DURATION * 1000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [
    selectedScene,
    currentPhaseIndex,
    currentPromptIndex,
    isComplete,
    animatePromptIn,
    animatePromptOut,
    triggerHaptic,
    playSceneAudio,
    playCompletionAudio,
  ]);

  const animatedPromptStyle = useAnimatedStyle(() => ({
    opacity: promptOpacity.value,
  }));

  const handleRepeat = () => {
    if (selectedScene) {
      handleSceneSelect(selectedScene);
    }
  };

  const handleNewScene = () => {
    setSelectedScene(null);
    setIsComplete(false);
  };

  // Scene selector
  if (!selectedScene) {
    return (
      <LinearGradient
        colors={[colors.background.start, colors.background.mid, colors.background.end]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.container}>
          <StatusBar style="light" />
          <TechniqueHeader title="Visualization" onClose={onClose} />
          <VisualizationSelector onSelect={handleSceneSelect} onClose={onClose} />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // Session complete
  if (isComplete) {
    return (
      <LinearGradient
        colors={selectedScene.gradientColors}
        style={styles.gradient}
      >
        <SceneParticles particleColor={selectedScene.particleColor} particleCount={15} />
        <SafeAreaView style={styles.container}>
          <StatusBar style="light" />
          <TechniqueHeader title="Complete" onClose={onClose} />
          <View style={styles.completeContainer}>
            <View style={styles.completeIcon}>
              <Check size={48} color={colors.accent.primary} strokeWidth={2} />
            </View>
            <Text style={styles.completeTitle}>Journey Complete</Text>
            <Text style={styles.completeSubtitle}>
              Take a moment to carry this peace with you.
            </Text>
            <View style={styles.completeActions}>
              <Pressable style={styles.repeatButton} onPress={handleRepeat}>
                <Text style={styles.repeatButtonText}>Repeat Journey</Text>
              </Pressable>
              <Pressable style={styles.newSceneButton} onPress={handleNewScene}>
                <Text style={styles.newSceneButtonText}>New Scene</Text>
              </Pressable>
              <Pressable style={styles.doneButton} onPress={onClose}>
                <Text style={styles.doneButtonText}>Done</Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // Active visualization
  return (
    <LinearGradient
      colors={selectedScene.gradientColors}
      style={styles.gradient}
    >
      <SceneParticles particleColor={selectedScene.particleColor} />
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <TechniqueHeader
          title="Visualization"
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
          {/* Phase indicator */}
          <View style={styles.phaseContainer}>
            {selectedScene.phases.map((phase, index) => (
              <View
                key={phase.name}
                style={[
                  styles.phaseDot,
                  index < currentPhaseIndex && styles.phaseDotComplete,
                  index === currentPhaseIndex && styles.phaseDotActive,
                ]}
              />
            ))}
          </View>

          {/* Scene icon */}
          <View style={styles.iconContainer}>
            {(() => {
              const IconComponent = SCENE_ICONS[selectedScene.icon];
              return IconComponent ? <IconComponent size={56} color={colors.accent.primary} /> : null;
            })()}
          </View>

          {/* Phase name */}
          <Text style={styles.phaseName}>{currentPhase?.name}</Text>

          {/* Prompt text */}
          <Animated.View style={[styles.promptContainer, animatedPromptStyle]}>
            <Text style={styles.promptText}>{currentPrompt}</Text>
          </Animated.View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
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
  phaseContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.xl,
  },
  phaseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  phaseDotComplete: {
    backgroundColor: colors.accent.primary,
  },
  phaseDotActive: {
    backgroundColor: colors.accent.primary,
    width: 24,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sceneIcon: {
    fontSize: 56,
  },
  phaseName: {
    ...typography.caption,
    color: colors.text.muted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: spacing.xl,
  },
  promptContainer: {
    paddingHorizontal: spacing.lg,
    minHeight: 100,
    justifyContent: 'center',
  },
  promptText: {
    ...typography.h2,
    color: colors.text.primary,
    textAlign: 'center',
    lineHeight: 32,
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
  newSceneButton: {
    backgroundColor: colors.glass.surface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  newSceneButtonText: {
    ...typography.button,
    color: colors.text.primary,
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
