import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  useColorScheme,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';
import { Asset } from 'expo-asset';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Colors, getThemeColors } from '../../constants/Colors';
import Carousel from '@/components/Carousel';
// import { universities } from '../../data/universitiesData';

const SCREEN_WIDTH = Dimensions.get('window').width;

const categories = [
  { name: 'Technology', description: 'Code, build, and master the future.', icon: 'code-slash-outline', search: 'Development' },
  { name: 'Business', description: 'Marketing, leadership, and strategy.', icon: 'briefcase-outline', search: 'Business' },
  { name: 'Design', description: 'UI, UX, and creative skills.', icon: 'color-palette-outline', search: 'Design' },
] as const;

type Category = (typeof categories)[number]['name'];

const categoryColors = {
  light: {
    Technology: '#B3DBFF',
    Business: '#FFD8A8',
    Design: '#E3C6FF',
  },
  dark: {
    Technology: '#235A9C',
    Business: '#A6621B',
    Design: '#734C99',
  },
};

const courses = [
  { id: '1', title: 'Introduction to Python', instructor: 'Dr. Jane Smith', image: require('../../assets/images/python.jpg'), progress: 0.65 },
  { id: '2', title: 'Machine Learning Fundamentals', instructor: 'Prof. John Doe', image: require('../../assets/images/AI.jpg'), progress: 0.3 },
  { id: '3', title: 'Web Development Bootcamp', instructor: 'Alex Johnson', image: require('../../assets/images/web-development.jpg'), progress: 0.1 },
];

const recentCourses = [
  { id: 'course3', title: 'UI/UX Design', category: 'Design' },
  { id: 'course1', title: 'Python Programming', category: 'Technology' },
  { id: 'course2', title: 'Business Analytics', category: 'Business' },
];

const videoAssets: Record<string, any> = {
  course1: require('../../assets/videos/python-programming.mp4'),
  course2: require('../../assets/videos/business-analytics.mp4'),
  course3: require('../../assets/videos/ui-design.mp4'),
  default: require('../../assets/videos/default.mp4'),
};

const getVideoUri = (id: string): string => Asset.fromModule(videoAssets[id] || videoAssets.default).uri;

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

export default function InterfaceScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const Colors = getThemeColors(isDarkMode);
  const scheme = useColorScheme();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuAnim = useRef(new Animated.Value(-SCREEN_WIDTH * 0.5)).current;
  const activeCategoryBg = categoryColors[scheme === 'dark' ? 'dark' : 'light'];
  const [fetchedCourses, setFetchedCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
const [focusedInput, setFocusedInput] = useState<string | null>(null);


  const toggleMenu = (open: boolean) => {
    setMenuOpen(open);
    Animated.timing(menuAnim, {
      toValue: open ? 0 : -SCREEN_WIDTH * 0.5,
      duration: 300,
      useNativeDriver: true,
    }).start(() => !open && setMenuOpen(false));
  };

   useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://192.168.8.120:8080/api/courses');
        const data = await response.json();

        const parsed = Array.isArray(data)
          ? data
          : Array.isArray(data.courses)
          ? data.courses
          : data?.id && data?.title
          ? [data]
          : [];

        setFetchedCourses(parsed.slice(0, 4));
      } catch (error) {
        console.error('❌ Failed to fetch courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const navigateCourse = (id: string) => router.push(`/courses/${id}`);
   const navigateVideo = () => router.push('/videopage');
  const navigateExplore = (filter?: string) => router.push({ pathname: '/explore', params: filter ? { search: filter } : {} });

const universities = [
  {
    id: 'harvard',
    name: 'Harvard University',
    logo: require('../../assets/images/havard.jpeg'),
    description: 'Explore Harvard’s online courses',
    coursesUrl: 'https://online-learning.harvard.edu/',
  },
  {
    id: 'stanford',
    name: 'Stanford University',
    logo: require('../../assets/images/Stanford.png'),
    description: 'Learn from Stanford online',
    coursesUrl: 'https://online.stanford.edu/courses',
  },
  {
    id: 'mit',
    name: 'MIT',
    logo: require('../../assets/images/MIT.jpeg'),
    description: 'MIT’s OpenCourseWare programs',
    coursesUrl: 'https://ocw.mit.edu/',
  },
  // Add more as needed...
];


const navigateToUniversitiesScreen = () => {
  router.push('/universities/universities'); // your dedicated university list page
};


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.background }]}>      
      {menuOpen && <Pressable onPress={() => toggleMenu(false)} style={styles.overlay} />}

<Animated.View
  style={[
    styles.drawer,
    {
      transform: [{ translateX: menuAnim }],
      backgroundColor: Colors.surface,
      borderRightWidth: 1,
      borderRightColor: Colors.border,
      paddingTop: 60,
      paddingHorizontal: 16,
    },
  ]}
