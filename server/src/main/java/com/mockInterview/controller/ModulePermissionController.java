package com.mockInterview.controller;

import com.mockInterview.entity.Module;
import com.mockInterview.entity.Permission;
import com.mockInterview.repository.ModuleRepository;
import com.mockInterview.repository.PermissionRepository;
import com.mockInterview.responseDtos.ModuleResponseDto;
import com.mockInterview.responseDtos.PermissionResponseDto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/ui/modules")
@CrossOrigin(origins = "*")
public class ModulePermissionController {

    @Autowired
    private ModuleRepository moduleRepository;

    @Autowired
    private PermissionRepository permissionRepository;

    /**
     * UI API
     * Returns modules with permissions ONLY for dropdown display
     */
    @GetMapping
    public List<ModuleResponseDto> getModulesWithPermissions() {

        List<Module> modules = moduleRepository.findAll();
        List<ModuleResponseDto> response = new ArrayList<>();

        for (Module module : modules) {

            ModuleResponseDto moduleDto = new ModuleResponseDto();
            moduleDto.setId(module.getId());
            moduleDto.setName(module.getName());
            moduleDto.setDescription(module.getDescription());

            // Fetch permissions for this module
            List<Permission> permissions =
                    permissionRepository.findByModuleId(module.getId());

            List<PermissionResponseDto> permissionDtos = new ArrayList<>();

            for (Permission p : permissions) {
                PermissionResponseDto pDto = new PermissionResponseDto();
                pDto.setId(p.getId());
                pDto.setName(p.getName());
                permissionDtos.add(pDto);
            }

            moduleDto.setPermissions(permissionDtos);
            response.add(moduleDto);
        }
        return response;
    }
}
