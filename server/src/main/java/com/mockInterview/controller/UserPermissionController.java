
package com.mockInterview.controller;

import com.mockInterview.responseDtos.UserPermissionsResponseDto;
import com.mockInterview.service.UserPermissionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserPermissionController {

    @Autowired
    private UserPermissionService userPermissionService;

    // ================= GET MY PERMISSIONS =================
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me/permissions")
    public UserPermissionsResponseDto getMyPermissions() {
        return userPermissionService.getMyPermissions();
    }
}
