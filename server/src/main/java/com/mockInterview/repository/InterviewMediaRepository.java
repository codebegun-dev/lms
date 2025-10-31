package com.mockInterview.repository;

import com.mockInterview.entity.InterviewMedia;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InterviewMediaRepository extends JpaRepository<InterviewMedia, Long> { 
	
	 InterviewMedia findByInterviewId(Long interviewId);
}
