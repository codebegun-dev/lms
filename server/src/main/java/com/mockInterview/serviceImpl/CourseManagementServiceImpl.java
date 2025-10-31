package com.mockInterview.serviceImpl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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
    public CourseManagementDto createCourse(CourseManagementDto courseManagementDto) {
        CourseManagement course = new CourseManagement();
        course.setCourseName(courseManagementDto.getCourseName());
        course.setSubjects(courseManagementDto.getSubjects());

        CourseManagement savedCourse = courseRepository.save(course);

        CourseManagementDto response = new CourseManagementDto();
        response.setCourseId(savedCourse.getCourseId());
        response.setCourseName(savedCourse.getCourseName());
        response.setSubjects(savedCourse.getSubjects());
        return response;
    }

    // ✅ Get Course by ID
    @Override
    public CourseManagementDto getCourseById(Long courseId) {
        Optional<CourseManagement> optionalCourse = courseRepository.findById(courseId);
        if (!optionalCourse.isPresent()) {
            throw new ResourceNotFoundException("Course not found with ID: " + courseId);
        }

        CourseManagement course = optionalCourse.get();
        CourseManagementDto dto = new CourseManagementDto();
        dto.setCourseId(course.getCourseId());
        dto.setCourseName(course.getCourseName());
        dto.setSubjects(course.getSubjects());
        return dto;
    }

    // ✅ Get All Courses
    @Override
    public List<CourseManagementDto> getAllCourses() {
        List<CourseManagement> courses = courseRepository.findAll();
        List<CourseManagementDto> dtoList = new ArrayList<>();

        for (CourseManagement course : courses) {
            CourseManagementDto dto = new CourseManagementDto();
            dto.setCourseId(course.getCourseId());
            dto.setCourseName(course.getCourseName());
            dto.setSubjects(course.getSubjects());
            dtoList.add(dto);
        }

        return dtoList;
    }

    // ✅ Update Course
    @Override
    public CourseManagementDto updateCourse(Long courseId, CourseManagementDto courseDto) {
        Optional<CourseManagement> optionalCourse = courseRepository.findById(courseId);
        if (!optionalCourse.isPresent()) {
            throw new ResourceNotFoundException("Course not found with ID: " + courseId);
        }

        CourseManagement existingCourse = optionalCourse.get();
        existingCourse.setCourseName(courseDto.getCourseName());
        existingCourse.setSubjects(courseDto.getSubjects());

        CourseManagement updatedCourse = courseRepository.save(existingCourse);

        CourseManagementDto response = new CourseManagementDto();
        response.setCourseId(updatedCourse.getCourseId());
        response.setCourseName(updatedCourse.getCourseName());
        response.setSubjects(updatedCourse.getSubjects());
        return response;
    }

    // ✅ Delete Course
    @Override
    public void deleteCourse(Long courseId) {
        Optional<CourseManagement> optionalCourse = courseRepository.findById(courseId);
        if (!optionalCourse.isPresent()) {
            throw new ResourceNotFoundException("Course not found with ID: " + courseId);
        }

        courseRepository.deleteById(courseId);
    }
}
