package com.learnable.backend.controller;

import com.learnable.backend.dto.CourseDto;
import com.learnable.backend.dto.ModuleDto;
import com.learnable.backend.mapper.CourseMapper;
import com.learnable.backend.mapper.ModuleMapper;
import com.learnable.backend.model.Course;
import com.learnable.backend.model.CourseModule;
import com.learnable.backend.repository.CourseModuleRepository;
import com.learnable.backend.service.CourseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(
    origins = "*", // TODO: restrict origins for production
    allowedHeaders = "*",
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE}
)
@RequiredArgsConstructor
public class CourseController {

    private static final Logger logger = LoggerFactory.getLogger(CourseController.class);

    private final CourseService courseService;
    private final CourseModuleRepository moduleRepository;

    // ----------------------------------------
    // COURSE ENDPOINTS
    // ----------------------------------------

    /**
     * Get all courses as DTOs.
     */
    @GetMapping
    public ResponseEntity<List<CourseDto>> getAllCourses() {
        try {
            List<Course> courses = courseService.findAll();
            List<CourseDto> dtos = courses.stream()
                .map(course -> {
                    try {
                        return CourseMapper.toDto(course);
                    } catch (Exception e) {
                        logger.error("Mapping failed for course ID {}", course.getId(), e);
                        return null;
                    }
                })
                .filter(dto -> dto != null)
                .collect(Collectors.toList());

            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            logger.error("Failed to fetch courses", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get a course by ID (including nested data).
     */
    @GetMapping("/{id}")
    public ResponseEntity<CourseDto> getCourseById(@PathVariable Long id) {
        try {
            Optional<Course> courseOpt = courseService.findCompleteCourseById(id);
            if (courseOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(CourseMapper.toDto(courseOpt.get()));
        } catch (Exception e) {
            logger.error("Failed to fetch course with ID {}", id, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Create a new course.
     */
    @PostMapping
    public ResponseEntity<?> createCourse(@Valid @RequestBody CourseDto courseDto) {
        try {
            Course saved = courseService.save(courseDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(CourseMapper.toDto(saved));
        } catch (Exception e) {
            logger.error("Failed to create course", e);
            return ResponseEntity.badRequest().body("Course creation failed: " + e.getMessage());
        }
    }

    /**
     * Update an existing course by ID.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCourse(@PathVariable Long id, @Valid @RequestBody CourseDto courseDto) {
        try {
            Optional<Course> existingCourse = courseService.findById(id);
            if (existingCourse.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            courseDto.setId(id);
            Course updated = courseService.save(courseDto);
            return ResponseEntity.ok(CourseMapper.toDto(updated));
        } catch (Exception e) {
            logger.error("Failed to update course with ID {}", id, e);
            return ResponseEntity.badRequest().body("Course update failed: " + e.getMessage());
        }
    }

    /**
     * Delete a course by ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        try {
            courseService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.error("Failed to delete course with ID {}", id, e);
            return ResponseEntity.internalServerError().body("Error deleting course: " + e.getMessage());
        }
    }

    // ----------------------------------------
    // MODULES UNDER COURSE ENDPOINTS
    // ----------------------------------------

    /**
     * Get all top-level modules under a specific course.
     */
    @GetMapping("/{courseId}/modules")
    public ResponseEntity<List<ModuleDto>> getModulesForCourse(@PathVariable Long courseId) {
        Course course = courseService.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));

        List<CourseModule> modules = moduleRepository.findByCourseIdAndParentModuleIsNull(courseId);

        List<ModuleDto> dtos = modules.stream()
                .map(ModuleMapper::toDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    /**
     * Create a new top-level module under a specific course.
     */
    @PostMapping("/{courseId}/modules")
    public ResponseEntity<ModuleDto> createModuleForCourse(
            @PathVariable Long courseId,
            @Valid @RequestBody ModuleDto moduleDto) {

        Course course = courseService.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));

        CourseModule module = CourseModule.builder()
                .title(moduleDto.getTitle())
                .orderIndex(moduleDto.getOrderIndex())
                .parentModule(null)
                .course(course)
                .lessons(new LinkedHashSet<>())
                .subModules(new LinkedHashSet<>())
                .build();

        CourseModule savedModule = moduleRepository.save(module);

        return ResponseEntity.status(HttpStatus.CREATED).body(ModuleMapper.toDto(savedModule));
    }
}
