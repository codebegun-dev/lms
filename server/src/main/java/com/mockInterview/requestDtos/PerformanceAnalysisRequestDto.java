package com.mockInterview.requestDtos;

import lombok.Data;

@Data
public class PerformanceAnalysisRequestDto {
    private Long interviewId;

    // Round-specific scores
    private Integer technicalScore;
    private Integer hrScore;
    private Integer behavioralScore;

    // Universal score
    private Integer communicationScore;

    private Integer confidenceScore;
    private Integer clarityScore;
    private Integer understandingScore;
    private String overallRating;
    private String aiFeedback;
    private String improvementSuggestions;
}
