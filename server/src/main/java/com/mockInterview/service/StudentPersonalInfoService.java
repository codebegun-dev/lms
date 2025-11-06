package com.mockInterview.service;


import com.mockInterview.requestDtos.StudentPersonalInfoUpdateRequest;
import com.mockInterview.responseDtos.StudentPersonalInfoDto;
import org.springframework.web.multipart.MultipartFile;

public interface StudentPersonalInfoService {

	public StudentPersonalInfoDto updateInfo(StudentPersonalInfoUpdateRequest request);

    StudentPersonalInfoDto updateProfileImage(Long userId, MultipartFile file);

   

    StudentPersonalInfoDto getByUserId(Long userId);
}
