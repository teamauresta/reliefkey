import { Technique, BreathingPattern, UserPreferences } from '../types';

export const TECHNIQUES: Technique[] = [
  {
    id: 'breathing',
    name: 'Guided Breathing',
    description: 'Calming breath patterns with haptic feedback',
    iconName: 'Wind',
    durationSeconds: null,
  },
  {
    id: 'audio-masking',
    name: 'Audio Masking',
    description: 'Ambient sounds for focus and calm',
    iconName: 'Volume2',
    durationSeconds: null,
  },
  {
    id: 'mental-distraction',
    name: 'Mental Distraction',
    description: 'Math problems to occupy your mind',
    iconName: 'BrainCircuit',
    durationSeconds: null,
  },
  {
    id: 'muscle-relaxation',
    name: 'Muscle Relaxation',
    description: 'Quick tension-release exercise',
    iconName: 'PersonStanding',
    durationSeconds: 90,
  },
  {
    id: 'visualization',
    name: 'Visualization',
    description: 'Guided calming imagery',
    iconName: 'Mountain',
    durationSeconds: 120,
  },
];

export const BREATHING_PATTERNS: Record<string, BreathingPattern> = {
  'box': { name: 'Box Breathing', inhale: 4, hold: 4, exhale: 4, rest: 4 },
  '4-7-8': { name: '4-7-8 Relaxing', inhale: 4, hold: 7, exhale: 8, rest: 0 },
  'simple': { name: 'Simple Calm', inhale: 4, hold: 0, exhale: 6, rest: 2 },
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  defaultTechnique: 'breathing',
  hapticEnabled: true,
  preferredSound: 'white-noise',
  theme: 'forest',
  animationIntensity: 'full',
  favorites: ['breathing'],
  customBreathingPatterns: [],
};

export const STORAGE_KEYS = {
  PREFERENCES: '@reliefkey/preferences',
  PROGRESS: '@reliefkey/progress',
  EXPOSURE_LOGS: '@reliefkey/exposure-logs',
};
