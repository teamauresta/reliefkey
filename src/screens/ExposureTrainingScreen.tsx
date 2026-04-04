import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  ArrowLeft,
  Shield,
  Star,
  CheckCircle,
  Circle,
  MinusCircle,
  ChevronDown,
  ChevronUp,
  Trophy,
  TrendingDown,
  Hash,
  DoorOpen,
  Timer,
  MapPin,
  Users,
  Clock,
  VolumeX,
  UserPlus,
  Hourglass,
  Navigation,
} from 'lucide-react-native';
import { ImageBackground, FloatingOrbs, GlassCard } from '../components/ui';
import { colors, typography, spacing } from '../theme';
import { useExposureTraining } from '../hooks/useExposureTraining';
import { ExposureChallenge, ChallengeOutcome, ChallengeDifficulty } from '../types';

const ICON_MAP: Record<string, React.ElementType> = {
  DoorOpen, Timer, MapPin, Users, Clock, VolumeX, UserPlus, Hourglass, Navigation,
};

const DIFFICULTY_COLORS: Record<ChallengeDifficulty, string> = {
  easy: colors.success,
  medium: '#fbbf24',
  hard: colors.accent.secondary,
};

interface Props {
  onBack: () => void;
}

type FlowStep = 'home' | 'pre-anxiety' | 'post-anxiety' | 'outcome' | 'notes';

