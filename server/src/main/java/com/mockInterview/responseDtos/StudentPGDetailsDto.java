package com.mockInterview.responseDtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentPGDetailsDto {
    private Long userId;
    private boolean hasPG;
    private boolean hasBacklogs;
    private String collegeName;
    private String courseName;
    private String branch;
    private Double marksPercentage;
    private Double cgpa;
    private Integer yearOfPassout;
    private Integer activeBacklogs;
}
