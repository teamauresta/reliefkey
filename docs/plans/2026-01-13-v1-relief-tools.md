# ReliefKey v1.0 Relief Tools Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the core relief tools feature - five techniques (breathing, audio masking, mental distraction, muscle relaxation, visualization) with one-tap quick-launch and offline support.

**Architecture:** Single-screen app with technique selector and active technique view. Techniques are self-contained components that handle their own audio/haptics. Preferences stored locally via AsyncStorage. Audio files bundled with app for offline use.

**Tech Stack:** Expo 54, React Native, TypeScript, expo-av (audio), expo-haptics (vibration), @react-native-async-storage/async-storage (preferences), Jest (testing)

---

## Phase 1: Project Foundation

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install required packages**

Run:
```bash
cd ~/Projects/reliefkey
npx expo install expo-av expo-haptics @react-native-async-storage/async-storage
npm install --save-dev @testing-library/react-native @testing-library/jest-native
```

**Step 2: Verify installation**

Run: `npm ls expo-av expo-haptics @react-native-async-storage/async-storage`
Expected: All packages listed without errors

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install audio, haptics, and storage dependencies"
```

---

### Task 2: Configure Jest for Testing

**Files:**
- Create: `jest.config.js`
- Create: `jest.setup.js`
- Modify: `package.json`

**Step 1: Create Jest config**

Create `jest.config.js`:
```javascript
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['./jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
  ],
};
```

**Step 2: Create Jest setup file**

Create `jest.setup.js`:
```javascript
import '@testing-library/jest-native/extend-expect';

// Mock expo-av
jest.mock('expo-av', () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn(() => Promise.resolve({ sound: { playAsync: jest.fn(), stopAsync: jest.fn(), unloadAsync: jest.fn() } })),
    },
    setAudioModeAsync: jest.fn(() => Promise.resolve()),
  },
}));

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));
```

**Step 3: Add test script to package.json**

Add to `package.json` scripts section:
```json
"test": "jest",
"test:watch": "jest --watch",
"test:coverage": "jest --coverage"
```

**Step 4: Verify Jest runs**

Run: `npm test -- --passWithNoTests`
Expected: "No tests found" but exits with code 0

**Step 5: Commit**

```bash
git add jest.config.js jest.setup.js package.json
git commit -m "chore: configure Jest with expo mocks"
```

---

### Task 3: Create Project Structure

**Files:**
- Create: `src/types/index.ts`
- Create: `src/constants/index.ts`
- Create: `src/components/.gitkeep`
- Create: `src/screens/.gitkeep`
- Create: `src/hooks/.gitkeep`
- Create: `src/utils/.gitkeep`
- Create: `assets/audio/.gitkeep`

**Step 1: Create directory structure**

Run:
```bash
cd ~/Projects/reliefkey
mkdir -p src/{types,constants,components,screens,hooks,utils}
mkdir -p assets/audio
touch src/components/.gitkeep src/screens/.gitkeep src/hooks/.gitkeep src/utils/.gitkeep assets/audio/.gitkeep
```

**Step 2: Create types file**

Create `src/types/index.ts`:
```typescript
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
```

**Step 3: Create constants file**

Create `src/constants/index.ts`:
```typescript
import { Technique, BreathingPattern, UserPreferences } from '../types';

