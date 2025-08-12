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

interface Module {
  id: number;
  title: string;
  subModules?: Module[];
}

interface Quiz {
  id: number;
  title: string;
}

const safeToString = (value: any): string => (value != null ? value.toString() : "");

const SubModulesListScreen = () => {
  const { moduleId, id: courseId } = useLocalSearchParams();
  const router = useRouter();

  const [subModules, setSubModules] = useState<Module[]>([]);
  const [finalQuiz, setFinalQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubModulesAndQuiz = async () => {
      try {
        const courseRes = await axios.get(`http://192.168.8.120:8080/api/courses/${courseId}`);
        const allModules: Module[] = courseRes.data.modules;

        const findModuleRecursively = (modules: Module[]): Module | undefined => {
          for (const mod of modules) {
            if (mod.id === Number(moduleId)) return mod;
            if (mod.subModules?.length) {
              const found = findModuleRecursively(mod.subModules);
              if (found) return found;
            }
          }
          return undefined;
        };

        const targetModule = findModuleRecursively(allModules);
        if (!targetModule) throw new Error("Module not found.");

        setSubModules(targetModule.subModules ?? []);

        const quizRes = await axios.get(
          `http://192.168.8.120:8080/api/quizzes/modules/${moduleId}`
        );
        setFinalQuiz(quizRes.data);
      } catch (error) {
        console.error("Failed to load submodules or quiz:", error);
        Alert.alert("Error", "Could not load submodules or quiz.");
      } finally {
        setLoading(false);
      }
    };

    if (moduleId && courseId) {
      fetchSubModulesAndQuiz();
    } else {
      Alert.alert("Error", "Missing module or course ID.");
      setLoading(false);
    }
  }, [moduleId, courseId]);

  const handleSubModulePress = (subModule: Module) => {
    router.push({
      pathname: "/courses/subModuleScreen",
      params: {
        moduleId: safeToString(subModule.id),
        moduleTitle: subModule.title ?? "",
        id: safeToString(courseId),
      },
    });
  };

  const handleQuizPress = () => {
    if (!finalQuiz) return;
    router.push({
      pathname: "/courses/quizscreen",
      params: {
        quizId: safeToString(finalQuiz.id),
        moduleId: safeToString(moduleId),
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>📂 Submodules</Text>

        {subModules.length === 0 ? (
          <Text style={styles.emptyText}>No submodules found for this module.</Text>
        ) : (
          subModules.map((subModule) => (
            <TouchableOpacity
              key={subModule.id}
              style={styles.subModuleCard}
              onPress={() => handleSubModulePress(subModule)}
            >
              <Text style={styles.subModuleTitle}>📘 {subModule.title}</Text>
            </TouchableOpacity>
          ))
        )}

        {finalQuiz && (
          <View style={styles.quizContainer}>
            <Text style={styles.quizHeader}>🧠 Final Quiz</Text>
            <TouchableOpacity style={styles.quizButton} onPress={handleQuizPress}>
              <Text style={styles.quizButtonText}>Take Quiz: {finalQuiz.title}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SubModulesListScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#2a6ff3",
  },
  subModuleCard: {
    backgroundColor: "#eef6ff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderColor: "#cde0f7",
    borderWidth: 1,
  },
  subModuleTitle: {
    fontSize: 18,
    color: "#2a6ff3",
  },
  quizContainer: {
    marginTop: 30,
    padding: 16,
    backgroundColor: "#fff8e1",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ffd580",
  },
  quizHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#d18b00",
  },
  quizButton: {
    backgroundColor: "#ffd580",
    paddingVertical: 12,
    borderRadius: 8,
  },
  quizButtonText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#7a5000",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#999",
    marginTop: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
