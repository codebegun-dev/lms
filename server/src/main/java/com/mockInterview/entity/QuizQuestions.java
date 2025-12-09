package com.mockInterview.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "quiz_questions")   // updated table name if needed
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizQuestions {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "question_id")
    private Long questionId;

    @NotBlank(message = "Question text cannot be empty")
    @Column(name = "question_text", columnDefinition = "TEXT")
    private String questionText;

    @NotBlank(message = "Question type is required")
    @Column(name = "question_type", length = 50)
    private String questionType;

    @NotBlank(message = "Difficulty is required")
    @Column(name = "difficulty", length = 20)
    private String difficulty;

    @NotBlank(message = "Topic is required")
    @Column(name = "topic", length = 255)
    private String topic;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @NotNull(message = "Max marks is required")
    @Positive(message = "Marks must be positive")
    @Column(name = "max_marks")
    private Double maxMarks;

    @Builder.Default
    private Integer version = 1;

    // ------------------ Relations ------------------

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuestionOption> options;

    // ------------------ Audit Fields ------------------

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

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

}
