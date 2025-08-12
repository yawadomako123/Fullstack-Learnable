package com.learnable.backend.controller;

import com.learnable.backend.dto.AssignmentDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.mail.internet.MimeMessage;

@RestController
@RequestMapping("/api/assignments")
@RequiredArgsConstructor
public class AssignmentController {

    private final JavaMailSender mailSender;

    /**
     * Endpoint to submit an assignment.
     * Sends an email containing the assignment submission details.
     */
    @PostMapping("/submit")
    public ResponseEntity<String> submitAssignment(@Validated @RequestBody AssignmentDto assignmentDto) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");

            // TODO: Replace with a configurable or dynamic recipient address
            helper.setTo("joesante9@gmail.com");
            helper.setSubject("Assignment Submission: " + assignmentDto.getTitle());

            // Build email content with possible nested fields or extra info
            StringBuilder emailContent = new StringBuilder();
            emailContent.append("Assignment Title: ").append(assignmentDto.getTitle()).append("\n\n");
            emailContent.append("Instructions:\n").append(assignmentDto.getInstructions() != null ? assignmentDto.getInstructions() : "N/A").append("\n\n");

            if (assignmentDto.getDownloadUrl() != null) {
                emailContent.append("Download URL: ").append(assignmentDto.getDownloadUrl()).append("\n\n");
            }

            if (assignmentDto.getSubmitUrl() != null) {
                emailContent.append("Submit URL: ").append(assignmentDto.getSubmitUrl()).append("\n\n");
            }

            // Optionally include rubric or attachments info if part of the DTO
            // For example:
            /*
            if (assignmentDto.getRubric() != null && !assignmentDto.getRubric().isEmpty()) {
                emailContent.append("Rubric:\n");
                assignmentDto.getRubric().forEach(item -> {
                    emailContent.append("- ").append(item.getCategory()).append(":\n");
                    emailContent.append("  Exemplary: ").append(item.getExemplary()).append("\n");
                    emailContent.append("  Adequate: ").append(item.getAdequate()).append("\n");
                    emailContent.append("  Needs Improvement: ").append(item.getNeedsImprovement()).append("\n\n");
                });
            }
            */

            helper.setText(emailContent.toString());

            mailSender.send(message);

            return ResponseEntity.ok("Submission received and emailed successfully.");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to send submission email: " + ex.getMessage());
        }
    }
}
