package com.mockInterview.service;

import com.mockInterview.entity.StudentProject;
import com.mockInterview.responseDtos.StudentProjectDto;

import java.util.List;

public interface StudentProjectService {

    // ✅ Get all projects by user
    List<StudentProjectDto> getAllProjectsByUser(Long userId);

    // ✅ Add or update project for a user
    public StudentProjectDto addOrUpdateProject(Long targetUserId, StudentProject request);

    // ✅ Delete project
    public void deleteProject(Long projectId);
}
