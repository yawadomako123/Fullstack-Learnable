package com.learnable.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * DTO representing a course module or submodule,
 * containing lessons, quizzes, and possibly nested submodules.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL) // Exclude null fields in JSON output
public class ModuleDto {

    private Long id;
    private String title;
    private Integer orderIndex;

    @Builder.Default
    private List<LessonDto> lessons = new ArrayList<>();

    @JsonManagedReference
    @Builder.Default
    private List<QuizDto> quizzes = new ArrayList<>();

    @Builder.Default
    private List<ModuleDto> subModules = new ArrayList<>();

    private List<AssignmentDto> assignments;

}
