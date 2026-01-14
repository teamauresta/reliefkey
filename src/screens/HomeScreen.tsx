import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GradientBackground } from '../components/ui';
import { TechniqueCard } from '../components/TechniqueCard';
import { QuickStartButton } from '../components/QuickStartButton';
import { BreathingTechnique } from '../components/BreathingTechnique';
import { AudioMaskingTechnique } from '../components/AudioMaskingTechnique';
import { MentalDistractionTechnique } from '../components/MentalDistractionTechnique';
import { usePreferences } from '../hooks/usePreferences';
import { useGreeting } from '../hooks/useGreeting';
import { TechniqueId } from '../types';
import { TECHNIQUES } from '../constants';
import { colors, typography, spacing } from '../theme';

const IMPLEMENTED_TECHNIQUES: TechniqueId[] = [
  'breathing',
  'audio-masking',
  'mental-distraction',
];

export function HomeScreen() {
  const { preferences } = usePreferences();
  const greeting = useGreeting();
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
      default:
        return null;
    }
  }

  const defaultTechnique = TECHNIQUES.find(
    (t) => t.id === preferences.defaultTechnique
  );

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />

        <View style={styles.header}>
          <Text style={styles.greeting}>
            {greeting.emoji} {greeting.text}
          </Text>
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
          <Text style={styles.sectionTitle}>All Techniques</Text>
          <View style={styles.grid}>
            {TECHNIQUES.map((technique, index) => (
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
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  greeting: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.h3,
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
