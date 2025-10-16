package com.mockInterview.requestDtos;

import com.mockInterview.entity.InterviewType;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InterviewRequestDto {
    private Long studentId;
    private InterviewType interviewType;
    private String status; // SCHEDULED, ONGOING, COMPLETED
    private String scheduledTime; // String for frontend date-time
    private String description;
}