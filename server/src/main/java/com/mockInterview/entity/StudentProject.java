package com.mockInterview.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import lombok.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class) 
@Table(
    name = "student_projects"
)
public class StudentProject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ================= PROJECT DETAILS =================

    @NotBlank(message = "Project title is required")
    @Column(nullable = false)
    private String projectTitle;

    @NotBlank(message = "Used technologies are required")
    @Column(nullable = false)
    private String usedTechnologies;

    @NotBlank(message = "Role is required")
    @Column(nullable = false)
    private String role;

    @NotBlank(message = "Description is required")
    @Column(nullable = false, length = 2000)
    private String description;

    // ================= USER RELATION =================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "user_id",
        referencedColumnName = "userId",
        nullable = false,
        updatable = false
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
