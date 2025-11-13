package com.mockInterview.scheduler;



import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.mockInterview.repository.PasswordResetTokenRepository;

@Component
public class TokenCleanupScheduler {

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Scheduled(cron = "0 0 0 * * ?") // Runs daily at midnight
    public void cleanupExpiredTokens() {
        LocalDateTime now = LocalDateTime.now();
        int deletedCount = tokenRepository.deleteExpiredTokens(now);
        System.out.println("🧹 Cleaned up " + deletedCount + " expired/used tokens at: " + now);
    }

}

