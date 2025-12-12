package com.mockInterview.responseDtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDto {

    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String role;
    private String status;
    private String profilePicturePath;

    // ================= Audit Fields =================
    private Long createdBy;
    private Long updatedBy;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
}
