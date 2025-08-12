package com.learnable.backend.mapper;

import com.learnable.backend.dto.AssignmentDto;
import com.learnable.backend.dto.LessonDto;
import com.learnable.backend.dto.ModuleDto;
import com.learnable.backend.dto.QuizDto;
import com.learnable.backend.model.Assignment;
import com.learnable.backend.model.CourseModule;
import com.learnable.backend.model.Lesson;
import com.learnable.backend.model.Quiz;

import java.util.*;
import java.util.stream.Collectors;

public class ModuleMapper {

    // === ENTITY → DTO (full-depth mapping, recursive for submodules) ===
    public static ModuleDto toDto(CourseModule module) {
        if (module == null) return null;

        List<LessonDto> lessonDtos = Optional.ofNullable(module.getLessons())
                .orElse(Collections.emptySet())
                .stream()
                .sorted(Comparator.comparing(lesson -> 
                        lesson.getOrderIndex() != null ? lesson.getOrderIndex() : lesson.getId()))
                .map(LessonMapper::toDto)
                .collect(Collectors.toList());

        List<QuizDto> quizDtos = Optional.ofNullable(module.getQuizzes())
                .orElse(Collections.emptySet())
                .stream()
                .sorted(Comparator.comparingLong(Quiz::getId))
                .map(QuizMapper::toDto)
                .collect(Collectors.toList());

        List<ModuleDto> subModuleDtos = Optional.ofNullable(module.getSubModules())
                .orElse(Collections.emptySet())
                .stream()
                .sorted(Comparator.comparingInt(sub -> 
                        sub.getOrderIndex() != null ? sub.getOrderIndex() : 0))
                .map(ModuleMapper::toDto) // recursive call
                .collect(Collectors.toList());

        List<AssignmentDto> assignmentDtos = Optional.ofNullable(module.getAssignments())
                .orElse(Collections.emptySet())
                .stream()
                .sorted(Comparator.comparingLong(Assignment::getId))
                .map(AssignmentMapper::toDto)
                .collect(Collectors.toList());

        return ModuleDto.builder()
                .id(module.getId())
                .title(module.getTitle())
                .orderIndex(module.getOrderIndex())
                .lessons(lessonDtos)
                .quizzes(quizDtos)
                .subModules(subModuleDtos)
                .assignments(assignmentDtos)
                .build();
    }

    // === ENTITY → DTO (limited-depth mapping) ===
    // Maps immediate nested content, but submodules shallowly (no recursion)
    public static ModuleDto toDtoLimited(CourseModule module) {
        if (module == null) return null;

        List<LessonDto> lessonDtos = Optional.ofNullable(module.getLessons())
                .orElse(Collections.emptySet())
                .stream()
                .sorted(Comparator.comparing(lesson ->
                        lesson.getOrderIndex() != null ? lesson.getOrderIndex() : lesson.getId()))
                .map(LessonMapper::toDto)
                .collect(Collectors.toList());

        List<QuizDto> quizDtos = Optional.ofNullable(module.getQuizzes())
                .orElse(Collections.emptySet())
                .stream()
                .sorted(Comparator.comparingLong(Quiz::getId))
                .map(QuizMapper::toDto)
                .collect(Collectors.toList());

        // Shallow map submodules (no nested lessons/quizzes/submodules/assignments)
        List<ModuleDto> subModuleDtos = Optional.ofNullable(module.getSubModules())
                .orElse(Collections.emptySet())
                .stream()
                .sorted(Comparator.comparingInt(sub -> 
                        sub.getOrderIndex() != null ? sub.getOrderIndex() : 0))
                .map(sub -> ModuleDto.builder()
                        .id(sub.getId())
                        .title(sub.getTitle())
                        .orderIndex(sub.getOrderIndex())
                        // no nested children here
                        .build())
                .collect(Collectors.toList());

        List<AssignmentDto> assignmentDtos = Optional.ofNullable(module.getAssignments())
                .orElse(Collections.emptySet())
                .stream()
                .sorted(Comparator.comparingLong(Assignment::getId))
                .map(AssignmentMapper::toDto)
                .collect(Collectors.toList());

        return ModuleDto.builder()
                .id(module.getId())
                .title(module.getTitle())
                .orderIndex(module.getOrderIndex())
                .lessons(lessonDtos)
                .quizzes(quizDtos)
                .subModules(subModuleDtos)
                .assignments(assignmentDtos)
                .build();
    }

    // === DTO → ENTITY ===
    public static CourseModule toEntity(ModuleDto dto) {
        if (dto == null) return null;

        CourseModule module = CourseModule.builder()
                .id(dto.getId())
                .title(dto.getTitle())
                .orderIndex(dto.getOrderIndex())
                .lessons(new LinkedHashSet<>())
                .quizzes(new LinkedHashSet<>())
                .subModules(new LinkedHashSet<>())
                .assignments(new LinkedHashSet<>())
                .build();

        // Map Lessons
        if (dto.getLessons() != null) {
            int defaultOrderIndex = 0;
            for (LessonDto lessonDto : dto.getLessons()) {
                Lesson lesson = LessonMapper.toEntity(lessonDto);
                if (lesson.getOrderIndex() == null) {
                    lesson.setOrderIndex(defaultOrderIndex++);
                }
                lesson.setModule(module);
                module.addLesson(lesson);
            }
        }

        // Map Quizzes
        if (dto.getQuizzes() != null) {
            for (QuizDto quizDto : dto.getQuizzes()) {
                Quiz quiz = QuizMapper.toEntity(quizDto);
                quiz.setModule(module);
                module.addQuiz(quiz);
            }
        }

        // Map Submodules recursively
        if (dto.getSubModules() != null) {
            for (ModuleDto subDto : dto.getSubModules()) {
                CourseModule subModule = toEntity(subDto);
                subModule.setParentModule(module);
                module.addSubModule(subModule);
            }
        }

        // Map Assignments
        if (dto.getAssignments() != null) {
            for (AssignmentDto assignmentDto : dto.getAssignments()) {
                Assignment assignment = AssignmentMapper.toEntity(assignmentDto);
                assignment.setSubModule(module); // Set subModule reference
                module.addAssignment(assignment);
            }
        }

        return module;
    }
}
