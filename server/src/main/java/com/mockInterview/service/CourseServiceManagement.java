package com.mockInterview.service;

import java.util.List;

import com.mockInterview.responseDtos.CourseManagementDto;

public interface CourseServiceManagement {
	CourseManagementDto createCourse(CourseManagementDto  courseDto);

	CourseManagementDto  getCourseById(Long courseId);

    List<CourseManagementDto > getAllCourses();

    CourseManagementDto  updateCourse(Long courseId, CourseManagementDto  courseDto);

    CourseManagementDto changeCourseStatus(Long courseId, boolean active);
}
