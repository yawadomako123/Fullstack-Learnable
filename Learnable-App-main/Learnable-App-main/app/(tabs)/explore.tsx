// app/explore.tsx
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Define a type for courses
type Course = {
  id: string;
  title: string;
  category: string;
};

// You can map categories to colors/icons
const categoryStyles: Record<string, { color: string; icon: keyof typeof Ionicons.glyphMap }> = {
  Design: { color: '#FFD6E0', icon: 'color-palette-outline' },
  Development: { color: '#D0EBFF', icon: 'code-slash-outline' },
  Business: { color: '#FFE6CC', icon: 'briefcase-outline' },
  Data: { color: '#E5E5FF', icon: 'bar-chart-outline' },
};

const allCourses: Course[] = [
  { id: '1', title: 'UI/UX Design', category: 'Design' },
  { id: '2', title: 'Web Development', category: 'Development' },
  { id: '3', title: 'Data Science', category: 'Data' },
  { id: '4', title: 'Marketing', category: 'Business' },
  { id: '5', title: 'Machine Learning', category: 'Data' },
  { id: '6', title: 'Digital Marketing', category: 'Business' },
  { id: '7', title: 'Mobile App Development', category: 'Development' },
  { id: '8', title: 'Graphic Design', category: 'Design' },
  { id: '9', title: 'Python Programming', category: 'Development' },
  { id: '10', title: 'JavaScript', category: 'Development' },
  { id: '11', title: 'Business Analytics', category: 'Business' },
  { id: '12', title: 'Product Management', category: 'Business' },
  { id: '13', title: 'Cybersecurity', category: 'Development' },
  { id: '14', title: 'Cloud Computing', category: 'Development' },
  { id: '15', title: 'Digital Illustration', category: 'Design' },
  { id: '16', title: 'Public Adminstration', category: 'Business'}
];

export default function ExploreScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(allCourses);

  useEffect(() => {
    if (params.search) {
      const keyword = params.search.toString();
      setSearchQuery(keyword);
      filterCourses(keyword);
    }
  }, [params]);

  const filterCourses = (text: string) => {
    const filtered = allCourses.filter(course =>
      course.title.toLowerCase().includes(text.toLowerCase()) ||
      course.category.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    filterCourses(text);
  };

  const handleCoursePress = (course: Course) => {
    router.push({
      pathname: '/courses',
      params: { course: course.title },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <Text style={styles.header}>🎓 Explore Courses</Text>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#888" />
            <TextInput
              placeholder="Search by title or category"
              placeholderTextColor="#888"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={handleSearch}
              returnKeyType="search"
            />
          </View>

          {/* Course Grid */}
          {filteredCourses.length === 0 ? (
            <Text style={styles.emptyMessage}>No courses found.</Text>
          ) : (
            <FlatList
              data={filteredCourses}
              keyExtractor={(item) => item.id}
              numColumns={2}
              contentContainerStyle={styles.courseList}
              columnWrapperStyle={styles.courseRow}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                const { color, icon } = categoryStyles[item.category] || {
                  color: '#EEE',
                  icon: 'school-outline',
                };
                return (
                  <TouchableOpacity
                    style={[styles.courseCard, { backgroundColor: color }]}
                    onPress={() => handleCoursePress(item)}
                  >
                    <View style={styles.iconWrapper}>
                      <Ionicons name={icon} size={30} color="#333" />
                    </View>
                    <Text style={styles.courseTitle}>{item.title}</Text>
                    <Text style={styles.courseCategory}>{item.category}</Text>
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
    backgroundColor: '#ADD8E6', // Light Blue Background
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 20,
    color: Colors.light.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 20,
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
  },
  courseList: {
    paddingBottom: 100,
  },
  courseRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
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
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  courseCategory: {
    fontSize: 13,
    color: '#555',
    textAlign: 'center',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 30,
  },
});
