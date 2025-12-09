package com.mockInterview.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "question_options")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "option_id")
    private Long optionId;

    @NotBlank(message = "Option text cannot be empty")
    @Column(name = "option_text", columnDefinition = "TEXT")
    private String optionText;

    @NotNull(message = "Correct flag is required")
    @Column(name = "is_correct")
    private Boolean isCorrect;

    // ------------------ Relation with QuizQuestions ------------------

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private QuizQuestions question;
}
