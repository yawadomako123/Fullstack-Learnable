import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import Markdown from "react-native-markdown-display";

interface Attachment {
  id: number;
  fileName: string;
  fileUrl: string;
}

interface RubricCriterion {
  category: string;
  exemplary: string;
  adequate: string;
  needs_improvement: string;
}

interface Assignment {
  id: number;
  title: string;
  instructions?: string;          // note: backend calls this "instructions"
  dueDate?: string;               // optional, if you want to add it later
  attachments?: Attachment[];     // You can add if backend supports, else omit
  submitUrl?: string;
  resourceUrl?: string;           // Backend resourceUrl (for download etc)
  subModuleId?: number;
  rubric?: RubricCriterion[];    // Based on your JSON rubric structure
}

const AssignmentScreen = () => {
  const { moduleId, assignmentId } = useLocalSearchParams();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchAssignment() {
      if (!moduleId || !assignmentId) {
        Alert.alert("Error", "Missing module or assignment ID.");
        setLoading(false);
        return;
      }

      try {
        // Fetch assignments for this submodule (moduleId)
        const response = await axios.get<Assignment[]>(
          `http://192.168.8.120:8080/api/modules/submodules/${moduleId}/assignments`
        );

        // Find assignment by id
        const found = response.data.find(
          (a) => a.id === Number(assignmentId)
        );

        if (!found) {
          Alert.alert("Error", "Assignment not found.");
          setAssignment(null);
        } else {
          setAssignment(found);
        }
      } catch (error) {
        console.error("Error fetching assignment:", error);
        Alert.alert("Error", "Unable to load assignment details.");
        setAssignment(null);
      } finally {
        setLoading(false);
      }
    }

    fetchAssignment();
  }, [moduleId, assignmentId]);

  // Format ISO date string or fallback text
  const formatDate = (iso?: string) => {
    if (!iso) return "No due date";
    try {
      return new Date(iso).toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid date";
    }
  };

  // Submit handler opens mail client with pre-filled email
  const handleSubmit = () => {
    if (!assignment) return;

    const email =
      assignment.submitUrl && assignment.submitUrl.includes("@")
        ? assignment.submitUrl
        : "learnableapk@gmail.com";

    const subject = encodeURIComponent(`Submission: ${assignment.title}`);
    const body = encodeURIComponent(
      `Hello,\n\nPlease find my submission for "${assignment.title}".\n\nThanks.`
    );

    const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;

    setSubmitting(true);
    Linking.openURL(mailtoUrl)
      .catch(() => {
        Alert.alert("Error", "Could not open the email client.");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2a6ff3" />
      </View>
    );
  }

  if (!assignment) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Assignment not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Title */}
      <Text style={styles.title}>{assignment.title}</Text>

      {/* Due date (optional) */}
      <Text style={styles.dueDate}>Due: {formatDate(assignment.dueDate)}</Text>

      {/* Instructions with Markdown rendering */}
      {assignment.instructions && assignment.instructions.trim() !== "" ? (
        <View style={styles.instructionsContainer}>
          <Markdown
  style={{
    body: styles.instructions,
    link: styles.link,
    strong: styles.bold,
  }}
  onLinkPress={(url) => {
    Linking.openURL(url).catch(() => {
      Alert.alert("Error", "Could not open the link.");
    });
    return true; // tells the Markdown component the link press was handled
  }}
>
  {assignment.instructions}
</Markdown>

        </View>
      ) : (
        <Text style={styles.instructions}>No instructions provided.</Text>
      )}

      {/* Rubric */}
      {assignment.rubric?.length ? (
        <View style={styles.rubricSection}>
          <Text style={styles.sectionTitle}>Rubric</Text>
          {assignment.rubric.map((criterion, idx) => (
            <View key={idx} style={styles.rubricItem}>
              <Text style={styles.rubricCategory}>{criterion.category}</Text>
              <Text style={styles.rubricDetail}>
                <Text style={styles.bold}>Exemplary: </Text>
                {criterion.exemplary}
              </Text>
              <Text style={styles.rubricDetail}>
                <Text style={styles.bold}>Adequate: </Text>
                {criterion.adequate}
              </Text>
              <Text style={styles.rubricDetail}>
                <Text style={styles.bold}>Needs Improvement: </Text>
                {criterion.needs_improvement}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      {/* Attachments (optional, if your backend returns them) */}
      {assignment.attachments?.length ? (
        <View style={styles.attachmentsSection}>
          <Text style={styles.sectionTitle}>Attachments</Text>
          {assignment.attachments.map((file) => (
            <TouchableOpacity
              key={file.id}
              style={styles.attachmentButton}
              onPress={() => Linking.openURL(file.fileUrl)}
            >
              <Text style={styles.attachmentText}>📎 {file.fileName}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}

      {/* Resource link (optional) */}
      {assignment.resourceUrl ? (
        <TouchableOpacity
          style={styles.resourceButton}
          onPress={() => Linking.openURL(assignment.resourceUrl!)}
        >
          <Text style={styles.resourceText}>Download Resource</Text>
        </TouchableOpacity>
      ) : null}

      {/* Submit button */}
      <TouchableOpacity
        style={[styles.submitButton, submitting && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={submitting}
      >
        <Text style={styles.submitButtonText}>
          {submitting ? "Opening email…" : "Submit Assignment"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
    
  );
};

export default AssignmentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 8,
    color: "#2a6ff3",
    textAlign: "center",
  },
  dueDate: {
    fontSize: 14,
    color: "#c0392b",
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  instructionsContainer: {
    marginBottom: 20,
  },
  instructions: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
  },
  link: {
    color: "#2a6ff3",
    textDecorationLine: "underline",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  rubricSection: {
    marginBottom: 30,
  },
  rubricItem: {
    marginBottom: 16,
    padding: 10,
    backgroundColor: "#eef",
    borderRadius: 6,
  },
  rubricCategory: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  rubricDetail: {
    fontSize: 14,
    color: "#555",
    marginLeft: 4,
  },
  bold: {
    fontWeight: "600",
  },
  attachmentsSection: {
    marginBottom: 30,
  },
  attachmentButton: {
    padding: 10,
    backgroundColor: "#e1eaff",
    borderRadius: 8,
    marginBottom: 10,
  },
  attachmentText: {
    color: "#2a6ff3",
    fontSize: 16,
  },
  resourceButton: {
    backgroundColor: "#a3c1f7",
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 30,
    alignItems: "center",
  },
  resourceText: {
    color: "#1b4ed8",
    fontSize: 16,
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#2a6ff3",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 40,
  },
  disabledButton: {
    backgroundColor: "#7f9df5",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
});
