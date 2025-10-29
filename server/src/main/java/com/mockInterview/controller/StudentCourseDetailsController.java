package com.mockInterview.controller;

import com.mockInterview.responseDtos.StudentCourseDetailsDto;
import com.mockInterview.service.StudentCourseDetailsService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student/course-details")
@CrossOrigin(origins = "*")
public class StudentCourseDetailsController {

    @Autowired
    private StudentCourseDetailsService service;

    @GetMapping("/{userId}")
    public StudentCourseDetailsDto getCourseDetails(@PathVariable Long userId) {
        return service.getByUserId(userId);
    }

    @PutMapping("/update")
    public StudentCourseDetailsDto updateCourseDetails(@Valid @RequestBody StudentCourseDetailsDto dto) {
        return service.updateCourseDetails(dto);
    }
}
