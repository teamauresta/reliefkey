import { renderHook, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useProgress } from '../useProgress';

describe('useProgress', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns default progress when no data stored', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => useProgress());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.progress.currentStreak).toBe(0);
    expect(result.current.progress.totalSessions).toBe(0);
    expect(result.current.progress.totalMinutes).toBe(0);
    expect(result.current.recentSessions).toEqual([]);
  });

  it('loads saved progress from storage', async () => {
    const saved = {
      currentStreak: 3,
      lastSessionDate: '2026-04-03T10:00:00.000Z',
      totalSessions: 10,
      totalMinutes: 45,
      sessions: [],
    };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(saved));

    const { result } = renderHook(() => useProgress());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.progress.currentStreak).toBe(3);
    expect(result.current.progress.totalSessions).toBe(10);
    expect(result.current.progress.totalMinutes).toBe(45);
  });

  it('logs a session and updates totals', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => useProgress());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.logSession('breathing', 'Guided Breathing', 180);
    });

    expect(result.current.progress.totalSessions).toBe(1);
    expect(result.current.progress.totalMinutes).toBe(3);
    expect(result.current.progress.currentStreak).toBe(1);
    expect(result.current.recentSessions).toHaveLength(1);
    expect(result.current.recentSessions[0].techniqueId).toBe('breathing');

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@reliefkey/progress',
      expect.any(String)
    );
  });

  it('starts a new streak on first session', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => useProgress());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.logSession('audio-masking', 'Audio Masking', 300);
    });

    expect(result.current.progress.currentStreak).toBe(1);
    expect(result.current.progress.lastSessionDate).toBeTruthy();
  });
});
