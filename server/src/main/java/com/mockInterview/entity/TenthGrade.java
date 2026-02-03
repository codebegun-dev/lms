package com.mockInterview.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table(
    name = "student_tenth_grade",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = "user_id")
    }
)
public class TenthGrade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ✅ Board (CBSE, SSC, ICSE, etc.)
    @NotBlank(message = "Board is required")
    @Column(nullable = false)
    private String board;

    // ✅ School name
    @NotBlank(message = "School name is required")
    @Column(name = "school_name", nullable = false)
    private String schoolName;

    // ✅ Year of passout
    @NotNull(message = "Year of passout is required")
    @Min(value = 1950, message = "Year of passout must be after 1950")
    @Max(value = 2030, message = "Year of passout must be before 2030")
    @Column(name = "year_of_passout", nullable = false)
    private Integer yearOfPassout;

    // ✅ Marks percentage
    @NotNull(message = "Marks percentage is required")
    @DecimalMin(value = "0.0", message = "Marks percentage cannot be negative")
    @DecimalMax(value = "100.0", message = "Marks percentage cannot exceed 100")
    @Column(name = "marks_percentage", nullable = false)
    private Double marksPercentage;

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
