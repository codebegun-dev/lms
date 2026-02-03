package com.mockInterview.serviceImpl;

import java.io.IOException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.security.access.AccessDeniedException;

import com.mockInterview.entity.StudentGenericDetails;
import com.mockInterview.entity.User;
import com.mockInterview.exception.ResourceNotFoundException;

import com.mockInterview.repository.StudentGenericDetailsRepository;
import com.mockInterview.repository.UserRepository;

import com.mockInterview.responseDtos.StudentGenericDetailsResponseDto;
import com.mockInterview.security.SecurityUtils;
import com.mockInterview.service.StudentGenericDetailsService;
import com.mockInterview.util.FileStorageUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class StudentGenericDetailsServiceImpl implements StudentGenericDetailsService {

    private final StudentGenericDetailsRepository genericDetailsRepository;
    private final UserRepository userRepository;

    @Override
    public StudentGenericDetailsResponseDto updateStudentGenericDetails(
            Long targetUserId,
            StudentGenericDetails request,
            MultipartFile adhaarFile,
            MultipartFile resumeFile
    ) {

        User loggedInUser = getCurrentUser();
        validateUpdatePermission(loggedInUser, targetUserId);

        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // ================= FETCH OR CREATE =================
        StudentGenericDetails details =
                genericDetailsRepository.findByUser_UserId(targetUserId);

        if (details == null) {
            details = new StudentGenericDetails();
            details.setUser(targetUser);
        }

        // ================= UPDATE CAREER INFO =================
        if (request.getWorkExperience() != null)
            details.setWorkExperience(request.getWorkExperience());

        if (request.getCareerGap() != null)
            details.setCareerGap(request.getCareerGap());

        // ================= UPDATE ADDRESS =================
        if (request.getCurrentState() != null)
            details.setCurrentState(request.getCurrentState());
        if (request.getCurrentDistrict() != null)
            details.setCurrentDistrict(request.getCurrentDistrict());
        if (request.getCurrentSubDistrict() != null)
            details.setCurrentSubDistrict(request.getCurrentSubDistrict());
        if (request.getCurrentVillage() != null)
            details.setCurrentVillage(request.getCurrentVillage());
        if (request.getCurrentStreet() != null)
            details.setCurrentStreet(request.getCurrentStreet());
        if (request.getCurrentPincode() != null)
            details.setCurrentPincode(request.getCurrentPincode());

        if (request.getPermanentState() != null)
            details.setPermanentState(request.getPermanentState());
        if (request.getPermanentDistrict() != null)
            details.setPermanentDistrict(request.getPermanentDistrict());
        if (request.getPermanentSubDistrict() != null)
            details.setPermanentSubDistrict(request.getPermanentSubDistrict());
        if (request.getPermanentVillage() != null)
            details.setPermanentVillage(request.getPermanentVillage());
        if (request.getPermanentStreet() != null)
            details.setPermanentStreet(request.getPermanentStreet());
        if (request.getPermanentPincode() != null)
            details.setPermanentPincode(request.getPermanentPincode());

        // ================= SOCIAL LINKS =================
        if (request.getGithubProfile() != null)
            details.setGithubProfile(request.getGithubProfile());
        if (request.getLinkedinProfile() != null)
            details.setLinkedinProfile(request.getLinkedinProfile());

        // ================= FILE UPLOADS =================
        if (adhaarFile != null && !adhaarFile.isEmpty()) {
            try {
                String path = FileStorageUtil.saveFile(adhaarFile, targetUserId, "documents");
                details.setAdhaarFilePath(path);
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload Adhaar file", e);
            }
        }

        if (resumeFile != null && !resumeFile.isEmpty()) {
            try {
                String path = FileStorageUtil.saveFile(resumeFile, targetUserId, "documents");
                details.setResumeFilePath(path);
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload Resume file", e);
            }
        }

        // ================= SAVE =================
        genericDetailsRepository.save(details);

        return mapToResponseDto(details);
    }

    // ================= GET BY USER ID =================
    @Override
    public StudentGenericDetailsResponseDto getByUserId(Long userId) {
        User loggedInUser = getCurrentUser();

        if ("STUDENT".equalsIgnoreCase(loggedInUser.getRole().getName())
                && !loggedInUser.getUserId().equals(userId)) {
            throw new AccessDeniedException("Students can view only their own profile");
        }

        StudentGenericDetails details =
                genericDetailsRepository.findByUser_UserId(userId);

        if (details == null) {
            throw new ResourceNotFoundException("Student generic details not found");
        }

        return mapToResponseDto(details);
    }

    // ================= SECURITY =================
    private User getCurrentUser() {
        Long currentUserId = SecurityUtils.getCurrentUserId();

        if (currentUserId == null)
            throw new AccessDeniedException("Unauthenticated access");

        return userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Logged-in user not found"));
    }

    private void validateUpdatePermission(User loggedInUser, Long targetUserId) {
        // Only STUDENT users can have generic details
        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!"STUDENT".equalsIgnoreCase(targetUser.getRole().getName())) {
            throw new AccessDeniedException("Generic details can be updated only for STUDENT users");
        }

        if (SecurityUtils.isMasterAdmin()) return;

        if (!SecurityUtils.hasAuthority("UPDATE_STUDENT")) {
            throw new AccessDeniedException("You do not have permission to update student details");
        }
    }

    // ================= MAPPER =================
    private StudentGenericDetailsResponseDto mapToResponseDto(StudentGenericDetails details) {
        StudentGenericDetailsResponseDto dto = new StudentGenericDetailsResponseDto();

        dto.setUserId(details.getUser().getUserId());
        dto.setUserId(details.getUser().getUserId());
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

        dto.setAdhaarFilePath(details.getAdhaarFilePath());
        dto.setResumeFilePath(details.getResumeFilePath());

        dto.setUpdatedAt(details.getUpdatedAt());
        dto.setUpdatedBy(details.getUpdatedBy() != null ? String.valueOf(details.getUpdatedBy()) : null);

        return dto;
    }
}
