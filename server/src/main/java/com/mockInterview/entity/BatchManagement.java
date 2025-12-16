package com.mockInterview.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "batches")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class BatchManagement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Batch name is required")
    @Column(nullable = false, unique = true)
    private String name;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private CourseManagement course;

    @Min(value = 1, message = "Batch size must be at least 1")
    private Integer size;

    @NotNull(message = "Start date is required")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate endDate;

    @NotNull(message = "Start time is required")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    private LocalTime endTime;

    @PositiveOrZero(message = "Total fee must be zero or positive")
    private Double totalFee;

    private String overallCTC = "0%";

    @PositiveOrZero(message = "Single installment must be zero or positive")
    private Double singleInstallment;

    private String ctcSingle;

    @PositiveOrZero(message = "First installment must be zero or positive")
    private Double firstInstallment;

    @PositiveOrZero(message = "Second installment must be zero or positive")
    private Double secondInstallment;

    private String ctcDual;

    // 🔹 Lifecycle status (DO NOT TOUCH)
    private String status; // PENDING, ACTIVE, COMPLETED

    // 🔹 Soft delete / enable-disable flag
    @Column(nullable = false)
    private Boolean enable;

    // ✅ Default value (enabled)
    @PrePersist
    public void setDefaultEnable() {
        if (this.enable == null) {
            this.enable = true;
        }
    }

    // ================= AUDIT FIELDS =================

    @CreatedBy
    @Column(updatable = false)
    private Long createdBy;

    @LastModifiedBy
    private Long updatedBy;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdDateTime;

    @LastModifiedDate
    private LocalDateTime updatedDateTime;
}
