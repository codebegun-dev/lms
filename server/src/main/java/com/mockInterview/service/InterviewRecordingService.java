package com.mockInterview.service;

import com.mockInterview.responseDtos.InterviewRecordingResponseDto;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface InterviewRecordingService {

    InterviewRecordingResponseDto saveRecording(Long interviewId,
                                                MultipartFile videoAudioFile,
                                                MultipartFile audioFile,
                                                MultipartFile textFile);

    List<InterviewRecordingResponseDto> getRecordingsByInterview(Long interviewId);
    List<InterviewRecordingResponseDto> getRecordingsByUser(Long userId);
    public List<InterviewRecordingResponseDto> getRecordingsByInterviewAndUser(Long interviewId, Long userId);
}
