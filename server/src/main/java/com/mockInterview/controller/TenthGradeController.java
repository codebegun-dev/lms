package com.mockInterview.controller;

import com.mockInterview.responseDtos.TenthGradeDto;
import com.mockInterview.service.TenthGradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tenth-grade")
@CrossOrigin(origins = "*")
public class TenthGradeController {

    @Autowired
    private TenthGradeService tenthGradeService;

    // ✅ Get Tenth grade details by userId
    @GetMapping("/{userId}")
    public TenthGradeDto getTenthGradeDetails(@PathVariable Long userId) {
        return tenthGradeService.getTenthGradeDetails(userId);
    }

    // ✅ Update or Save Tenth grade details
    @PutMapping
    public TenthGradeDto updateTenthGradeDetails(@RequestBody TenthGradeDto dto) {
        return tenthGradeService.updateTenthGradeDetails(dto);
    }
}
