package com.learnable.backend.config;

import com.learnable.backend.model.Course;
import com.learnable.backend.repository.CourseRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    private final CourseRepository courseRepository;

    public DataLoader(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @Override
    public void run(String... args) {
        if (courseRepository.count() == 0) {
            List<Course> sampleCourses = List.of(
                Course.builder()
                        .title("Intro to React Native")
                        .description("Learn to build mobile apps with React Native and Expo.")
                        .imageUrl("https://source.unsplash.com/600x400/?reactnative")
                        .category("Mobile Development")
                        .instructor("Jane Doe")
                        .rating(4.7)
                        .build(),

                Course.builder()
                        .title("Spring Boot for Beginners")
                        .description("A complete guide to building REST APIs with Spring Boot.")
                        .imageUrl("https://source.unsplash.com/600x400/?springboot")
                        .category("Backend Development")
                        .instructor("John Smith")
                        .rating(4.5)
                        .build(),

                Course.builder()
                        .title("Fullstack with Java & React Native")
                        .description("Combine Spring Boot and React Native to build real-world apps.")
                        .imageUrl("https://source.unsplash.com/600x400/?fullstack")
                        .category("Fullstack")
                        .instructor("El Mago")
                        .rating(4.9)
                        .build()
            );

            courseRepository.saveAll(sampleCourses);
            System.out.println("✅ Sample courses loaded into the database.");
        } else {
            System.out.println("ℹ️ Courses already exist. Skipping seed.");
        }
    }
}
