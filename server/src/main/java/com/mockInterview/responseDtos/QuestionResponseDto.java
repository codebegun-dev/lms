package com.mockInterview.responseDtos;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionResponseDto {

    private Long questionId;
    private Long quizId;
    private String questionText;
    private String questionType;
    private String difficulty;
    private String topic;
    private String explanation;
    private Double maxMarks;
    private Integer version;
    private Long createdBy;
    private Long updatedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
