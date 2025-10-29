package com.mockInterview.responseDtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EndInterviewResponseDto {
    private StudentInterviewResponseDto interviewInfo;
    private PerformanceAnalysisDto performanceMetrics;
}
