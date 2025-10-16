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

    // 🕛 Runs every day at midnight
    @Scheduled(cron = "0 0 0 * * ?")
    public void cleanupExpiredTokens() {
        LocalDateTime now = LocalDateTime.now();
        tokenRepository.deleteExpiredTokens(now);
        System.out.println("🧹 Cleaned up expired/used password reset tokens at: " + now);
    }
}

