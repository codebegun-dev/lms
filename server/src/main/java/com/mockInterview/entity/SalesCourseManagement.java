package com.mockInterview.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Entity
public class SalesCourseManagement {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long studentId;

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
	
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
	private CourseManagement courseManagement;
	
	private String status = "INITIAL";

}
