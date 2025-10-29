package com.mockInterview.service;

import com.mockInterview.requestDtos.QuestionBankDto;
import com.mockInterview.responseDtos.QuestionBankResponseDto;

import java.util.List;

public interface QuestionBankService {
    QuestionBankResponseDto addQuestion(QuestionBankDto dto);
    QuestionBankResponseDto updateQuestion(Long id, QuestionBankDto dto);
    void deleteQuestion(Long id);
    List<QuestionBankResponseDto> getAllQuestions();
    List<QuestionBankResponseDto> searchQuestions(String keyword);
}
