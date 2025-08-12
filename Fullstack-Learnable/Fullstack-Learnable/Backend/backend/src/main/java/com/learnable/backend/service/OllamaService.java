package com.learnable.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class OllamaService {

    private final RestTemplate restTemplate;
    private final String ollamaApiUrl;

    public OllamaService(RestTemplateBuilder builder, @Value("${ollama.api.url}") String apiUrl) {
        this.restTemplate = builder.build();
        this.ollamaApiUrl = apiUrl;
    }

    public String sendPrompt(String prompt) {
        Map<String, Object> requestBody = Map.of(
                "model", "llama2", // change to your model name
                "prompt", prompt
        );

        ResponseEntity<Map> response = restTemplate.postForEntity(ollamaApiUrl, requestBody, Map.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            // Ollama usually returns JSON with generated text in a field like "completion" or "text"
            Map<String, Object> body = response.getBody();
            if (body != null && body.containsKey("completion")) {
                return body.get("completion").toString();
            } else if (body != null && body.containsKey("text")) {
                return body.get("text").toString();
            } else {
                return "No completion found in response";
            }
        } else {
            throw new RuntimeException("Ollama API error: " + response.getStatusCode());
        }
    }
}
