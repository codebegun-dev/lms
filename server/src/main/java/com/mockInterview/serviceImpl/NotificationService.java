package com.mockInterview.serviceImpl;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.mockInterview.entity.LeadActivityHistory;
import com.mockInterview.entity.User;
import com.mockInterview.repository.UserRepository;
import com.mockInterview.repository.LeadActivityHistoryRepository;

@Service
public class NotificationService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskScheduler taskScheduler;

    @Autowired
    private LeadActivityHistoryRepository historyRepo;

    /**
     * Asynchronous notification to user.
     * Handles in-app, email, and SMS with error logging.
     */
    @Async
    public void sendNotificationAsync(Long userId, String message) {
        try {
            sendInApp(userId, message);
        } catch (Exception e) {
            System.err.println("Failed in-app notification for user " + userId + ": " + e.getMessage());
        }

        try {
            sendEmail(userId, message);
        } catch (Exception e) {
            System.err.println("Failed email notification for user " + userId + ": " + e.getMessage());
        }

        try {
            sendSMS(userId, message);
        } catch (Exception e) {
            System.err.println("Failed SMS notification for user " + userId + ": " + e.getMessage());
        }
    }

    private void sendInApp(Long userId, String msg) {
        // Ideally save to a notifications table for frontend WebSocket
        System.out.println("In-app notification to user " + userId + ": " + msg);
    }

    private void sendEmail(Long userId, String msg) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        String email = user.getEmail();

        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(email);
        mail.setSubject("Lead Reminder");
        mail.setText(msg);

        // Add retry logic for network issues
        int retries = 3;
        while (retries > 0) {
            try {
                mailSender.send(mail);
                System.out.println("Email sent to " + email);
                break;
            } catch (Exception e) {
                retries--;
                System.err.println("Retrying email to " + email + " | Attempts left: " + retries);
                if (retries == 0) throw e;
            }
        }
    }

    private void sendSMS(Long userId, String msg) {
        // Integrate Twilio or any SMS gateway here
        System.out.println("SMS sent to user " + userId + ": " + msg);
    }

    /**
     * Schedule a reminder at the exact time.
     * Uses Instant instead of deprecated Date.
     */
    public void scheduleReminder(LeadActivityHistory history) {
        if (history.getReminderTime() == null || history.isNotified()) return;

        Runnable task = () -> {
            try {
            	sendNotificationAsync(
            		    history.getUpdatedBy(),
            		    "Reminder: Call lead " + history.getLead().getLeadName() + "\n" +
            		    "Phone: " + history.getLead().getPhone() + "\n" +
            		    "Email: " + history.getLead().getEmail() + "\n" +
            		    "Status: " + history.getNewStatus() + "\n" +
            		    "Campaign: " + history.getLead().getCampaign() + "\n" +
            		    "Reminder Time: " + history.getReminderTime()
            		);


                // Mark as notified
                history.setNotified(true);
                history.setNotifiedAt(LocalDateTime.now());
                 historyRepo.save(history);

            } catch (Exception e) {
                System.err.println("Failed to send reminder for LeadActivityHistory ID: "
                        + history.getLead().getLeadName()+ " | Error: " + e.getMessage());
            }
        };

        Instant instant = history.getReminderTime().atZone(ZoneId.systemDefault()).toInstant();
        taskScheduler.schedule(task, instant);
    }
}
