package com.mockInterview.serviceImpl;

import com.mockInterview.entity.StudentGenericDetails;
import com.mockInterview.entity.User;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.exception.UnauthorizedActionException;
import com.mockInterview.repository.StudentGenericDetailsRepository;
import com.mockInterview.repository.UserRepository;
import com.mockInterview.responseDtos.StudentGenericDetailsDto;
import com.mockInterview.service.StudentGenericDetailsService;
import com.mockInterview.util.FileStorageUtil;
import com.mockInterview.util.RoleValidator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;


@Service
public class StudentGenericDetailsServiceImpl implements StudentGenericDetailsService {

    @Autowired
    private StudentGenericDetailsRepository genericRepo;

    @Autowired
    private UserRepository userRepo;

    @Override
    public StudentGenericDetailsDto updateGenericDetails(StudentGenericDetailsDto dto) {

        User currentUser = userRepo.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + dto.getUserId()));

        // Prevent MASTER_ADMIN from creating/updating their own generic details
        RoleValidator.preventMasterAdminGenericUpdate(currentUser);

        // STUDENT can update their own details, MASTER_ADMIN can update any student
        if (!"MASTER_ADMIN".equalsIgnoreCase(currentUser.getRole().getName())) {
            RoleValidator.validateStudentAccess(currentUser);
        }

        StudentGenericDetails details = genericRepo.findByUser_UserId(dto.getUserId());
        if (details == null) {
            details = new StudentGenericDetails();
            details.setUser(currentUser);
        }

        // Update all fields
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
    public StudentGenericDetailsDto uploadDocument(Long userId, MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        // MASTER_ADMIN can upload only for students
        if ("MASTER_ADMIN".equalsIgnoreCase(user.getRole().getName())) {
            User targetUser = userRepo.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Target student not found"));
            if (!"STUDENT".equalsIgnoreCase(targetUser.getRole().getName())) {
                throw new UnauthorizedActionException("MASTER_ADMIN can only update student documents");
            }
            user = targetUser; // save for the student
        } else {
            // STUDENT can upload only their own files
            RoleValidator.validateStudentAccess(user);
        }

        StudentGenericDetails details = genericRepo.findByUser_UserId(user.getUserId());
        if (details == null) {
            details = new StudentGenericDetails();
            details.setUser(user);
        }

        try {
            String savedPath = FileStorageUtil.saveStudentDocument(file, user.getUserId());

            // Decide which field to use
            if (details.getAdhaarFilePath() == null || details.getAdhaarFilePath().isEmpty()) {
                details.setAdhaarFilePath(savedPath);
            } else {
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

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        // ⭐ ROLE VALIDATION
        RoleValidator.validateStudentOrMasterAdmin(user);

        StudentGenericDetails details = genericRepo.findByUser_UserId(userId);
        if (details == null) {
            details = new StudentGenericDetails();
            details.setUser(user);
        }

        return mapToDto(details);
    }

    @Override
    public Resource viewDocument(Long userId) {

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        // ⭐ ROLE VALIDATION
        RoleValidator.validateStudentOrMasterAdmin(user);

        StudentGenericDetails details = genericRepo.findByUser_UserId(userId);
        if (details == null) {
            throw new ResourceNotFoundException("Student details not found for user ID: " + userId);
        }

        String relativePath = null;

        // Prefer adhaarFilePath if exists, else resumeFilePath
        if (details.getAdhaarFilePath() != null && !details.getAdhaarFilePath().isEmpty()) {
            relativePath = details.getAdhaarFilePath();
        } else if (details.getResumeFilePath() != null && !details.getResumeFilePath().isEmpty()) {
            relativePath = details.getResumeFilePath();
        }

        if (relativePath == null) {
            throw new ResourceNotFoundException("No uploaded document found for user ID: " + userId);
        }

        try {
            Path filePath = Paths.get(System.getProperty("user.dir") + "/uploads")
                    .resolve(relativePath)
                    .normalize();

            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                throw new ResourceNotFoundException("File not found: " + relativePath);
            }

            return resource;

        } catch (MalformedURLException e) {
            throw new RuntimeException("Error reading file: " + e.getMessage(), e);
        }
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

        String baseUrl = ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString();

        if (details.getAdhaarFilePath() != null) {
            dto.setAdhaarFilePath(baseUrl + "/api/student/" + details.getUser().getUserId() + "/document/adhaar");
        }
        if (details.getResumeFilePath() != null) {
            dto.setResumeFilePath(baseUrl + "/api/student/" + details.getUser().getUserId() + "/document/resume");
        }

        return dto;
    }
}