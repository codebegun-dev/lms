package com.mockInterview.repository;

import com.mockInterview.entity.StudentCourseDetails;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentCourseDetailsRepository extends JpaRepository<StudentCourseDetails, Long> {
    StudentCourseDetails findByUser_UserId(Long userId);
}
