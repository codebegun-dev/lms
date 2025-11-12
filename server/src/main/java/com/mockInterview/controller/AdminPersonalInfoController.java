package com.mockInterview.controller;

import com.mockInterview.requestDtos.AdminPersonalInfoUpdateRequestDto;
import com.mockInterview.responseDtos.AdminPersonalInfoResponseDto;
import com.mockInterview.service.AdminPersonalInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/personal-info")
@CrossOrigin(origins = "*")
public class AdminPersonalInfoController {

    @Autowired
    private AdminPersonalInfoService service;

    // ✅ Combined update for details + profile image
    @PutMapping("/update")
    public AdminPersonalInfoResponseDto updateAll(
            @RequestPart("info") AdminPersonalInfoUpdateRequestDto request,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        return service.updateFullProfile(request, file);
    }

    // ✅ Get info by userId
    @GetMapping("/{userId}")
    public AdminPersonalInfoResponseDto getInfo(@PathVariable Long userId) {
        return service.getByUserId(userId);
    }
}
