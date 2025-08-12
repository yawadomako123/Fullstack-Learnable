package com.learnable.backend.dto;

import java.time.LocalDate;

public class CertificateDto {

    private Long id;
    private String certificateUrl;
    private LocalDate issueDate;
    private Long userId;
    private Long courseId;
    private String userFullName;
    private String courseTitle;

    // Constructors
    public CertificateDto() {}

    public CertificateDto(Long id, String certificateUrl, LocalDate issueDate,
                          Long userId, Long courseId, String userFullName, String courseTitle) {
        this.id = id;
        this.certificateUrl = certificateUrl;
        this.issueDate = issueDate;
        this.userId = userId;
        this.courseId = courseId;
        this.userFullName = userFullName;
        this.courseTitle = courseTitle;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public String getUserFullName() {
        return userFullName;
    }

    public void setUserFullName(String userFullName) {
        this.userFullName = userFullName;
    }

    public String getCourseTitle() {
        return courseTitle;
    }

    public void setCourseTitle(String courseTitle) {
        this.courseTitle = courseTitle;
    }
}