>
  {[
    { label: 'Assignments', path: '/assignment', icon: 'document-text-outline' },
    { label: 'Quizzes', path: '/quizzes', icon: 'help-circle-outline' },
        { label: 'Discover Interest', path: '/videopage', icon: 'play-outline' },
    { label: 'Universities', path: '../universities/universities', icon: 'school-outline' },
  ].map((item) => (
    <TouchableOpacity
      key={item.label}
      style={styles.drawerItem}
      onPress={() => {
        toggleMenu(false);
        router.push(item.path as any);
      }}
    >
      <Ionicons name={item.icon as any} size={20} color={Colors.primary} style={styles.drawerIcon} />
      <Text style={[styles.drawerText, { color: Colors.text }]}>{item.label}</Text>
    </TouchableOpacity>
  ))}
</Animated.View>


      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => toggleMenu(true)}>
          <Ionicons name="menu-outline" size={26} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/notifications')}>
          <Ionicons name="notifications-outline" size={26} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: Colors.text }]}>
            {getGreeting()}, <Text style={{ color: Colors.primary }}>{user?.username || 'Learner'}👋</Text>
          </Text>
          <Text style={[styles.subtitle, { color: Colors.muted }]}>Ready to learn?</Text>
        </View>

        <View
  style={[
    styles.searchBar,
    { backgroundColor: Colors.surface },
    focusedInput === 'search' && styles.inputWrapperFocused,
  ]}
>
  <Ionicons name="search-outline" size={20} color={Colors.muted} />
  <TextInput
    placeholder="Search courses..."
    placeholderTextColor={Colors.muted}
    style={[styles.searchInput, { color: Colors.text }]}
    value={search}
    onChangeText={setSearch}
    onFocus={() => setFocusedInput('search')}
    onBlur={() => setFocusedInput(null)}
  />
