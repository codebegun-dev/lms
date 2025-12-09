package com.mockInterview.repository;

import com.mockInterview.entity.QuizQuestions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizQuestionsRepository extends JpaRepository<QuizQuestions, Long> {
    
   
	List<QuizQuestions> findByQuiz_QuizId(Long quizId);
 
}
