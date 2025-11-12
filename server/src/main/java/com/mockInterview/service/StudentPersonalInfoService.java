package com.mockInterview.service;

import org.springframework.web.multipart.MultipartFile;
import com.mockInterview.requestDtos.StudentPersonalInfoUpdateRequest;
import com.mockInterview.responseDtos.StudentPersonalInfoDto;

public interface StudentPersonalInfoService {
    StudentPersonalInfoDto getByUserId(Long userId);
    StudentPersonalInfoDto updateAll(StudentPersonalInfoUpdateRequest request, MultipartFile file); // combined update
}
