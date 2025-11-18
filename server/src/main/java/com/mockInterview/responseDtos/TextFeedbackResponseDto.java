package com.mockInterview.responseDtos;

import lombok.Data;

@Data
public class TextFeedbackResponseDto {
    private Long id;
    private Long interviewId;
    private String categoryName;
    private int communicationScore;
    private int confidenceScore;
    private int categoryRoundTypeScore;
    private double overallRating;
    private String improvementSuggestions;
    private String createdAt;

    
}
