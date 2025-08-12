import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

interface Module {
  id: number;
  title: string;
  subModules?: Module[];
}

interface Course {
  id: number;
  title: string;
  description: string;
  modules: Module[];
}

const ModuleScreen = () => {
  const { id: courseId, unlock } = useLocalSearchParams();
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [certLoading, setCertLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [autoNavigated, setAutoNavigated] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUserId(user.id);
        } else {
          Alert.alert("Error", "User not logged in.");
        }
      } catch (error) {
        console.error("Error loading user:", error);
        Alert.alert("Error", "Could not retrieve user information.");
      }
    };

    loadUser();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const refreshProgress = async () => {
        const progressKey = `progress_course_${courseId}`;
        const stored = await AsyncStorage.getItem(progressKey);
        if (stored) {
          setCompletedModules(JSON.parse(stored));
        }
      };

      refreshProgress();
    }, [courseId])
  );

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          `http://192.168.8.120:8080/api/courses/${courseId}`
        );
        setCourse(response.data);
      } catch (error) {
        console.error("Error fetching course:", error);
        Alert.alert("Error", "Could not load course details.");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchCourse();
  }, [courseId]);

  // Auto-navigate to next module if unlock param exists
  useEffect(() => {
    if (
      unlock === "next" &&
      course &&
      completedModules.length > 0 &&
      !autoNavigated
    ) {
      const nextIndex = course.modules.findIndex(
        (m) => !completedModules.includes(m.id)
      );

      if (nextIndex !== -1) {
        const nextModule = course.modules[nextIndex];
        setAutoNavigated(true);

        setTimeout(() => {
          router.push({
            pathname: "/courses/SubModulesListScreen",
            params: {
              moduleId: nextModule.id.toString(),
              moduleTitle: nextModule.title,
              id: courseId?.toString(),
            },
          });
        }, 500);
      }
    }
  }, [unlock, course, completedModules]);

  const handleModulePress = async (module: Module) => {
    router.push({
      pathname: "/courses/SubModulesListScreen",
      params: {
        moduleId: module.id.toString(),
        moduleTitle: module.title,
        id: courseId?.toString(),
      },
    });
  };

  const handleGetCertificate = async () => {
    if (!userId || !courseId) {
      Alert.alert("Error", "Missing user or course information.");
      return;
    }

    setCertLoading(true);
    try {
      await axios.post(
        "http://192.168.8.120:8080/api/certificates/generate",
        null,
        {
          params: {
            userId,
            courseId: courseId.toString(),
          },
        }
      );

      Alert.alert("🎉 Certificate Sent", "Check your email for the certificate!");

      setTimeout(() => {
        Linking.openURL("mailto:");
      }, 2500);
    } catch (error) {
      console.error("Certificate generation error:", error);
      Alert.alert("Error", "Unable to generate certificate. Please try again.");
    } finally {
      setCertLoading(false);
    }
  };

  if (loading || userId === null) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2a6ff3" />
      </View>
    );
  }

  if (!course) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Course not found.</Text>
      </View>
    );
  }

  const allModulesCompleted =
    course.modules.length > 0 &&
    completedModules.length === course.modules.length;

  return (
    <SafeAreaView>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.courseTitle}>{course.title}</Text>
        <Text style={styles.courseSubtitle}>
          Imported course: {course.title}
        </Text>

        {course.modules.length === 0 ? (
          <Text style={styles.emptyText}>No modules found.</Text>
        ) : (
          course.modules.map((module, index) => {
            const isUnlocked =
              index === 0 || completedModules.includes(course.modules[index - 1].id);
            const isCompleted = completedModules.includes(module.id);

            return (
              <TouchableOpacity
                key={module.id}
                onPress={() => isUnlocked && handleModulePress(module)}
                style={[styles.moduleCard, { opacity: isUnlocked ? 1 : 0.5 }]}
                disabled={!isUnlocked}
              >
                <Text style={styles.moduleTitle}>
                  {isCompleted ? "✅" : "📦"} Module {index + 1}: {module.title}
                </Text>
                <Text style={styles.lessonLink}>
                  {isUnlocked ? "▶ Tap to view submodules" : "🔒 Locked"}
                </Text>
              </TouchableOpacity>
            );
          })
        )}

        <TouchableOpacity
          style={[
            styles.certificateButton,
            { backgroundColor: allModulesCompleted ? "#4CAF50" : "#ccc" },
          ]}
          onPress={handleGetCertificate}
          disabled={!allModulesCompleted || certLoading}
        >
          {certLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.certificateText}>🎓 Get Certificate</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ModuleScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f0f4f8",
  },
  courseTitle: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 22,
    fontWeight: "bold",
    color: "#2a6ff3",
    marginBottom: 10,
  },
  courseSubtitle: {
    textAlign: "center",
    fontSize: 16,
    color: "#444",
    marginBottom: 16,
  },
  moduleCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#111",
  },
  lessonLink: {
    fontSize: 16,
    color: "#2a6ff3",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
  certificateButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 30,
    marginBottom: 50,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  certificateText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
