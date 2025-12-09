package com.mockInterview.requestDtos;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionRequestDto {

    private Long questionId;

    @NotNull(message = "Quiz ID is required")
    private Long quizId;  // To link question to a quiz

    @NotBlank(message = "Question text cannot be blank")
    private String questionText;

    @NotBlank(message = "Question type is required")
    private String questionType;

    @NotBlank(message = "Difficulty is required")
    private String difficulty;

    @NotBlank(message = "Topic is required")
    private String topic;

    private String explanation;

    @NotNull(message = "Max marks is required")
    @Positive(message = "Max marks must be positive")
    private Double maxMarks;

    // Required only for create
    private Long createdBy;

    // Required only for update
    private Long updatedBy;
}
