package com.mockInterview.responseDtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentPersonalInfoDto {
    private Long userId;
    private String firstName;      // From User table
    private String lastName;       // From User table
    private String mobileNumber;   // From User table
    private String surName;
    private String gender;
    private LocalDate dateOfBirth;
    private String parentMobileNumber;
    private String bloodGroup;
    private String profilePicturePath; // Path to image
}
