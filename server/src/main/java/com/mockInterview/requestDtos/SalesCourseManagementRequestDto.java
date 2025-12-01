package com.mockInterview.requestDtos;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SalesCourseManagementRequestDto {

	@NotNull(message ="name is required")
	@Size(min = 3, max = 30, message = "Name must be between 3 and 30 characters")
	private String leadName;

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

	private String college;

	private String city;

	private String source;

	private String campaign;    
	
	private Long  assignedTo;
	
	private Long loggedInUserId;
	
	private String notes;
    private LocalDateTime reminderTime;  
}
