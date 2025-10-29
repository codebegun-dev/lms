package com.mockInterview.repository;

import com.mockInterview.entity.StudentUGDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentUGDetailsRepository extends JpaRepository<StudentUGDetails, Long> {
    StudentUGDetails findByUser_UserId(Long userId);
}
