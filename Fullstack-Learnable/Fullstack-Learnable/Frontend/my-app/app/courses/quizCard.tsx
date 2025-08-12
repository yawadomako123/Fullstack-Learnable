import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface QuestionCardProps {
  questionText: string;
  options: string[];
  correctAnswer: string;
  onAnswer: (isCorrect: boolean) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  questionText,
  options,
  correctAnswer,
  onAnswer,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionPress = (option: string) => {
    if (selectedOption !== null) return;

    setSelectedOption(option);
    const isCorrect = option === correctAnswer;
    onAnswer(isCorrect);
  };

  return (
    <View style={styles.card}>
      {questionText ? (
        <Text style={styles.question}>{questionText}</Text>
      ) : (
        <Text style={styles.missing}>⚠️ Question text is missing!</Text>
      )}

      {options && options.length > 0 ? (
        options.map((option, index) => {
          const isSelected = selectedOption === option;
          const isCorrect = option === correctAnswer;

          let optionStyle = styles.option;

          if (selectedOption) {
            if (isSelected && isCorrect) {
              optionStyle = { ...optionStyle, ...styles.correctOption };
            } else if (isSelected && !isCorrect) {
              optionStyle = { ...optionStyle, ...styles.incorrectOption };
            } else if (isCorrect) {
              optionStyle = { ...optionStyle, ...styles.correctReveal };
            }
          }

          return (
            <TouchableOpacity
              key={index}
              style={optionStyle}
              onPress={() => handleOptionPress(option)}
              disabled={!!selectedOption}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          );
        })
      ) : (
        <Text style={styles.missing}>⚠️ No options provided.</Text>
      )}
    </View>
  );
};

export default QuestionCard;

const styles = StyleSheet.create({
  card: {
    marginBottom: 24,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  question: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  missing: {
    fontSize: 16,
    color: "#cc0000",
    fontStyle: "italic",
    marginBottom: 12,
  },
  option: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  correctOption: {
    backgroundColor: "#d4edda",
    borderColor: "#28a745",
  },
  incorrectOption: {
    backgroundColor: "#f8d7da",
    borderColor: "#dc3545",
  },
  correctReveal: {
    backgroundColor: "#e6f4ea",
    borderColor: "#218838",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
});
