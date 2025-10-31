package com.mockInterview.controller;


import com.mockInterview.entity.MediaFile;
import com.mockInterview.service.MediaFileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.time.LocalDateTime;
import java.util.HashMap;

// Add logger if not present
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@RestController
@RequestMapping("/api/media")
@CrossOrigin(origins = "*") // Allow frontend applications
public class MediaFileController {
	private static final Logger logger = LoggerFactory.getLogger(MediaFileController.class);
    
    @Autowired
    private MediaFileService mediaFileService;
    
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "duration", required = false) String duration) {
        
        try {
            // Check file size before processing
            if (file.getSize() > (500 * 1024 * 1024)) { // 500MB in bytes
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("File size too large. Maximum allowed size is 500MB.");
            }
            
            // Parse duration safely
            Long durationLong = null;
            if (duration != null && !duration.trim().isEmpty()) {
                try {
                    String cleanDuration = duration.replace("\"", "").trim();
                    durationLong = Long.parseLong(cleanDuration);
                } catch (NumberFormatException e) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body("Invalid duration format. Please provide a number without quotes.");
                }
            }
            
            MediaFile mediaFile = mediaFileService.storeFile(file, description, durationLong);
            return ResponseEntity.ok(mediaFile);
            
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Could not upload file: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }
    
    @GetMapping
    public List<MediaFile> getAllFiles() {
        return mediaFileService.getAllFiles();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<MediaFile> getFile(@PathVariable Long id) {
        Optional<MediaFile> mediaFile = mediaFileService.getFile(id);
        return mediaFile.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadFile(@PathVariable Long id) {
        try {
            Optional<MediaFile> mediaFile = mediaFileService.getFile(id);
            if (mediaFile.isPresent()) {
                byte[] fileContent = mediaFileService.getFileContent(id);
                
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.parseMediaType(mediaFile.get().getMimeType()));
                headers.setContentDispositionFormData("attachment", mediaFile.get().getOriginalFileName());
                headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
                
                return new ResponseEntity<>(fileContent, headers, HttpStatus.OK);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/type/{fileType}")
    public List<MediaFile> getFilesByType(@PathVariable String fileType) {
        return mediaFileService.getFilesByType(fileType);
    }
    
    @GetMapping("/{id}/stream")
    public ResponseEntity<byte[]> streamFile(@PathVariable Long id) {
        try {
            Optional<MediaFile> mediaFile = mediaFileService.getFile(id);
            if (mediaFile.isPresent()) {
                byte[] fileContent = mediaFileService.getFileContent(id);
                
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.parseMediaType(mediaFile.get().getMimeType()));
                headers.setContentLength(fileContent.length);
                
                return new ResponseEntity<>(fileContent, headers, HttpStatus.OK);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFile(@PathVariable Long id) {
        try {
            mediaFileService.deleteFile(id);
            return ResponseEntity.ok().body("File deleted successfully");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Could not delete file: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }
    @PostMapping("/{id}/analyze")
    public ResponseEntity<?> analyzeAudioFile(@PathVariable Long id) {
        try {
            logger.info("Starting AI analysis for media file ID: " + id);
            
            String analysisResult = mediaFileService.analyzeAudioWithAI(id);
            JSONObject jsonResponse = new JSONObject(analysisResult);
            
            return ResponseEntity.ok(jsonResponse.toMap());
            
        } catch (IllegalArgumentException e) {
            logger.error("Analysis failed - client error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        } catch (IOException e) {
            logger.error("Analysis failed - server error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("AI analysis service unavailable: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}/analysis")
    public ResponseEntity<?> getAnalysisResults(@PathVariable Long id) {
        try {
            String analysisResult = mediaFileService.getAnalysisResults(id);
            JSONObject jsonResponse = new JSONObject(analysisResult);
            
            return ResponseEntity.ok(jsonResponse.toMap());
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to retrieve analysis: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}/analysis-status")
    public ResponseEntity<?> getAnalysisStatus(@PathVariable Long id) {
        String status = mediaFileService.getAnalysisStatus(id);
        
        HashMap<String, Object> response = new HashMap<>();
        response.put("media_file_id", id);
        response.put("analysis_status", status);
        response.put("timestamp", LocalDateTime.now().toString());
        
        return ResponseEntity.ok(response);
    }

    // Helper method for error responses
    private HashMap<String, Object> createErrorResponse(String message) {
        HashMap<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        errorResponse.put("error", message);
        errorResponse.put("timestamp", LocalDateTime.now().toString());
        return errorResponse;
    }
}
