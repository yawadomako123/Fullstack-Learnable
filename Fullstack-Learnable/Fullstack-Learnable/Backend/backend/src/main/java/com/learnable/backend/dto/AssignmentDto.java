package com.learnable.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AssignmentDto {
    private Long id;
    private String title;
    private String instructions;
    private String downloadUrl;
    private String submitUrl;
    private Long subModuleId;  // Link to SubModule
    
    // Optional: Due date, as ISO String
    private String dueDate;

    // Optional: Rubric criteria for grading
    private List<RubricItemDto> rubric;

    // Optional: Attachments (e.g. files or links)
    private List<AttachmentDto> attachments;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class RubricItemDto {
        private String category;
        private String exemplary;
        private String adequate;
        private String needsImprovement;  // use camelCase in Java
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class AttachmentDto {
        private Long id;
        private String fileName;
        private String fileUrl;
    }
}
