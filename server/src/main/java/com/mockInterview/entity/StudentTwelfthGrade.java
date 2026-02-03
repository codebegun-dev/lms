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
    name = "student_twelfth_grade",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = "user_id")
    }
)
public class StudentTwelfthGrade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ✅ Board name (CBSE, State Board, etc.)
    @NotBlank(message = "Board name is required")
    private String board;

    // ✅ Group (e.g., Science, Commerce, etc.)
    @NotBlank(message = "Group name is required")
    private String groupName;

    // ✅ College / School name
    @NotBlank(message = "College name is required")
    private String collegeName;

    // ✅ Year of passout (e.g., 2021)
    @NotNull(message = "Year of passout is required")
    @Min(value = 1950, message = "Year of passout must be after 1950")
    private Integer yearOfPassout;

    // ✅ Marks percentage
    @NotNull(message = "Marks percentage is required")
    @DecimalMin(value = "0.0", message = "Marks percentage cannot be negative")
    @DecimalMax(value = "100.0", message = "Marks percentage cannot exceed 100")
    private Double marksPercentage;

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
