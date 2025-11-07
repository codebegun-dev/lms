package com.mockInterview.repository;

import com.mockInterview.entity.InterviewTranscript;



import org.springframework.data.jpa.repository.JpaRepository;

public interface InterviewTranscriptRepository extends JpaRepository<InterviewTranscript, Long> { 

	
	InterviewTranscript findByInterviewId(Long interviewId);
}
