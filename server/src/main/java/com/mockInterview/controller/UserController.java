package com.mockInterview.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.mockInterview.requestDtos.ForgotPasswordDto;
import com.mockInterview.requestDtos.ResetPasswordDto;
import com.mockInterview.requestDtos.UserRequestDto;
import com.mockInterview.responseDtos.UserResponseDto;
import com.mockInterview.security.annotations.ModulePermission;
import com.mockInterview.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
@ModulePermission("USER_MANAGEMENT")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;
    
    @Value("${pagination.default-page-size}")
    private int defaultPageSize;


    // ================= REGISTER USER (PUBLIC + MASTER_ADMIN) =================
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

    // ================= ACTIVATE / DEACTIVATE (SINGLE API) =================
    @PreAuthorize("hasAuthority('TOGGLE_USER_STATUS')")
    @PutMapping("/{userId}/status")
    public void changeUserStatus(
            @PathVariable Long userId,
            @RequestParam boolean active) {
        userService.changeUserStatus(userId, active);
    }

    /// ================= GET USERS (ACTIVE FIRST + PAGINATION + COUNTS) =================
    @PreAuthorize("hasAuthority('VIEW_USERS')")
    @GetMapping
    public Map<String, Object> getUsersWithCounts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) Integer size) {

        // 🔹 If size not provided in request → use application.properties value
        int pageSize = (size != null) ? size : defaultPageSize;

        return userService.getUsersWithCounts(page, pageSize);
    }


    // ================= GET USER BY ID =================
    @PreAuthorize("hasAuthority('VIEW_USER')")
    @GetMapping("/{userId}")
    public UserResponseDto getUserById(@PathVariable Long userId) {
        return userService.getUserById(userId);
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
