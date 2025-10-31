package com.mockInterview.responseDtos;

import com.mockInterview.entity.InterviewStatus;
import lombok.Data;
import java.time.LocalDateTime;


@Data
public class StudentInterviewResponseDto {

    private Long interviewId;
    private Long studentId;

    private String categoryName; // ✅ replaced InterviewRound with Category name

    private InterviewStatus status;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Long durationSeconds;
    
//   private List<QuestionBankResponseDto> questions;

}
