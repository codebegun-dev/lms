package com.mockInterview.scheduler;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.mockInterview.repository.PasswordResetTokenRepository;

@Component
public class TokenCleanupScheduler {

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    // Runs daily at midnight
    @Scheduled(cron = "0 0 0 * * ?")
    public void cleanupExpiredTokens() {
        Date now = new Date();
        int deletedCount = tokenRepository.deleteExpiredTokens(now, tokenRepository);
        System.out.println("🧹 Cleaned up " + deletedCount + " expired/used tokens at: " + now);
    }
}
