import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  ScrollView,
  Modal,
} from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Helper to save progress
const markModuleComplete = async (courseId: string, moduleId: string) => {
  try {
    const key = `progress_course_${courseId}`;
    const stored = await AsyncStorage.getItem(key);
    const current: number[] = stored ? JSON.parse(stored) : [];

    if (!current.includes(Number(moduleId))) {
      current.push(Number(moduleId));
      await AsyncStorage.setItem(key, JSON.stringify(current));
    }
  } catch (e) {
    console.error("Failed to mark module as complete", e);
  }
};

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface NextModuleResponse {
  nextModuleId: number | null;
}

const QuizScreen = () => {
  const { moduleId, quizTitle, id } = useLocalSearchParams();
  const navigation = useNavigation();
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const module = typeof moduleId === "string" ? moduleId : "";
  const courseId = typeof id === "string" ? id : "";
  const title = typeof quizTitle === "string" ? decodeURIComponent(quizTitle) : "Quiz";

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<boolean[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [nextModuleId, setNextModuleId] = useState<string | null>(null);

  useEffect(() => {
    const loadQuiz = async () => {
      setLoading(true);
      try {
        const [quizRes, nextRes] = await Promise.all([
          fetch(`http://192.168.8.120:8080/api/quizzes/modules/${module}`),
          fetch(`http://192.168.8.120:8080/api/modules/${module}/next`),
        ]);

        const quizData = await quizRes.json();
        const nextData: NextModuleResponse = await nextRes.json();

        const normalized: Question[] = (quizData.questions || []).map((q: any) => ({
          id: q.id,
          question: q.questionText || "Untitled question",
          options: Array.isArray(q.options) ? q.options : [],
          correctAnswer: q.correctAnswer || "",
        }));

        setQuestions(normalized);
        setAnswered(new Array(normalized.length).fill(false));
        setNextModuleId(nextData?.nextModuleId ? String(nextData.nextModuleId) : null);
      } catch (err: any) {
        console.error("Quiz load error:", err);
        setError("Failed to load quiz.");
      } finally {
        setLoading(false);
      }
    };

    if (module) loadQuiz();
    else {
      setError("Missing module ID.");
      setLoading(false);
    }
  }, [module]);

  const handleOptionSelect = (option: string) => {
    if (answered[currentIndex]) return;

    const correct = questions[currentIndex].correctAnswer === option;
    if (correct) setScore((s) => s + 1);

    setSelectedOption(option);
    const updated = [...answered];
    updated[currentIndex] = true;
    setAnswered(updated);

    if (currentIndex === questions.length - 1) {
      setTimeout(() => {
        setQuizCompleted(true);
        setShowConfetti(true);
        saveResult();
        if (courseId && module) markModuleComplete(courseId, module);
      }, 600);
    } else {
      setTimeout(() => handleNavigation("next"), 900);
    }
  };

  const handleNavigation = (dir: "next" | "prev") => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setSelectedOption(null);
      setCurrentIndex((prev) =>
        dir === "next"
          ? Math.min(prev + 1, questions.length - 1)
          : Math.max(prev - 1, 0)
      );
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const saveResult = async () => {
    try {
      await fetch("http://192.168.8.120:8080/api/quizzes/save-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleId: module,
          score,
          total: questions.length,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch {
      console.warn("Quiz result save failed.");
    }
  };

  const handleContinueToNextModule = () => {
    if (courseId) {
      router.push({
        pathname: `/courses/${courseId}`,
        params: { unlock: "next" },
      });
    } else {
      router.push("/(tabs)");
    }
  };

  const renderOption = (opt: string, index: number) => {
    const isSelected = selectedOption === opt;
    const isCorrect = opt === questions[currentIndex].correctAnswer;
    const isAnswered = answered[currentIndex];
    const letters = ["A", "B", "C", "D"];

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.optionButton,
          isAnswered &&
            isSelected && {
              backgroundColor: isCorrect ? "#d4edda" : "#f8d7da",
              borderColor: isCorrect ? "#28a745" : "#dc3545",
            },
        ]}
        onPress={() => handleOptionSelect(opt)}
        disabled={isAnswered}
      >
        <Text style={styles.optionLabel}>{letters[index]}</Text>
        <Text style={styles.optionText}>{opt}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#2a6ff3" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#2a6ff3" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>

      <ScrollView style={styles.content}>
        <Animated.View style={[styles.questionBox, { opacity: fadeAnim }]}>
          <Text style={styles.questionText}>
            {currentIndex + 1}. {questions[currentIndex]?.question}
          </Text>

          {questions[currentIndex]?.options.length > 0 ? (
            questions[currentIndex].options.map((opt, i) => renderOption(opt, i))
          ) : (
            <Text style={{ fontStyle: "italic", color: "#666" }}>
              No options available.
            </Text>
          )}

          <View style={styles.navButtons}>
            <TouchableOpacity
              style={[styles.navBtn, currentIndex === 0 && { opacity: 0.4 }]}
              onPress={() => handleNavigation("prev")}
              disabled={currentIndex === 0}
            >
              <Text style={styles.navText}>⬅ Prev</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.navBtn,
                currentIndex === questions.length - 1 && { opacity: 0.4 },
              ]}
              onPress={() => handleNavigation("next")}
              disabled={currentIndex === questions.length - 1}
            >
              <Text style={styles.navText}>Next ➡</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>

      <Modal visible={quizCompleted} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>🎉 Quiz Completed!</Text>
            <Text style={styles.modalScore}>
              You scored {score} out of {questions.length}
            </Text>
            <TouchableOpacity
              style={styles.nextModuleBtn}
              onPress={handleContinueToNextModule}
            >
              <Text style={styles.restartText}>Continue ➡</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {showConfetti && (
        <View style={styles.confettiLayer}>
          <ConfettiCannon
            count={200}
            origin={{ x: 200, y: -10 }}
            fadeOut
            fallSpeed={3000}
          />
        </View>
      )}
    </View>
  );
};

export default QuizScreen;



// Styles (unchanged from your provided version)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6fa" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomColor: "#e0e0e0",
    borderBottomWidth: 1,
    backgroundColor: "#fff",
  },
    centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
    flex: 1,
    color: "#2a6ff3",
  },
  content: { flex: 1, padding: 20 },
  error: { fontSize: 16, color: "red", marginTop: 12 },
  questionBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginBottom: 24,
    flexShrink: 1,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    color: "#333",
    flexWrap: "wrap",
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
  },
  optionLabel: {
    width: 26,
    height: 26,
    textAlign: "center",
    textAlignVertical: "center",
    borderRadius: 13,
    backgroundColor: "#2a6ff3",
    color: "#fff",
    fontWeight: "600",
    marginRight: 10,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    flexWrap: "wrap",
  },
  navButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  navBtn: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  navText: {
    fontSize: 16,
    color: "#2a6ff3",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2a6ff3",
    marginBottom: 12,
  },
  modalScore: {
    fontSize: 18,
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  restartBtn: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  restartText: {
    fontSize: 16,
    color: "#2a6ff3",
    fontWeight: "600",
  },
  nextModuleBtn: {
    backgroundColor: "#d6e4ff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  confettiLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999999,
    elevation: 1000,
  },
});
