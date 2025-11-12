package com.mockInterview.controller;

import com.mockInterview.requestDtos.StudentPersonalInfoUpdateRequest;
import com.mockInterview.responseDtos.StudentPersonalInfoDto;
import com.mockInterview.service.StudentPersonalInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/student/personal-info")
@CrossOrigin(origins = "*")
public class StudentPersonalInfoController {

    @Autowired
    private StudentPersonalInfoService infoService;

    // ✅ Combined update for both details and profile image
    @PutMapping("/update")
    public StudentPersonalInfoDto updateAll(
            @RequestPart("info") StudentPersonalInfoUpdateRequest request,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        return infoService.updateAll(request, file);
    }


    @GetMapping("/{userId}")
    public StudentPersonalInfoDto getInfo(@PathVariable Long userId) {
        return infoService.getByUserId(userId);
    }
}
