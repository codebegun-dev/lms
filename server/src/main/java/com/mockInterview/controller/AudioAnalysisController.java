package com.mockInterview.controller;
import com.mockInterview.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.mockInterview.service.AudioAnalysisServiceReal;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/audio-analysis")
@CrossOrigin(origins = "*")
public class AudioAnalysisController {

 @Autowired
 private AudioAnalysisServiceReal audioAnalysisService;

 private final String UPLOAD_DIR = "uploads/";

 @PostMapping("/analyze")
 public ResponseEntity<AnalysisResponse> analyzeAudio(@RequestParam("audioFile") MultipartFile audioFile) {
     try {
         // Create upload directory if it doesn't exist
         Files.createDirectories(Paths.get(UPLOAD_DIR));
         
         // Validate file type
         String contentType = audioFile.getContentType();
         if (contentType == null || !contentType.startsWith("audio/")) {
             return ResponseEntity.badRequest().body(
                 new AnalysisResponse("Error: Please upload an audio file")
             );
         }

         // Save uploaded file
         String fileName = System.currentTimeMillis() + "_" + audioFile.getOriginalFilename();
         Path filePath = Paths.get(UPLOAD_DIR + fileName);
         Files.write(filePath, audioFile.getBytes());

         // Call Python service for analysis
         AnalysisResponse response = audioAnalysisService.analyzeAudio(filePath.toString());
         
         // Clean up uploaded file
         Files.deleteIfExists(filePath);
         
         return ResponseEntity.ok(response);

     } catch (IOException e) {
         return ResponseEntity.internalServerError().body(
             new AnalysisResponse("Error processing audio file: " + e.getMessage())
         );
     } catch (Exception e) {
         return ResponseEntity.internalServerError().body(
             new AnalysisResponse("Analysis error: " + e.getMessage())
         );
     }
 }

 @GetMapping("/health")
 public ResponseEntity<String> healthCheck() {
     return ResponseEntity.ok("AI Audio Analyzer is running!");
 }
}

