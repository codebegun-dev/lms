package com.mockInterview.responseDtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionBankResponseDto {
    private Long id;
    private String category;
    private String difficulty;
    private String title;
    private String topic;
    private String createdBy;
    private LocalDate createdDate;
}
