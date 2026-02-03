package com.mockInterview.repository;

import com.mockInterview.entity.TenthGrade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TenthGradeRepository extends JpaRepository<TenthGrade, Long> {

    Optional<TenthGrade> findByUser_UserId(Long userId);
}
