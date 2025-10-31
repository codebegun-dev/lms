package com.mockInterview.repository;

import com.mockInterview.entity.PerformanceAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PerformanceAnalysisRepository extends JpaRepository<PerformanceAnalysis, Long> {
    PerformanceAnalysis findByInterview_Id(Long interviewId);
}
