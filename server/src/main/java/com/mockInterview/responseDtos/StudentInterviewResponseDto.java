package com.mockInterview.responseDtos;

import com.mockInterview.entity.InterviewRound;
import com.mockInterview.entity.InterviewStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class StudentInterviewResponseDto {
    private Long interviewId;
    private Long studentId;
    private InterviewRound round;
    private InterviewStatus status;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Long durationSeconds;
}
