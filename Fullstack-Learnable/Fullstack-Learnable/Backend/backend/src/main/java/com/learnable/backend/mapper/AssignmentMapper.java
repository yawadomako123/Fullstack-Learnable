package com.learnable.backend.mapper;

import com.learnable.backend.dto.AssignmentDto;
import com.learnable.backend.dto.AssignmentDto.AttachmentDto;
import com.learnable.backend.dto.AssignmentDto.RubricItemDto;
import com.learnable.backend.model.Assignment;
import com.learnable.backend.model.CourseModule;
import com.learnable.backend.model.Attachment;  // assuming you have this entity
import com.learnable.backend.model.RubricItem;  // assuming you have this entity
import java.util.List;
import java.util.stream.Collectors;

public class AssignmentMapper {

    /**
     * Converts an Assignment entity to an AssignmentDto.
     *
     * @param assignment the Assignment entity
     * @return corresponding AssignmentDto or null if input is null
     */
    public static AssignmentDto toDto(Assignment assignment) {
        if (assignment == null) {
            return null;
        }

        return AssignmentDto.builder()
                .id(assignment.getId())
                .title(assignment.getTitle())
                .instructions(assignment.getInstructions())
                .downloadUrl(assignment.getResourceUrl())  // maps resourceUrl to downloadUrl in DTO
                .submitUrl(assignment.getSubmitUrl())
                .subModuleId(assignment.getSubModule() != null ? assignment.getSubModule().getId() : null)
                // Add dueDate if your entity supports it, e.g. assignment.getDueDate()
                // .dueDate(assignment.getDueDate() != null ? assignment.getDueDate().toString() : null)
                
                // Map attachments if exist
                .attachments(mapAttachmentsToDto(assignment))
                
                // Map rubric if exist
                .rubric(mapRubricToDto(assignment))
                .build();
    }

    /**
     * Converts an AssignmentDto to an Assignment entity.
     * Note: The subModule association must be set manually after mapping to maintain separation of concerns.
     *
     * @param dto the AssignmentDto
     * @return corresponding Assignment entity or null if input is null
     */
    public static Assignment toEntity(AssignmentDto dto) {
        if (dto == null) {
            return null;
        }

        Assignment assignment = Assignment.builder()
                .id(dto.getId())
                .title(dto.getTitle())
                .instructions(dto.getInstructions())
                .resourceUrl(dto.getDownloadUrl()) // maps downloadUrl from DTO to resourceUrl in entity
                .submitUrl(dto.getSubmitUrl())
                .build();

        // subModule should be set externally to maintain separation of concerns
        
        // Note: attachments and rubric would need to be handled outside this simple mapper, 
        // since they typically involve separate entities and relationships.

        return assignment;
    }

    // Helper to map attachments from Assignment entity to DTO
    private static List<AttachmentDto> mapAttachmentsToDto(Assignment assignment) {
        // assuming Assignment has a getAttachments() method returning List<Attachment>
        if (assignment.getAttachments() == null) return null;

        return assignment.getAttachments().stream()
                .map(att -> AttachmentDto.builder()
                        .id(att.getId())
                        .fileName(att.getFileName())
                        .fileUrl(att.getFileUrl())
                        .build())
                .collect(Collectors.toList());
    }

    // Helper to map rubric items from Assignment entity to DTO
    private static List<RubricItemDto> mapRubricToDto(Assignment assignment) {
        // assuming Assignment has getRubric() method returning List<RubricItem>
        if (assignment.getRubric() == null) return null;

        return assignment.getRubric().stream()
                .map(r -> RubricItemDto.builder()
                        .category(r.getCategory())
                        .exemplary(r.getExemplary())
                        .adequate(r.getAdequate())
                        .needsImprovement(r.getNeedsImprovement())
                        .build())
                .collect(Collectors.toList());
    }
}
