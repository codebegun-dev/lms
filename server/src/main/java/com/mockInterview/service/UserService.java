package com.mockInterview.service;

import com.mockInterview.requestDtos.LoginRequestDto;
import com.mockInterview.requestDtos.UserRequestDto;
import com.mockInterview.responseDtos.UserResponseDto;

public interface UserService {
	
public UserResponseDto createUser(UserRequestDto dto);

public UserResponseDto login(LoginRequestDto loginDto);

public String forgotPassword(String emailOrPhone);

public String resetPassword(String token, String newPassword);

}
