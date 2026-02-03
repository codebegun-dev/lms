package com.mockInterview.controller;

import com.mockInterview.entity.StudentProject;
import com.mockInterview.entity.User;
import com.mockInterview.responseDtos.StudentProjectDto;
import com.mockInterview.service.StudentProjectService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student/projects")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class StudentProjectController {

    private final StudentProjectService projectService;

    // ================= GET =================
    @GetMapping("/{userId}")
    public List<StudentProjectDto> getAllProjects(@PathVariable Long userId) {
        return projectService.getAllProjectsByUser(userId);
    }

    // ================= CREATE / UPDATE =================
    @PutMapping("/update/{userId}")
    @PreAuthorize("hasAuthority('UPDATE_STUDENT')")
    public StudentProjectDto addOrUpdateProject(
            @PathVariable Long userId,
            @RequestBody @Valid StudentProject request
    ) {
        return projectService.addOrUpdateProject(userId, request);
    }

    // ================= DELETE =================
    @DeleteMapping("/{projectId}")
    @PreAuthorize("hasAuthority('UPDATE_STUDENT')")
    public String deleteProject(@PathVariable Long projectId) {
        projectService.deleteProject(projectId);
        return "Project deleted successfully with ID: " + projectId;
    }
}
