package com.mockInterview.requestDtos;

import lombok.Data;

@Data
public class QuestionBankDto {
    private Long categoryId;
    private Long topicId;
    private Long subTopicId;
    private String difficulty;
    private String title;
    private Long createdByUserId; // ✅ send userId instead of name
}
