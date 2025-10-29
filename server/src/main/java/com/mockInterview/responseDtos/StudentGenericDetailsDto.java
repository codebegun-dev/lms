package com.mockInterview.responseDtos;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentGenericDetailsDto {
    private Long userId;
    private String firstName;
    private String lastName;
    private String mobileNumber;

    private String workExperience;
    private String careerGap;

    private String currentState;
    private String currentDistrict;
    private String currentSubDistrict;
    private String currentVillage;
    private String currentStreet;
    private String currentPincode;

    private String permanentState;
    private String permanentDistrict;
    private String permanentSubDistrict;
    private String permanentVillage;
    private String permanentStreet;
    private String permanentPincode;

    private String githubProfile;
    private String linkedinProfile;

    private String adhaarFilePath;
    private String resumeFilePath;
}
