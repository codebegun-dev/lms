package com.mockInterview.responseDtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AssignableUserDto {
    private Long userId;
    private String fullName;
    private String email;
    private String roleName; // Add role
}

