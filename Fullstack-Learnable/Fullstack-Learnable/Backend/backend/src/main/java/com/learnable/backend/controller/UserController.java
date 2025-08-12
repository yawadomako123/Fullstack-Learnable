package com.learnable.backend.controller;

import com.learnable.backend.dto.LoginRequest;
import com.learnable.backend.dto.SignupRequest;
import com.learnable.backend.model.User;
import com.learnable.backend.repository.UserRepository;
import com.learnable.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;

    // Register new user
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "Email already registered"));
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "Username already taken"));
        }

        User newUser = new User();
        newUser.setUsername(request.getUsername());
        newUser.setEmail(request.getEmail());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));

        User savedUser = userRepository.save(newUser);

        Map<String, Object> userData = new HashMap<>();
        userData.put("id", savedUser.getId());
        userData.put("username", savedUser.getUsername());
        userData.put("email", savedUser.getEmail());
        userData.put("image", Optional.ofNullable(savedUser.getImage()).orElse("")); // allow null image

        Map<String, Object> response = new HashMap<>();
        response.put("message", "User registered successfully");
        response.put("user", userData);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Login user
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail());

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", "Invalid email or password"));
        }

        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId());
        userData.put("username", user.getUsername());
        userData.put("email", user.getEmail());
        userData.put("image", Optional.ofNullable(user.getImage()).orElse("")); // allow null image

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Login successful");
        response.put("user", userData);

        return ResponseEntity.ok(response);
    }

    // Upload or update profile image (base64 string)
    @PatchMapping("/profile-image")
    public ResponseEntity<?> updateProfileImage(@RequestBody Map<String, String> payload) {
        try {
            String base64Image = payload.get("image");
            String userIdStr = payload.get("userId");

            if (base64Image == null || base64Image.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Collections.singletonMap("message", "Image is required."));
            }

            if (userIdStr == null || userIdStr.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Collections.singletonMap("message", "User ID is required."));
            }

            Long userId = Long.parseLong(userIdStr);
            String imageUrl = userService.updateProfileImage(userId, base64Image);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Profile image updated successfully");
            response.put("imageUrl", imageUrl);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Profile image update failed");
            error.put("details", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // For dev/testing: get all users
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }
}
