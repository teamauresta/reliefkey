export interface MuscleGroup {
  id: string;
  name: string;
  instruction: string;
  tenseDuration: number;
  releaseDuration: number;
}

export const MUSCLE_GROUPS: Record<string, MuscleGroup[]> = {
  quick: [
    {
      id: 'hands',
      name: 'Hands',
      instruction: 'Make tight fists with both hands',
      tenseDuration: 5,
      releaseDuration: 10,
    },
    {
      id: 'shoulders',
      name: 'Shoulders',
      instruction: 'Raise shoulders up toward your ears',
      tenseDuration: 5,
      releaseDuration: 10,
    },
    {
      id: 'face',
      name: 'Face',
      instruction: 'Scrunch up your whole face tightly',
      tenseDuration: 5,
      releaseDuration: 10,
    },
    {
      id: 'stomach',
      name: 'Stomach',
      instruction: 'Tighten your abdominal muscles',
      tenseDuration: 5,
      releaseDuration: 10,
    },
    {
      id: 'legs',
      name: 'Legs',
      instruction: 'Tense your thighs and calves',
      tenseDuration: 5,
      releaseDuration: 10,
    },
  ],
  standard: [
    {
      id: 'hands',
      name: 'Hands',
      instruction: 'Make tight fists with both hands',
      tenseDuration: 5,
      releaseDuration: 10,
    },
    {
      id: 'forearms',
      name: 'Forearms',
      instruction: 'Bend wrists back, tensing forearms',
      tenseDuration: 5,
      releaseDuration: 10,
    },
    {
      id: 'upper-arms',
      name: 'Upper Arms',
      instruction: 'Bend elbows and tense biceps',
      tenseDuration: 5,
      releaseDuration: 10,
    },
    {
      id: 'shoulders',
      name: 'Shoulders',
      instruction: 'Raise shoulders up toward your ears',
      tenseDuration: 5,
      releaseDuration: 10,
    },
    {
      id: 'face',
      name: 'Face',
      instruction: 'Scrunch up your whole face tightly',
      tenseDuration: 5,
      releaseDuration: 10,
    },
    {
      id: 'stomach',
      name: 'Stomach',
      instruction: 'Tighten your abdominal muscles',
      tenseDuration: 5,
      releaseDuration: 10,
    },
    {
      id: 'legs',
      name: 'Legs',
      instruction: 'Tense your thighs and calves',
      tenseDuration: 5,
      releaseDuration: 10,
    },
  ],
};

export const SESSION_INFO = {
  quick: {
    label: 'Quick',
    duration: '2 min',
    description: '5 muscle groups for fast relief',
  },
  standard: {
    label: 'Standard',
    duration: '5 min',
    description: '7 muscle groups for deeper relaxation',
  },
};

export const TRANSITION_DURATION = 2; // seconds between muscle groups
