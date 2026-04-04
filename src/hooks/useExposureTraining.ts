import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ExposureChallenge, ExposureLogEntry, ChallengeOutcome } from '../types';
import { STORAGE_KEYS } from '../constants';

const CHALLENGES: ExposureChallenge[] = [
  // Easy
  {
    id: 'quiet-restroom',
    title: 'Use a quiet public restroom',
    description: 'Find a low-traffic restroom and use it when few people are around.',
    difficulty: 'easy',
    iconName: 'DoorOpen',
  },
  {
    id: 'wait-15s',
    title: 'Wait 15 seconds before going',
    description: 'When you feel the urge, pause and breathe for 15 seconds first.',
    difficulty: 'easy',
    iconName: 'Timer',
  },
  {
    id: 'unfamiliar-restroom',
    title: 'Use an unfamiliar restroom',
    description: 'Go to a restroom you haven\'t used before in a familiar place.',
    difficulty: 'easy',
    iconName: 'MapPin',
  },
  // Medium
  {
    id: 'busy-restroom',
    title: 'Use a moderately busy restroom',
    description: 'Use a restroom during a time when a few other people are present.',
    difficulty: 'medium',
    iconName: 'Users',
  },
  {
    id: 'wait-30s',
    title: 'Wait 30 seconds before going',
    description: 'Extend your pause to 30 seconds. Use breathing techniques while you wait.',
    difficulty: 'medium',
    iconName: 'Clock',
  },
  {
    id: 'no-masking',
    title: 'Go without audio masking',
    description: 'Use a restroom without playing any masking sounds.',
    difficulty: 'medium',
    iconName: 'VolumeX',
  },
  // Hard
  {
    id: 'peak-hours',
    title: 'Use a restroom during peak hours',
    description: 'Visit a busy restroom during peak times (e.g., lunch break).',
    difficulty: 'hard',
    iconName: 'UserPlus',
  },
  {
    id: 'wait-60s',
    title: 'Wait 60 seconds before going',
    description: 'Challenge yourself to wait a full minute. Practice your calm techniques.',
    difficulty: 'hard',
    iconName: 'Hourglass',
  },
  {
    id: 'new-location',
    title: 'Use a restroom at a new location',
    description: 'Visit a restroom at a place you\'ve never been before.',
    difficulty: 'hard',
    iconName: 'Navigation',
  },
];

function getDailyChallenge(logs: ExposureLogEntry[]): ExposureChallenge {
  // Use the date as a seed to get a consistent daily challenge
  const today = new Date().toISOString().slice(0, 10);
  const seed = today.split('-').reduce((acc, n) => acc + parseInt(n, 10), 0);

  // Determine difficulty based on number of completed entries
  const completedCount = logs.filter(l => l.outcome === 'success').length;
  let pool: ExposureChallenge[];
  if (completedCount < 3) {
    pool = CHALLENGES.filter(c => c.difficulty === 'easy');
  } else if (completedCount < 8) {
    pool = CHALLENGES.filter(c => c.difficulty !== 'hard');
  } else {
    pool = CHALLENGES;
  }

  return pool[seed % pool.length];
}

export function useExposureTraining() {
  const [logs, setLogs] = useState<ExposureLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.EXPOSURE_LOGS);
      if (stored) {
        setLogs(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load exposure logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveLogs = async (data: ExposureLogEntry[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.EXPOSURE_LOGS, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save exposure logs:', error);
    }
  };

  const logEntry = useCallback(async (
    challenge: ExposureChallenge,
    preAnxiety: number,
    postAnxiety: number,
    outcome: ChallengeOutcome,
    notes: string,
  ) => {
    const entry: ExposureLogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      challengeId: challenge.id,
      challengeTitle: challenge.title,
      preAnxiety,
      postAnxiety,
      outcome,
      notes,
      completedAt: new Date().toISOString(),
    };

    const newLogs = [entry, ...logs].slice(0, 100);
    setLogs(newLogs);
    await saveLogs(newLogs);
    return entry;
  }, [logs]);

  const dailyChallenge = getDailyChallenge(logs);
  const allChallenges = CHALLENGES;

  const completedToday = logs.some(
    l => l.completedAt.slice(0, 10) === new Date().toISOString().slice(0, 10)
  );

  const stats = {
    totalEntries: logs.length,
    successCount: logs.filter(l => l.outcome === 'success').length,
    averageAnxietyReduction: logs.length > 0
      ? logs.reduce((acc, l) => acc + (l.preAnxiety - l.postAnxiety), 0) / logs.length
      : 0,
  };

  return {
    logs,
    dailyChallenge,
    allChallenges,
    completedToday,
    stats,
    logEntry,
    isLoading,
  };
}
