package com.mockInterview.service;

import com.mockInterview.responseDtos.StudentGenericDetailsDto;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface StudentGenericDetailsService {

    StudentGenericDetailsDto updateGenericDetails(StudentGenericDetailsDto dto);

    public StudentGenericDetailsDto uploadDocument(Long userId, MultipartFile file);
    StudentGenericDetailsDto getGenericDetails(Long userId);
    public Resource viewDocument(Long userId);
}
