package com.learnable.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "modules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class CourseModule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;

    // === Parent course ===
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "course_id", nullable = false)
    @JsonIgnore
    private Course course;

    // === Lessons under this module ===
    @OneToMany(mappedBy = "module", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orderIndex ASC")
    @Builder.Default
    private Set<Lesson> lessons = new LinkedHashSet<>();

    public void addLesson(Lesson lesson) {
        if (lesson != null && lessons.add(lesson)) {
            lesson.setModule(this);
        }
    }

    public void removeLesson(Lesson lesson) {
        if (lesson != null && lessons.remove(lesson)) {
            lesson.setModule(null);
        }
    }

    // === Quizzes directly attached to this module ===
    @OneToMany(mappedBy = "module", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Quiz> quizzes = new LinkedHashSet<>();

    public void addQuiz(Quiz quiz) {
        if (quiz != null && quizzes.add(quiz)) {
            quiz.setModule(this);
        }
    }

    public void removeQuiz(Quiz quiz) {
        if (quiz != null && quizzes.remove(quiz)) {
            quiz.setModule(null);
        }
    }

    // === Assignments directly attached to this submodule ===
    @OneToMany(mappedBy = "subModule", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Assignment> assignments = new LinkedHashSet<>();

    public void addAssignment(Assignment assignment) {
        if (assignment != null && assignments.add(assignment)) {
            assignment.setSubModule(this);
        }
    }

    public void removeAssignment(Assignment assignment) {
        if (assignment != null && assignments.remove(assignment)) {
            assignment.setSubModule(null);
        }
    }

    // === Parent module (for nesting) ===
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_module_id")
    @JsonIgnore
    private CourseModule parentModule;

    // === Submodules ===
    @OneToMany(mappedBy = "parentModule", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orderIndex ASC")
    @Builder.Default
    private Set<CourseModule> subModules = new LinkedHashSet<>();

    public void addSubModule(CourseModule subModule) {
        if (subModule != null && subModules.add(subModule)) {
            subModule.setParentModule(this);
        }
    }

    public void removeSubModule(CourseModule subModule) {
        if (subModule != null && subModules.remove(subModule)) {
            subModule.setParentModule(null);
        }
    }

    public boolean isTopLevel() {
        return this.parentModule == null;
    }
}
