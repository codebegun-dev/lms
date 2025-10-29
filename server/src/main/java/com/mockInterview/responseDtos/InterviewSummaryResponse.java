package com.mockInterview.responseDtos;

import lombok.Data;

@Data
public class InterviewSummaryResponse {
    private Long interviewId;
    private String studentName;
    private String round;
    private Integer communicationScore;
    private Integer confidenceScore;
    private Integer clarityScore;
    private String overallRating;
    private String aiFeedback;
    private String improvementSuggestions;
    private String status;
}
