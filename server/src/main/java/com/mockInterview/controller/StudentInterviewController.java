package com.mockInterview.controller;

import com.mockInterview.requestDtos.StudentInterviewRequestDto;
import com.mockInterview.responseDtos.InterviewSummaryResponse;
import com.mockInterview.responseDtos.StudentInterviewResponseDto;
import com.mockInterview.service.StudentInterviewService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/interviews")
@CrossOrigin(origins = "*")
public class StudentInterviewController {

    @Autowired
    private StudentInterviewService studentInterviewService;

    // ---------------- START INTERVIEW ----------------
    @PostMapping("/start")
    public ResponseEntity<StudentInterviewResponseDto> startInterview(
            @RequestBody StudentInterviewRequestDto requestDto) {
        StudentInterviewResponseDto response = studentInterviewService.startInterview(requestDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // ---------------- GET INTERVIEWS BY STUDENT ----------------
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<StudentInterviewResponseDto>> getInterviewsByStudent(@PathVariable Long studentId) {
        List<StudentInterviewResponseDto> interviews = studentInterviewService.getInterviewsByStudent(studentId);
        return ResponseEntity.ok(interviews);
    }

    // ---------------- COMPLETE INTERVIEW ----------------
    @PutMapping("/{interviewId}/complete")
    public ResponseEntity<StudentInterviewResponseDto> completeInterview(@PathVariable Long interviewId) {
        StudentInterviewResponseDto response = studentInterviewService.completeInterview(interviewId);
        return ResponseEntity.ok(response);
    }

 // ---------------- END INTERVIEW (UPLOAD AUDIO + VIDEO + ANALYZE) ----------------
    @PostMapping("/{interviewId}/end")
    public ResponseEntity<InterviewSummaryResponse> endInterview(
            @PathVariable Long interviewId,
            @RequestParam("audioFile") MultipartFile audioFile,
            @RequestParam("videoFile") MultipartFile videoFile) {

        // Call service method with both audio and video
        InterviewSummaryResponse response = studentInterviewService.endInterview(interviewId, audioFile, videoFile);
        return ResponseEntity.ok(response);
    }

}
