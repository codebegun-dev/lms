package com.mockInterview.responseDtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentUGDetailsDto {

    private Long userId;

    private String universityRollNo;

    private String collegeName;

    private String courseName;

    private String branch;

    private Integer yearOfPassout;

    private Double marksPercentage;

    private Double cgpa;

    private String activeBacklogs;

    // ================= AUDIT FIELDS =================

    private LocalDateTime updatedAt;

    private String updatedBy;
}
