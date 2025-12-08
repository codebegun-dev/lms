package com.mockInterview.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.mockInterview.entity.Quiz;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    // You can add custom query methods if needed, e.g., find by difficulty or title
}
