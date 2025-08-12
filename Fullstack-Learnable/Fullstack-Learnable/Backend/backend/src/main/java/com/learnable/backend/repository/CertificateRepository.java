package com.learnable.backend.repository;

import com.learnable.backend.model.Certificate;
import com.learnable.backend.model.User;
import com.learnable.backend.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CertificateRepository extends JpaRepository<Certificate, Long> {

    // This method uses Spring Data JPA's query derivation
    Optional<Certificate> findByUserAndCourse(User user, Course course);

    // Add this custom method using userId and courseId directly
    Optional<Certificate> findByUserIdAndCourseId(Long userId, Long courseId);
}
