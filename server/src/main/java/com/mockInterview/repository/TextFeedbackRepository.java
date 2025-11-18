package com.mockInterview.repository;

import com.mockInterview.entity.StudentInterview;
import com.mockInterview.entity.TextFeedback;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TextFeedbackRepository extends JpaRepository<TextFeedback, Long> {
	
	Optional<TextFeedback> findByInterview(StudentInterview interview);
}