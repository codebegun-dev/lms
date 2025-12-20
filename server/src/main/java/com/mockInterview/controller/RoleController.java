package com.mockInterview.controller;

import com.mockInterview.entity.Status;
import com.mockInterview.requestDtos.RoleRequestDto;
import com.mockInterview.responseDtos.RoleResponseDto;
import com.mockInterview.security.annotations.ModulePermission;
import com.mockInterview.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@ModulePermission("ROLE_MANAGEMENT")
@RestController
@RequestMapping("/api/roles")
public class RoleController {

    @Autowired
    private RoleService roleService;

    // ================= CREATE ROLE =================
    @PreAuthorize("hasAuthority('CREATE_ROLE')")
    @PostMapping
    public RoleResponseDto createRole(@RequestBody RoleRequestDto dto) {
        return roleService.createRole(dto);
    }

    // ================= UPDATE ROLE =================
    @PreAuthorize("hasAuthority('UPDATE_ROLE')")
    @PutMapping("/{id}")
    public RoleResponseDto updateRole(@PathVariable Long id, @RequestBody RoleRequestDto dto) {
        return roleService.updateRole(id, dto);
    }

    // ================= GET ROLE BY ID =================
    @PreAuthorize("hasAuthority('VIEW_ROLE')")
    @GetMapping("/{id}")
    public RoleResponseDto getRole(@PathVariable Long id) {
        return roleService.getRole(id);
    }

    // ================= GET ALL ROLES =================
    @PreAuthorize("hasAuthority('VIEW_ROLE')")
    @GetMapping
    public List<RoleResponseDto> getAllRoles() {
        return roleService.getAllRoles();
    }
    
    @PreAuthorize("hasAuthority('VIEW_ROLE')")
    @GetMapping("/active")
    public List<RoleResponseDto> getActiveRoles() {
        return roleService.getActiveRoles();
    }

    // ================= DELETE ROLE =================
    @PreAuthorize("hasAuthority('DELETE_ROLE')")
    @DeleteMapping("/{id}") 
    public String deleteRole(@PathVariable Long id) {
        roleService.deleteRole(id);
        return "Role deleted successfully";
    }
    
    @PreAuthorize("hasAuthority('DELETE_ROLE')")
    @PutMapping("/{roleId}/status/{status}")
    public String changeRoleStatus(
            @PathVariable Long roleId,
            @PathVariable Status status) {

        roleService.changeRoleStatus(roleId, status);
        return "Role status updated successfully";
    }

}
