package com.learnable.backend.controller;

import com.learnable.backend.dto.QuizDto;
import com.learnable.backend.service.QuizService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for managing quizzes.
 */
@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    // === READ ===

    /**
     * Retrieve a quiz by its ID.
     * GET /api/quizzes/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<QuizDto> getQuizById(@PathVariable Long id) {
        System.out.println("📘 [GET] Quiz by ID: " + id);
        QuizDto quizDto = quizService.getQuizDtoById(id);
        System.out.println("✅ [GET] Found Quiz Title: " + quizDto.getTitle() + " | Questions: " + quizDto.getQuestions().size());
        return ResponseEntity.ok(quizDto);
    }

    /**
     * Retrieve a quiz associated with a specific top-level module.
     * GET /api/quizzes/modules/{moduleId}
     */
    @GetMapping("/modules/{moduleId}")
    public ResponseEntity<QuizDto> getQuizByModule(@PathVariable Long moduleId) {
        System.out.println("📘 [GET] Quiz for Module ID: " + moduleId);
        QuizDto quizDto = quizService.getQuizDtoByModuleId(moduleId);
        System.out.println("✅ [GET] Module Quiz Title: " + quizDto.getTitle() + " | Questions: " + quizDto.getQuestions().size());
        return ResponseEntity.ok(quizDto);
    }

    // === CREATE / REPLACE ===

    /**
     * Add or replace a quiz for a specific top-level module.
     * POST /api/quizzes/modules/{moduleId}
     */
    @PostMapping("/modules/{moduleId}")
    public ResponseEntity<QuizDto> addOrReplaceQuizForModule(
            @PathVariable Long moduleId,
            @Valid @RequestBody QuizDto quizDto) {

        System.out.println("📝 [POST] Incoming Quiz Title: " + quizDto.getTitle());
        System.out.println("📝 [POST] Questions Received: " +
                (quizDto.getQuestions() != null ? quizDto.getQuestions().size() : 0));

        QuizDto saved = quizService.addOrReplaceQuizForModule(moduleId, quizDto);

        System.out.println("✅ [POST] Saved Quiz ID: " + saved.getId());
        System.out.println("✅ [POST] Total Questions Saved: " +
                (saved.getQuestions() != null ? saved.getQuestions().size() : 0));

        return ResponseEntity.ok(saved);
    }

    // === UPDATE ===

    /**
     * Update an existing quiz by its ID.
     * PUT /api/quizzes/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<QuizDto> updateQuiz(
            @PathVariable Long id,
            @Valid @RequestBody QuizDto quizDto) {

        System.out.println("✏️ [PUT] Updating Quiz ID: " + id + " with Title: " + quizDto.getTitle());

        QuizDto updated = quizService.updateQuiz(id, quizDto);

        System.out.println("✅ [PUT] Updated Quiz: " + updated.getTitle() + " | Questions: " + updated.getQuestions().size());

        return ResponseEntity.ok(updated);
    }

    // === DELETE ===

    /**
     * Delete a quiz by its ID.
     * DELETE /api/quizzes/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuiz(@PathVariable Long id) {
        System.out.println("❌ [DELETE] Removing Quiz ID: " + id);
        quizService.deleteQuizById(id);
        System.out.println("✅ [DELETE] Quiz deleted.");
        return ResponseEntity.noContent().build();
    }
}
