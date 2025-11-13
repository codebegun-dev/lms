package com.mockInterview.serviceImpl;

import com.mockInterview.entity.Role;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.repository.RoleRepository;
import com.mockInterview.requestDtos.RoleRequestDto;
import com.mockInterview.requestDtos.AdminAuthDto;
import com.mockInterview.responseDtos.RoleResponseDto;
import com.mockInterview.service.RoleService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class RoleServiceImpl implements RoleService {

    @Autowired
    private RoleRepository roleRepository;

    @Value("${master.admin.email}")
    private String MASTER_ADMIN_EMAIL;

    @Value("${master.admin.password}")
    private String MASTER_ADMIN_PASSWORD;

    // -------------------- CREATE ROLE --------------------
    @Override
    public RoleResponseDto createRole(RoleRequestDto dto) {
        validateAdmin(dto.getAdminAuth());

        if (roleRepository.findByName(dto.getName()) != null) {
            throw new RuntimeException("Role with this name already exists!");
        }

        Role role = new Role();
        role.setName(dto.getName());
        role.setPermissions(dto.getPermissions() != null ? String.join(",", dto.getPermissions()) : "");
        Role saved = roleRepository.save(role);
        return toResponse(saved);
    }

 // -------------------- UPDATE ROLE --------------------
    @Override
    public RoleResponseDto updateRole(Long id, RoleRequestDto dto) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));

        // ❌ Prevent editing STUDENT or MASTER_ADMIN role
        if ("STUDENT".equalsIgnoreCase(role.getName()) || "MASTER_ADMIN".equalsIgnoreCase(role.getName())) {
            throw new RuntimeException("The " + role.getName() + " role cannot be edited!");
        }

        Role existingRole = roleRepository.findByName(dto.getName());
        if (existingRole != null && !existingRole.getId().equals(id)) {
            throw new RuntimeException("Role with this name already exists!");
        }

        role.setName(dto.getName());
        role.setPermissions(dto.getPermissions() != null ? String.join(",", dto.getPermissions()) : "");
        Role updated = roleRepository.save(role);
        return toResponse(updated);
    }

    // -------------------- DELETE ROLE --------------------
    @Override
    public void deleteRole(Long id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));

        // ❌ Prevent deleting STUDENT or MASTER_ADMIN role
        if ("STUDENT".equalsIgnoreCase(role.getName()) || "MASTER_ADMIN".equalsIgnoreCase(role.getName())) {
            throw new RuntimeException("The " + role.getName() + " role cannot be deleted!");
        }

        roleRepository.delete(role);
    }


    // -------------------- GET ROLE BY ID --------------------
    @Override
    public RoleResponseDto getRoleById(Long id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
        return toResponse(role);
    }

    // -------------------- GET ALL ROLES --------------------
//    @Override
//    public List<RoleResponseDto> getAllRoles() {
//        List<Role> roles = roleRepository.findAll();
//        List<RoleResponseDto> list = new ArrayList<>();
//        for (Role r : roles) list.add(toResponse(r));
//        return list;
//    }
    @Override
    public List<RoleResponseDto> getAllRoles() {
        List<Role> roles = roleRepository.findAllExcludingSystemRoles();
        List<RoleResponseDto> list = new ArrayList<>();
        for (Role r : roles) list.add(toResponse(r));
        return list;
    }

    // -------------------- PRIVATE HELPERS --------------------
    private RoleResponseDto toResponse(Role role) {
        RoleResponseDto dto = new RoleResponseDto();
        dto.setId(role.getId());
        dto.setName(role.getName());
        if (role.getPermissions() != null && !role.getPermissions().isEmpty()) {
            dto.setPermissions(Arrays.asList(role.getPermissions().split(",")));
        } else {
            dto.setPermissions(new ArrayList<>());
        }
        return dto;
    }

    private void validateAdmin(AdminAuthDto adminAuth) {
        if (adminAuth == null ||
            !MASTER_ADMIN_EMAIL.equals(adminAuth.getEmail()) ||
            !MASTER_ADMIN_PASSWORD.equals(adminAuth.getPassword())) {
            throw new RuntimeException("Unauthorized: Invalid master admin credentials");
        }
    }
}
