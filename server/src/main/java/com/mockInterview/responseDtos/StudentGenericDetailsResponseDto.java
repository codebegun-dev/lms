package com.mockInterview.responseDtos;

import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentGenericDetailsResponseDto {

    // ================= USER INFO =================
    private Long userId;
 

    // ================= CAREER INFO =================
    private String workExperience;
    private String careerGap;

    // ================= CURRENT ADDRESS =================
    private String currentState;
    private String currentDistrict;
    private String currentSubDistrict;
    private String currentVillage;
    private String currentStreet;
    private String currentPincode;

    // ================= PERMANENT ADDRESS =================
    private String permanentState;
    private String permanentDistrict;
    private String permanentSubDistrict;
    private String permanentVillage;
    private String permanentStreet;
    private String permanentPincode;

    // ================= SOCIAL LINKS =================
    private String githubProfile;
    private String linkedinProfile;

    // ================= DOCUMENT LINKS =================
    private String adhaarFilePath;
    private String resumeFilePath;

    // ================= AUDIT INFO =================
    private LocalDateTime updatedAt;
    private String updatedBy;
}
