package com.mockInterview.requestDtos;

import lombok.Data;
import java.time.LocalDate;

@Data
public class StudentPersonalInfoUpdateRequest {
    private Long userId;               
    private String surName;
    private String gender;
    private LocalDate dateOfBirth;
    private String parentMobileNumber;
    private String bloodGroup;
}
