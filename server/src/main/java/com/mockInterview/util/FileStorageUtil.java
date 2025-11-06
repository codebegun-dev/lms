package com.mockInterview.util;

import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;

public class FileStorageUtil {

	private static final String BASE_UPLOAD_DIR =
            System.getProperty("user.dir") + File.separator + "uploads";

    // Save file and return relative path
    public static String saveFile(MultipartFile file, Long studentId, String folder) throws IOException {
        if (file == null || file.isEmpty()) return null;

        Path uploadPath = Paths.get(BASE_UPLOAD_DIR, String.valueOf(studentId), folder);
        if (Files.notExists(uploadPath)) Files.createDirectories(uploadPath);

        String originalName = file.getOriginalFilename();
        String fileName = System.currentTimeMillis() + "_" +
                (originalName != null ? originalName.replaceAll("[^a-zA-Z0-9.\\-]", "_") : "file");

        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Return relative path instead of absolute
        return studentId + "/" + folder + "/" + fileName;
    }

    public static void deleteFile(String relativePath) {
        if (relativePath == null) return;
        try {
            Path path = Paths.get(BASE_UPLOAD_DIR, relativePath);
            Files.deleteIfExists(path);
        } catch (Exception ignored) {}
    }
    public static String saveTranscriptFile(String content, Long studentId, Long interviewId, String fileName) throws IOException {
        if (content == null || content.isEmpty()) return null;

        Path uploadPath = Paths.get(
                BASE_UPLOAD_DIR,
                String.valueOf(studentId),
                "interviews",
                String.valueOf(interviewId),
                "transcript"
        );

        if (Files.notExists(uploadPath)) Files.createDirectories(uploadPath);

        Path filePath = uploadPath.resolve(fileName);

        // ✅ If file exists → delete it first
        if (Files.exists(filePath)) {
            Files.delete(filePath);
        }

        // ✅ Create + write transcript file
        Files.write(filePath, content.getBytes(), StandardOpenOption.CREATE);

        return filePath.toString();
    }



    
}


