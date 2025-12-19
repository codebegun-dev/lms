package com.mockInterview.requestDtos;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class SalesCourseManagementRequestDto {

    // ===== REQUIRED FIELDS =====
    @NotBlank(message = "Lead name is required")
    @Size(min = 3, max = 30, message = "Lead name must be between 3 and 30 characters")
    private String leadName;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone must be a valid 10-digit number")
    private String phone;

    // ===== OPTIONAL FIELDS =====
    @Email(message = "Invalid email format")
    private String email;

    private String gender;
    private String passedOutYear;
    private String qualification;

    private Long courseId;      // Optional
    private Long sourceId;      // Optional
    private Long campaignId;    // Optional

    private String college;
    private String city;

    private Long assignedTo;    // Optional user ID
    private String status;      // Optional, default handled in service
}
