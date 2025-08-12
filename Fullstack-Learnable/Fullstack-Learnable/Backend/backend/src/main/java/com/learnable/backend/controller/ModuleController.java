package com.learnable.backend.controller;

import com.learnable.backend.dto.AssignmentDto;
import com.learnable.backend.dto.LessonDto;
import com.learnable.backend.dto.ModuleDto;
import com.learnable.backend.mapper.AssignmentMapper;
import com.learnable.backend.mapper.LessonMapper;
import com.learnable.backend.mapper.ModuleMapper;
import com.learnable.backend.model.*;
import com.learnable.backend.repository.*;
import com.learnable.backend.service.ModuleService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedHashSet;
import java.util.List;

@RestController
@RequestMapping("/api/modules")
@RequiredArgsConstructor
public class ModuleController {

    private final CourseModuleRepository moduleRepository;
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final AssignmentRepository assignmentRepository;
    private final QuizRepository quizRepository;
    private final ModuleService moduleService;

    // -----------------------------
    // MODULE CREATION
    // -----------------------------

    @PostMapping("/courses/{courseId}")
    public ResponseEntity<ModuleDto> addTopLevelModule(
            @PathVariable Long courseId,
            @RequestBody ModuleDto moduleDto) {

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));

        CourseModule newModule = CourseModule.builder()
                .title(moduleDto.getTitle())
                .orderIndex(moduleDto.getOrderIndex())
                .parentModule(null)
                .course(course)
                .lessons(new LinkedHashSet<>())
                .subModules(new LinkedHashSet<>())
                .build();

        CourseModule saved = moduleRepository.save(newModule);
        return ResponseEntity.status(HttpStatus.CREATED).body(ModuleMapper.toDtoLimited(saved));
    }

    @PostMapping("/courses/{courseId}/full")
    public ResponseEntity<ModuleDto> saveFullModule(
            @PathVariable Long courseId,
            @RequestBody ModuleDto moduleDto) {

        CourseModule saved = moduleService.saveFullModule(courseId, moduleDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ModuleMapper.toDto(saved));
    }

    // -----------------------------
    // SUBMODULES
    // -----------------------------

    @PostMapping("/{parentId}/submodules")
    public ResponseEntity<ModuleDto> addSubModule(
            @PathVariable Long parentId,
            @RequestBody ModuleDto subModuleDto) {

        CourseModule parent = moduleRepository.findById(parentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Parent module not found"));

        CourseModule subModule = CourseModule.builder()
                .title(subModuleDto.getTitle())
                .orderIndex(subModuleDto.getOrderIndex())
                .parentModule(parent)
                .course(parent.getCourse())
                .lessons(new LinkedHashSet<>())
                .subModules(new LinkedHashSet<>())
                .build();

        CourseModule saved = moduleRepository.save(subModule);
        return ResponseEntity.status(HttpStatus.CREATED).body(ModuleMapper.toDtoLimited(saved));
    }

    @GetMapping("/{moduleId}/submodules")
    public ResponseEntity<List<ModuleDto>> getSubModules(@PathVariable Long moduleId) {
        CourseModule parent = moduleRepository.findByIdWithNestedContent(moduleId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Module not found"));

        List<ModuleDto> subModules = parent.getSubModules().stream()
                .map(ModuleMapper::toDtoLimited)
                .toList();

        return ResponseEntity.ok(subModules);
    }

    // -----------------------------
    // LESSONS
    // -----------------------------

    @PostMapping("/{moduleId}/lessons")
    public ResponseEntity<LessonDto> addLessonToModule(
            @PathVariable Long moduleId,
            @RequestBody LessonDto lessonDto) {

        CourseModule module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Module not found"));

        Lesson lesson = LessonMapper.toEntity(lessonDto);
        lesson.setModule(module);

        Lesson saved = lessonRepository.save(lesson);
        return ResponseEntity.status(HttpStatus.CREATED).body(LessonMapper.toDto(saved));
    }

    @GetMapping("/{moduleId}/lessons")
    public ResponseEntity<List<LessonDto>> getLessonsForModule(@PathVariable Long moduleId) {
        CourseModule module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Module not found"));

        List<LessonDto> lessons = module.getLessons().stream()
                .map(LessonMapper::toDto)
                .toList();

        return ResponseEntity.ok(lessons);
    }

    @DeleteMapping("/{moduleId}/lessons")
    public ResponseEntity<Void> deleteAllLessonsFromModule(@PathVariable Long moduleId) {
        CourseModule module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Module not found"));

        module.getLessons().clear();
        moduleRepository.save(module);
        lessonRepository.deleteAllByModuleId(moduleId);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{moduleId}/lessons/{lessonId}")
    public ResponseEntity<Void> deleteLessonById(
            @PathVariable Long moduleId,
            @PathVariable Long lessonId) {

        CourseModule module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Module not found"));

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lesson not found"));

        if (!lesson.getModule().getId().equals(moduleId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Lesson does not belong to the given module");
        }

        module.removeLesson(lesson);
        lessonRepository.delete(lesson);

        return ResponseEntity.noContent().build();
    }

    // -----------------------------
    // ASSIGNMENTS
    // -----------------------------

    @PostMapping("/submodules/{subModuleId}/assignments")
    public ResponseEntity<AssignmentDto> addAssignmentToSubModule(
            @PathVariable Long subModuleId,
            @RequestBody AssignmentDto assignmentDto) {

        CourseModule subModule = moduleRepository.findById(subModuleId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "SubModule not found"));

        boolean exists = assignmentRepository.findBySubModuleId(subModuleId).stream().findAny().isPresent();
        if (exists) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An assignment already exists for this submodule.");
        }

        Assignment assignment = AssignmentMapper.toEntity(assignmentDto);
        assignment.setSubModule(subModule);

        Assignment saved = assignmentRepository.save(assignment);
        return ResponseEntity.status(HttpStatus.CREATED).body(AssignmentMapper.toDto(saved));
    }

    @GetMapping("/submodules/{subModuleId}/assignments")
    public ResponseEntity<List<AssignmentDto>> getAssignmentsForSubModule(@PathVariable Long subModuleId) {
        List<Assignment> assignments = assignmentRepository.findBySubModuleId(subModuleId);

        if (assignments.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No assignments found for this submodule.");
        }

        List<AssignmentDto> dtos = assignments.stream()
                .map(AssignmentMapper::toDto)
                .toList();

        return ResponseEntity.ok(dtos);
    }

    // -----------------------------
    // QUIZZES
    // -----------------------------

    @GetMapping("/{moduleId}/quiz")
    public ResponseEntity<Quiz> getQuizForModule(@PathVariable Long moduleId) {
        CourseModule module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Module not found"));

        if (module.getParentModule() != null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quizzes are only for top-level modules.");
        }

        Quiz quiz = quizRepository.findFirstByModule_Id(moduleId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Quiz not found"));

        return ResponseEntity.ok(quiz);
    }

    @PostMapping("/{moduleId}/quiz")
    public ResponseEntity<Quiz> addOrUpdateQuizForModule(
            @PathVariable Long moduleId,
            @RequestBody Quiz quizRequest) {

        CourseModule module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Module not found"));

        Quiz existing = quizRepository.findFirstByModule_Id(moduleId).orElse(null);

        if (existing != null) {
            existing.setTitle(quizRequest.getTitle());
            existing.setQuestions(quizRequest.getQuestions());
            Quiz updated = quizRepository.save(existing);
            return ResponseEntity.ok(updated);
        }

        quizRequest.setModule(module);
        Quiz created = quizRepository.save(quizRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // -----------------------------
    // MODULE OVERVIEW
    // -----------------------------

    @GetMapping("/{moduleId}")
    @Transactional
    public ResponseEntity<ModuleDto> getFullModuleById(@PathVariable Long moduleId) {
        CourseModule module = moduleRepository.findByIdWithNestedContent(moduleId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Module not found"));

        return ResponseEntity.ok(ModuleMapper.toDtoLimited(module));
    }
}
