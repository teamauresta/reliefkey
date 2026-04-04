import React from 'react';
import { ImageBackground as RNImageBackground, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme';

const imageSource = require('../../../assets/images/beach-still.jpg');

// Same overlay as VideoBackground: colors.background.start (#0a1628) at 0.6 and 0.8 opacity
const overlayTop = 'rgba(10, 22, 40, 0.6)';
const overlayBottom = 'rgba(10, 22, 40, 0.8)';

interface ImageBackgroundProps {
  children?: React.ReactNode;
}

export function ImageBackground({ children }: ImageBackgroundProps) {
  return (
    <RNImageBackground source={imageSource} style={styles.container} resizeMode="cover">
      <LinearGradient
        colors={[overlayTop, overlayBottom]}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </RNImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.start,
  },
});
