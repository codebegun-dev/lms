package com.mockInterview.responseDtos;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentInterviewWithRecordingsDto {
    private Long interviewId;
    private String round;
    private String status;
    private Long durationSeconds;
    private String startTime;
    private String endTime;

    private List<InterviewRecordingResponseDto> recordings;

    
}
