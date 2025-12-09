package com.mockInterview.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "quiz")
@Getter
@Setter
@NoArgsConstructor  
@AllArgsConstructor
@Builder
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "quiz_id")
    private Long quizId;

    @NotBlank(message = "Quiz title cannot be blank")
    @Size(min = 3, max = 255, message = "Title must be between 3 and 255 characters")
    private String title;

    @NotBlank(message = "Description cannot be blank")
    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull(message = "Time limit is required")
    @Positive(message = "Time limit must be positive")
    @Column(name = "time_limit_min")
    private Integer timeLimitMin;

    @NotNull(message = "Total marks is required")
    @Positive(message = "Total marks must be positive")
    @Column(name = "total_marks")
    private Double totalMarks;

    @Builder.Default
    @Column(name = "is_published")
    private Boolean isPublished = false;

    // ----------------------- Audit Fields -----------------------

    @Builder.Default
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @NotNull(message = "CreatedBy is required")
    @Column(name = "created_by")
    private Long createdBy;

    @Column(name = "updated_by")
    private Long updatedBy;

    // Auto-update updatedAt before saving
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
