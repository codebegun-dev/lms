// UserPermissionServiceImpl.java
package com.mockInterview.serviceImpl;

import com.mockInterview.entity.Permission;
import com.mockInterview.entity.Role;
import com.mockInterview.entity.RoleModulePermission;
import com.mockInterview.entity.User;
import com.mockInterview.repository.PermissionRepository;
import com.mockInterview.repository.UserRepository;
import com.mockInterview.responseDtos.ModulePermissionDto;
import com.mockInterview.responseDtos.UserPermissionsResponseDto;
import com.mockInterview.security.SecurityUtils;
import com.mockInterview.service.UserPermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

import org.springframework.cache.annotation.Cacheable;

@Service
public class UserPermissionServiceImpl implements UserPermissionService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PermissionRepository permissionRepository;

    @Override
    @Cacheable(value = "userPermissions", key = "#root.target.getCurrentUserId()")
    public UserPermissionsResponseDto getMyPermissions() {

        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) return null;

        User user = userRepository.findById(userId).orElseThrow(
                () -> new RuntimeException("User not found")
        );

        Role role = user.getRole();
        List<ModulePermissionDto> modulePermissionsList = new ArrayList<>();

        if (role != null) {

            if ("MASTER_ADMIN".equalsIgnoreCase(role.getName())) {
                List<Permission> allPermissions = permissionRepository.findAll();
                Map<String, List<String>> moduleMap = new HashMap<>();
                for (Permission p : allPermissions) {
                    String moduleName = p.getModule().getName();
                    moduleMap.computeIfAbsent(moduleName, k -> new ArrayList<>())
                             .add(p.getName());
                }
                for (Map.Entry<String, List<String>> entry : moduleMap.entrySet()) {
                    modulePermissionsList.add(
                            new ModulePermissionDto(entry.getKey(), entry.getValue())
                    );
                }

            } else {
                Map<String, List<String>> moduleMap = new HashMap<>();
                for (RoleModulePermission rmp : role.getModulePermissions()) {
                    String moduleName = rmp.getModule().getName();
                    String permissionName = rmp.getPermission().getName();
                    moduleMap.computeIfAbsent(moduleName, k -> new ArrayList<>()).add(permissionName);
                }
                for (Map.Entry<String, List<String>> entry : moduleMap.entrySet()) {
                    modulePermissionsList.add(
                            new ModulePermissionDto(entry.getKey(), entry.getValue())
                    );
                }
            }
        }

        return new UserPermissionsResponseDto(
                user.getUserId(),
                user.getEmail(),
                role != null ? role.getName() : null,
                modulePermissionsList
        );
    }

    // helper method for @Cacheable key
    public Long getCurrentUserId() {
        return SecurityUtils.getCurrentUserId();
    }
}
