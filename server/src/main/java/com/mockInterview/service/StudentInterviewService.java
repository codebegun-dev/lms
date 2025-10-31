package com.mockInterview.service;

import com.mockInterview.requestDtos.StudentInterviewRequestDto;
import com.mockInterview.responseDtos.QuestionBankResponseDto;
import com.mockInterview.responseDtos.StartInterviewResponseDto;
import com.mockInterview.responseDtos.StudentInterviewResponseDto;



import java.util.List;

import org.springframework.web.multipart.MultipartFile;

public interface StudentInterviewService {
	
	
	
	public StartInterviewResponseDto startInterview(StudentInterviewRequestDto requestDto);
	public QuestionBankResponseDto getNextQuestion(Long interviewId);
	public List<StudentInterviewResponseDto> getInterviewsByStudent(Long studentId);
	
	public StudentInterviewResponseDto endInterview(Long interviewId, MultipartFile videoFile, MultipartFile audioFile);


    }
