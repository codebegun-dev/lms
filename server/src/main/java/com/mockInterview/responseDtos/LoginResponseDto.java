package com.mockInterview.responseDtos;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class LoginResponseDto {
    private Long userId;
    private String email;
    private String token;
    private String role;
    private List<String> permissions;
}
