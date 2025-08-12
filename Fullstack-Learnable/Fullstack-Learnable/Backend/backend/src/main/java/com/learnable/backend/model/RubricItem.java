package com.learnable.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "rubric_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RubricItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String category;

    @Column(length = 2000)
    private String exemplary;

    @Column(length = 2000)
    private String adequate;

    @Column(length = 2000, name = "needs_improvement")
    private String needsImprovement;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignment_id")
    private Assignment assignment;
}
