package com.learnable.backend.service;

import com.learnable.backend.model.Question;
import com.learnable.backend.model.Quiz;
import com.learnable.backend.repository.QuestionRepository;
import com.learnable.backend.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

/**
 * Service layer for managing Questions.
 * Provides CRUD operations and handles associations with quizzes.
 */
@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final QuizRepository quizRepository;

    // --- READ OPERATIONS ---

    /**
     * Retrieve all questions.
     *
     * @return List of all Question entities
     */
    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    /**
     * Retrieve a question by its ID.
     *
     * @param id Question ID
     * @return Optional containing the question if found, empty otherwise
     */
    public Optional<Question> findById(Long id) {
        return questionRepository.findById(id);
    }

    /**
     * Retrieve a question by ID or throw 404 if not found.
     *
     * @param id Question ID
     * @return Question entity
     * @throws ResponseStatusException if question not found
     */
    public Question getByIdOrThrow(Long id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> notFound("Question", id));
    }

    // --- CREATE OPERATIONS ---

    /**
     * Add a new question to an existing quiz.
     *
     * @param quizId   Quiz ID to associate with
     * @param question Question entity to add
     * @return Saved Question entity
     * @throws ResponseStatusException if quiz not found
     */
    @Transactional
    public Question addQuestionToQuiz(Long quizId, Question question) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> notFound("Quiz", quizId));

        question.setQuiz(quiz);
        return questionRepository.save(question);
    }

    // --- UPDATE OPERATIONS ---

    /**
     * Update an existing question by its ID.
     *
     * @param questionId Question ID
     * @param updated    Question entity containing updated fields
     * @return Updated Question entity
     * @throws ResponseStatusException if question not found
     */
    @Transactional
    public Question updateQuestion(Long questionId, Question updated) {
        return questionRepository.findById(questionId)
                .map(existing -> {
                    existing.setQuestionText(updated.getQuestionText());
                    existing.setOptions(updated.getOptions());
                    existing.setCorrectAnswer(updated.getCorrectAnswer());
                    return questionRepository.save(existing);
                })
                .orElseThrow(() -> notFound("Question", questionId));
    }

    // --- DELETE OPERATIONS ---

    /**
     * Delete a question by its ID.
     *
     * @param id Question ID
     * @throws ResponseStatusException if question not found
     */
    @Transactional
    public void deleteQuestionById(Long id) {
        if (!questionRepository.existsById(id)) {
            throw notFound("Question", id);
        }
        questionRepository.deleteById(id);
    }

    // --- UTILITY METHODS ---

    /**
     * Helper method to throw a standardized 404 NOT FOUND exception.
     *
     * @param entity Entity name (e.g., "Question")
     * @param id     Entity ID
     * @return ResponseStatusException with NOT FOUND status
     */
    private ResponseStatusException notFound(String entity, Long id) {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, entity + " not found with ID: " + id);
    }
}
