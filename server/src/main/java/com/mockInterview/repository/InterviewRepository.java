package com.mockInterview.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.mockInterview.entity.Interview;
public interface InterviewRepository extends JpaRepository<Interview, Long> {
	 List<Interview> findByStudentId(Long studentId);
}
