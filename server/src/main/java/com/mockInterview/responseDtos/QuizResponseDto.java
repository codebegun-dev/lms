package com.mockInterview.responseDtos;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
public class QuizResponseDto {

    private Long id;
    private String title;
    private String description;
    private String difficulty;
    private String duration;
    private Integer marks;
    private Boolean negativeMarking;
    private String questionType;
    private List<Map<String, Object>> questions; // return as array
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
