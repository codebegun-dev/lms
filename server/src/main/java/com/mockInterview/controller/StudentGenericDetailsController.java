package com.mockInterview.controller;


import com.mockInterview.entity.StudentGenericDetails;
import com.mockInterview.responseDtos.StudentGenericDetailsResponseDto;
import com.mockInterview.security.annotations.ModulePermission;
import com.mockInterview.service.StudentGenericDetailsService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@ModulePermission("STUDENT_MANAGEMENT")
@RestController
@RequestMapping("/api/students/generic-details")
public class StudentGenericDetailsController {

    @Autowired
    private StudentGenericDetailsService genericDetailsService;

    // ==================== UPDATE GENERIC DETAILS ====================
    @PutMapping("/{userId}")
	@PreAuthorize("hasAuthority('UPDATE_STUDENT')")
    public StudentGenericDetailsResponseDto updateStudentGenericDetails(
            @PathVariable Long userId,
            @RequestPart("data") String data,
            @RequestPart(value = "adhaarFile", required = false) MultipartFile adhaarFile,
            @RequestPart(value = "resumeFile", required = false) MultipartFile resumeFile
    ) throws IOException {

        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());

        StudentGenericDetails request =
                mapper.readValue(data, StudentGenericDetails.class);

        return genericDetailsService.updateStudentGenericDetails(
                userId, request, adhaarFile, resumeFile
        );
    }

    // ==================== GET GENERIC DETAILS ====================
    @GetMapping("/{userId}")
    public StudentGenericDetailsResponseDto getStudentGenericDetails(
            @PathVariable Long userId) {

        return genericDetailsService.getByUserId(userId);
    }
}
