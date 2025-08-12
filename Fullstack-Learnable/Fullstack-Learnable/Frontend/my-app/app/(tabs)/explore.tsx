// ✅ ExploreScreen.tsx
import React, { useEffect, useState, useMemo } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { getThemeColors } from '@/constants/Colors';

// ✅ Type for Course
export type Course = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  instructor: string;
  rating: number;
};

// ✅ Style map for categories
// const categoryStyles: Record<string, { color: string; icon: keyof typeof Ionicons.glyphMap }> = {
//   Design: { color: '#E3C6FF', icon: 'color-palette-outline' },
//   Development: { color: '#A5CFFF', icon: 'code-slash-outline' },
//   Business: { color: '#FFD6A5', icon: 'briefcase-outline' },
//   Data: { color: '#A2EFD1', icon: 'bar-chart-outline' },
// };

export default function ExploreScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useTheme();
  const Colors = getThemeColors(isDarkMode);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://192.168.8.120:8080/api/courses');
        const data = await response.json();
        console.log('✅ Fetched courses:', data);

        if (Array.isArray(data)) {
          setCourses(data);
        } else if (data && Array.isArray(data.courses)) {
          setCourses(data.courses);
        } else if (data && data.id && data.title) {
          setCourses([data]);
        } else {
          console.warn('⚠️ Unexpected response format:', data);
          setCourses([]);
        }
      } catch (err) {
        console.error('❌ Failed to fetch courses:', err);
        Alert.alert('Error', 'Could not load courses from server.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    return courses.filter(
      (course) =>
        course.title.toLowerCase().includes(lowerQuery) ||
        course.category?.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery, courses]);

  const handleSearch = (text: string) => setSearchQuery(text);

  const handleCoursePress = (course: Course) => {
    if (!course?.id) {
      console.warn('⚠️ Course ID is undefined:', course);
      return;
    }
    router.push(`/courses/${course.id}`);
  };

  const dynamicCategories = useMemo(() => {
  const seen = new Set();
  return courses
    .filter((c) => {
      if (!c.category || seen.has(c.category)) return false;
      seen.add(c.category);
      return true;
    })
    .slice(0, 4)
    .map((course) => ({
      name: course.category,
      description: `Explore ${course.category} courses`, // optional
      icon: 'school-outline',
    }));
}, [courses]);


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.background }]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.header, { color: Colors.primary }]}>🎓 Explore Courses</Text>

          {/* 🔍 Search Box */}
          <View style={[styles.searchContainer, { backgroundColor: Colors.surface }]}>
            <Ionicons name="search-outline" size={20} color={Colors.muted} />
            <TextInput
              style={[styles.searchInput, { color: Colors.text }]}
              placeholder="Search by title or category"
              placeholderTextColor={Colors.muted}
              value={searchQuery}
              onChangeText={handleSearch}
              returnKeyType="search"
            />
          </View>

          {/* 🌀 Loading or Empty */}
          {loading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={{ marginTop: 10, color: Colors.muted }}>Loading courses...</Text>
            </View>
          ) : filteredCourses.length === 0 ? (
            <Text style={[styles.emptyMessage, { color: Colors.muted }]}>No courses found.</Text>
          ) : (
            <FlatList
              data={filteredCourses}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              contentContainerStyle={styles.courseList}
              columnWrapperStyle={styles.courseRow}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                const { color, icon } = {
                  color: Colors.surface,
                  icon: 'school-outline',
                };

                return (
                  <TouchableOpacity
                    style={[styles.courseCard, { backgroundColor: color }]}
                    onPress={() => handleCoursePress(item)}
                    accessibilityRole="button"
                    accessibilityLabel={`Open course: ${item.title}`}
                  >
                    <View style={styles.iconWrapper}>
                      <Ionicons name={icon as any} size={30} color={Colors.primary} />
                    </View>
                    <Text style={[styles.courseTitle, { color: Colors.text }]} numberOfLines={2}>
                      {item.title}
                    </Text>
                    <Text style={[styles.courseCategory, { color: Colors.primary }]}>
                      {item.category || 'Uncategorized'}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 20,
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 30,
  },
  courseList: {
    paddingBottom: 100,
  },
  courseRow: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  courseCard: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    alignItems: 'center',
  },
  iconWrapper: {
    backgroundColor: '#fff',
    borderRadius: 40,
    width: 60,
    height: 60,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 5,
  },
  courseCategory: {
    fontSize: 13,
    textAlign: 'center',
  },
});
