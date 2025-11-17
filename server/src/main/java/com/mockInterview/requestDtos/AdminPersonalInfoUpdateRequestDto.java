package com.mockInterview.requestDtos;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

@Data
public class AdminPersonalInfoUpdateRequestDto {

    // -------------------- User Table Fields --------------------

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50, message = "First name should be between 2 and 50 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50, message = "Last name should be between 2 and 50 characters")
    private String lastName;

    @NotBlank(message = "Mobile number is required")
    @Pattern(regexp = "^[6-9]\\d{9}$",
             message = "Mobile number must be a valid 10-digit Indian number")
    private String mobileNumber;


    // -------------------- AdminPersonalInfo Entity Fields --------------------

    @NotBlank(message = "Gender is required")
    @Pattern(regexp = "Male|Female|Other",
             message = "Gender must be Male, Female, or Other")
    private String gender;

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateOfBirth;

    @NotBlank(message = "Blood group is required")
    @Pattern(regexp = "A\\+|A\\-|B\\+|B\\-|AB\\+|AB\\-|O\\+|O\\-",
             message = "Invalid blood group. Allowed: A+, A-, B+, B-, AB+, AB-, O+, O-")
    private String bloodGroup;

    @NotBlank(message = "Job title is required")
    @Size(max = 50, message = "Job title cannot exceed 50 characters")
    private String jobTitle;

    @Size(max = 255, message = "Profile picture path too long")
    private String profilePicturePath;
}
