package com.mockInterview.service;

import com.mockInterview.entity.Module;
import com.mockInterview.entity.Permission;
import com.mockInterview.repository.ModuleRepository;
import com.mockInterview.repository.PermissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PermissionService {

    private static final String GENERAL_MODULE = "GENERAL";

    @Autowired
    private PermissionRepository permissionRepository;

    @Autowired
    private ModuleRepository moduleRepository;

    /**
     * Ensures that a permission exists in the database.
     * If not, creates it and links it to the GENERAL module.
     */
    @Transactional
    public void ensurePermissionExists(String permissionName) {

        Permission existing = permissionRepository.findByName(permissionName);
        if (existing != null) return; // Already exists

        // Find or create GENERAL module
        Module module = moduleRepository.findByName(GENERAL_MODULE);
        if (module == null) {
            module = new Module();
            module.setName(GENERAL_MODULE);
            module.setDescription("Default module for unassigned permissions");
            moduleRepository.save(module);
        }

        // Create permission and link to GENERAL module
        Permission permission = new Permission();
        permission.setName(permissionName);
        permission.setModule(module); // Only grouping, no role auto-link
        permissionRepository.save(permission);

        System.out.println("→ Created missing permission: " + permissionName + " (Module: " + module.getName() + ")");
    }
}
