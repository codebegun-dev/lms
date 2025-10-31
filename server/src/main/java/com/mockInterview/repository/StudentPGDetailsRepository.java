package com.mockInterview.repository;

import com.mockInterview.entity.StudentPGDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentPGDetailsRepository extends JpaRepository<StudentPGDetails, Long> {
    StudentPGDetails findByUser_UserId(Long userId);
}
