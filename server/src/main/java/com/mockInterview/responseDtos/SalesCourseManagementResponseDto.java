package com.mockInterview.responseDtos;

import lombok.Data;

@Data
public class SalesCourseManagementResponseDto {

    private Long studentId;

    private String studentName;

    private String phone;

    private String email;

    private String gender;

    private String passedOutYear;

    private String qualification;

    private Long courseId;

    private String status;
}
