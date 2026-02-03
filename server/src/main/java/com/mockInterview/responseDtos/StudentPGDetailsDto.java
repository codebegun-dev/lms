package com.mockInterview.responseDtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentPGDetailsDto {

    private Long userId;
    private String hasPG;
   
    private String collegeName;
    private String courseName;
    private String branch;
    private Double marksPercentage;
    private Double cgpa;
    private Integer yearOfPassout;
    private String activeBacklogs;

    // ================= AUDIT FIELDS =================
    private LocalDateTime updatedAt;
    private String updatedBy;  // store userId or username as string
}
