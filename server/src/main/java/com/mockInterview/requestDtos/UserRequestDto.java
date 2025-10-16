package com.mockInterview.requestDtos;

import com.mockInterview.entity.Role;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor 
@NoArgsConstructor
public class UserRequestDto {
	
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

	@NotNull
	@Size(min = 8, message = "Password must be at least 8 characters")
	@Pattern(regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{6,}$", 
	message = "Password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character and be at least 8 characters long")
	private String password;

	
	private Role role;


}
