package com.mockInterview.responseDtos;

import lombok.Data;

@Data
public class SalesCourseManagementResponseDto {

    private Long leadId;

    private String leadName;

    private String phone;

    private String email;

    private String gender;

    private String passedOutYear;

    private String qualification;

    private Long courseId;

    private String status;

    private String college;

    private String city;

    private String source;

    private String campaign;

    
    private String assignedTo;
    
    private Long loggedInUserId;
}
