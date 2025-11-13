package com.mockInterview.requestDtos;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserUpdateRequestDto {

    @NotNull
    @Size(min = 3, max = 30, message = "firstName should be min 3 and max 30 characters")
    private String firstName;

    @NotNull
    @Size(min = 3, max = 30, message = "lastName should be min 3 and max 30 characters")
    private String lastName;

    @NotNull(message = "Email is required")
    @Pattern(regexp = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$",
             message = "Invalid email format")
    private String email;

    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be 10 digits")
    @NotNull(message = "Phone number is required")
    private String phone;

    private Long roleId;

    private AdminAuthDto adminAuth; // ✅ Add this
}
