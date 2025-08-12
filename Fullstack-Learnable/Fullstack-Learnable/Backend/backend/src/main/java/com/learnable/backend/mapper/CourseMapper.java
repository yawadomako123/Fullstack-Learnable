package com.learnable.backend.mapper;

import com.learnable.backend.dto.*;
import com.learnable.backend.model.*;

import java.util.*;
import java.util.stream.Collectors;

public class CourseMapper {

    // ==========================
    // === ENTITY → DTO METHODS ==
    // ==========================

    /**
     * Converts a Course entity to a CourseDto, including only top-level modules.
     */
    public static CourseDto toDto(Course course) {
        if (course == null) return null;

        List<ModuleDto> modules = Optional.ofNullable(course.getModules())
            .orElse(Collections.emptySet())
            .stream()
            .filter(module -> module.getParentModule() == null)
            .sorted(Comparator.comparingInt(CourseModule::getOrderIndex))
            .map(CourseMapper::toModuleDto)
            .collect(Collectors.toList());

        return CourseDto.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .imageUrl(course.getImageUrl())
                .category(course.getCategory())
                .instructor(course.getInstructor())
                .rating(course.getRating())
                .modules(modules)
                .build();
    }

    /**
     * Converts a CourseModule entity to ModuleDto including lessons, quizzes, and submodules.
     */
    public static ModuleDto toModuleDto(CourseModule module) {
        if (module == null) return null;

        List<LessonDto> lessons = Optional.ofNullable(module.getLessons())
                .orElse(Collections.emptySet())
                .stream()
                .sorted(Comparator.comparing(l -> Optional.ofNullable(l.getOrderIndex()).orElse(0)))
                .map(CourseMapper::toLessonDto)
                .collect(Collectors.toList());

        List<QuizDto> quizzes = Optional.ofNullable(module.getQuizzes())
                .orElse(Collections.emptySet())
                .stream()
                .sorted(Comparator.comparingLong(Quiz::getId))
                .map(CourseMapper::toQuizDto)
                .collect(Collectors.toList());

        List<ModuleDto> subModules = Optional.ofNullable(module.getSubModules())
                .orElse(Collections.emptySet())
                .stream()
                .sorted(Comparator.comparingInt(CourseModule::getOrderIndex))
                .map(CourseMapper::toModuleDto)
                .collect(Collectors.toList());

        return ModuleDto.builder()
                .id(module.getId())
                .title(module.getTitle())
                .orderIndex(module.getOrderIndex())
                .lessons(lessons)
                .quizzes(quizzes)
                .subModules(subModules)
                .build();
    }

    /**
     * Converts a Lesson entity to LessonDto including an optional quiz.
     */
    public static LessonDto toLessonDto(Lesson lesson) {
        if (lesson == null) return null;

        QuizDto quizDto = lesson.getQuiz() != null ? toQuizDto(lesson.getQuiz()) : null;

        return LessonDto.builder()
                .id(lesson.getId())
                .title(lesson.getTitle())
                .content(lesson.getContent())
                .videoUrl(lesson.getVideoUrl())
                .pdfUrl(lesson.getPdfUrl())
                .orderIndex(lesson.getOrderIndex())
                .quiz(quizDto)
                .build();
    }

    /**
     * Converts a Quiz entity to QuizDto including nested questions.
     */
    public static QuizDto toQuizDto(Quiz quiz) {
        if (quiz == null) return null;

        List<QuestionDto> questions = Optional.ofNullable(quiz.getQuestions())
                .orElse(Collections.emptyList())
                .stream()
                .sorted(Comparator.comparingLong(Question::getId))
                .map(CourseMapper::toQuestionDto)
                .collect(Collectors.toList());

        return QuizDto.builder()
                .id(quiz.getId())
                .title(quiz.getTitle())
                .questions(questions)
                .build();
    }

    /**
     * Converts a Question entity to QuestionDto.
     */
    public static QuestionDto toQuestionDto(Question question) {
        if (question == null) return null;

        return QuestionDto.builder()
                .id(question.getId())
                .questionText(question.getQuestionText())
                .options(question.getOptions() != null ? new ArrayList<>(question.getOptions()) : Collections.emptyList())
                .correctAnswer(question.getCorrectAnswer())
                .build();
    }

