package com.mockInterview.apiAnalyzer;

import com.mockInterview.responseDtos.AudioAnalysisResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

@RestController
@RequestMapping("/api/audio")
public class AudioController {

    @Autowired
    private AudioAnalysisService audioService;

    @PostMapping("/analyze")
    public ResponseEntity<AudioAnalysisResponse> analyzeAudio(@RequestParam("file") MultipartFile file) {
        File tempFile = null;
        try {
            // Save uploaded file temporarily
            tempFile = File.createTempFile("audio_", "_" + file.getOriginalFilename());
            try (FileOutputStream fos = new FileOutputStream(tempFile)) {
                fos.write(file.getBytes());
            }

            // Call Flask + parse JSON inside service
            AudioAnalysisResponse responseDto = audioService.analyzeAudio(tempFile);

            return ResponseEntity.ok(responseDto);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        } finally {
            if (tempFile != null && tempFile.exists()) {
                tempFile.delete();
            }
        }
    }
}
