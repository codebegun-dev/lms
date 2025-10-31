package com.mockInterview.service;

import com.mockInterview.requestDtos.StudentInterviewRequestDto;

import com.mockInterview.responseDtos.InterviewSummaryResponse;
import com.mockInterview.responseDtos.StudentInterviewResponseDto;
import org.springframework.web.multipart.MultipartFile;


import java.util.List;

public interface StudentInterviewService {

    StudentInterviewResponseDto startInterview(StudentInterviewRequestDto requestDto);

    List<StudentInterviewResponseDto> getInterviewsByStudent(Long studentId);

    StudentInterviewResponseDto completeInterview(Long interviewId);

    // End interview and process AI analysis
    public InterviewSummaryResponse endInterview(Long interviewId, MultipartFile audioFile, MultipartFile videoFile);
}
