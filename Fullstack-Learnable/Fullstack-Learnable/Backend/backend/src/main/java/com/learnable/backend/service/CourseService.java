package com.learnable.backend.service;

import com.learnable.backend.dto.CourseDto;
import com.learnable.backend.mapper.CourseMapper;
import com.learnable.backend.model.*;
import com.learnable.backend.repository.CourseModuleRepository;
import com.learnable.backend.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final CourseModuleRepository moduleRepository;

    @Transactional(readOnly = true)
    public List<Course> findAll() {
        return courseRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Course> findById(Long id) {
        return courseRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Optional<Course> findCompleteCourseById(Long id) {
        return courseRepository.findCompleteCourseById(id);
    }

    @Transactional
    public Course save(CourseDto dto) {
        Course course = CourseMapper.toEntity(dto);

        if (course.getModules() != null) {
            int moduleIndex = 0;
            for (CourseModule module : course.getModules()) {
                module.setOrderIndex(module.getOrderIndex() != null ? module.getOrderIndex() : moduleIndex++);
                processModuleRecursively(module, course, null);
                course.addModule(module);
            }
        }

        return courseRepository.save(course);
    }

    /**
     * Recursively sets relationships for modules and submodules, and handles nested content.
     */
    private void processModuleRecursively(CourseModule module, Course course, CourseModule parent) {
        module.setCourse(course);
        module.setParentModule(parent);

        // Handle lessons
        if (module.getLessons() != null) {
            int lessonIndex = 0;
            for (Lesson lesson : module.getLessons()) {
                lesson.setModule(module);
                lesson.setOrderIndex(lesson.getOrderIndex() != null ? lesson.getOrderIndex() : lessonIndex++);

                Quiz lessonQuiz = lesson.getQuiz();
                if (lessonQuiz != null) {
                    lessonQuiz.setLesson(lesson);
                    lessonQuiz.setModule(module);
                    lessonQuiz.setCourse(course);

                    if (lessonQuiz.getQuestions() != null) {
                        for (Question question : lessonQuiz.getQuestions()) {
                            question.setQuiz(lessonQuiz);
                        }
                    }

                    lesson.setQuiz(lessonQuiz);
                }

                module.addLesson(lesson);
            }
        }

        // Handle quizzes
        if (module.getQuizzes() != null) {
            for (Quiz quiz : module.getQuizzes()) {
                quiz.setModule(module);
                quiz.setCourse(course);

                if (quiz.getQuestions() != null) {
                    for (Question question : quiz.getQuestions()) {
                        question.setQuiz(quiz);
                    }
                }

                module.addQuiz(quiz);
            }
        }

        // Handle submodules recursively
        if (module.getSubModules() != null) {
            int subIndex = 0;
            for (CourseModule subModule : module.getSubModules()) {
                subModule.setOrderIndex(subModule.getOrderIndex() != null ? subModule.getOrderIndex() : subIndex++);
                module.addSubModule(subModule); // ensure JPA sees this relationship
                processModuleRecursively(subModule, course, module);
            }
        }

        // Handle assignments
        if (module.getAssignments() != null) {
            for (Assignment assignment : module.getAssignments()) {
                assignment.setSubModule(module);
                module.addAssignment(assignment);
            }
        }
    }

    @Transactional
    public void deleteById(Long id) {
        courseRepository.deleteById(id);
    }

    /**
     * Adds a new top-level module to a course.
     */
    @Transactional
    public CourseModule addModuleToCourse(Long courseId, String moduleTitle) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found with ID: " + courseId));

        int nextIndex = course.getModules() != null ? course.getModules().size() : 0;

        CourseModule newModule = CourseModule.builder()
                .title(moduleTitle)
                .orderIndex(nextIndex)
                .course(course)
                .build();

        course.addModule(newModule);
        return moduleRepository.save(newModule);
    }
}
