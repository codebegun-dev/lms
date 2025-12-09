package com.mockInterview.service;

import com.mockInterview.requestDtos.QuestionRequestDto;
import com.mockInterview.responseDtos.QuestionResponseDto;

import java.util.List;

public interface QuestionService {

    QuestionResponseDto createQuestion(QuestionRequestDto questionRequestDto);

    QuestionResponseDto updateQuestion(Long questionId, QuestionRequestDto questionRequestDto);

    QuestionResponseDto getQuestionById(Long questionId);

    List<QuestionResponseDto> getAllQuestions();

    List<QuestionResponseDto> getQuestionsByQuizId(Long quizId);

    void deleteQuestion(Long questionId);
}
