package com.mockInterview.serviceImpl;

import java.util.ArrayList;
import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mockInterview.entity.CourseManagement;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.repository.CourseManagementRepository;
import com.mockInterview.responseDtos.CourseManagementDto;
import com.mockInterview.service.CourseServiceManagement;

@Service
public class CourseManagementServiceImpl implements CourseServiceManagement {

    @Autowired
    private CourseManagementRepository courseRepository;

    // ✅ Create Course
    @Override
    public CourseManagementDto createCourse(CourseManagementDto dto) {
        CourseManagement course = new CourseManagement();
        course.setCourseName(dto.getCourseName());
        course.setSubjects(dto.getSubjects());

        return mapToDto(courseRepository.save(course));
    }

    // ✅ Get Course by ID
    @Override
    public CourseManagementDto getCourseById(Long courseId) {
        CourseManagement course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Course not found with ID: " + courseId));
        return mapToDto(course);
    }

    // ✅ Get All Courses
    @Override
    public List<CourseManagementDto> getAllCourses() {
        List<CourseManagementDto> dtoList = new ArrayList<>();
        for (CourseManagement course : courseRepository.findAll()) {
            dtoList.add(mapToDto(course));
        }
        return dtoList;
    }

    // ✅ Update Course
    @Override
    public CourseManagementDto updateCourse(Long courseId, CourseManagementDto dto) {
        CourseManagement course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Course not found with ID: " + courseId));

        course.setCourseName(dto.getCourseName());
        course.setSubjects(dto.getSubjects());

        return mapToDto(courseRepository.save(course));
    }

    // ✅ Delete Course
    @Override
    public void deleteCourse(Long courseId) {
        CourseManagement course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Course not found with ID: " + courseId));

        courseRepository.delete(course);
    }

    // 🔹 Common Mapper
    private CourseManagementDto mapToDto(CourseManagement course) {
        CourseManagementDto dto = new CourseManagementDto();
        dto.setCourseId(course.getCourseId());
        dto.setCourseName(course.getCourseName());
        dto.setSubjects(course.getSubjects());
        return dto;
    }
}
