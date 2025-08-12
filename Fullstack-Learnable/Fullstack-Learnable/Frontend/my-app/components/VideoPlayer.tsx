// components/VideoPlayer.tsx
import React, { useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';

const videoMap: Record<string, any> = {
  '1': require('../assets/videos/python-programming.mp4'),
  '2': require('../assets/videos/business-analytics.mp4'),
  '3': require('../assets/videos/ui-design.mp4'),
  '5': require('../assets/videos/calculus.mp4'),
  '6': require('../assets/videos/critical-thinking.mp4'),
  '7': require('../assets/videos/data-analytics.mp4'),
  '8': require('../assets/videos/ethical-hacking.mp4'),
  '9': require('../assets/videos/machine-learning.mp4'),
  '10': require('../assets/videos/vr.mp4'),
  '11': require('../assets/videos/xr.mp4'),
  default: require('../assets/videos/default.mp4'),
};

interface VideoPlayerProps {
  id: string;
  fullScreen?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ id, fullScreen = true }) => {
  const videoSource = videoMap[id] ?? videoMap.default;
  const videoRef = useRef(null);
  const [isBuffering, setIsBuffering] = useState(true);

  return (
    
    <View style={fullScreen ? styles.fullContainer : styles.inlineContainer}>
      <Video
        ref={videoRef}
        source={videoSource}
        useNativeControls
        resizeMode={ResizeMode.COVER}
        shouldPlay
        style={fullScreen ? styles.fullVideo : styles.inlineVideo}
        onLoadStart={() => setIsBuffering(true)}
        onReadyForDisplay={() => setIsBuffering(false)}
      />

      {isBuffering && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    borderRadius: 16,
    overflow: 'hidden',
    margin: 8,
  },
  inlineContainer: {
    height: 200,
    width: '100%',
    backgroundColor: '#000',
    borderRadius: 16,
    overflow: 'hidden',
    marginVertical: 12,
  },
  fullVideo: {
    width: '100%',
    height: '100%',
  },
  inlineVideo: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 2,
  },
});

export default VideoPlayer;
