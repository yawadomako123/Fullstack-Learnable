package com.learnable.backend.repository;

import com.learnable.backend.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    /**
     * Fetch a course with all nested modules, submodules, lessons, quizzes, and questions eagerly loaded.
     * This prevents LazyInitializationException and supports full course hierarchy serialization.
     */
    @Query("""
        SELECT DISTINCT c FROM Course c
        LEFT JOIN FETCH c.modules m
        LEFT JOIN FETCH m.lessons l
        LEFT JOIN FETCH l.quiz q1
        LEFT JOIN FETCH q1.questions
        LEFT JOIN FETCH m.quizzes q2
        LEFT JOIN FETCH q2.questions
        LEFT JOIN FETCH m.subModules sm
        LEFT JOIN FETCH sm.lessons sl
        LEFT JOIN FETCH sl.quiz q3
        LEFT JOIN FETCH q3.questions
        LEFT JOIN FETCH sm.quizzes q4
        LEFT JOIN FETCH q4.questions
        LEFT JOIN FETCH sm.subModules ssm
        LEFT JOIN FETCH ssm.lessons sll
        LEFT JOIN FETCH sll.quiz q5
        LEFT JOIN FETCH q5.questions
        LEFT JOIN FETCH ssm.quizzes q6
        LEFT JOIN FETCH q6.questions
        WHERE c.id = :id
    """)
    Optional<Course> findCompleteCourseById(Long id);
}
