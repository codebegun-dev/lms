package com.mockInterview.util;

import com.mockInterview.entity.User;
import com.mockInterview.exception.UnauthorizedActionException;

public class RoleValidator {

    // Common null check
    private static void validateUserAndRole(User user) {
        if (user == null || user.getRole() == null) {
            throw new UnauthorizedActionException("Invalid user or role");
        }
    }

    // Validate Student access
    public static void validateStudentAccess(User user) {
        validateUserAndRole(user);

        if (!"STUDENT".equalsIgnoreCase(user.getRole().getName())) {
            throw new UnauthorizedActionException(
                    "Access denied: Only STUDENT role can access or update student details.");
        }
    }

    // Validate MasterAdmin access
    public static void validateMasterAdminAccess(User user) {
        validateUserAndRole(user);

        if (!"MASTER_ADMIN".equalsIgnoreCase(user.getRole().getName())) {
            throw new UnauthorizedActionException(
                    "Access denied: Only MASTER_ADMIN can perform this action.");
        }
    }

    // Validate Student OR MasterAdmin
    public static void validateStudentOrMasterAdmin(User user) {
        validateUserAndRole(user);

        String role = user.getRole().getName().toUpperCase();
        if (!role.equals("STUDENT") && !role.equals("MASTER_ADMIN")) {
            throw new UnauthorizedActionException(
                    "Access denied: Only STUDENT or MASTER_ADMIN can access this resource.");
        }
    }

 // Validate non-student access
    public static void validateNonStudentAccess(User user) {
        validateUserAndRole(user);
        String role = user.getRole().getName().toUpperCase();
        if (role.equals("STUDENT")) {
            throw new UnauthorizedActionException(
                    "Access denied: STUDENT cannot access this resource.");
        }
    }

    // Ensure a user can access only their own non-student profile or MASTER_ADMIN
    public static void validateNonStudentOwnOrMaster(User currentUser, Long requestedUserId) {
        validateNonStudentAccess(currentUser);

        if (!currentUser.getRole().getName().equalsIgnoreCase("MASTER_ADMIN")
                && currentUser.getUserId() != requestedUserId) {   // Use != instead of .equals()
            throw new UnauthorizedActionException(
                    "Access denied: Cannot access or update other non-student user's profile.");
        }

    }
}
