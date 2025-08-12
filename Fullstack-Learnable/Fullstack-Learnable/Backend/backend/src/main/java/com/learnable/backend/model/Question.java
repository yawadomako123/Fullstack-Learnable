package com.learnable.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "quiz")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    @Column(nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
        name = "question_options",
        joinColumns = @JoinColumn(name = "question_id")
    )
    @Column(name = "option", nullable = false)
    @Builder.Default
    private List<String> options = new ArrayList<>();

    @Column(nullable = false)
    private String correctAnswer;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "quiz_id", nullable = false)
    @JsonIgnore
    private Quiz quiz;

    /**
     * Bidirectional setter to avoid recursive stack and duplicates.
     */
    public void setQuiz(Quiz quiz) {
        this.quiz = quiz;

        if (quiz != null && !quiz.getQuestions().contains(this)) {
            quiz.getQuestions().add(this);
        }
    }

    // Optionally, you can add equals/hashCode later based on business keys,
    // but avoid relying only on id when it can be null.
}
