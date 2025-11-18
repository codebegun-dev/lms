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

    @PostMapping("/upload/{userId}")
    public StudentGenericDetailsDto uploadDocument(@PathVariable Long userId,
                                                   @RequestPart("file") MultipartFile file) {
        return genericService.uploadDocument(userId, file);
    }

    @GetMapping("/{userId}")
    public StudentGenericDetailsDto getGenericDetails(@PathVariable Long userId) {
        return genericService.getGenericDetails(userId);
    }

    @GetMapping("/document/{userId}")
    public ResponseEntity<Resource> viewDocument(@PathVariable Long userId) {
        Resource resource = genericService.viewDocument(userId);

        String filename = resource.getFilename();
        MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;

        // Set media type based on file extension
        if (filename != null) {
            String ext = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
            switch (ext) {
                case "pdf":
                    mediaType = MediaType.APPLICATION_PDF;
                    break;
                case "doc":
                    mediaType = MediaType.valueOf("application/msword");
                    break;
                case "docx":
                    mediaType = MediaType.valueOf("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
                    break;
                case "png":
                    mediaType = MediaType.IMAGE_PNG;
                    break;
                case "jpg":
                case "jpeg":
                    mediaType = MediaType.IMAGE_JPEG;
                    break;
                case "txt":
                    mediaType = MediaType.TEXT_PLAIN;
                    break;
                // add more types if needed
            }
        }

        String contentDisposition = "inline; filename=\"" + filename + "\"";

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
                .body(resource);
    }


}
