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

    // ===== RELATION NAMES (UI FRIENDLY) =====
    private String courseName;
    private String sourceName;
    private String campaignName;

    // ===== STATUS & LOCATION =====
    private String status;
    private String college;
    private String city;

    // ===== ASSIGNMENT =====
    private String assignedToName;
    private String assignedAt;

    // ===== AUDIT =====
    private String createdByName;
    private String updatedByName;
    private String createdDate;
    private String updatedDate;
}
