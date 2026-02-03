package com.mockInterview.controller;

import com.mockInterview.entity.StudentTwelfthGrade;
import com.mockInterview.responseDtos.StudentTwelfthGradeDto;
import com.mockInterview.service.StudentTwelfthGradeService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student/twelfth-grade")
@CrossOrigin(origins = "*")
public class StudentTwelfthGradeController {

    @Autowired
    private StudentTwelfthGradeService twelfthGradeService;

    // ================= GET =================
    // View twelfth grade details by userId

    @GetMapping("/{userId}")
    public StudentTwelfthGradeDto getTwelfthGradeDetails(
            @PathVariable Long userId) {

        return twelfthGradeService.getTwelfthGradeDetails(userId);
    }

    // ================= UPDATE =================
    // Create / Update twelfth grade details

    @PutMapping("/update/{userId}")
    @PreAuthorize("hasAuthority('UPDATE_STUDENT')")
    public StudentTwelfthGradeDto updateTwelfthGradeDetails(
            @PathVariable Long userId,
            @RequestBody @Valid StudentTwelfthGrade request) {

        // attach userId safely from path
        if (request.getUser() == null) {
            request.setUser(new com.mockInterview.entity.User());
        }
        request.getUser().setUserId(userId);

        return twelfthGradeService.updateTwelfthGradeDetails(request);
    }
}
