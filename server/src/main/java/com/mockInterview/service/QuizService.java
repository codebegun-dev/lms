package com.mockInterview.service;

import com.mockInterview.requestDtos.QuizRequestDto;
import com.mockInterview.responseDtos.QuizResponseDto;

import java.util.List;

public interface QuizService {

    // Create a new quiz
    QuizResponseDto createQuiz(QuizRequestDto quizRequestDto);

    // Update an existing quiz
    QuizResponseDto updateQuiz(Long quizId, QuizRequestDto quizRequestDto);

    // Get a quiz by ID
    QuizResponseDto getQuizById(Long quizId);

    // Delete a quiz by ID
   void deleteQuiz(Long quizId);

    // Get all quizzes
    List<QuizResponseDto> getAllQuizzes();

    // Optional: Publish quiz
    QuizResponseDto publishQuiz(Long quizId, Long updatedBy);
}
