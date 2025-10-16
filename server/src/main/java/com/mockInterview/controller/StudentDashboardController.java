package com.mockInterview.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.mockInterview.requestDtos.InterviewRequestDto;
import com.mockInterview.responseDtos.InterviewResponseDto;
import com.mockInterview.responseDtos.InterviewTrackingResponse;
import com.mockInterview.service.StudentDashboardService;

@RestController
@RequestMapping("/api/student-dashboard")
@CrossOrigin(origins = "*")
public class StudentDashboardController {

    @Autowired
    private StudentDashboardService dashboardService;

    // 1️⃣ Fixed Interview Tracking — Static / Fixed Data
    @GetMapping("/tracking")
    public List<InterviewTrackingResponse> getTracking() {
        return dashboardService.getFixedInterviewTracking();
    }

    // 2️⃣ Start Interview (camera + 30-min timer)
    @PostMapping("/start-interview")
    public InterviewResponseDto startInterview(@RequestBody InterviewRequestDto dto) {
        return dashboardService.startInterview(dto);
    }

    // 3️⃣ Schedule Interview (calendar based — optional)
    @PostMapping("/schedule")
    public InterviewResponseDto scheduleInterview(@RequestBody InterviewRequestDto dto) {
        return dashboardService.scheduleInterview(dto);
    }

    // 4️⃣ Get all interviews by student
    @GetMapping("/interviews/{studentId}")
    public List<InterviewResponseDto> getInterviewsByStudent(@PathVariable Long studentId) {
        return dashboardService.getAllInterviewsByStudent(studentId);
    }
}
