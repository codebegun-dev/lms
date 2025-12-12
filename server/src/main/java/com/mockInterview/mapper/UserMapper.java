package com.mockInterview.mapper;

import com.mockInterview.entity.Role;
import com.mockInterview.entity.StudentPersonalInfo;
import com.mockInterview.entity.User;
import com.mockInterview.repository.RoleRepository;
import com.mockInterview.repository.StudentPersonalInfoRepository;
import com.mockInterview.responseDtos.UserResponseDto;
import com.mockInterview.requestDtos.UserRequestDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@Component
public class UserMapper {

    @Autowired
    private StudentPersonalInfoRepository studentPersonalInfoRepository;

    @Autowired
    private RoleRepository roleRepository;

    /**
     * Convert DTO to Entity (for both create and update)
     * @param dto UserRequestDto
     * @param isPublicStudent true if registration is public/student
     * @return User entity
     */
    public User toEntity(UserRequestDto dto, boolean isPublicStudent) {
        User user = new User();
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setPassword(dto.getPassword());

        Role role;
        if (isPublicStudent) {
            // Public registration → STUDENT role
            role = roleRepository.findByName("STUDENT");
            if (role == null) throw new RuntimeException("STUDENT role not initialized");
        } else {
            // Admin registration → can choose role, default STUDENT
            if (dto.getRoleId() != null) {
                role = roleRepository.findById(dto.getRoleId())
                        .orElseThrow(() -> new RuntimeException("Role not found with id " + dto.getRoleId()));
            } else {
                role = roleRepository.findByName("STUDENT");
                if (role == null) throw new RuntimeException("Default STUDENT role not initialized");
            }
        }

        user.setRole(role);
        return user;
    }

    /**
     * Convert User entity to Response DTO
     */
    public UserResponseDto toResponse(User user) {
        UserResponseDto dto = new UserResponseDto();
        dto.setUserId(user.getUserId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setRole(user.getRole() != null ? user.getRole().getName() : null);
        dto.setStatus(user.getStatus());

        // Auditing fields
        dto.setCreatedBy(user.getCreatedBy());
        dto.setUpdatedBy(user.getUpdatedBy());
        dto.setCreatedDate(user.getCreatedDate());
        dto.setUpdatedDate(user.getUpdatedDate());

        // Profile picture logic
        String baseUrl = ServletUriComponentsBuilder.fromCurrentContextPath().toUriString();
        StudentPersonalInfo info = studentPersonalInfoRepository.findByUser_UserId(user.getUserId());

        if (info != null && info.getProfilePicturePath() != null) {
            dto.setProfilePicturePath(baseUrl + "/uploads/" + info.getProfilePicturePath());
        } else {
            String firstLetter = user.getFirstName() != null ? user.getFirstName().substring(0, 1).toUpperCase() : "U";
            dto.setProfilePicturePath("https://ui-avatars.com/api/?name=" + firstLetter + "&background=random");
        }

        return dto;
    }
}
