package com.mockInterview.controller;

import com.mockInterview.responseDtos.StudentUGDetailsDto;
import com.mockInterview.service.StudentUGDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/student/ug-details")
@CrossOrigin(origins = "*")
public class StudentUGDetailsController {

    @Autowired
    private StudentUGDetailsService ugService;

    @GetMapping("/{userId}")
    public StudentUGDetailsDto getUGDetails(@PathVariable Long userId) {
        return ugService.getByUserId(userId);
    }

    @PutMapping("/update")
    public StudentUGDetailsDto updateUGDetails(@RequestBody @Valid StudentUGDetailsDto dto) {
        return ugService.updateDetails(dto);
    }
}
