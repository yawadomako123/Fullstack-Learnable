package com.learnable.backend.service;

import com.learnable.backend.model.CourseModule;
import com.learnable.backend.model.Lesson;
import com.learnable.backend.repository.CourseModuleRepository;
import com.learnable.backend.repository.LessonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LessonService {

    private final LessonRepository lessonRepository;
    private final CourseModuleRepository moduleRepository;

    /**
     * Fetch all lessons in the system.
     */
    @Transactional(readOnly = true)
    public List<Lesson> findAll() {
        return lessonRepository.findAll();
    }

    /**
     * Fetch a lesson by its ID.
     */
    @Transactional(readOnly = true)
    public Optional<Lesson> findById(Long id) {
        return lessonRepository.findById(id);
    }

    /**
     * Add a new lesson to a specific module.
     *
     * @param moduleId the ID of the target module
     * @param lesson   the lesson to be added
     * @return the saved lesson
     */
    @Transactional
    public Lesson addLessonToModule(Long moduleId, Lesson lesson) {
        CourseModule module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new IllegalArgumentException("Module not found with ID: " + moduleId));

        lesson.setModule(module);

        // Set orderIndex if not provided
        if (lesson.getOrderIndex() == null) {
            lesson.setOrderIndex(module.getLessons().size());
        }

        return lessonRepository.save(lesson);
    }

    /**
     * Delete a lesson by its ID.
     *
     * @param lessonId the ID of the lesson to be deleted
     */
    @Transactional
    public void deleteLesson(Long lessonId) {
        lessonRepository.deleteById(lessonId);
    }
}
