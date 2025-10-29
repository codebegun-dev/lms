package com.mockInterview.service;



import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class AudioProcessingService {
    
    private final Path audioStorageLocation;
    
    public AudioProcessingService() {
        this.audioStorageLocation = Paths.get("temp-audio-uploads")
                .toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.audioStorageLocation);
            System.out.println("Audio storage directory created: " + this.audioStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create audio upload directory", ex);
        }
    }
    
    public String saveAudioFile(MultipartFile file) {
        try {
            String fileName = UUID.randomUUID().toString() + "_" + 
                file.getOriginalFilename().replace(" ", "_");
            Path targetLocation = this.audioStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            System.out.println("Audio file saved: " + targetLocation.toString());
            return targetLocation.toString();
        } catch (IOException ex) {
            throw new RuntimeException("Could not save audio file: " + ex.getMessage(), ex);
        }
    }
    
    public byte[] readAudioFile(String filePath) {
        try {
            byte[] data = Files.readAllBytes(Paths.get(filePath));
            System.out.println("Read audio file: " + filePath + " (" + data.length + " bytes)");
            return data;
        } catch (IOException ex) {
            throw new RuntimeException("Could not read audio file: " + filePath, ex);
        }
    }
    
    public void validateAudioFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Audio file is empty or null");
        }
        
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new RuntimeException("File size exceeds 10MB limit");
        }
        
        String contentType = file.getContentType();
        String fileName = file.getOriginalFilename();
        
        if (fileName == null) {
            throw new RuntimeException("File name is null");
        }
        
        fileName = fileName.toLowerCase();
        
        boolean isAudioFile = (contentType != null && contentType.startsWith("audio/")) ||
                             fileName.endsWith(".mp3") || 
                             fileName.endsWith(".wav") ||
                             fileName.endsWith(".m4a") ||
                             fileName.endsWith(".flac");
        
        if (!isAudioFile) {
            throw new RuntimeException("Invalid file type. Please upload MP3, WAV, M4A, or FLAC");
        }
        
        System.out.println("Audio file validated: " + fileName + " (" + contentType + ")");
    }
    
    public void cleanupFile(String filePath) {
        try {
            Files.deleteIfExists(Paths.get(filePath));
            System.out.println("Temporary file deleted: " + filePath);
        } catch (IOException e) {
            System.err.println("Failed to delete file: " + filePath);
        }
    }
}

