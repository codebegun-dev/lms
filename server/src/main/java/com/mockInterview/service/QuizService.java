package com.mockInterview.service;

import java.util.List;

import com.mockInterview.requestDtos.QuizRequestDto;
import com.mockInterview.responseDtos.QuizResponseDto;

public interface QuizService {

    QuizResponseDto createQuiz(QuizRequestDto quizRequestDto);

    QuizResponseDto updateQuiz(Long id, QuizRequestDto quizRequestDto);

    void deleteQuiz(Long id);

    QuizResponseDto getQuizById(Long id);

    List<QuizResponseDto> getAllQuizzes();
}
