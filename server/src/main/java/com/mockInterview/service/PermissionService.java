package com.mockInterview.service;

import com.mockInterview.entity.Permission;
import com.mockInterview.repository.PermissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PermissionService {

    @Autowired
    private PermissionRepository permissionRepository;

    public void ensurePermissionExists(String permissionName) {
        if (permissionRepository.findByName(permissionName) == null) {
            Permission p = new Permission();
            p.setName(permissionName);
            permissionRepository.save(p);
            System.out.println("→ Created missing permission: " + permissionName);
        }
    }
}
