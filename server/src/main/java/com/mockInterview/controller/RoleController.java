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

    @PostMapping
    public RoleResponseDto createRole(@RequestBody RoleRequestDto dto) {
        return roleService.createRole(dto);
    }

    @PutMapping("/{id}")
    public RoleResponseDto updateRole(@PathVariable Long id, @RequestBody RoleRequestDto dto) {
        return roleService.updateRole(id, dto);
    }

    @DeleteMapping("/{id}")
    public String deleteRole(@PathVariable Long id) {
        roleService.deleteRole(id);
        return "Role deleted successfully";
    }

    @GetMapping("/{id}")
    public RoleResponseDto getRoleById(@PathVariable Long id) {
        return roleService.getRoleById(id);
    }

    @GetMapping
    public List<RoleResponseDto> getAllRoles() {
        return roleService.getAllRoles();
    }
}
