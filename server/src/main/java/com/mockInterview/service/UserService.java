package com.mockInterview.service;

import java.util.List;

import com.mockInterview.requestDtos.LoginRequestDto;
import com.mockInterview.requestDtos.UserRequestDto;
import com.mockInterview.responseDtos.UserResponseDto;

public interface UserService {
	
public UserResponseDto createUser(UserRequestDto dto);

public UserResponseDto login(LoginRequestDto loginDto);

public String forgotPassword(String emailOrPhone);

public String resetPassword(String token, String newPassword);

List<UserResponseDto> getAllUsers();

UserResponseDto getUserById(Long userId);

UserResponseDto updateUser(Long userId, UserRequestDto dto);

void deleteUser(Long userId);

}
