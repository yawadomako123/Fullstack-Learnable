package com.learnable.backend.util;

import com.learnable.backend.model.Course;
import com.learnable.backend.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.time.LocalDate;

@Component
public class CertificateGenerator {

    @Value("${certificate.template.path:cert-templates/certificate_template.png}")
    private String templatePath;

    @Value("${certificate.signature.path:cert-templates/signature.png}")
    private String signaturePath;

    @Value("${certificate.output.folder:src/main/resources/static/certificates}")
    private String outputFolder;

    @Value("${certificate.url.prefix:/certificates/}")
    private String urlPrefix;

    public String generateCertificateImage(User user, Course course) {
        try {
            BufferedImage template = ImageIO.read(new File(templatePath));
            Graphics2D g2d = template.createGraphics();

            // Enable anti-aliasing
            g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            g2d.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);

            // 1. Draw NAME where course title originally was
            String fullName = user.getUsername() != null ? user.getUsername() : "Learner";
            g2d.setFont(new Font("Serif", Font.BOLD, 60));
            g2d.setColor(Color.BLACK);
            int nameY = 750;
            int nameX = centerTextX(g2d, fullName, template.getWidth());
            g2d.drawString(fullName, nameX, nameY);

            // 2. Draw COURSE TITLE where the date was
            String courseTitle = "has successfully completed the course: " + course.getTitle();
            g2d.setFont(new Font("SansSerif", Font.PLAIN, 36));
            int courseY = 950;
            int courseX = centerTextX(g2d, courseTitle, template.getWidth());
            g2d.drawString(courseTitle, courseX, courseY);

            // 3. Draw DATE lower
            String dateText = "Date Issued: " + LocalDate.now();
            g2d.setFont(new Font("SansSerif", Font.PLAIN, 28));
            int dateY = 1020;
            int dateX = centerTextX(g2d, dateText, template.getWidth());
            g2d.drawString(dateText, dateX, dateY);

            // 4. Draw signature in bottom-right
            BufferedImage signatureImage = ImageIO.read(new File(signaturePath));
            int signatureWidth = 250;
            int signatureHeight = 100;
            int signatureX = template.getWidth() - signatureWidth - 80;
            int signatureY = template.getHeight() - signatureHeight - 100;

            g2d.drawImage(signatureImage, signatureX, signatureY, signatureWidth, signatureHeight, null);

            g2d.dispose();

            // Save file
            String fileName = "cert_" + user.getId() + "_" + course.getId() + ".png";
            File outputDir = new File(outputFolder);
            if (!outputDir.exists()) outputDir.mkdirs();

            File outputFile = new File(outputDir, fileName);
            ImageIO.write(template, "png", outputFile);

            return urlPrefix + fileName;

        } catch (IOException e) {
            throw new RuntimeException("Failed to generate certificate: " + e.getMessage(), e);
        }
    }

    private int centerTextX(Graphics2D g2d, String text, int canvasWidth) {
        FontMetrics metrics = g2d.getFontMetrics();
        return (canvasWidth - metrics.stringWidth(text)) / 2;
    }
}
