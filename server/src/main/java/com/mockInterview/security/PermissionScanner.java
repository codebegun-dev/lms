package com.mockInterview.security;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import com.mockInterview.entity.Permission;
import com.mockInterview.repository.PermissionRepository;

import org.springframework.security.access.prepost.PreAuthorize;



@Component
public class PermissionScanner implements ApplicationRunner {

    @Autowired
    private RequestMappingHandlerMapping handlerMapping;

    @Autowired
    private PermissionRepository permissionRepository;

    @Override
    public void run(ApplicationArguments args) {

        System.out.println("🔍 Scanning controllers for permissions...");

        for (var entry : handlerMapping.getHandlerMethods().entrySet()) {

            HandlerMethod handlerMethod = entry.getValue();

            // Scan method-level
            PreAuthorize methodPre = handlerMethod.getMethodAnnotation(PreAuthorize.class);
            if (methodPre != null) {
                extractAndSave(methodPre.value());
            }

            // Scan class-level
            PreAuthorize classPre = handlerMethod.getBeanType().getAnnotation(PreAuthorize.class);
            if (classPre != null) {
                extractAndSave(classPre.value());
            }
        }

        System.out.println("✅ Permission scan complete.");
    }

    private void extractAndSave(String expr) {

        // hasAuthority('X')
        if (expr.contains("hasAuthority")) {
            String perm = expr.substring(expr.indexOf("'") + 1, expr.lastIndexOf("'"));
            savePermission(perm);
        }

        // hasAnyAuthority('A', 'B')
        if (expr.contains("hasAnyAuthority")) {
            String inside = expr.substring(expr.indexOf("(") + 1, expr.indexOf(")"));
            String[] perms = inside.replace("'", "").split(",");
            for (String perm : perms) {
                savePermission(perm.trim());
            }
        }
    }

    private void savePermission(String perm) {
        if (permissionRepository.findByName(perm) == null) {
            Permission p = new Permission();
            p.setName(perm);
            permissionRepository.save(p);
            System.out.println("→ Added Permission: " + perm);
        }
    }
}
