import { renderHook, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useExposureTraining } from '../useExposureTraining';

describe('useExposureTraining', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns empty logs and a daily challenge initially', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => useExposureTraining());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.logs).toEqual([]);
    expect(result.current.dailyChallenge).toBeDefined();
    expect(result.current.dailyChallenge.title).toBeTruthy();
    expect(result.current.dailyChallenge.difficulty).toBe('easy');
    expect(result.current.completedToday).toBe(false);
    expect(result.current.stats.totalEntries).toBe(0);
  });

  it('loads saved logs from storage', async () => {
    const saved = [
      {
        id: 'log-1',
        challengeId: 'quiet-restroom',
        challengeTitle: 'Use a quiet public restroom',
        preAnxiety: 7,
        postAnxiety: 3,
        outcome: 'success',
        notes: '',
        completedAt: '2026-04-02T10:00:00.000Z',
      },
    ];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(saved));

    const { result } = renderHook(() => useExposureTraining());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.logs).toHaveLength(1);
    expect(result.current.stats.totalEntries).toBe(1);
    expect(result.current.stats.successCount).toBe(1);
    expect(result.current.stats.averageAnxietyReduction).toBe(4);
  });

  it('logs an entry and persists to storage', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => useExposureTraining());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const challenge = result.current.dailyChallenge;

    await act(async () => {
      await result.current.logEntry(challenge, 8, 4, 'success', 'Felt good');
    });

    expect(result.current.logs).toHaveLength(1);
    expect(result.current.logs[0].preAnxiety).toBe(8);
    expect(result.current.logs[0].postAnxiety).toBe(4);
    expect(result.current.logs[0].outcome).toBe('success');
    expect(result.current.logs[0].notes).toBe('Felt good');

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@reliefkey/exposure-logs',
      expect.any(String)
    );
  });

  it('returns all challenges', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => useExposureTraining());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.allChallenges.length).toBe(9);
    const difficulties = result.current.allChallenges.map(c => c.difficulty);
    expect(difficulties.filter(d => d === 'easy')).toHaveLength(3);
    expect(difficulties.filter(d => d === 'medium')).toHaveLength(3);
    expect(difficulties.filter(d => d === 'hard')).toHaveLength(3);
  });

  it('calculates average anxiety reduction', async () => {
    const saved = [
      {
        id: 'log-1',
        challengeId: 'wait-15s',
        challengeTitle: 'Wait 15 seconds',
        preAnxiety: 8,
        postAnxiety: 4,
        outcome: 'success',
        notes: '',
        completedAt: '2026-04-02T10:00:00.000Z',
      },
      {
        id: 'log-2',
        challengeId: 'quiet-restroom',
        challengeTitle: 'Use a quiet restroom',
        preAnxiety: 6,
        postAnxiety: 2,
        outcome: 'success',
        notes: '',
        completedAt: '2026-04-01T10:00:00.000Z',
      },
    ];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(saved));

    const { result } = renderHook(() => useExposureTraining());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // (8-4 + 6-2) / 2 = 4
    expect(result.current.stats.averageAnxietyReduction).toBe(4);
  });
});
