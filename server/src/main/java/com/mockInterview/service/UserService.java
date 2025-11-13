package com.mockInterview.service;

import java.util.List;

import com.mockInterview.requestDtos.LoginRequestDto;
import com.mockInterview.requestDtos.UserRequestDto;
import com.mockInterview.requestDtos.UserUpdateRequestDto;
import com.mockInterview.responseDtos.UserResponseDto;

public interface UserService {
	
	UserResponseDto createUser(UserRequestDto dto);

	

public UserResponseDto login(LoginRequestDto loginDto);

public String forgotPassword(String emailOrPhone);

public String resetPassword(String token, String newPassword);

List<UserResponseDto> getAllActiveUsers();
public List<UserResponseDto> getAllUsersWithStatus();

UserResponseDto getUserById(Long userId);

UserResponseDto updateUser(Long userId, UserUpdateRequestDto dto);

void deactivateUser(Long userId);
void activateUser(Long userId);
public void deleteUser(Long userId);

public void syncPasswordsWithMasterAdmin();


}
