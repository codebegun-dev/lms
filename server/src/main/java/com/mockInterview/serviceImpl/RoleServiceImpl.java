package com.mockInterview.serviceImpl;

import com.mockInterview.entity.Role;

import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.repository.RoleRepository;
import com.mockInterview.requestDtos.RoleRequestDto;
import com.mockInterview.responseDtos.RoleResponseDto;
import com.mockInterview.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class RoleServiceImpl implements RoleService {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public RoleResponseDto createRole(RoleRequestDto dto) {
        if (roleRepository.findByName(dto.getName()) != null) {
            throw new RuntimeException("Role with this name already exists!");
        }
        Role role = new Role();
        role.setName(dto.getName());
        role.setPermissions(dto.getPermissions());
        Role saved = roleRepository.save(role);
        return toResponse(saved);
    }

    @Override
    public RoleResponseDto updateRole(Long id, RoleRequestDto dto) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
        
        Role existingRole = roleRepository.findByName(dto.getName());
        if (existingRole != null && !existingRole.getId().equals(id)) {
            throw new RuntimeException("Role with this name already exists!");
        }
        role.setName(dto.getName());
        role.setPermissions(dto.getPermissions());
        Role updated = roleRepository.save(role);
        return toResponse(updated);
    }

    @Override
    public void deleteRole(Long id) {
        if (!roleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Role not found");
        }
        roleRepository.deleteById(id);
    }

    @Override
    public RoleResponseDto getRoleById(Long id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
        return toResponse(role);
    }

    @Override
    public List<RoleResponseDto> getAllRoles() {
        List<Role> roles = roleRepository.findAll();
        List<RoleResponseDto> list = new ArrayList<>();
        for (Role r : roles) list.add(toResponse(r));
        return list;
    }

    private RoleResponseDto toResponse(Role role) {
        RoleResponseDto dto = new RoleResponseDto();
        dto.setId(role.getId());
        dto.setName(role.getName());
        dto.setPermissions(role.getPermissions());
        return dto;
    }
}
