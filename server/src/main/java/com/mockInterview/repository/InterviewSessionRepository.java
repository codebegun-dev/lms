package com.mockInterview.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.mockInterview.entity.InterviewSession;
import java.util.List;

public interface InterviewSessionRepository extends JpaRepository<InterviewSession, Long> {
    List<InterviewSession> findByStudentIdOrderByStartTimeDesc(Long studentId);
}
