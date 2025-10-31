package com.mockInterview.controller;

import com.mockInterview.responseDtos.FeeDetailsDto;
import com.mockInterview.service.FeeDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student/fee-details")
@CrossOrigin(origins = "*")
public class FeeDetailsController {

    @Autowired
    private FeeDetailsService feeService;

    @GetMapping("/{userId}")
    public FeeDetailsDto getFeeDetails(@PathVariable Long userId) {
        return feeService.getFeeDetailsForStudent(userId);
    }
}
