package com.mockInterview.repository;

import com.mockInterview.entity.InterviewRecording;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface InterviewRecordingRepository extends JpaRepository<InterviewRecording, Long> {

    // Fetch all recordings for a specific interview
    List<InterviewRecording> findByInterviewId(Long interviewId);

    // Fetch all recordings for a specific user
    List<InterviewRecording> findByUserId(Long userId);

    // Fetch recordings for a specific interview and user
    List<InterviewRecording> findByInterviewIdAndUserId(Long interviewId, Long userId);
}

