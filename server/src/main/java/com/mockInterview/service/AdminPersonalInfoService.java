package com.mockInterview.service;

import com.mockInterview.requestDtos.AdminPersonalInfoUpdateRequestDto;
import com.mockInterview.responseDtos.AdminPersonalInfoResponseDto;

import org.springframework.web.multipart.MultipartFile;

public interface AdminPersonalInfoService {
    AdminPersonalInfoResponseDto getByUserId(Long requestedUserId);
    AdminPersonalInfoResponseDto updateFullProfile(AdminPersonalInfoUpdateRequestDto request, MultipartFile file);
}
