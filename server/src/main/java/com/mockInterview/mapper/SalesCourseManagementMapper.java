package com.mockInterview.mapper;

import com.mockInterview.entity.SalesCourseManagement;
import com.mockInterview.responseDtos.SalesCourseManagementResponseDto;
import com.mockInterview.requestDtos.SalesCourseManagementRequestDto;
import com.mockInterview.entity.CourseManagement;

import java.time.format.DateTimeFormatter;

public class SalesCourseManagementMapper {

    private static final DateTimeFormatter FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    // ================= TO ENTITY =================
    // NOTE: Source, Campaign, AssignedTo MUST be set in SERVICE layer
    public static SalesCourseManagement toEntity(
            SalesCourseManagementRequestDto dto,
            CourseManagement course) {

        SalesCourseManagement sc = new SalesCourseManagement();

        sc.setLeadName(dto.getLeadName());
        sc.setPhone(dto.getPhone());
        sc.setEmail(dto.getEmail());
        sc.setGender(dto.getGender());
        sc.setPassedOutYear(dto.getPassedOutYear());
        sc.setQualification(dto.getQualification());
        sc.setCourseManagement(course);
        sc.setCollege(dto.getCollege());
        sc.setCity(dto.getCity());
        sc.setStatus(dto.getStatus() != null ? dto.getStatus() : "NEW");

        // assignment / source / campaign handled in service
        return sc;
    }

    // ================= TO RESPONSE DTO =================
    public static SalesCourseManagementResponseDto toResponseDto(
            SalesCourseManagement sc) {

        SalesCourseManagementResponseDto dto =
                new SalesCourseManagementResponseDto();

        // ===== LEAD DETAILS =====
        dto.setLeadId(sc.getLeadId());
        dto.setLeadName(sc.getLeadName());
        dto.setPhone(sc.getPhone());
        dto.setEmail(sc.getEmail());
        dto.setGender(sc.getGender());
        dto.setPassedOutYear(sc.getPassedOutYear());
        dto.setQualification(sc.getQualification());

        // ===== RELATION NAMES =====
        dto.setCourseName(
                sc.getCourseManagement() != null
                        ? sc.getCourseManagement().getCourseName()
                        : null
        );

        dto.setSourceName(
                sc.getSource() != null
                        ? sc.getSource().getSourceName()
                        : null
        );

        dto.setCampaignName(
                sc.getCampaign() != null
                        ? sc.getCampaign().getCampaignName()
                        : null
        );

        // ===== STATUS & LOCATION =====
        dto.setStatus(sc.getStatus());
        dto.setCollege(sc.getCollege());
        dto.setCity(sc.getCity());

        // ===== ASSIGNMENT =====
        dto.setAssignedToName(
                sc.getAssignedTo() != null
                        ? sc.getAssignedTo().getFirstName() + " " +
                          sc.getAssignedTo().getLastName()
                        : null
        );

        dto.setAssignedAt(
                sc.getAssignedAt() != null
                        ? sc.getAssignedAt().format(FORMATTER)
                        : null
        );

        

        dto.setCreatedDate(
                sc.getCreatedDate() != null
                        ? sc.getCreatedDate().format(FORMATTER)
                        : null
        );

        dto.setUpdatedDate(
                sc.getUpdatedDate() != null
                        ? sc.getUpdatedDate().format(FORMATTER)
                        : null
        );

        return dto;
    }
}
