package com.mockInterview.responseDtos;

import lombok.Data;

@Data
public class StartInterviewResponseDto {
    private StudentInterviewResponseDto interview;
    private QuestionBankResponseDto firstQuestion;
}
