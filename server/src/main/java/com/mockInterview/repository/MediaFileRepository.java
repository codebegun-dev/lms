package com.mockInterview.repository;


import com.mockInterview.entity.MediaFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MediaFileRepository extends JpaRepository<MediaFile, Long> {
    
    List<MediaFile> findByFileType(String fileType);
    Optional<MediaFile> findByFileName(String fileName);
    List<MediaFile> findByFileNameContainingIgnoreCase(String fileName);
}