export function ExposureTrainingScreen({ onBack }: Props) {
  const { dailyChallenge, allChallenges, logs, completedToday, stats, logEntry } =
    useExposureTraining();

  const [selectedChallenge, setSelectedChallenge] = useState<ExposureChallenge | null>(null);
  const [flowStep, setFlowStep] = useState<FlowStep>('home');
  const [preAnxiety, setPreAnxiety] = useState(5);
  const [postAnxiety, setPostAnxiety] = useState(5);
  const [outcome, setOutcome] = useState<ChallengeOutcome>('success');
  const [notes, setNotes] = useState('');
  const [showAllChallenges, setShowAllChallenges] = useState(false);

  const startChallenge = (challenge: ExposureChallenge) => {
    setSelectedChallenge(challenge);
    setPreAnxiety(5);
    setPostAnxiety(5);
    setOutcome('success');
    setNotes('');
    setFlowStep('pre-anxiety');
  };

  const submitLog = async () => {
    if (!selectedChallenge) return;
    await logEntry(selectedChallenge, preAnxiety, postAnxiety, outcome, notes);
    setFlowStep('home');
    setSelectedChallenge(null);
  };

  // Anxiety picker (1-10)
  const renderAnxietyPicker = (value: number, onChange: (v: number) => void) => (
    <View style={styles.anxietyPicker}>
      <View style={styles.anxietyScale}>
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <Pressable
            key={n}
            onPress={() => onChange(n)}
            style={[
              styles.anxietyButton,
              n === value && styles.anxietyButtonActive,
            ]}
          >
            <Text
              style={[
                styles.anxietyButtonText,
                n === value && styles.anxietyButtonTextActive,
              ]}
            >
              {n}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.anxietyLabels}>
        <Text style={styles.anxietyLabel}>Calm</Text>
        <Text style={styles.anxietyLabel}>Very anxious</Text>
      </View>
    </View>
  );

  // Flow screens
  if (flowStep === 'pre-anxiety' && selectedChallenge) {
    return (
      <ImageBackground>
        <FloatingOrbs />
        <SafeAreaView style={styles.container}>
          <StatusBar style="light" />
          <View style={styles.flowHeader}>
            <Pressable onPress={() => setFlowStep('home')} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text.primary} strokeWidth={1.5} />
            </Pressable>
            <Text style={styles.flowTitle}>Before the Challenge</Text>
          </View>
          <ScrollView contentContainerStyle={styles.flowContent}>
            <GlassCard>
              <Text style={styles.challengeNameFlow}>{selectedChallenge.title}</Text>
              <Text style={styles.flowQuestion}>How anxious do you feel right now?</Text>
              {renderAnxietyPicker(preAnxiety, setPreAnxiety)}
            </GlassCard>
            <Pressable style={styles.primaryButton} onPress={() => setFlowStep('post-anxiety')}>
              <Text style={styles.primaryButtonText}>I did the challenge</Text>
            </Pressable>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  if (flowStep === 'post-anxiety' && selectedChallenge) {
    return (
      <ImageBackground>
        <FloatingOrbs />
        <SafeAreaView style={styles.container}>
          <StatusBar style="light" />
          <View style={styles.flowHeader}>
            <Pressable onPress={() => setFlowStep('pre-anxiety')} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text.primary} strokeWidth={1.5} />
            </Pressable>
            <Text style={styles.flowTitle}>After the Challenge</Text>
          </View>
          <ScrollView contentContainerStyle={styles.flowContent}>
            <GlassCard>
              <Text style={styles.flowQuestion}>How anxious do you feel now?</Text>
              {renderAnxietyPicker(postAnxiety, setPostAnxiety)}
            </GlassCard>
            <Pressable style={styles.primaryButton} onPress={() => setFlowStep('outcome')}>
              <Text style={styles.primaryButtonText}>Next</Text>
            </Pressable>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  if (flowStep === 'outcome' && selectedChallenge) {
    const outcomes: { key: ChallengeOutcome; label: string; icon: React.ElementType; color: string }[] = [
      { key: 'success', label: 'Success', icon: CheckCircle, color: colors.success },
      { key: 'partial', label: 'Partial', icon: MinusCircle, color: '#fbbf24' },
      { key: 'couldnt-go', label: "Couldn't go", icon: Circle, color: colors.text.secondary },
    ];

    return (
      <ImageBackground>
        <FloatingOrbs />
        <SafeAreaView style={styles.container}>
          <StatusBar style="light" />
          <View style={styles.flowHeader}>
            <Pressable onPress={() => setFlowStep('post-anxiety')} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text.primary} strokeWidth={1.5} />
            </Pressable>
            <Text style={styles.flowTitle}>How did it go?</Text>
          </View>
          <ScrollView contentContainerStyle={styles.flowContent}>
            <View style={styles.outcomeOptions}>
              {outcomes.map(({ key, label, icon: Icon, color }) => (
                <GlassCard
                  key={key}
                  onPress={() => setOutcome(key)}
                  style={[
                    styles.outcomeCard,
                    outcome === key && { borderColor: color, borderWidth: 2 },
                  ]}
                >
                  <View style={styles.outcomeInner}>
                    <Icon size={32} color={color} strokeWidth={1.5} />
                    <Text style={styles.outcomeLabel}>{label}</Text>
                  </View>
                </GlassCard>
              ))}
            </View>
            <Pressable style={styles.primaryButton} onPress={() => setFlowStep('notes')}>
              <Text style={styles.primaryButtonText}>Next</Text>
            </Pressable>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  if (flowStep === 'notes' && selectedChallenge) {
    return (
      <ImageBackground>
        <FloatingOrbs />
        <SafeAreaView style={styles.container}>
          <StatusBar style="light" />
          <View style={styles.flowHeader}>
            <Pressable onPress={() => setFlowStep('outcome')} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text.primary} strokeWidth={1.5} />
            </Pressable>
            <Text style={styles.flowTitle}>Notes (Optional)</Text>
          </View>
          <ScrollView contentContainerStyle={styles.flowContent}>
            <GlassCard>
              <TextInput
                style={styles.notesInput}
                placeholder="How did you feel? Any thoughts..."
                placeholderTextColor={colors.text.muted}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </GlassCard>
            <Pressable style={styles.primaryButton} onPress={submitLog}>
              <Text style={styles.primaryButtonText}>Save Entry</Text>
            </Pressable>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  // Home screen
  const ChallengeIcon = ICON_MAP[dailyChallenge.iconName] || Shield;

  return (
    <ImageBackground>
      <FloatingOrbs />
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />

        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.text.primary} strokeWidth={1.5} />
          </Pressable>
          <Text style={styles.screenTitle}>Exposure Training</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Stats mini-row */}
          <View style={styles.miniStats}>
            <View style={styles.miniStat}>
              <Trophy size={16} color={colors.success} strokeWidth={2} />
              <Text style={styles.miniStatText}>{stats.successCount} successes</Text>
            </View>
            <View style={styles.miniStat}>
              <Hash size={16} color={colors.accent.primary} strokeWidth={2} />
              <Text style={styles.miniStatText}>{stats.totalEntries} total</Text>
            </View>
            {stats.averageAnxietyReduction > 0 && (
              <View style={styles.miniStat}>
                <TrendingDown size={16} color="#a78bfa" strokeWidth={2} />
                <Text style={styles.miniStatText}>
                  -{stats.averageAnxietyReduction.toFixed(1)} avg
                </Text>
              </View>
            )}
          </View>

          {/* Daily Challenge */}
          <Text style={styles.sectionLabel}>Today's Challenge</Text>
          <GlassCard
            onPress={completedToday ? undefined : () => startChallenge(dailyChallenge)}
            style={styles.dailyCard}
          >
            <View style={styles.dailyRow}>
              <View style={styles.dailyIconWrap}>
                <ChallengeIcon size={28} color={colors.accent.primary} strokeWidth={1.5} />
              </View>
              <View style={styles.dailyInfo}>
                <View style={styles.dailyTitleRow}>
                  <Text style={styles.dailyTitle}>{dailyChallenge.title}</Text>
                  <View
                    style={[
                      styles.diffBadge,
                      { backgroundColor: DIFFICULTY_COLORS[dailyChallenge.difficulty] + '20' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.diffBadgeText,
                        { color: DIFFICULTY_COLORS[dailyChallenge.difficulty] },
                      ]}
                    >
                      {dailyChallenge.difficulty}
                    </Text>
                  </View>
                </View>
                <Text style={styles.dailyDesc}>{dailyChallenge.description}</Text>
                {completedToday && (
                  <View style={styles.completedBadge}>
                    <CheckCircle size={14} color={colors.success} strokeWidth={2} />
                    <Text style={styles.completedText}>Completed today</Text>
                  </View>
                )}
              </View>
            </View>
          </GlassCard>

          {/* All challenges */}
          <Pressable
            onPress={() => setShowAllChallenges(!showAllChallenges)}
            style={styles.toggleRow}
          >
            <Text style={styles.sectionLabel}>All Challenges</Text>
            {showAllChallenges ? (
              <ChevronUp size={20} color={colors.text.secondary} />
            ) : (
              <ChevronDown size={20} color={colors.text.secondary} />
            )}
          </Pressable>

          {showAllChallenges &&
            allChallenges.map((challenge) => {
              const Icon = ICON_MAP[challenge.iconName] || Shield;
              return (
                <GlassCard
                  key={challenge.id}
                  onPress={() => startChallenge(challenge)}
                  style={styles.challengeCard}
                >
                  <View style={styles.challengeRow}>
                    <View style={styles.challengeIconWrap}>
                      <Icon size={20} color={colors.accent.primary} strokeWidth={1.5} />
                    </View>
                    <View style={styles.challengeInfo}>
                      <Text style={styles.challengeName}>{challenge.title}</Text>
                      <Text style={styles.challengeDiff}>{challenge.difficulty}</Text>
                    </View>
                  </View>
                </GlassCard>
              );
            })}

          {/* Recent Logs */}
          {logs.length > 0 && (
            <>
              <Text style={[styles.sectionLabel, { marginTop: spacing.lg }]}>Recent Entries</Text>
              {logs.slice(0, 5).map((log) => (
                <GlassCard key={log.id} style={styles.logCard}>
                  <View style={styles.logRow}>
                    <View style={styles.logLeft}>
                      <Text style={styles.logTitle}>{log.challengeTitle}</Text>
                      <Text style={styles.logMeta}>
                        {log.outcome === 'success' ? 'Success' : log.outcome === 'partial' ? 'Partial' : "Couldn't go"}
                        {' \u00B7 '}
                        Anxiety: {log.preAnxiety} → {log.postAnxiety}
                      </Text>
                    </View>
                    <View style={styles.logRight}>
                      {log.outcome === 'success' ? (
                        <Star size={18} color={colors.success} fill={colors.success} strokeWidth={0} />
                      ) : log.outcome === 'partial' ? (
                        <MinusCircle size={18} color="#fbbf24" strokeWidth={1.5} />
                      ) : (
                        <Circle size={18} color={colors.text.muted} strokeWidth={1.5} />
                      )}
                    </View>
                  </View>
                </GlassCard>
              ))}
            </>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  screenTitle: {
    ...typography.h1,
    color: colors.text.primary,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 120,
  },
  // Mini stats
  miniStats: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  miniStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  miniStatText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  // Section
  sectionLabel: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  // Daily challenge
  dailyCard: {
    marginBottom: spacing.lg,
  },
  dailyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dailyIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  dailyInfo: {
    flex: 1,
  },
  dailyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  dailyTitle: {
    ...typography.h3,
    color: colors.text.primary,
  },
  diffBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  diffBadgeText: {
    ...typography.small,
    fontWeight: '600',
  },
  dailyDesc: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 4,
    lineHeight: 20,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.sm,
  },
  completedText: {
    ...typography.small,
    color: colors.success,
    fontWeight: '500',
  },
  // Toggle
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  // Challenge list
  challengeCard: {
    marginBottom: spacing.sm,
  },
  challengeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  challengeIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(100, 255, 218, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeName: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '500',
  },
  challengeDiff: {
    ...typography.small,
    color: colors.text.secondary,
    textTransform: 'capitalize',
    marginTop: 2,
  },
  // Log entries
  logCard: {
    marginBottom: spacing.sm,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logLeft: {
    flex: 1,
  },
  logTitle: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '500',
  },
  logMeta: {
    ...typography.small,
    color: colors.text.secondary,
    marginTop: 2,
  },
  logRight: {
    marginLeft: spacing.md,
  },
  // Flow screens
  flowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  flowTitle: {
    ...typography.h2,
    color: colors.text.primary,
  },
  flowContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 120,
  },
  challengeNameFlow: {
    ...typography.h3,
    color: colors.accent.primary,
    marginBottom: spacing.md,
  },
  flowQuestion: {
    ...typography.body,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  // Anxiety picker
  anxietyPicker: {
    marginTop: spacing.sm,
  },
  anxietyScale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  anxietyButton: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  anxietyButtonActive: {
    backgroundColor: 'rgba(100, 255, 218, 0.15)',
    borderColor: colors.accent.primary,
  },
  anxietyButtonText: {
    ...typography.body,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  anxietyButtonTextActive: {
    color: colors.accent.primary,
  },
  anxietyLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  anxietyLabel: {
    ...typography.small,
    color: colors.text.muted,
  },
  // Outcome
  outcomeOptions: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  outcomeCard: {
    borderWidth: 1,
    borderColor: 'transparent',
  },
  outcomeInner: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  outcomeLabel: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '500',
  },
  // Notes
  notesInput: {
    ...typography.body,
    color: colors.text.primary,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  // Primary button
  primaryButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.accent.primary,
    paddingVertical: spacing.md,
    borderRadius: 24,
    alignItems: 'center',
  },
  primaryButtonText: {
    ...typography.button,
    color: colors.background.start,
  },
});
