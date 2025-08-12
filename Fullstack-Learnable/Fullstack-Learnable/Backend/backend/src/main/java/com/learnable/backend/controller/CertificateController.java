package com.learnable.backend.controller;

import com.learnable.backend.model.Certificate;
import com.learnable.backend.service.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/certificates")
public class CertificateController {

    @Autowired
    private CertificateService certificateService;

    // GET existing certificate
    @GetMapping("/user/{userId}/course/{courseId}")
    public ResponseEntity<?> getCertificate(
            @PathVariable Long userId,
            @PathVariable Long courseId
    ) {
        return certificateService.getCertificateForUser(userId, courseId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST to generate certificate (e.g. after completing course)
    @PostMapping("/generate")
    public ResponseEntity<Certificate> generateCertificate(
            @RequestParam Long userId,
            @RequestParam Long courseId
    ) {
        Certificate certificate = certificateService.generateCertificate(userId, courseId);
        return ResponseEntity.ok(certificate);
    }
}
