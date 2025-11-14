package com.mockInterview.serviceImpl;

import com.mockInterview.entity.Role;
import com.mockInterview.entity.User;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.repository.RoleRepository;
import com.mockInterview.repository.UserRepository;
import com.mockInterview.requestDtos.RoleRequestDto;
import com.mockInterview.responseDtos.RoleResponseDto;
import com.mockInterview.service.RoleService;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class RoleServiceImpl implements RoleService {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    // -------------------- CREATE ROLE --------------------
    @Override
    public RoleResponseDto createRole(RoleRequestDto dto) {
        validateAdmin(dto.getAdminAuthId());

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
        validateAdmin(dto.getAdminAuthId());

        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));

        // Prevent editing STUDENT, MASTER_ADMIN, or DEFAULT role
        if ("STUDENT".equalsIgnoreCase(role.getName()) || 
            "MASTER_ADMIN".equalsIgnoreCase(role.getName()) || 
            "DEFAULT".equalsIgnoreCase(role.getName())) {
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
    @Transactional
    public void deleteRole(Long id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));

        // Prevent deleting system roles
        if ("STUDENT".equalsIgnoreCase(role.getName()) || 
            "MASTER_ADMIN".equalsIgnoreCase(role.getName()) || 
            "DEFAULT".equalsIgnoreCase(role.getName())) {
            throw new RuntimeException("The " + role.getName() + " role cannot be deleted!");
        }

        // Fetch all users assigned to this role
        List<User> usersWithRole = userRepository.findByRole(role);
        if (usersWithRole != null && !usersWithRole.isEmpty()) {
            // Get DEFAULT role
            Role defaultRole = roleRepository.findByName("DEFAULT");
            if (defaultRole == null) {
                // If DEFAULT role does not exist, create it
                defaultRole = new Role();
                defaultRole.setName("DEFAULT");
                roleRepository.save(defaultRole);
            }

            // Assign DEFAULT role to all users who had the deleted role
            for (User user : usersWithRole) {
                user.setRole(defaultRole);
            }
            userRepository.saveAll(usersWithRole);
        }

        // Delete the role
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

    private void validateAdmin(Long adminId) {
        if (adminId == null) {
            throw new RuntimeException("Unauthorized: Admin ID is required");
        }

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin user not found"));

        if (!"MASTER_ADMIN".equalsIgnoreCase(admin.getRole().getName())) {
            throw new RuntimeException("Unauthorized: User is not Master Admin");
        }
    }
}
