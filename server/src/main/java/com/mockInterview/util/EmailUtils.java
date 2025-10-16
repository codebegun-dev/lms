package com.mockInterview.util;

public class EmailUtils {

    // Mask email for privacy (e.g., abcde@gmail.com → xxxxx@gmail.com)
    public static String maskEmail(String email) {
        if (email == null || !email.contains("@")) {
            return email;
        }
        String[] parts = email.split("@");
        String local = parts[0];
        String domain = parts[1];

        String maskedLocal;
        if (local.length() <= 2) {
            maskedLocal = "x".repeat(local.length());
        } else {
            maskedLocal = "x".repeat(local.length() - 3) + local.substring(local.length() - 3);
        }

        return maskedLocal + "@" + domain;
    }

    // Mask phone number (e.g., 9876543210 → xxxxxx3210)
    public static String maskPhone(String phone) {
        if (phone == null || phone.length() < 4) {
            return phone;
        }
        int lengthToMask = phone.length() - 4;
        String maskedPart = "x".repeat(lengthToMask);
        String visiblePart = phone.substring(lengthToMask);
        return maskedPart + visiblePart;
    }
}
