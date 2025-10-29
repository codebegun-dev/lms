package com.mockInterview.responseDtos;

import lombok.Data;

@Data
public class AudioAnalysisResponse {
    private Long interviewId;
    private String studentName;
    private String transcript;

    private Integer technicalScore;
    private Integer hrScore;
    private Integer behavioralScore;
    private Integer communicationScore;
    private Integer confidenceScore;
    private Integer clarityScore;
    private Integer understandingScore;
    private String overallRating;
    private String aiFeedback;
    private String improvementSuggestions;
    private Integer roundScore;
    private String round;
    private String keyTopics;
    private String status;
}
