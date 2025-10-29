package com.mockInterview.service;



import com.mockInterview.entity.MediaFile;
import com.mockInterview.repository.MediaFileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.json.JSONObject;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@Service
public class MediaFileService {
    
    @Autowired
    private MediaFileRepository mediaFileRepository;
 // Add this with your other @Autowired fields
    private final Map<Long, String> analysisStatus = new ConcurrentHashMap<>();
    @Value("${file.upload-dir}")
    private String uploadDir;
    
    public MediaFile storeFile(MultipartFile file, String description, Long duration) throws IOException {
        // Validate file
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        
        // Determine file type
        String fileType = determineFileType(file.getContentType());
        if (fileType == null) {
            throw new IllegalArgumentException("Unsupported file type");
        }
        
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir + fileType + "s/");
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // Generate unique filename
        String originalFileName = file.getOriginalFilename();
        String fileExtension = getFileExtension(originalFileName);
        String fileName = UUID.randomUUID().toString() + fileExtension;
        
        // Save file to disk
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        // Create and save media file record
        MediaFile mediaFile = new MediaFile(
            fileName,
            originalFileName,
            fileType,
            file.getContentType(),
            file.getSize(),
            filePath.toString()
        );
        mediaFile.setDescription(description);
        mediaFile.setDuration(duration);
        
        return mediaFileRepository.save(mediaFile);
    }
    
    public Optional<MediaFile> getFile(Long id) {
        return mediaFileRepository.findById(id);
    }
    
    public List<MediaFile> getAllFiles() {
        return mediaFileRepository.findAll();
    }
    
    public List<MediaFile> getFilesByType(String fileType) {
        return mediaFileRepository.findByFileType(fileType);
    }
    
    public byte[] getFileContent(Long id) throws IOException {
        Optional<MediaFile> mediaFile = mediaFileRepository.findById(id);
        if (mediaFile.isPresent()) {
            Path filePath = Paths.get(mediaFile.get().getFilePath());
            return Files.readAllBytes(filePath);
        }
        throw new IllegalArgumentException("File not found with id: " + id);
    }
    
    public void deleteFile(Long id) throws IOException {
        Optional<MediaFile> mediaFile = mediaFileRepository.findById(id);
        if (mediaFile.isPresent()) {
            // Delete file from disk
            Files.deleteIfExists(Paths.get(mediaFile.get().getFilePath()));
            // Delete record from database
            mediaFileRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("File not found with id: " + id);
        }
    }
    
    private String determineFileType(String mimeType) {
        if (mimeType != null) {
            if (mimeType.startsWith("audio/")) {
                return "audio";
            } else if (mimeType.startsWith("video/")) {
                return "video";
            }
        }
        return null;
    }
    
    private String getFileExtension(String fileName) {
        if (fileName != null && fileName.lastIndexOf(".") != -1) {
            return fileName.substring(fileName.lastIndexOf("."));
        }
        return "";
    }
    public String analyzeAudioWithAI(Long mediaFileId) throws IOException {
        CloseableHttpClient client = HttpClients.createDefault();
        
        try {
            // Get the media file from database
            Optional<MediaFile> mediaFile = mediaFileRepository.findById(mediaFileId);
            if (!mediaFile.isPresent()) {
                throw new IllegalArgumentException("Media file not found with id: " + mediaFileId);
            }

            // Check if file is audio type
            if (!"audio".equals(mediaFile.get().getFileType())) {
                throw new IllegalArgumentException("File must be an audio type for analysis. Current type: " + mediaFile.get().getFileType());
            }

            // Get file path
            Path filePath = Paths.get(mediaFile.get().getFilePath());
            if (!Files.exists(filePath)) {
                throw new IOException("Audio file not found on disk: " + filePath);
            }

            // Update status
            analysisStatus.put(mediaFileId, "PROCESSING");

            // Create HTTP POST request to Python AI service
            HttpPost post = new HttpPost("http://localhost:5000/api/analyze-audio");
            
            // Build multipart form data
            MultipartEntityBuilder builder = MultipartEntityBuilder.create();
            builder.addBinaryBody(
                "file", 
                Files.readAllBytes(filePath),
                org.apache.http.entity.ContentType.DEFAULT_BINARY,
                mediaFile.get().getOriginalFileName()
            );
            builder.addTextBody("media_file_id", mediaFileId.toString());
            
            HttpEntity multipart = builder.build();
            post.setEntity(multipart);

            // Execute request
            CloseableHttpResponse response = client.execute(post);
            
            try {
                String responseString = EntityUtils.toString(response.getEntity());
                int statusCode = response.getStatusLine().getStatusCode();
                
                if (statusCode == 200) {
                    // Parse successful response
                    JSONObject jsonResponse = new JSONObject(responseString);
                    if (jsonResponse.getBoolean("success")) {
                        analysisStatus.put(mediaFileId, "COMPLETED");
                        return responseString;
                    } else {
                        analysisStatus.put(mediaFileId, "FAILED");
                        throw new IOException("AI service returned error: " + jsonResponse.optString("error", "Unknown error"));
                    }
                } else {
                    analysisStatus.put(mediaFileId, "FAILED");
                    throw new IOException("HTTP Error: " + statusCode + " - " + responseString);
                }
            } finally {
                response.close();
            }
        } catch (Exception e) {
            analysisStatus.put(mediaFileId, "FAILED");
            throw new IOException("AI analysis failed: " + e.getMessage(), e);
        } finally {
            client.close();
        }
    }

    public String getAnalysisResults(Long mediaFileId) throws IOException {
        CloseableHttpClient client = HttpClients.createDefault();
        
        try {
            HttpGet get = new HttpGet("http://localhost:5000/api/analysis/" + mediaFileId);
            
            CloseableHttpResponse response = client.execute(get);
            
            try {
                String responseString = EntityUtils.toString(response.getEntity());
                int statusCode = response.getStatusLine().getStatusCode();
                
                if (statusCode == 200) {
                    return responseString;
                } else if (statusCode == 404) {
                    throw new IllegalArgumentException("Analysis not found for media file id: " + mediaFileId);
                } else {
                    throw new IOException("HTTP Error: " + statusCode + " - " + responseString);
                }
            } finally {
                response.close();
            }
        } finally {
            client.close();
        }
    }

    public String getAnalysisStatus(Long mediaFileId) {
        return analysisStatus.getOrDefault(mediaFileId, "NOT_STARTED");
    }
}