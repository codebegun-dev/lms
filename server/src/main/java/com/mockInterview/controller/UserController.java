package com.mockInterview.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.mockInterview.requestDtos.ForgotPasswordDto;
import com.mockInterview.requestDtos.ResetPasswordDto;
import com.mockInterview.requestDtos.UserRequestDto;
import com.mockInterview.responseDtos.UserResponseDto;
import com.mockInterview.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

 // -------- SINGLE API FOR BOTH PUBLIC STUDENT + MASTER_ADMIN USER CREATION --------
    @PostMapping("/register")
    public UserResponseDto registerUser(@Valid @RequestBody UserRequestDto dto) {
        
        return userService.createUser(dto);
    }



    // ================= UPDATE USER =================  
    @PreAuthorize("hasAuthority('UPDATE_USER')")
    @PutMapping("/{userId}")
    public UserResponseDto updateUser(
            @PathVariable Long userId,
            @Valid @RequestBody UserRequestDto dto) {
        return userService.updateUser(userId, dto);
    }

    // ================= ASSIGN ROLE =================
    @PreAuthorize("hasAuthority('ASSIGN_ROLE')")
    @PutMapping("/{userId}/assign-role/{roleId}")
    public UserResponseDto assignRoleToUser(
            @PathVariable Long userId,
            @PathVariable Long roleId) {
        return userService.assignRoleToUser(userId, roleId);
    }

    // ================= ACTIVATE / DEACTIVATE =================
    @PreAuthorize("hasAuthority('ACTIVATE_USER')")
    @PutMapping("/{userId}/activate")
    public void activateUser(@PathVariable Long userId) {
        userService.activateUser(userId);
    }

    @PreAuthorize("hasAuthority('DEACTIVATE_USER')")
    @PutMapping("/{userId}/deactivate")
    public void deactivateUser(@PathVariable Long userId) {
        userService.deactivateUser(userId);
    }

    // ================= DELETE USER =================
    @PreAuthorize("hasAuthority('DELETE_USER')")
    @DeleteMapping("/{userId}")
    public void deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
    }

    // ================= GET USERS =================
    @PreAuthorize("hasAuthority('VIEW_USERS')")
    @GetMapping
    public List<UserResponseDto> getAllUsers() {
        return userService.getAllUsersWithStatus();
    }

    @PreAuthorize("hasAuthority('VIEW_ACTIVE_USERS')")
    @GetMapping("/active")
    public List<UserResponseDto> getAllActiveUsers() {
        return userService.getAllActiveUsers();
    }

    @PreAuthorize("hasAuthority('VIEW_USER')")
    @GetMapping("/{userId}")
    public UserResponseDto getUserById(@PathVariable Long userId) {
        return userService.getUserById(userId);
    }

    // ================= DASHBOARD =================
    @PreAuthorize("hasAuthority('VIEW_DASHBOARD')")
    @GetMapping("/dashboard")
    public Map<String, Object> getDashboardCounts() {
        return userService.getDashboardCounts();
    }

    // ================= ASSIGNABLE USERS =================
    @PreAuthorize("hasAuthority('VIEW_ASSIGNABLE_USERS')")
    @GetMapping("/assignable")
    public List<UserResponseDto> getAssignableUsers() {
        return userService.getAssignableUsers();
    }

    // ================= BULK ROLE CHANGE =================
    @PreAuthorize("hasAuthority('BULK_CHANGE_ROLE')")
    @PutMapping("/bulk-role-change")
    public void bulkChangeUsersRole(
            @RequestParam Long fromRoleId,
            @RequestParam Long toRoleId) {
        userService.bulkChangeUsersRoleByAdmin(fromRoleId, toRoleId);
    }

 // ================= FORGOT PASSWORD =================
    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestBody ForgotPasswordDto dto) {
        return userService.forgotPassword(dto.getEmailOrPhone());
    }

    // ================= RESET PASSWORD =================
    @PostMapping("/reset-password")
    public String resetPassword(@RequestBody ResetPasswordDto dto) {
        return userService.resetPassword(dto.getToken(), dto.getNewPassword());
    }

}
