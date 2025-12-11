package com.mockInterview.service;

import com.mockInterview.requestDtos.RoleRequestDto;
import com.mockInterview.responseDtos.RoleResponseDto;

import java.util.List;

public interface RoleService {
    RoleResponseDto createRole(RoleRequestDto dto);
    RoleResponseDto updateRole(Long roleId, RoleRequestDto dto);
    RoleResponseDto getRole(Long roleId);
    List<RoleResponseDto> getAllRoles();
    void deleteRole(Long roleId);
}
