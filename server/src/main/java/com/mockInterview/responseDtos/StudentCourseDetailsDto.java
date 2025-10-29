package com.mockInterview.responseDtos;

import lombok.Data;
import java.time.LocalDate;

@Data
public class StudentCourseDetailsDto {
    private Long id;
    private Long userId;
    private String courseName;
    private String batchName;
    private LocalDate courseStartDate;  
}
