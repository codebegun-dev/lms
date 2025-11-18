package com.mockInterview.util;

import com.mockInterview.entity.User;
import com.mockInterview.exception.UnauthorizedActionException;



public class RoleValidator {

    private static void validateUserAndRole(User user) {
        if (user == null || user.getRole() == null || user.getRole().getName() == null || user.getRole().getName().isBlank()) {
            throw new UnauthorizedActionException("Invalid user or role");
        }
    }

    public static void validateStudentAccess(User user) {
        validateUserAndRole(user);
        if (!"STUDENT".equalsIgnoreCase(user.getRole().getName())) {
            throw new UnauthorizedActionException("Access denied: Only STUDENT role can access student details.");
        }
    }

    public static void validateMasterAdminAccess(User user) {
        validateUserAndRole(user);
        if (!"MASTER_ADMIN".equalsIgnoreCase(user.getRole().getName())) {
            throw new UnauthorizedActionException("Access denied: Only MASTER_ADMIN can perform this action.");
        }
    }

    public static void validateStudentOrMasterAdmin(User user) {
        validateUserAndRole(user);
        String role = user.getRole().getName();
        if (!"STUDENT".equalsIgnoreCase(role) && !"MASTER_ADMIN".equalsIgnoreCase(role)) {
            throw new UnauthorizedActionException("Access denied: Only STUDENT or MASTER_ADMIN can access this resource.");
        }
    }

    // Prevent MASTER_ADMIN from creating/updating their own StudentGenericDetails
    public static void preventMasterAdminGenericUpdate(User user) {
        validateUserAndRole(user);
        if ("MASTER_ADMIN".equalsIgnoreCase(user.getRole().getName())) {
            throw new UnauthorizedActionException("we cannot update student details for MASTER_ADMIN");
        }
    }

    public static void validateNonStudentAccess(User user) {
        validateUserAndRole(user);
        if ("STUDENT".equalsIgnoreCase(user.getRole().getName())) {
            throw new UnauthorizedActionException("Access denied: STUDENT cannot access this resource.");
        }
    }
}
