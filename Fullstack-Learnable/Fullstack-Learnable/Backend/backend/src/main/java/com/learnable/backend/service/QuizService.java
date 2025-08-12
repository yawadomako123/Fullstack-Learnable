package com.learnable.backend.service;

import com.learnable.backend.dto.QuizDto;
import com.learnable.backend.mapper.QuizMapper;
import com.learnable.backend.model.Course;
import com.learnable.backend.model.CourseModule;
import com.learnable.backend.model.Lesson;
import com.learnable.backend.model.Question;
import com.learnable.backend.model.Quiz;
import com.learnable.backend.repository.CourseModuleRepository;
import com.learnable.backend.repository.CourseRepository;
import com.learnable.backend.repository.LessonRepository;
import com.learnable.backend.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;
    private final CourseRepository courseRepository;
    private final CourseModuleRepository moduleRepository;
    private final LessonRepository lessonRepository;

    // === READ ===

    @Transactional(readOnly = true)
    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Quiz getQuizById(Long quizId) {
        return quizRepository.findById(quizId)
                .orElseThrow(() -> notFound("Quiz", quizId));
    }

    @Transactional(readOnly = true)
    public QuizDto getQuizDtoById(Long quizId) {
        return QuizMapper.toDto(getQuizById(quizId));
    }

    @Transactional(readOnly = true)
    public Quiz getQuizByModuleId(Long moduleId) {
        CourseModule module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> notFound("Module", moduleId));

        if (module.getParentModule() != null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Cannot retrieve quiz for a submodule.");
        }

        return quizRepository.findTopByModule_IdOrderByIdDesc(moduleId)
                .orElseThrow(() -> notFound("Quiz for module", moduleId));
    }

    @Transactional(readOnly = true)
    public QuizDto getQuizDtoByModuleId(Long moduleId) {
        return QuizMapper.toDto(getQuizByModuleId(moduleId));
    }

    // === CREATE / REPLACE ===

    @Transactional
    public QuizDto addOrReplaceQuizForModule(Long moduleId, QuizDto quizDto) {
        System.out.println("🚀 Adding or replacing quiz for module ID: " + moduleId);
        System.out.println("📥 Received quiz title: " + quizDto.getTitle());

        CourseModule module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> notFound("Module", moduleId));

        if (module.getParentModule() != null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Cannot add quiz to a submodule.");
        }

        // Delete existing quiz for the module (if any)
        quizRepository.findTopByModule_IdOrderByIdDesc(moduleId)
                .ifPresent(existing -> {
                    System.out.println("🗑️ Deleting existing quiz with ID: " + existing.getId());
                    quizRepository.deleteById(existing.getId());
                });

        // Map DTO to entity
        Quiz quiz = QuizMapper.toEntity(quizDto);
        quiz.setCourse(module.getCourse());
        quiz.setModule(module);
        quiz.setLesson(null); // Only module-level quizzes here

        if (quizDto.getQuestions() != null && !quizDto.getQuestions().isEmpty()) {
            System.out.println("🔍 Mapping " + quizDto.getQuestions().size() + " question(s)");

            List<Question> questions = quizDto.getQuestions().stream()
                    .map(QuizMapper::toEntity)
                    .peek(q -> q.setQuiz(quiz))
                    .collect(Collectors.toList());

            quiz.setQuestions(questions);
            System.out.println("✅ Linked " + quiz.getQuestions().size() + " questions");
        } else {
            System.out.println("⚠️ No questions provided. Clearing any defaults.");
            quiz.clearQuestions();
        }

        Quiz saved = quizRepository.save(quiz);
        System.out.println("💾 Quiz saved with ID: " + saved.getId());

        // Reload saved quiz to ensure questions are loaded
        Quiz loadedQuiz = quizRepository.findById(saved.getId())
                .orElseThrow(() -> new RuntimeException("Failed to reload saved quiz"));

        System.out.println("📊 Reloaded quiz has " + loadedQuiz.getQuestions().size() + " questions");

        return QuizMapper.toDto(loadedQuiz);
    }

    // === ADD TO LESSON ===

    @Transactional
    public Quiz addQuizToLesson(Long courseId, Long moduleId, Long lessonId, Quiz quiz) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> notFound("Course", courseId));

        CourseModule module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> notFound("Module", moduleId));

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> notFound("Lesson", lessonId));

        quiz.setCourse(course);
        quiz.setModule(module);
        quiz.setLesson(lesson);

        if (quiz.getQuestions() != null) {
            quiz.getQuestions().forEach(q -> q.setQuiz(quiz));
        }

        return quizRepository.save(quiz);
    }

    // === UPDATE ===

    @Transactional
    public QuizDto updateQuiz(Long quizId, QuizDto updatedDto) {
        System.out.println("✏️ Updating quiz ID: " + quizId);

        Quiz existingQuiz = quizRepository.findById(quizId)
                .orElseThrow(() -> notFound("Quiz", quizId));

        existingQuiz.setTitle(updatedDto.getTitle());

        if (updatedDto.getQuestions() != null && !updatedDto.getQuestions().isEmpty()) {
            System.out.println("🔄 Updating with " + updatedDto.getQuestions().size() + " question(s)");

            List<Question> updatedQuestions = updatedDto.getQuestions().stream()
                    .map(QuizMapper::toEntity)
                    .peek(q -> q.setQuiz(existingQuiz))
                    .collect(Collectors.toList());

            existingQuiz.setQuestions(updatedQuestions);
        } else {
            System.out.println("⚠️ No questions in update. Clearing existing ones.");
            existingQuiz.clearQuestions();
        }

        Quiz saved = quizRepository.save(existingQuiz);

        System.out.println("✅ Quiz updated. Now contains " + saved.getQuestions().size() + " questions");

        return QuizMapper.toDto(saved);
    }

    // === DELETE ===

    @Transactional
    public void deleteQuizById(Long quizId) {
        if (!quizRepository.existsById(quizId)) {
            throw notFound("Quiz", quizId);
        }

        System.out.println("🗑️ Deleting quiz with ID: " + quizId);
        quizRepository.deleteById(quizId);
        System.out.println("✅ Quiz deleted.");
    }

    // === UTILITY ===

    private ResponseStatusException notFound(String entity, Long id) {
        return new ResponseStatusException(HttpStatus.NOT_FOUND,
                entity + " not found with ID: " + id);
    }
}
