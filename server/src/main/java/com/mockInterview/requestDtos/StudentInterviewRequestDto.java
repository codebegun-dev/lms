package com.mockInterview.requestDtos;

import com.mockInterview.entity.InterviewRound;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StudentInterviewRequestDto {
    @NotNull(message = "studentId is required")
    private Long studentId;

    @NotNull(message = "roundType is required")
    private InterviewRound roundType;
}
