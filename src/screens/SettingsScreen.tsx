import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ChevronRight, Check, Wind, Volume2, BrainCircuit, PersonStanding, Mountain, Radio, Waves, TreePine, Moon, LucideIcon } from 'lucide-react-native';
import { GradientBackground, FloatingOrbs, GlassCard, SettingRow, SegmentedControl } from '../components/ui';
import { usePreferences } from '../hooks/usePreferences';
import { colors, typography, spacing } from '../theme';

const techniqueIcons: Record<string, LucideIcon> = {
  breathing: Wind,
  'audio-masking': Volume2,
  'mental-distraction': BrainCircuit,
  'muscle-relaxation': PersonStanding,
  visualization: Mountain,
};
import { TECHNIQUES } from '../constants';
import { AnimationIntensity, SoundType, TechniqueId } from '../types';

const ANIMATION_OPTIONS = [
  { label: 'Full', value: 'full' as AnimationIntensity },
  { label: 'Reduced', value: 'reduced' as AnimationIntensity },
  { label: 'Minimal', value: 'minimal' as AnimationIntensity },
];

const SOUND_OPTIONS: { label: string; value: SoundType; iconName: LucideIcon }[] = [
  { label: 'White Noise', value: 'white-noise', iconName: Radio },
  { label: 'Ocean', value: 'sea-wave', iconName: Waves },
  { label: 'Forest', value: 'european-forest', iconName: TreePine },
  { label: 'Night', value: 'night-forest', iconName: Moon },
];

export function SettingsScreen() {
  const { preferences, updatePreferences } = usePreferences();
  const [showTechniquePicker, setShowTechniquePicker] = useState(false);

  const handleAnimationChange = (animationIntensity: AnimationIntensity) => {
    updatePreferences({ animationIntensity });
  };

  const handleHapticToggle = (hapticEnabled: boolean) => {
    updatePreferences({ hapticEnabled });
  };

  const handleSoundChange = (preferredSound: SoundType) => {
    updatePreferences({ preferredSound });
  };

  const handleTechniqueSelect = (techniqueId: TechniqueId) => {
    updatePreferences({ defaultTechnique: techniqueId });
    setShowTechniquePicker(false);
  };

  const defaultTechnique = TECHNIQUES.find(
    (t) => t.id === preferences.defaultTechnique
  );

  return (
    <GradientBackground>
      <FloatingOrbs />
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
          <GlassCard style={styles.section}>
            <View style={styles.sectionContent}>
              <Text style={styles.sectionTitle}>Quick Start</Text>
              <SettingRow
                label="Default Technique"
                description={defaultTechnique?.name}
                onPress={() => setShowTechniquePicker(true)}
                rightElement={
                  <ChevronRight size={20} color={colors.text.secondary} />
                }
              />
            </View>
          </GlassCard>

          {/* Sound Preferences */}
          <GlassCard style={styles.section}>
            <View style={styles.sectionContent}>
              <Text style={styles.sectionTitle}>Sound</Text>
              <Text style={styles.sectionLabel}>Default Sound</Text>
              <View style={styles.soundGrid}>
                {SOUND_OPTIONS.map((option) => {
                  const isSelected = preferences.preferredSound === option.value;
                  return (
                    <Pressable
                      key={option.value}
                      style={[
                        styles.soundOption,
                        isSelected && styles.soundOptionSelected,
                      ]}
                      onPress={() => handleSoundChange(option.value)}
                    >
                      <option.iconName
                        size={28}
                        color={isSelected ? colors.accent.primary : colors.text.secondary}
                        strokeWidth={1.5}
                      />
                      <Text
                        style={[
                          styles.soundLabel,
                          isSelected && styles.soundLabelSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </GlassCard>

          {/* Appearance Section */}
          <GlassCard style={styles.section}>
            <View style={styles.sectionContent}>
              <Text style={styles.sectionTitle}>Appearance</Text>

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
            </View>
          </GlassCard>

          {/* About Section */}
          <GlassCard style={styles.section}>
            <View style={styles.sectionContent}>
              <Text style={styles.sectionTitle}>About</Text>
              <SettingRow
                label="Version"
                rightElement={<Text style={styles.versionText}>1.0.0</Text>}
              />
              <SettingRow
                label="Send Feedback"
                onPress={() => {}}
                rightElement={
                  <ChevronRight size={20} color={colors.text.secondary} />
                }
              />
            </View>
          </GlassCard>
        </ScrollView>

        {/* Technique Picker Modal */}
        <Modal
          visible={showTechniquePicker}
          animationType="slide"
          transparent
          onRequestClose={() => setShowTechniquePicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Default Technique</Text>
              {TECHNIQUES.map((technique) => (
                <Pressable
                  key={technique.id}
                  style={styles.techniqueOption}
                  onPress={() => handleTechniqueSelect(technique.id)}
                >
                  {React.createElement(techniqueIcons[technique.id] || Wind, {
                    size: 20,
                    color: colors.accent.primary,
                    strokeWidth: 1.5,
                  })}
                  <View style={styles.techniqueInfo}>
                    <Text style={styles.techniqueName}>{technique.name}</Text>
                    <Text style={styles.techniqueDesc}>{technique.description}</Text>
                  </View>
                  {preferences.defaultTechnique === technique.id && (
                    <Check size={20} color={colors.accent.primary} />
                  )}
                </Pressable>
              ))}
              <Pressable
                style={styles.modalCloseButton}
                onPress={() => setShowTechniquePicker(false)}
              >
                <Text style={styles.modalCloseText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
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
  section: {
    marginBottom: spacing.md,
  },
  sectionContent: {
    padding: spacing.lg,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  sectionLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  soundGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  soundOption: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  soundOptionSelected: {
    backgroundColor: 'rgba(100, 255, 218, 0.15)',
    borderColor: colors.accent.primary,
  },
  soundIcon: {
    marginBottom: spacing.xs,
  },
  soundLabel: {
    ...typography.body,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  soundLabelSelected: {
    color: colors.accent.primary,
    fontWeight: '600',
  },
  spacer: {
    height: spacing.md,
  },
  versionText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background.mid,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.lg,
    paddingBottom: spacing.xl + 20,
  },
  modalTitle: {
    ...typography.h2,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  techniqueOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.glass.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  techniqueIcon: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  techniqueInfo: {
    flex: 1,
  },
  techniqueName: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  techniqueDesc: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 2,
  },
  modalCloseButton: {
    backgroundColor: colors.glass.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  modalCloseText: {
    ...typography.body,
    color: colors.text.secondary,
  },
});
