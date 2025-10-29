package com.mockInterview.responseDtos;

import lombok.Data;

@Data
public class InterviewMediaPathDto {
    private Long interviewId;
    private String videoPath;
    private String audioPath;
}