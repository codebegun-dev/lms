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

    @PutMapping("/update")
    public StudentPersonalInfoDto updateInfo(@RequestBody StudentPersonalInfoUpdateRequest request) {
        return infoService.updateInfo(request);
    }


    @PostMapping("/upload-image/{userId}")
    public StudentPersonalInfoDto uploadProfileImage(@PathVariable Long userId,
                                                     @RequestPart("file") MultipartFile file) {
        return infoService.updateProfileImage(userId, file);
    }

    @GetMapping("/{userId}")
    public StudentPersonalInfoDto getInfo(@PathVariable Long userId) {
        return infoService.getByUserId(userId);
    }
}
