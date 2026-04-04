import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  Flame,
  Target,
  Clock,
  ChevronRight,
  Shield,
  Wind,
  Volume2,
  BrainCircuit,
  PersonStanding,
  Mountain,
  TrendingUp,
} from 'lucide-react-native';
import { ImageBackground, FloatingOrbs, GlassCard } from '../components/ui';
import { colors, typography, spacing } from '../theme';
import { useProgress } from '../hooks/useProgress';
import { ExposureTrainingScreen } from './ExposureTrainingScreen';
import { TechniqueId } from '../types';

const TECHNIQUE_ICONS: Record<TechniqueId, React.ElementType> = {
  'breathing': Wind,
  'audio-masking': Volume2,
  'mental-distraction': BrainCircuit,
  'muscle-relaxation': PersonStanding,
  'visualization': Mountain,
};

function formatRelativeDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function ProgressScreen() {
  const { progress, recentSessions } = useProgress();
  const [showExposure, setShowExposure] = useState(false);

  if (showExposure) {
    return <ExposureTrainingScreen onBack={() => setShowExposure(false)} />;
  }

  return (
    <ImageBackground>
      <FloatingOrbs />
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />

        <View style={styles.header}>
          <Text style={styles.title}>Progress</Text>
          <Text style={styles.subtitle}>Track your wellness journey</Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Stats Row */}
          <View style={styles.statsRow}>
            <GlassCard style={styles.statCard}>
              <View style={styles.statContent}>
                <View style={styles.statIconWrap}>
                  <Flame size={20} color={colors.accent.secondary} strokeWidth={2} />
                </View>
                <Text style={styles.statValue}>{progress.currentStreak}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
            </GlassCard>

            <GlassCard style={styles.statCard}>
              <View style={styles.statContent}>
                <View style={styles.statIconWrap}>
                  <Target size={20} color={colors.accent.primary} strokeWidth={2} />
                </View>
                <Text style={styles.statValue}>{progress.totalSessions}</Text>
                <Text style={styles.statLabel}>Sessions</Text>
              </View>
            </GlassCard>

            <GlassCard style={styles.statCard}>
              <View style={styles.statContent}>
                <View style={styles.statIconWrap}>
                  <Clock size={20} color="#a78bfa" strokeWidth={2} />
                </View>
                <Text style={styles.statValue}>{progress.totalMinutes}</Text>
                <Text style={styles.statLabel}>Minutes</Text>
              </View>
            </GlassCard>
          </View>

          {/* Exposure Training CTA */}
          <GlassCard onPress={() => setShowExposure(true)} style={styles.exposureCta}>
            <View style={styles.exposureRow}>
              <View style={styles.exposureIconWrap}>
                <Shield size={24} color={colors.accent.primary} strokeWidth={1.5} />
              </View>
              <View style={styles.exposureText}>
                <Text style={styles.exposureTitle}>Exposure Training</Text>
                <Text style={styles.exposureDesc}>Daily challenges to build confidence</Text>
              </View>
              <ChevronRight size={20} color={colors.text.secondary} strokeWidth={1.5} />
            </View>
          </GlassCard>

          {/* Recent Activity */}
          <View style={styles.sectionHeader}>
            <TrendingUp size={18} color={colors.accent.primary} strokeWidth={2} />
            <Text style={styles.sectionTitle}>Recent Activity</Text>
          </View>

          {recentSessions.length === 0 ? (
            <GlassCard>
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>
                  No sessions yet. Complete a technique to see your activity here.
                </Text>
              </View>
            </GlassCard>
          ) : (
            recentSessions.map((session) => {
              const Icon = TECHNIQUE_ICONS[session.techniqueId] || Wind;
              return (
                <GlassCard key={session.id} style={styles.sessionCard}>
                  <View style={styles.sessionRow}>
                    <View style={styles.sessionIconWrap}>
                      <Icon size={18} color={colors.accent.primary} strokeWidth={1.5} />
                    </View>
                    <View style={styles.sessionInfo}>
                      <Text style={styles.sessionName}>{session.techniqueName}</Text>
                      <Text style={styles.sessionMeta}>
                        {Math.round(session.durationSeconds / 60)}min
                        {' \u00B7 '}
                        {formatRelativeDate(session.completedAt)}
                      </Text>
                    </View>
                  </View>
                </GlassCard>
              );
            })
          )}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 120,
  },
  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    ...typography.h2,
    color: colors.text.primary,
  },
  statLabel: {
    ...typography.small,
    color: colors.text.secondary,
    marginTop: 2,
  },
  // Exposure CTA
  exposureCta: {
    marginBottom: spacing.lg,
  },
  exposureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exposureIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  exposureText: {
    flex: 1,
  },
  exposureTitle: {
    ...typography.h3,
    color: colors.text.primary,
  },
  exposureDesc: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 2,
  },
  // Section
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
  },
  // Empty
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  emptyText: {
    ...typography.body,
    color: colors.text.muted,
    textAlign: 'center',
    lineHeight: 24,
  },
  // Sessions
  sessionCard: {
    marginBottom: spacing.sm,
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(100, 255, 218, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionName: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '500',
  },
  sessionMeta: {
    ...typography.small,
    color: colors.text.secondary,
    marginTop: 2,
  },
});
