package com.mockInterview.requestDtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SalesCourseManagementRequestDto {

    @NotNull(message = "Student name is required")
    @Size(min = 3, max = 30, message = "Name must be between 3 and 30 characters")
    private String studentName;

    @NotNull(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone must be a valid 10-digit number")
    private String phone;

    @Email(message = "Invalid email format")
    private String email;

    private String gender;

    private String passedOutYear;

    private String qualification;

    private Long courseId;

    
    private String status;

    
    @Size(min = 2, max = 50, message = "College name must be between 2 and 50 characters")
    private String college;

    @Size(min = 2, max = 50, message = "City name must be between 2 and 50 characters")
    private String city;

    @Size(max = 50, message = "Source can be max 50 characters")
    private String source;

    @Size(max = 50, message = "Campaign can be max 50 characters")
    private String campaign;
}
