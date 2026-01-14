import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GradientBackground, Card, SettingRow, SegmentedControl } from '../components/ui';
import { usePreferences } from '../hooks/usePreferences';
import { colors, typography, spacing } from '../theme';
import { TECHNIQUES, BREATHING_PATTERNS } from '../constants';
import { ThemeMode, AnimationIntensity, SoundType, TechniqueId } from '../types';

const THEME_OPTIONS = [
  { label: 'Forest', value: 'forest' as ThemeMode },
  { label: 'Meadow', value: 'meadow' as ThemeMode },
  { label: 'Dusk', value: 'dusk' as ThemeMode },
];

const ANIMATION_OPTIONS = [
  { label: 'Full', value: 'full' as AnimationIntensity },
  { label: 'Reduced', value: 'reduced' as AnimationIntensity },
  { label: 'Minimal', value: 'minimal' as AnimationIntensity },
];

const SOUND_OPTIONS: { label: string; value: SoundType }[] = [
  { label: 'White Noise', value: 'white-noise' },
  { label: 'Rain', value: 'rain' },
  { label: 'Water', value: 'water' },
];

export function SettingsScreen() {
  const { preferences, updatePreferences } = usePreferences();

  const handleDefaultTechniqueChange = (id: TechniqueId) => {
    updatePreferences({ defaultTechnique: id });
  };

  const handleThemeChange = (theme: ThemeMode) => {
    updatePreferences({ theme });
  };

  const handleAnimationChange = (animationIntensity: AnimationIntensity) => {
    updatePreferences({ animationIntensity });
  };

  const handleHapticToggle = (hapticEnabled: boolean) => {
    updatePreferences({ hapticEnabled });
  };

  const handleSoundChange = (preferredSound: SoundType) => {
    updatePreferences({ preferredSound });
  };

  const defaultTechnique = TECHNIQUES.find(
    (t) => t.id === preferences.defaultTechnique
  );

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />

        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Personalize your experience</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Quick Start Section */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Start</Text>
            <SettingRow
              label="Default Technique"
              description={defaultTechnique?.name}
              onPress={() => {}}
              rightElement={<Text style={styles.chevron}>›</Text>}
            />
          </Card>

          {/* Sound Preferences */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Sound</Text>
            <Text style={styles.sectionLabel}>Default Sound</Text>
            <SegmentedControl
              options={SOUND_OPTIONS}
              value={preferences.preferredSound}
              onChange={handleSoundChange}
            />
          </Card>

          {/* Appearance Section */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Appearance</Text>

            <Text style={styles.sectionLabel}>Theme</Text>
            <SegmentedControl
              options={THEME_OPTIONS}
              value={preferences.theme}
              onChange={handleThemeChange}
            />

            <View style={styles.spacer} />

            <Text style={styles.sectionLabel}>Animations</Text>
            <SegmentedControl
              options={ANIMATION_OPTIONS}
              value={preferences.animationIntensity}
              onChange={handleAnimationChange}
            />

            <View style={styles.spacer} />

            <SettingRow
              label="Haptic Feedback"
              description="Vibration during breathing exercises"
              value={preferences.hapticEnabled}
              onToggle={handleHapticToggle}
            />
          </Card>

          {/* About Section */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <SettingRow
              label="Version"
              rightElement={<Text style={styles.versionText}>1.0.0</Text>}
            />
            <SettingRow
              label="Send Feedback"
              onPress={() => {}}
              rightElement={<Text style={styles.chevron}>›</Text>}
            />
          </Card>
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
  section: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  sectionLabel: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  spacer: {
    height: spacing.md,
  },
  chevron: {
    ...typography.h2,
    color: colors.text.secondary,
  },
  versionText: {
    ...typography.body,
    color: colors.text.secondary,
  },
});
