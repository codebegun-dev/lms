package com.mockInterview.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
public class AdminPersonalInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    @NotNull(message = "User reference is required")
    private User user;

    @NotNull(message = "Gender is required")
    @Pattern(
        regexp = "^(Male|Female|Other)$",
        message = "Gender must be either Male, Female, or Other"
    )
    private String gender;

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    @Pattern(
        regexp = "^(A|B|AB|O)[+-]$",
        message = "Blood group must be A+, A-, B+, B-, AB+, AB-, O+, or O-"
    )
    private String bloodGroup;

    @NotBlank(message = "Job title is required")
    @Size(min = 2, max = 50, message = "Job title must be between 2 and 50 characters")
    private String jobtitle;

    @Size(max = 255, message = "Profile picture path cannot exceed 255 characters")
    private String profilePicturePath;
}
