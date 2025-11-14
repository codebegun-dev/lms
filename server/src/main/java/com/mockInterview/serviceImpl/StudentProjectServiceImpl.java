package com.mockInterview.serviceImpl;

import com.mockInterview.entity.StudentProject;
import com.mockInterview.entity.User;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.repository.StudentProjectRepository;
import com.mockInterview.repository.UserRepository;
import com.mockInterview.responseDtos.StudentProjectDto;
import com.mockInterview.service.StudentProjectService;
import com.mockInterview.util.RoleValidator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
public class StudentProjectServiceImpl implements StudentProjectService {

    @Autowired
    private StudentProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<StudentProjectDto> getAllProjectsByUser(Long userId) {
        List<StudentProject> projects = projectRepository.findByUser_UserId(userId);

        List<StudentProjectDto> dtoList = new ArrayList<>();
        for (StudentProject project : projects) {
            dtoList.add(convertToDto(project));
        }
        return dtoList;
    }

    @Override
    public StudentProjectDto addOrUpdateProject(StudentProjectDto dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + dto.getUserId()));

        // Validate: only STUDENT or MASTER_ADMIN can update
        RoleValidator.validateStudentOrMasterAdmin(user);

        StudentProject project;
        if (dto.getId() != null) {
            project = projectRepository.findById(dto.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Project not found with ID: " + dto.getId()));

            // Ownership check: STUDENT can update only their own projects
            if (!user.getRole().getName().equalsIgnoreCase("MASTER_ADMIN") &&
                    project.getUser().getUserId() != user.getUserId()) {
                throw new ResourceNotFoundException("Access denied: Cannot update project of another user.");
            }

        } else {
            project = new StudentProject();
            project.setUser(user);
        }

        project.setProjectTitle(dto.getProjectTitle());
        project.setUsedTechnologies(dto.getUsedTechnologies());
        project.setRole(dto.getRole());
        project.setDescription(dto.getDescription());

        project = projectRepository.save(project);
        return convertToDto(project);
    }

    @Override
    public void deleteProject(Long projectId, Long userId) {
        StudentProject project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with ID: " + projectId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        RoleValidator.validateStudentOrMasterAdmin(user);

        // Ownership check: STUDENT can delete only their own, MASTER_ADMIN can delete any
        if (!user.getRole().getName().equalsIgnoreCase("MASTER_ADMIN") &&
                project.getUser().getUserId() != user.getUserId()) {
            throw new ResourceNotFoundException("Access denied: Cannot delete project of another user.");
        }

        projectRepository.delete(project);
    }

    // ======= Helper method =======
    private StudentProjectDto convertToDto(StudentProject project) {
        StudentProjectDto dto = new StudentProjectDto();
        dto.setId(project.getId());
        dto.setUserId(project.getUser().getUserId());
        dto.setProjectTitle(project.getProjectTitle());
        dto.setUsedTechnologies(project.getUsedTechnologies());
        dto.setRole(project.getRole());
        dto.setDescription(project.getDescription());
        return dto;
    }
}
