package com.mockInterview.controller;

import com.mockInterview.responseDtos.StudentGenericDetailsDto;
import com.mockInterview.service.StudentGenericDetailsService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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

    // ✅ New endpoint to view/download document
    @GetMapping("/{userId}/document/{type}")
    public ResponseEntity<Resource> viewDocument(@PathVariable Long userId,
                                                 @PathVariable String type) {
        Resource resource = genericService.viewDocument(userId, type);

        String contentDisposition = "inline; filename=\"" + resource.getFilename() + "\"";

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
                .body(resource);
    }
}
