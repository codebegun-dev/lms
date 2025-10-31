package com.mockInterview.responseDtos;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class InterviewRecordingResponseDto {
    private Long recordingId;
    private Long userId;
    private Long interviewId;
    private String videoFilePath;
    private String audioFilePath;
    private String textFilePath;
    private LocalDateTime uploadedAt;
}
