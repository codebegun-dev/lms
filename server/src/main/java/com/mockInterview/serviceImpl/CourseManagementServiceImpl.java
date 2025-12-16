package com.mockInterview.serviceImpl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mockInterview.entity.CourseManagement;
import com.mockInterview.exception.DuplicateFieldException;
import com.mockInterview.exception.InactiveResourceException;
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

       
        if (courseRepository.existsByCourseName(dto.getCourseName())) {
            throw new DuplicateFieldException("Course already exists with name: " + dto.getCourseName());
        }

        CourseManagement course = new CourseManagement();
        course.setCourseName(dto.getCourseName());
        course.setSubjects(dto.getSubjects());
        course.setStatus("ACTIVE"); 

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

    @Override
    public List<CourseManagementDto> getAllCourses() {
        List<CourseManagementDto> dtoList = new ArrayList<>();
        for (CourseManagement course : courseRepository.findAllByOrderByStatusAscCourseNameAsc()) {
            dtoList.add(mapToDto(course));
        }
        return dtoList;
    }


    @Override
    public CourseManagementDto updateCourse(Long courseId, CourseManagementDto dto) {
        CourseManagement course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Course not found with ID: " + courseId));

        // 🔹 Check if course is inactive
        if ("INACTIVE".equalsIgnoreCase(course.getStatus())) {
            throw new InactiveResourceException("Cannot update an inactive course. Please activate it first.");
        }

        // 🔹 Check if new course name already exists (excluding current course)
        if (!course.getCourseName().equalsIgnoreCase(dto.getCourseName()) 
                && courseRepository.existsByCourseName(dto.getCourseName())) {
            throw new DuplicateFieldException("Course name already exists: " + dto.getCourseName());
        }

        course.setCourseName(dto.getCourseName());
        course.setSubjects(dto.getSubjects());

        return mapToDto(courseRepository.save(course));
    }


    // 🔹 Activate / Deactivate Course
    @Override
    public CourseManagementDto changeCourseStatus(Long courseId, boolean active) {
        CourseManagement course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Course not found with ID: " + courseId));

        course.setStatus(active ? "ACTIVE" : "INACTIVE");
        return mapToDto(courseRepository.save(course));
    }
    
    public List<CourseManagementDto> getAllActiveCourses() {
        List<CourseManagementDto> dtoList = new ArrayList<>();
        List<CourseManagement> activeCourses = courseRepository.findByStatusOrderByCourseNameAsc("ACTIVE");
        for (CourseManagement course : activeCourses) {
            dtoList.add(mapToDto(course));
        }
        return dtoList;
    }


    // 🔹 Common Mapper
    private CourseManagementDto mapToDto(CourseManagement course) {
        CourseManagementDto dto = new CourseManagementDto();
        dto.setCourseId(course.getCourseId());
        dto.setCourseName(course.getCourseName());
        dto.setSubjects(course.getSubjects());
        dto.setStatus(course.getStatus());
        return dto;
    }
}
