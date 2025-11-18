package com.mockInterview.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "student_generic_details")
public class StudentGenericDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String workExperience;
    private String careerGap;

    // Current Address
    private String currentState;
    private String currentDistrict;
    private String currentSubDistrict;
    private String currentVillage;
    private String currentStreet;

    @Pattern(regexp = "^[0-9]{6}$", message = "Current pincode must be 6 digits")
    private String currentPincode;

    // Permanent Address
    private String permanentState;
    private String permanentDistrict;
    private String permanentSubDistrict;
    private String permanentVillage;
    private String permanentStreet;

    @Pattern(regexp = "^[0-9]{6}$", message = "Permanent pincode must be 6 digits")
    private String permanentPincode;

    private String githubProfile;
    private String linkedinProfile;

    
    private String adhaarFilePath;
    private String resumeFilePath;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "userId", nullable = false)
    private User user;
}
