package com.mockInterview.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityUtils {

    private SecurityUtils() {}

    public static Long getCurrentUserId() {
        try {
            if (SecurityContextHolder.getContext().getAuthentication() == null) return null;
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (principal instanceof CustomUserDetails) {
                return ((CustomUserDetails) principal).getUserId();
            }
        } catch (Exception ex) {
            // ignore and return null
        }
        return null;
    }
    
    // ✅ THIS IS WHAT YOU ARE MISSING
    public static boolean hasAuthority(String permission) {

        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            return false;
        }

        for (GrantedAuthority auth :
                SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getAuthorities()) {

            if (permission.equals(auth.getAuthority())
                    || "ALL_PERMISSIONS".equals(auth.getAuthority())) {
                return true;
            }
        }
        return false;
    }
    
    
}
