import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { VideoBackground } from '../components/ui';
import { TechniqueCard } from '../components/TechniqueCard';
import { QuickStartButton } from '../components/QuickStartButton';
import { BreathingTechnique } from '../components/BreathingTechnique';
import { AudioMaskingTechnique } from '../components/AudioMaskingTechnique';
import { MentalDistractionTechnique } from '../components/MentalDistractionTechnique';
import { MuscleRelaxationTechnique } from '../components/MuscleRelaxationTechnique';
import { VisualizationTechnique } from '../components/VisualizationTechnique';
import { usePreferences } from '../hooks/usePreferences';
import { TechniqueId } from '../types';
import { TECHNIQUES } from '../constants';
import { colors, typography, spacing } from '../theme';

const IMPLEMENTED_TECHNIQUES: TechniqueId[] = [
  'breathing',
  'audio-masking',
  'mental-distraction',
  'muscle-relaxation',
  'visualization',
];

export function HomeScreen() {
  const { preferences } = usePreferences();
  const [activeTechnique, setActiveTechnique] = useState<TechniqueId | null>(null);

  const handleQuickStart = () => {
    setActiveTechnique(preferences.defaultTechnique);
  };

  const handleTechniqueSelect = (id: TechniqueId) => {
    if (IMPLEMENTED_TECHNIQUES.includes(id)) {
      setActiveTechnique(id);
    }
  };

  const handleClose = () => {
    setActiveTechnique(null);
  };

  // Render active technique full-screen
  if (activeTechnique) {
    switch (activeTechnique) {
      case 'breathing':
        return (
          <BreathingTechnique
            hapticEnabled={preferences.hapticEnabled}
            onClose={handleClose}
          />
        );
      case 'audio-masking':
        return <AudioMaskingTechnique onClose={handleClose} />;
      case 'mental-distraction':
        return <MentalDistractionTechnique onClose={handleClose} />;
      case 'muscle-relaxation':
        return (
          <MuscleRelaxationTechnique
            hapticEnabled={preferences.hapticEnabled}
            onClose={handleClose}
          />
        );
      case 'visualization':
        return (
          <VisualizationTechnique
            hapticEnabled={preferences.hapticEnabled}
            onClose={handleClose}
          />
        );
      default:
        return null;
    }
  }

  const defaultTechnique = TECHNIQUES.find(
    (t) => t.id === preferences.defaultTechnique
  );

  return (
    <VideoBackground>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />

        <View style={styles.header}>
          <Text style={styles.title}>ReliefKey</Text>
          <Text style={styles.subtitle}>Find your calm</Text>
        </View>

        <QuickStartButton
          techniqueName={defaultTechnique?.name || 'Guided Breathing'}
          onPress={handleQuickStart}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>Techniques</Text>
          <View style={styles.grid}>
            {TECHNIQUES.map((technique) => (
              <View key={technique.id} style={styles.gridItem}>
                <TechniqueCard
                  technique={technique}
                  onPress={() => handleTechniqueSelect(technique.id)}
                  isImplemented={IMPLEMENTED_TECHNIQUES.includes(technique.id)}
                />
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </VideoBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    alignItems: 'center',
  },
  title: {
    ...typography.hero,
    color: colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: 120,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.md,
    marginLeft: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  gridItem: {
    width: '50%',
  },
});
