package com.learnable.backend.repository;

import com.learnable.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    boolean existsByUsername(String username); // ✅ Add this line
    User findByEmail(String email);
}
