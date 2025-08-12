package com.learnable.backend.mapper;

import com.learnable.backend.dto.QuestionDto;
import com.learnable.backend.dto.QuizDto;
import com.learnable.backend.model.Question;
import com.learnable.backend.model.Quiz;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper class for converting between Quiz and QuizDto,
 * and between Question and QuestionDto.
 */
public class QuizMapper {

    // === ENTITY ➜ DTO ===

    public static QuizDto toDto(Quiz quiz) {
        if (quiz == null) return null;

        return QuizDto.builder()
                .id(quiz.getId())
                .title(quiz.getTitle())
                .questions(toQuestionDtoList(quiz.getQuestions()))
                .build();
    }

    private static List<QuestionDto> toQuestionDtoList(List<Question> questions) {
        if (questions == null || questions.isEmpty()) return Collections.emptyList();

        return questions.stream()
                .map(QuizMapper::toQuestionDto)
                .collect(Collectors.toList());
    }

    public static QuestionDto toQuestionDto(Question question) {
        if (question == null) return null;

        return QuestionDto.builder()
                .id(question.getId())
                .questionText(question.getQuestionText())
                .options(question.getOptions() != null ? new ArrayList<>(question.getOptions()) : new ArrayList<>())
                .correctAnswer(question.getCorrectAnswer())
                .build();
    }

    // === DTO ➜ ENTITY ===

    public static Quiz toEntity(QuizDto dto) {
        if (dto == null) return null;

        Quiz quiz = Quiz.builder()
                .id(dto.getId())
                .title(dto.getTitle())
                .build();

        if (dto.getQuestions() != null && !dto.getQuestions().isEmpty()) {
            // Map questions and assign the quiz as parent for bidirectional linking
            List<Question> questions = dto.getQuestions().stream()
                    .map(qDto -> mapQuestionDtoToEntity(qDto, quiz))
                    .collect(Collectors.toList());

            quiz.setQuestions(questions);
        }

        return quiz;
    }

    public static Question toEntity(QuestionDto dto) {
        return mapQuestionDtoToEntity(dto, null);
    }

    /**
     * Maps a QuestionDto to Question entity, setting the parent Quiz.
     * @param dto the question DTO
     * @param parentQuiz the parent Quiz entity or null
     * @return Question entity with linked parent Quiz
     */
    public static Question mapQuestionDtoToEntity(QuestionDto dto, Quiz parentQuiz) {
        if (dto == null) return null;

        Question question = Question.builder()
                .id(dto.getId())
                .questionText(dto.getQuestionText())
                .options(dto.getOptions() != null ? new ArrayList<>(dto.getOptions()) : new ArrayList<>())
                .correctAnswer(dto.getCorrectAnswer())
                .quiz(parentQuiz)
                .build();

        // Optionally maintain bidirectional link here if you don't rely on quiz.setQuestions to do it:
        // if (parentQuiz != null) {
        //     parentQuiz.addQuestion(question);
        // }

        return question;
    }
}
