package com.mockInterview.service;

import com.mockInterview.responseDtos.StudentCourseDetailsDto;

public interface StudentCourseDetailsService {

    StudentCourseDetailsDto getByUserId(Long userId);

    StudentCourseDetailsDto updateCourseDetails(StudentCourseDetailsDto dto);
}
