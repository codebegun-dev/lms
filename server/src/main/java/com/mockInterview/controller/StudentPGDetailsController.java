package com.mockInterview.controller;

import com.mockInterview.responseDtos.StudentPGDetailsDto;
import com.mockInterview.service.StudentPGDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/student/pg-details")
@CrossOrigin(origins = "*")
public class StudentPGDetailsController {

    @Autowired
    private StudentPGDetailsService pgService;

    @GetMapping("/{userId}")
    public StudentPGDetailsDto getPGDetails(@PathVariable Long userId) {
        return pgService.getByUserId(userId);
    }

    @PutMapping("/update")
    public StudentPGDetailsDto updatePGDetails(@RequestBody @Valid StudentPGDetailsDto dto) {
        return pgService.updateDetails(dto);
    }
}
