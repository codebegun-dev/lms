package com.mockInterview.controller;

import com.mockInterview.requestDtos.RoleRequestDto;
import com.mockInterview.responseDtos.RoleResponseDto;
import com.mockInterview.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@CrossOrigin(origins = "*")
public class RoleController {
 
    @Autowired
    private RoleService roleService;

    // -------------------- CREATE ROLE --------------------
    @PostMapping
    public RoleResponseDto createRole(@RequestBody RoleRequestDto dto) {
        // Admin credentials must be included in RoleRequestDto.adminAuth
        return roleService.createRole(dto);
    }

    // -------------------- UPDATE ROLE --------------------
    @PutMapping("/{id}")
    public RoleResponseDto updateRole(@PathVariable Long id, @RequestBody RoleRequestDto dto) {
        // Admin credentials must be included in RoleRequestDto.adminAuth
        return roleService.updateRole(id, dto);
    }

    // -------------------- DELETE ROLE --------------------
    @DeleteMapping("/{id}")
    public String deleteRole(@PathVariable Long id) {
        roleService.deleteRole(id);
        return "Role deleted successfully";
    }

    // -------------------- GET ROLE BY ID --------------------
    @GetMapping("/{id}")
    public RoleResponseDto getRoleById(@PathVariable Long id) {
        return roleService.getRoleById(id);
    }

    // -------------------- GET ALL ROLES --------------------
    @GetMapping
    public List<RoleResponseDto> getAllRoles() {
        return roleService.getAllRoles();
    }
}
