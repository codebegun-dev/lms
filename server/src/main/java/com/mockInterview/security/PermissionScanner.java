package com.mockInterview.security;

import com.mockInterview.entity.Module;
import com.mockInterview.entity.Permission;
import com.mockInterview.repository.ModuleRepository;
import com.mockInterview.repository.PermissionRepository;
import com.mockInterview.security.annotations.ModulePermission;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;

import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

@Component
public class PermissionScanner implements ApplicationRunner {

    @Autowired
    private RequestMappingHandlerMapping handlerMapping;

    @Autowired
    private PermissionRepository permissionRepository;

    @Autowired
    private ModuleRepository moduleRepository;

    @Override
    public void run(ApplicationArguments args) {

        System.out.println("🔍 Scanning controllers for Modules & Permissions...");

        handlerMapping.getHandlerMethods().forEach((key, handlerMethod) -> {

            // ===== MODULE FROM CONTROLLER =====
            ModulePermission moduleAnn =
                    handlerMethod.getBeanType().getAnnotation(ModulePermission.class);

            if (moduleAnn == null) {
                return; // skip controllers without module
            }

            Module module = getOrCreateModule(moduleAnn.value());

            // ===== METHOD LEVEL PERMISSIONS =====
            PreAuthorize methodPre =
                    handlerMethod.getMethodAnnotation(PreAuthorize.class);

            if (methodPre != null) {
                extractPermissions(methodPre.value(), module);
            }

            // ===== CLASS LEVEL PERMISSIONS =====
            PreAuthorize classPre =
                    handlerMethod.getBeanType().getAnnotation(PreAuthorize.class);

            if (classPre != null) {
                extractPermissions(classPre.value(), module);
            }
        });

        System.out.println("✅ Permission scan completed");
    }

    // ================== HELPERS ==================

    private void extractPermissions(String expression, Module module) {

        // hasAuthority('X')
        if (expression.contains("hasAuthority")) {
            String perm = extractSingle(expression);
            savePermissionIfNotExists(perm, module);
        }

        // hasAnyAuthority('A','B')
        if (expression.contains("hasAnyAuthority")) {
            String inside = expression.substring(
                    expression.indexOf("(") + 1,
                    expression.indexOf(")")
            );

            String[] perms = inside.replace("'", "").split(",");
            for (String p : perms) {
                savePermissionIfNotExists(p.trim(), module);
            }
        }
    }

    private String extractSingle(String expr) {
        return expr.substring(expr.indexOf("'") + 1, expr.lastIndexOf("'"));
    }

    private void savePermissionIfNotExists(String name, Module module) {

        Permission existing = permissionRepository.findByName(name);
        if (existing != null) return;

        Permission permission = new Permission();
        permission.setName(name);
        permission.setModule(module); // ONLY for grouping, NOT auto role mapping

        permissionRepository.save(permission);

        System.out.println("➕ Permission: " + name +
                " (Module: " + module.getName() + ")");
    }

    private Module getOrCreateModule(String name) {

        Module module = moduleRepository.findByName(name);
        if (module != null) return module;

        Module m = new Module();
        m.setName(name);
        m.setDescription(name + " APIs");

        moduleRepository.save(m);

        System.out.println("📦 Module Created: " + name);
        return m;
    }
}
