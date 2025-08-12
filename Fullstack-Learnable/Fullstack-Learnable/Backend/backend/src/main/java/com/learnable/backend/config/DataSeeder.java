package com.learnable.backend.config;

import com.learnable.backend.model.Course;
import com.learnable.backend.repository.CourseRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedCourses(CourseRepository courseRepository) {
        return args -> {
            if (courseRepository.count() == 0) {
                courseRepository.save(Course.builder()
                        .title("Intro to React Native")
                        .description("Build native mobile apps using React Native.")
                        .imageUrl("https://i.imgur.com/0y8Ftya.png")
                        .category("Mobile Development")
                        .instructor("Kelvin")
                        .rating(4.8)
                        .build());

                courseRepository.save(Course.builder()
                        .title("Spring Boot Essentials")
                        .description("Create powerful backend APIs with Spring Boot.")
                        .imageUrl("https://i.imgur.com/nzA3KvG.png")
                        .category("Backend Development")
                        .instructor("Kelvin")
                        .rating(4.7)
                        .build());

                courseRepository.save(Course.builder()
                        .title("UI/UX Design Basics")
                        .description("Learn principles of modern UI/UX design.")
                        .imageUrl("https://i.imgur.com/0XjP4g6.png")
                        .category("Design")
                        .instructor("Kelvin")
                        .rating(4.6)
                        .build());

                courseRepository.save(Course.builder()
                        .title("Full Stack Web Dev")
                        .description("Master frontend & backend web dev.")
                        .imageUrl("https://i.imgur.com/LQyBlmM.png")
                        .category("Full Stack")
                        .instructor("Kelvin")
                        .rating(4.9)
                        .build());

                System.out.println("✅ Courses seeded.");
            } else {
                System.out.println("ℹ️ Courses already exist. No seeding done.");
            }
        };
    }
}
