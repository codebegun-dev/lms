package com.mockInterview.controller;

import com.mockInterview.responseDtos.StudentGenericDetailsDto;
import com.mockInterview.service.StudentGenericDetailsService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/student-generic-details")
@CrossOrigin(origins = "*")
public class StudentGenericDetailsController {

    @Autowired
    private StudentGenericDetailsService genericService;

    @PutMapping("/update")
    public StudentGenericDetailsDto updateGenericDetails(@Valid @RequestBody StudentGenericDetailsDto dto) {
        return genericService.updateGenericDetails(dto);
    }

    @PostMapping("/upload/{userId}/{type}")
    public StudentGenericDetailsDto uploadDocument(@PathVariable Long userId,
                                                   @PathVariable String type,
                                                   @RequestPart("file") MultipartFile file) {
        return genericService.uploadDocument(userId, type, file);
    }

    @GetMapping("/{userId}")
    public StudentGenericDetailsDto getGenericDetails(@PathVariable Long userId) {
        return genericService.getGenericDetails(userId);
    }
}
