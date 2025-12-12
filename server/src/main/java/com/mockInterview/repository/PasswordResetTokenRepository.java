package com.mockInterview.repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mockInterview.entity.PasswordResetToken;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    // Find token by token string
    Optional<PasswordResetToken> findByToken(String token);

    // Find all tokens that have expired
    List<PasswordResetToken> findByExpiryDateBefore(Date now);

    // Delete all expired tokens and return the count
    default int deleteExpiredTokens(Date now, JpaRepository<PasswordResetToken, Long> repository) {
        List<PasswordResetToken> expiredTokens = findByExpiryDateBefore(now);
        int count = expiredTokens.size();
        deleteAll(expiredTokens);
        return count;
    }
}
