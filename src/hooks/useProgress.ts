import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProgressData, SessionRecord, TechniqueId } from '../types';
import { STORAGE_KEYS } from '../constants';

const DEFAULT_PROGRESS: ProgressData = {
  currentStreak: 0,
  lastSessionDate: null,
  totalSessions: 0,
  totalMinutes: 0,
  sessions: [],
};

function isSameDay(date1: string, date2: string): boolean {
  return date1.slice(0, 10) === date2.slice(0, 10);
}

function isConsecutiveDay(previous: string, current: string): boolean {
  const prev = new Date(previous);
  const curr = new Date(current);
  const diffMs = curr.getTime() - prev.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffDays === 1;
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressData>(DEFAULT_PROGRESS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.PROGRESS);
      if (stored) {
        setProgress({ ...DEFAULT_PROGRESS, ...JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProgress = async (data: ProgressData) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const logSession = useCallback(async (
    techniqueId: TechniqueId,
    techniqueName: string,
    durationSeconds: number,
  ) => {
    const now = new Date().toISOString();
    const session: SessionRecord = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      techniqueId,
      techniqueName,
      durationSeconds,
      completedAt: now,
    };

    const newProgress: ProgressData = {
      ...progress,
      totalSessions: progress.totalSessions + 1,
      totalMinutes: progress.totalMinutes + Math.round(durationSeconds / 60),
      sessions: [session, ...progress.sessions].slice(0, 50), // keep last 50
    };

    // Update streak
    if (progress.lastSessionDate) {
      if (isSameDay(progress.lastSessionDate, now)) {
        // Same day, streak unchanged
      } else if (isConsecutiveDay(progress.lastSessionDate, now)) {
        newProgress.currentStreak = progress.currentStreak + 1;
      } else {
        newProgress.currentStreak = 1; // streak broken, start new
      }
    } else {
      newProgress.currentStreak = 1; // first session ever
    }

    newProgress.lastSessionDate = now;

    setProgress(newProgress);
    await saveProgress(newProgress);
  }, [progress]);

  const recentSessions = progress.sessions.slice(0, 10);

  return { progress, logSession, recentSessions, isLoading };
}
