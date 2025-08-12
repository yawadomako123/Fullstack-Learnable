package com.learnable.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Data Transfer Object for a single Question.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class QuestionDto {

    private Long id;

    private String questionText;

    /**
     * List of possible answer options.
     * Always initialized to prevent null pointer issues.
     */
    @Builder.Default
    private List<String> options = new ArrayList<>();

    /**
     * The correct answer to the question.
     */
    private String correctAnswer;
}
