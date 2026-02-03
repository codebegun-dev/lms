package com.mockInterview.controller;

import com.mockInterview.entity.StudentPGDetails;
import com.mockInterview.responseDtos.StudentPGDetailsDto;
import com.mockInterview.service.StudentPGDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/student/pg-details")
@CrossOrigin(origins = "*")
public class StudentPGDetailsController {

    @Autowired
    private StudentPGDetailsService pgService;

    // GET PG details by userId
    @GetMapping("/{userId}")
    public StudentPGDetailsDto getPGDetails(@PathVariable Long userId) {
        return pgService.getByUserId(userId);
    }

    // UPDATE PG details by userId
    @PutMapping("/update/{userId}")
    @PreAuthorize("hasAuthority('UPDATE_STUDENT')")
    public StudentPGDetailsDto updatePGDetails(
            @PathVariable Long userId,
            @RequestBody @Valid StudentPGDetails dto) {

        // Set the user with only userId
        dto.setUser(new com.mockInterview.entity.User());
        dto.getUser().setUserId(userId);

        return pgService.updateDetails(dto);
    }
} 
