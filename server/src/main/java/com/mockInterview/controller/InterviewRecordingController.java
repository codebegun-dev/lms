package com.mockInterview.controller;

import com.mockInterview.responseDtos.InterviewRecordingResponseDto;
import com.mockInterview.service.InterviewRecordingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/recordings")
public class InterviewRecordingController {

    @Autowired
    private InterviewRecordingService recordingService;

    @PostMapping("/upload/{interviewId}")
    public ResponseEntity<InterviewRecordingResponseDto> uploadRecording(
            @PathVariable Long interviewId,
            @RequestParam(value = "videoAudioFile", required = false) MultipartFile videoAudioFile,
            @RequestParam(value = "audioFile", required = false) MultipartFile audioFile,
            @RequestParam(value = "textFile", required = false) MultipartFile textFile) throws Exception {

        InterviewRecordingResponseDto response =
                recordingService.saveRecording(interviewId, videoAudioFile, audioFile, textFile);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{interviewId}")
    public ResponseEntity<List<InterviewRecordingResponseDto>> getRecordings(
            @PathVariable Long interviewId) {

        List<InterviewRecordingResponseDto> response = recordingService.getRecordingsByInterview(interviewId);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<InterviewRecordingResponseDto>> getRecordingsByUser(@PathVariable Long userId) {
        List<InterviewRecordingResponseDto> response = recordingService.getRecordingsByUser(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/interview/{interviewId}/user/{userId}")
    public ResponseEntity<List<InterviewRecordingResponseDto>> getRecordingsByInterviewAndUser(
            @PathVariable Long interviewId,
            @PathVariable Long userId) {

        List<InterviewRecordingResponseDto> response = recordingService.getRecordingsByInterviewAndUser(interviewId, userId);
        return ResponseEntity.ok(response);
    }


}
