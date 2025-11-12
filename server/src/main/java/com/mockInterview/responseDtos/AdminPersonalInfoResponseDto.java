package com.mockInterview.responseDtos;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class AdminPersonalInfoResponseDto {
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String gender;
    private LocalDate dateOfBirth;
    private String bloodGroup;
    private String profilePicturePath;
}
