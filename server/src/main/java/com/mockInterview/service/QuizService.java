package com.mockInterview.service;

import com.mockInterview.requestDtos.QuizRequestDto;
import com.mockInterview.responseDtos.QuizResponseDto;

import java.util.List;

public interface QuizService {

    // ---------------- CREATE ----------------
    QuizResponseDto createQuiz(QuizRequestDto quizRequestDto);

    // ---------------- READ ----------------
    QuizResponseDto getQuizById(Long quizId);

    List<QuizResponseDto> getAllQuizzes();

    // ---------------- UPDATE ----------------
    QuizResponseDto updateQuiz(Long quizId, QuizRequestDto quizRequestDto);

    // ---------------- DELETE ----------------
    void deleteQuiz(Long quizId);
}
