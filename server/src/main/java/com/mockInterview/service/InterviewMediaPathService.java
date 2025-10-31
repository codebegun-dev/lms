package com.mockInterview.service;

import com.mockInterview.requestDtos.InterviewMediaPathRequestDto;
import com.mockInterview.responseDtos.InterviewMediaPathDto;

public interface InterviewMediaPathService {

	public InterviewMediaPathDto saveMediaPath(InterviewMediaPathRequestDto requestDto);

	public InterviewMediaPathDto getMediaPathByInterviewId(Long interviewId);
}
