package com.mockInterview.controller;

import com.mockInterview.requestDtos.StudentInterviewRequestDto;
import com.mockInterview.responseDtos.QuestionBankResponseDto;
import com.mockInterview.responseDtos.StartInterviewResponseDto;
import com.mockInterview.responseDtos.StudentInterviewResponseDto;
import com.mockInterview.security.annotations.ModulePermission;
import com.mockInterview.service.StudentInterviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@ModulePermission("STUDENT_MANAGEMENT")
@RestController
@RequestMapping("/api/interviews")
@CrossOrigin(origins = "*")
public class StudentInterviewController {

    @Autowired
    private StudentInterviewService studentInterviewService;

    // ---------------- START INTERVIEW ----------------
    @PostMapping("/start")
    public StartInterviewResponseDto startInterview(@RequestBody StudentInterviewRequestDto requestDto) {
        // ✅ requestDto should contain: studentId & categoryId
        return studentInterviewService.startInterview(requestDto);
    }

    @GetMapping("/{interviewId}/next-question")
    public QuestionBankResponseDto getNextQuestion(@PathVariable Long interviewId) {
        return studentInterviewService.getNextQuestion(interviewId);
    }


    // ---------------- ALL INTERVIEWS BY STUDENT ----------------
    @GetMapping("/student/{studentId}")
    public List<StudentInterviewResponseDto> getInterviewsByStudent(
            @PathVariable Long studentId
    ) {
        return studentInterviewService.getInterviewsByStudent(studentId);
    }
    
    @PostMapping("/end")
    public StudentInterviewResponseDto endInterview(
            @RequestParam Long interviewId,
            @RequestParam("videoFile") MultipartFile videoFile,
            @RequestParam("audioFile") MultipartFile audioFile
    ) {
        return studentInterviewService.endInterview(interviewId, videoFile, audioFile);
    }

}
