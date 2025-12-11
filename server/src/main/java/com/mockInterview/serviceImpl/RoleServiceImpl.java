package com.mockInterview.serviceImpl;

import com.mockInterview.entity.Permission;
import com.mockInterview.entity.Role;
import com.mockInterview.repository.PermissionRepository;
import com.mockInterview.repository.RoleRepository;
import com.mockInterview.requestDtos.RoleRequestDto;
import com.mockInterview.responseDtos.RoleResponseDto;
import com.mockInterview.security.SecurityUtils;
import com.mockInterview.service.RoleService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.*;
import java.util.stream.Collectors;

@Service
public class RoleServiceImpl implements RoleService {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PermissionRepository permissionRepository;

   
    @Override
    public RoleResponseDto createRole(RoleRequestDto dto) {
        Role role = new Role();
        role.setName(dto.getName());
        role.setDescription(dto.getDescription());

        Set<Permission> perms = dto.getPermissionIds().stream()
                .map(id -> permissionRepository.findById(id).orElse(null))
                .filter(p -> p != null)
                .collect(Collectors.toSet());

        role.setPermissions(perms);
        role.setCreatedBy(SecurityUtils.getCurrentUserId());


        roleRepository.save(role);

        return mapToDto(role);
    }

    private RoleResponseDto mapToDto(Role role) {
        Set<String> permNames = role.getPermissions().stream()
                .map(Permission::getName)
                .collect(Collectors.toSet());
        return new RoleResponseDto(role.getId(), role.getName(), role.getDescription(), permNames);
    }

    @Override
    public RoleResponseDto updateRole(Long roleId, RoleRequestDto dto) {
        Role role = roleRepository.findById(roleId).orElseThrow(() -> new RuntimeException("Role not found"));
        role.setName(dto.getName());
        role.setDescription(dto.getDescription());

        Set<Permission> perms = dto.getPermissionIds().stream()
                .map(id -> permissionRepository.findById(id).orElse(null))
                .filter(p -> p != null)
                .collect(Collectors.toSet());

        role.setPermissions(perms);
        role.setUpdatedBy(SecurityUtils.getCurrentUserId());

        roleRepository.save(role);
        return mapToDto(role);
    }

    @Override
    public RoleResponseDto getRole(Long roleId) {
        Role role = roleRepository.findById(roleId).orElseThrow(() -> new RuntimeException("Role not found"));
        return mapToDto(role);
    }

    @Override
    public List<RoleResponseDto> getAllRoles() {
        return roleRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public void deleteRole(Long roleId) {
        roleRepository.deleteById(roleId);
    }
}
