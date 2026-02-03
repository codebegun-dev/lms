package com.mockInterview.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
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
    name = "student_pg_details",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = "user_id")
    }
)
public class StudentPGDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "student_pg_details_id")
    private Long studentPGDetailsId;

    @Column(nullable = false)
    private String hasPG;

    

    @Column(length = 100)
    private String collegeName;

    @Column(length = 50)
    private String courseName;

    @Column(length = 50)
    private String branch;

    @DecimalMin(value = "0.0", message = "Marks must be >= 0")
    @DecimalMax(value = "100.0", message = "Marks must be <= 100")
    @Column(name = "marks_percentage")
    private Double marksPercentage;

    @DecimalMin(value = "0.0", message = "CGPA must be >= 0")
    @DecimalMax(value = "10.0", message = "CGPA must be <= 10")
    @Column(name = "cgpa")
    private Double cgpa;

    @Min(value = 1950, message = "Year cannot be before 1950")
    @Max(value = 2030, message = "Year cannot be after 2030")
    @Column(name = "year_of_passout")
    private Integer yearOfPassout;

    @Column(name = "active_backlogs")
    private String activeBacklogs;

    // ================= USER MAPPING =================
    @OneToOne(fetch = FetchType.LAZY)
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
