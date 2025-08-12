package com.learnable.backend.repository;

import com.learnable.backend.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for performing CRUD operations on Question entities.
 */
@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    /**
     * Retrieves all questions linked to a specific quiz, ordered by their ID (ascending).
     * Useful for consistent rendering of quiz questions.
     *
     * @param quizId the ID of the associated quiz
     * @return List of questions ordered by ID ascending
     */
    List<Question> findByQuizIdOrderByIdAsc(Long quizId);
}
