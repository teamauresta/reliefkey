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
