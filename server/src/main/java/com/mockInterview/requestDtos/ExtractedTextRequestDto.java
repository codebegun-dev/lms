package com.mockInterview.requestDtos;

import lombok.Data;

@Data
public class ExtractedTextRequestDto {
    private Long interviewId;
    private String transcript;
}