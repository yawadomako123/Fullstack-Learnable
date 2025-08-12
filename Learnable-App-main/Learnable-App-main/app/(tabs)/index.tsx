import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

const Colors = {
  light: {
    background: '#fff',
    text: '#1c1c1e',
    primary: '#0056D2',
    border: '#e0e0e0',
    accent: '#F97316',
    muted: '#6B7280',
    card: '#FFFFFF',
    shadow: '#00000020',
  },
};

const categories = [
  {
    name: 'Technology',
    description: 'Code, build, and master the future.',
    icon: 'code-slash-outline',
    search: 'Development',
    color: '#D0EBFF',
  },
  {
    name: 'Business',
    description: 'Marketing, leadership, and strategy.',
    icon: 'briefcase-outline',
    search: 'Business',
    color: '#FFE6CC',
  },
  {
    name: 'Design',
    description: 'UI, UX, and creative skills.',
    icon: 'color-palette-outline',
    search: 'Design',
    color: '#EEDFFF',
  },
];

const courses = [
  {
    id: '1',
    title: 'Introduction to Python',
    instructor: 'Dr. Jane Smith',
    image: 'https://via.placeholder.com/150',
    progress: 0.65,
    category: 'Technology',
  },
  {
    id: '2',
    title: 'Machine Learning Fundamentals',
    instructor: 'Prof. John Doe',
    image: 'https://via.placeholder.com/150',
    progress: 0.3,
    category: 'Technology',
  },
  {
    id: '3',
    title: 'Web Development Bootcamp',
    instructor: 'Alex Johnson',
    image: 'https://via.placeholder.com/150',
    progress: 0.1,
    category: 'Technology',
  },
];

const mockRecentCourses = [
  { id: '4', title: 'UI/UX Design', category: 'Design' },
  { id: '5', title: 'Python Programming', category: 'Technology' },
  { id: '6', title: 'Business Analytics', category: 'Business' }, // Added
  { id: '7', title: 'Mobile App Development', category: 'Technology' }, // Added
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function InterfaceScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [recentCourses] = useState(mockRecentCourses);
  const [search, setSearch] = useState('');
  const avatarAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(avatarAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
    }).start();
  }, []);

  const handleCategorySelect = (category: typeof categories[0]) => {
    router.push({
      pathname: '/explore',
      params: { search: category.search },
    });
  };

  const handleCoursePress = (course: any) => {
    router.push(`/courses/${course.id}`);
  };

  return (
    <LinearGradient
      colors={['#e0e7ff', '#fff']}
      style={styles.linearGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <SafeAreaView style={styles.container}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          
          <TouchableOpacity
            style={styles.notificationIcon}
            onPress={() => router.push('/notifications')}
          >
            <Ionicons name="notifications-outline" size={28} color={Colors.light.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.header}>
            <Animated.Image
              source={{ uri: user?.profileImage || 'https://i.pravatar.cc/150?img=47' }}
              style={[
                styles.avatar,
                {
                  transform: [
                    {
                      scale: avatarAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.7, 1],
                      }),
                    },
                  ],
                  shadowColor: Colors.light.shadow,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 6,
                  elevation: 6,
                },
              ]}
            />
            <Text style={styles.greeting}>
              {getGreeting()}
              {user?.name ? `, ${user.name}` : ''} 👋
            </Text>
            <Text style={styles.subtitle}>Start learning today!</Text>
          </View>

          {/* Search Bar */}
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color={Colors.light.muted} />
            <TextInput
              placeholder="Search for courses, topics, or instructors"
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
              placeholderTextColor={Colors.light.muted}
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
          </View>

          {/* Categories Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Explore by Category</Text>
              <TouchableOpacity onPress={() => router.push('/explore')}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.categoryContainer}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.name}
                  style={[styles.categoryCard, { backgroundColor: cat.color }]}
                  onPress={() => handleCategorySelect(cat)}
                  activeOpacity={0.85}
                >
                  <Ionicons name={cat.icon as any} size={30} color={Colors.light.primary} />
                  <Text style={styles.categoryName}>{cat.name}</Text>
                  <Text style={styles.categoryDesc}>{cat.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Continue Learning Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Continue Learning</Text>
              <TouchableOpacity onPress={() => router.push('/explore')}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {courses.map((course) => (
                <TouchableOpacity
                  key={course.id}
                  style={styles.courseCard}
                  onPress={() => handleCoursePress(course)}
                  activeOpacity={0.85}
                >
                  <Image source={{ uri: course.image }} style={styles.courseImage} />
                  <View style={styles.courseInfo}>
                    <Text style={styles.courseTitle} numberOfLines={2}>
                      {course.title}
                    </Text>
                    <Text style={styles.courseInstructor}>{course.instructor}</Text>
                    <View style={styles.progressBar}>
                      <View
                        style={[styles.progressFill, { width: `${course.progress * 100}%` }]}
                      />
                    </View>
                    <Text style={styles.progressText}>{Math.round(course.progress * 100)}% complete</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Recently Viewed Section */}
          {recentCourses.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recently Viewed</Text>
                <TouchableOpacity onPress={() => router.push('/explore')}>
                  <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                horizontal
                data={recentCourses}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.recentList}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.recentCard}
                    onPress={() => handleCoursePress(item)}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="play-circle-outline" size={26} color={Colors.light.primary} />
                    <Text style={styles.recentTitle}>{item.title}</Text>
                    <Text style={styles.recentCategory}>{item.category}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: 'transparent',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  notificationIcon: {
    marginLeft: 18,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 22,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#e0e7ff',
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.light.primary,
    marginTop: 10,
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.muted,
    textAlign: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 18,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: Colors.light.text,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
  },
  seeAll: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '600',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 16,
    width: '31%',
    alignItems: 'center',
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 10,
    color: Colors.light.primary,
  },
  categoryDesc: {
    fontSize: 14,
    color: Colors.light.muted,
    marginTop: 4,
    textAlign: 'center',
  },
  courseCard: {
    width: 180,
    marginRight: 16,
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 6,
    elevation: 4,
  },
  courseImage: {
    width: '100%',
    height: 100,
  },
  courseInfo: {
    padding: 12,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  courseInstructor: {
    fontSize: 14,
    color: Colors.light.muted,
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.light.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: Colors.light.muted,
  },
  recentList: {
    paddingRight: 20,
  },
  recentCard: {
    backgroundColor: '#F2F2F2',
    padding: 16,
    borderRadius: 10,
    marginRight: 12,
    width: 150,
    alignItems: 'center',
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 2,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 6,
    color: Colors.light.text,
  },
  recentCategory: {
    fontSize: 13,
    color: Colors.light.muted,
    marginTop: 2,
  },
});
