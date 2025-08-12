package com.learnable.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "quizzes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = {"module", "lesson", "course", "questions"})
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(nullable = false)
    private String title;

    // === RELATIONSHIPS ===

    // Many quizzes can belong to one module
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "module_id")
    @JsonIgnore
    private CourseModule module;

    // Many quizzes can belong to one course
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    @JsonIgnore
    private Course course;

    // One quiz can belong to one lesson
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", unique = true)
    @JsonIgnore
    private Lesson lesson;

    // One quiz can have many questions
    @OneToMany(
        mappedBy = "quiz",
        cascade = CascadeType.ALL,
        orphanRemoval = true,
        fetch = FetchType.LAZY
    )
    @OrderColumn(name = "question_order")
    @Builder.Default
    private List<Question> questions = new ArrayList<>();

    // === RELATIONSHIP SETTERS ===

    public void setModule(CourseModule module) {
        this.module = module;
        if (module != null && !module.getQuizzes().contains(this)) {
            module.getQuizzes().add(this);
        }
    }

    public void setCourse(Course course) {
        this.course = course;
        if (course != null && !course.getQuizzes().contains(this)) {
            course.getQuizzes().add(this);
        }
    }

    public void setLesson(Lesson lesson) {
        this.lesson = lesson;
        if (lesson != null && lesson.getQuiz() != this) {
            lesson.setQuiz(this);
        }
    }

    // === QUESTION MANIPULATION ===

    /**
     * Add a question to the quiz with proper bidirectional linking.
     */
    public void addQuestion(Question question) {
        if (question != null && !this.questions.contains(question)) {
            this.questions.add(question);
            question.setQuiz(this);
        }
    }

    /**
     * Remove a question from the quiz and unlink.
     */
    public void removeQuestion(Question question) {
        if (question != null && this.questions.remove(question)) {
            question.setQuiz(null);
        }
    }

    /**
     * Clear all questions and unlink them from this quiz.
     */
    public void clearQuestions() {
        for (Question question : this.questions) {
            question.setQuiz(null);
        }
        this.questions.clear();
    }

    /**
     * Replace all questions safely with new list.
     */
    public void setQuestions(List<Question> newQuestions) {
        clearQuestions();
        if (newQuestions != null) {
            for (Question question : newQuestions) {
                addQuestion(question);
            }
        }
    }
}
