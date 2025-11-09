package com.mockInterview.service;

import com.mockInterview.requestDtos.RoleRequestDto;
import com.mockInterview.responseDtos.RoleResponseDto;
import java.util.List;

public interface RoleService {
    RoleResponseDto createRole(RoleRequestDto dto);
    RoleResponseDto updateRole(Long id, RoleRequestDto dto);
    void deleteRole(Long id);
    RoleResponseDto getRoleById(Long id);
    List<RoleResponseDto> getAllRoles();
}
