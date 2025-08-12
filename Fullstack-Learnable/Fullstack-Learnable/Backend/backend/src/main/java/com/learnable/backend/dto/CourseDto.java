package com.learnable.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * DTO for transferring Course data along with its modules.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CourseDto {

    private Long id;

    private String title;

    private String description;

    private String imageUrl;

    private String category;

    private String instructor;

    private Double rating;

    /**
     * List of top-level modules in this course.
     */
    @Builder.Default
    private List<ModuleDto> modules = new ArrayList<>();
}
