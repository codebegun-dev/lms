package com.mockInterview.requestDtos;

import lombok.*;

import jakarta.validation.constraints.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizRequestDto {

    @NotBlank(message = "Quiz title is required")
    private String title;

    private String description;

    @NotNull(message = "Time limit is required")
    @Min(value = 1, message = "Time limit must be at least 1 minute")
    private Integer timeLimit;

    @NotNull(message = "Total marks is required")
    @Min(value = 1, message = "Total marks must be greater than 0")
    private Integer totalMarks;

    // -------- SUBJECT & SUBTOPIC --------
    @NotNull(message = "Topic is required")
    private Long topicId;

    private Long subTopicId;

    // -------- QUIZ SETTINGS --------
    @NotBlank(message = "Quiz type is required")
    private String quizType; // PUBLIC / PRIVATE

    private Boolean showResults;

    // -------- SECURITY SETTINGS --------
    private Boolean enableTabSwitchRestriction;

    private Integer maxTabSwitchAttempts;

    private Boolean enableCamera;

    private Boolean enableRecording;

    // -------- PRIVATE QUIZ --------
    private List<String> restrictedEmails;
}
