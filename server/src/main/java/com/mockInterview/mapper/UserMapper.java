package com.mockInterview.mapper;


import com.mockInterview.entity.User;
import com.mockInterview.requestDtos.UserRequestDto;
import com.mockInterview.responseDtos.UserResponseDto;


public class UserMapper {
	
	public static User toEntity(UserRequestDto dto) {
		User user = new User();
		user.setFirstName(dto.getFirstName());
		user.setLastName(dto.getLastName());
		user.setEmail(dto.getEmail());
		user.setPhone(dto.getPhone());
		user.setPassword(dto.getPassword());
		user.setRole(dto.getRole());
		return user;
		
	}
	
	public static UserResponseDto toResponse(User user) {
		UserResponseDto response = new UserResponseDto();
		response.setUserId(user.getUserId());
		response.setFirstName(user.getFirstName());
		response.setLastName(user.getLastName());
		response.setEmail(user.getEmail());
		response.setPhone(user.getPhone());
		response.setRole(user.getRole());
		return response;
	}

}
