//package com.mockInterview.util;
//
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.File;
//import java.io.IOException;
//import java.nio.file.*;
//
//public class FileStorageUtil {
//
//    private static final String BASE_UPLOAD_DIR = System.getProperty("user.home") + File.separator + "uploads";
//
//    public static String saveFile(MultipartFile file, Long studentId, String folder) throws IOException {
//        if (file == null || file.isEmpty()) return null;
//
//        Path uploadPath = Paths.get(BASE_UPLOAD_DIR, String.valueOf(studentId), folder);
//        if (Files.notExists(uploadPath)) Files.createDirectories(uploadPath);
//
//        String originalName = file.getOriginalFilename();
//        String fileName = System.currentTimeMillis() + "_" +
//                (originalName != null ? originalName.replaceAll("[^a-zA-Z0-9.\\-]", "_") : "file");
//
//        Path filePath = uploadPath.resolve(fileName);
//        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
//
//        return filePath.toString();
//    }
//
//    public static void deleteFile(String filePath) {
//        if (filePath == null) return;
//        try {
//            Files.deleteIfExists(Paths.get(filePath));
//        } catch (Exception ignored) {}
//    }
//}


package com.mockInterview.util;

import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.*;

public class FileStorageUtil {

    private static final String BASE_UPLOAD_DIR = System.getProperty("user.home") + File.separator + "uploads";

    // ✅ Save uploaded video/audio file
    public static String saveFile(MultipartFile file, Long studentId, String folder) throws IOException {
        if (file == null || file.isEmpty()) return null;

        // Folder Structure: /uploads/{id}/{folder}/
        Path uploadPath = Paths.get(BASE_UPLOAD_DIR, String.valueOf(studentId), folder);

        if (Files.notExists(uploadPath)) Files.createDirectories(uploadPath);

        String originalName = file.getOriginalFilename();
        String fileName = System.currentTimeMillis() + "_" +
                (originalName != null ? originalName.replaceAll("[^a-zA-Z0-9.\\-]", "_") : "file");

        Path filePath = uploadPath.resolve(fileName);

        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return filePath.toString();
    }

    public static String saveTranscriptFile(String content, Long studentId, Long interviewId) throws IOException {
        if (content == null || content.isEmpty()) return null;

        Path uploadPath = Paths.get(
                System.getProperty("user.home"), 
                "uploads", 
                String.valueOf(studentId),
                "interviews",
                String.valueOf(interviewId),
                "transcript"
        );

        if (Files.notExists(uploadPath)) Files.createDirectories(uploadPath);

        String fileName = System.currentTimeMillis() + "_transcript.txt";

        Path filePath = uploadPath.resolve(fileName);
        Files.write(filePath, content.getBytes(), StandardOpenOption.CREATE);

        return filePath.toString();
    }

    // ✅ Delete file if needed
    public static void deleteFile(String filePath) {
        if (filePath == null) return;
        try {
            Files.deleteIfExists(Paths.get(filePath));
        } catch (Exception ignored) {}
    }
}
