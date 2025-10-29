package com.mockInterview.responseDtos;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PerformanceAnalysisDto {
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
    private LocalDateTime analyzedAt;
}
