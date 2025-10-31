package com.mockInterview.repository;

import com.mockInterview.entity.QuestionStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionStatsRepository extends JpaRepository<QuestionStats, Long> {
}
