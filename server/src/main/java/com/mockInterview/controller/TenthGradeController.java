package com.mockInterview.controller;

import com.mockInterview.entity.TenthGrade;
import com.mockInterview.responseDtos.TenthGradeDto;
import com.mockInterview.service.TenthGradeService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student/tenth-grade")
@CrossOrigin(origins = "*")
public class TenthGradeController {

    @Autowired
    private TenthGradeService tenthGradeService;

    // ================= GET =================
    // View tenth grade details by userId

    @GetMapping("/{userId}")
    public TenthGradeDto getTenthGradeDetails(
            @PathVariable Long userId) {

        return tenthGradeService.getTenthGradeDetails(userId);
    }

    // ================= UPDATE =================
    // Create / Update tenth grade details

    @PutMapping("/update/{userId}")
    @PreAuthorize("hasAuthority('UPDATE_STUDENT')")
    public TenthGradeDto updateTenthGradeDetails(
            @PathVariable Long userId,
            @RequestBody @Valid TenthGrade request) {

        // attach userId safely from path
        if (request.getUser() == null) {
            request.setUser(new com.mockInterview.entity.User());
        }
        request.getUser().setUserId(userId);

        return tenthGradeService.updateTenthGradeDetails(request);
    }
}
