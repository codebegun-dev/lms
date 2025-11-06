package com.mockInterview.mapper;

import com.mockInterview.entity.StudentPersonalInfo;
import com.mockInterview.entity.User;
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

    public User toEntity(UserRequestDto dto) {
        User user = new User();
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setPassword(dto.getPassword());
        user.setRole(dto.getRole());
        return user;
    }

    public UserResponseDto toResponse(User user) {
        UserResponseDto dto = new UserResponseDto();
        dto.setUserId(user.getUserId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setRole(user.getRole());
        dto.setStatus(user.getStatus());

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
