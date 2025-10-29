package com.mockInterview.responseDtos;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ExtractedTextDto {
    private Long interviewId;
    private String transcript;
    private LocalDateTime extractedAt;
}