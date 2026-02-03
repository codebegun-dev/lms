package com.mockInterview.responseDtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentPersonalInfoResponseDto {

    // ---------- USER ----------
    private Long userId;
    private String email;
    private String phone;

    // ---------- STUDENT BASIC PROFILE ----------
    private String firstName;
    private String lastName;

    // ---------- PERSONAL INFO ----------
    private String gender;
    private LocalDate dateOfBirth;
    private String parentMobileNumber;
    private String bloodGroup;
    private String profilePicturePath;

    // ---------- AUDIT INFO ----------
    private LocalDateTime updatedAt;
    private String updatedBy;
}
