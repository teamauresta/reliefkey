export interface VisualizationPhase {
  name: string;
  duration: number; // seconds
  prompts: string[];
}

export interface VisualizationScene {
  id: string;
  name: string;
  icon: string;
  description: string;
  gradientColors: readonly [string, string, string];
  particleColor: string;
  phases: VisualizationPhase[];
}

export const VISUALIZATION_SCENES: VisualizationScene[] = [
  {
    id: 'beach',
    name: 'Beach',
    icon: '🏖️',
    description: 'Warm sand and gentle waves',
    gradientColors: ['#0a1628', '#1e4a5c', '#2d6a7a'],
    particleColor: 'rgba(135, 206, 235, 0.6)',
    phases: [
      {
        name: 'Arrival',
        duration: 30,
        prompts: [
          'Close your eyes and take a deep breath...',
          'Imagine yourself walking toward a peaceful beach...',
          'Feel the warm sun on your skin...',
          'Hear the gentle sound of waves in the distance...',
        ],
      },
      {
        name: 'Immersion',
        duration: 60,
        prompts: [
          'Your feet sink into the warm, soft sand...',
          'A gentle breeze carries the scent of salt and sea...',
          'Watch the waves roll in, one after another...',
          'Each wave washes away a little more tension...',
          'The rhythm of the ocean matches your breathing...',
          'Feel completely at peace in this moment...',
        ],
      },
      {
        name: 'Deepening',
        duration: 30,
        prompts: [
          'Let any remaining thoughts drift away like clouds...',
          'You are safe, calm, and completely relaxed...',
          'Carry this peace with you as you return...',
        ],
      },
    ],
  },
  {
    id: 'forest',
    name: 'Forest',
    icon: '🌲',
    description: 'Peaceful woodland path',
    gradientColors: ['#0a1a0a', '#1a3a2a', '#2a4a3a'],
    particleColor: 'rgba(144, 238, 144, 0.5)',
    phases: [
      {
        name: 'Arrival',
        duration: 30,
        prompts: [
          'Close your eyes and breathe deeply...',
          'You find yourself at the entrance of a quiet forest...',
          'Tall trees surround you, their leaves rustling gently...',
          'The air is fresh and filled with earthy scents...',
        ],
      },
      {
        name: 'Immersion',
        duration: 60,
        prompts: [
          'Walk slowly along the soft forest path...',
          'Sunlight filters through the canopy above...',
          'Birds sing peaceful melodies in the distance...',
          'Feel the cool, soft moss beneath your feet...',
          'Each step takes you deeper into tranquility...',
          'The forest embraces you with calm and safety...',
        ],
      },
      {
        name: 'Deepening',
        duration: 30,
        prompts: [
          'Find a quiet spot and rest against an old tree...',
          'Let the peace of nature fill your entire being...',
          'Carry this serenity with you always...',
        ],
      },
    ],
  },
  {
    id: 'mountains',
    name: 'Mountains',
    icon: '🏔️',
    description: 'Crisp alpine serenity',
    gradientColors: ['#1a1a2e', '#2a3a5e', '#4a5a7e'],
    particleColor: 'rgba(255, 255, 255, 0.4)',
    phases: [
      {
        name: 'Arrival',
        duration: 30,
        prompts: [
          'Take a deep breath of crisp mountain air...',
          'You stand on a peaceful mountain meadow...',
          'Snow-capped peaks rise majestically around you...',
          'The air is pure and refreshingly cool...',
        ],
      },
      {
        name: 'Immersion',
        duration: 60,
        prompts: [
          'Gaze at the vast expanse before you...',
          'Clouds drift slowly past the distant peaks...',
          'Feel how small your worries seem from here...',
          'A gentle wind carries away all tension...',
          'The mountains have stood for millennia, unchanging...',
          'Feel their strength and stability within you...',
        ],
      },
      {
        name: 'Deepening',
        duration: 30,
        prompts: [
          'Sit on a sun-warmed rock and simply be...',
          'You are grounded, strong, and at peace...',
          'Take this mountain calm back with you...',
        ],
      },
    ],
  },
  {
    id: 'night-sky',
    name: 'Night Sky',
    icon: '🌌',
    description: 'Infinite starlit wonder',
    gradientColors: ['#050510', '#0a0a20', '#151530'],
    particleColor: 'rgba(255, 255, 255, 0.8)',
    phases: [
      {
        name: 'Arrival',
        duration: 30,
        prompts: [
          'Close your eyes and feel the cool night air...',
          'You lie on soft grass, gazing upward...',
          'Above you stretches an infinite canvas of stars...',
          'The world is quiet and still...',
        ],
      },
      {
        name: 'Immersion',
        duration: 60,
        prompts: [
          'Each star twinkles with ancient light...',
          'Feel how vast and peaceful the universe is...',
          'Your breathing slows to match the stillness...',
          'Shooting stars trace silent paths across the sky...',
          'You are part of something beautiful and infinite...',
          'All is calm, all is well...',
        ],
      },
      {
        name: 'Deepening',
        duration: 30,
        prompts: [
          'Let the cosmic peace wash over you completely...',
          'You are safe beneath this blanket of stars...',
          'Carry this infinite calm within you...',
        ],
      },
    ],
  },
];

export const PROMPT_DURATION = 8; // seconds per prompt
