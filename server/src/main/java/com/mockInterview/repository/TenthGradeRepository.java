package com.mockInterview.repository;

import com.mockInterview.entity.TenthGrade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TenthGradeRepository extends JpaRepository<TenthGrade, Long> {
   TenthGrade findByUser_UserId(Long userId);
}
