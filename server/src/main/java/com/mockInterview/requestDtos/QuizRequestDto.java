package com.mockInterview.requestDtos;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;

@Data
public class QuizRequestDto {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    private String difficulty;

    private String duration;

    @NotNull(message = "Marks are required")
    private Integer marks;

    @NotNull(message = "Negative marking flag is required")
    private Boolean negativeMarking; 

    @NotBlank(message = "Question type is required")
    private String questionType; // single, multiple, manual, coding

    @NotNull(message = "Questions are required")
    private List<Map<String, Object>> questions; // Accept array of question objects
}
