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
