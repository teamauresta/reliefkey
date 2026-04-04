import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme';

const videoSource = require('../../../assets/videos/beach-waves.mp4');

// colors.background.start (#0a1628) at 0.6 and 0.8 opacity
const overlayTop = 'rgba(10, 22, 40, 0.6)';
const overlayBottom = 'rgba(10, 22, 40, 0.8)';

interface VideoBackgroundProps {
  children?: React.ReactNode;
}

export function VideoBackground({ children }: VideoBackgroundProps) {
  const player = useVideoPlayer(videoSource, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  return (
    <View style={styles.container}>
      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        nativeControls={false}
        contentFit="cover"
      />
      <LinearGradient
        colors={[overlayTop, overlayBottom]}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.start,
  },
});
