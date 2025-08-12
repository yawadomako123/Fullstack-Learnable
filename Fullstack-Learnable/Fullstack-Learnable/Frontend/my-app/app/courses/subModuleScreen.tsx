import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";

interface Assignment {
  id: number;
  title: string;
  // add other fields if needed
}

interface Lesson {
  id?: number;
  title: string;
  content: string;
  videoUrl?: string;
  pdfUrl?: string;
  orderIndex?: number;
}

interface Module {
  id: number;
  title: string;
  lessons?: Lesson[];
  subModules?: Module[];
}

const SubModuleScreen = () => {
  const { moduleId, moduleTitle, id: courseId } = useLocalSearchParams();
  const [module, setModule] = useState<Module | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const router = useRouter();

  // Fetch the module and lessons
  useEffect(() => {
    const fetchModule = async () => {
      try {
        const res = await axios.get(`http://192.168.8.120:8080/api/courses/${courseId}`);
        const allModules = res.data.modules as Module[];

        const findModuleById = (modules: Module[]): Module | undefined => {
          for (const mod of modules) {
            if (mod.id === Number(moduleId)) return mod;
            if (mod.subModules?.length) {
              const found = findModuleById(mod.subModules);
              if (found) return found;
            }
          }
          return undefined;
        };

        const target = findModuleById(allModules);
        if (!target) throw new Error("Module not found");

        // Sort lessons by orderIndex
        const sortedLessons = [...(target.lessons ?? [])].sort(
          (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)
        );

        setModule({ ...target, lessons: sortedLessons });
      } catch (error) {
        console.error("Fetch error:", error);
        Alert.alert("Error", "Unable to load this submodule.");
      } finally {
        setLoading(false);
      }
    };

    fetchModule();
  }, [courseId, moduleId]);

  // Fetch assignments separately
  useEffect(() => {
    const fetchAssignments = async () => {
      setLoadingAssignments(true);
      try {
        const res = await axios.get(
          `http://192.168.8.120:8080/api/modules/submodules/${moduleId}/assignments`
        );
        setAssignments(res.data); // expect array of assignments
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Unable to load assignments.");
      } finally {
        setLoadingAssignments(false);
      }
    };

    if (moduleId) {
      fetchAssignments();
    }
  }, [moduleId]);

  const handleLessonPress = (lesson: Lesson) => {
    router.push({
      pathname: "/courses/lessonscreen",
      params: {
        title: lesson.title,
        content: encodeURIComponent(lesson.content),
        videoUrl: lesson.videoUrl ?? "",
        pdfUrl: lesson.pdfUrl ?? "",
      },
    });
  };

  const handleAssignmentPress = (assignmentId: number) => {
    router.push({
      pathname: "/courses/assignmentscreen",
      params: {
        moduleId: moduleId?.toString() ?? "",
        assignmentId: assignmentId.toString(),
      },
    });
  };

  const handleSubModulePress = (sub: Module) => {
    router.push({
      pathname: "/courses/subModuleScreen",
      params: {
        moduleId: sub.id.toString(),
        moduleTitle: sub.title,
        id: courseId?.toString() ?? "",
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2a6ff3" />
      </View>
    );
  }

  if (!module) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Module not found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView>
    <ScrollView style={styles.container}>
      <Text style={styles.header}>📦 {moduleTitle}</Text>

      {/* Lessons Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lessons</Text>
        {module.lessons?.length ? (
          module.lessons.map((lesson, index) => (
            <TouchableOpacity
              key={lesson.id ?? `lesson-${index}`}
              style={styles.lessonCard}
              onPress={() => handleLessonPress(lesson)}
            >
              <Text style={styles.lessonTitle}>▶ {lesson.title}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyText}>No lessons found.</Text>
        )}
      </View>

      {/* Assignments Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Assignments</Text>
        {loadingAssignments ? (
          <ActivityIndicator size="small" color="#f39c12" />
        ) : assignments.length ? (
          assignments.map((assignment) => (
            <TouchableOpacity
              key={assignment.id}
              style={styles.assignmentCard}
              onPress={() => handleAssignmentPress(assignment.id)}
            >
              <Text style={styles.assignmentTitle}>📝 {assignment.title}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyText}>No assignments found.</Text>
        )}
      </View>

      {/* Submodules Section */}
      {module.subModules?.length ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Submodules</Text>
          {module.subModules.map((sub) => (
            <TouchableOpacity
              key={sub.id}
              style={styles.subModuleCard}
              onPress={() => handleSubModulePress(sub)}
            >
              <Text style={styles.subModuleText}>📂 {sub.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
    </ScrollView>
   </SafeAreaView> 
  );
};

export default SubModuleScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2a6ff3",
    textAlign: "center",
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  lessonCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  lessonTitle: {
    fontSize: 16,
    color: "#2a6ff3",
  },
  assignmentCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#f39c12",
  },
  assignmentTitle: {
    fontSize: 16,
    color: "#f39c12",
    fontWeight: "600",
  },
  subModuleCard: {
    backgroundColor: "#eef6ff",
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
  },
  subModuleText: {
    fontSize: 16,
    color: "#2a6ff3",
    fontWeight: "500",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
  emptyText: {
    fontSize: 15,
    color: "#999",
    textAlign: "center",
  },
});
