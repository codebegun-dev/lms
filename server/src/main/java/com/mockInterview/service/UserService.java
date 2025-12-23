package com.mockInterview.service;

import java.util.List;
import java.util.Map;



import com.mockInterview.requestDtos.UserRequestDto;
import com.mockInterview.responseDtos.UserResponseDto;

public interface UserService {

    // ---------- CREATE ----------
//	public UserResponseDto createUser(UserRequestDto dto);
	
	 public UserResponseDto registerUser(UserRequestDto dto);
//    public UserResponseDto createUserByAdmin(UserRequestDto dto);

    // ---------- PASSWORD MANAGEMENT ----------
    String forgotPassword(String emailOrPhone);
    String resetPassword(String token, String newPassword);

    
    UserResponseDto getUserById(Long userId);

    public UserResponseDto updateUser(Long userId, UserRequestDto dto);

    // ---------- STATUS MANAGEMENT ----------
    public void changeUserStatus(Long userId, boolean active);
    // ---------- SPECIAL ADMIN OPERATIONS ----------
//    void syncPasswordsWithMasterAdmin();
    public UserResponseDto assignRoleToUser(Long userId, Long roleId);

    // Master Admin can bulk change user roles (JWT will be used to check)
    void bulkChangeUsersRoleByAdmin(Long fromRoleId, Long toRoleId);

    
    // ---------- UTILITY ----------
    List<UserResponseDto> getAssignableUsers();
    
    public Map<String, Object> getUsersWithCounts(int page, int size);
}
