package com.mockInterview.serviceImpl;

import com.mockInterview.entity.StudentGenericDetails;
import com.mockInterview.entity.User;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.repository.StudentGenericDetailsRepository;
import com.mockInterview.repository.UserRepository;
import com.mockInterview.responseDtos.StudentGenericDetailsDto;
import com.mockInterview.service.StudentGenericDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Optional;
 
@Service
public class StudentGenericDetailsServiceImpl implements StudentGenericDetailsService {

    @Autowired
    private StudentGenericDetailsRepository genericRepo;

    @Autowired
    private UserRepository userRepo;

    private static final String UPLOAD_DIR = System.getProperty("user.home")
            + File.separator + "uploads" + File.separator + "generic-docs";

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
            String userFolder = UPLOAD_DIR + File.separator + userId;
            File folder = new File(userFolder);
            if (!folder.exists() && !folder.mkdirs())
                throw new IOException("Failed to create directory");

            String cleanFileName = System.currentTimeMillis() + "_" +
                    file.getOriginalFilename().replaceAll("[^a-zA-Z0-9\\.\\-_]", "_");
            String filePath = userFolder + File.separator + cleanFileName;
            file.transferTo(new File(filePath));

            if ("adhaar".equalsIgnoreCase(documentType)) {
                if (details.getAdhaarFilePath() != null)
                    new File(details.getAdhaarFilePath()).delete();
                details.setAdhaarFilePath(filePath);
            } else if ("resume".equalsIgnoreCase(documentType)) {
                if (details.getResumeFilePath() != null)
                    new File(details.getResumeFilePath()).delete();
                details.setResumeFilePath(filePath);
            } else {
                throw new IllegalArgumentException("Invalid document type");
            }

            genericRepo.save(details);
        } catch (IOException e) {
            throw new RuntimeException("Error saving file: " + e.getMessage(), e);
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

        String baseUrl = "http://localhost:8080";
        if (details.getAdhaarFilePath() != null) {
            dto.setAdhaarFilePath(baseUrl + "/docs/" + details.getUser().getUserId() + "/" + new File(details.getAdhaarFilePath()).getName());
        }
        if (details.getResumeFilePath() != null) {
            dto.setResumeFilePath(baseUrl + "/docs/" + details.getUser().getUserId() + "/" + new File(details.getResumeFilePath()).getName());
        }

        return dto;
    }
}
