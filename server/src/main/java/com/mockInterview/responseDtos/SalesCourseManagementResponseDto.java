package com.mockInterview.responseDtos;

import lombok.Data;

@Data
public class SalesCourseManagementResponseDto {

    // ===== LEAD DETAILS =====
    private Long leadId;
    private String leadName;
    private String phone;
    private String email;
    private String gender;
    private String passedOutYear;
    private String qualification;

    // ===== RELATION IDS ONLY =====
    private Long courseId;
    private Long sourceId;
    private Long campaignId;

    // ===== STATUS & LOCATION =====
    private String status;
    private String college;
    private String city;

    // ===== ASSIGNMENT =====
    private Long assignedTo;
    private String assignedAt;

    // ===== AUDIT =====
    private Long createdBy;
    private Long updatedBy;
    private String createdDate;
    private String updatedDate;
}
