package com.mockInterview.mapper;

import com.mockInterview.entity.CourseManagement;
import com.mockInterview.entity.SalesCourseManagement;
import com.mockInterview.requestDtos.SalesCourseManagementRequestDto;
import com.mockInterview.responseDtos.SalesCourseManagementResponseDto;

public class SalesCourseManagementMapper {

    // Convert Request DTO → Entity
    public static SalesCourseManagement toEntity(SalesCourseManagementRequestDto dto, CourseManagement course) {
        SalesCourseManagement sc = new SalesCourseManagement();

        sc.setStudentName(dto.getStudentName());
        sc.setPhone(dto.getPhone());
        sc.setEmail(dto.getEmail());
        sc.setGender(dto.getGender());
        sc.setPassedOutYear(dto.getPassedOutYear());
        sc.setQualification(dto.getQualification());
        sc.setCourseManagement(course);
       

        
        return sc;
    }

    // Convert Entity → Response DTO
    public static SalesCourseManagementResponseDto toResponseDto(SalesCourseManagement sc) {
        SalesCourseManagementResponseDto dto = new SalesCourseManagementResponseDto();

        dto.setStudentId(sc.getStudentId());
        dto.setStudentName(sc.getStudentName());
        dto.setPhone(sc.getPhone());
        dto.setEmail(sc.getEmail());
        dto.setGender(sc.getGender());
        dto.setPassedOutYear(sc.getPassedOutYear());
        dto.setQualification(sc.getQualification());

        if (sc.getCourseManagement() != null) {
            dto.setCourseId(sc.getCourseManagement().getCourseId());
        }

        dto.setStatus(sc.getStatus()); 

        return dto;
    }
}
