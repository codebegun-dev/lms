package com.mockInterview.requestDtos;

import lombok.Data;

@Data
public class InterviewMediaPathRequestDto {
    private Long interviewId;
    private String videoPath;
    private String audioPath;
}