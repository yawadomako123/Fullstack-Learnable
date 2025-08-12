import React, { useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Linking,
  Image,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import Markdown from "react-native-markdown-display";
import { ArrowLeft, Download } from "lucide-react-native";
import { Video, ResizeMode } from "expo-av";

const LessonScreen = () => {
  const { title, content, videoUrl, pdfUrl } = useLocalSearchParams();
  const navigation = useNavigation();
  const videoRef = useRef(null);

  const safeDecode = (value?: string | string[]) => {
    if (!value) return "";
    try {
      return decodeURIComponent(value as string);
    } catch {
      return value as string;
    }
  };

  const decodedTitle = safeDecode(title as string);
  const decodedContent = safeDecode(content as string);
  const decodedVideoUrl = safeDecode(videoUrl as string);
  const decodedPdfUrl = safeDecode(pdfUrl as string);

  const handleOpenPdf = async () => {
    if (!decodedPdfUrl) return;
    const supported = await Linking.canOpenURL(decodedPdfUrl);
    if (supported) {
      Linking.openURL(decodedPdfUrl);
    } else {
      Alert.alert("Cannot open PDF", "The link may be broken or unavailable.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color="#2a6ff3" />
        </TouchableOpacity>
        <Text style={styles.headerText} numberOfLines={1} ellipsizeMode="tail">
          {decodedTitle || "Lesson"}
        </Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.card}>
        

          {/* PDF Thumbnail & Download Button */}
          {!!decodedPdfUrl && (
            <View style={styles.pdfPreview}>
              <Image
                source={require("../../assets/images/pdf-preview.jpg")} // 👈 replace with your own thumbnail if needed
                style={styles.pdfImage}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={handleOpenPdf}
              >
                <Download size={18} color="#fff" />
                <Text style={styles.downloadText}>Download PDF</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Markdown Lesson Content */}
          {!!decodedContent ? (
            <Markdown style={markdownStyles}>{decodedContent}</Markdown>
          ) : (
            <Text style={styles.emptyText}>No lesson content available.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default LessonScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#d0d7de",
    backgroundColor: "#fff",
    elevation: 2,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 12,
    flex: 1,
    color: "#2a6ff3",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    elevation: 6,
  },
  videoWrapper: {
    width: "100%",
    aspectRatio: 16 / 9,
    marginBottom: 20,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  pdfPreview: {
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 24,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    paddingBottom: 12,
  },
  pdfImage: {
    width: "100%",
    height: 220,
  },
  downloadButton: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#2a6ff3",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  downloadText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  emptyText: {
    color: "#888",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});

const markdownStyles = StyleSheet.create({
  body: {
    fontSize: 16,
    lineHeight: 26,
    color: "#333",
  },
  heading1: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 14,
    color: "#2a6ff3",
  },
  heading2: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2a6ff3",
  },
  heading3: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  paragraph: {
    marginBottom: 14,
  },
  list_item: {
    marginVertical: 6,
  },
  strong: {
    fontWeight: "bold",
  },
  em: {
    fontStyle: "italic",
  },
  blockquote: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f1f1f1",
    borderLeftWidth: 5,
    borderLeftColor: "#2a6ff3",
    marginBottom: 18,
    fontStyle: "italic",
  },
  code_inline: {
    backgroundColor: "#eaeaea",
    fontFamily: "monospace",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    color: "#444",
  },
  code_block: {
    backgroundColor: "#eaeaea",
    padding: 16,
    borderRadius: 8,
    fontFamily: "monospace",
    marginBottom: 18,
  },
  link: {
    color: "#2a6ff3",
    textDecorationLine: "underline",
    fontWeight: "600",
  },
  image: {
    borderRadius: 12,
    marginVertical: 12,
  },
});
