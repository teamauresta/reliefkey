import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Radio, Waves, CloudLightning, TreePine, Bird, Moon, Bug, Wind, Leaf } from 'lucide-react-native';
import { useAudio, SoundType } from '../hooks/useAudio';
import { GradientBackground, FloatingOrbs, GlassCard, TechniqueHeader } from './ui';
import { colors, spacing, typography } from '../theme';

interface AudioMaskingTechniqueProps {
  onClose: () => void;
}

const SOUNDS: { id: SoundType; label: string; Icon: React.ComponentType<any> }[] = [
  { id: 'white-noise', label: 'White Noise', Icon: Radio },
  { id: 'sea-wave', label: 'Ocean Waves', Icon: Waves },
  { id: 'thunderstorm-jungle', label: 'Thunderstorm', Icon: CloudLightning },
  { id: 'european-forest', label: 'European Forest', Icon: TreePine },
  { id: 'forest-bird', label: 'Forest Birds', Icon: Bird },
  { id: 'night-forest', label: 'Night Forest', Icon: Moon },
  { id: 'summer-night', label: 'Summer Night', Icon: Bug },
  { id: 'wind-blowing', label: 'Wind Blowing', Icon: Wind },
  { id: 'wind-hum', label: 'Wind Hum', Icon: Leaf },
];

export function AudioMaskingTechnique({ onClose }: AudioMaskingTechniqueProps) {
  const { isPlaying, currentSound, play, stop } = useAudio();

  const handleSoundPress = async (soundType: SoundType) => {
    if (isPlaying && currentSound === soundType) {
      await stop();
    } else {
      await play(soundType);
    }
  };

  return (
    <GradientBackground>
      <FloatingOrbs />
      <SafeAreaView style={styles.container}>
        <TechniqueHeader title="Audio Masking" onClose={onClose} />

        <Text style={styles.subtitle}>
          Choose a sound to mask background noise
        </Text>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.soundsContainer}
          showsVerticalScrollIndicator={false}
        >
          {SOUNDS.map((sound) => (
            <GlassCard
              key={sound.id}
              onPress={() => handleSoundPress(sound.id)}
              style={[
                styles.soundButton,
                currentSound === sound.id && isPlaying && styles.soundButtonActive,
              ]}
              intensity="low"
            >
              <View style={styles.soundContent}>
                {React.createElement(sound.Icon, { size: 24, color: colors.accent.primary })}
                <Text style={styles.soundLabel}>{sound.label}</Text>
                {currentSound === sound.id && isPlaying && (
                  <View style={styles.playingBadge}>
                    <Text style={styles.playingIndicator}>Playing</Text>
                  </View>
                )}
              </View>
            </GlassCard>
          ))}
        </ScrollView>

        {isPlaying && (
          <TouchableOpacity style={styles.stopButton} onPress={stop}>
            <Text style={styles.stopButtonText}>Stop Sound</Text>
          </TouchableOpacity>
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
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  scrollView: {
    flex: 1,
  },
  soundsContainer: {
    paddingBottom: 120,
  },
  soundButton: {
    marginBottom: spacing.md,
  },
  soundButtonActive: {
    borderWidth: 2,
    borderColor: colors.accent.primary,
  },
  soundContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  soundIcon: {
    marginRight: spacing.md,
  },
  soundLabel: {
    ...typography.body,
    color: colors.text.primary,
    flex: 1,
    fontWeight: '600',
  },
  playingBadge: {
    backgroundColor: colors.accent.primaryMuted,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  playingIndicator: {
    fontSize: 12,
    color: colors.accent.primary,
    fontWeight: '600',
  },
  stopButton: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.xl,
    right: spacing.xl,
    backgroundColor: colors.glass.surface,
    borderWidth: 1,
    borderColor: colors.accent.primary,
    paddingVertical: spacing.md,
    borderRadius: 30,
    alignItems: 'center',
  },
  stopButtonText: {
    color: colors.accent.primary,
    fontSize: 18,
    fontWeight: '600',
  },
});
