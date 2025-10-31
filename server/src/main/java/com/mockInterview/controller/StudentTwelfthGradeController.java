package com.mockInterview.controller;

import com.mockInterview.responseDtos.StudentTwelfthGradeDto;
import com.mockInterview.service.StudentTwelfthGradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/twelfth-grade")
@CrossOrigin(origins = "*")
public class StudentTwelfthGradeController {

    @Autowired
    private StudentTwelfthGradeService twelfthGradeService;

    // ✅ Fetch 12th grade details by userId
    @GetMapping("/{userId}")
    public StudentTwelfthGradeDto getTwelfthGradeDetails(@PathVariable Long userId) {
        return twelfthGradeService.getTwelfthGradeDetails(userId);
    }

    // ✅ Update or create 12th grade details
    @PutMapping
    public StudentTwelfthGradeDto updateTwelfthGradeDetails(@RequestBody StudentTwelfthGradeDto dto) {
        return twelfthGradeService.updateTwelfthGradeDetails(dto);
    }
}
