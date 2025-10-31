package com.mockInterview.responseDtos;

import lombok.Data;

@Data
public class StudentDashboardDto {
    private Long studentId;
    private String studentName;
    private String studentEmail;

    private int totalFixed = 5; // fixed value (as per your requirement)
    private int started;
    private int completed;
    private int remaining;

    public void calculateRemaining() {
        this.remaining = totalFixed - completed;
        if (this.remaining < 0) {
            this.remaining = 0;
        }
    }
}
