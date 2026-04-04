import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Clock, Sun, TreePine, Mountain, Star } from 'lucide-react-native';
import { VISUALIZATION_SCENES, VisualizationScene } from '../constants/visualizationScenes';
import { colors, typography, spacing } from '../theme';

interface VisualizationSelectorProps {
  onSelect: (scene: VisualizationScene) => void;
  onClose: () => void;
}

const SCENE_ICONS: Record<string, React.ComponentType<any>> = {
  Sun,
  TreePine,
  Mountain,
  Star,
};

export function VisualizationSelector({ onSelect, onClose }: VisualizationSelectorProps) {
  const getTotalDuration = (scene: VisualizationScene) => {
    const total = scene.phases.reduce((sum, phase) => sum + phase.duration, 0);
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    if (seconds === 0) return `${minutes} min`;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Visualization</Text>
        <Text style={styles.subtitle}>Choose a scene to explore</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {VISUALIZATION_SCENES.map((scene) => (
          <Pressable
            key={scene.id}
            style={styles.sceneCard}
            onPress={() => onSelect(scene)}
          >
            <LinearGradient
              colors={scene.gradientColors}
              style={styles.scenePreview}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {(() => {
                const IconComponent = SCENE_ICONS[scene.icon];
                return IconComponent ? <IconComponent size={36} color={colors.accent.primary} /> : null;
              })()}
            </LinearGradient>
            <View style={styles.sceneInfo}>
              <Text style={styles.sceneName}>{scene.name}</Text>
              <Text style={styles.sceneDescription}>{scene.description}</Text>
              <View style={styles.durationBadge}>
                <Clock size={12} color={colors.text.muted} />
                <Text style={styles.durationText}>{getTotalDuration(scene)}</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
  },
  header: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  sceneCard: {
    flexDirection: 'row',
    backgroundColor: colors.glass.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  scenePreview: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sceneIcon: {
    fontSize: 36,
  },
  sceneInfo: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'center',
  },
  sceneName: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  sceneDescription: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    ...typography.caption,
    color: colors.text.muted,
  },
});
