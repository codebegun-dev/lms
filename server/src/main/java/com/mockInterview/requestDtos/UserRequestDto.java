package com.mockInterview.requestDtos;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRequestDto {

    @Size(min = 3, max = 30, message = "firstName should be min 3 and max 30 characters")
    private String firstName;  

    @Size(min = 3, max = 30, message = "lastName should be min 3 and max 30 characters")
    private String lastName;   
    @Pattern(
        regexp = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$",
        message = "Invalid email format"
    )
    private String email;     
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be 10 digits")
    private String phone;     

    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;  

    private Long roleId;       
}
