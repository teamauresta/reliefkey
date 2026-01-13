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
