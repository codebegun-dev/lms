package com.mockInterview.controller;

import com.mockInterview.responseDtos.StudentProjectDto;
import com.mockInterview.service.StudentProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student/projects")
@CrossOrigin(origins = "*")
public class StudentProjectController {

    @Autowired
    private StudentProjectService projectService;

    // ✅ Get all projects for a user
    @GetMapping("/{userId}")
    public List<StudentProjectDto> getAllProjects(@PathVariable Long userId) {
        return projectService.getAllProjectsByUser(userId);
    }

    // ✅ Add or update project
    @PostMapping
    public StudentProjectDto addOrUpdateProject(@RequestBody StudentProjectDto dto) {
        return projectService.addOrUpdateProject(dto);
    }

    // ✅ Delete a project
    @DeleteMapping("/{projectId}")
    public String deleteProject(@PathVariable Long projectId) {
        projectService.deleteProject(projectId);
        return "Project deleted successfully with ID: " + projectId;
    }
}
