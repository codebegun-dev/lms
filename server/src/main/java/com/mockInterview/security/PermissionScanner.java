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

            HandlerMethod method = entry.getValue();

            PreAuthorize pre = method.getMethodAnnotation(PreAuthorize.class);

            if (pre == null) 
                continue;

            String exp = pre.value(); // ex: "hasAuthority('DELETE_ROLE')"

            // Extract permissions
            if (exp.contains("hasAuthority")) {

                String perm = exp.substring(exp.indexOf("'") + 1, exp.lastIndexOf("'"));

                savePermission(perm);
            }

            // Support hasAnyAuthority('A','B','C')
            if (exp.contains("hasAnyAuthority")) {
                String inside = exp.substring(exp.indexOf("(") + 1, exp.indexOf(")"));
                String[] perms = inside.replace("'", "").split(",");

                for (String perm : perms) {
                    savePermission(perm.trim());
                }
            }
        }

        System.out.println("✅ Permission scan complete.");
    }

    private void savePermission(String perm) {
        if (permissionRepository.findByName(perm) == null) {
            Permission newPerm = new Permission();
            newPerm.setName(perm);
            permissionRepository.save(newPerm);
            System.out.println("→ Added Permission: " + perm);
        }
    }
}
