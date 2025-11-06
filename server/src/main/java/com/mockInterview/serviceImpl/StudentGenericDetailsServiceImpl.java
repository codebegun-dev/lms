package com.mockInterview.serviceImpl;

import com.mockInterview.entity.StudentGenericDetails;
import com.mockInterview.entity.User;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.repository.StudentGenericDetailsRepository;
import com.mockInterview.repository.UserRepository;
import com.mockInterview.responseDtos.StudentGenericDetailsDto;
import com.mockInterview.service.StudentGenericDetailsService;
import com.mockInterview.util.FileStorageUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.File;
import java.util.Optional;
 
@Service
public class StudentGenericDetailsServiceImpl implements StudentGenericDetailsService {

    @Autowired
    private StudentGenericDetailsRepository genericRepo;

    @Autowired
    private UserRepository userRepo;

   

    @Override
    public StudentGenericDetailsDto updateGenericDetails(StudentGenericDetailsDto dto) {
    	Optional<User> userOpt = userRepo.findById(dto.getUserId());
    	if (!userOpt.isPresent()) {
    	    throw new ResourceNotFoundException("User not found with ID: " + dto.getUserId());
    	}
    	User user = userOpt.get();

        StudentGenericDetails details = genericRepo.findByUser_UserId(dto.getUserId());
        if (details == null) {
            details = new StudentGenericDetails();
            details.setUser(user);
        }

        details.setWorkExperience(dto.getWorkExperience());
        details.setCareerGap(dto.getCareerGap());
        details.setCurrentState(dto.getCurrentState());
        details.setCurrentDistrict(dto.getCurrentDistrict());
        details.setCurrentSubDistrict(dto.getCurrentSubDistrict());
        details.setCurrentVillage(dto.getCurrentVillage());
        details.setCurrentStreet(dto.getCurrentStreet());
        details.setCurrentPincode(dto.getCurrentPincode());
        details.setPermanentState(dto.getPermanentState());
        details.setPermanentDistrict(dto.getPermanentDistrict());
        details.setPermanentSubDistrict(dto.getPermanentSubDistrict());
        details.setPermanentVillage(dto.getPermanentVillage());
        details.setPermanentStreet(dto.getPermanentStreet());
        details.setPermanentPincode(dto.getPermanentPincode());
        details.setGithubProfile(dto.getGithubProfile());
        details.setLinkedinProfile(dto.getLinkedinProfile());

        genericRepo.save(details);
        return mapToDto(details);
    }

    @Override
    public StudentGenericDetailsDto uploadDocument(Long userId, String documentType, MultipartFile file) {
        if (file == null || file.isEmpty())
            throw new IllegalArgumentException("File cannot be empty");

        StudentGenericDetails details = genericRepo.findByUser_UserId(userId);
        if (details == null) {
            User user = userRepo.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
            details = new StudentGenericDetails();
            details.setUser(user);
        }

        try {
            String folderName = "documents";

            // Clean folder per document type
            String finalSubFolder = documentType.equalsIgnoreCase("adhaar") ? "adhaar" :
                    documentType.equalsIgnoreCase("resume") ? "resume" : null;

            if (finalSubFolder == null)
                throw new IllegalArgumentException("Invalid document type (allowed: adhaar, resume)");

            // ✅ Save file using shared utility
            String savedPath = FileStorageUtil.saveFile(file, userId, folderName + File.separator + finalSubFolder);

            // ✅ Delete old file if new file uploaded
            if ("adhaar".equalsIgnoreCase(documentType)) {
                if (details.getAdhaarFilePath() != null)
                    FileStorageUtil.deleteFile(details.getAdhaarFilePath());

                details.setAdhaarFilePath(savedPath);
            }

            if ("resume".equalsIgnoreCase(documentType)) {
                if (details.getResumeFilePath() != null)
                    FileStorageUtil.deleteFile(details.getResumeFilePath());

                details.setResumeFilePath(savedPath);
            }

            genericRepo.save(details);

        } catch (Exception e) {
            throw new RuntimeException("File upload failed: " + e.getMessage(), e);
        }

        return mapToDto(details);
    }

    @Override
    public StudentGenericDetailsDto getGenericDetails(Long userId) {
    	Optional<User> userOpt = userRepo.findById(userId);
    	if (!userOpt.isPresent()) {
    	    throw new ResourceNotFoundException("User not found with ID: " + userId);
    	}
    	User user = userOpt.get();

        StudentGenericDetails details = genericRepo.findByUser_UserId(userId);
        if (details == null) {
            details = new StudentGenericDetails();
            details.setUser(user);
        }

        return mapToDto(details);
    }

    

 // inside mapToDto method
 private StudentGenericDetailsDto mapToDto(StudentGenericDetails details) {
     StudentGenericDetailsDto dto = new StudentGenericDetailsDto();

     dto.setUserId(details.getUser().getUserId());
     dto.setFirstName(details.getUser().getFirstName());
     dto.setLastName(details.getUser().getLastName());
     dto.setMobileNumber(details.getUser().getPhone());

     dto.setWorkExperience(details.getWorkExperience());
     dto.setCareerGap(details.getCareerGap());
     dto.setCurrentState(details.getCurrentState());
     dto.setCurrentDistrict(details.getCurrentDistrict());
     dto.setCurrentSubDistrict(details.getCurrentSubDistrict());
     dto.setCurrentVillage(details.getCurrentVillage());
     dto.setCurrentStreet(details.getCurrentStreet());
     dto.setCurrentPincode(details.getCurrentPincode());
     dto.setPermanentState(details.getPermanentState());
     dto.setPermanentDistrict(details.getPermanentDistrict());
     dto.setPermanentSubDistrict(details.getPermanentSubDistrict());
     dto.setPermanentVillage(details.getPermanentVillage());
     dto.setPermanentStreet(details.getPermanentStreet());
     dto.setPermanentPincode(details.getPermanentPincode());
     dto.setGithubProfile(details.getGithubProfile());
     dto.setLinkedinProfile(details.getLinkedinProfile());

     // ✅ Dynamic base URL
     String baseUrl = ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString();

     if (details.getAdhaarFilePath() != null) {
         dto.setAdhaarFilePath(baseUrl + "/docs/" + details.getUser().getUserId() + "/" + new File(details.getAdhaarFilePath()).getName());
     }
     if (details.getResumeFilePath() != null) {
         dto.setResumeFilePath(baseUrl + "/docs/" + details.getUser().getUserId() + "/" + new File(details.getResumeFilePath()).getName());
     }

     return dto;
 }

}
