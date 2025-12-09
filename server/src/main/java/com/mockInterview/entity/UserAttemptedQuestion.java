package com.mockInterview.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_attempted_questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAttemptedQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attempt_question_id")
    private Long attemptQuestionId;

    // ---------- Relations ----------

    @NotNull(message = "Attempt ID is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attempt_id", nullable = false)
    private QuizAttempt quizAttempt;

    @NotNull(message = "Question ID is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private QuizQuestions question;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "selected_option_id")
    private QuestionOption selectedOption;

    // ---------- Answer Data ----------

    @Column(name = "is_correct")
    private Boolean isCorrect;

    @PositiveOrZero(message = "Marks awarded cannot be negative")
    @Column(name = "marks_awarded")
    private Double marksAwarded;

    @Column(name = "user_answer_text", columnDefinition = "TEXT")
    private String userAnswerText; // Only for descriptive / short answers

    // ---------- Audit Fields ----------

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
}
