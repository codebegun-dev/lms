package com.mockInterview.service;

import com.mockInterview.requestDtos.PerformanceAnalysisRequestDto;
import com.mockInterview.responseDtos.PerformanceAnalysisDto;

public interface PerformanceAnalysisService {

    PerformanceAnalysisDto savePerformanceAnalysis(PerformanceAnalysisRequestDto requestDto);

    PerformanceAnalysisDto getPerformanceAnalysisByInterview(Long interviewId);
}
