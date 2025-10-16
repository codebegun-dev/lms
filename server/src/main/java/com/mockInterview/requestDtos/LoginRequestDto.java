package com.mockInterview.requestDtos;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequestDto {
	
	@NotNull(message="email or phone number must be required")
	private String emailOrPhone;
	@NotNull(message="password is required")
	private String password;

}
