package com.mockInterview.service;

import com.mockInterview.responseDtos.StudentProjectDto;
import java.util.List;

public interface StudentProjectService {

    List<StudentProjectDto> getAllProjectsByUser(Long userId);

    StudentProjectDto addOrUpdateProject(StudentProjectDto dto);

    public void deleteProject(Long projectId, Long userId);
}
