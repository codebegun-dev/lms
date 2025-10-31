package com.mockInterview.repository;

import com.mockInterview.entity.ExtractedText;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExtractedTextRepository extends JpaRepository<ExtractedText, Long> {
    ExtractedText findByInterview_Id(Long interviewId); // Correct JPA method
}
