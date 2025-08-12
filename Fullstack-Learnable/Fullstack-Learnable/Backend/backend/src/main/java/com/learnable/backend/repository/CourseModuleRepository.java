package com.learnable.backend.repository;

import com.learnable.backend.model.CourseModule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseModuleRepository extends JpaRepository<CourseModule, Long> {

    /**
     * Fetch a CourseModule by ID, including:
     * - Lessons
     * - Lesson-level quizzes and their questions
     * - Module-level quizzes and their questions
     * - First and second-level submodules (and their nested content)
     */
    @Query("""
        SELECT DISTINCT m FROM CourseModule m
        LEFT JOIN FETCH m.lessons l
        LEFT JOIN FETCH l.quiz lq
        LEFT JOIN FETCH lq.questions
        LEFT JOIN FETCH m.quizzes mq
        LEFT JOIN FETCH mq.questions
        LEFT JOIN FETCH m.subModules sm
        LEFT JOIN FETCH sm.lessons sml
        LEFT JOIN FETCH sml.quiz smlq
        LEFT JOIN FETCH smlq.questions
        LEFT JOIN FETCH sm.quizzes smq
        LEFT JOIN FETCH smq.questions
        LEFT JOIN FETCH sm.subModules ssm
        LEFT JOIN FETCH ssm.lessons ssml
        LEFT JOIN FETCH ssml.quiz ssmlq
        LEFT JOIN FETCH ssmlq.questions
        LEFT JOIN FETCH ssm.quizzes ssmq
        LEFT JOIN FETCH ssmq.questions
        WHERE m.id = :id
    """)
    Optional<CourseModule> findByIdWithNestedContent(@Param("id") Long id);

    /**
     * Find all top-level CourseModules for a given course (parentModule is null).
     */
    List<CourseModule> findByCourseIdAndParentModuleIsNull(Long courseId);
}
