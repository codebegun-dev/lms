package com.mockInterview.security;

import com.mockInterview.service.PermissionService;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;

@Aspect
@Component
public class PermissionAspect {

    @Autowired
    private PermissionService permissionService;

    
    @Before("execution(* com.mockInterview..controller..*(..))")
    public void checkPermissions(JoinPoint joinPoint) {

        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();

        // ===== METHOD LEVEL @PreAuthorize =====
        PreAuthorize methodPre = method.getAnnotation(PreAuthorize.class);
        if (methodPre != null) {
            processPreAuthorizeExpression(methodPre.value());
        }

        // ===== CLASS LEVEL @PreAuthorize =====
        PreAuthorize classPre = method.getDeclaringClass().getAnnotation(PreAuthorize.class);
        if (classPre != null) {
            processPreAuthorizeExpression(classPre.value());
        }
    }

    private void processPreAuthorizeExpression(String expression) {
        if (expression.contains("hasAuthority")) {
            String perm = extractSingle(expression);
            permissionService.ensurePermissionExists(perm);
        }

        if (expression.contains("hasAnyAuthority")) {
            String inside = expression.substring(expression.indexOf("(") + 1, expression.indexOf(")"));
            String[] perms = inside.replace("'", "").split(",");
            for (String p : perms) {
                permissionService.ensurePermissionExists(p.trim());
            }
        }
    }

    private String extractSingle(String expr) {
        return expr.substring(expr.indexOf("'") + 1, expr.lastIndexOf("'"));
    }
}
