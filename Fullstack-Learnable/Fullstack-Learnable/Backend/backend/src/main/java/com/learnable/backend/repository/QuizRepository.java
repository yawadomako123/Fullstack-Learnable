package com.learnable.backend.repository;

import com.learnable.backend.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for performing CRUD operations on Quiz entities.
 */
@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {

    /**
     * Finds the first quiz associated with the specified module ID.
     * This method is retained for backward compatibility but may return
     * outdated results if multiple quizzes exist.
     *
     * @param moduleId ID of the course module
     * @return Optional containing the found quiz, or empty if none exists
     */
    @Deprecated
    Optional<Quiz> findFirstByModule_Id(Long moduleId);

    /**
     * Finds the most recently saved quiz associated with the specified module ID,
     * based on descending order of quiz ID.
     *
     * @param moduleId ID of the course module
     * @return Optional containing the latest quiz, or empty if none exists
     */
    Optional<Quiz> findTopByModule_IdOrderByIdDesc(Long moduleId);

    /**
     * Finds all quizzes associated with a given module.
     * Useful if supporting multiple quizzes per module in future.
     *
     * @param moduleId ID of the course module
     * @return List of quizzes linked to the module
     */
    List<Quiz> findAllByModule_Id(Long moduleId);
}
