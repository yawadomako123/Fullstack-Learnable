package com.learnable.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "lessons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(nullable = false)
    private String title;

    @Lob
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(length = 1000)
    private String videoUrl;

    @Column(length = 1000)
    private String pdfUrl;

    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;

    // === Parent module ===
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "module_id", nullable = false)
    private CourseModule module;

    public void setModule(CourseModule module) {
        this.module = module;
        if (module != null && !module.getLessons().contains(this)) {
            module.getLessons().add(this);
        }
    }

    // === Optional quiz ===
    @OneToOne(mappedBy = "lesson", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Quiz quiz;

    public void setQuiz(Quiz quiz) {
        this.quiz = quiz;
        if (quiz != null && quiz.getLesson() != this) {
            quiz.setLesson(this);
        }
    }

    // === Assignments under this lesson ===
    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Assignment> assignments = new LinkedHashSet<>();

    public void addAssignment(Assignment assignment) {
        if (assignment != null && assignments.add(assignment)) {
            assignment.setLesson(this);
        }
    }

    public void removeAssignment(Assignment assignment) {
        if (assignment != null && assignments.remove(assignment)) {
            assignment.setLesson(null);
        }
    }
}
