import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Video, ResizeMode, AVPlaybackSource } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { getThemeColors } from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width;
const cardSpacing = 16;
const cardWidth = (screenWidth - cardSpacing * 3) / 2;

const recentCourses = [
  { id: '1', title: 'Python Programming', category: 'Technology' },
  { id: '2', title: 'Business Analytics', category: 'Business' },
  { id: '3', title: 'UI/UX Design', category: 'Design' },
  { id: '5', title: 'Calculus', category: 'Mathematics' },
  { id: '7', title: 'Data Analytics', category: 'Data Science' },
  { id: '8', title: 'Ethical Hacking', category: 'Technology' },
  { id: '9', title: 'Machine Learning', category: 'Technology' },
  { id: '10', title: 'Virtual Reality', category: 'Technology' },
  { id: '11', title: 'Extended Reality', category: 'Technology' },
  { id: '6', title: 'Critical Thinking', category: 'General Education' },
];

const videoAssets: Record<string, AVPlaybackSource> = {
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

const VideoGrid = () => {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);

  return (
  <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
    <Text style={[styles.heading, { color: colors.primary }]}>Discover Interest</Text>

    <FlatList
      data={recentCourses}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.columnWrapper}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 16 }}
      renderItem={({ item }) => {
        const videoSource = videoAssets[item.id] || videoAssets.default;

        return (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.surface, shadowColor: colors.muted }]}
            onPress={() =>
              router.push({
                pathname: '/video/[id]',
                params: { id: item.id },
              })
            }
            activeOpacity={0.85}
          >
            <Video
              source={videoSource}
              resizeMode={ResizeMode.COVER}
              shouldPlay
              isMuted
              isLooping
              style={styles.video}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.overlay}
            >
              <Ionicons name="play-circle" size={24} color="#fff" />
              <Text style={styles.videoTitle}>{item.title}</Text>
              <Text style={styles.videoCategory}>{item.category}</Text>
            </LinearGradient>
          </TouchableOpacity>
        );
      }}
    />
  </SafeAreaView>
  );
};

export default VideoGrid;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: cardWidth,
    aspectRatio: 1.2,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    padding: 10,
  },
  videoTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    marginTop: 4,
  },
  videoCategory: {
    color: '#ccc',
    fontSize: 12,
  },
});
