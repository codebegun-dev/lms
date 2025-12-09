package com.mockInterview.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mockInterview.entity.AIGenerationLog;

import java.util.List;

@Repository
public interface AIGenerationLogRepository extends JpaRepository<AIGenerationLog, Long> {
    List<AIGenerationLog> findByStatus(String status);
    List<AIGenerationLog> findByQuestionQuestionId(Long questionId);
}