</View>

              {/* Carousel  */}
       <View style={{ marginBottom: 28, marginLeft:-25, }}>
         <Carousel />
       </View>


        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: Colors.text }]}>Categories</Text>
            <TouchableOpacity onPress={() => navigateExplore()}>
              <Text style={[styles.seeAll, { color: Colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>

          {/* <View style={styles.categoriesColumn}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.name}
                style={[styles.categoryCard, { backgroundColor: activeCategoryBg[cat.name] }]}
                onPress={() => navigateExplore(cat.search)}
              >
                <Ionicons name={cat.icon as any} size={30} color={Colors.primary} />
                <Text style={[styles.categoryName, { color: Colors.text }]}>{cat.name}</Text>
                <Text style={[styles.categoryDesc, { color: Colors.muted }]}>{cat.description}</Text>
              </TouchableOpacity>
            ))}
          </View> */}
        </View>

               <View style={styles.section}>
        <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: Colors.text }]}>Continue Learning</Text>
            <TouchableOpacity onPress={() => navigateExplore()}>
              <Text style={[styles.seeAll, { color: Colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>

        {loading ? (
          <ActivityIndicator size="small" color={Colors.primary} style={{ marginTop: 12 }} />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.continueLearningContainer}>
            {fetchedCourses.map((course) => (
              <TouchableOpacity key={course.id} style={styles.courseCard} onPress={() => navigateCourse(String(course.id))}>
                <Image source={{ uri: course.imageUrl }} style={styles.courseImage} />
                <View style={[styles.courseContent, {backgroundColor:Colors.surface}]}>
                  <Text style={[styles.courseTitle, { color: Colors.text }]} numberOfLines={1}>{course.title}</Text>
                  <Text style={[styles.courseInstructor, { color: Colors.muted }]} numberOfLines={1}>{course.instructor}</Text>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, {
                      backgroundColor: Colors.primary,
                      width: `${(course.progress ?? 0) * 100}%`
                    }]} />
                  </View>
                  <Text style={[styles.progressText, { color: Colors.muted }]}> {(course.progress ?? 0) * 100}% complete </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

        {/* Continue Learning */}
        {/* <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: Colors.text }]}>Continue Learning</Text>
            <TouchableOpacity onPress={() => navigateExplore()}>
              <Text style={[styles.seeAll, { color: Colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.continueLearningContainer}>
            {courses.map((course) => (
              <TouchableOpacity key={course.id} style={styles.courseCard} onPress={() => navigateCourse(course.id)}>
                <Image source={course.image} style={styles.courseImage} />
                <View style={[styles.courseContent,{backgroundColor:Colors.surface}]}>
                  <Text style={[styles.courseTitle, { color: Colors.text }]}>{course.title}</Text>
                  <Text style={[styles.courseInstructor, { color: Colors.muted }]}>{course.instructor}</Text>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { backgroundColor: Colors.primary, width: `${course.progress * 100}%` }]} />
                  </View>
                  <Text style={[styles.progressText, { color: Colors.muted }]}>{Math.round(course.progress * 100)}% complete</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View> */}

                      {/*Universities*/}

<View style={styles.section}>
  <View style={styles.sectionHeader}>
    <Text style={[styles.sectionTitle, { color: Colors.text }]}>
      Top Universities
    </Text>
    <TouchableOpacity onPress={navigateToUniversitiesScreen}>
      <Text style={[styles.seeAll, { color: Colors.primary }]}>See All</Text>
    </TouchableOpacity>
  </View>

  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={styles.continueLearningContainer}
  >
    {universities.map((university) => (
      <TouchableOpacity
        key={university.id}
        style={styles.courseCard}
        onPress={() =>
          router.push({
            pathname: '/universities/[id]',
            params: { id: university.id },
          })
        }
        accessibilityLabel={`Open ${university.name} details`}
      >
        <Image
          source={university.logo}
          style={[styles.courseImage, {backgroundColor:'white'}]}
          resizeMode="contain"
        />
        <View style={[styles.courseContent, { backgroundColor: Colors.surface }]}>
          <Text
            style={[styles.courseTitle, { color: Colors.text }]}
            numberOfLines={1}
          >
            {university.name}
          </Text>
          <Text
            style={[styles.courseInstructor, { color: Colors.muted }]}
            numberOfLines={2}
          >
            {university.description}
          </Text>
        </View>
      </TouchableOpacity>
    ))}
  </ScrollView>
</View>

        {/* Recently Viewed */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: Colors.text }]}>Recently Viewed</Text>
            <TouchableOpacity onPress={() => navigateVideo()}>
              <Text style={[styles.seeAll, { color: Colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>

<FlatList
  horizontal
  data={recentCourses}
  keyExtractor={(item) => item.id}
  showsHorizontalScrollIndicator={false}
  renderItem={({ item }) => (
    <TouchableOpacity
      style={styles.videoCard}
      onPress={() =>
        router.push({
          pathname: '/video/[id]',
          params: { id: item.id },
        })
      }
    >
      <Video
        source={videoAssets[item.id] ?? videoAssets.default}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        isMuted
        style={styles.video}
      />
      <View style={styles.videoOverlay}>
        <Ionicons name="play-circle-outline" size={24} color="#fff" />
        <Text style={styles.videoTitle}>{item.title}</Text>
        <Text style={styles.videoCategory}>{item.category}</Text>
      </View>
    </TouchableOpacity>
  )}
/>
        </View>

        {/* dummy */}

      </ScrollView>
    
      


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, marginTop: 40, paddingBottom: 20,
  },
  scrollContent: { padding: 20 },
  header: { alignItems: 'center', textAlign:'center',justifyContent:'center', marginBottom: 24 },
  greeting: { fontSize: 22, fontWeight: '700' },
  subtitle: { fontSize: 15 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12, paddingHorizontal: 16,
    borderRadius: 12, marginBottom: 24,
  },
  searchInput: { marginLeft: 10, flex: 1, fontSize: 16 },
  inputWrapperFocused:{
       borderColor: Colors.light.primary,
        borderWidth: 2,
    
  },
  section: { marginBottom: 28 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  seeAll: { fontSize: 14, fontWeight: '600' },
  categoriesColumn: { flexDirection: 'column', gap: 20, paddingBottom: 15 },
  categoryCard: {
    width: '100%', padding: 20, borderRadius: 15,
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12,
    shadowRadius: 4, elevation: 2,
  },
  categoryName: { fontSize: 18, fontWeight: '700', marginTop: 8 },
  categoryDesc: { fontSize: 14, marginTop: 5 },
  continueLearningContainer: { paddingBottom: 20 },
  courseCard: {
    width: 190, borderRadius: 12, marginRight: 16,
    overflow: 'hidden', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 4,
  },
  courseImage: { width: '100%', height: 100 },
  courseContent: { padding: 20,width: 190,},
  courseTitle: { fontSize: 16, fontWeight: '700' },
  courseInstructor: { fontSize: 14, marginTop: 4 },
  progressBar: { height: 4, borderRadius: 4, marginTop: 8 },
  progressFill: { height: '100%', borderRadius: 4 },
  progressText: { fontSize: 13, marginTop: 4 },
  videoCard: {
    width: 200, height: 130, borderRadius: 12,
    overflow: 'hidden', marginRight: 16, backgroundColor: '#000',
  },
  video: { ...StyleSheet.absoluteFillObject, borderRadius: 12 },
  videoOverlay: {
    flex: 1, justifyContent: 'flex-end', padding: 10,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  videoTitle: { color: '#fff', fontSize: 15, fontWeight: '700' },
  videoCategory: { color: '#eee', fontSize: 12, marginTop: 2 },
  overlay: {
    position: 'absolute', top: 0, bottom: 0,
    left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.2)', zIndex: 10,
  },
    drawer: {
    position: 'absolute', top: 0, left: 0, bottom: 0,
    width: SCREEN_WIDTH * 0.5, zIndex: 20,
  },
drawerItem: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 14,
  paddingHorizontal: 10,
  borderRadius: 10,
  marginBottom: 12,
  backgroundColor: 'rgba(0,0,0,0.03)', // lightly styled background
},
drawerText: {
  fontSize: 16,
  fontWeight: '600',
  marginLeft: 12,
},
drawerIcon: {
  width: 22,
  textAlign: 'center',
},
});
