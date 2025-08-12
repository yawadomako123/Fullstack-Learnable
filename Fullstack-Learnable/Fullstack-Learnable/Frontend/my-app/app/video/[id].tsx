// app/video/[id].tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import VideoPlayer from '../../components/VideoPlayer';

export default function VideoScreen() {
  const { id } = useLocalSearchParams();
  const courseId = id as string;

  if (!courseId) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'white' }}>Invalid video ID</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <VideoPlayer id={courseId} fullScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});
