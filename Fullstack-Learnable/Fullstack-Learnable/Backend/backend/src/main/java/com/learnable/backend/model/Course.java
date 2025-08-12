package com.learnable.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "courses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = {"modules", "quizzes"})
@NamedEntityGraph(
    name = "Course.detail",
    attributeNodes = {
        @NamedAttributeNode(value = "modules", subgraph = "moduleGraph")
    },
    subgraphs = {
        @NamedSubgraph(
            name = "moduleGraph",
            attributeNodes = {
                @NamedAttributeNode("lessons"),
                @NamedAttributeNode("quizzes"),
                @NamedAttributeNode(value = "subModules", subgraph = "subModuleGraph")
            }
        ),
        @NamedSubgraph(
            name = "subModuleGraph",
            attributeNodes = {
                @NamedAttributeNode("lessons"),
                @NamedAttributeNode("quizzes")
                // Removed recursive subModules → subModuleGraph reference
            }
        )
    }
)
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    private String category;

    private String instructor;

    private Double rating;

    // === Modules (Top-level only) ===
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orderIndex ASC")
    @Builder.Default
    private Set<CourseModule> modules = new LinkedHashSet<>();

    public void addModule(CourseModule module) {
        if (module != null && modules.add(module)) {
            module.setCourse(this);
        }
    }

    public void removeModule(CourseModule module) {
        if (module != null && modules.remove(module)) {
            module.setCourse(null);
        }
    }

    // === Course-level Quizzes (not tied to lessons) ===
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id ASC")
    @Builder.Default
    private Set<Quiz> quizzes = new LinkedHashSet<>();

    public void addQuiz(Quiz quiz) {
        if (quiz != null && quizzes.add(quiz)) {
            quiz.setCourse(this);
        }
    }

    public void removeQuiz(Quiz quiz) {
        if (quiz != null && quizzes.remove(quiz)) {
            quiz.setCourse(null);
        }
    }
}
