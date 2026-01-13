import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useBreathing } from '../hooks/useBreathing';
import { BREATHING_PATTERNS } from '../constants';

interface BreathingTechniqueProps {
  hapticEnabled: boolean;
  onClose?: () => void;
}

const PHASE_LABELS: Record<string, string> = {
  inhale: 'Inhale',
  hold: 'Hold',
  exhale: 'Exhale',
  rest: 'Rest',
};

export function BreathingTechnique({ hapticEnabled, onClose }: BreathingTechniqueProps) {
  const { isActive, phase, secondsRemaining, cycleCount, start, stop } = useBreathing({
    pattern: BREATHING_PATTERNS['box'],
    hapticEnabled,
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={onClose}
        testID="close-button"
      >
        <Text style={styles.closeButtonText}>✕</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Guided Breathing</Text>

      {isActive ? (
        <View style={styles.activeContainer}>
          <View style={styles.phaseCircle}>
            <Text style={styles.phaseText}>{PHASE_LABELS[phase]}</Text>
            <Text style={styles.timerText}>{secondsRemaining}</Text>
          </View>
          <Text style={styles.cycleText}>Cycle {cycleCount + 1}</Text>
          <TouchableOpacity style={styles.stopButton} onPress={stop}>
            <Text style={styles.buttonText}>Stop</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.inactiveContainer}>
          <Text style={styles.instructionText}>
            Follow the breathing pattern.{'\n'}
            Haptic feedback will guide you.
          </Text>
          <TouchableOpacity style={styles.startButton} onPress={start}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: 40,
  },
  activeContainer: {
    alignItems: 'center',
  },
  inactiveContainer: {
    alignItems: 'center',
  },
  phaseCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#4a4a6a',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  phaseText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#7cd1f7',
    marginTop: 10,
  },
  cycleText: {
    fontSize: 18,
    color: '#aaa',
    marginBottom: 30,
  },
  instructionText: {
    fontSize: 18,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 28,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 60,
    paddingVertical: 20,
    borderRadius: 40,
  },
  stopButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 60,
    paddingVertical: 20,
    borderRadius: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
});
