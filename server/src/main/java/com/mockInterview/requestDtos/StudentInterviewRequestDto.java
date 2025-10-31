package com.mockInterview.requestDtos;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StudentInterviewRequestDto {

    @NotNull(message = "studentId is required")
    private Long studentId;

    @NotNull(message = "categoryId is required")
    private Long categoryId;  // ✅ replaced roundType with categoryId
}
