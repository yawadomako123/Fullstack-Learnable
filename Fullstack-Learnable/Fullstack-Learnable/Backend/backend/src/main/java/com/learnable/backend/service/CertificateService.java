package com.learnable.backend.service;

import com.learnable.backend.model.Certificate;
import com.learnable.backend.model.User;
import com.learnable.backend.model.Course;
import com.learnable.backend.repository.CertificateRepository;
import com.learnable.backend.repository.UserRepository;
import com.learnable.backend.repository.CourseRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;

import java.io.*;
import java.time.LocalDate;
import java.util.Optional;

import com.itextpdf.text.Document;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.text.Image;

@Service
public class CertificateService {

    @Autowired
    private CertificateRepository certificateRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private JavaMailSender mailSender;

    public Optional<Certificate> getCertificateForUser(Long userId, Long courseId) {
        return certificateRepository.findByUserIdAndCourseId(userId, courseId);
    }

    public Certificate generateCertificate(Long userId, Long courseId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        String fullName = user.getUsername(); // You mentioned to use username
        String courseTitle = course.getTitle();
        LocalDate date = LocalDate.now();

        String filename = "certificate-" + userId + "-" + courseId + ".pdf";
        String path = "certificates/" + filename;

        try {
            generateCertificatePdf(fullName, courseTitle, date.toString(), path);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate certificate", e);
        }

        Certificate certificate = new Certificate();
        certificate.setUser(user);
        certificate.setCourse(course);
        certificate.setIssueDate(date);
        certificate.setCertificateUrl(path);
        certificateRepository.save(certificate);

        sendEmailWithCertificate(user.getEmail(), fullName, courseTitle, path);
        return certificate;
    }

    private void generateCertificatePdf(String name, String courseTitle, String date, String pdfPath) throws Exception {
        // Load certificate template image
        BufferedImage template = ImageIO.read(new ClassPathResource("certificate_template.png").getInputStream());
        Graphics2D g = template.createGraphics();

        g.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
        g.setColor(Color.BLACK);
        g.setFont(new Font("Serif", Font.BOLD, 40));

        // Coordinates depend on your template layout – adjust accordingly
        g.drawString(name, 500, 300);
        g.drawString(courseTitle, 500, 370);
        g.drawString(date, 500, 440);

        // Add signature image
        BufferedImage signature = ImageIO.read(new ClassPathResource("signature.png").getInputStream());
        g.drawImage(signature, 1000, 500, 200, 100, null);
        g.dispose();

        // Save as temporary image file
        File imageFile = new File("temp_certificate.png");
        ImageIO.write(template, "png", imageFile);

        // Convert image to PDF
        Document document = new Document(PageSize.A4.rotate());
        File pdfFile = new File(pdfPath);
        pdfFile.getParentFile().mkdirs();

        PdfWriter.getInstance(document, new FileOutputStream(pdfFile));
        document.open();
        Image pdfImage = Image.getInstance(imageFile.getAbsolutePath());
        pdfImage.scaleToFit(PageSize.A4.getHeight(), PageSize.A4.getWidth());
        pdfImage.setAlignment(Image.ALIGN_CENTER);
        document.add(pdfImage);
        document.close();

        // Delete temp image file
        imageFile.delete();
    }

    private void sendEmailWithCertificate(String email, String fullName, String courseTitle, String path) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(email);
            helper.setSubject("🎓 Your Certificate for " + courseTitle);
            helper.setText("Dear " + fullName + ",\n\n" +
                    "Congratulations on completing " + courseTitle + "!\n\n" +
                    "Please find your certificate attached.\n\n" +
                    "Best regards,\nLearnable Team");

            File file = new File(path);
            helper.addAttachment("Certificate.pdf", file);

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send certificate email", e);
        }
    }
}
