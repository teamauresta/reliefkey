import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { generateMathProblem, checkAnswer, MathProblem } from '../utils/mathProblems';
import { GradientBackground, FloatingOrbs, GlassCard, TechniqueHeader } from './ui';
import { colors, spacing, typography } from '../theme';

interface MentalDistractionTechniqueProps {
  onClose: () => void;
}

export function MentalDistractionTechnique({ onClose }: MentalDistractionTechniqueProps) {
  const [problem, setProblem] = useState<MathProblem>(() => generateMathProblem('easy'));
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const handleNumberPress = useCallback((num: string) => {
    if (feedback) return; // Ignore input during feedback
    setUserInput((prev) => prev + num);
  }, [feedback]);

  const handleClear = useCallback(() => {
    setUserInput('');
  }, []);

  const handleSubmit = useCallback(() => {
    if (!userInput) return;

    const isCorrect = checkAnswer(problem, parseInt(userInput, 10));
    setFeedback(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      setScore((s) => s + 1);
    }

    // Show feedback briefly, then next problem
    setTimeout(() => {
      setProblem(generateMathProblem('easy'));
      setUserInput('');
      setFeedback(null);
    }, 800);
  }, [userInput, problem]);

  const handleBackspace = useCallback(() => {
    setUserInput((prev) => prev.slice(0, -1));
  }, []);

  return (
    <GradientBackground>
      <FloatingOrbs />
      <SafeAreaView style={styles.container} edges={['top']}>
        <TechniqueHeader
          title="Mental Distraction"
          onClose={onClose}
          rightElement={
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreLabel}>Score</Text>
              <Text style={styles.scoreValue}>{score}</Text>
            </View>
          }
        />

        <View style={styles.content}>
          <GlassCard
            style={[
              styles.problemContainer,
              feedback === 'correct' && styles.correctFeedback,
              feedback === 'wrong' && styles.wrongFeedback,
            ]}
            intensity="medium"
          >
            <Text style={styles.question} testID="math-question">
              {problem.question} = ?
            </Text>
            <Text style={styles.answer}>
              {userInput || '_'}
            </Text>
          </GlassCard>

          <View style={styles.numpad}>
            {[['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['C', '0', '⌫']].map((row, rowIndex) => (
              <View key={rowIndex} style={styles.numpadRow}>
                {row.map((key) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.numpadButton,
                      key === 'C' && styles.clearButton,
                      key === '⌫' && styles.backspaceButton,
                    ]}
                    onPress={() => {
                      if (key === 'C') handleClear();
                      else if (key === '⌫') handleBackspace();
                      else handleNumberPress(key);
                    }}
                  >
                    <Text style={[
                      styles.numpadButtonText,
                      (key === 'C' || key === '⌫') && styles.actionButtonText,
                    ]}>
                      {key}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
    alignItems: 'center',
  },
  scoreBadge: {
    backgroundColor: colors.accent.primaryMuted,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  scoreLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  scoreValue: {
    ...typography.h2,
    color: colors.accent.primary,
  },
  problemContainer: {
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
    minWidth: 280,
  },
  correctFeedback: {
    borderWidth: 2,
    borderColor: colors.success,
  },
  wrongFeedback: {
    borderWidth: 2,
    borderColor: colors.error,
  },
  question: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  answer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.accent.primary,
    marginTop: spacing.sm,
    minWidth: 100,
    textAlign: 'center',
  },
  numpad: {
    marginBottom: spacing.sm,
  },
  numpadRow: {
    flexDirection: 'row',
  },
  numpadButton: {
    width: 68,
    height: 68,
    backgroundColor: colors.glass.surface,
    borderRadius: 34,
    margin: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  clearButton: {
    backgroundColor: 'rgba(248, 113, 113, 0.2)',
    borderColor: colors.error,
  },
  backspaceButton: {
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
    borderColor: colors.text.secondary,
  },
  numpadButtonText: {
    fontSize: 28,
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  actionButtonText: {
    fontSize: 22,
  },
  submitButton: {
    backgroundColor: colors.success,
    paddingHorizontal: 80,
    paddingVertical: spacing.md,
    borderRadius: 30,
  },
  submitButtonText: {
    color: colors.text.primary,
    fontSize: 22,
    fontWeight: 'bold',
  },
});
