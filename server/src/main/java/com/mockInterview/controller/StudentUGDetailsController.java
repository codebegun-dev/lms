package com.mockInterview.controller;

import com.mockInterview.entity.StudentUGDetails;
import com.mockInterview.responseDtos.StudentUGDetailsDto;
import com.mockInterview.service.StudentUGDetailsService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student/ug-details")
@CrossOrigin(origins = "*")
public class StudentUGDetailsController {

    @Autowired
    private StudentUGDetailsService ugDetailsService;

    // ================= GET UG DETAILS =================
    @GetMapping("/{userId}")
    public StudentUGDetailsDto getUGDetails(
            @PathVariable Long userId) {

        return ugDetailsService.getByUserId(userId);
    }

    // ================= UPDATE UG DETAILS =================
    @PutMapping("/{userId}/update")
    @PreAuthorize("hasAuthority('UPDATE_STUDENT')")
    public StudentUGDetailsDto updateUGDetails(
            @PathVariable Long userId,
            @RequestBody @Valid StudentUGDetails request) {

        // attach userId to entity (important)
        if (request.getUser() == null) {
            request.setUser(new com.mockInterview.entity.User());
        }
        request.getUser().setUserId(userId);

        return ugDetailsService.updateDetails(request);
    }
}
