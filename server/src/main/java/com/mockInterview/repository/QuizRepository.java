package com.mockInterview.repository;

import com.mockInterview.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {

    // Optional custom methods (use when needed later)

    // Find quizzes by type (PUBLIC / PRIVATE)
    // List<Quiz> findByQuizType(String quizType);

    // Find quizzes by topic
    // List<Quiz> findByTopic_Id(Long topicId);

}
