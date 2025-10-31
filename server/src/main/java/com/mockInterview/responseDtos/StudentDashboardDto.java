package com.mockInterview.responseDtos;

import lombok.Data;

@Data
public class StudentDashboardDto {
    private Long studentId;
    private String studentName;
    private String studentEmail;

    private int totalFixed = 5; // fixed number of interviews
    private int started;
    private int completed;
    private int remaining;
}
