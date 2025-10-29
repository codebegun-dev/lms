package com.mockInterview.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import com.mockInterview.requestDtos.ForgotPasswordDto;
import com.mockInterview.requestDtos.LoginRequestDto;
import com.mockInterview.requestDtos.ResetPasswordDto;
import com.mockInterview.requestDtos.UserRequestDto;
import com.mockInterview.responseDtos.UserResponseDto;
import com.mockInterview.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {
	
@Autowired
UserService userService;

	@PostMapping 
	public UserResponseDto createUser(@Valid @RequestBody UserRequestDto dto) {
		return userService.createUser(dto);
	}
	
	@PostMapping("/login")
	public UserResponseDto login(@Valid @RequestBody LoginRequestDto loginDto) {
	    return userService.login(loginDto);
	}

	@PostMapping("/forgot-password")
	public String forgotPassword(@RequestBody ForgotPasswordDto dto) {
	    return userService.forgotPassword(dto.getEmailOrPhone());
	}

	
	@PostMapping("/reset-password")
	public String resetPassword(@RequestBody ResetPasswordDto dto) {
	    return userService.resetPassword(dto.getToken(), dto.getNewPassword());
	}

	
	@GetMapping("/all")
    public List<UserResponseDto> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{userId}")
    public UserResponseDto getUserById(@PathVariable Long userId) {
        return userService.getUserById(userId);
    }

    @PutMapping("/update/{userId}")
    public UserResponseDto updateUser(@PathVariable Long userId, @Valid @RequestBody UserRequestDto dto) {
        return userService.updateUser(userId, dto);
    }

    @DeleteMapping("/delete/{userId}")
    public String deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return "User deleted successfully";
    }

}
