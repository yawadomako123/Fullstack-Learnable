package com.learnable.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

/**
 * DTO representing a lesson, including optional quiz content.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LessonDto {

    private Long id;
    private String title;
    private String content;       // Markdown or plain text content
    private String videoUrl;      // Optional embedded video link
    private String pdfUrl;        // Optional PDF attachment link
    private Integer orderIndex;   // Ordering index in the module or submodule

    private QuizDto quiz;         // Optional embedded quiz DTO
}
