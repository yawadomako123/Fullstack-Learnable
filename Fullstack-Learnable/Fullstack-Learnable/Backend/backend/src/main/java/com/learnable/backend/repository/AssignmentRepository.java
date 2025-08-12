package com.learnable.backend.repository;

import com.learnable.backend.model.Assignment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

    /**
     * Find all assignments associated with a specific lesson ID.
     *
     * @param lessonId the ID of the lesson
     * @return list of assignments for the lesson
     */
    List<Assignment> findByLessonId(Long lessonId);

    /**
     * Find all assignments associated with a specific submodule (CourseModule) ID.
     *
     * @param subModuleId the ID of the submodule
     * @return list of assignments for the submodule
     */
    List<Assignment> findBySubModuleId(Long subModuleId);

    /**
     * Find assignments by submodule ID with pagination support.
     *
     * @param subModuleId the ID of the submodule
     * @param pageable the paging and sorting information
     * @return page of assignments for the submodule
     */
    Page<Assignment> findBySubModuleId(Long subModuleId, Pageable pageable);

    /**
     * Check if at least one assignment exists for a given submodule ID.
     *
     * @param subModuleId the ID of the submodule
     * @return true if an assignment exists for the submodule; false otherwise
     */
    boolean existsBySubModuleId(Long subModuleId);
}
