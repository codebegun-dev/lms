package com.mockInterview.scheduler;


import java.time.LocalDateTime;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.mockInterview.entity.LeadActivityHistory;
import com.mockInterview.repository.LeadActivityHistoryRepository;
import com.mockInterview.serviceImpl.NotificationService;

import jakarta.transaction.Transactional;

@Service
public class ReminderSchedulerService {

    @Autowired
    private LeadActivityHistoryRepository historyRepo;

    @Autowired
    private NotificationService notificationService;

    /**
     * Schedule a reminder for a single LeadActivityHistory record.
     * Call this method whenever a reminder is created or updated.
     */
    public void scheduleReminder(LeadActivityHistory history) {
        notificationService.scheduleReminder(history);
    }

    /**
     * Fallback cron-based check to catch any missed reminders.
     * Runs every minute.
     */
    @Transactional
//    @Scheduled(cron = "0 * * * * *") // every minute
    public void processDueReminders() {
        LocalDateTime now = LocalDateTime.now();

        List<LeadActivityHistory> dueList = historyRepo.findDueReminders(now);
        if (dueList.isEmpty()) return;

        for (LeadActivityHistory h : dueList) {
            try {
                // Schedule the reminder dynamically using NotificationService
                scheduleReminder(h);

            } catch (Exception e) {
                System.err.println("Failed to schedule reminder for LeadActivityHistory ID: "
                        + h.getId() + " | Error: " + e.getMessage());
            }
        }
    }
}
