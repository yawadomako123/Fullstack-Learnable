package com.learnable.backend.service;

import com.learnable.backend.model.User;
import com.learnable.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Value("${app.upload.dir:${user.home}/uploads}")
    private String uploadDir;

    public String updateProfileImage(Long userId, String base64Image) throws IOException {
        // Find the user by ID or throw error
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Split base64 string to remove prefix if present
        String[] parts = base64Image.split(",");
        String imageData = parts.length > 1 ? parts[1] : parts[0];

        // Decode base64 string to bytes
        byte[] imageBytes = Base64.getDecoder().decode(imageData);

        // Generate unique filename with .jpg extension
        String filename = UUID.randomUUID() + ".jpg";

        // Path to upload directory + profile-images subfolder
        Path uploadPath = Paths.get(uploadDir, "profile-images");

        // Create directories if they do not exist
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Resolve full file path and write bytes to file
        Path filePath = uploadPath.resolve(filename);
        try (FileOutputStream stream = new FileOutputStream(filePath.toFile())) {
            stream.write(imageBytes);
        }

        // Set relative image URL path to user and save
        String imageUrl = "/uploads/profile-images/" + filename;
        user.setImage(imageUrl);
        userRepository.save(user);

        // Return the relative URL for frontend use
        return imageUrl;
    }
}
