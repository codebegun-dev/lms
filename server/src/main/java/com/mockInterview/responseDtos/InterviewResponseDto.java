package com.mockInterview.responseDtos;

import com.mockInterview.entity.InterviewType;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InterviewResponseDto {
    private Long id;
    private InterviewType interviewType;
    private String status;
    private String scheduledTime;
    private String startedAt;
    private String endedAt;
    private String description;
}