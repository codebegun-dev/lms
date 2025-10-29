package com.mockInterview.repository;

import com.mockInterview.entity.StudentGenericDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentGenericDetailsRepository extends JpaRepository<StudentGenericDetails, Long> {
    StudentGenericDetails findByUser_UserId(Long userId);
}
