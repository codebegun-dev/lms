package com.mockInterview.requestDtos;

import lombok.Data;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonFormat;

@Data
public class StudentPersonalInfoUpdateRequest {

    private Long userId;

    @NotNull
    @Size(min = 3, max = 30, message = "firstName should be min 3 and max 30 characters")
    private String firstName;

    @NotNull
    @Size(min = 3, max = 30, message = "lastName should be min 3 and max 30 characters")
    private String lastName;

    @NotNull(message = "Email is required")
    @Pattern(
        regexp = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$",
        message = "Invalid email format"
    )
    private String email;

    @NotNull(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be 10 digits")
    private String phone;

    private String gender;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateOfBirth;

    private String parentMobileNumber;

    private String bloodGroup;
}
