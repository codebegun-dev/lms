package com.mockInterview.serviceImpl;

import com.mockInterview.entity.AdminPersonalInfo;
import com.mockInterview.entity.User;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.exception.UnauthorizedActionException;
import com.mockInterview.repository.AdminPersonalInfoRepository;
import com.mockInterview.repository.UserRepository;
import com.mockInterview.requestDtos.AdminPersonalInfoUpdateRequestDto;
import com.mockInterview.responseDtos.AdminPersonalInfoResponseDto;
import com.mockInterview.service.AdminPersonalInfoService;
import com.mockInterview.util.FileStorageUtil;

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

    // ==========================
    // GET ADMIN INFO BY USER ID
    // ==========================
    @Override
    public AdminPersonalInfoResponseDto getByUserId(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Block STUDENT role
        RoleValidator.validateNonStudentAccess(user);

        // MASTER_ADMIN cannot access their own admin info
        if ("MASTER_ADMIN".equalsIgnoreCase(user.getRole().getName())) {
            throw new UnauthorizedActionException("MASTER_ADMIN cannot access their own admin info!");
        }

        AdminPersonalInfo info = infoRepository.findByUser_UserId(userId);
        if (info == null) {
            info = new AdminPersonalInfo();
            info.setUser(user);
        }

        return mapToDto(info);
    }

    // ==========================
    // UPDATE ADMIN INFO
    // ==========================
    @Override
    public AdminPersonalInfoResponseDto updateFullProfile(AdminPersonalInfoUpdateRequestDto request,
                                                          MultipartFile file) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Block STUDENT role
        RoleValidator.validateNonStudentAccess(user);

        // MASTER_ADMIN cannot update their own admin info
        if ("MASTER_ADMIN".equalsIgnoreCase(user.getRole().getName())) {
            throw new UnauthorizedActionException("MASTER_ADMIN cannot update their own admin info!");
        }

        // Non-student users can update their own info
        // MASTER_ADMIN can update other non-student users
        if (!"MASTER_ADMIN".equalsIgnoreCase(user.getRole().getName())) {
            if (user.getUserId()!=(request.getUserId())) {
                throw new UnauthorizedActionException("You can only update your own admin info!");
            }
        }

        // -----------------------
        // Update User table
        // -----------------------
        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        if (request.getMobileNumber() != null) user.setPhone(request.getMobileNumber());
        userRepository.save(user);

        // -----------------------
        // Update AdminPersonalInfo table
        // -----------------------
        AdminPersonalInfo info = infoRepository.findByUser_UserId(user.getUserId());
        if (info == null) {
            info = new AdminPersonalInfo();
            info.setUser(user);
        }

        info.setGender(request.getGender());
        info.setDateOfBirth(request.getDateOfBirth());
        info.setBloodGroup(request.getBloodGroup());
        info.setJobtitle(request.getJobTitle());

        // -----------------------
        // Upload profile picture
        // -----------------------
        if (file != null && !file.isEmpty()) {
            FileStorageUtil.deleteFile(info.getProfilePicturePath());
            try {
                String relativePath = FileStorageUtil.saveFile(file, user.getUserId(), "images");
                info.setProfilePicturePath(relativePath);
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload profile picture: " + e.getMessage());
            }
        }

        infoRepository.save(info);
        return mapToDto(info);
    }

    // ==========================
    // DTO Mapper
    // ==========================
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
        dto.setJobTitle(info.getJobtitle());

        String baseUrl = ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString();
        if (info.getProfilePicturePath() != null) {
            dto.setProfilePicturePath(baseUrl + "/uploads/" + info.getProfilePicturePath());
        } else {
            String initials = (info.getUser().getFirstName() != null && !info.getUser().getFirstName().isEmpty())
                    ? info.getUser().getFirstName().substring(0, 1).toUpperCase()
                    : "A";
            dto.setProfilePicturePath("https://ui-avatars.com/api/?name=" + initials + "&background=random");
        }

        return dto;
    }
}
