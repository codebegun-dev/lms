package com.mockInterview.requestDtos;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class InterviewRecordingRequestDto {
    private MultipartFile videoAudioFile;
    private MultipartFile audioFile;
    private MultipartFile textFile;
}
