package com.mockInterview.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_generation_log")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIGenerationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ai_id")
    private Long aiId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private QuizQuestions question;  // optional, AI-generated question reference

    @NotBlank(message = "Prompt text is required")
    @Column(name = "prompt_text", columnDefinition = "TEXT")
    private String promptText;

    @Column(name = "ai_response", columnDefinition = "TEXT")
    private String aiResponse;

    @Column(name = "model_used", length = 200)
    private String modelUsed;

    @Column(name = "confidence_score")
    private Double confidenceScore;

    @Column(name = "status", length = 50)
    private String status; // GENERATED, REVIEWED, APPROVED

    @Builder.Default
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        // You can add updatedAt if required
    }
}
