package com.mockInterview.responseDtos;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizResponseDto {

    private Long id;

    // -------- BASIC INFO --------
    private String title;
    private String description;
    private Integer timeLimit;
    private Integer totalMarks;

    // -------- SUBJECT & SUBTOPIC --------
    private Long topicId;
    private String topicName;

    private Long subTopicId;
    private String subTopicName;

    // -------- QUIZ SETTINGS --------
    private String quizType;
    private Boolean showResults;

    // -------- SECURITY SETTINGS --------
    private Boolean enableTabSwitchRestriction;
    private Integer maxTabSwitchAttempts;
    private Boolean enableCamera;
    private Boolean enableRecording;

    // -------- PRIVATE QUIZ --------
    private List<String> restrictedEmails;

    // -------- AUDIT INFO --------
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long createdBy;
    private Long updatedBy;
}