    // ==========================
    // === DTO → ENTITY METHODS ==
    // ==========================

    /**
     * Converts a CourseDto to a Course entity including the full module hierarchy.
     */
    public static Course toEntity(CourseDto dto) {
        if (dto == null) return null;

        Course course = Course.builder()
                .id(dto.getId())
                .title(dto.getTitle())
                .description(dto.getDescription())
                .imageUrl(dto.getImageUrl())
                .category(dto.getCategory())
                .instructor(dto.getInstructor())
                .rating(dto.getRating())
                .modules(new LinkedHashSet<>())
                .quizzes(new LinkedHashSet<>())  // For possible future use
                .build();

        if (dto.getModules() != null) {
            for (ModuleDto moduleDto : dto.getModules()) {
                CourseModule module = buildModuleHierarchy(moduleDto, course, null);
                course.getModules().add(module);
            }
        }

        return course;
    }

    /**
     * Recursively builds CourseModule entities from ModuleDto with nested submodules, lessons, and quizzes.
     */
    private static CourseModule buildModuleHierarchy(ModuleDto dto, Course course, CourseModule parent) {
        CourseModule module = toModuleEntity(dto);
        module.setCourse(course);

        if (parent != null) {
            module.setParentModule(parent);
        }

        if (dto.getLessons() != null) {
            for (LessonDto lessonDto : dto.getLessons()) {
                Lesson lesson = toLessonEntity(lessonDto);
                lesson.setModule(module);

                if (lessonDto.getQuiz() != null) {
                    Quiz quiz = toQuizEntity(lessonDto.getQuiz());
                    quiz.setLesson(lesson);
                    quiz.setModule(module);
                    quiz.setCourse(course);
                    lesson.setQuiz(quiz);
                }

                module.addLesson(lesson);
            }
        }

        if (dto.getQuizzes() != null) {
            for (QuizDto quizDto : dto.getQuizzes()) {
                Quiz quiz = toQuizEntity(quizDto);
                quiz.setModule(module);
                quiz.setCourse(course);
                module.addQuiz(quiz);
            }
        }

        if (dto.getSubModules() != null) {
            for (ModuleDto subDto : dto.getSubModules()) {
                CourseModule subModule = buildModuleHierarchy(subDto, course, module);
                module.addSubModule(subModule);
            }
        }

        return module;
    }

    /**
     * Converts a ModuleDto to a CourseModule entity without children.
     */
    public static CourseModule toModuleEntity(ModuleDto dto) {
        if (dto == null) return null;

        return CourseModule.builder()
                .id(dto.getId())
                .title(dto.getTitle())
                .orderIndex(dto.getOrderIndex())
                .lessons(new LinkedHashSet<>())
                .quizzes(new LinkedHashSet<>())
                .subModules(new LinkedHashSet<>())
                .build();
    }

    /**
     * Converts a LessonDto to a Lesson entity without quiz.
     */
    public static Lesson toLessonEntity(LessonDto dto) {
        if (dto == null) return null;

        return Lesson.builder()
                .id(dto.getId())
                .title(dto.getTitle())
                .content(dto.getContent())
                .videoUrl(dto.getVideoUrl())
                .pdfUrl(dto.getPdfUrl())
                .orderIndex(dto.getOrderIndex())
                .build();
    }

    /**
     * Converts a QuizDto to a Quiz entity including nested questions.
     */
    public static Quiz toQuizEntity(QuizDto dto) {
        if (dto == null) return null;

        Quiz quiz = Quiz.builder()
                .id(dto.getId())
                .title(dto.getTitle())
                .questions(new ArrayList<>())
                .build();

        if (dto.getQuestions() != null) {
            for (QuestionDto questionDto : dto.getQuestions()) {
                Question question = toQuestionEntity(questionDto);
                question.setQuiz(quiz);
                quiz.getQuestions().add(question);
            }
        }

        return quiz;
    }

    /**
     * Converts a QuestionDto to a Question entity.
     */
    public static Question toQuestionEntity(QuestionDto dto) {
        if (dto == null) return null;

        return Question.builder()
                .id(dto.getId())
                .questionText(dto.getQuestionText())
                .correctAnswer(dto.getCorrectAnswer())
                .options(dto.getOptions() != null ? new ArrayList<>(dto.getOptions()) : Collections.emptyList())
                .build();
    }
}
