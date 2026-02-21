export type TechniqueId =
  | 'breathing'
  | 'audio-masking'
  | 'mental-distraction'
  | 'muscle-relaxation'
  | 'visualization';

export interface Technique {
  id: TechniqueId;
  name: string;
  description: string;
  icon: string;
  durationSeconds: number | null; // null = user-controlled
}

export type ThemeMode = 'forest' | 'meadow' | 'dusk';
export type AnimationIntensity = 'full' | 'reduced' | 'minimal';
export type SoundType =
  | 'white-noise'
  | 'sea-wave'
  | 'thunderstorm-jungle'
  | 'european-forest'
  | 'forest-bird'
  | 'night-forest'
  | 'summer-night'
  | 'wind-blowing'
  | 'wind-hum';

export interface UserPreferences {
  defaultTechnique: TechniqueId;
  hapticEnabled: boolean;
  preferredSound: SoundType;
  theme: ThemeMode;
  animationIntensity: AnimationIntensity;
  favorites: TechniqueId[];
  customBreathingPatterns: BreathingPattern[];
}

export type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

export interface BreathingPattern {
  name: string;
  inhale: number;
  hold: number;
  exhale: number;
  rest: number;
}
