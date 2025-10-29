package com.mockInterview.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.mockInterview.responseDtos.CourseManagementDto;
import com.mockInterview.service.CourseServiceManagement;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class CourseManagementController {

    @Autowired
    private CourseServiceManagement courseServiceManagement;

    // ✅ Create Course
    @PostMapping("/create")
    public CourseManagementDto createCourse(@RequestBody CourseManagementDto courseDto) {
        return courseServiceManagement.createCourse(courseDto);
    }

    // ✅ Get Course by ID
    @GetMapping("/{courseId}")
    public CourseManagementDto getCourseById(@PathVariable Long courseId) {
        return courseServiceManagement.getCourseById(courseId);
    }

    // ✅ Get All Courses
    @GetMapping("/all")
    public List<CourseManagementDto> getAllCourses() {
        return courseServiceManagement.getAllCourses();
    }

    // ✅ Update Course
    @PutMapping("/update/{courseId}")
    public CourseManagementDto updateCourse(
            @PathVariable Long courseId,
            @RequestBody CourseManagementDto courseDto) {

        return courseServiceManagement.updateCourse(courseId, courseDto);
    }

    // ✅ Delete Course
    @DeleteMapping("/delete/{courseId}")
    public String deleteCourse(@PathVariable Long courseId) {
        courseServiceManagement.deleteCourse(courseId);
        return "Course deleted successfully with ID: " + courseId;
    }
}
