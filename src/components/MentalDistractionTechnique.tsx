import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { generateMathProblem, checkAnswer, MathProblem } from '../utils/mathProblems';

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
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={onClose}
        testID="close-button"
      >
        <Text style={styles.closeButtonText}>✕</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Mental Distraction</Text>
      <Text style={styles.score}>Score: {score}</Text>

      <View style={[
        styles.problemContainer,
        feedback === 'correct' && styles.correctFeedback,
        feedback === 'wrong' && styles.wrongFeedback,
      ]}>
        <Text style={styles.question} testID="math-question">
          {problem.question} = ?
        </Text>
        <Text style={styles.answer}>
          {userInput || '_'}
        </Text>
      </View>

      <View style={styles.numpad}>
        {[['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['C', '0', '⌫']].map((row, rowIndex) => (
          <View key={rowIndex} style={styles.numpadRow}>
            {row.map((key) => (
              <TouchableOpacity
                key={key}
                style={styles.numpadButton}
                onPress={() => {
                  if (key === 'C') handleClear();
                  else if (key === '⌫') handleBackspace();
                  else handleNumberPress(key);
                }}
              >
                <Text style={styles.numpadButtonText}>{key}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 80,
  },
  score: {
    fontSize: 18,
    color: '#7cd1f7',
    marginTop: 10,
    marginBottom: 30,
  },
  problemContainer: {
    backgroundColor: '#2a2a4e',
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 30,
    minWidth: 250,
  },
  correctFeedback: {
    backgroundColor: '#2e5a2e',
  },
  wrongFeedback: {
    backgroundColor: '#5a2e2e',
  },
  question: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  answer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#7cd1f7',
    marginTop: 15,
    minWidth: 100,
    textAlign: 'center',
  },
  numpad: {
    marginBottom: 20,
  },
  numpadRow: {
    flexDirection: 'row',
  },
  numpadButton: {
    width: 70,
    height: 70,
    backgroundColor: '#3a3a5e',
    borderRadius: 35,
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numpadButtonText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 60,
    paddingVertical: 16,
    borderRadius: 30,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
