package com.learnable.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String certificateUrl;

    @Column(name = "issue_date")
    private LocalDate issueDate;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    // Constructors
    public Certificate() {}

    public Certificate(String certificateUrl, LocalDate issueDate, User user, Course course) {
        this.certificateUrl = certificateUrl;
        this.issueDate = issueDate;
        this.user = user;
        this.course = course;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public String getCertificateUrl() {
        return certificateUrl;
    }

    public void setCertificateUrl(String certificateUrl) {
        this.certificateUrl = certificateUrl;
    }

    public LocalDate getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(LocalDate issueDate) {
        this.issueDate = issueDate;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }
}
