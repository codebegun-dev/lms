package com.mockInterview.repository;

import com.mockInterview.entity.StudentTwelfthGrade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentTwelfthGradeRepository extends JpaRepository<StudentTwelfthGrade, Long> {

    // ✅ Find record by user (each user has one twelfth-grade record)
    Optional<StudentTwelfthGrade> findByUser_UserId(Long userId);
}
