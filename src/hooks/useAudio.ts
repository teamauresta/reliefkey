import { useState, useRef, useCallback, useEffect } from 'react';
import { Audio, AVPlaybackSource } from 'expo-av';

export type SoundType =
  | 'white-noise'
  | 'sea-wave'
  | 'thunderstorm-jungle'
  | 'european-forest'
  | 'forest-bird'
  | 'night-forest'
  | 'summer-night'
  | 'wind-blowing'
  | 'wind-hum';

const SOUND_SOURCES: Record<SoundType, AVPlaybackSource> = {
  'white-noise': require('../../assets/audio/white-noise.mp3'),
  'sea-wave': require('../../assets/audio/sea-wave.mp3'),
  'thunderstorm-jungle': require('../../assets/audio/thunderstorm-jungle.mp3'),
  'european-forest': require('../../assets/audio/european-forest.mp3'),
  'forest-bird': require('../../assets/audio/forest-bird.mp3'),
  'night-forest': require('../../assets/audio/night-forest.mp3'),
  'summer-night': require('../../assets/audio/summer-night.mp3'),
  'wind-blowing': require('../../assets/audio/wind-blowing.mp3'),
  'wind-hum': require('../../assets/audio/wind-hum.mp3'),
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
        soundRef.current.getStatusAsync().then((status) => {
          if (status.isLoaded) {
            soundRef.current?.unloadAsync();
          }
        }).catch(() => {
          // Silently ignore
        });
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
        const status = await soundRef.current.getStatusAsync();
        if (status.isLoaded) {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
        }
        soundRef.current = null;
      }
      setIsPlaying(false);
      setCurrentSound(null);
    } catch (error) {
      // Silently ignore - sound may already be unloaded
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
