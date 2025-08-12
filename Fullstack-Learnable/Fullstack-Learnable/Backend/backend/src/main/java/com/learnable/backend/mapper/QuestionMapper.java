package com.learnable.backend.mapper;

import com.learnable.backend.dto.QuestionDto;
import com.learnable.backend.model.Question;

import java.util.ArrayList;
import java.util.List;

/**
 * Mapper class for converting between Question entity and QuestionDto.
 * NOTE: Does not set the quiz relationship — this is handled in QuizMapper.
 */
public class QuestionMapper {

    /**
     * Converts a Question entity to a QuestionDto.
     *
     * @param question the Question entity to convert
     * @return the corresponding QuestionDto, or null if input is null
     */
    public static QuestionDto toDto(Question question) {
        if (question == null) return null;

        return QuestionDto.builder()
                .id(question.getId())
                .questionText(question.getQuestionText())
                .options(question.getOptions() != null ? new ArrayList<>(question.getOptions()) : new ArrayList<>())
                .correctAnswer(question.getCorrectAnswer())
                .build();
    }

    /**
     * Converts a QuestionDto to a Question entity.
     * WARNING: This does NOT set quiz reference. Use only for standalone questions.
     *
     * @param dto the QuestionDto to convert
     * @return the corresponding Question entity, or null if input is null
     */
    public static Question toEntity(QuestionDto dto) {
        if (dto == null) return null;

        return Question.builder()
                .id(dto.getId())
                .questionText(dto.getQuestionText())
                .options(dto.getOptions() != null ? new ArrayList<>(dto.getOptions()) : new ArrayList<>())
                .correctAnswer(dto.getCorrectAnswer())
                .build();
    }
}
