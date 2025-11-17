package com.mockInterview.service;

import java.util.List;

import com.mockInterview.requestDtos.SalesCourseManagementRequestDto;
import com.mockInterview.responseDtos.SalesCourseManagementResponseDto;

public interface SalesCourseService {

    
    SalesCourseManagementResponseDto createStudent(SalesCourseManagementRequestDto dto);

    
    SalesCourseManagementResponseDto getStudentsById(Long id);

    
    List<SalesCourseManagementResponseDto> getAllStudents();

    
    SalesCourseManagementResponseDto updateStudentDetails(Long id, SalesCourseManagementRequestDto dto);

   
    void deleteStudent(Long id);
    
    List<SalesCourseManagementResponseDto> getStudentsByStatus(String status);

}
