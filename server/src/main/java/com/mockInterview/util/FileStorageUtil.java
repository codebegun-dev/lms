package com.mockInterview.util;

import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.*;

public class FileStorageUtil {

    private static final String BASE_UPLOAD_DIR = System.getProperty("user.home") + File.separator + "uploads";

    public static String saveFile(MultipartFile file, String subFolder) throws IOException {
        if (file == null || file.isEmpty()) return null;

        Path uploadPath = Paths.get(BASE_UPLOAD_DIR, subFolder);
        if (Files.notExists(uploadPath)) Files.createDirectories(uploadPath);

        String originalName = file.getOriginalFilename();
        String sanitizedFileName = System.currentTimeMillis() + "_" + (originalName != null
                ? originalName.replaceAll("[^a-zA-Z0-9.\\-]", "_")
                : "file");

        Path filePath = uploadPath.resolve(sanitizedFileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return filePath.toAbsolutePath().toString();
    }

    public static boolean deleteFile(String filePath) {
        try {
            Path path = Paths.get(filePath);
            return Files.deleteIfExists(path);
        } catch (IOException e) {
            System.err.println("Failed to delete file: " + filePath);
            return false;
        }
    }
}
