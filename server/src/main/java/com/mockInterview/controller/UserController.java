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
import com.mockInterview.requestDtos.UserUpdateRequestDto;
import com.mockInterview.responseDtos.UserResponseDto;
import com.mockInterview.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    // ---------------- Single User Creation ----------------
    @PostMapping
    public UserResponseDto createUser(@Valid @RequestBody UserRequestDto dto) {
        return userService.createUser(dto);
    }

    

    // ---------------- Login ----------------
    @PostMapping("/login")
    public UserResponseDto login(@Valid @RequestBody LoginRequestDto loginDto) {
        return userService.login(loginDto);
    }

    // ---------------- Forgot Password ----------------
    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestBody ForgotPasswordDto dto) {
        return userService.forgotPassword(dto.getEmailOrPhone());
    }

    // ---------------- Reset Password ----------------
    @PostMapping("/reset-password")
    public String resetPassword(@RequestBody ResetPasswordDto dto) {
        return userService.resetPassword(dto.getToken(), dto.getNewPassword());
    }

    // ---------------- Get Users ----------------
    @GetMapping("/active/all")
    public List<UserResponseDto> getAllActiveUsers() {
        return userService.getAllActiveUsers();
    }

    @GetMapping("/all")
    public List<UserResponseDto> getAllUsersWithStatus() {
        return userService.getAllUsersWithStatus();
    }

    @GetMapping("/{userId}")
    public UserResponseDto getUserById(@PathVariable Long userId) {
        return userService.getUserById(userId);
    }

    // ---------------- Update User ----------------
    @PutMapping("/update/{userId}")
    public UserResponseDto updateUser(@PathVariable Long userId, @Valid @RequestBody UserUpdateRequestDto dto) {
        return userService.updateUser(userId, dto);
    }

    // ---------------- Deactivate / Activate User ----------------
    @DeleteMapping("/deactivate/{userId}")
    public String deactivateUser(@PathVariable Long userId) {
        userService.deactivateUser(userId);
        return "User deactivated successfully";
    }

    @PutMapping("/activate/{userId}")
    public String activateUser(@PathVariable Long userId) {
        userService.activateUser(userId);
        return "User activated successfully";
    }

    // ---------------- Delete User ----------------
    @DeleteMapping("/delete/{userId}")
    public String deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return "User deleted successfully";
    }

    // ---------------- Sync Master Admin Password ----------------
    @PutMapping("/sync-passwords")
    public String syncPasswords() {
        userService.syncPasswordsWithMasterAdmin();
        return "✅ All non-student users' passwords synced with Master Admin password successfully.";
    }
}
