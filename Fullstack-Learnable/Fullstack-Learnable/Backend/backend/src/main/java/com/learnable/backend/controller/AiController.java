package com.learnable.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final WebClient webClient;

    public AiController(@Value("${gpt4all.url}") String gpt4AllUrl) {
        this.webClient = WebClient.builder()
                .baseUrl(gpt4AllUrl)
                .build();
    }

    @PostMapping(value = "/chat", produces = MediaType.APPLICATION_NDJSON_VALUE)
    public Flux<String> chatWithAI(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message");
        if (userMessage == null || userMessage.trim().isEmpty()) {
            return Flux.error(new IllegalArgumentException("No message provided"));
        }

        return webClient.post()
                .uri("/")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_NDJSON)  // Expect newline-delimited JSON chunks
                .bodyValue(Map.of("message", userMessage))
                .retrieve()
                .bodyToFlux(String.class);  // Stream response body as Flux<String>
    }
}
