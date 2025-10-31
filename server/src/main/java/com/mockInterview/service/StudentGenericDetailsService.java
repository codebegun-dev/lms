package com.mockInterview.service;

import com.mockInterview.responseDtos.StudentGenericDetailsDto;
import org.springframework.web.multipart.MultipartFile;

public interface StudentGenericDetailsService {

    StudentGenericDetailsDto updateGenericDetails(StudentGenericDetailsDto dto);

    StudentGenericDetailsDto uploadDocument(Long userId, String documentType, MultipartFile file);

    StudentGenericDetailsDto getGenericDetails(Long userId);
}
