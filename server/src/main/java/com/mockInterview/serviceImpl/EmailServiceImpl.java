package com.mockInterview.serviceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.mockInterview.service.EmailService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.AddressException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    private void validateEmail(String email) throws AddressException {
        if (email == null || email.isEmpty()) {
            throw new AddressException("Email address is null or empty");
        }
        InternetAddress emailAddr = new InternetAddress(email);
        emailAddr.validate(); // Throws exception if invalid
    }

    @Async
    @Override
    public void sendWelcomeEmail(String toEmail, String firstName) {
        try {
            validateEmail(toEmail); // Validate email first

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("🎉 Welcome to Mock Interview Hub");

            String content = "<html><body>"
                    + "<h2>Hello " + firstName + ",</h2>"
                    + "<p>Welcome to <b>Mock Interview Hub</b>!</p>"
                    + "<p>You can now log in and start preparing for your dream job interviews.</p>"
                    + "<br><p>Best wishes,<br>Mock Interview Hub Team</p>"
                    + "</body></html>";

            helper.setText(content, true);
            mailSender.send(mimeMessage);

            logger.info("✅ Welcome email sent successfully to {}", toEmail);

        } catch (AddressException e) {
            logger.error("❌ Invalid email address: {}", toEmail, e);
        } catch (MessagingException e) {
            logger.error("❌ Failed to send welcome email to {}", toEmail, e);
        } catch (Exception e) {
            logger.error("❌ Unexpected error sending welcome email to {}", toEmail, e);
        }
    }

    @Async
    @Override
    public void sendResetPasswordEmail(String toEmail, String resetLink) {
        try {
            validateEmail(toEmail); // Validate email first

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("🔑 Reset Your Mock Interview Hub Password");

            String htmlContent = "<html><body style='font-family:Arial, sans-serif; line-height:1.6;'>"
                    + "<h2>Reset Your Password</h2>"
                    + "<p>We received a request to reset your Mock Interview Hub account password.</p>"
                    + "<p>Click the button below to set a new password:</p>"
                    + "<a href='" + resetLink + "' "
                    + "style='background-color:#4CAF50; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;'>"
                    + "Reset Password</a>"
                    + "<p>If you didn’t request this, please ignore this email.</p>"
                    + "<br><p>Best regards,<br>Mock Interview Hub Team</p>"
                    + "</body></html>";

            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);

            logger.info("✅ Reset password email sent successfully to {}", toEmail);

        } catch (AddressException e) {
            logger.error("❌ Invalid email address: {}", toEmail, e);
        } catch (MessagingException e) {
            logger.error("❌ Failed to send reset password email to {}", toEmail, e);
        } catch (Exception e) {
            logger.error("❌ Unexpected error sending reset password email to {}", toEmail, e);
        }
    }
}
