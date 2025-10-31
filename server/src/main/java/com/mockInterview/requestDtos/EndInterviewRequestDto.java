package com.mockInterview.requestDtos;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class EndInterviewRequestDto {
    private Long interviewId;
    private MultipartFile videoFile;
    private MultipartFile audioFile;
}
