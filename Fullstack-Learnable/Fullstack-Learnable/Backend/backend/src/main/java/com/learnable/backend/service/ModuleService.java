package com.learnable.backend.service;

import com.learnable.backend.dto.ModuleDto;
import com.learnable.backend.mapper.ModuleMapper;
import com.learnable.backend.model.Course;
import com.learnable.backend.model.CourseModule;
import com.learnable.backend.repository.CourseModuleRepository;
import com.learnable.backend.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ModuleService {

    private final CourseRepository courseRepository;
    private final CourseModuleRepository moduleRepository;

    // === Retrieve all modules ===
    public List<CourseModule> findAll() {
        return moduleRepository.findAll();
    }

    // === Find a module by its ID ===
    public Optional<CourseModule> findById(Long id) {
        return moduleRepository.findById(id);
    }

    // === Add a top-level module to a course (basic only) ===
    @Transactional
    public CourseModule addModule(Long courseId, String title) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found: " + courseId));

        int nextIndex = course.getModules() != null ? course.getModules().size() : 0;

        CourseModule module = CourseModule.builder()
                .title(title)
                .orderIndex(nextIndex)
                .course(course)
                .build();

        course.addModule(module);
        return moduleRepository.save(module);
    }

    // === Add a submodule to an existing module (basic only) ===
    @Transactional
    public CourseModule addSubModule(Long parentModuleId, String title) {
        CourseModule parent = moduleRepository.findById(parentModuleId)
                .orElseThrow(() -> new IllegalArgumentException("Parent module not found: " + parentModuleId));

        int nextIndex = parent.getSubModules() != null ? parent.getSubModules().size() : 0;

        CourseModule subModule = CourseModule.builder()
                .title(title)
                .orderIndex(nextIndex)
                .parentModule(parent)
                .course(parent.getCourse()) // inherit course from parent
                .build();

        validateNoCycle(parent, subModule);
        parent.addSubModule(subModule);

        return moduleRepository.save(subModule);
    }

    // === Save a fully populated module (with lessons, quizzes, assignments, submodules) ===
    @Transactional
    public CourseModule saveFullModule(Long courseId, ModuleDto moduleDto) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found: " + courseId));

        CourseModule module = ModuleMapper.toEntity(moduleDto);
        module.setCourse(course); // set course reference

        // recursively update course reference for submodules
        setCourseRecursively(module, course);

        return moduleRepository.save(module);
    }

    // === Delete a module by ID ===
    @Transactional
    public void deleteModule(Long moduleId) {
        moduleRepository.deleteById(moduleId);
    }

    // === Fetch all top-level modules (and their submodules) for a course ===
    @Transactional(readOnly = true)
    public List<CourseModule> getAllModulesForCourse(Long courseId) {
        Course course = courseRepository.findCompleteCourseById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found: " + courseId));

        return course.getModules().stream()
                .filter(m -> m.getParentModule() == null)
                .toList();
    }

    // === Utility: Prevent circular submodule relationships ===
    private void validateNoCycle(CourseModule parent, CourseModule child) {
        CourseModule current = parent;
        while (current != null) {
            if (current.equals(child)) {
                throw new IllegalArgumentException("Cannot add submodule: Cycle detected");
            }
            current = current.getParentModule();
        }
    }

    // === Utility: Recursively assign course reference to nested submodules ===
    private void setCourseRecursively(CourseModule module, Course course) {
        module.setCourse(course);
        if (module.getSubModules() != null) {
            for (CourseModule sub : module.getSubModules()) {
                setCourseRecursively(sub, course);
            }
        }
    }
}
