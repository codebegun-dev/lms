package com.mockInterview.serviceImpl;

import com.mockInterview.entity.StudentPersonalInfo;
import com.mockInterview.entity.User;
import com.mockInterview.exception.DuplicateFieldException;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.repository.StudentPersonalInfoRepository;
import com.mockInterview.repository.UserRepository;
import com.mockInterview.requestDtos.StudentPersonalInfoUpdateRequest;
import com.mockInterview.responseDtos.StudentPersonalInfoDto;
import com.mockInterview.service.StudentPersonalInfoService;
import com.mockInterview.util.FileStorageUtil;
import com.mockInterview.util.RoleValidator;

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
    public StudentPersonalInfoDto updateAll(StudentPersonalInfoUpdateRequest request, MultipartFile file) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        RoleValidator.validateStudentOrMasterAdmin(user);
        StudentPersonalInfo info = infoRepository.findByUser_UserId(request.getUserId());
        if (info == null) {
            info = new StudentPersonalInfo();
            info.setUser(user);
        }

        // ✅ Validation
        if (request.getParentMobileNumber() != null &&
            user.getPhone() != null &&
            request.getParentMobileNumber().trim().equals(user.getPhone().trim())) {
            throw new DuplicateFieldException("Parent mobile number cannot be same as student mobile number");
        }

        StudentPersonalInfo existingParent = infoRepository.findByParentMobileNumber(request.getParentMobileNumber());
        if (existingParent != null && existingParent.getUser().getUserId() != request.getUserId()) {
            throw new DuplicateFieldException("Parent mobile number already used by another student");
        }

        // ✅ Update details
        info.setGender(request.getGender());
        info.setDateOfBirth(request.getDateOfBirth());
        info.setParentMobileNumber(request.getParentMobileNumber());
        info.setBloodGroup(request.getBloodGroup());

        // ✅ Update profile image if file is provided
        if (file != null && !file.isEmpty()) {
            FileStorageUtil.deleteFile(info.getProfilePicturePath());
            try {
                String relativePath = FileStorageUtil.saveFile(file, request.getUserId(), "images");
                info.setProfilePicturePath(relativePath);
            } catch (IOException e) {
                throw new RuntimeException("Image upload failed");
            }
        }

        infoRepository.save(info);
        return mapToDto(info);
    }

    @Override
    public StudentPersonalInfoDto getByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        RoleValidator.validateStudentOrMasterAdmin(user);
        StudentPersonalInfo info = infoRepository.findByUser_UserId(userId);

        if (info == null) {
            info = new StudentPersonalInfo();
            info.setUser(user);
        }

        return mapToDto(info);
    }

    private StudentPersonalInfoDto mapToDto(StudentPersonalInfo info) {
        StudentPersonalInfoDto dto = new StudentPersonalInfoDto();
        dto.setUserId(info.getUser().getUserId());
        dto.setFirstName(info.getUser().getFirstName());
        dto.setLastName(info.getUser().getLastName());
        dto.setMobileNumber(info.getUser().getPhone());
        dto.setGender(info.getGender());
        dto.setDateOfBirth(info.getDateOfBirth());
        dto.setParentMobileNumber(info.getParentMobileNumber());
        dto.setBloodGroup(info.getBloodGroup());

        String baseUrl = ServletUriComponentsBuilder.fromCurrentContextPath().toUriString();
        if (info.getProfilePicturePath() != null) {
            dto.setProfilePicturePath(baseUrl + "/uploads/" + info.getProfilePicturePath());
        } else {
            String firstLetter = (info.getUser().getFirstName() != null && !info.getUser().getFirstName().isEmpty())
                    ? info.getUser().getFirstName().substring(0, 1).toUpperCase()
                    : "U";
            dto.setProfilePicturePath("https://ui-avatars.com/api/?name=" + firstLetter + "&background=random");
        }
        return dto;
    }
}
