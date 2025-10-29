package com.mockInterview.serviceImpl;

import com.mockInterview.entity.StudentProject;
import com.mockInterview.entity.User;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.repository.StudentProjectRepository;
import com.mockInterview.repository.UserRepository;
import com.mockInterview.responseDtos.StudentProjectDto;
import com.mockInterview.service.StudentProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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
            StudentProjectDto dto = new StudentProjectDto();
            dto.setId(project.getId());
            dto.setUserId(userId);
            dto.setProjectTitle(project.getProjectTitle());
            dto.setUsedTechnologies(project.getUsedTechnologies());
            dto.setRole(project.getRole());
            dto.setDescription(project.getDescription());
            dtoList.add(dto);
        }
        return dtoList;
    }

    @Override
    public StudentProjectDto addOrUpdateProject(StudentProjectDto dto) {
    	Optional<User> userOpt = userRepository.findById(dto.getUserId());
    	if (!userOpt.isPresent()) {
    	    throw new ResourceNotFoundException("User not found with ID: " + dto.getUserId());
    	}
    	User user = userOpt.get();

        StudentProject project;
        if (dto.getId() != null) {
            project = projectRepository.findById(dto.getId()).orElse(new StudentProject());
        } else {
            project = new StudentProject();
        }

        project.setUser(user);
        project.setProjectTitle(dto.getProjectTitle());
        project.setUsedTechnologies(dto.getUsedTechnologies());
        project.setRole(dto.getRole());
        project.setDescription(dto.getDescription());

        project = projectRepository.save(project);
        dto.setId(project.getId());
        return dto;
    }

    @Override
    public void deleteProject(Long projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw new ResourceNotFoundException("Project not found with ID: " + projectId);
        }
        projectRepository.deleteById(projectId);
    }
}
