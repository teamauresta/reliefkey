export const colors = {
  // Ocean Depths Background
  background: {
    start: '#0a1628',      // deep navy
    mid: '#134e5e',        // ocean teal
    end: '#1a3a4a',        // deep sea
  },
  // Glassmorphism
  glass: {
    surface: 'rgba(255, 255, 255, 0.08)',
    surfaceHover: 'rgba(255, 255, 255, 0.12)',
    border: 'rgba(255, 255, 255, 0.15)',
    borderLight: 'rgba(255, 255, 255, 0.1)',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
  // Accents
  accent: {
    primary: '#64ffda',    // seafoam
    secondary: '#ff8a80',  // coral
    primaryMuted: 'rgba(100, 255, 218, 0.3)',
  },
  // Text
  text: {
    primary: '#ffffff',
    secondary: '#94a3b8',
    muted: '#64748b',
  },
  // Floating orbs
  orbs: {
    teal: 'rgba(100, 255, 218, 0.3)',
    purple: 'rgba(139, 92, 246, 0.3)',
    pink: 'rgba(244, 114, 182, 0.25)',
  },
  // Semantic
  success: '#4ade80',
  error: '#f87171',
  // Gradients
  gradients: {
    ocean: ['#0a1628', '#134e5e', '#1a3a4a'],
    seafoam: ['#64ffda', '#4fd1c5'],
    glow: ['rgba(100, 255, 218, 0.4)', 'rgba(100, 255, 218, 0)'],
  },
} as const;

export type Colors = typeof colors;
