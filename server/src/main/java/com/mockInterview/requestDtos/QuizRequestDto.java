package com.mockInterview.requestDtos;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizRequestDto {

    private Long quizId;

    @NotBlank(message = "Quiz title cannot be blank")
    @Size(min = 3, max = 255, message = "Title must be between 3 and 255 characters")
    private String title;

    @NotBlank(message = "Description cannot be blank")
    private String description;

    @NotNull(message = "Time limit is required")
    @Positive(message = "Time limit must be positive")
    private Integer timeLimitMin;

    @NotNull(message = "Total marks is required")
    @Positive(message = "Total marks must be positive")
    private Double totalMarks;

    @Builder.Default
    private Boolean isPublished = false;

    // Required only for create
    private Long createdBy;

    // Required only for update
    private Long updatedBy;
}
