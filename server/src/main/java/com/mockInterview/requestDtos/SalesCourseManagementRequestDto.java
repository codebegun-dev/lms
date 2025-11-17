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
	@Pattern(regexp = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$")
	private String email;

	private String gender;

	@Pattern(regexp = "^[0-9]{4}$", message = "Passed out year must be a valid 4 digit year")
    private String passedOutYear;
	
	private String qualification;
	
	private long courseId;
	
	private String status;

}
