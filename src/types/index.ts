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

export interface UserPreferences {
  defaultTechnique: TechniqueId;
  hapticEnabled: boolean;
  preferredSound: 'white-noise' | 'rain' | 'water';
}

export type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

export interface BreathingPattern {
  name: string;
  inhale: number;
  hold: number;
  exhale: number;
  rest: number;
}
