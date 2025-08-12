package com.learnable.backend.mapper;

import com.learnable.backend.dto.LessonDto;
import com.learnable.backend.dto.QuizDto;
import com.learnable.backend.model.Lesson;
import com.learnable.backend.model.Quiz;
import com.learnable.backend.model.Question;

import java.util.ArrayList;

/**
 * Mapper class to convert between Lesson entity and LessonDto.
 */
public class LessonMapper {

    // === ENTITY → DTO ===

    /**
     * Converts a Lesson entity to a LessonDto.
     *
     * @param lesson the Lesson entity
     * @return corresponding LessonDto
     */
    public static LessonDto toDto(Lesson lesson) {
        if (lesson == null) return null;

        QuizDto quizDto = lesson.getQuiz() != null
                ? QuizMapper.toDto(lesson.getQuiz())
                : null;

        return LessonDto.builder()
                .id(lesson.getId())
                .title(lesson.getTitle())
                .content(lesson.getContent())
                .videoUrl(lesson.getVideoUrl())
                .pdfUrl(lesson.getPdfUrl())
                .orderIndex(lesson.getOrderIndex())
                .quiz(quizDto)
                .build();
    }

    // === DTO → ENTITY ===

    /**
     * Converts a LessonDto to a Lesson entity.
     *
     * @param dto the LessonDto
     * @return corresponding Lesson entity
     */
    public static Lesson toEntity(LessonDto dto) {
        if (dto == null) return null;

        Lesson lesson = Lesson.builder()
                .id(dto.getId())
                .title(dto.getTitle())
                .content(dto.getContent())
                .videoUrl(dto.getVideoUrl())
                .pdfUrl(dto.getPdfUrl())
                .orderIndex(dto.getOrderIndex())
                .build();

        if (dto.getQuiz() != null) {
            QuizDto quizDto = dto.getQuiz();

            Quiz quiz = Quiz.builder()
                    .id(quizDto.getId())
                    .title(quizDto.getTitle())
                    .questions(new ArrayList<>())
                    .build();

            // Link lesson and quiz bidirectionally
            quiz.setLesson(lesson);
            lesson.setQuiz(quiz);

            if (quizDto.getQuestions() != null) {
                for (var questionDto : quizDto.getQuestions()) {
                    Question question = QuizMapper.toEntity(questionDto);
                    question.setQuiz(quiz); // set owning side
                    quiz.getQuestions().add(question);
                }
            }
        }

        return lesson;
    }
}
