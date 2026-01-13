export const colors = {
  // Backgrounds
  background: {
    primary: '#1a2e1a',
    secondary: '#2d4a3e',
    surface: 'rgba(62, 92, 78, 0.6)',
    surfaceSolid: '#3e5c4e',
  },
  // Accents
  accent: {
    warm: '#d4a574',
    warmLight: '#e8c9a0',
    calm: '#7eb8c9',
    calmLight: '#a8d4e0',
  },
  // Text
  text: {
    primary: '#f5f2eb',
    secondary: '#a8b5a0',
    muted: '#6b7a65',
  },
  // Semantic
  success: '#7cb87c',
  error: '#c97e7e',
  // Gradients
  gradients: {
    forest: ['#1a2e1a', '#2d4a3e', '#3e5c4e'],
    sky: ['#2d4a3e', '#3e5c4e', '#4a7a6a'],
    warmGlow: ['#d4a574', '#e8c9a0'],
  },
} as const;

export type Colors = typeof colors;
