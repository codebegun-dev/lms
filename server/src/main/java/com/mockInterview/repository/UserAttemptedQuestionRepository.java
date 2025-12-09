package com.mockInterview.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mockInterview.entity.UserAttemptedQuestion;

import java.util.List;

@Repository
public interface UserAttemptedQuestionRepository extends JpaRepository<UserAttemptedQuestion, Long> {
    List<UserAttemptedQuestion> findByQuizAttemptAttemptId(Long attemptId);
}
