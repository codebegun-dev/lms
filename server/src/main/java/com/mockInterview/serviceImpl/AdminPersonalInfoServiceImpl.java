package com.mockInterview.serviceImpl;

import com.mockInterview.entity.AdminPersonalInfo;
import com.mockInterview.entity.User;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.repository.AdminPersonalInfoRepository;
import com.mockInterview.repository.SalesCourseManagementRepository;
import com.mockInterview.repository.StudentPersonalInfoRepository;
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
    
    @Autowired
    private StudentPersonalInfoRepository studentPersonalInfoRepository;
    
    @Autowired
     private SalesCourseManagementRepository  salesCourseManagementRepository;
    // ---------------------------------------------------------------------
    // 🔥 GET BY USER ID → ONLY NON-STUDENTS CAN VIEW
    // ---------------------------------------------------------------------
    @Override
    public AdminPersonalInfoResponseDto getByUserId(Long requestedUserId) {

        User requestedUser = userRepository.findById(requestedUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // ❌ BLOCK STUDENTS
        if (requestedUser.getRole().getName().equalsIgnoreCase("STUDENT")) {
            throw new RuntimeException("Students cannot access admin personal information!");
        }

        // Allow master admin or self access
        RoleValidator.validateNonStudentOwnOrMaster(requestedUser, requestedUserId);

        AdminPersonalInfo info = infoRepository.findByUser_UserId(requestedUserId);

        // If record not exists → create template
        if (info == null) {
            info = new AdminPersonalInfo();
            info.setUser(requestedUser);
        }

        return mapToDto(info);
    }

    // ---------------------------------------------------------------------
    // 🔥 UPDATE FULL PROFILE → ONLY NON-STUDENTS CAN UPDATE
    // ---------------------------------------------------------------------
    @Override
    public AdminPersonalInfoResponseDto updateFullProfile(AdminPersonalInfoUpdateRequestDto request,
                                                          MultipartFile file) {

        User requestedUser = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // ❌ Block STUDENTS from updating admin info
        if (requestedUser.getRole().getName().equalsIgnoreCase("STUDENT")) {
            throw new RuntimeException("Students are not allowed to update admin personal information!");
        }

        // Allow Master Admin or Self-Update
        RoleValidator.validateNonStudentOwnOrMaster(requestedUser, request.getUserId());

        // ============================
        // 🔍 VALIDATE MOBILE NUMBER
        // ============================

        if (request.getMobileNumber() != null && !request.getMobileNumber().isEmpty()) {

            // 1️⃣ Check in USER table (avoid conflict with other users)
            User mobileUser = userRepository.findByPhone(request.getMobileNumber());
            if (mobileUser != null && mobileUser.getUserId() != request.getUserId()) {
                throw new RuntimeException("Mobile number already exists in User table!");
            }



            // 2️⃣ Check in StudentPersonalInfo parent mobile
            if (studentPersonalInfoRepository.findByParentMobileNumber(request.getMobileNumber()) != null) {
                throw new RuntimeException("Mobile number already exists as Parent Mobile!");
            }

            // 3️⃣ Check in SalesCourseManagement table
            if (salesCourseManagementRepository.findByPhone(request.getMobileNumber()) != null) {
                throw new RuntimeException("Mobile number already exists in Sales table!");
            }
        }

        // ============================
        // Get or create AdminPersonalInfo
        // ============================
        AdminPersonalInfo info = infoRepository.findByUser_UserId(request.getUserId());
        if (info == null) {
            info = new AdminPersonalInfo();
            info.setUser(requestedUser);
        }

        // ============================
        // UPDATE USER TABLE FIELDS
        // ============================
        requestedUser.setFirstName(request.getFirstName());
        requestedUser.setLastName(request.getLastName());
        requestedUser.setPhone(request.getMobileNumber());
        userRepository.save(requestedUser);

        // ============================
        // UPDATE ADMIN PERSONAL INFO
        // ============================
        info.setGender(request.getGender());
        info.setDateOfBirth(request.getDateOfBirth());
        info.setBloodGroup(request.getBloodGroup());
        info.setJobtitle(request.getJobTitle());

        // ============================
        // UPDATE PROFILE PICTURE
        // ============================
        if (file != null && !file.isEmpty()) {
            FileStorageUtil.deleteFile(info.getProfilePicturePath());
            try {
                String relativePath = FileStorageUtil.saveFile(file, requestedUser.getUserId(), "images");
                info.setProfilePicturePath(relativePath);
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload profile image: " + e.getMessage());
            }
        }

        infoRepository.save(info);
        return mapToDto(info);
    }


    // ---------------------------------------------------------------------
    // 🔥 DTO MAPPER
    // ---------------------------------------------------------------------
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

        String baseUrl = ServletUriComponentsBuilder.fromCurrentContextPath().toUriString();

        if (info.getProfilePicturePath() != null) {
            dto.setProfilePicturePath(baseUrl + "/uploads/" + info.getProfilePicturePath());
        } else {
            String initials = (dto.getFirstName() != null && !dto.getFirstName().isEmpty())
                    ? dto.getFirstName().substring(0, 1).toUpperCase()
                    : "A";

            dto.setProfilePicturePath("https://ui-avatars.com/api/?name=" + initials + "&background=random");
        }

        return dto;
    }
}
