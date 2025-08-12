package com.learnable.backend.mapper;

import com.learnable.backend.dto.CertificateDto;
import com.learnable.backend.model.Certificate;

public class CertificateMapper {

    public static CertificateDto toDto(Certificate certificate) {
        if (certificate == null) return null;

        return new CertificateDto(
            certificate.getId(),
            certificate.getCertificateUrl(),
            certificate.getIssueDate(),
            certificate.getUser().getId(),
            certificate.getCourse().getId(),
            certificate.getUser().getUsername(),    // assuming User has getFullName()
            certificate.getCourse().getTitle()      // assuming Course has getTitle()
        );
    }
}
