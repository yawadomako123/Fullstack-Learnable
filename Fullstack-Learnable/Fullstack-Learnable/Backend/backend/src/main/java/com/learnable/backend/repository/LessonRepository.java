package com.learnable.backend.repository;

import com.learnable.backend.model.Lesson;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {

    @Query("""
        SELECT l FROM Lesson l
        LEFT JOIN FETCH l.quiz q
        LEFT JOIN FETCH q.questions
        WHERE l.id = :id
    """)
    Optional<Lesson> findLessonWithQuizAndQuestions(@Param("id") Long id);

    List<Lesson> findByModuleIdOrderByOrderIndexAsc(Long moduleId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Lesson l WHERE l.module.id = :moduleId")
    void deleteAllByModuleId(@Param("moduleId") Long moduleId);
}
