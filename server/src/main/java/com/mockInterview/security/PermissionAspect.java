package com.mockInterview.security;

import com.mockInterview.service.PermissionService;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;


@Aspect
@Component
public class PermissionAspect {

    @Autowired
    private PermissionService permissionService;

    @Before("@annotation(preAuthorize)")
    public void checkPermissionAnnotation(JoinPoint joinPoint, PreAuthorize preAuthorize) {
        String value = preAuthorize.value(); // e.g., "hasAuthority('CREATE_ROLE')"

        if (value.contains("hasAuthority")) {
            String permissionName = value
                    .replace("hasAuthority(", "")
                    .replace(")", "")
                    .replace("'", "")
                    .trim();

            permissionService.ensurePermissionExists(permissionName);
        }

        // Optional: support hasAnyAuthority('PERM1','PERM2')
        if (value.contains("hasAnyAuthority")) {
            String inside = value.substring(value.indexOf("(") + 1, value.indexOf(")"));
            String[] permissions = inside.replace("'", "").split(",");
            for (String perm : permissions) {
                permissionService.ensurePermissionExists(perm.trim());
            }
        }
    }
}
