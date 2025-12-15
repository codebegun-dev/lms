package com.mockInterview.serviceImpl;

import com.mockInterview.entity.Module;
import com.mockInterview.entity.Permission;
import com.mockInterview.entity.Role;
import com.mockInterview.entity.RoleModulePermission;
import com.mockInterview.exception.DuplicateFieldException;
import com.mockInterview.repository.ModuleRepository;
import com.mockInterview.repository.PermissionRepository;
import com.mockInterview.repository.RoleModulePermissionRepository;
import com.mockInterview.repository.RoleRepository;
import com.mockInterview.requestDtos.ModulePermissionRequestDto;
import com.mockInterview.requestDtos.RoleRequestDto;
import com.mockInterview.responseDtos.ModulePermissionResponseDto;
import com.mockInterview.responseDtos.PermissionResponseDto;
import com.mockInterview.responseDtos.RoleResponseDto;
import com.mockInterview.security.SecurityUtils;
import com.mockInterview.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RoleServiceImpl implements RoleService {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private ModuleRepository moduleRepository;

    @Autowired
    private PermissionRepository permissionRepository;

    @Autowired
    private RoleModulePermissionRepository roleModulePermissionRepository;

    // ================= CREATE ROLE =================
    @Override
    public RoleResponseDto createRole(RoleRequestDto dto) {
    	
    	if (roleRepository.existsByName(dto.getRoleName())) {
            throw new DuplicateFieldException("Role name already exists");
        }

        Role role = new Role();
        role.setName(dto.getRoleName());
        role.setDescription(dto.getDescription());
        role.setCreatedBy(SecurityUtils.getCurrentUserId());

        role = roleRepository.save(role);

        Set<RoleModulePermission> mappingSet = new HashSet<>();

        if (dto.getModules() != null) {
            for (ModulePermissionRequestDto mDto : dto.getModules()) {

                Module module = moduleRepository.findById(mDto.getModuleId())
                        .orElseThrow(() -> new RuntimeException("Module not found"));

                for (Long permId : mDto.getPermissionIds()) {
                    Permission permission = permissionRepository.findById(permId)
                            .orElseThrow(() -> new RuntimeException("Permission not found"));

                    RoleModulePermission rmp = new RoleModulePermission();
                    rmp.setRole(role);
                    rmp.setModule(module);
                    rmp.setPermission(permission);

                    mappingSet.add(rmp);
                }
            }
        }

        roleModulePermissionRepository.saveAll(mappingSet);
        role.setModulePermissions(mappingSet);

        return mapToDto(role);
    }

    @Override
    public RoleResponseDto updateRole(Long roleId, RoleRequestDto dto) {
        // 1️⃣ Fetch existing role
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        // 2️⃣ Check for duplicate role name (excluding current role)
        boolean exists = roleRepository.existsByNameAndIdNot(dto.getRoleName(), roleId);
        if (exists) {
            throw new RuntimeException("Role name already exists");
        }

        // 3️⃣ Update basic fields
        role.setName(dto.getRoleName());
        role.setDescription(dto.getDescription());

        // 4️⃣ Clear existing modulePermissions safely
        if (role.getModulePermissions() != null) {
            role.getModulePermissions().clear();
        }

        // 5️⃣ Add new modulePermissions
        if (dto.getModules() != null) {
            for (ModulePermissionRequestDto mDto : dto.getModules()) {
                Module module = moduleRepository.findById(mDto.getModuleId())
                        .orElseThrow(() -> new RuntimeException("Module not found"));

                for (Long permId : mDto.getPermissionIds()) {
                    Permission permission = permissionRepository.findById(permId)
                            .orElseThrow(() -> new RuntimeException("Permission not found"));

                    RoleModulePermission rmp = new RoleModulePermission();
                    rmp.setRole(role);
                    rmp.setModule(module);
                    rmp.setPermission(permission);

                    role.getModulePermissions().add(rmp);
                }
            }
        }

        // 6️⃣ Save role
        Role updatedRole = roleRepository.save(role);

        // 7️⃣ Return DTO
        return mapToDto(updatedRole);
    }

    // ================= GET ROLE =================
    @Override
    public RoleResponseDto getRole(Long roleId) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        return mapToDto(role);
    }

    // ================= GET ALL ROLES =================
    @Override
    public List<RoleResponseDto> getAllRoles() {
        List<RoleResponseDto> list = new ArrayList<>();
        for (Role role : roleRepository.findAll()) {
            list.add(mapToDto(role));
        }
        return list;
    }

    // ================= DELETE ROLE =================
    @Override
    public void deleteRole(Long roleId) {
        roleRepository.deleteById(roleId);
    }

    // ================= DTO MAPPER =================
    private RoleResponseDto mapToDto(Role role) {

        Map<Long, ModulePermissionResponseDto> moduleMap = new HashMap<>();

        if (role.getModulePermissions() != null) {
            for (RoleModulePermission rmp : role.getModulePermissions()) {

                Long moduleId = rmp.getModule().getId();

                ModulePermissionResponseDto mp = moduleMap.get(moduleId);
                if (mp == null) {
                    mp = new ModulePermissionResponseDto();
                    mp.setModuleId(moduleId);
                    mp.setModuleName(rmp.getModule().getName());
                    mp.setPermissions(new ArrayList<>());
                    moduleMap.put(moduleId, mp);
                }

                // Wrap permission into DTO
                PermissionResponseDto permDto = new PermissionResponseDto();
                permDto.setId(rmp.getPermission().getId());
                permDto.setName(rmp.getPermission().getName());

                mp.getPermissions().add(permDto);
            }
        }

        RoleResponseDto response = new RoleResponseDto();
        response.setRoleId(role.getId());
        response.setRoleName(role.getName());
        response.setDescription(role.getDescription());
        response.setModules(new ArrayList<>(moduleMap.values()));

        return response;
    }
}
