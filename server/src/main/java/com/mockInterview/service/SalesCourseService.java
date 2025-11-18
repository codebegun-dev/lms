package com.mockInterview.service;

import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import com.mockInterview.requestDtos.SalesCourseManagementRequestDto;
import com.mockInterview.responseDtos.SalesCourseManagementResponseDto;

public interface SalesCourseService {

    
    SalesCourseManagementResponseDto createStudent(SalesCourseManagementRequestDto dto);
    public Map<String, Object> uploadStudentsFromExcel(MultipartFile file);

    
    SalesCourseManagementResponseDto getStudentsById(Long id);

    
    List<SalesCourseManagementResponseDto> getAllStudents();

    
    SalesCourseManagementResponseDto updateStudentDetails(Long id, SalesCourseManagementRequestDto dto);

   
    void deleteStudent(Long id);
    
    public Map<String, Object> getStudentsWithPagination(int page, int size);

    
    List<SalesCourseManagementResponseDto> getStudentsByStatus(String status);

}