export const TECHNIQUES: Technique[] = [
  {
    id: 'breathing',
    name: 'Guided Breathing',
    description: 'Calming breath patterns with haptic feedback',
    icon: '🌬️',
    durationSeconds: null,
  },
  {
    id: 'audio-masking',
    name: 'Audio Masking',
    description: 'White noise, rain, or water sounds',
    icon: '🔊',
    durationSeconds: null,
  },
  {
    id: 'mental-distraction',
    name: 'Mental Distraction',
    description: 'Math problems to occupy your mind',
    icon: '🧮',
    durationSeconds: null,
  },
  {
    id: 'muscle-relaxation',
    name: 'Muscle Relaxation',
    description: 'Quick tension-release exercise',
    icon: '💆',
    durationSeconds: 90,
  },
  {
    id: 'visualization',
    name: 'Visualization',
    description: 'Guided calming imagery',
    icon: '🏞️',
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
};

export const STORAGE_KEYS = {
  PREFERENCES: '@reliefkey/preferences',
};
```

**Step 4: Update tsconfig for path aliases**

Replace `tsconfig.json`:
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/types": ["src/types"],
      "@/constants": ["src/constants"],
      "@/components/*": ["src/components/*"],
      "@/screens/*": ["src/screens/*"],
      "@/hooks/*": ["src/hooks/*"],
      "@/utils/*": ["src/utils/*"]
    }
  }
}
```

**Step 5: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 6: Commit**

```bash
git add -A
git commit -m "chore: create project structure with types and constants"
```

---

## Phase 2: Core Infrastructure

### Task 4: Create Preferences Hook

**Files:**
- Create: `src/hooks/usePreferences.ts`
- Create: `src/hooks/__tests__/usePreferences.test.ts`

**Step 1: Write the failing test**

Create `src/hooks/__tests__/usePreferences.test.ts`:
```typescript
import { renderHook, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePreferences } from '../usePreferences';
import { DEFAULT_PREFERENCES } from '../../constants';

describe('usePreferences', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns default preferences initially', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => usePreferences());

    await waitFor(() => {
      expect(result.current.preferences).toEqual(DEFAULT_PREFERENCES);
    });
  });

  it('loads saved preferences from storage', async () => {
    const saved = { ...DEFAULT_PREFERENCES, hapticEnabled: false };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(saved));

    const { result } = renderHook(() => usePreferences());

    await waitFor(() => {
      expect(result.current.preferences.hapticEnabled).toBe(false);
    });
  });

  it('saves preferences when updated', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => usePreferences());

    await waitFor(() => {
      expect(result.current.preferences).toBeDefined();
    });

    await act(async () => {
      await result.current.updatePreferences({ hapticEnabled: false });
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@reliefkey/preferences',
      expect.stringContaining('"hapticEnabled":false')
    );
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/hooks/__tests__/usePreferences.test.ts`
Expected: FAIL - "Cannot find module '../usePreferences'"

**Step 3: Write minimal implementation**

Create `src/hooks/usePreferences.ts`:
```typescript
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferences } from '../types';
import { DEFAULT_PREFERENCES, STORAGE_KEYS } from '../constants';

export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.PREFERENCES);
      if (stored) {
        setPreferences(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreferences = useCallback(async (updates: Partial<UserPreferences>) => {
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(newPreferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }, [preferences]);

  return { preferences, updatePreferences, isLoading };
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- src/hooks/__tests__/usePreferences.test.ts`
Expected: PASS (3 tests)

**Step 5: Commit**

```bash
git add src/hooks/
git commit -m "feat: add usePreferences hook with AsyncStorage persistence"
```

---

### Task 5: Create Haptic Feedback Utility

**Files:**
- Create: `src/utils/haptics.ts`
- Create: `src/utils/__tests__/haptics.test.ts`

**Step 1: Write the failing test**

Create `src/utils/__tests__/haptics.test.ts`:
```typescript
import * as Haptics from 'expo-haptics';
import { triggerHaptic, HapticPattern } from '../haptics';

describe('haptics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('triggers light haptic feedback', async () => {
    await triggerHaptic('light');
    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
  });

  it('triggers medium haptic feedback', async () => {
    await triggerHaptic('medium');
    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Medium);
  });

  it('does nothing when disabled', async () => {
    await triggerHaptic('light', false);
    expect(Haptics.impactAsync).not.toHaveBeenCalled();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/utils/__tests__/haptics.test.ts`
Expected: FAIL - "Cannot find module '../haptics'"

**Step 3: Write minimal implementation**

Create `src/utils/haptics.ts`:
```typescript
import * as Haptics from 'expo-haptics';

export type HapticPattern = 'light' | 'medium' | 'heavy';

const HAPTIC_MAP: Record<HapticPattern, Haptics.ImpactFeedbackStyle> = {
  light: Haptics.ImpactFeedbackStyle.Light,
  medium: Haptics.ImpactFeedbackStyle.Medium,
  heavy: Haptics.ImpactFeedbackStyle.Heavy,
};

export async function triggerHaptic(
  pattern: HapticPattern,
  enabled: boolean = true
): Promise<void> {
  if (!enabled) return;
  await Haptics.impactAsync(HAPTIC_MAP[pattern]);
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- src/utils/__tests__/haptics.test.ts`
Expected: PASS (3 tests)

**Step 5: Commit**

```bash
git add src/utils/
git commit -m "feat: add haptic feedback utility"
```

---

## Phase 3: Breathing Technique

### Task 6: Create Breathing Hook

**Files:**
- Create: `src/hooks/useBreathing.ts`
- Create: `src/hooks/__tests__/useBreathing.test.ts`

**Step 1: Write the failing test**

Create `src/hooks/__tests__/useBreathing.test.ts`:
```typescript
import { renderHook, act } from '@testing-library/react-native';
import { useBreathing } from '../useBreathing';
import { BREATHING_PATTERNS } from '../../constants';

describe('useBreathing', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('starts in idle state', () => {
    const { result } = renderHook(() => useBreathing());
    expect(result.current.isActive).toBe(false);
    expect(result.current.phase).toBe('inhale');
  });

  it('cycles through breathing phases when active', () => {
    const { result } = renderHook(() =>
      useBreathing({ pattern: BREATHING_PATTERNS['simple'], hapticEnabled: true })
    );

    act(() => {
      result.current.start();
    });

    expect(result.current.isActive).toBe(true);
    expect(result.current.phase).toBe('inhale');

    // Advance through inhale (4 seconds)
    act(() => {
      jest.advanceTimersByTime(4000);
    });
    expect(result.current.phase).toBe('exhale');

    // Advance through exhale (6 seconds)
    act(() => {
      jest.advanceTimersByTime(6000);
    });
    expect(result.current.phase).toBe('rest');
  });

  it('stops when stop is called', () => {
    const { result } = renderHook(() => useBreathing());

    act(() => {
      result.current.start();
    });
    expect(result.current.isActive).toBe(true);

    act(() => {
      result.current.stop();
    });
    expect(result.current.isActive).toBe(false);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/hooks/__tests__/useBreathing.test.ts`
Expected: FAIL - "Cannot find module '../useBreathing'"

**Step 3: Write minimal implementation**

Create `src/hooks/useBreathing.ts`:
```typescript
import { useState, useEffect, useRef, useCallback } from 'react';
import { BreathingPattern, BreathingPhase } from '../types';
import { BREATHING_PATTERNS } from '../constants';
import { triggerHaptic } from '../utils/haptics';

interface UseBreathingOptions {
  pattern?: BreathingPattern;
  hapticEnabled?: boolean;
}

interface UseBreathingReturn {
  isActive: boolean;
  phase: BreathingPhase;
  secondsRemaining: number;
  cycleCount: number;
  start: () => void;
  stop: () => void;
  setPattern: (pattern: BreathingPattern) => void;
}

const PHASE_ORDER: BreathingPhase[] = ['inhale', 'hold', 'exhale', 'rest'];

export function useBreathing(options: UseBreathingOptions = {}): UseBreathingReturn {
  const [pattern, setPattern] = useState<BreathingPattern>(
    options.pattern ?? BREATHING_PATTERNS['box']
  );
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<BreathingPhase>('inhale');
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);

  const hapticEnabled = options.hapticEnabled ?? true;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const getPhaseDuration = useCallback((p: BreathingPhase): number => {
    switch (p) {
      case 'inhale': return pattern.inhale;
      case 'hold': return pattern.hold;
      case 'exhale': return pattern.exhale;
      case 'rest': return pattern.rest;
    }
  }, [pattern]);

  const getNextPhase = useCallback((current: BreathingPhase): BreathingPhase => {
    const currentIndex = PHASE_ORDER.indexOf(current);
    let nextIndex = (currentIndex + 1) % PHASE_ORDER.length;

    // Skip phases with 0 duration
    while (getPhaseDuration(PHASE_ORDER[nextIndex]) === 0) {
      nextIndex = (nextIndex + 1) % PHASE_ORDER.length;
    }

    return PHASE_ORDER[nextIndex];
  }, [getPhaseDuration]);

  const start = useCallback(() => {
    setIsActive(true);
    setPhase('inhale');
    setSecondsRemaining(getPhaseDuration('inhale'));
    setCycleCount(0);
    triggerHaptic('medium', hapticEnabled);
  }, [getPhaseDuration, hapticEnabled]);

  const stop = useCallback(() => {
    setIsActive(false);
    setPhase('inhale');
    setSecondsRemaining(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isActive) return;

    intervalRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          const nextPhase = getNextPhase(phase);
          setPhase(nextPhase);

          if (nextPhase === 'inhale') {
            setCycleCount((c) => c + 1);
          }

          triggerHaptic('light', hapticEnabled);
          return getPhaseDuration(nextPhase);
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, phase, getNextPhase, getPhaseDuration, hapticEnabled]);

  return {
    isActive,
    phase,
    secondsRemaining,
    cycleCount,
    start,
    stop,
    setPattern,
  };
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- src/hooks/__tests__/useBreathing.test.ts`
Expected: PASS (3 tests)

**Step 5: Commit**

```bash
git add src/hooks/useBreathing.ts src/hooks/__tests__/useBreathing.test.ts
git commit -m "feat: add useBreathing hook with phase cycling and haptics"
```

---

### Task 7: Create Breathing Component

**Files:**
- Create: `src/components/BreathingTechnique.tsx`
- Create: `src/components/__tests__/BreathingTechnique.test.tsx`

**Step 1: Write the failing test**

Create `src/components/__tests__/BreathingTechnique.test.tsx`:
```typescript
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { BreathingTechnique } from '../BreathingTechnique';

describe('BreathingTechnique', () => {
  it('renders start button when inactive', () => {
    render(<BreathingTechnique hapticEnabled={true} />);
    expect(screen.getByText('Start')).toBeTruthy();
  });

  it('shows breathing phase when active', () => {
    render(<BreathingTechnique hapticEnabled={true} />);

    fireEvent.press(screen.getByText('Start'));

    expect(screen.getByText('Inhale')).toBeTruthy();
    expect(screen.getByText('Stop')).toBeTruthy();
  });

  it('calls onClose when close button pressed', () => {
    const onClose = jest.fn();
    render(<BreathingTechnique hapticEnabled={true} onClose={onClose} />);

    fireEvent.press(screen.getByTestId('close-button'));

    expect(onClose).toHaveBeenCalled();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/components/__tests__/BreathingTechnique.test.tsx`
Expected: FAIL - "Cannot find module '../BreathingTechnique'"

**Step 3: Write minimal implementation**

Create `src/components/BreathingTechnique.tsx`:
```typescript
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
```

**Step 4: Run test to verify it passes**

Run: `npm test -- src/components/__tests__/BreathingTechnique.test.tsx`
Expected: PASS (3 tests)

**Step 5: Commit**

```bash
git add src/components/
git commit -m "feat: add BreathingTechnique component with visual feedback"
```

---

## Phase 4: Audio Masking Technique

### Task 8: Create Audio Hook

**Files:**
- Create: `src/hooks/useAudio.ts`
- Create: `src/hooks/__tests__/useAudio.test.ts`

**Step 1: Write the failing test**

Create `src/hooks/__tests__/useAudio.test.ts`:
```typescript
import { renderHook, act } from '@testing-library/react-native';
import { Audio } from 'expo-av';
import { useAudio } from '../useAudio';

describe('useAudio', () => {
  const mockSound = {
    playAsync: jest.fn(),
    stopAsync: jest.fn(),
    unloadAsync: jest.fn(),
    setIsLoopingAsync: jest.fn(),
    setVolumeAsync: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (Audio.Sound.createAsync as jest.Mock).mockResolvedValue({ sound: mockSound });
  });

  it('starts in stopped state', () => {
    const { result } = renderHook(() => useAudio());
    expect(result.current.isPlaying).toBe(false);
  });

  it('plays audio when play is called', async () => {
    const { result } = renderHook(() => useAudio());

    await act(async () => {
      await result.current.play('white-noise');
    });

    expect(result.current.isPlaying).toBe(true);
    expect(mockSound.playAsync).toHaveBeenCalled();
  });

  it('stops audio when stop is called', async () => {
    const { result } = renderHook(() => useAudio());

    await act(async () => {
      await result.current.play('white-noise');
    });

    await act(async () => {
      await result.current.stop();
    });

    expect(result.current.isPlaying).toBe(false);
    expect(mockSound.stopAsync).toHaveBeenCalled();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/hooks/__tests__/useAudio.test.ts`
Expected: FAIL - "Cannot find module '../useAudio'"

**Step 3: Write minimal implementation**

Create `src/hooks/useAudio.ts`:
```typescript
import { useState, useRef, useCallback, useEffect } from 'react';
import { Audio, AVPlaybackSource } from 'expo-av';

export type SoundType = 'white-noise' | 'rain' | 'water';

// Placeholder audio sources - in production, these would be actual audio files
const SOUND_SOURCES: Record<SoundType, AVPlaybackSource> = {
  'white-noise': require('../../assets/audio/white-noise.mp3'),
  'rain': require('../../assets/audio/rain.mp3'),
  'water': require('../../assets/audio/water.mp3'),
};

interface UseAudioReturn {
  isPlaying: boolean;
  currentSound: SoundType | null;
  volume: number;
  play: (soundType: SoundType) => Promise<void>;
  stop: () => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
}

export function useAudio(): UseAudioReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState<SoundType | null>(null);
  const [volume, setVolumeState] = useState(1.0);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    // Configure audio mode for background playback
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
    });

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const play = useCallback(async (soundType: SoundType) => {
    try {
      // Stop existing sound if playing
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync(SOUND_SOURCES[soundType]);
      soundRef.current = sound;

      await sound.setIsLoopingAsync(true);
      await sound.setVolumeAsync(volume);
      await sound.playAsync();

      setIsPlaying(true);
      setCurrentSound(soundType);
    } catch (error) {
      console.error('Failed to play audio:', error);
    }
  }, [volume]);

  const stop = useCallback(async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      setIsPlaying(false);
      setCurrentSound(null);
    } catch (error) {
      console.error('Failed to stop audio:', error);
    }
  }, []);

  const setVolume = useCallback(async (newVolume: number) => {
    setVolumeState(newVolume);
    if (soundRef.current) {
      await soundRef.current.setVolumeAsync(newVolume);
    }
  }, []);

  return {
    isPlaying,
    currentSound,
    volume,
    play,
    stop,
    setVolume,
  };
}
```

**Step 4: Create placeholder audio files**

Run:
```bash
cd ~/Projects/reliefkey
# Create silent placeholder MP3 files (1 second each)
# In production, replace with actual audio files
ffmpeg -f lavfi -i anullsrc=r=44100:cl=stereo -t 1 -q:a 9 assets/audio/white-noise.mp3 2>/dev/null || touch assets/audio/white-noise.mp3
ffmpeg -f lavfi -i anullsrc=r=44100:cl=stereo -t 1 -q:a 9 assets/audio/rain.mp3 2>/dev/null || touch assets/audio/rain.mp3
ffmpeg -f lavfi -i anullsrc=r=44100:cl=stereo -t 1 -q:a 9 assets/audio/water.mp3 2>/dev/null || touch assets/audio/water.mp3
```

**Step 5: Update Jest mock for audio require**

Add to `jest.setup.js` before the existing mocks:
```javascript
// Mock audio file requires
jest.mock('../assets/audio/white-noise.mp3', () => 'white-noise.mp3', { virtual: true });
jest.mock('../assets/audio/rain.mp3', () => 'rain.mp3', { virtual: true });
jest.mock('../assets/audio/water.mp3', () => 'water.mp3', { virtual: true });
```

**Step 6: Run test to verify it passes**

Run: `npm test -- src/hooks/__tests__/useAudio.test.ts`
Expected: PASS (3 tests)

**Step 7: Commit**

```bash
git add src/hooks/useAudio.ts src/hooks/__tests__/useAudio.test.ts assets/audio/ jest.setup.js
git commit -m "feat: add useAudio hook for sound playback"
```

---

### Task 9: Create Audio Masking Component

**Files:**
- Create: `src/components/AudioMaskingTechnique.tsx`
- Create: `src/components/__tests__/AudioMaskingTechnique.test.tsx`

**Step 1: Write the failing test**

Create `src/components/__tests__/AudioMaskingTechnique.test.tsx`:
```typescript
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { AudioMaskingTechnique } from '../AudioMaskingTechnique';

describe('AudioMaskingTechnique', () => {
  it('renders sound selection buttons', () => {
    render(<AudioMaskingTechnique onClose={() => {}} />);

    expect(screen.getByText('White Noise')).toBeTruthy();
    expect(screen.getByText('Rain')).toBeTruthy();
    expect(screen.getByText('Running Water')).toBeTruthy();
  });

  it('shows playing state when sound is selected', () => {
    render(<AudioMaskingTechnique onClose={() => {}} />);

    fireEvent.press(screen.getByText('White Noise'));

    expect(screen.getByText('Stop')).toBeTruthy();
  });

  it('calls onClose when close button pressed', () => {
    const onClose = jest.fn();
    render(<AudioMaskingTechnique onClose={onClose} />);

    fireEvent.press(screen.getByTestId('close-button'));

    expect(onClose).toHaveBeenCalled();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/components/__tests__/AudioMaskingTechnique.test.tsx`
Expected: FAIL - "Cannot find module '../AudioMaskingTechnique'"

**Step 3: Write minimal implementation**

Create `src/components/AudioMaskingTechnique.tsx`:
```typescript
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useAudio, SoundType } from '../hooks/useAudio';

interface AudioMaskingTechniqueProps {
  onClose: () => void;
}

const SOUNDS: { id: SoundType; label: string; icon: string }[] = [
  { id: 'white-noise', label: 'White Noise', icon: '📻' },
  { id: 'rain', label: 'Rain', icon: '🌧️' },
  { id: 'water', label: 'Running Water', icon: '💧' },
];

export function AudioMaskingTechnique({ onClose }: AudioMaskingTechniqueProps) {
  const { isPlaying, currentSound, play, stop } = useAudio();

  const handleSoundPress = async (soundType: SoundType) => {
    if (isPlaying && currentSound === soundType) {
      await stop();
    } else {
      await play(soundType);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={onClose}
        testID="close-button"
      >
        <Text style={styles.closeButtonText}>✕</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Audio Masking</Text>
      <Text style={styles.subtitle}>
        Choose a sound to mask background noise
      </Text>

      <View style={styles.soundsContainer}>
        {SOUNDS.map((sound) => (
          <TouchableOpacity
            key={sound.id}
            style={[
              styles.soundButton,
              currentSound === sound.id && styles.soundButtonActive,
            ]}
            onPress={() => handleSoundPress(sound.id)}
          >
            <Text style={styles.soundIcon}>{sound.icon}</Text>
            <Text style={styles.soundLabel}>{sound.label}</Text>
            {currentSound === sound.id && isPlaying && (
              <Text style={styles.playingIndicator}>▶️ Playing</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {isPlaying && (
        <TouchableOpacity style={styles.stopButton} onPress={stop}>
          <Text style={styles.stopButtonText}>Stop</Text>
        </TouchableOpacity>
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 40,
    textAlign: 'center',
  },
  soundsContainer: {
    width: '100%',
  },
  soundButton: {
    backgroundColor: '#2a2a4e',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  soundButtonActive: {
    backgroundColor: '#3a3a6e',
    borderWidth: 2,
    borderColor: '#7cd1f7',
  },
  soundIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  soundLabel: {
    fontSize: 18,
    color: '#fff',
    flex: 1,
  },
  playingIndicator: {
    fontSize: 14,
    color: '#7cd1f7',
  },
  stopButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 60,
    paddingVertical: 20,
    borderRadius: 40,
    marginTop: 30,
  },
  stopButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
});
```

**Step 4: Run test to verify it passes**

Run: `npm test -- src/components/__tests__/AudioMaskingTechnique.test.tsx`
Expected: PASS (3 tests)

**Step 5: Commit**

```bash
git add src/components/AudioMaskingTechnique.tsx src/components/__tests__/AudioMaskingTechnique.test.tsx
git commit -m "feat: add AudioMaskingTechnique component"
```

---

## Phase 5: Mental Distraction Technique

### Task 10: Create Math Problem Generator

**Files:**
- Create: `src/utils/mathProblems.ts`
- Create: `src/utils/__tests__/mathProblems.test.ts`

**Step 1: Write the failing test**

Create `src/utils/__tests__/mathProblems.test.ts`:
```typescript
import { generateMathProblem, checkAnswer, MathProblem } from '../mathProblems';

describe('mathProblems', () => {
  it('generates a valid math problem', () => {
    const problem = generateMathProblem('easy');

    expect(problem.question).toBeTruthy();
    expect(typeof problem.answer).toBe('number');
    expect(problem.difficulty).toBe('easy');
  });

  it('generates problems with correct answers', () => {
    // Test multiple problems to ensure math is correct
    for (let i = 0; i < 10; i++) {
      const problem = generateMathProblem('easy');
      expect(checkAnswer(problem, problem.answer)).toBe(true);
    }
  });

  it('generates harder problems for medium difficulty', () => {
    const easyProblems = Array.from({ length: 10 }, () => generateMathProblem('easy'));
    const mediumProblems = Array.from({ length: 10 }, () => generateMathProblem('medium'));

    // Medium problems should generally have larger numbers
    const avgEasy = easyProblems.reduce((sum, p) => sum + Math.abs(p.answer), 0) / 10;
    const avgMedium = mediumProblems.reduce((sum, p) => sum + Math.abs(p.answer), 0) / 10;

    expect(avgMedium).toBeGreaterThan(avgEasy);
  });

  it('checkAnswer returns false for wrong answers', () => {
    const problem = generateMathProblem('easy');
    expect(checkAnswer(problem, problem.answer + 1)).toBe(false);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/utils/__tests__/mathProblems.test.ts`
Expected: FAIL - "Cannot find module '../mathProblems'"

**Step 3: Write minimal implementation**

Create `src/utils/mathProblems.ts`:
```typescript
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface MathProblem {
  question: string;
  answer: number;
  difficulty: Difficulty;
}

type Operation = '+' | '-' | '×';

const DIFFICULTY_RANGES: Record<Difficulty, { min: number; max: number; operations: Operation[] }> = {
  easy: { min: 1, max: 10, operations: ['+', '-'] },
  medium: { min: 10, max: 50, operations: ['+', '-', '×'] },
  hard: { min: 20, max: 100, operations: ['+', '-', '×'] },
};

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateMathProblem(difficulty: Difficulty): MathProblem {
  const { min, max, operations } = DIFFICULTY_RANGES[difficulty];
  const operation = randomElement(operations);

  let a = randomInt(min, max);
  let b = randomInt(min, max);
  let answer: number;
  let question: string;

  switch (operation) {
    case '+':
      answer = a + b;
      question = `${a} + ${b}`;
      break;
    case '-':
      // Ensure positive result for easier mental math
      if (b > a) [a, b] = [b, a];
      answer = a - b;
      question = `${a} - ${b}`;
      break;
    case '×':
      // Use smaller numbers for multiplication
      a = randomInt(2, Math.min(12, max / 2));
      b = randomInt(2, Math.min(12, max / 2));
      answer = a * b;
      question = `${a} × ${b}`;
      break;
    default:
      answer = a + b;
      question = `${a} + ${b}`;
  }

  return { question, answer, difficulty };
}

export function checkAnswer(problem: MathProblem, userAnswer: number): boolean {
  return problem.answer === userAnswer;
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- src/utils/__tests__/mathProblems.test.ts`
Expected: PASS (4 tests)

**Step 5: Commit**

```bash
git add src/utils/mathProblems.ts src/utils/__tests__/mathProblems.test.ts
git commit -m "feat: add math problem generator for mental distraction"
```

---

### Task 11: Create Mental Distraction Component

**Files:**
- Create: `src/components/MentalDistractionTechnique.tsx`
- Create: `src/components/__tests__/MentalDistractionTechnique.test.tsx`

**Step 1: Write the failing test**

Create `src/components/__tests__/MentalDistractionTechnique.test.tsx`:
```typescript
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { MentalDistractionTechnique } from '../MentalDistractionTechnique';

describe('MentalDistractionTechnique', () => {
  it('renders a math problem', () => {
    render(<MentalDistractionTechnique onClose={() => {}} />);

    // Should show a question with numbers and operator
    expect(screen.getByTestId('math-question')).toBeTruthy();
  });

  it('shows number pad for input', () => {
    render(<MentalDistractionTechnique onClose={() => {}} />);

    // Number buttons 0-9 should be present
    expect(screen.getByText('1')).toBeTruthy();
    expect(screen.getByText('5')).toBeTruthy();
    expect(screen.getByText('0')).toBeTruthy();
  });

  it('calls onClose when close button pressed', () => {
    const onClose = jest.fn();
    render(<MentalDistractionTechnique onClose={onClose} />);

    fireEvent.press(screen.getByTestId('close-button'));

    expect(onClose).toHaveBeenCalled();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/components/__tests__/MentalDistractionTechnique.test.tsx`
Expected: FAIL - "Cannot find module '../MentalDistractionTechnique'"

**Step 3: Write minimal implementation**

Create `src/components/MentalDistractionTechnique.tsx`:
```typescript
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
```

**Step 4: Run test to verify it passes**

Run: `npm test -- src/components/__tests__/MentalDistractionTechnique.test.tsx`
Expected: PASS (3 tests)

**Step 5: Commit**

```bash
git add src/components/MentalDistractionTechnique.tsx src/components/__tests__/MentalDistractionTechnique.test.tsx
git commit -m "feat: add MentalDistractionTechnique with math problems"
```

---

## Phase 6: Home Screen & Navigation

### Task 12: Create Home Screen

**Files:**
- Create: `src/screens/HomeScreen.tsx`
- Create: `src/screens/__tests__/HomeScreen.test.tsx`

**Step 1: Write the failing test**

Create `src/screens/__tests__/HomeScreen.test.tsx`:
```typescript
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { HomeScreen } from '../HomeScreen';

describe('HomeScreen', () => {
  it('renders all technique buttons', () => {
    render(<HomeScreen />);

    expect(screen.getByText('Guided Breathing')).toBeTruthy();
    expect(screen.getByText('Audio Masking')).toBeTruthy();
    expect(screen.getByText('Mental Distraction')).toBeTruthy();
  });

  it('shows quick-start button for default technique', () => {
    render(<HomeScreen />);

    expect(screen.getByTestId('quick-start-button')).toBeTruthy();
  });

  it('opens technique when button pressed', () => {
    render(<HomeScreen />);

    fireEvent.press(screen.getByText('Guided Breathing'));

    // Should show the breathing technique screen
    expect(screen.getByText('Inhale')).toBeTruthy();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/screens/__tests__/HomeScreen.test.tsx`
Expected: FAIL - "Cannot find module '../HomeScreen'"

**Step 3: Write minimal implementation**

Create `src/screens/HomeScreen.tsx`:
```typescript
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { TechniqueId } from '../types';
import { TECHNIQUES } from '../constants';
import { usePreferences } from '../hooks/usePreferences';
import { BreathingTechnique } from '../components/BreathingTechnique';
import { AudioMaskingTechnique } from '../components/AudioMaskingTechnique';
import { MentalDistractionTechnique } from '../components/MentalDistractionTechnique';

export function HomeScreen() {
  const { preferences } = usePreferences();
  const [activeTechnique, setActiveTechnique] = useState<TechniqueId | null>(null);

  const handleQuickStart = () => {
    setActiveTechnique(preferences.defaultTechnique);
  };

  const handleTechniqueSelect = (id: TechniqueId) => {
    setActiveTechnique(id);
  };

  const handleClose = () => {
    setActiveTechnique(null);
  };

  // Render active technique full-screen
  if (activeTechnique) {
    switch (activeTechnique) {
      case 'breathing':
        return (
          <BreathingTechnique
            hapticEnabled={preferences.hapticEnabled}
            onClose={handleClose}
          />
        );
      case 'audio-masking':
        return <AudioMaskingTechnique onClose={handleClose} />;
      case 'mental-distraction':
        return <MentalDistractionTechnique onClose={handleClose} />;
      default:
        // Placeholder for techniques not yet implemented
        return (
          <View style={styles.container}>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.comingSoon}>Coming Soon</Text>
          </View>
        );
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.title}>ReliefKey</Text>
        <Text style={styles.subtitle}>Find your calm</Text>
      </View>

      <TouchableOpacity
        style={styles.quickStartButton}
        onPress={handleQuickStart}
        testID="quick-start-button"
      >
        <Text style={styles.quickStartText}>Quick Start</Text>
        <Text style={styles.quickStartSubtext}>
          {TECHNIQUES.find((t) => t.id === preferences.defaultTechnique)?.name}
        </Text>
      </TouchableOpacity>

      <ScrollView style={styles.techniqueList}>
        <Text style={styles.sectionTitle}>All Techniques</Text>
        {TECHNIQUES.map((technique) => (
          <TouchableOpacity
            key={technique.id}
            style={styles.techniqueButton}
            onPress={() => handleTechniqueSelect(technique.id)}
          >
            <Text style={styles.techniqueIcon}>{technique.icon}</Text>
            <View style={styles.techniqueInfo}>
              <Text style={styles.techniqueName}>{technique.name}</Text>
              <Text style={styles.techniqueDescription}>
                {technique.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 18,
    color: '#aaa',
    marginTop: 5,
  },
  quickStartButton: {
    backgroundColor: '#4CAF50',
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 25,
    borderRadius: 16,
    alignItems: 'center',
  },
  quickStartText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  quickStartSubtext: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  techniqueList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  techniqueButton: {
    backgroundColor: '#2a2a4e',
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  techniqueIcon: {
    fontSize: 36,
    marginRight: 15,
  },
  techniqueInfo: {
    flex: 1,
  },
  techniqueName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  techniqueDescription: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 4,
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
  comingSoon: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginTop: 100,
  },
});
```

**Step 4: Run test to verify it passes**

Run: `npm test -- src/screens/__tests__/HomeScreen.test.tsx`
Expected: PASS (3 tests)

**Step 5: Commit**

```bash
git add src/screens/
git commit -m "feat: add HomeScreen with technique selector and quick-start"
```

---

### Task 13: Wire Up App Entry Point

**Files:**
- Modify: `App.tsx`

**Step 1: Update App.tsx**

Replace `App.tsx`:
```typescript
import React from 'react';
import { HomeScreen } from './src/screens/HomeScreen';

export default function App() {
  return <HomeScreen />;
}
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Run all tests**

Run: `npm test`
Expected: All tests pass

**Step 4: Commit**

```bash
git add App.tsx
git commit -m "feat: wire up HomeScreen as app entry point"
```

---

## Phase 7: Final Integration

### Task 14: Run Full Test Suite

**Step 1: Run all tests with coverage**

Run: `npm test -- --coverage`
Expected: All tests pass, coverage report generated

**Step 2: Verify app starts**

Run: `npx expo start`
Expected: Metro bundler starts, QR code displayed

**Step 3: Final commit**

```bash
git add -A
git commit -m "chore: v1.0 relief tools complete"
```

---

## Summary

**v1.0 Relief Tools includes:**
- ✅ Guided Breathing with haptic feedback
- ✅ Audio Masking (white noise, rain, water)
- ✅ Mental Distraction (math problems)
- ⏳ Muscle Relaxation (audio placeholder)
- ⏳ Visualization (audio placeholder)
- ✅ Quick-start home screen
- ✅ Preferences persistence
- ✅ Full test coverage

**Next phase (v1.1):** Restroom Finder with maps integration

**Future:** Add real audio files for muscle relaxation and visualization guides.
