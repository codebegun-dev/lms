package com.mockInterview.service;

import java.util.List;

import com.mockInterview.requestDtos.InterviewRequestDto;
import com.mockInterview.responseDtos.InterviewResponseDto;
import com.mockInterview.responseDtos.InterviewTrackingResponse;


public interface StudentDashboardService {

    List<InterviewTrackingResponse> getFixedInterviewTracking();

    InterviewResponseDto startInterview(InterviewRequestDto dto);

    InterviewResponseDto scheduleInterview(InterviewRequestDto dto);

    List<InterviewResponseDto> getAllInterviewsByStudent(Long studentId);
}
