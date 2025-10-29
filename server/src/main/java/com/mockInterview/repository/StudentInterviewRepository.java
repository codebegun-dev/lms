package com.mockInterview.repository;

import com.mockInterview.entity.StudentInterview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StudentInterviewRepository extends JpaRepository<StudentInterview, Long> {
    List<StudentInterview> findByStudent_UserId(Long studentId);
}
