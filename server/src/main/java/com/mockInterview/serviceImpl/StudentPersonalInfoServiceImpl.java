package com.mockInterview.serviceImpl;

import com.mockInterview.entity.StudentPersonalInfo;
import com.mockInterview.entity.User;

import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.repository.StudentPersonalInfoRepository;
import com.mockInterview.repository.UserRepository;
import com.mockInterview.requestDtos.StudentPersonalInfoUpdateRequest;
import com.mockInterview.responseDtos.StudentPersonalInfoDto;
import com.mockInterview.service.StudentPersonalInfoService;
import com.mockInterview.util.FileStorageUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;


import java.io.IOException;


@Service
public class StudentPersonalInfoServiceImpl implements StudentPersonalInfoService {

    @Autowired
    private StudentPersonalInfoRepository infoRepository;

    @Autowired
    private UserRepository userRepository;

    
    @Override
    public StudentPersonalInfoDto updateInfo(StudentPersonalInfoUpdateRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        StudentPersonalInfo info = infoRepository.findByUser_UserId(request.getUserId());
        if (info == null) {
            info = new StudentPersonalInfo();
            info.setUser(user);
        }

        // ✅ Validate parent number is not same as student's phone
        if (request.getParentMobileNumber() != null &&
                user.getPhone() != null &&
                request.getParentMobileNumber().trim().equals(user.getPhone().trim())) {
            throw new IllegalArgumentException("Parent mobile number cannot be same as student mobile number");
        }
     // ✅ Prevent parent number from matching any other student's phone
        User existingUserWithSamePhone = userRepository.findByPhone(request.getParentMobileNumber());
        if (existingUserWithSamePhone != null && existingUserWithSamePhone.getUserId() != request.getUserId()) {
            throw new IllegalArgumentException("Parent number cannot match another student's mobile number");
        }


        // ✅ Check parent number is not used by another student
        StudentPersonalInfo existingParent = infoRepository.findByParentMobileNumber(request.getParentMobileNumber());
        if (existingParent != null && existingParent.getUser().getUserId() != request.getUserId()) {
            throw new IllegalArgumentException("Parent mobile number already used by another student");
        }


        // ✅ Update only student personal fields
        info.setSurName(request.getSurName());
        info.setGender(request.getGender());
        info.setDateOfBirth(request.getDateOfBirth());
        info.setParentMobileNumber(request.getParentMobileNumber());
        info.setBloodGroup(request.getBloodGroup());

        infoRepository.save(info);

        return mapToDto(info);
    }

    @Override
    public StudentPersonalInfoDto updateProfileImage(Long userId, MultipartFile file) {
        if (file == null || file.isEmpty()) 
            throw new IllegalArgumentException("File is empty");

        StudentPersonalInfo info = infoRepository.findByUser_UserId(userId);
        if (info == null) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            info = new StudentPersonalInfo();
            info.setUser(user);
        }

     // delete old file
        FileStorageUtil.deleteFile(info.getProfilePicturePath());

        // save new file
        String relativePath;
        try {
            relativePath = FileStorageUtil.saveFile(file, userId, "images");
            info.setProfilePicturePath(relativePath);
            infoRepository.save(info);
        } catch (IOException e) {
            throw new RuntimeException("Image upload failed");
        }

        return mapToDto(info);
    }


    @Override
    public StudentPersonalInfoDto getByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        StudentPersonalInfo info = infoRepository.findByUser_UserId(userId);

        if (info == null) { // create empty info to avoid null DTO fields
            info = new StudentPersonalInfo();
            info.setUser(user);
        }

        return mapToDto(info);
    }


    private StudentPersonalInfoDto mapToDto(StudentPersonalInfo info) {
        StudentPersonalInfoDto dto = new StudentPersonalInfoDto();

        // User fields
        dto.setUserId(info.getUser().getUserId());
        dto.setFirstName(info.getUser().getFirstName());
        dto.setLastName(info.getUser().getLastName());
        dto.setMobileNumber(info.getUser().getPhone());

        // StudentPersonalInfo fields
        dto.setSurName(info.getSurName());
        dto.setGender(info.getGender());
        dto.setDateOfBirth(info.getDateOfBirth());
        dto.setParentMobileNumber(info.getParentMobileNumber());
        dto.setBloodGroup(info.getBloodGroup());

        // Build dynamic base URL
        String baseUrl = ServletUriComponentsBuilder.fromCurrentContextPath().toUriString();

        String relativePath = info.getProfilePicturePath();
        if (relativePath != null) {
            dto.setProfilePicturePath(baseUrl + "/uploads/" + relativePath);
        } else {
            String firstLetter = "U";
            if (info.getUser().getFirstName() != null && !info.getUser().getFirstName().isEmpty()) {
                firstLetter = info.getUser().getFirstName().substring(0, 1).toUpperCase();
            }
            dto.setProfilePicturePath("https://ui-avatars.com/api/?name=" + firstLetter + "&background=random");
        }

        return dto;
    }



}
