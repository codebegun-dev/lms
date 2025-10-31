package com.mockInterview.repository;

import com.mockInterview.entity.InterviewAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InterviewAnalysisRepository extends JpaRepository<InterviewAnalysis, Long> {

    // ✅ Fetch by Interview ID (one-to-one mapping)
    InterviewAnalysis findByInterviewId(Long interviewId);

    // ✅ Check if analysis already exists for the interview
    boolean existsByInterviewId(Long interviewId);
}
