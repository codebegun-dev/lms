package com.mockInterview.service;


import com.mockInterview.responseDtos.StudentPersonalInfoDto;
import org.springframework.web.multipart.MultipartFile;

public interface StudentPersonalInfoService {

	public StudentPersonalInfoDto updateInfo(StudentPersonalInfoDto dto);

    StudentPersonalInfoDto updateProfileImage(Long userId, MultipartFile file);

   

    StudentPersonalInfoDto getByUserId(Long userId);
}
