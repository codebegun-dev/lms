package com.mockInterview.serviceImpl;

import com.mockInterview.entity.AdminPersonalInfo;
import com.mockInterview.entity.User;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.repository.AdminPersonalInfoRepository;
import com.mockInterview.repository.UserRepository;
import com.mockInterview.requestDtos.AdminPersonalInfoUpdateRequestDto;
import com.mockInterview.responseDtos.AdminPersonalInfoResponseDto;
import com.mockInterview.service.AdminPersonalInfoService;
import com.mockInterview.util.FileStorageUtil;
import com.mockInterview.util.RoleValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;

@Service
public class AdminPersonalInfoServiceImpl implements AdminPersonalInfoService {

    @Autowired
    private AdminPersonalInfoRepository infoRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public AdminPersonalInfoResponseDto getByUserId(Long requestedUserId) {
        User currentUser = userRepository.findById(requestedUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // ✅ Check role and ownership
        RoleValidator.validateNonStudentOwnOrMaster(currentUser, requestedUserId);

        AdminPersonalInfo info = infoRepository.findByUser_UserId(requestedUserId);
        if (info == null) {
            info = new AdminPersonalInfo();
            info.setUser(currentUser);
        }

        return mapToDto(info);
    }

    @Override
    public AdminPersonalInfoResponseDto updateFullProfile(AdminPersonalInfoUpdateRequestDto request, MultipartFile file) {
        User currentUser = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // ✅ Check role and ownership
        RoleValidator.validateNonStudentOwnOrMaster(currentUser, request.getUserId());

        AdminPersonalInfo info = infoRepository.findByUser_UserId(request.getUserId());
        if (info == null) {
            info = new AdminPersonalInfo();
            info.setUser(currentUser);
        }

        // ✅ Update user fields
        currentUser.setFirstName(request.getFirstName());
        currentUser.setLastName(request.getLastName());
        currentUser.setPhone(request.getMobileNumber());
        userRepository.save(currentUser);

        // ✅ Update personal info
        info.setGender(request.getGender());
        info.setDateOfBirth(request.getDateOfBirth());
        info.setBloodGroup(request.getBloodGroup());

        // ✅ Handle profile picture
        if (file != null && !file.isEmpty()) {
            FileStorageUtil.deleteFile(info.getProfilePicturePath());
            try {
                String relativePath = FileStorageUtil.saveFile(file, currentUser.getUserId(), "images");
                info.setProfilePicturePath(relativePath);
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload image: " + e.getMessage());
            }
        }

        infoRepository.save(info);
        return mapToDto(info);
    }

    // ======= Helper method =======
    private AdminPersonalInfoResponseDto mapToDto(AdminPersonalInfo info) {
        AdminPersonalInfoResponseDto dto = new AdminPersonalInfoResponseDto();
        dto.setUserId(info.getUser().getUserId());
        dto.setFirstName(info.getUser().getFirstName());
        dto.setLastName(info.getUser().getLastName());
        dto.setEmail(info.getUser().getEmail());
        dto.setPhone(info.getUser().getPhone());
        dto.setGender(info.getGender());
        dto.setDateOfBirth(info.getDateOfBirth());
        dto.setBloodGroup(info.getBloodGroup());

        String baseUrl = ServletUriComponentsBuilder.fromCurrentContextPath().toUriString();
        if (info.getProfilePicturePath() != null) {
            dto.setProfilePicturePath(baseUrl + "/uploads/" + info.getProfilePicturePath());
        } else {
            String initials = (dto.getFirstName() != null && !dto.getFirstName().isEmpty())
                    ? info.getUser().getFirstName()
.substring(0, 1).toUpperCase()
                    : "A";
            dto.setProfilePicturePath("https://ui-avatars.com/api/?name=" + initials + "&background=random");
        }

        return dto;
    }
}
