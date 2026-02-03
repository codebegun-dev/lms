package com.mockInterview.service;

import com.mockInterview.entity.StudentGenericDetails;
import com.mockInterview.responseDtos.StudentGenericDetailsResponseDto;

import org.springframework.web.multipart.MultipartFile;

public interface StudentGenericDetailsService {

	public StudentGenericDetailsResponseDto updateStudentGenericDetails(
            Long userId,
            StudentGenericDetails request,
            MultipartFile adhaarFile,
            MultipartFile resumeFile);
	
	 public StudentGenericDetailsResponseDto getByUserId(Long userId);

    
}
