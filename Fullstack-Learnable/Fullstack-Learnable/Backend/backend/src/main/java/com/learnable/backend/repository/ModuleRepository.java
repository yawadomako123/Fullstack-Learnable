package com.learnable.backend.repository;

import com.learnable.backend.model.CourseModule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ModuleRepository extends JpaRepository<CourseModule, Long> {

    /**
     * Retrieve all modules belonging to a specific course, ordered by their order index.
     *
     * @param courseId the ID of the course
     * @return ordered list of course modules
     */
    List<CourseModule> findByCourseIdOrderByOrderIndexAsc(Long courseId);

    /**
     * Fetch a single module by its ID with its lessons and quizzes eagerly loaded.
     * Helps avoid LazyInitializationException in service/controller layers.
     *
     * @param moduleId the ID of the module
     * @return the module with its lessons and quizzes
     */
    @Query("""
        SELECT m FROM CourseModule m
        LEFT JOIN FETCH m.lessons l
        LEFT JOIN FETCH m.quizzes q
        WHERE m.id = :moduleId
    """)
    CourseModule findWithLessonsAndQuizzesById(Long moduleId);
}
