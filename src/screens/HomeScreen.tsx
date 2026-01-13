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
