package com.mockInterview.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.time.LocalDateTime;

import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(
    name = "student_generic_details",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = "user_id")
    }
)
public class StudentGenericDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "student_generic_details_id")
    private Long studentGenericDetailsId;

    // ================= CAREER INFO =================

    @Column(length = 50)
    private String workExperience;

    @Column(length = 50)
    private String careerGap;

    // ================= CURRENT ADDRESS =================

    @Column(length = 50)
    private String currentState;

    @Column(length = 50)
    private String currentDistrict;

    @Column(length = 50)
    private String currentSubDistrict;

    @Column(length = 50)
    private String currentVillage;

    @Column(length = 100)
    private String currentStreet;

    @Pattern(regexp = "^[0-9]{6}$", message = "Current pincode must be 6 digits")
    @Column(length = 6)
    private String currentPincode;

    // ================= PERMANENT ADDRESS =================

    @Column(length = 50)
    private String permanentState;

    @Column(length = 50)
    private String permanentDistrict;

    @Column(length = 50)
    private String permanentSubDistrict;

    @Column(length = 50)
    private String permanentVillage;

    @Column(length = 100)
    private String permanentStreet;

    @Pattern(regexp = "^[0-9]{6}$", message = "Permanent pincode must be 6 digits")
    @Column(length = 6)
    private String permanentPincode;

    // ================= SOCIAL LINKS =================

    @Column(length = 255)
    private String githubProfile;

    @Column(length = 255)
    private String linkedinProfile;

    // ================= DOCUMENT PATHS =================

    @Column(name = "adhaar_file_path")
    private String adhaarFilePath;

    @Column(name = "resume_file_path")
    private String resumeFilePath;

    // ================= USER MAPPING =================

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "user_id",
        referencedColumnName = "userId",
        nullable = false,
        unique = true
    )
    private User user;

    // ================= AUDIT FIELDS =================

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @LastModifiedBy
    @Column(name = "updated_by")
    private Long updatedBy;
}
