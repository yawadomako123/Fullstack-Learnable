package com.learnable.backend.dto;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Data Transfer Object for Quiz.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class QuizDto {

    private Long id;

    private String title;

    /**
     * List of questions associated with the quiz.
     * Initialized to avoid null issues during JSON mapping.
     */
    @Builder.Default
    private List<QuestionDto> questions = new ArrayList<>();

    /**
     * Reference to the parent module of the quiz.
     * Prevents infinite recursion when serializing with Jackson.
     */
    @JsonBackReference
    private ModuleDto module;
}
