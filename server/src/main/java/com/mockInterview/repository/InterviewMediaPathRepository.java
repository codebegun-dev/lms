package com.mockInterview.repository;

import com.mockInterview.entity.InterviewMediaPath;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InterviewMediaPathRepository extends JpaRepository<InterviewMediaPath, Long> {
    // Correct method to fetch by interview ID
    InterviewMediaPath findByInterview_Id(Long interviewId);
}
