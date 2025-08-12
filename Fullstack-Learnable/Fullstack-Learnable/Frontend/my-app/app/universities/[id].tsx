import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { universitiesData, University } from '../../data/universitiesData';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../constants/Colors';

const STATUS_OPTIONS = ['not_started', 'in_progress', 'completed'];

const UniversityDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isDarkMode } = useTheme();
  const Colors = getThemeColors(isDarkMode);

  const university: University | undefined = universitiesData.find((u) => u.id === id);
  const [progress, setProgress] = useState<{ [courseId: string]: string }>({});

  const handleProgressChange = (courseId: string, status: string) => {
    setProgress((prev) => ({
      ...prev,
      [courseId]: status,
    }));
  };

  if (!university) {
    return (
      <View style={[styles.centered, { backgroundColor: Colors.background }]}>
        <Text style={[styles.errorText, { color: Colors.error || 'red' }]}>University not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors.background }]}>
      <Image source={university.logo} style={styles.logo} resizeMode="contain" />
      <Text style={[styles.name, { color: Colors.text }]}>{university.name}</Text>
      <Text style={[styles.description, { color: Colors.muted }]}>{university.description}</Text>

      <TouchableOpacity
        style={[styles.linkButton, { backgroundColor: Colors.primary }]}
        onPress={() => Linking.openURL(university.url)}
      >
        <Text style={styles.linkText}>Visit Official Website</Text>
      </TouchableOpacity>

      <Text style={[styles.sectionTitle, { color: Colors.text }]}>Available Courses</Text>

      {university.courses.map((course) => (
        <View
          key={course.id}
          style={[
            styles.courseCard,
            {
              backgroundColor: Colors.surface,
              borderColor: Colors.border,
            },
          ]}
        >
          <Text style={[styles.courseTitle, { color: Colors.text }]}>{course.title}</Text>

          <View style={styles.statusRow}>
            {STATUS_OPTIONS.map((status) => {
              const isSelected = progress[course.id] === status;
              return (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.statusButton,
                    {
                      backgroundColor: isSelected ? Colors.success || '#4CAF50' : Colors.surface,
                      borderColor: isSelected ? Colors.success || '#4CAF50' : Colors.border,
                    },
                  ]}
                  onPress={() => handleProgressChange(course.id, status)}
                >
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color: isSelected ? '#fff' : Colors.text,
                        fontWeight: isSelected ? '600' : '400',
                      },
                    ]}
                  >
                    {status.replace('_', ' ')}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default UniversityDetailScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    marginTop:30,
    width: '100%',
    height: 100,
    marginBottom: 16,
  },
  name: {
    textAlign:'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  linkButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignSelf: 'center',
  },
  linkText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  courseCard: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statusButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 13,
  },
  errorText: {
    fontSize: 18,
  },
});
