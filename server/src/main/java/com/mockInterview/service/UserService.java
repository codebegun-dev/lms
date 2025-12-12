package com.mockInterview.service;

import java.util.List;
import java.util.Map;

import com.mockInterview.requestDtos.UserRequestDto;
import com.mockInterview.responseDtos.UserResponseDto;

public interface UserService {

    // ---------- CREATE ----------
	public UserResponseDto createUser(UserRequestDto dto);

    // ---------- PASSWORD MANAGEMENT ----------
    String forgotPassword(String emailOrPhone);
    String resetPassword(String token, String newPassword);

    // ---------- USER RETRIEVAL ----------
    List<UserResponseDto> getAllActiveUsers();
    List<UserResponseDto> getAllUsersWithStatus();
    UserResponseDto getUserById(Long userId);

    public UserResponseDto updateUser(Long userId, UserRequestDto dto);

    // ---------- STATUS MANAGEMENT ----------
    void deactivateUser(Long userId);
    void activateUser(Long userId);
    void deleteUser(Long userId);

    // ---------- SPECIAL ADMIN OPERATIONS ----------
    void syncPasswordsWithMasterAdmin();
    public UserResponseDto assignRoleToUser(Long userId, Long roleId);

    // Master Admin can bulk change user roles (JWT will be used to check)
    void bulkChangeUsersRoleByAdmin(Long fromRoleId, Long toRoleId);

    // ---------- DASHBOARD ----------
    Map<String, Object> getDashboardCounts();

    // ---------- UTILITY ----------
    List<UserResponseDto> getAssignableUsers();
}
