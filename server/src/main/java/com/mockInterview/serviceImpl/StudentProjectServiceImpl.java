package com.mockInterview.serviceImpl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mockInterview.entity.StudentProject;
import com.mockInterview.entity.User;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.repository.StudentProjectRepository;
import com.mockInterview.repository.UserRepository;
import com.mockInterview.responseDtos.StudentProjectDto;
import com.mockInterview.security.SecurityUtils;
import com.mockInterview.service.StudentProjectService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class StudentProjectServiceImpl implements StudentProjectService {

    private final StudentProjectRepository projectRepository;
    private final UserRepository userRepository;

    // ================= GET =================
    @Override
    public List<StudentProjectDto> getAllProjectsByUser(Long userId) {

        User loggedInUser = getCurrentUser();

        // STUDENT → can view only their own projects
        if ("STUDENT".equalsIgnoreCase(loggedInUser.getRole().getName())
                && !loggedInUser.getUserId().equals(userId)) {
            throw new SecurityException("Students can view only their own projects");
        }

        List<StudentProject> projects = projectRepository.findByUser_UserId(userId);
        List<StudentProjectDto> response = new ArrayList<>();

        for (StudentProject project : projects) {
            response.add(mapToDto(project));
        }

        return response;
    }

    // ================= ADD / UPDATE =================
    @Override
    public StudentProjectDto addOrUpdateProject(Long targetUserId, StudentProject request) {

        User loggedInUser = getCurrentUser();
        validateUpdatePermission(loggedInUser, targetUserId);

        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        StudentProject project;

        // UPDATE
        if (request.getId() != null) {
            project = projectRepository.findById(request.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

            if (!project.getUser().getUserId().equals(targetUserId)) {
                throw new AccessDeniedException("Cannot modify another student's project");
            }
        } else {
            // CREATE
            project = new StudentProject();
            project.setUser(targetUser);
        }

        // ---------- UPDATE FIELDS ----------
        project.setProjectTitle(request.getProjectTitle());
        project.setUsedTechnologies(request.getUsedTechnologies());
        project.setRole(request.getRole());
        project.setDescription(request.getDescription());

        projectRepository.save(project);

        return mapToDto(project);
    }

    // ================= DELETE =================
    @Override
    public void deleteProject(Long projectId) {
        User loggedInUser = getCurrentUser();

        StudentProject project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        Long targetUserId = project.getUser().getUserId();

        validateUpdatePermission(loggedInUser, targetUserId);

        projectRepository.delete(project);
    }


    // ================= SECURITY =================
    private User getCurrentUser() {
        Long currentUserId = SecurityUtils.getCurrentUserId();

        if (currentUserId == null) {
            throw new SecurityException("Unauthenticated access");
        }

        return userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Logged-in user not found"));
    }

    private void validateUpdatePermission(User loggedInUser, Long targetUserId) {

        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!"STUDENT".equalsIgnoreCase(targetUser.getRole().getName())) {
            throw new SecurityException("Projects can be updated only for STUDENT users");
        }

        // MASTER_ADMIN → full access
        if (SecurityUtils.isMasterAdmin()) return;

        // STUDENT → can update only own projects
        if ("STUDENT".equalsIgnoreCase(loggedInUser.getRole().getName())
                && loggedInUser.getUserId().equals(targetUserId)) return;

        // OTHER ROLES → need authority
        if (!SecurityUtils.hasAuthority("UPDATE_STUDENT")) {
            throw new SecurityException("You do not have permission to update student projects");
        }
    }

    // ================= MAPPER =================
    private StudentProjectDto mapToDto(StudentProject entity) {
        StudentProjectDto dto = new StudentProjectDto();
        dto.setId(entity.getId());
        dto.setUserId(entity.getUser().getUserId());
        dto.setProjectTitle(entity.getProjectTitle());
        dto.setUsedTechnologies(entity.getUsedTechnologies());
        dto.setRole(entity.getRole());
        dto.setDescription(entity.getDescription());
        dto.setUpdatedAt(entity.getUpdatedAt());
        dto.setUpdatedBy(entity.getUpdatedBy() != null ? String.valueOf(entity.getUpdatedBy()) : null);
        return dto;
    }
}
